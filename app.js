let cards = [];
let topic = 'love';
let shuffledDeck = [];
let selected = [];
let current = [];
let shuffleTimer = null;
let shareAssetPromise = null;
let cachedShareAsset = null;

const $ = (id)=>document.getElementById(id);
let questionText = '';


const topicLabels = {
  love: '♥ LOVE',
  career: '▣ CAREER',
  money: '◉ MONEY',
  general: '✦ GENERAL'
};
const topicTitles = { love:'LOVE', career:'CAREER', money:'MONEY', general:'GENERAL GUIDANCE' };
const positions = ['ME','THEM','CURRENT DYNAMIC','ADVICE'];
const positionZH = ['我','對方','關係現況','建議'];
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
  questionInput.addEventListener('input',()=>{
    if(questionInput.value.length>50) questionInput.value=questionInput.value.slice(0,50);
    questionText=questionInput.value.trim().slice(0,50);
    questionCount.textContent=`${questionInput.value.length} / 50`;
    beginBtn.disabled=questionText.length===0;
    questionHint.textContent=questionText.length? '問題已收好。接下來交給你的直覺。':'先寫下問題，再讓牌開始說話。';
  });
  beginBtn.addEventListener('click',openSpread);
  homeNav.addEventListener('click',()=>show('home'));
  readingNav.addEventListener('click',()=>{ if(current.length===4) show('reading'); else openSpread(); });
  changeQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBottomBtn.addEventListener('click',()=>show('home'));
  chooseClearBtn.addEventListener('click',()=>openSpread(true));
  chooseRevealBtn.addEventListener('click',revealReading);
  askChatGPTBtn.addEventListener('click',openChatGPTReading);
  shareReadingBtn.addEventListener('click',shareReading);
  chooseAgainBtn.addEventListener('click',()=>openSpread(true));
}

function show(id){
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
    questionText=(questionInput?.value||'').trim().slice(0,50);
    if(!questionText){
      questionInput?.focus();
      questionHint.textContent='請先寫下你的問題（50字內）。';
      return;
    }
  }
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
  chooseHint.textContent=n===1?'Now choose the card that represents them.':n===2?'Now choose the card for your current dynamic.':n===3?'One last card — choose your advice.':'Your four cards are chosen.';
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
  const subtitles=['YOUR ENERGY','THEIR ENERGY','WHAT EXISTS BETWEEN YOU','WHAT HELPS MOST'];
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

function plainMeaning(c,i){
  const core=coreMeaning(c);
  const positionLead=[
    '這張牌放在「我」，是在照出你現在帶進問題裡的狀態',
    '這張牌放在「對方」，是在描述對方目前較可能呈現的態度',
    '這張牌放在「關係現況」，是在說明你們現在反覆上演的互動模式',
    '這張牌放在「建議」，是在提醒你最值得採取的方向'
  ][i];
  const turn=isUp(c)
    ? `正位讓「${core}」比較容易直接發揮；有機會就用，但不用演成八點檔主角。`
    : `逆位表示「${core}」可能卡住、過量或還沒說出口；先修正節奏，不必急著替結局配樂。`;
  return `${positionLead}。${turn}`;
}

function showCardDetail(i){
  const c=current[i];
  detail.innerHTML=`<div class="detail-card-line"><img class="mini ${c.orientation==='reversed'?'rev':''}" src="${c.image}" alt="${c.en}"><div><p class="eyebrow">${positionZH[i]} · ${positions[i]}</p><h2>${c.zh} <small>${c.en}</small></h2><div class="orientation">${orientationLabel(c)}</div></div></div><h3>核心牌義</h3><p>${coreMeaning(c)}</p><h3>簡單說</h3><p>${plainMeaning(c,i)}</p><h3>${topicZH[topic]}解讀</h3><p>${topicMeaning(c)}</p><h3>RIVER READING</h3><p>${riverMeaning(c)}</p>`;
}

function cardSeed(){return current.reduce((n,c,i)=>n+(c.id+1)*(i+5)+(c.orientation==='reversed'?71:0),topic.length*29);}
function chooseVariant(arr,offset=0){return arr[(cardSeed()+offset)%arr.length];}
function capitalize(s){return s? s.charAt(0).toUpperCase()+s.slice(1):'';}
function isUp(c){return c.orientation==='upright';}

