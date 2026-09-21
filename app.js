let cards=[], topic='love', current=[], manualSelection=[], readingMode='random';
const topicLabels={love:'♥ LOVE',career:'▣ CAREER',money:'◉ MONEY',general:'✦ GENERAL'};
async function init(){cards=await fetch('tarot.json').then(r=>r.json());setupNav();setupTopics();renderPreview();renderDeck();renderChooseGallery();renderChooseSlots();renderHistory();updateClock();setInterval(updateClock,1000);draw(false)}
function setupNav(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>show(b.dataset.goto));
  startBtn.onclick=()=>{readingMode='random';drawBtn.textContent='↻ DRAW AGAIN';show('reading');draw(true)};
  chooseBtn.onclick=openChoose;
  chooseBackBtn.onclick=()=>show('home');
  chooseClearBtn.onclick=clearManualSelection;
  chooseRevealBtn.onclick=revealManualReading;
  drawBtn.onclick=()=>readingMode==='manual'?openChoose():draw(true);
  saveBtn.onclick=saveHistory;shareBtn.onclick=shareResult;
  clearHistory.onclick=()=>{localStorage.removeItem('riverTarotHistory');renderHistory()};
}
function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===id));if(id==='history')renderHistory();if(id==='choose')renderChooseGallery();window.scrollTo({top:0,behavior:'smooth'})}
function setupTopics(){document.querySelectorAll('.topic').forEach(b=>b.onclick=()=>{topic=b.dataset.topic;document.querySelectorAll('.topic').forEach(x=>x.classList.toggle('active',x===b));topicBadge.textContent=topicLabels[topic];chooseTopicBadge.textContent=topicLabels[topic]})}
function renderPreview(){let sample=[cards.find(c=>c.slug==='18-moon'),cards.find(c=>c.slug==='17-star'),cards.find(c=>c.slug==='09-hermit')];previewCards.innerHTML=sample.map(c=>`<img src="${c.image}" alt="${c.zh}">`).join('')}
function draw(revealView=true){if(!cards.length)return;readingMode='random';drawBtn.textContent='↻ DRAW AGAIN';let pool=[...cards],picked=[];for(let i=0;i<3;i++){let n=Math.floor(Math.random()*pool.length);let c=pool.splice(n,1)[0];picked.push({...c,orientation:Math.random()<.5?'upright':'reversed',revealed:false})}current=picked;prepareReading(revealView)}
function prepareReading(revealView=true){renderSpread();detail.innerHTML='<h3>CARD READING</h3><p>點擊任一張牌翻開並查看牌義。</p>';summaryText.textContent='三張牌尚未全部揭曉。依序翻開「過去／現在／未來」。';readingAnalysis.classList.add('hidden');analysisText.textContent='';adviceText.textContent='';cautionText.textContent='';status.textContent='';if(revealView)show('reading')}
function renderSpread(){const pos=[['PAST','WHAT YOU CARRY'],['PRESENT','WHAT IS HERE'],['FUTURE','WHAT COULD BE']];spread.innerHTML=current.map((c,i)=>`<div class="slot"><div class="card ${c.revealed?'revealed':''}" data-i="${i}"><div class="card-inner"><div class="card-face card-back"></div><div class="card-face card-front ${c.orientation==='reversed'?'reversed':''}"><img src="${c.image}" alt="${c.zh}"></div></div></div><h4>${pos[i][0]}</h4><small>${pos[i][1]}</small></div>`).join('');spread.querySelectorAll('.card').forEach(el=>el.onclick=()=>reveal(+el.dataset.i))}
function reveal(i){current[i].revealed=true;renderSpread();showDetail(i);if(current.every(c=>c.revealed))renderSummary()}
function showDetail(i){let c=current[i],o=c.orientation,key=topic;detail.innerHTML=`<h3>CARD READING</h3><img class="mini ${o==='reversed'?'rev':''}" src="${c.image}"><h2>${c.en}<br><small>${c.zh}</small></h2><div class="orientation">${o==='upright'?'UPRIGHT 正位':'REVERSED 逆位'}</div><h3>CORE MEANING</h3><p>${c.meanings[o].core}</p><h3>${topicLabels[key]} READING</h3><p>${c.meanings[o][key]}</p><h3>RIVER READING</h3><p>${c.river[o]}</p>`}
function renderSummary(){
  let p=current.map((c,i)=>`${['過去','現在','未來'][i]}：${c.zh}${c.orientation==='upright'?'正位':'逆位'} — ${c.meanings[c.orientation][topic]}`);
  summaryText.textContent=p.join('　');
  const result=buildReadingAnalysis();
  analysisText.textContent=result.analysis;
  adviceText.textContent=result.advice;
  cautionText.textContent=result.caution;
  readingAnalysis.classList.remove('hidden');
}
function buildReadingAnalysis(){
  const [past,present,future]=current;
  const dir=c=>c.orientation==='upright'?'正位':'逆位';
  const kw=c=>c.meanings[c.orientation].core.split('、').slice(0,2).join('、');
  const upright=current.filter(c=>c.orientation==='upright').length;
  const reversed=3-upright;
  const majors=current.filter(c=>c.arcana==='major').length;
  const topicNames={love:'感情',career:'工作',money:'財務',general:'整體狀態'};
  const flow=reversed===0?'整體能量偏向順流，三個階段之間的推進感較明顯。':reversed===3?'三張皆為逆位，代表目前更適合整理、修正與釐清，而不是急著推進。':reversed===2?'逆位能量較多，表示當下仍有兩個環節需要先處理，進展可能呈現「先整理、再前進」。':'正逆位交錯，代表機會與阻力同時存在，關鍵在於你如何回應當下。';
  const majorNote=majors>=2?`另外有 ${majors} 張大阿爾克那，這組牌比較像是在指出一個重要階段或核心課題，而不只是短期小事件。`:majors===1?'牌組中有 1 張大阿爾克那，代表其中有一個較核心的主題值得特別留意。':'三張皆為小阿爾克那，重點較偏向日常互動、實際選擇與可調整的行動。';
  const analysis=`${topicNames[topic]}牌組的流向是：過去由「${past.zh}${dir(past)}」帶出 ${kw(past)}，現在進入「${present.zh}${dir(present)}」所代表的 ${kw(present)}，未來則朝「${future.zh}${dir(future)}」的 ${kw(future)} 發展。${flow}${majorNote}`;

  const topicAdvice={
    love:'先看彼此實際互動、界線與需求是否一致；不要只用猜測判斷對方。適合用一個清楚但不施壓的行動，去確認關係目前真正的位置。',
    career:'把注意力放在可控制的事情：優先順序、資源、溝通與下一個具體步驟。先完成最關鍵的一件事，再決定是否擴大投入或轉向。',
    money:'先處理現金流、風險與必要支出，再談擴張或投入。避免因一時情緒做大額決定，讓數字與現實條件替你確認方向。',
    general:'把牌組當成一條時間線：先處理過去留下的影響，再回到現在能做的選擇。與其一次解決全部，不如先做最小但明確的下一步。'
  };
  const orientAdvice=future.orientation==='reversed'?'未來牌為逆位，建議把它視為「需要避免或調整的模式」，不要把它當成必然結果。':'未來牌為正位，可以把它當作目前較值得靠近的方向，但仍要透過實際行動去形成結果。';
  const presentAdvice=present.orientation==='reversed'?`現在牌「${present.zh}」逆位是這組牌最需要先處理的位置；先釐清它所代表的卡點，再談下一步。`:`現在牌「${present.zh}」正位是目前最能使用的資源；把它的特質落實成一個具體行動。`;
  const advice=`${topicAdvice[topic]} ${presentAdvice} ${orientAdvice}`;

  let caution='塔羅提供的是象徵性的整理與反思，不是固定預言。若牌面與現實資訊衝突，以可驗證的事實與你的實際判斷為優先。';
  if(topic==='love')caution='不要因單一次抽牌替對方下定論，也不要把牌面當成對方一定會採取某個行動的證據。以實際溝通和持續行為判斷關係。';
  if(topic==='money')caution='涉及投資、借貸或大額支出時，不要只依牌面做決定；仍需查看金額、風險、合約與可承受損失。';
  if(topic==='career')caution='涉及離職、簽約或重大職涯變動時，把牌面當成思考框架即可；仍要核對薪資、工時、條件與實際機會。';
  return{analysis,advice,caution};
}

