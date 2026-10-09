import assert from 'node:assert/strict';
import test from 'node:test';
import {card,dailyBoard,findSets,isSet,setKey,puzzleDay,replaceMatched,advanceRound,alreadyFound,availableSets} from './set.ts';
test('all feature combinations obey the SET rule',()=>{assert.equal(isSet([card(0),card(40),card(80)]),true);assert.equal(isSet([card(0),card(0),card(0)]),false);assert.equal(isSet([card(0),card(1),card(3)]),false);assert.equal(isSet([card(0),card(1),card(2)]),true);});
test('daily boards are deterministic, unique, and contain exactly six sets',()=>{for(let i=1;i<=60;i++){const day=`2026-test-${i}`;const board=dailyBoard(day);assert.equal(board.length,12);assert.equal(new Set(board.map(c=>c.id)).size,12);assert.equal(findSets(board).length,6);assert.deepEqual(board,dailyBoard(day));}assert.notDeepEqual(dailyBoard('2026-10-08'),dailyBoard('2026-10-09'));});
test('a repeated combination remains a valid match on a later board',()=>{const ids=[46,53,48];assert.ok(isSet(ids.map(card)));assert.ok(isSet([...ids].reverse().map(card)));assert.equal(setKey(ids),setKey([...ids].reverse()));});
test('competition date stays in New York across UTC midnight',()=>{assert.equal(puzzleDay(new Date('2026-10-09T02:00:00Z')),'2026-10-08');assert.equal(puzzleDay(new Date('2026-10-09T05:00:00Z')),'2026-10-09');});
test('screenshot combination 4, 8, 5 is a valid set',()=>assert.equal(isSet([card(46),card(53),card(48)]),true));
test('refills preserve the nine unmatched slots and always leave a solvable board',()=>{let board=dailyBoard('2026-10-08');for(let i=0;i<250;i++){const ids=findSets(board)[0],next=replaceMatched(board,ids,'test:'+i);assert.equal(next.length,12);assert.equal(new Set(next.map(c=>c.id)).size,12);assert.ok(findSets(next).length>0);board.forEach((c,index)=>{if(!ids.includes(c.id))assert.equal(next[index].id,c.id);});assert.deepEqual(next,replaceMatched(board,[...ids].reverse(),'test:'+i));board=next;}});

test('original rounds keep the exact board while six distinct overlapping sets finish once',()=>{
 const initial=dailyBoard('original-regression'),all=findSets(initial);let state={board:initial,sets:[] as number[][],complete:false};
 assert.equal(all.length,6);assert.ok(all.some((a,i)=>all.some((b,j)=>i!==j&&a.some(id=>b.includes(id)))));
 all.forEach((ids,i)=>{state=advanceRound(state.board,state.sets,ids,'original',6,'unused');assert.deepEqual(state.board,initial);assert.equal(state.sets.length,i+1);assert.equal(state.complete,i===5);assert.equal(availableSets(state.board,state.sets,'original').length,5-i);});
 assert.throws(()=>advanceRound(state.board,state.sets,all[0],'original',6,'unused'),/complete/);
 assert.equal(initial.length,12);
});
test('original duplicates are rejected regardless of selection order without removing shared cards',()=>{
 const board=dailyBoard('duplicates'),ids=findSets(board)[0],found=[ids];
 assert.equal(alreadyFound(found,[...ids].reverse()),true);
 assert.throws(()=>advanceRound(board,found,[...ids].reverse(),'original',6,'unused'),/already found/);
 assert.throws(()=>advanceRound(board,[],ids,'original',3,'unused'),/all six/);
 assert.throws(()=>advanceRound(board,[],[ids[0],ids[0],ids[0]],'original',6,'unused'),/valid set/);
 assert.equal(found.length,1);
});
test('refill mode still accepts a combination when it appears again',()=>{
 const board=dailyBoard('refill-repeat'),ids=findSets(board)[0],found=[ids];
 const next=advanceRound(board,found,[...ids].reverse(),'refill',6,'repeat-regression');
 assert.equal(next.sets.length,2);assert.equal(found.length,1);assert.ok(findSets(next.board).length>0);assert.equal(availableSets(board,found,'refill').length,6);
});
