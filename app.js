let cards = [];
let topic = 'love';
let shuffledDeck = [];
let selected = [];
let current = [];
let shuffleTimer = null;
let shareAssetPromise = null;
let cachedShareAsset = null;
const aiSession = RiverAI.createSession();
let readingResult = null;
let readingRevision = 0;
let detailIndex = 0;

const $ = (id)=>document.getElementById(id);
let questionText = '';


const topicLabels = {
  love: '♥ LOVE',
  career: '▣ CAREER',
  money: '◉ MONEY',
  general: '✦ GENERAL'
};
const topicTitles = { love:'LOVE', career:'CAREER', money:'MONEY', general:'GENERAL GUIDANCE' };
const positions = ['ME','CONTEXT','CHALLENGE','ADVICE'];
let positionZH = RiverAI.labels.love;
const orientationZH = {upright:'正位', reversed:'逆位'};
const topicZH = {love:'感情', career:'工作', money:'財務', general:'整體'};
async function init(){
  cards = await fetch('tarot.json?v=1.12-live-ai').then(r=>r.json());
  bindUI();
  updateClock();
  setInterval(updateClock,1000);
}

function bindUI(){
  document.querySelectorAll('.topic').forEach(btn=>btn.addEventListener('click',()=>{
    topic=btn.dataset.topic;
    positionZH=RiverAI.labels[topic];
    document.querySelectorAll('.topic').forEach(x=>x.classList.toggle('active',x===btn));
  }));
  questionInput.addEventListener('input',()=>{
    if(questionInput.value.length>300) questionInput.value=questionInput.value.slice(0,300);
    questionText=questionInput.value.trim().slice(0,300);
    questionCount.textContent=`${questionInput.value.length} / 300`;
    beginBtn.disabled=questionText.length===0;
    questionHint.textContent=questionText.length? '問題已收好。接下來交給你的直覺。':'先寫下問題，再讓牌開始說話。';
  });
  beginBtn.addEventListener('click',()=>openSpread());
  homeNav.addEventListener('click',()=>show('home'));
  readingNav.addEventListener('click',()=>{ if(current.length===4) show('reading'); else openSpread(); });
  changeQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBottomBtn.addEventListener('click',()=>show('home'));
  chooseClearBtn.addEventListener('click',()=>openSpread(true));
  chooseRevealBtn.addEventListener('click',revealReading);
  askChatGPTBtn.addEventListener('click',openChatGPTReading);
  $('retryReadingBtn').addEventListener('click',renderAnalysis);
  shareReadingBtn.addEventListener('click',shareReading);
  chooseAgainBtn.addEventListener('click',()=>openSpread(true));
}

function show(id){
  if(id==='home'){resetReading();current=[];}
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  if(typeof homeNav!=='undefined') homeNav.classList.toggle('active',id==='home');
  if(typeof readingNav!=='undefined') readingNav.classList.toggle('active',id==='choose'||id==='reading');
  window.scrollTo({top:0,behavior:id==='reading'?'instant':'smooth'});
}

function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function openSpread(isReshuffle=false){
  if(!isReshuffle){
    questionText=(questionInput?.value||'').trim().slice(0,300);
    if(!questionText){
      questionInput?.focus();
      questionHint.textContent='請先寫下你的問題（300字內）。';
      return;
    }
  }
  resetReading();
  selected=[];
  shuffledDeck=shuffle(cards);
  chooseTopicBadge.textContent=topicLabels[topic];
  chooseQuestionText.textContent=questionText;
  chooseCounter.textContent='0 / 4 SELECTED';
  chooseHint.textContent=isReshuffle?'The deck is moving again. Let your attention settle naturally.':'Choose the card that calls to you first.';
  chooseStatus.textContent='';
  chooseRevealBtn.disabled=true;
  chooseGallery.innerHTML='';
  renderSlots();
  show('choose');
  shuffleMessage.textContent=isReshuffle?'RESHUFFLING…':'SHUFFLING THE DECK…';
  shuffleMessage.classList.add('show');
  if(shuffleTimer) clearTimeout(shuffleTimer);
  shuffleTimer=setTimeout(()=>{
    shuffleMessage.classList.remove('show');
    renderFan();
  },650);
}

