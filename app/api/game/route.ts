import { z } from 'zod';
import { database } from '@/lib/storage';
import { card,dailyBoard,originalBoard,isSet,puzzleDay,advanceRound,alreadyFound,setKey,type Card,type GameMode } from '@/lib/set';
export const dynamic='force-dynamic';
const codeSchema=z.string().regex(/^[A-Z2-9]{6}$/);
const triple=z.tuple([z.number().int().min(0).max(80),z.number().int().min(0).max(80),z.number().int().min(0).max(80)]);
const bodySchema=z.discriminatedUnion('action',[
 z.object({action:z.literal('create'),name:z.string().trim().min(1).max(70),classes:z.array(z.string().trim().min(1).max(40)).min(1).max(20)}),
 z.object({action:z.literal('start'),code:codeSchema,className:z.string().min(1).max(40),target:z.union([z.literal(3),z.literal(6)]),gameMode:z.enum(['original','refill']).default('refill'),puzzle:z.number().int().min(0).max(1000).default(0)}),
 z.object({action:z.literal('claim'),id:z.string().uuid(),step:z.number().int().min(0).max(5),ids:triple,token:z.string().uuid().optional()}),
 z.object({action:z.literal('refresh'),id:z.string().uuid(),requestId:z.string().uuid(),token:z.string().uuid().optional()}),
 z.object({action:z.literal('end'),id:z.string().uuid(),token:z.string().uuid().optional()})
]);
const response=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
type State={puzzle?:number;board:Card[];sets:number[][];positions?:number[][];refreshIds?:string[];writeToken?:string};
type Attempt={id:string;day:string;target:number;game_mode:GameMode;answers:string|null;started_at:number;state:string|null;elapsed_ms:number|null;finished_at:number|null;ended_at:number|null};
function result(attempt:Attempt,state:State){return {gameMode:attempt.game_mode,puzzle:state.puzzle||0,board:state.board,sets:state.sets,positions:state.positions||[],step:state.sets.length,refreshes:state.refreshIds?.length||0,elapsedMs:attempt.elapsed_ms,finishedAt:attempt.finished_at,saved:attempt.elapsed_ms!==null};}
async function roomData(code:string){
 const today=puzzleDay(),db=database(),room=await db.prepare('SELECT code,name,classes FROM rooms WHERE code=?').bind(code).first<{code:string;name:string;classes:string}>();
 if(!room)return null;
 // Return the records needed for daily and all-time standings without truncating old winners.
 const scores=await db.prepare(`WITH ranked AS (
  SELECT id,class_name AS className,day,target,game_mode AS gameMode,COALESCE(json_extract(state,'$.puzzle'),0) AS puzzle,elapsed_ms AS elapsedMs,finished_at AS finishedAt,
   ROW_NUMBER() OVER(PARTITION BY class_name,target,game_mode ORDER BY elapsed_ms,finished_at,id) AS all_rank,
   ROW_NUMBER() OVER(PARTITION BY class_name,target,game_mode,day ORDER BY elapsed_ms,finished_at,id) AS day_rank
  FROM attempts WHERE room_code=? AND elapsed_ms IS NOT NULL
 ) SELECT id,className,day,target,gameMode,puzzle,elapsedMs,finishedAt FROM ranked WHERE all_rank=1 OR(day=? AND day_rank=1)`).bind(code,today).all();
 return {...room,day:today,classes:JSON.parse(room.classes),scores:scores.results};
}
export async function GET(request:Request){try{
 const url=new URL(request.url),raw=url.searchParams.get('room');if(!raw)return response({day:puzzleDay()});
 const parsed=codeSchema.safeParse(raw);if(!parsed.success)return response({error:'Enter a valid six-character room code.'},400);
 const code=parsed.data;
 if(url.searchParams.get('view')==='history'){
  const db=database();if(!await db.prepare('SELECT code FROM rooms WHERE code=?').bind(code).first())return response({error:'That room was not found.'},404);
  const cursorRaw=url.searchParams.get('cursor');let cursor:{time:number;id:string}|null=null;
  if(cursorRaw){try{const parsed=z.object({time:z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),id:z.string().uuid()}).safeParse(JSON.parse(cursorRaw));if(!parsed.success)throw new Error();cursor=parsed.data;}catch{return response({error:'Invalid history page. Reload the history.'},400);}}
  const statement=cursor?db.prepare('SELECT * FROM attempts WHERE room_code=? AND (started_at<? OR(started_at=? AND id<?)) ORDER BY started_at DESC,id DESC LIMIT 51').bind(code,cursor.time,cursor.time,cursor.id):db.prepare('SELECT * FROM attempts WHERE room_code=? ORDER BY started_at DESC,id DESC LIMIT 51').bind(code);
  const rows=(await statement.all<Attempt&{class_name:string}>()).results,visible=rows.slice(0,50),last=visible.at(-1);
  const rounds=visible.map(a=>({id:a.id,className:a.class_name,day:a.day,target:a.target,gameMode:a.game_mode,puzzle:a.state?(JSON.parse(a.state) as State).puzzle||0:0,startedAt:a.started_at,finishedAt:a.finished_at,endedAt:a.ended_at,elapsedMs:a.elapsed_ms,found:a.state?(JSON.parse(a.state) as State).sets.length:JSON.parse(a.answers||'[]').length}));
  const count=await db.prepare('SELECT COUNT(*) AS total FROM attempts WHERE room_code=?').bind(code).first<{total:number}>();
  return response({rounds,total:count?.total||0,nextCursor:rows.length>50&&last?JSON.stringify({time:last.started_at,id:last.id}):null});
 }
 const puzzle=z.coerce.number().int().min(0).max(1000).safeParse(url.searchParams.get('puzzle')||0);if(!puzzle.success)return response({error:'Choose a valid puzzle number.'},400);
 const room=await roomData(code);return room?response(room):response({error:'That room was not found. Check the code.'},404);
}catch(error){console.error('SET load',error);return response({error:'The room is unavailable. Please try again.'},503);}}
export async function POST(request:Request){try{
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return response({error:'Use the game page to submit results.'},403);
 if(Number(request.headers.get('content-length')||0)>10000)return response({error:'Request too large.'},413);
 let body:unknown;try{body=await request.json();}catch{return response({error:'Send a valid game request.'},400);}
 const parsed=bodySchema.safeParse(body);if(!parsed.success)return response({error:'Check the room details, class, and round before trying again.'},400);
 const input=parsed.data,db=database();
 if(input.action==='create'){
  const name=input.name,classes=[...new Set(input.classes)],alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for(let retry=0;retry<5;retry++){const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),n=>alphabet[n%alphabet.length]).join('');const inserted=await db.prepare('INSERT OR IGNORE INTO rooms(code,name,classes,created_at) VALUES(?,?,?,?)').bind(code,name,JSON.stringify(classes),Date.now()).run();if(inserted.meta.changes)return response({code,name,classes,scores:[]});}
  return response({error:'Could not create the room. Try again.'},503);
 }
 if(input.action==='start'){
  if(input.gameMode==='refill'&&input.puzzle!==0)return response({error:'Refill rounds use the daily starting board.'},400);
  if(input.gameMode==='original'&&input.target!==6)return response({error:'Original rounds require all six sets.'},400);
  const room=await db.prepare('SELECT classes FROM rooms WHERE code=?').bind(input.code).first<{classes:string}>();
  if(!room||!JSON.parse(room.classes).includes(input.className))return response({error:'Select one of this room’s classes.'},400);
  const id=crypto.randomUUID(),day=puzzleDay(),startedAt=Date.now(),board=input.gameMode==='original'?originalBoard(day,input.puzzle):dailyBoard(day),token=crypto.randomUUID(),state=JSON.stringify({board,sets:[],puzzle:input.puzzle,writeToken:token});
  await db.prepare('INSERT INTO attempts(id,room_code,class_name,day,target,game_mode,started_at,state) VALUES(?,?,?,?,?,?,?,?)').bind(id,input.code,input.className,day,input.target,input.gameMode,startedAt,state).run();
  return response({id,board,day,gameMode:input.gameMode,puzzle:input.puzzle,startedAt,step:0,refreshes:0,token});
 }
 const attempt=await db.prepare('SELECT * FROM attempts WHERE id=?').bind(input.id).first<Attempt>();
 if(!attempt||!attempt.state)return response({error:'This round is no longer available. Start a new round.'},404);
 const state:State=JSON.parse(attempt.state),current=state.sets.length;
 if(state.writeToken&&input.token!==state.writeToken)return response({error:'Only the screen that started this round can change it.'},403);
 if(input.action==='end'){
  await db.prepare('UPDATE attempts SET ended_at=? WHERE id=? AND ended_at IS NULL AND elapsed_ms IS NULL').bind(Date.now(),attempt.id).run();
  return response({ended:true});
 }
 if(attempt.ended_at!==null)return response({error:'This round has ended. Start another round.'},400);
 if(input.action==='refresh'){
  if(attempt.game_mode==='original')return response({error:'Original rounds keep the same board. Find all six sets, or end this round to start again.'},400);
  if(attempt.elapsed_ms!==null)return response({error:'This round is complete. Start another round to play again.'},400);
  if(Date.now()-attempt.started_at>86400000)return response({error:'This round has expired. Start another round.'},400);
  const refreshIds=state.refreshIds||[];
  if(refreshIds.includes(input.requestId))return response(result(attempt,state));
  if(refreshIds.length>=5)return response({error:'All five refreshes used. A valid set is still on this board.'},400);
  const board=dailyBoard(`${attempt.day}:refresh:${refreshIds.length+1}:${state.board.map(c=>c.id).join(',')}`),next={...state,board,refreshIds:[...refreshIds,input.requestId]};
  const updated=await db.prepare('UPDATE attempts SET state=? WHERE id=? AND state=? AND elapsed_ms IS NULL AND ended_at IS NULL').bind(JSON.stringify(next),attempt.id,attempt.state).run();
  if(!updated.meta.changes)return response({error:'The board just changed. Retry once to sync it.'},409);
  return response(result(attempt,next));
 }
 if(input.step<current){if(setKey(state.sets[input.step])!==setKey(input.ids))return response({error:'That board has already changed. Retry the current match.'},409);return response(result(attempt,state));}
 if(input.step!==current||attempt.elapsed_ms!==null)return response({error:'The board changed. Retry the current match.'},409);
 if(Date.now()-attempt.started_at>86400000)return response({error:'This round has expired. Start a new round.'},400);
 if(!input.ids.every(id=>state.board.some(c=>c.id===id))||!isSet(input.ids.map(card)))return response({error:'Choose three different cards that form a set on the current board.'},400);
 if(attempt.game_mode==='original'&&alreadyFound(state.sets,input.ids))return response({error:'You already found that set. Find a different combination.'},400);
 const {sets,complete,board}=advanceRound(state.board,state.sets,input.ids,attempt.game_mode,attempt.target,`${attempt.day}:${current}`),nextState=JSON.stringify({...state,board,sets,positions:[...(state.positions||[]),input.ids.map(id=>state.board.findIndex(c=>c.id===id)+1).sort((a,b)=>a-b)]}),finishedAt=complete?Date.now():null,elapsedMs=finishedAt===null?null:finishedAt-attempt.started_at;
 const updated=await db.prepare('UPDATE attempts SET state=?,finished_at=?,elapsed_ms=?,answers=? WHERE id=? AND state=? AND elapsed_ms IS NULL AND ended_at IS NULL').bind(nextState,finishedAt,elapsedMs,JSON.stringify(sets),attempt.id,attempt.state).run();
 if(!updated.meta.changes)return response({error:'A match was just saved. Retry once to sync your board.'},409);
 return response(result({...attempt,state:nextState,elapsed_ms:elapsedMs,finished_at:finishedAt},JSON.parse(nextState)));
}catch(error){console.error('SET write',error);return response({error:'Could not save this change. Please retry.'},503);}}
