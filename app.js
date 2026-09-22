let cards = [];
let topic = 'love';
let shuffledDeck = [];
let selected = [];
let current = [];
let shuffleTimer = null;

const topicLabels = {
  love: '♥ LOVE',
  career: '▣ CAREER',
  money: '◉ MONEY',
  general: '✦ GENERAL'
};
const topicTitles = { love:'LOVE', career:'CAREER', money:'MONEY', general:'GENERAL GUIDANCE' };
const positions = ['PAST','PRESENT','FUTURE'];
const positionZH = ['過去','現在','未來'];
const orientationZH = {upright:'正位', reversed:'逆位'};
const topicZH = {love:'感情', career:'工作', money:'財務', general:'整體'};
const suitEN = {'權杖':'Wands','聖杯':'Cups','寶劍':'Swords','星幣':'Pentacles'};
const suitProfiles = {
  Wands:{focus:'action, desire, confidence and momentum', love:'chemistry and initiative', career:'ambition and execution', money:'expansion and calculated risk', general:'direction and momentum'},
  Cups:{focus:'emotion, connection, intuition and receptivity', love:'emotional reciprocity and intimacy', career:'fulfillment and relationships at work', money:'values and emotional spending', general:'inner truth and feeling'},
  Swords:{focus:'thought, communication, conflict and decisions', love:'communication and mental tension', career:'strategy, pressure and choices', money:'judgment, contracts and risk', general:'clarity and decision-making'},
  Pentacles:{focus:'stability, resources, the body and long-term results', love:'consistency and commitment', career:'skills, work and tangible results', money:'income, assets and practical security', general:'grounding and real-world foundations'}
};

const majorMeaning = {
'00-fool':['new beginnings, freedom, trust and a leap into the unknown','recklessness, hesitation, poor timing or fear of beginning'],
'01-magician':['agency, skill, focus and turning potential into action','scattered energy, manipulation or unused ability'],
'02-high-priestess':['intuition, hidden knowledge, patience and inner listening','blocked intuition, secrecy or ignoring what you already sense'],
'03-empress':['growth, nurture, creativity, attraction and abundance','overgiving, stagnation, dependence or neglected self-care'],
'04-emperor':['structure, boundaries, leadership and stability','rigidity, control, weak boundaries or misuse of authority'],
'05-hierophant':['tradition, guidance, commitment and established systems','questioning convention, restriction or choosing your own path'],
'06-lovers':['alignment, meaningful choice, attraction and shared values','misalignment, mixed signals, conflict in values or difficult choices'],
'07-chariot':['direction, determination, movement and self-command','loss of direction, force without control or stalled momentum'],
'08-strength':['courage, patience, self-control and calm confidence','self-doubt, reactive behavior or strength turned inward'],
'09-hermit':['reflection, distance, wisdom and purposeful solitude','isolation, withdrawal or avoiding the insight you need'],
'10-wheel-of-fortune':['change, cycles, timing and a turning point','resistance to change, delays or repeating an old cycle'],
'11-justice':['truth, balance, accountability and fair consequences','imbalance, avoidance, bias or consequences not yet faced'],
'12-hanged-man':['pause, surrender, perspective and seeing differently','stagnation, resistance or sacrificing without purpose'],
'13-death':['ending, release, transformation and necessary transition','clinging to the past, delayed endings or fear of change'],
'14-temperance':['balance, healing, integration and measured progress','excess, poor timing, imbalance or lack of integration'],
'15-devil':['attachment, temptation, desire and patterns that bind','releasing attachment, seeing the pattern or reclaiming choice'],
'16-tower':['disruption, revelation and a structure that can no longer hold','avoided change, private upheaval or resisting an inevitable truth'],
'17-star':['hope, renewal, healing and trust in the path ahead','discouragement, disconnection or difficulty believing again'],
'18-moon':['uncertainty, intuition, projection and what is not yet clear','confusion lifting, hidden truth emerging or fear losing its grip'],
'19-sun':['clarity, joy, confidence and visible success','temporary clouds, delayed joy or confidence that needs rebuilding'],
'20-judgement':['awakening, reckoning, decision and answering a larger call','self-doubt, avoidance or refusing a needed decision'],
'21-world':['completion, integration, achievement and closure','unfinished business, delay or a cycle not fully completed']
};