function renderFan(){
  const rows=[shuffledDeck.slice(0,26),shuffledDeck.slice(26,52),shuffledDeck.slice(52,78)];
  chooseGallery.innerHTML=rows.map((row,rowIndex)=>{
    return `<div class="fan-row row-${rowIndex+1}">`+row.map((c,i)=>{
      const total=row.length-1;
      const norm=total?(i/total)*2-1:0;
      const angle=(rowIndex===0?14:rowIndex===1?12:10)*norm;
      const curve=(norm*norm*25)+(rowIndex*8);
      const delay=(rowIndex*26+i)*10;
      return `<button class="choose-card" data-id="${c.id}" aria-label="Face-down tarot card ${rowIndex*26+i+1}" style="--fan-angle:${angle}deg;--fan-y:${curve}px;--deal-delay:${delay}ms"><span class="mystic-back"><i>☾</i><b>RIVER TAROT</b><small>✦ ✦ ✦</small></span></button>`;
    }).join('')+`</div>`;
  }).join('');
  chooseGallery.querySelectorAll('.choose-card').forEach(el=>el.addEventListener('click',()=>pickCard(Number(el.dataset.id),el)));
}

function pickCard(id,el){
  if(selected.length>=4 || selected.some(c=>c.id===id)) return;
  const base=cards.find(c=>c.id===id);
  const item={...base,orientation:Math.random()<.5?'upright':'reversed',revealed:false};
  const slot=document.querySelector(`.choose-slot[data-slot="${selected.length}"]`);
  flyToSlot(el,slot);
  selected.push(item);
  el.classList.add('selected');
  renderSlots();
  const n=selected.length;
  chooseCounter.textContent=`${n} / 4 SELECTED`;
  chooseHint.textContent=n<4?`下一張：${positionZH[n]}`:'四張牌已選好，可以開始解讀。';
  if(n===4){
    chooseRevealBtn.disabled=false;
    chooseRevealBtn.classList.add('pulse-ready');
    chooseStatus.textContent='YOUR READING IS READY.';
    chooseGallery.classList.add('selection-complete');
  }
}

function flyToSlot(source,target){
  const a=source.getBoundingClientRect(), b=target.getBoundingClientRect();
  const clone=source.cloneNode(true);
  clone.className='flying-card';
  Object.assign(clone.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});
  document.body.appendChild(clone);
  const dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2);
  const anim=clone.animate([
    {transform:'translate(0,0) scale(1)',opacity:1},
    {transform:`translate(${dx*.55}px,${dy*.55}px) scale(.82) rotate(-4deg)`,opacity:.95,offset:.6},
    {transform:`translate(${dx}px,${dy}px) scale(.58) rotate(3deg)`,opacity:.15}
  ],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)'});
  anim.onfinish=()=>clone.remove();
}

function renderSlots(){
  document.querySelectorAll('.choose-slot').forEach((slot,i)=>{
    const c=selected[i];
    slot.classList.toggle('filled',!!c);
    if(c){
      slot.innerHTML=`<div class="chosen-back"><span class="mystic-back"><i>☾</i><b>RIVER TAROT</b></span></div><div class="slot-caption">${positions[i]} · SELECTED</div>`;
    }else{
      slot.innerHTML=`<span>${positions[i]}</span><small>${positionZH[i]}</small>`;
    }
  });
}

function revealReading(){
  if(selected.length!==4)return;
  current=selected.map(c=>({...c,revealed:false}));
  readingTopic.textContent=topicTitles[topic];
  readingQuestionText.textContent=questionText;
  renderSpread();
  detail.innerHTML='<h3>牌卡解析</h3><p>請依序翻開四張牌，再點選任一張牌查看中文解讀。</p>';
  readingAnalysis.classList.add('hidden');
  revealPrompt.textContent='依序翻開四張牌，完整解析會在全部翻開後出現。';
  show('reading');
  const readingView=$('reading');
  readingView.classList.remove('reading-enter');
  void readingView.offsetWidth;
  readingView.classList.add('reading-enter');
  window.setTimeout(()=>readingView.classList.remove('reading-enter'),900);
}

function renderSpread(){
  const subtitles=positionZH;
  spread.innerHTML=current.map((c,i)=>`<div class="slot"><button class="card ${c.revealed?'revealed':''}" data-i="${i}" aria-label="Reveal ${positions[i]} card" aria-pressed="${c.revealed}" style="--reveal-order:${i}"><span class="card-inner"><span class="card-face card-back"></span><span class="card-face card-front ${c.orientation==='reversed'?'reversed':''}"><img src="${c.image}" alt="${c.en}"></span></span></button><h4>${positions[i]}</h4><small>${subtitles[i]}</small></div>`).join('');
  spread.querySelectorAll('.card').forEach(el=>el.addEventListener('click',()=>turnCard(Number(el.dataset.i))));
}