function openChoose(){readingMode='manual';manualSelection=[];chooseTopicBadge.textContent=topicLabels[topic];chooseStatus.textContent='';renderChooseGallery();renderChooseSlots();show('choose')}
function renderChooseGallery(){if(!cards.length)return;const selectedIds=new Set(manualSelection.map(c=>c.id));chooseGallery.innerHTML=cards.map(c=>`<div class="choose-card ${selectedIds.has(c.id)?'selected':''}" data-id="${c.id}" title="${c.zh} · ${c.en}"><img loading="lazy" src="${c.image}" alt="${c.zh}"><div class="choose-card-title">${c.zh}</div></div>`).join('');chooseGallery.querySelectorAll('.choose-card').forEach(el=>el.onclick=()=>selectManualCard(+el.dataset.id,el))}
function selectManualCard(id,el){if(manualSelection.length>=3||manualSelection.some(c=>c.id===id))return;const base=cards.find(c=>c.id===id);const item={...base,orientation:Math.random()<.5?'upright':'reversed',revealed:false};const target=document.querySelector(`.choose-slot[data-slot="${manualSelection.length}"]`);animateCardToSlot(el,target);manualSelection.push(item);el.classList.add('selected');renderChooseSlots();chooseStatus.textContent=manualSelection.length<3?`已選 ${manualSelection.length} 張，再選 ${3-manualSelection.length} 張。`:'✓ 三張牌已選好，按 REVEAL READING。'}
function animateCardToSlot(source,target){const img=source.querySelector('img');if(!img||!target)return;const a=img.getBoundingClientRect(),b=target.getBoundingClientRect();const clone=img.cloneNode(true);clone.className='flying-card';Object.assign(clone.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});document.body.appendChild(clone);const dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2);if(clone.animate){clone.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.55) rotate(4deg)`,opacity:.25}],{duration:420,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>clone.remove()}else clone.remove()}
function renderChooseSlots(){const slots=document.querySelectorAll('.choose-slot');slots.forEach((slot,i)=>{const c=manualSelection[i];slot.classList.toggle('filled',!!c);if(c){slot.innerHTML=`<img class="${c.orientation==='reversed'?'rev':''}" src="${c.image}" alt="${c.zh}"><div class="slot-caption">${['PAST','PRESENT','FUTURE'][i]} · ${c.zh} · ${c.orientation==='upright'?'正位':'逆位'}</div>`}else slot.innerHTML=`<span>${['PAST','PRESENT','FUTURE'][i]}</span><small>${['1ST CARD','2ND CARD','3RD CARD'][i]}</small>`});chooseCounter.textContent=`SELECT ${manualSelection.length} / 3`;chooseRevealBtn.disabled=manualSelection.length!==3;chooseRevealBtn.classList.toggle('pulse-ready',manualSelection.length===3)}
function clearManualSelection(){manualSelection=[];chooseStatus.textContent='Selection cleared.';renderChooseGallery();renderChooseSlots()}
function revealManualReading(){if(manualSelection.length!==3){chooseStatus.textContent='請先選滿三張牌。';return}readingMode='manual';current=manualSelection.map(c=>({...c,revealed:false}));drawBtn.textContent='✦ CHOOSE AGAIN';prepareReading(true)}

function saveHistory(){if(!current.length||!current.every(c=>c.revealed)){status.textContent='請先把三張牌全部翻開。';return}let h=JSON.parse(localStorage.getItem('riverTarotHistory')||'[]');h.unshift({time:new Date().toISOString(),topic,mode:readingMode,cards:current.map(c=>({id:c.id,orientation:c.orientation}))});h=h.slice(0,50);localStorage.setItem('riverTarotHistory',JSON.stringify(h));status.textContent='✓ Saved to history log.'}
function renderHistory(){if(!cards.length)return;let h=JSON.parse(localStorage.getItem('riverTarotHistory')||'[]');historyList.innerHTML=h.length?h.map(x=>`<div class="history-item"><strong>${new Date(x.time).toLocaleString('zh-TW')} · ${topicLabels[x.topic]} · ${x.mode==='manual'?'CHOSEN':'RANDOM'}</strong><div class="history-cards">${x.cards.map(z=>{let c=cards.find(q=>q.id===z.id);return `<div class="history-card"><img class="${z.orientation==='reversed'?'rev':''}" src="${c.image}"><span>${c.zh} · ${z.orientation==='upright'?'正位':'逆位'}</span></div>`}).join('')}</div></div>`).join(''):'<p>尚無抽牌紀錄。</p>'}
async function shareResult(){if(!current.length||!current.every(c=>c.revealed)){status.textContent='請先把三張牌全部翻開。';return}let text=`RIVER TAROT · ${topicLabels[topic]}\n`+current.map((c,i)=>`${['過去','現在','未來'][i]}：${c.zh}（${c.orientation==='upright'?'正位':'逆位'}）`).join('\n');try{if(navigator.share)await navigator.share({title:'RIVER TAROT',text});else{await navigator.clipboard.writeText(text);status.textContent='✓ 結果已複製。'}}catch(e){status.textContent='分享已取消。'}}
function renderDeck(){if(!cards.length)return;deckGrid.innerHTML=cards.map(c=>`<figure><img loading="lazy" src="${c.image}"><figcaption>${c.zh}</figcaption></figure>`).join('')}
function updateClock(){let d=new Date();clock.textContent=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})+' · '+d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit'})}
init();
