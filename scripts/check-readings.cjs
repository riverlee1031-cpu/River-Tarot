const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const deck = JSON.parse(fs.readFileSync('tarot.json','utf8'));
const source = fs.readFileSync('app.js','utf8').split('\ninit();')[0];
const context = vm.createContext({document:{getElementById:()=>({})}, console});
vm.runInContext(source, context);
context.deck = deck;
assert.equal(deck.length, 78);
for(const card of deck) for(const side of ['upright','reversed']){
  assert.ok(card.plain[side]?.length > 10);
  assert.ok(fs.existsSync(card.image));
}
vm.runInContext(`
for(topic of ['love','career','money','general']){
 for(const card of deck) for(const orientation of ['upright','reversed']){
  current=Array.from({length:4},()=>({...card,orientation}));
  const result=buildAnalysis();
  for(const value of Object.values(result)){
   if(!value || /undefined|有戲|逆位就是/.test(value)) throw Error(value);
  }
  if(!result.conclusion.includes(card.plain[orientation])) throw Error('Wrong orientation');
 }
}
current=Array.from({length:4},()=>({...deck[15],orientation:'reversed'}));
if(!relationshipConclusion().includes('擺脫束縛')) throw Error('Reversed Devil regression');
`,context);
console.log('PASS: 78 cards, 156 meanings, 624 topic/orientation cases and reversed Devil regression.');