function turnCard(i){
  const cardButton=spread.querySelector(`.card[data-i="${i}"]`);
  if(!current[i].revealed){
    current[i].revealed=true;
    cardButton?.classList.add('revealed','reveal-pop');
    cardButton?.setAttribute('aria-pressed','true');
    window.setTimeout(()=>cardButton?.classList.remove('reveal-pop'),850);
  }
  showCardDetail(i);
  if(current.every(c=>c.revealed)) renderAnalysis();
}

function coreMeaning(c){
  const side=c.orientation==='upright'?'upright':'reversed';
  return c.meanings?.[side]?.core || (side==='upright'?c.upright:c.reversed) || '';
}
function orientationLabel(c){return orientationZH[c.orientation]||c.orientation;}

function resetReading(){
  readingRevision++;
  aiSession.reset();
  readingResult=null;
  cachedShareAsset=null;
  shareAssetPromise=null;
  if(window.__riverShareUrl){URL.revokeObjectURL(window.__riverShareUrl);window.__riverShareUrl=null;}
  $('shareReadingBtn').disabled=true;
  $('storyPreview').hidden=true;
  $('shareStatus').textContent='';
  $('retryReadingBtn').hidden=true;
  $('readingStatus').textContent='';
  $('readingAnalysis').classList.add('hidden');
  $('readingAnalysis').setAttribute('aria-busy','false');
  for(const id of ['analysisText','comboText','conclusionText'])$(id).textContent='';
}
function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function showCardDetail(i){
  detailIndex=i;
  const c=current[i];
  const reading=readingResult?.cards[i];
  const meaning=reading?.meaning || c.plain?.[c.orientation] || coreMeaning(c);
  detail.innerHTML=`<div class="detail-card-line"><img class="mini ${c.orientation==='reversed'?'rev':''}" src="${c.image}" alt="${escapeHTML(c.en)}"><div><p class="eyebrow">${positionZH[i]} · ${positions[i]}</p><h2>${escapeHTML(c.zh)} <small>${escapeHTML(c.en)}</small></h2><div class="orientation">${orientationLabel(c)}</div></div></div><h3>${reading?'這張牌的意思':'基本牌義'}</h3><p>${escapeHTML(meaning)}</p><h3>對應你的問題</h3><p>${reading?escapeHTML(reading.application):'四張牌翻開後，AI 會結合你的完整問題進行解讀。'}</p>`;
}
function buildAnalysis(){
  if(!readingResult)return {overall:'',connections:'',conclusion:''};
  const paragraphs=current.map((c,i)=>{
    const r=readingResult.cards[i];
    return `${positionZH[i]}｜${c.zh}（${orientationLabel(c)}）\n${r.meaning}${r.application}`;
  });
  return {overall:paragraphs.slice(0,2).join('\n\n'),connections:paragraphs.slice(2).join('\n\n'),conclusion:readingResult.conclusion};
}

function buildReadingPrompt(){
  const cardLines=current.map((c,i)=>`${positionZH[i]}：${c.zh}（${c.en}）${orientationLabel(c)}`).join('；');
  return `請用你對塔羅的理解，為我做四張牌的情境解讀，不要參考或搜尋指定牌義網站。主題：${topicZH[topic]}。問題：「${questionText}」。抽到的牌：${cardLines}。使用 RIVER 的解讀方式：每張牌先用一句白話說出該正逆位的重點，再結合牌陣位置與問題，解釋可能面對的處境，最後給出具體提醒。每張約兩到三句，語氣自然、直接、溫和，不堆術語。建議要落在能做的事情，例如新工作中的確認流程、學習節奏與表達負荷，但不要把這些例子硬套到無關問題。整體結論要綜合四張牌，說清可用的資源、主要阻力和下一步；不能只算正逆位數量判斷吉凶。正位也可能是壓力，逆位也可能是恢復。不要斷言對方的內心、虛構環境事實、保證成功或預告必然失敗。若資訊不足，用可能的情境說明，不要假裝已經知道。`;
}
function openChatGPTReading(){
  if(current.length!==4)return;
  window.open('https://chatgpt.com/?q='+encodeURIComponent(buildReadingPrompt()),'_blank','noopener,noreferrer');
}