const minorMeaning = {
  Wands:{
    Ace:['inspiration, desire and a fresh burst of creative energy','false starts, low energy or a spark that has not found direction'],
    '2':['planning, future vision and choosing a direction','fear of the unknown, poor planning or staying too small'],
    '3':['expansion, foresight and progress already underway','delays, limited growth or expectations that need revision'],
    '4':['celebration, belonging and a stable milestone','tension at home, instability or celebration delayed'],
    '5':['competition, friction and testing yourself against others','avoiding conflict, internal tension or conflict beginning to settle'],
    '6':['recognition, confidence and visible progress','self-doubt, private success or recognition that does not arrive'],
    '7':['defending your position, courage and holding your ground','exhaustion, defensiveness or giving away your position'],
    '8':['speed, messages, movement and rapid development','delays, mixed signals or scattered momentum'],
    '9':['resilience, boundaries and staying alert near the finish','fatigue, guardedness or difficulty trusting the process'],
    '10':['burden, responsibility and carrying too much','release, delegation or collapse under unnecessary weight'],
    Page:['curiosity, news, experimentation and a new spark','inconsistent effort, immature action or news that stalls'],
    Knight:['passion, pursuit, bold movement and adventure','impulsiveness, hot-and-cold energy or action without staying power'],
    Queen:['confidence, magnetism, independence and warm leadership','jealousy, insecurity or confidence turned performative'],
    King:['vision, leadership, bold direction and mature ambition','domination, impatience or vision without listening']
  },
  Cups:{
    Ace:['emotional opening, love, intuition and a full heart','blocked feelings, emotional depletion or love held back'],
    '2':['mutual attraction, partnership and emotional reciprocity','imbalance, distance or a bond that is not meeting equally'],
    '3':['friendship, celebration and emotional support','overindulgence, gossip or social tension'],
    '4':['withdrawal, contemplation and emotional reassessment','renewed interest, movement after apathy or seeing an overlooked offer'],
    '5':['loss, disappointment and focus on what went wrong','healing, acceptance or beginning to see what remains'],
    '6':['nostalgia, familiarity and the return of the past','outgrowing the past, unrealistic nostalgia or moving forward'],
    '7':['many options, fantasy and difficulty choosing clearly','clarity, narrowing choices or seeing through illusion'],
    '8':['walking away, emotional maturity and seeking something deeper','fear of leaving, returning to the familiar or avoiding closure'],
    '9':['satisfaction, pleasure and a wish close to fulfillment','overindulgence, shallow satisfaction or wanting more than enough'],
    '10':['emotional harmony, family joy and shared fulfillment','disconnection, family tension or an ideal that does not match reality'],
    Page:['emotional message, tenderness, curiosity and intuitive openness','emotional immaturity, mixed signals or sensitivity without expression'],
    Knight:['romance, invitation, charm and following the heart','idealization, inconsistency or promises without grounding'],
    Queen:['empathy, intuition, emotional maturity and deep listening','emotional overwhelm, dependency or absorbing too much from others'],
    King:['emotional balance, diplomacy and steady compassion','emotional control, suppression or manipulation through calmness']
  },
  Swords:{
    Ace:['clarity, truth, breakthrough and a decisive idea','confusion, harsh thinking or truth that has not fully surfaced'],
    '2':['stalemate, guarded choice and weighing two sides','decision pressure, information overload or avoidance breaking down'],
    '3':['heartbreak, separation and painful truth','recovery, forgiveness or pain beginning to release'],
    '4':['rest, recovery and strategic pause','restlessness, burnout or returning before you are ready'],
    '5':['conflict, ego, winning at a cost and tension','reconciliation, walking away from conflict or unresolved resentment'],
    '6':['transition, moving on and leaving rough water behind','difficulty moving on, baggage or a transition that stalls'],
    '7':['strategy, secrecy and acting outside the obvious route','truth exposed, self-deception ending or a poor strategy revealed'],
    '8':['restriction, fear and feeling trapped by perspective','release, new options or recognizing where you still have choice'],
    '9':['anxiety, worry and thoughts that grow in the dark','relief, facing fear or anxiety beginning to loosen'],
    '10':['painful ending, finality and the lowest point of a cycle','recovery, survival or refusing to let an ending finish'],
    Page:['curiosity, observation, messages and mental alertness','gossip, nervous thinking or watching without understanding'],
    Knight:['direct action, speed, conviction and forceful communication','recklessness, aggression or charging ahead without context'],
    Queen:['discernment, independence, boundaries and clear truth','bitterness, cold judgment or cutting before understanding'],
    King:['logic, authority, strategy and disciplined thinking','misused intellect, rigidity or controlling the narrative']
  },
  Pentacles:{
    Ace:['a practical opportunity, resources and a seed for long-term value','missed opportunity, poor planning or unstable foundations'],
    '2':['adaptability, juggling priorities and managing change','overload, imbalance or too many moving parts'],
    '3':['teamwork, craft, learning and building something well','poor collaboration, uneven effort or work below potential'],
    '4':['security, control and protecting what you have','loosening control, fear of loss or unhealthy attachment to security'],
    '5':['scarcity, financial pressure and feeling unsupported','recovery, help becoming visible or hardship beginning to ease'],
    '6':['giving, receiving, fairness and resource exchange','strings attached, imbalance or unequal exchange'],
    '7':['patience, assessment and waiting for results','impatience, poor return or effort that needs redirection'],
    '8':['practice, discipline, skill-building and steady work','perfectionism, boredom or effort without refinement'],
    '9':['independence, earned comfort and self-sufficiency','dependence, overwork or appearances masking insecurity'],
    '10':['legacy, long-term security and shared material stability','instability, family money tension or weak long-term structure'],
    Page:['study, planning, a practical message and new material potential','procrastination, poor follow-through or unrealistic planning'],
    Knight:['consistency, responsibility, patience and dependable progress','stagnation, stubborn routine or effort without adaptation'],
    Queen:['practical care, resourcefulness, security and grounded confidence','overwork, neglect of self or insecurity around stability'],
    King:['material mastery, stewardship, stability and reliable leadership','greed, rigidity or measuring worth only by material control']
  }
};