function orientationPattern(){
  const ups=current.filter(isUp).length;
  const subject={love:'這段關係',career:'這個工作議題',money:'這個財務決定',general:'目前的處境'}[topic];
  if(ups===4)return `四張皆為正位，代表${subject}有較多可運用的空間，重點是把想法、條件與行動真正對上。`;
  if(ups===0)return `四張皆為逆位，顯示${subject}容易卡在資訊、壓力或節奏失衡。比起急著定義結果，更適合先處理眼前問題。`;
  if(ups===3)return `三正一逆，整體仍偏順，但那張逆位就是${subject}最需要處理的卡點。`;
  if(ups===2)return `兩正兩逆，代表${subject}有可行空間，也有明顯阻力；這不是沒有答案，而是條件與節奏還沒完全對上。`;
  return `只有一張正位，表示目前可用的突破口很集中。先抓住那個最清楚的資源，不要一次硬推${subject}。`;
}

function majorPattern(){
  const majors=current.filter(c=>c.arcana==='major').length;
  const subject={love:'這段互動',career:'這個工作議題',money:'這個財務決定',general:'目前的處境'}[topic];
  if(majors>=3)return `四張中有${majors}張大阿爾克那，${subject}牽涉的主題較深，可能不只是短暫情緒，而是價值、界線或人生階段的碰撞。`;
  if(majors===2)return `出現兩張大阿爾克那，表示${subject}有一定份量，值得看長期模式，不只看眼前感受。`;
  if(majors===1)return '其中一張大阿爾克那是這組牌的主軸，尤其要看它落在「我、對方、關係現況、建議」哪個位置。';
  return '四張皆為小阿爾克那，焦點偏向日常互動與可調整的行為，代表變動空間其實不小。';
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
  if(e[0][1]>=2)return `${e[0][1]===4?'四張':e[0][1]===3?'三張':'兩張'}同屬${e[0][0]}，因此「${map[e[0][0]]}」會是這次解讀的主要脈絡。`;
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

function relationshipConclusion(){
  const [me,them,dynamic,advice]=current;
  const uprightCount=current.filter(isUp).length;
  const topicFrame={
    love:['你這邊的情感與期待','對方目前的回應能量','這段關係'],
    career:['你目前的工作立場與能力','相關人物或環境的回應','這個工作局面'],
    money:['你面對金錢與風險的狀態','市場、合作方或現實條件','這個財務局面'],
    general:['你目前帶進問題的狀態','外在人物或環境的回應','目前的整體處境']
  }[topic];
  const meTone=isUp(me)?`${topicFrame[0]}相對清楚、願意面對`:`${topicFrame[0]}可能有保留、猶豫或內耗`;
  const themTone=isUp(them)?`${topicFrame[1]}較開放或有可用空間`:`${topicFrame[1]}比較保留、延遲或有自己的卡點`;
  const dynamicTone=isUp(dynamic)?`${topicFrame[2]}的「${dynamic.zh}」正位表示仍有可被看見、可被推進的部分`:`${topicFrame[2]}的「${dynamic.zh}」逆位提醒，現在最重要的不是硬推結果，而是先看清楚失衡或誤解在哪裡`;
  const adviceTone=isUp(advice)?`建議牌「${advice.zh}」正位比較像一句明確提示：採取它最健康、最成熟的做法`:`建議牌「${advice.zh}」逆位是在提醒你別用力過頭，先修正舊模式，再決定是否推進`;
  const punchline={
    love:uprightCount>=2?'簡單說：有戲，但先別把預告片直接剪成大結局。':'簡單說：目前訊號有點差，腦補再大聲也不會自動變成雙向。',
    career:uprightCount>=2?'簡單說：局面能動，但真正升級的是方向，不是忙碌音效。':'簡單說：先別把加班當成進度條，它有時只是螢幕保護程式。',
    money:uprightCount>=2?'簡單說：機會可以看，錢包仍要保持清醒，不要讓它酒後駕駛。':'簡單說：現在比較適合看清條件，別讓衝動替信用卡主持會議。',
    general:uprightCount>=2?'簡單說：門有打開，但腳還是要自己跨，宇宙不提供代走服務。':'簡單說：現在霧比較厚，先看清路，別急著跟命運比誰踩油門快。'
  }[topic];
  return `${meTone}；${themTone}。${dynamicTone}。${adviceTone}。${punchline}`;
}

function buildAnalysis(){
  const [me,them,dynamic,advice]=current;
  const questionFrame=questionText?`針對你寫下的問題「${questionText}」，`:'這次牌陣中，';
  const frames={
    love:['你目前帶進這段關係的狀態','對方在這段互動中的能量','你們目前真正存在的互動模式'],
    career:['你目前面對工作的狀態','相關人物、團隊或環境的回應','工作局面的實際運作方式'],
    money:['你目前面對金錢與風險的狀態','市場、合作方或現實條件的回應','財務局面的實際發展'],
    general:['你目前帶進問題的狀態','外在人物或環境的回應','事情現在的運作方式']
  }[topic];
  const humor={love:'感情不是密室逃脫，不必每個眼神都解成摩斯密碼。',career:'工作不是靠忙碌音效過關，真正有用的是方向與回應。',money:'錢包沒有第六感，數字與條件還是要坐主桌。',general:'宇宙可以給提示，但它通常不幫忙代填人生選擇題。'}[topic];
  const overall=`${questionFrame}「${me.zh}」${orientationLabel(me)}說明${frames[0]}；「${them.zh}」${orientationLabel(them)}反映${frames[1]}；「${dynamic.zh}」${orientationLabel(dynamic)}點出${frames[2]}；最後的「${advice.zh}」${orientationLabel(advice)}則替整組牌收尾。${orientationPattern()} ${majorPattern()} ${humor}`;
  const connections=[
    pairTransition(me,them,'我 ↔ 對方'),
    `現況牌「${dynamic.zh}」${orientationLabel(dynamic)}把焦點放在「${coreMeaning(dynamic)}」。`,
    `收尾牌「${advice.zh}」${orientationLabel(advice)}則強調「${coreMeaning(advice)}」。`,
    suitPattern(),
    ...specialConnections()
  ].filter(Boolean).join(' ');
  const conclusion=relationshipConclusion();
  return {overall,connections,conclusion};
}

function openChatGPTReading(){
  if(current.length!==4)return;
  const cardLines=current.map((c,i)=>`${positionZH[i]}：${c.zh}（${c.en}）${orientationLabel(c)}`).join('；');
  const prompt=`請用繁體中文深入解讀我的四張關係塔羅牌。我的問題是：「${questionText}」。牌陣位置依序是：我／對方／關係現況／建議。${cardLines}。請清楚分析雙方能量差異、目前互動核心、正逆位影響與可能盲點，語氣自然並帶一點幽默，但不要把塔羅當成必然預言。最後只給一段明確結論，不要另外列行動建議。`;
  const url='https://chatgpt.com/?q='+encodeURIComponent(prompt);
  window.open(url,'_blank','noopener,noreferrer');
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
  const content=String(text||'');
  const chars=[...content];
  let line='';
  const lines=[];
  for(let i=0;i<chars.length;i++){
    const test=line+chars[i];
    if(ctx.measureText(test).width>maxWidth && line){
      lines.push(line);
      line=chars[i];
      if(maxLines && lines.length>=maxLines-1){
        const rest=chars.slice(i+1).join('');
        if(rest) line=line+'…';
        break;
      }
    }else{
      line=test;
    }
  }
  if(line && (!maxLines || lines.length<maxLines)) lines.push(line);
  lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
  return y+Math.max(1,lines.length)*lineHeight;
}

function buildShareCaption(){
  const cardLines=current.map((c,i)=>`${positionZH[i]}｜${c.zh} ${orientationLabel(c)}`).join('\n');
  const summary=$('conclusionText').textContent || buildAnalysis().conclusion;
  return `River Tarot 四張關係牌解讀\n主題：${topicZH[topic]}\n問題：${questionText}\n${cardLines}\n\n結論：${summary}\n\n#RiverTarot #塔羅 #TarotReading`;
}

async function generateShareImage(showStatusMsg=false){
  if(current.length!==4 || !current.every(c=>c.revealed)){
    if(showStatusMsg) $('shareStatus').textContent='請先翻開四張牌，再分享。';
    return null;
  }
  if(showStatusMsg) $('shareStatus').textContent='正在準備分享圖…';
  const canvas=$('shareCanvas');
  const ctx=canvas.getContext('2d');
  const W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0b1020'); bg.addColorStop(.55,'#12152f'); bg.addColorStop(1,'#1b1031');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(196,124,237,.55)'; ctx.lineWidth=4; ctx.strokeRect(22,22,W-44,H-44);

  ctx.fillStyle='#efe7ff'; ctx.font='bold 58px Georgia, serif'; ctx.textAlign='left';
  ctx.fillText('RIVER TAROT',74,96);
  ctx.fillStyle='#cbb7ea'; ctx.font='28px Courier New, monospace';
  ctx.fillText(`四張關係牌陣  ·  ${topicZH[topic]}`,76,142);
  ctx.fillStyle='#e7d9ee'; ctx.font='23px sans-serif';
  wrapText(ctx,`問題：${questionText}`,76,178,900,30,2);
  ctx.fillStyle='#dcd2ef'; ctx.font='22px serif';
  ctx.fillText(new Date().toLocaleDateString('zh-TW'),W-220,96);

  const imgs=[];
  for(const c of current){ imgs.push(await loadImg(c.image)); }
  const cardW=190, cardH=285, topY=235, xs=[70,325,580,835];
  imgs.forEach((img,i)=>{
    const x=xs[i], y=topY+(i===1?0:18);
    ctx.save();
    ctx.translate(x+cardW/2,y+cardH/2);
    ctx.rotate(i===0?-0.055:i===3?0.055:0);
    if(current[i].orientation==='reversed') ctx.rotate(Math.PI);
    ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=18;
    ctx.fillStyle='#e8d7b8'; roundRect(ctx,-cardW/2,-cardH/2,cardW,cardH,12); ctx.fill();
    ctx.drawImage(img,-cardW/2+8,-cardH/2+8,cardW-16,cardH-16);
    ctx.restore();
    ctx.fillStyle='#f3ebff'; ctx.font='bold 27px Courier New, monospace'; ctx.textAlign='center';
    ctx.fillText(positionZH[i],x+cardW/2,topY+cardH+62);
    ctx.fillStyle='#cfb3ff'; ctx.font='22px sans-serif';
    ctx.fillText(`${current[i].zh} ${orientationLabel(current[i])}`,x+cardW/2,topY+cardH+95);
  });

  ctx.textAlign='left';
  ctx.fillStyle='rgba(10,12,22,.64)'; roundRect(ctx,64,690,952,485,18); ctx.fill();
  ctx.strokeStyle='rgba(145,111,194,.7)'; ctx.stroke();
  ctx.fillStyle='#b7f2dd'; ctx.font='bold 28px sans-serif'; ctx.fillText('結論',86,732);
  ctx.fillStyle='#f2edf9'; ctx.font='23px sans-serif';
  wrapText(ctx,($('conclusionText').textContent || buildAnalysis().conclusion),86,772,905,36,8);
  ctx.fillStyle='#cbb7ea'; ctx.font='italic 23px serif';
  ctx.fillText('牌不替你決定，但會把霧打亮。',86,1112);
  ctx.fillStyle='#d5c5ec'; ctx.font='20px Courier New, monospace';
  ctx.fillText('riverlee1031-cpu.github.io/River-Tarot',76,H-68);
  ctx.fillStyle='#c3a5ea'; ctx.fillText('v1.9 · UPDATE 09',W-270,H-68);

  let blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png',1));
  if(!blob){
    const dataUrl=canvas.toDataURL('image/png');
    const res=await fetch(dataUrl);
    blob=await res.blob();
  }
  const filename=`river-tarot-${Date.now()}.png`;
  let file=null;
  try{ file=new File([blob],filename,{type:'image/png'}); }catch(e){ file=blob; file.name=filename; }
  if(window.__riverShareUrl) URL.revokeObjectURL(window.__riverShareUrl);
  const url=URL.createObjectURL(blob);
  window.__riverShareUrl=url;
  cachedShareAsset={blob,file,url,filename};
  if(showStatusMsg) $('shareStatus').textContent='分享圖準備完成。';
  return cachedShareAsset;
}

function prepareShareAsset(){
  cachedShareAsset=null;
  shareAssetPromise=generateShareImage(false).catch(err=>{
    console.error('prepareShareAsset',err);
    cachedShareAsset=null;
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
  if(current.length!==4 || !current.every(c=>c.revealed)){
    $('shareStatus').textContent='請先翻開四張牌，再分享。';
    return;
  }
  const button=$('shareReadingBtn');
  button.disabled=true;
  $('shareStatus').textContent='正在準備分享…';
  try{
    let asset=cachedShareAsset;
    if(!asset && shareAssetPromise) asset=await shareAssetPromise;
    if(!asset) asset=await generateShareImage(false);
    if(!asset) throw new Error('No share asset');
    const text=buildShareCaption();

    // iPhone/iPad Safari: pre-generating the file keeps the share action reliable.
    if(navigator.share && asset.file){
      const shareData={title:'River Tarot Reading',text,files:[asset.file]};
      const canShare=!navigator.canShare || navigator.canShare({files:[asset.file]});
      if(canShare){
        try{
          await navigator.share(shareData);
          $('shareStatus').textContent='分享視窗已開啟，可選 Instagram、訊息或「儲存影像」。';
          return;
        }catch(err){
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
    $('shareStatus').textContent='此瀏覽器無法直接叫出 IG；分享圖已下載，可直接從照片上傳到 Instagram。';
  }catch(err){
    console.error(err);
    $('shareStatus').textContent='分享暫時失敗。請再按一次；若仍失敗，重新整理頁面後重試。';
  }finally{
    button.disabled=false;
  }
}

function renderAnalysis(){
  $('revealPrompt').textContent='四張牌已全部翻開，以下為完整中文解析。';
  const r=buildAnalysis();
  $('analysisText').textContent=r.overall;
  $('comboText').textContent=r.connections;
  $('conclusionText').textContent=r.conclusion;
  $('readingAnalysis').classList.remove('hidden');
  prepareShareAsset();
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