function loadImg(src){
  return new Promise((resolve,reject)=>{
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error(`Image load failed: ${src}`));
    img.src=src;
  });
}

function roundRect(ctx,x,y,w,h,r){
  const rr=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr,y);
  ctx.arcTo(x+w,y,x+w,y+h,rr);
  ctx.arcTo(x+w,y+h,x,y+h,rr);
  ctx.arcTo(x,y+h,x,y,rr);
  ctx.arcTo(x,y,x+w,y,rr);
  ctx.closePath();
}

function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines){
  const lines=[];let line='';
  for(const char of String(text||'')){
    if(ctx.measureText(line+char).width>maxWidth && line){lines.push(line);line=char;}
    else line+=char;
  }
  if(line)lines.push(line);
  if(maxLines && lines.length>maxLines){
    lines.length=maxLines;
    let last=lines[maxLines-1];
    while(last && ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);
    lines[maxLines-1]=last+'…';
  }
  lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
  return y+Math.max(1,lines.length)*lineHeight;
}

function buildShareCaption(){
  const cardLines=current.map((c,i)=>`${positionZH[i]}｜${c.zh} ${orientationLabel(c)}`).join('\n');
  const summary=readingResult?.conclusion || '';
  return `River Tarot 四張塔羅牌解讀\n主題：${topicZH[topic]}\n問題：${questionText}\n${cardLines}\n\n結論：${summary}\n\n#RiverTarot #塔羅 #TarotReading`;
}

async function generateShareImage(showStatusMsg=false){
  if(!readingResult || current.length!==4 || !current.every(c=>c.revealed)){
    if(showStatusMsg) $('shareStatus').textContent='請等待 AI 解讀完成，再分享。';
    return null;
  }
  if(showStatusMsg) $('shareStatus').textContent='正在準備分享圖…';
  const revision=readingRevision;
  const snapshot={cards:current.map(c=>({...c})),question:questionText,topic,labels:[...positionZH],summary:readingResult.shareSummary};
  const canvas=document.createElement('canvas');
  const ctx=canvas.getContext('2d');
  canvas.width=1080; canvas.height=1920;
  const W=canvas.width,H=canvas.height;
  const bg=ctx.createLinearGradient(0,0,W,H);
  bg.addColorStop(0,'#100d26');bg.addColorStop(.55,'#211632');bg.addColorStop(1,'#080e19');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#9775b6';ctx.lineWidth=2;ctx.strokeRect(32,32,W-64,H-64);
  ctx.strokeStyle='#483752';ctx.strokeRect(44,44,W-88,H-88);
  // Pixel stars, deliberately stable between exports.
  for(let i=0;i<55;i++){
    ctx.fillStyle=i%3?'#715580':'#d6b2db';
    ctx.fillRect(65+(i*173)%950,95+(i*97)%1670,i%4?3:5,i%4?3:5);
  }
  ctx.fillStyle='#b9a2c8';ctx.font='22px "Courier New",monospace';
  ctx.fillText('NIGHT READING  /  FOUR-CARD SPREAD',78,194);
  ctx.fillStyle='#f2deed';ctx.font='bold 74px Georgia,serif';
  ctx.fillText('RIVER TAROT',74,280);
  ctx.fillStyle='#c89acb';ctx.font='26px sans-serif';
  ctx.fillText(`${topicZH[snapshot.topic]}  /  ${new Date().toLocaleDateString('zh-TW')}`,78,332);
  const scene=await loadImg('assets/river-cat-vinyl.gif');
  ctx.drawImage(scene,662,367,336,448);
  ctx.fillStyle='#9fd4c5';ctx.font='22px "Courier New",monospace';ctx.fillText('MY QUESTION',78,439);
  ctx.fillStyle='#f2deed';ctx.font='34px sans-serif';
  wrapText(ctx,snapshot.question,78,500,534,49,6);
  ctx.fillStyle='#a08aa9';ctx.font='24px serif';
  ctx.fillText('在夜色裡，聽見自己的答案。',78,773);
  ctx.fillStyle='#bfa4ca';ctx.font='22px "Courier New",monospace';
  ctx.fillText('01 — THE CARDS',78,860);
  const imgs=await Promise.all(snapshot.cards.map(c=>loadImg(c.image)));
  const cardW=204,cardH=306,topY=904;
  imgs.forEach((img,i)=>{
    const x=78+i*240;
    ctx.save();ctx.translate(x+cardW/2,topY+cardH/2);
    ctx.shadowColor='#00000080';ctx.shadowBlur=18;
    ctx.fillStyle='#d4bdd2';ctx.fillRect(-cardW/2-4,-cardH/2-4,cardW+8,cardH+8);
    ctx.shadowBlur=0;
    if(snapshot.cards[i].orientation==='reversed')ctx.rotate(Math.PI);
    ctx.drawImage(img,-cardW/2,-cardH/2,cardW,cardH);ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#a7d5c8';ctx.font='23px sans-serif';
    ctx.fillText(snapshot.labels[i],x+cardW/2,1251);
    ctx.fillStyle='#f0dfee';ctx.font='24px sans-serif';
    ctx.fillText(snapshot.cards[i].zh,x+cardW/2,1288,222);
    ctx.fillStyle='#b49bc4';ctx.font='20px sans-serif';ctx.fillText(orientationLabel(snapshot.cards[i]),x+cardW/2,1320);
  });
  ctx.textAlign='left';ctx.fillStyle='#100f1ee8';ctx.fillRect(66,1370,948,330);
  ctx.strokeStyle='#775f86';ctx.strokeRect(66,1370,948,330);
  ctx.fillStyle='#a7d5c8';ctx.font='24px sans-serif';ctx.fillText('02 — 給此刻的你',90,1412);
  ctx.fillStyle='#eee0f0';ctx.font='26px sans-serif';
  wrapText(ctx,snapshot.summary,90,1462,895,39,6);
  ctx.fillStyle='#c7b0d4';ctx.font='italic 24px serif';ctx.fillText('牌不替你決定，但會把霧打亮。',78,1760);
  ctx.fillStyle='#9c87af';ctx.font='18px "Courier New",monospace';ctx.fillText('riverlee1031-cpu.github.io/River-Tarot',78,1802);
  // Fine CRT lines match the site without obscuring the reading.
  ctx.fillStyle='rgba(0,0,0,.055)';for(let y=0;y<H;y+=6)ctx.fillRect(0,y,W,1);

  let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));
  if(!blob){
    const dataUrl=canvas.toDataURL('image/png');
    const res=await fetch(dataUrl);
    blob=await res.blob();
  }
  if(revision!==readingRevision)return null;
  const filename=`river-tarot-ig-story-${Date.now()}.png`;
  let file=null;
  try{ file=new File([blob],filename,{type:'image/png'}); }catch(e){ file=blob; file.name=filename; }
  if(window.__riverShareUrl) URL.revokeObjectURL(window.__riverShareUrl);
  const url=URL.createObjectURL(blob);
  window.__riverShareUrl=url;
  cachedShareAsset={blob,file,url,filename};
  $('storyPreviewImage').src=url;
  $('storyDownload').href=url;
  $('storyDownload').download=filename;
  if(showStatusMsg) $('shareStatus').textContent='分享圖準備完成。';
  return cachedShareAsset;
}