const specialCombos = [
  ['06-lovers','two-of-cups','The Lovers with Two of Cups intensifies mutual attraction, shared values and reciprocity. If either is reversed, the real question becomes whether both people are choosing the same relationship.'],
  ['06-lovers','15-devil','The Lovers with The Devil creates a strong attraction-versus-attachment theme. Chemistry is real, but freedom, boundaries and choice matter more than intensity alone.'],
  ['16-tower','17-star','The Tower with The Star is a classic break-and-rebuild sequence: disruption clears space for a more honest kind of hope.'],
  ['13-death','21-world','Death with The World strongly emphasizes closure. One chapter is not asking to be repaired; it is asking to be completed so the next can begin.'],
  ['18-moon','02-high-priestess','The Moon with The High Priestess magnifies intuition and uncertainty at the same time. Listen inward, but separate intuition from fear and projection.'],
  ['19-sun','17-star','The Sun with The Star strengthens clarity, recovery and renewed confidence. The path becomes easier to see, even though action is still required.'],
  ['01-magician','07-chariot','The Magician with The Chariot combines skill with momentum. You probably need less preparation than you think and more focused execution.'],
  ['09-hermit','12-hanged-man','The Hermit with The Hanged Man slows the reading down. Distance and a changed perspective may reveal more than pushing for an immediate answer.'],
  ['04-emperor','03-empress','The Emperor with The Empress balances structure and nurture. The strongest outcome comes from holding boundaries without losing warmth or flexibility.'],
  ['11-justice','20-judgement','Justice with Judgement emphasizes accountability and a decision that can no longer be postponed. Facts matter more than wishful interpretation.'],
  ['08-strength','07-chariot','Strength with The Chariot is disciplined momentum. Progress comes from directing power, not simply using more force.'],
  ['15-devil','16-tower','The Devil with The Tower suggests an unhealthy attachment or pattern may be forced into the open. Facing it early gives you more choice in how the change happens.']
];

async function init(){
  cards = await fetch('tarot.json').then(r=>r.json());
  bindUI();
  updateClock();
  setInterval(updateClock,1000);
}

function bindUI(){
  document.querySelectorAll('.topic').forEach(btn=>btn.addEventListener('click',()=>{
    topic=btn.dataset.topic;
    document.querySelectorAll('.topic').forEach(x=>x.classList.toggle('active',x===btn));
  }));
  beginBtn.addEventListener('click',openSpread);
  homeNav.addEventListener('click',()=>show('home'));
  readingNav.addEventListener('click',()=>{ if(current.length===3) show('reading'); else openSpread(); });
  changeQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBottomBtn.addEventListener('click',()=>show('home'));
  chooseClearBtn.addEventListener('click',()=>openSpread(true));
  chooseRevealBtn.addEventListener('click',revealReading);
  askChatGPTBtn.addEventListener('click',openChatGPTReading);
  shareImageBtn.addEventListener('click',async()=>{await generateShareImage(true);});
  shareIGBtn.addEventListener('click',shareToInstagram);
  chooseAgainBtn.addEventListener('click',()=>openSpread(true));
}

function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  if(typeof homeNav!=='undefined') homeNav.classList.toggle('active',id==='home');
  if(typeof readingNav!=='undefined') readingNav.classList.toggle('active',id==='choose'||id==='reading');
  window.scrollTo({top:0,behavior:'smooth'});
}

function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

