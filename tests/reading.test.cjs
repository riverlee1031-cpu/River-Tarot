const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {generateReading,validateInput,validateOutput}=require('../server/reading.cjs');
const {createServer}=require('../server/index.cjs');
const payload={topic:'career',question:'下個月去米其林餐廳工作能否順利？我擔心跟不上出餐速度。',cards:[{id:54,orientation:'upright'},{id:23,orientation:'reversed'},{id:29,orientation:'upright'},{id:31,orientation:'upright'}]};
function fixture(input=payload){return {cards:input.cards.map((c,i)=>({position:i,cardId:c.id,orientation:c.orientation,meaning:'測試用牌義。',application:'測試用情境解讀：'+input.question})),conclusion:'測試用結論，並非真實 AI 解讀。',shareSummary:'測試用分享摘要。'};}
function mockResponse(value){return new Response(JSON.stringify({status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:JSON.stringify(value)}]}]}),{status:200});}
const options={apiKey:'test-only-key',model:'test-only-model'};

test('sends full question and canonical cards, with independent instructions and strict output',async()=>{
  let sent;
  const reading=await generateReading(payload,{...options,fetchImpl:async(url,opts)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');sent=JSON.parse(opts.body);
    assert.equal(opts.headers.Authorization,'Bearer test-only-key');
    return mockResponse(fixture());
  }});
  assert.equal(JSON.parse(sent.input).question,payload.question);
  assert.equal(JSON.parse(sent.input).cards[0].name,'Five of Swords');
  assert.equal(sent.store,false);
  assert.equal(sent.text.format.strict,true);
  assert.ok(sent.instructions.includes('問題不同也必須重新分析'));
  assert.equal(reading.cards.length,4);
});
test('different questions reach the model unchanged, not keyword buckets',async()=>{
  const questions=['是否該轉職？','主管要求我調班，怎麼談比較好？'];const sent=[];
  for(const question of questions){
    const input={...payload,question};
    await generateReading(input,{...options,fetchImpl:async(_,opts)=>{sent.push(JSON.parse(JSON.parse(opts.body).input).question);return mockResponse(fixture(input));}});
  }
  assert.deepEqual(sent,questions);
});
test('rejects blank, oversize, invalid topics, duplicate cards and missing orientations',()=>{
  for(const input of [{...payload,question:''},{...payload,question:'字'.repeat(301)},{...payload,topic:'__proto__'},{...payload,cards:Array(4).fill(payload.cards[0])},{...payload,cards:[{},...payload.cards.slice(1)]}]) assert.throws(()=>validateInput(input),e=>e.status===400);
});
test('client-supplied card names cannot change the canonical deck',()=>{
  const input=structuredClone(payload);input.cards[0].name='The Sun';
  assert.equal(validateInput(input).cards[0].name,'Five of Swords');
});
test('missing configuration fails without an API call',async()=>{
  await assert.rejects(generateReading(payload,{fetchImpl:()=>assert.fail('must not fetch')}),e=>e.code==='NOT_CONFIGURED');
});
test('rejects changed orientation, changed order and partial output',()=>{
  for(const mutate of [x=>x.cards.reverse(),x=>x.cards[0].orientation='reversed',x=>x.cards.pop(),x=>x.conclusion='']){
    const value=fixture();mutate(value);assert.throws(()=>validateOutput(value,validateInput(payload)),e=>e.code==='INVALID_OUTPUT');
  }
});
test('refusal, incomplete response, rate limit and invalid JSON are explicit errors',async()=>{
  const cases=[
    [new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'refusal',refusal:'no'}]}]})),'REFUSED'],
    [new Response(JSON.stringify({status:'incomplete'})),'INCOMPLETE'],
    [new Response('private provider error',{status:429}),'BUSY'],
    [new Response('not json'),'UPSTREAM_ERROR']
  ];
  for(const [response,code] of cases)await assert.rejects(generateReading(payload,{...options,fetchImpl:async()=>response}),e=>e.code===code&&!e.message.includes('private provider'));
});