function prepareShareAsset(){
  const revision=readingRevision;
  cachedShareAsset=null;
  shareAssetPromise=generateShareImage(false).catch(err=>{
    console.error('prepareShareAsset',err);
    if(revision===readingRevision)cachedShareAsset=null;
    return null;
  });
}

function downloadShareAsset(asset){
  const a=document.createElement('a');
  a.href=asset.url;
  a.download=asset.filename || 'river-tarot.png';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>a.remove(),100);
}

async function shareReading(){
  if(!readingResult || current.length!==4 || !current.every(c=>c.revealed)){
    $('shareStatus').textContent='請等待 AI 解讀完成，再分享。';
    return;
  }
  $('storyPreview').hidden=false;
  const revision=readingRevision;
  const button=$('shareReadingBtn');
  button.disabled=true;
  $('shareStatus').textContent='正在準備分享…';
  try{
    let asset=cachedShareAsset;
    if(!asset){
      asset=shareAssetPromise?await shareAssetPromise:await generateShareImage(false);
      if(revision!==readingRevision)return;
      if(!asset) throw new Error('No share asset');
      $('shareStatus').textContent='IG 限動圖片已準備好，請再按一次分享。';
      return;
    }
    if(!asset) throw new Error('No share asset');
    const text=buildShareCaption();

    // iPhone/iPad Safari: pre-generating the file keeps the share action reliable.
    if(navigator.share && asset.file){
      const shareData={files:[asset.file]};
      const canShare=!navigator.canShare || navigator.canShare({files:[asset.file]});
      if(canShare){
        try{
          await navigator.share(shareData);
          if(revision!==readingRevision)return;
          $('shareStatus').textContent='已交給系統分享。請在 Instagram 選「限時動態」；若沒有此選項，請儲存圖片後從 IG 新增限動。';
          return;
        }catch(err){
          if(revision!==readingRevision)return;
          if(err && err.name==='AbortError'){
            $('shareStatus').textContent='已取消分享。需要的話再按一次即可。';
            return;
          }
          console.warn('Web Share failed',err);
        }
      }
    }

    downloadShareAsset(asset);
    try{ if(navigator.clipboard?.writeText) await navigator.clipboard.writeText(text); }catch(e){}
    if(revision!==readingRevision)return;
    $('shareStatus').textContent='限動圖片已下載。開啟 Instagram → ＋ → 限時動態 → 選取剛儲存的圖片。';
  }catch(err){
    if(revision!==readingRevision)return;
    console.error(err);
    $('shareStatus').textContent='分享暫時失敗。請再按一次；若仍失敗，重新整理頁面後重試。';
  }finally{
    if(revision===readingRevision)button.disabled=false;
  }
}