function openSpread(isReshuffle=false){
  selected=[];
  shuffledDeck=shuffle(cards);
  chooseTopicBadge.textContent=topicLabels[topic];
  chooseCounter.textContent='0 / 3 SELECTED';
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
  if(selected.length>=3 || selected.some(c=>c.id===id)) return;
  const base=cards.find(c=>c.id===id);
  const item={...base,orientation:Math.random()<.5?'upright':'reversed',revealed:false};
  const slot=document.querySelector(`.choose-slot[data-slot="${selected.length}"]`);
  flyToSlot(el,slot);
  selected.push(item);
  el.classList.add('selected');
  renderSlots();
  const n=selected.length;
  chooseCounter.textContent=`${n} / 3 SELECTED`;
  chooseHint.textContent=n===1?'Now choose the card for your present.':n===2?'One last card — choose your future.':'Your three cards are chosen.';
  if(n===3){
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
      slot.innerHTML=`<span>${positions[i]}</span><small>${['FIRST','SECOND','THIRD'][i]} CARD</small>`;
    }
  });
}

function revealReading(){
  if(selected.length!==3)return;
  current=selected.map(c=>({...c,revealed:false}));
  readingTopic.textContent=topicTitles[topic];
  renderSpread();
  detail.innerHTML='<h3>牌卡解析</h3><p>請依序翻開三張牌，再點選任一張牌查看中文解讀。</p>';
  readingAnalysis.classList.add('hidden');
  revealPrompt.textContent='依序翻開三張牌，完整解析會在全部翻開後出現。';
  show('reading');
}

function renderSpread(){
  const subtitles=['WHAT YOU CARRY','WHAT IS HERE','WHAT MAY UNFOLD'];
  spread.innerHTML=current.map((c,i)=>`<div class="slot"><button class="card ${c.revealed?'revealed':''}" data-i="${i}" aria-label="Reveal ${positions[i]} card"><span class="card-inner"><span class="card-face card-back"></span><span class="card-face card-front ${c.orientation==='reversed'?'reversed':''}"><img src="${c.image}" alt="${c.en}"></span></span></button><h4>${positions[i]}</h4><small>${subtitles[i]}</small></div>`).join('');
  spread.querySelectorAll('.card').forEach(el=>el.addEventListener('click',()=>turnCard(Number(el.dataset.i))));
}

function turnCard(i){
  current[i].revealed=true;
  renderSpread();
  showCardDetail(i);
  if(current.every(c=>c.revealed)) renderAnalysis();
}

function suitOf(c){return suitEN[c.suit]||'';}
function coreMeaning(c){
  const side=c.orientation==='upright'?'upright':'reversed';
  return c.meanings?.[side]?.core || (side==='upright'?c.upright:c.reversed) || '';
}
function orientationLabel(c){return orientationZH[c.orientation]||c.orientation;}

function topicMeaning(c){
  const side=c.orientation==='upright'?'upright':'reversed';
  return c.meanings?.[side]?.[topic] || c.meanings?.[side]?.general || coreMeaning(c);
}

function riverMeaning(c){
  const side=c.orientation==='upright'?'upright':'reversed';
  return c.river?.[side] || '';
}

function showCardDetail(i){
  const c=current[i];
  detail.innerHTML=`<div class="detail-card-line"><img class="mini ${c.orientation==='reversed'?'rev':''}" src="${c.image}" alt="${c.en}"><div><p class="eyebrow">${positionZH[i]} · ${positions[i]}</p><h2>${c.zh} <small>${c.en}</small></h2><div class="orientation">${orientationLabel(c)}</div></div></div><h3>核心牌義</h3><p>${coreMeaning(c)}</p><h3>${topicZH[topic]}解讀</h3><p>${topicMeaning(c)}</p><h3>RIVER READING</h3><p>${riverMeaning(c)}</p>`;
}

function cardSeed(){return current.reduce((n,c,i)=>n+(c.id+1)*(i+5)+(c.orientation==='reversed'?71:0),topic.length*29);}
function chooseVariant(arr,offset=0){return arr[(cardSeed()+offset)%arr.length];}
function capitalize(s){return s? s.charAt(0).toUpperCase()+s.slice(1):'';}
function isUp(c){return c.orientation==='upright';}

function orientationPattern(){
  const ups=current.filter(isUp).length;
  if(ups===3)return '三張皆為正位，代表目前的能量較順，事情具備往前發展的條件；重點是把可用的資源真正落實。';
  if(ups===0)return '三張皆為逆位，顯示這次問題較偏向內在阻礙、延遲或反覆模式。比起急著求結果，更適合先處理卡住的核心。';
  if(!isUp(current[0])&&isUp(current[1])&&isUp(current[2]))return '牌勢由逆轉正，代表過去的阻力正在鬆動，現在開始出現比較能掌握的空間。';
  if(isUp(current[0])&&isUp(current[1])&&!isUp(current[2]))return '前兩張能量較順，但未來牌逆位，像是提前提醒：若目前模式不調整，後面可能出現阻力。';
  return ups===2?'兩張正位、一張逆位，整體仍有可運用的力量，但有一個關鍵環節需要特別調整。':'只有一張正位，這張牌就是目前最值得抓住的資源，其餘部分宜先整理再推進。';
}