async function serve(t,env={},fetchImpl=async()=>mockResponse(fixture())){
  const server=createServer({env:{ALLOWED_ORIGINS:'https://river.example',OPENAI_API_KEY:'test-only-key',OPENAI_MODEL:'test-model',...env},fetchImpl});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
  return `http://127.0.0.1:${server.address().port}`;
}
const post=body=>({method:'POST',headers:{'Content-Type':'application/json',Origin:'https://river.example'},body:JSON.stringify(body)});
test('HTTP API serves valid output and CORS only for configured origin',async t=>{
  const base=await serve(t);const response=await fetch(base+'/api/reading',post(payload));
  assert.equal(response.status,200);assert.equal(response.headers.get('Access-Control-Allow-Origin'),'https://river.example');
  assert.equal((await response.json()).reading.cards.length,4);
  assert.equal((await fetch(base+'/api/reading',{...post(payload),headers:{'Content-Type':'application/json',Origin:'https://bad.example'}})).status,403);
});
test('private files and configuration are not exposed',async t=>{
  const base=await serve(t);
  for(const file of ['.env','server/reading.cjs','package.json','.git/config','tests/reading.test.cjs'])assert.equal((await fetch(base+'/'+file)).status,404);
  const response=await fetch(base+'/api/health');assert.deepEqual(await response.json(),{ready:true});
});
test('method, body size and missing key errors are handled',async t=>{
  const base=await serve(t,{OPENAI_API_KEY:''});
  assert.equal((await fetch(base+'/api/reading')).status,405);
  assert.equal((await fetch(base+'/api/reading',post({...payload,question:'x'.repeat(9000)}))).status,413);
  assert.equal((await fetch(base+'/api/reading',post(payload))).status,503);
});
test('daily guard bounds upstream calls, including API failures',async t=>{
  let calls=0;const base=await serve(t,{MAX_DAILY_READINGS:'1'},async()=>{calls++;return new Response('no',{status:500});});
  assert.equal((await fetch(base+'/api/reading',post(payload))).status,502);
  assert.equal((await fetch(base+'/api/reading',post(payload))).status,429);assert.equal(calls,1);
});
function client(){
  const context=vm.createContext({AbortController,setTimeout,clearTimeout,fetch});
  vm.runInContext(fs.readFileSync('reading-client.js','utf8'),context);
  return vm.runInContext('RiverAI',context);
}
test('client deduplicates pending and completed reads',async()=>{
  let calls=0,resolve;
  const session=client().createSession({fetchImpl:()=>{calls++;return new Promise(r=>resolve=r);}});
  const a=session.request(payload),b=session.request(payload);
  resolve(new Response(JSON.stringify({reading:fixture()})));
  await Promise.all([a,b]);await session.request(payload);assert.equal(calls,1);
});
test('redraw aborts old request and prevents stale result replacing new cards',async()=>{
  const pending=[];
  const session=client().createSession({fetchImpl:(_,opts)=>new Promise(resolve=>pending.push({resolve,signal:opts.signal}))});
  const old=session.request(payload);session.reset();assert.equal(pending[0].signal.aborted,true);
  const nextPayload={...payload,question:'新問題'};
  const next=session.request(nextPayload);
  pending[1].resolve(new Response(JSON.stringify({reading:fixture(nextPayload)})));await next;
  pending[0].resolve(new Response(JSON.stringify({reading:fixture()})));assert.equal(await old,null);
  assert.ok(session.result.cards[0].application.includes('新問題'));
});
test('failed requests can retry with same cards and never fall back to canned text',async()=>{
  let calls=0;const sent=[];
  const session=client().createSession({fetchImpl:async(_,opts)=>{sent.push(opts.body);return ++calls===1?new Response('{}',{status:503}):new Response(JSON.stringify({reading:fixture()}));}});
  await assert.rejects(session.request(payload));assert.equal(session.result,null);
  await session.request(payload);assert.equal(sent[0],sent[1]);
});
test('page uses AI client, safely escapes generated text and has no local analysis fallback',()=>{
  const page=fs.readFileSync('index.html','utf8'),app=fs.readFileSync('app.js','utf8');
  assert.ok(page.includes('reading-client.js'));assert.ok(!page.includes('reading-engine.js'));
  assert.ok(!app.includes('RiverReading'));assert.ok(app.includes('escapeHTML(reading.application)'));
  assert.ok(app.includes('if(!readingResult)return {overall:'));
});

function pageContext(fetchImpl){
  const elements=new Map();
  const element=id=>{
    if(!elements.has(id))elements.set(id,{textContent:'',innerHTML:'',hidden:false,disabled:false,classList:{add(){},remove(){}},setAttribute(){}});
    return elements.get(id);
  };
  const context=vm.createContext({document:{getElementById:element},window:{RIVER_CONFIG:{}},detail:element('detail'),AbortController,setTimeout,clearTimeout,fetch:fetchImpl,console});
  vm.runInContext(fs.readFileSync('reading-client.js','utf8'),context);
  vm.runInContext(fs.readFileSync('app.js','utf8').split('\ninit();')[0],context);
  context.testCards=payload.cards.map(c=>({...require('../tarot.json').find(d=>d.id===c.id),orientation:c.orientation,revealed:true}));
  vm.runInContext("topic='career';positionZH=RiverAI.labels.career;questionText='新工作能否適應';current=testCards;prepareShareAsset=()=>{};",context);
  return {context,element};
}
test('result UI uses generated text, escapes HTML, shares same conclusion and avoids repeat calls',async()=>{
  let calls=0;const value=fixture();value.cards[0].application='<img src=x onerror=alert(1)>測試';
  const {context,element}=pageContext(async()=>{calls++;return new Response(JSON.stringify({reading:value}));});
  await vm.runInContext('renderAnalysis()',context);
  assert.equal(element('conclusionText').textContent,value.conclusion);
  assert.ok(element('detail').innerHTML.includes('&lt;img'));
  assert.ok(!element('detail').innerHTML.includes('<img src=x'));
  assert.ok(vm.runInContext('buildShareCaption()',context).includes(value.conclusion));
  assert.equal(element('shareReadingBtn').disabled,false);
  await vm.runInContext('renderAnalysis()',context);assert.equal(calls,1);
});
test('failed UI keeps result empty, exposes retry and does not enable sharing',async()=>{
  const {context,element}=pageContext(async()=>new Response(JSON.stringify({error:{code:'NOT_CONFIGURED'}}),{status:503}));
  element('shareReadingBtn').disabled=true;
  await vm.runInContext('renderAnalysis()',context);
  assert.ok(element('readingStatus').textContent.includes('尚未啟用'));
  assert.equal(element('retryReadingBtn').hidden,false);
  assert.equal(element('conclusionText').textContent,'');
  assert.equal(element('shareReadingBtn').disabled,true);
});