async function renderAnalysis(){
  if(current.length!==4 || !current.every(c=>c.revealed) || aiSession.pending)return;
  if(readingResult)return;
  const revision=readingRevision;
  $('revealPrompt').textContent='四張牌已翻開，正在理解你的問題與牌組。';
  $('readingStatus').textContent='RIVER 正在為這個問題解牌，請稍候…';
  $('retryReadingBtn').hidden=true;
  $('readingAnalysis').setAttribute('aria-busy','true');
  try{
    const result=await aiSession.request({topic,question:questionText,cards:current.map(c=>({id:c.id,orientation:c.orientation}))},window.RIVER_CONFIG?.readingEndpoint);
    if(revision!==readingRevision || !result)return;
    readingResult=result;
    const r=buildAnalysis();
    $('analysisText').textContent=r.overall;
    $('comboText').textContent=r.connections;
    $('conclusionText').textContent=r.conclusion;
    $('readingAnalysis').classList.remove('hidden');
    $('readingStatus').textContent='AI 已依照你的問題完成解讀。';
    $('revealPrompt').textContent='點選任一張牌，可查看它如何對應你的問題。';
    showCardDetail(detailIndex);
    $('shareReadingBtn').disabled=false;
    prepareShareAsset();
  }catch(error){
    if(revision!==readingRevision)return;
    $('readingStatus').textContent=error instanceof TypeError?'解牌服務連線失敗，請確認網路後重試。':error.message;
    $('revealPrompt').textContent='牌組已保留，重新解讀不會重新抽牌。';
    $('retryReadingBtn').hidden=false;
  }finally{
    if(revision===readingRevision)$('readingAnalysis').setAttribute('aria-busy','false');
  }
}


function updateClock(){
  const d=new Date();
  clock.textContent=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})+' · '+d.toLocaleDateString('en-US',{month:'short',day:'2-digit'});
}

init();


// Original city-pop-inspired background loop. Browsers block sound before user interaction,
// so the first tap/click starts playback; the control remains available at bottom right.
(function setupBackgroundMusic(){
  const audio=document.getElementById('bgMusic');
  const button=document.getElementById('musicToggle');
  if(!audio||!button)return;
  audio.volume=.38;
  let userPaused=false;
  const sync=()=>{
    const playing=!audio.paused;
    button.classList.toggle('playing',playing);
    button.setAttribute('aria-pressed',String(playing));
    button.setAttribute('aria-label',playing?'Pause background music':'Play background music');
    const icon=button.querySelector('.music-icon');
    if(icon)icon.textContent=playing?'Ⅱ':'▶';
  };
  async function playMusic(){
    try{await audio.play();sync()}catch(e){sync()}
  }
  button.addEventListener('click',async()=>{
    if(audio.paused){userPaused=false;await playMusic()}else{userPaused=true;audio.pause();sync()}
  });
  const firstGesture=()=>{
    if(!userPaused&&audio.paused)playMusic();
    document.removeEventListener('pointerdown',firstGesture);
    document.removeEventListener('keydown',firstGesture);
  };
  document.addEventListener('pointerdown',firstGesture,{once:true});
  document.addEventListener('keydown',firstGesture,{once:true});
  audio.addEventListener('play',sync);
  audio.addEventListener('pause',sync);
  sync();
})();