function majorPattern(){
  const majors=current.filter(c=>c.arcana==='major').length;
  if(majors===3)return '三張都是大阿爾克那，代表這次問題牽涉的不是短暫情緒，而是較大的價值、方向或人生階段轉換。';
  if(majors===2)return '出現兩張大阿爾克那，表示這次選擇的影響可能比表面事件更深，值得把長期後果一起考量。';
  if(majors===1)return '其中一張大阿爾克那是整組牌的主軸，尤其要留意它落在過去、現在或未來哪個位置。';
  return '三張皆為小阿爾克那，焦點偏向日常互動、實際選擇與可調整的行動，變動空間相對較大。';
}

function suitPattern(){
  const minors=current.filter(c=>c.arcana==='minor');
  const counts={}; minors.forEach(c=>{counts[c.suit]=(counts[c.suit]||0)+1;});
  const e=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!e.length)return '';
  const map={
    '權杖':'權杖強調行動、熱情、企圖與推進',
    '聖杯':'聖杯強調感受、關係、直覺與情緒交流',
    '寶劍':'寶劍強調思考、溝通、衝突與判斷',
    '星幣':'星幣強調現實條件、資源、穩定與長期成果'
  };
  if(e[0][1]>=2)return `${e[0][1]===3?'三張':'兩張'}同屬${e[0][0]}，因此「${map[e[0][0]]}」會是這次解讀的主要脈絡。`;
  if(e.length>=2)return `這組牌同時混合${e[0][0]}與${e[1][0]}的能量，表示不能只看單一面向，需要在不同需求之間取得平衡。`;
  return '';
}

function specialConnections(){
  const slugs=new Set(current.map(c=>c.slug));
  const zh=[
    ['06-lovers','two-of-cups','「戀人＋聖杯二」把互相吸引、價值一致與雙向回應放到核心；若其中有逆位，更要觀察兩個人是否真的選擇同一段關係。'],
    ['06-lovers','15-devil','「戀人＋惡魔」代表強烈吸引與依附同時存在。喜歡不等於適合，界線、自由與控制感比激情本身更重要。'],
    ['16-tower','17-star','「高塔＋星星」是典型的先破後立：舊結構被打開後，才有機會重新建立更真實的希望。'],
    ['13-death','21-world','「死神＋世界」強烈指向一個週期的結束與完成，重點不是回到原樣，而是接受收尾並進入下一階段。'],
    ['18-moon','02-high-priestess','「月亮＋女祭司」讓直覺與不確定性同時升高。感受值得聽，但要分清楚直覺、恐懼與投射。'],
    ['19-sun','17-star','「太陽＋星星」加強清晰、恢復與信心，代表方向逐漸看得見，但仍需要實際行動。'],
    ['01-magician','07-chariot','「魔術師＋戰車」結合能力與推進力，與其繼續準備，不如集中資源往明確方向執行。'],
    ['09-hermit','12-hanged-man','「隱者＋吊人」會讓節奏慢下來。此時換角度、拉開距離，比硬推更容易看見真正答案。'],
    ['04-emperor','03-empress','「皇帝＋皇后」形成規則與滋養的互補，最好的發展通常來自界線與彈性同時存在。'],
    ['11-justice','20-judgement','「正義＋審判」強調責任、事實與重新判斷，有些決定已經不適合再拖延。'],
    ['08-strength','07-chariot','「力量＋戰車」代表有紀律的推進。真正有效的前進不是更用力，而是把力量放在正確方向。'],
    ['15-devil','16-tower','「惡魔＋高塔」提醒依附、慣性或壓抑已久的問題可能被迫浮上檯面；越早主動面對，越能保留選擇。']
  ];
  return zh.filter(x=>slugs.has(x[0])&&slugs.has(x[1])).map(x=>x[2]);
}

function pairTransition(a,b,label){
  let relation='延續到';
  if(!isUp(a)&&isUp(b)) relation='逐漸鬆動，轉向';
  if(isUp(a)&&!isUp(b)) relation='遇到阻力，轉成';
  if(!isUp(a)&&!isUp(b)) relation='仍有未解的部分，進一步形成';
  return `${label}：${a.zh}（${orientationLabel(a)}）的「${coreMeaning(a)}」${relation}${b.zh}（${orientationLabel(b)}）的「${coreMeaning(b)}」。`;
}

