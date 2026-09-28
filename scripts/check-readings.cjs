const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const deck = JSON.parse(fs.readFileSync('tarot.json','utf8'));
const source = fs.readFileSync('app.js','utf8').split('\ninit();')[0];
const context = vm.createContext({document:{getElementById:()=>({})}, console});
vm.runInContext(fs.readFileSync('reading-engine.js','utf8'), context);
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
  if(!result.overall.includes(card.plain[orientation])) throw Error('Wrong orientation');
  if(!result.conclusion.includes(card.zh)) throw Error('Conclusion lost its cards');
 }
}
current=Array.from({length:4},()=>({...deck[15],orientation:'reversed'}));
if(!buildAnalysis().overall.includes('擺脫束縛')) throw Error('Reversed Devil regression');
`,context);

vm.runInContext(`
topic='career'; questionText='下個月去米其林餐廳工作能否順利';
current=[['five-of-swords','upright'],['two-of-wands','reversed'],['eight-of-wands','upright'],['ten-of-wands','upright']].map(([slug,orientation])=>({...deck.find(c=>c.slug===slug),orientation}));
const career=buildAnalysis();
if(!career.overall.includes('願意學') || !career.connections.includes('指令接連') || !career.conclusion.includes('工作節奏')) throw Error('Career example lost context');
if(/對方的想法|彼此舒服/.test(Object.values(career).join(''))) throw Error('Romance leaked into work');
questionText='這段關係能否穩定'; topic='love';
const love=buildAnalysis();
if(love.overall===career.overall || /主管|工作節奏/.test(Object.values(love).join(''))) throw Error('Topic context regression');
topic='career'; questionText='原本工作的流程如何改善';
if(buildAnalysis().overall.includes('剛到新環境')) throw Error('Invented new job');
if(RiverReading.theme({...deck[15],orientation:'upright'}).focus === RiverReading.theme({...deck[15],orientation:'reversed'}).focus) throw Error('Orientation classification regression');
positionZH=RiverReading.labels.career;
const prompt=buildReadingPrompt();
if(/mofatarot|meaningReference/.test(prompt) || !prompt.includes('正位也可能是壓力')) throw Error('Prompt principles regression');
`, context);
const engine=fs.readFileSync('reading-engine.js','utf8');
for (const side of ['upright','reversed']) {
  const keys=engine.match(new RegExp('const '+side+' = `([^`]+)`'))[1].split(' ');
  assert.equal(keys.length,78,side+' theme coverage');
  for(const key of keys) assert.ok(engine.includes(key+':{'), 'Unknown theme '+key);
}
assert.ok(!source.includes('mofatarot'));
console.log('PASS: 156 meanings, 624 topic/orientation cases, theme coverage, work example, topic isolation, recovery and prompt rules.');
