import { z } from 'zod';
import { getAuth } from '@/lib/auth';
import { headers } from 'next/headers';
async function currentUser(){return (await getAuth().api.getSession({headers:await headers()}))?.user||null;}
import { database } from '@/lib/storage';
export const dynamic='force-dynamic';
const response=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
const schema=z.object({action:z.enum(['save','remove']),code:z.string().regex(/^[A-Z2-9]{6}$/)});
export async function GET(){try{
 const user=await currentUser();if(!user)return response({error:'Sign in to save rooms to your account.'},401);
 const data=await database().prepare('SELECT r.code,r.name,r.classes,s.saved_at AS savedAt,(SELECT COUNT(*) FROM attempts a WHERE a.room_code=r.code) AS rounds FROM saved_rooms s JOIN rooms r ON r.code=s.room_code WHERE s.user_id=? ORDER BY s.saved_at DESC,r.code').bind(user.id).all<{code:string;name:string;classes:string;savedAt:number;rounds:number}>();
 return response({account:{name:user.name},rooms:data.results.map(r=>({...r,classes:JSON.parse(r.classes)}))});
}catch(error){console.error('SET saved rooms load',error);return response({error:'Your saved rooms could not load. Please retry.'},503);}}
export async function POST(request:Request){try{
 const origin=request.headers.get('Origin');if(origin&&origin!==new URL(request.url).origin)return response({error:'Use the game page to save a room.'},403);
 const user=await currentUser();if(!user)return response({error:'Sign in to save rooms to your account.'},401);
 if(Number(request.headers.get('content-length')||0)>2000)return response({error:'Request too large.'},413);
 let body:unknown;try{body=await request.json();}catch{return response({error:'Invalid room request.'},400);}
 const input=schema.safeParse(body);if(!input.success)return response({error:'Enter a valid room code.'},400);
 const db=database(),{code,action}=input.data;
 if(action==='remove'){await db.prepare('DELETE FROM saved_rooms WHERE user_id=? AND room_code=?').bind(user.id,code).run();return response({saved:false});}
 if(!await db.prepare('SELECT code FROM rooms WHERE code=?').bind(code).first())return response({error:'That room does not exist.'},404);
 await db.prepare('INSERT OR IGNORE INTO saved_rooms(user_id,room_code,saved_at) VALUES(?,?,?)').bind(user.id,code,Date.now()).run();
 return response({saved:true});
}catch(error){console.error('SET saved rooms write',error);return response({error:'Could not save the room. Please retry.'},503);}}