function topicConclusion(){
  const p=isUp(current[1]), f=isUp(current[2]);
  const key=(p?'p':'n')+(f?'p':'n');
  const base={
    love:{pp:'目前關係中有可運用的情感能量，未來仍有發展空間。重點是觀察投入、誠實與回應是否雙向。',pn:'現在看起來仍有可行之處，但未來牌出現阻力。界線、期待與溝通需要先處理，否則吸引力容易變成消耗。',np:'現在仍卡住，但未來開始打開。只要核心問題能被說清楚、行為也跟著改變，發展仍有空間。',nn:'現在與未來都偏阻滯。與其問「怎麼讓它發生」，更值得問「這段互動是否真的符合我的需要與界線」。'},
    career:{pp:'現在有可用資源，未來也具備前進條件。把方向化成具體成果，並確認時間、能力與資源能否承接。',pn:'目前可能看得到機會，但未來有瓶頸。條件、時機、合作方式或執行策略需要重新設計。',np:'現在雖然困難，但未來有打開的跡象。先處理最關鍵的瓶頸，比同時解決所有問題更有效。',nn:'現在與未來都偏阻力，這比較像一次策略重整：先重新評估路線、成本與條件，再決定是否繼續加力。'},
    money:{pp:'財務方向較可控，但仍要以現金流、風險與可承受範圍驗證。正位並不等於保證獲利。',pn:'目前資源看似可用，但未來有風險訊號。先確認成本、期限、合約與退出條件。',np:'目前壓力有機會改善，但順序應該是先修補、再擴張。先穩定責任與漏洞，再承擔新風險。',nn:'現在與未來都偏保守訊號。減少不必要曝險、保留流動性，等數字更清楚後再做選擇。'},
    general:{pp:'現在與未來具有連續性，你已經握有可用資源，穩定執行比頻繁換方向更重要。',pn:'現在能推進，但未來有阻力。越早加入風險管理，越能避免問題累積。',np:'現在卡住，但未來有打開的可能。把當前障礙視為流程問題，而不是最終答案。',nn:'現在與未來都要求簡化。先降低雜訊、重新排序優先順序，再決定下一步。'}
  };
  return base[topic][key];
}

function adviceSteps(){
  const pools={
    love:[
      ['先看行為，不只看感覺。觀察對方的回應是否穩定、主動且一致。','若你想推進，提出一個低壓、清楚的小邀請，讓關係進入可觀察的回應。','若互動反覆消耗你，先收回注意力，保護界線，再決定是否繼續投入。'],
      ['把「你希望對方怎麼想」和「對方實際怎麼做」分開。','安排一次誠實但不逼迫的對話，確認彼此期待是否一致。','如果答案仍然模糊，就把時間拉長一點，讓對方用行動而不是嘴巴證明。'],
      ['不要只問有沒有火花，也要問這段關係是否健康。','把你的底線與需要寫出來，避免被情緒牽著走。','先追求互相、穩定、可持續，再決定是否更深投入。']
    ],
    career:[
      ['把現在牌意轉成七天內能完成的一個動作，例如投遞、談條件、完成作品或練技能。','找出最卡的瓶頸，只修正最影響結果的那一項。','用實際回饋判斷是否繼續，不要只停留在想像中的可能性。'],
      ['把時間、收入、成長與可持續性列成一張表。','先確認你當下最需要的是曝光、穩定、學習，還是現金流。','做決定時讓現實條件與長期方向同時進場。'],
      ['如果局勢混亂，先縮小目標，不必一次全改。','先完成一個最小可行行動，再從結果修正策略。','把焦慮轉成節奏：今天做什麼、這週完成什麼、下週檢查什麼。']
    ],
    money:[
      ['先做一張數字表：現金、固定支出、負債、預備金與可承受損失。','先保護現金流，再考慮新的投入或擴張。','任何高風險決定都先設定上限與退出條件。'],
      ['把「想要」與「負擔得起」分開。','若涉及投資、合夥或大額消費，先確認最壞情況是否承受得住。','穩住基本盤後，再追求成長或報酬。'],
      ['如果你正感到壓力，先止漏而不是硬撐。','減少不必要曝險，保留彈性與流動性。','等資訊更清楚，再做更大的承諾。']
    ],
    general:[
      ['把三張牌當作行動順序：停止重複的舊模式、使用現在可用的資源、朝未來較健康的方向走。','先做一個小步驟，不用一次解決全部。','觀察真實回饋，再決定下一步。'],
      ['問自己：我現在真正能影響的是什麼？','把注意力從失控部分移回可行動部分。','一旦方向開始清楚，就穩定執行，不必過度反覆。'],
      ['如果你感到卡住，先簡化環境與選項。','把優先順序排出來，一次處理一件事。','用可驗證的結果替代過度腦補與猜測。']
    ]
  };
  const steps=chooseVariant(pools[topic],17).slice();
  const present=current[1];
  steps.push(isUp(present)?`把現在位置「${present.zh}」最健康的特質落實到今天就能做的一個具體行動。`:`先處理現在位置「${present.zh}」逆位所指出的卡點，再談加速或推進。`);
  return steps.slice(0,3);
}
function adviceText(){
  return `你現在最需要的不是更多猜測，而是把牌組的提醒轉成可執行的小步驟。先從一個最實際、最可驗證的行動開始，讓答案透過行動浮現。`;
}

