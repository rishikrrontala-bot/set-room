export type Card = { id:number; number:number; shape:number; color:number; fill:number };
export const FEATURES = ['number','shape','color','fill'] as const;
export function card(id:number):Card { return {id,number:Math.floor(id/27),shape:Math.floor(id/9)%3,color:Math.floor(id/3)%3,fill:id%3}; }
export function isSet(cards:Card[]) { return cards.length===3 && new Set(cards.map(c=>c.id)).size===3 && FEATURES.every(f=>(cards[0][f]+cards[1][f]+cards[2][f])%3===0); }
export function setKey(ids:number[]) { return [...ids].sort((a,b)=>a-b).join('-'); }
export function findSets(board:Card[]):number[][] { const found:number[][]=[]; for(let a=0;a<board.length-2;a++)for(let b=a+1;b<board.length-1;b++)for(let c=b+1;c<board.length;c++)if(isSet([board[a],board[b],board[c]]))found.push([board[a].id,board[b].id,board[c].id]); return found; }
export function random(seed:string) { let state=2166136261; for(const ch of seed)state=Math.imul(state^ch.charCodeAt(0),16777619)>>>0; return ()=>{state=(state+0x6D2B79F5)>>>0; let t=Math.imul(state^(state>>>15),1|state);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;}; }
const cache = new Map<string,Card[]>();
export function dailyBoard(day:string):Card[] { const saved=cache.get(day);if(saved)return saved; const rng=random('set-room-v1:'+day);for(let tries=0;tries<20000;tries++){const deck=Array.from({length:81},(_,i)=>i);for(let i=0;i<12;i++){const j=i+Math.floor(rng()*(81-i));[deck[i],deck[j]]=[deck[j],deck[i]];}const board=deck.slice(0,12).map(card);if(findSets(board).length===6){if(cache.size>40)cache.clear();cache.set(day,board);return board;}}throw new Error('Puzzle could not be generated'); }
export function puzzleDay(now=new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(now); }
export function formatTime(ms:number) { const total=Math.max(0,Math.floor(ms/1000)); const minutes=Math.floor(total/60);const seconds=total%60;const tenths=Math.floor(ms%1000/100);return `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}.${tenths}`; }
export function mismatch(cards:Card[]) { const names={number:'number',shape:'shape',color:'color',fill:'shading'};return FEATURES.filter(f=>(cards[0][f]+cards[1][f]+cards[2][f])%3!==0).map(f=>names[f]).join(' and '); }
export function replaceMatched(board:Card[],ids:number[],seed:string):Card[] {
 if(ids.length!==3||!isSet(ids.map(card))||ids.some(id=>!board.some(c=>c.id===id)))throw new Error('Choose a valid set from this board.');
 const matched=new Set(ids),remaining=board.filter(c=>!matched.has(c.id)),used=new Set(remaining.map(c=>c.id)),pool=Array.from({length:81},(_,i)=>i).filter(id=>!used.has(id)),rng=random('refill-v1:'+seed+':'+board.map(c=>c.id).join(',')+':'+setKey(ids));
 for(let attempt=0;attempt<2048;attempt++){const candidates=[...pool];for(let i=0;i<3;i++){const j=i+Math.floor(rng()*(candidates.length-i));[candidates[i],candidates[j]]=[candidates[j],candidates[i]];}let index=0;const next=board.map(c=>matched.has(c.id)?card(candidates[index++]):c);if(findSets(next).length>0)return next;}
 // Keeping the selected triple is a valid, solvable bounded fallback. Repeats are allowed.
 return board;
}

export type GameMode = 'original' | 'refill';
export function roundLabel(mode:GameMode,target:number) { return mode==='original'?'Original':target===3?'Sprint':'Refill'; }
export function alreadyFound(sets:number[][],ids:number[]) { return sets.some(set=>setKey(set)===setKey(ids)); }
export function availableSets(board:Card[],sets:number[][],mode:GameMode) { return findSets(board).filter(ids=>mode==='refill'||!alreadyFound(sets,ids)); }
export function advanceRound(board:Card[],sets:number[][],ids:number[],mode:GameMode,target:number,seed:string) {
 if(mode==='original'&&target!==6)throw new Error('Original rounds require all six sets.');
 if(sets.length>=target)throw new Error('This round is already complete.');
 if(!ids.every(id=>board.some(c=>c.id===id))||!isSet(ids.map(card)))throw new Error('Choose a valid set from this board.');
 if(mode==='original'&&alreadyFound(sets,ids))throw new Error('You already found that set. Find a different combination.');
 const nextSets=[...sets,[...ids]],complete=nextSets.length===target;
 return {sets:nextSets,complete,board:mode==='original'||complete?board:replaceMatched(board,ids,seed)};
}

export function originalBoard(day:string,puzzle=0):Card[] {
 if(!Number.isInteger(puzzle)||puzzle<0||puzzle>1000)throw new Error('Choose a puzzle from 1 to 1001.');
 return dailyBoard(puzzle===0?day:`${day}:original:${puzzle}`);
}