function buildAnalysis(){
  const [past,present,future]=current;
  const opening=chooseVariant([
    `這組${topicZH[topic]}牌比較適合當成一條連續故事來讀，而不是三個彼此獨立的答案。`,
    `重點在於變化：過去形成了什麼、現在要求你看見什麼，以及如果目前模式延續，未來可能走向哪裡。`,
    `這三張牌的訊息藏在前後關係裡。比起單看一張牌，更重要的是能量如何從過去流向現在，再走向未來。`
  ]);
  const flow=` 過去是「${past.zh}」${orientationLabel(past)}：${coreMeaning(past)}；現在是「${present.zh}」${orientationLabel(present)}：${coreMeaning(present)}；未來是「${future.zh}」${orientationLabel(future)}：${coreMeaning(future)}。`;
  const overall=`${opening}${flow} ${orientationPattern()} ${majorPattern()}`;
  const connections=[pairTransition(past,present,'過去 → 現在'),pairTransition(present,future,'現在 → 未來'),suitPattern(),...specialConnections()].filter(Boolean).join(' ');
  const futureFrame=isUp(future)?`未來位置的「${future.zh}」描述的是目前模式繼續下去時的一種可能方向，它仍需要真實選擇與行動才會變得具體。`:`未來位置的「${future.zh}」逆位比較適合視為需要調整或避免的模式，而不是一定會發生的預言。`;
  const conclusion=`${topicConclusion()} ${futureFrame}`;
  return {overall,connections,conclusion,advice:adviceText()};
}

function openChatGPTReading(){
  if(current.length!==3)return;
  const cardLines=current.map((c,i)=>`${positionZH[i]}：${c.zh}（${c.en}）${orientationLabel(c)}`).join('；');
  const prompt=`請用繁體中文深入解讀我的三張塔羅牌。主題：${topicZH[topic]}。牌陣是過去／現在／未來。${cardLines}。請分析三張牌彼此的連動、正逆位的影響、時間線的轉折、可能的核心問題與具體行動建議；不要把塔羅當成必然預言，請把它當作反思與決策參考。`;
  const url='https://chatgpt.com/?q='+encodeURIComponent(prompt);
  window.open(url,'_blank','noopener,noreferrer');
}


function buildShareCaption(){
  const cardLines=current.map((c,i)=>`${positionZH[i]}｜${c.zh} ${orientationLabel(c)}`).join('\n');
  const summary=conclusionText.textContent || buildAnalysis().conclusion;
  const steps=adviceSteps();
  return `River Tarot 三張牌解讀\n主題：${topicZH[topic]}\n${cardLines}\n\n結論：${summary}\n\n行動建議：\n1. ${steps[0]}\n2. ${steps[1]}\n3. ${steps[2]}\n\n#RiverTarot #塔羅 #TarotReading`;
}

async function generateShareImage(showStatusMsg=false){
  if(current.length!==3 || !current.every(c=>c.revealed)){
    if(showStatusMsg) shareStatus.textContent='請先翻開三張牌，再生成分享圖。';
    return null;
  }
  if(showStatusMsg) shareStatus.textContent='正在生成分享圖…';
  const canvas=document.getElementById('shareCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#0b1020'); bg.addColorStop(.55,'#12152f'); bg.addColorStop(1,'#1b1031');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  for(let i=0;i<90;i++){ctx.fillStyle=`rgba(220,200,255,${Math.random()*0.8})`; ctx.fillRect(Math.random()*W,Math.random()*H*.55,2,2)}
  ctx.strokeStyle='rgba(196,124,237,.55)'; ctx.lineWidth=4; ctx.strokeRect(22,22,W-44,H-44);
  ctx.fillStyle='#efe7ff'; ctx.font='bold 58px Georgia'; ctx.fillText('RIVER TAROT',74,96);
  ctx.fillStyle='#cbb7ea'; ctx.font='28px Courier New'; ctx.fillText(`三張牌解讀  ·  ${topicZH[topic]}`,76,142);
  ctx.fillStyle='#dcd2ef'; ctx.font='22px serif';
  const dateStr=new Date().toLocaleDateString('zh-TW'); ctx.fillText(dateStr,W-220,96);
  const imgs=await Promise.all(current.map(c=>loadImg(c.image)));
  const cardW=240, cardH=360, topY=190; const xs=[110,420,730];
  imgs.forEach((img,i)=>{
    const x=xs[i], y=topY + (i===1?0:18);
    ctx.save();
    ctx.translate(x+cardW/2,y+cardH/2);
    const ang=i===0?-0.08:i===2?0.08:0;
    ctx.rotate(ang);
    if(current[i].orientation==='reversed') ctx.rotate(Math.PI);
    ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=18; ctx.fillStyle='#e8d7b8'; roundRect(ctx,-cardW/2,-cardH/2,cardW,cardH,12); ctx.fill();
    ctx.drawImage(img,-cardW/2+8,-cardH/2+8,cardW-16,cardH-16);
    ctx.restore();
    ctx.fillStyle='#f3ebff'; ctx.font='bold 27px Courier New'; ctx.textAlign='center'; ctx.fillText(positionZH[i], x+cardW/2, topY+cardH+62);
    ctx.fillStyle='#cfb3ff'; ctx.font='22px "Microsoft JhengHei"'; ctx.fillText(`${current[i].zh} ${orientationLabel(current[i])}`, x+cardW/2, topY+cardH+95);
  });
  ctx.textAlign='left';
  ctx.fillStyle='rgba(10,12,22,.55)'; roundRect(ctx,64,700,952,255,18); ctx.fill(); ctx.strokeStyle='rgba(145,111,194,.7)'; ctx.stroke();
  ctx.fillStyle='#b7f2dd'; ctx.font='bold 28px "Microsoft JhengHei"'; ctx.fillText('結論',86,742);
  ctx.fillStyle='#f2edf9'; ctx.font='24px "Microsoft JhengHei"';
  let y=wrapText(ctx,(conclusionText.textContent || buildAnalysis().conclusion),86,782,905,36,4);
  ctx.fillStyle='#b7f2dd'; ctx.font='bold 28px "Microsoft JhengHei"'; ctx.fillText('行動建議',86,y+20);
  ctx.fillStyle='#f2edf9'; ctx.font='23px "Microsoft JhengHei"';
  const steps=adviceSteps();
  steps.forEach((t,idx)=>{ y=wrapText(ctx,`${idx+1}. ${t}`,92,y+62,890,32,2); y+=10; });
  ctx.fillStyle='#d5c5ec'; ctx.font='20px Courier New'; ctx.fillText('riverlee1031-cpu.github.io/River-Tarot',76,H-68);
  ctx.fillStyle='#c3a5ea'; ctx.font='20px Courier New'; ctx.fillText('v1.2 · UPDATE 02',W-270,H-68);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  const file=new File([blob],`river-tarot-${Date.now()}.png`,{type:'image/png'});
  window.__riverShareFile=file;
  window.__riverShareUrl=URL.createObjectURL(blob);
  if(showStatusMsg) shareStatus.textContent='分享圖已生成，可直接分享到 IG 或先下載。';
  return {blob,file,url:window.__riverShareUrl};
}

async function shareToInstagram(){
  if(current.length!==3 || !current.every(c=>c.revealed)){
    shareStatus.textContent='請先翻開三張牌，再分享。';
    return;
  }
  const asset = window.__riverShareFile ? {file:window.__riverShareFile,url:window.__riverShareUrl} : await generateShareImage(false);
  const text=buildShareCaption();
  try{
    if(navigator.share && navigator.canShare && navigator.canShare({files:[asset.file]})){
      await navigator.share({files:[asset.file],title:'River Tarot Reading',text});
      shareStatus.textContent='已開啟分享視窗，若手機支援可直接選擇 Instagram。';
      return;
    }
  }catch(err){/* fall through */}
  const a=document.createElement('a'); a.href=asset.url; a.download=asset.file.name; a.click();
  try{ await navigator.clipboard.writeText(text); shareStatus.textContent='已下載分享圖，並複製貼文文字。接著可手動上傳到 IG。'; }
  catch(e){ shareStatus.textContent='已下載分享圖。IG 網頁無法保證直接帶圖發布，請手動上傳到 IG。'; }
}

function renderAnalysis(){
  revealPrompt.textContent='三張牌已全部翻開，以下為完整中文解析。';
  const r=buildAnalysis();
  analysisText.textContent=r.overall;
  comboText.textContent=r.connections;
  conclusionText.textContent=r.conclusion;
  adviceText.innerHTML=renderAdviceHTML(r.advice, adviceSteps());
  readingAnalysis.classList.remove('hidden');
}

function renderAdviceHTML(intro,steps){
  return `<p class="advice-intro">${intro}</p><ol>${steps.map(s=>`<li>${s}</li>`).join('')}</ol>`;
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
