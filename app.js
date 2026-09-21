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
  changeQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBtn.addEventListener('click',()=>show('home'));
  newQuestionBottomBtn.addEventListener('click',()=>show('home'));
  chooseClearBtn.addEventListener('click',()=>openSpread(true));
  chooseRevealBtn.addEventListener('click',revealReading);
  chooseAgainBtn.addEventListener('click',()=>openSpread(true));
}

function show(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
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
  detail.innerHTML='<h3>CARD READING</h3><p>Turn over a card to explore its meaning.</p>';
  readingAnalysis.classList.add('hidden');
  revealPrompt.textContent='Turn over each card to reveal your reading.';
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
  const idx=c.orientation==='upright'?0:1;
  if(c.arcana==='major')return (majorMeaning[c.slug]||['change and reflection','blocked or internalized energy'])[idx];
  const suit=suitOf(c); return (minorMeaning[suit]?.[c.rank]||['development and practical reflection','blocked or delayed expression'])[idx];
}
function orientationLabel(c){return c.orientation==='upright'?'UPRIGHT':'REVERSED';}

function topicMeaning(c){
  const core=coreMeaning(c);
  const tone=c.orientation==='upright'?'This energy is available to work with now.':'This energy may be blocked, internalized or asking for adjustment.';
  const contexts={
    love:'In relationships, look at reciprocity, communication, boundaries and what is actually being shown through behavior.',
    career:'In work, connect this card to your direction, resources, timing and the next practical move you can verify.',
    money:'With money, ground the symbolism in cash flow, risk, commitments and what you can realistically afford.',
    general:'Use this card as a lens for what is changing, what you can influence and what deserves your attention next.'
  };
  return `${capitalize(core)}. ${tone} ${contexts[topic]}`;
}

function showCardDetail(i){
  const c=current[i];
  detail.innerHTML=`<div class="detail-card-line"><img class="mini ${c.orientation==='reversed'?'rev':''}" src="${c.image}" alt="${c.en}"><div><p class="eyebrow">${positions[i]}</p><h2>${c.en}</h2><div class="orientation">${orientationLabel(c)}</div></div></div><h3>CORE MEANING</h3><p>${capitalize(coreMeaning(c))}.</p><h3>${topicTitles[topic]} READING</h3><p>${topicMeaning(c)}</p>`;
}

function cardSeed(){return current.reduce((n,c,i)=>n+(c.id+1)*(i+5)+(c.orientation==='reversed'?71:0),topic.length*29);}
function chooseVariant(arr,offset=0){return arr[(cardSeed()+offset)%arr.length];}
function capitalize(s){return s? s.charAt(0).toUpperCase()+s.slice(1):'';}
function isUp(c){return c.orientation==='upright';}

function orientationPattern(){
  const ups=current.filter(isUp).length;
  if(ups===3)return 'All three cards are upright, so the story moves with relatively open energy. The main task is not to force progress, but to use what is already available well.';
  if(ups===0)return 'All three cards are reversed, which makes this reading more inward and corrective. Slow down, identify the pattern underneath the question, and avoid pushing for a quick external result.';
  if(!isUp(current[0])&&isUp(current[1])&&isUp(current[2]))return 'The sequence moves from blockage into openness. Something difficult from the past appears to be loosening as the present becomes more workable.';
  if(isUp(current[0])&&isUp(current[1])&&!isUp(current[2]))return 'The sequence starts with usable momentum but meets resistance in the future position. Treat that future card as an early warning rather than a fixed outcome.';
  return ups===2?'Two upright cards give the reading more available energy than resistance, but one point still needs conscious adjustment.':'One upright card stands out as the clearest resource in an otherwise more blocked or internal process.';
}

function majorPattern(){
  const majors=current.filter(c=>c.arcana==='major').length;
  if(majors===3)return 'All three are Major Arcana, so this question carries more weight than a passing mood. It points to a larger shift in values, identity, timing or direction.';
  if(majors===2)return 'Two Major Arcana cards make the underlying lesson more important than the surface details. The decision may have a longer emotional or practical impact.';
  if(majors===1)return 'One Major Arcana card acts like the anchor of the spread. Pay special attention to the position where it appears.';
  return 'With no Major Arcana cards, the reading is strongly connected to everyday choices, habits and practical actions that can still be changed.';
}

function suitPattern(){
  const minors=current.filter(c=>c.arcana==='minor');
  const counts={}; minors.forEach(c=>{const s=suitOf(c);counts[s]=(counts[s]||0)+1;});
  const e=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!e.length)return '';
  const [suit,count]=e[0];
  if(count>=2){const p=suitProfiles[suit];return `${count===3?'All three':'Two'} cards are ${suit}, so ${p.focus} is a central thread. For ${topicTitles[topic].toLowerCase()}, pay particular attention to ${p[topic]}.`;}
  if(e.length>=2){return `The spread mixes ${e[0][0]} with ${e[1][0]}, suggesting that ${suitProfiles[e[0][0]].focus} must be balanced with ${suitProfiles[e[1][0]].focus}.`;}
  return '';
}

function specialConnections(){
  const slugs=new Set(current.map(c=>c.slug));
  return specialCombos.filter(x=>slugs.has(x[0])&&slugs.has(x[1])).map(x=>x[2]);
}

function pairTransition(a,b,label){
  const aCore=coreMeaning(a).split(',')[0], bCore=coreMeaning(b).split(',')[0];
  let relation='continues into';
  if(!isUp(a)&&isUp(b)) relation='begins to open into';
  if(isUp(a)&&!isUp(b)) relation='meets resistance and shifts into';
  if(!isUp(a)&&!isUp(b)) relation='remains unresolved and develops into';
  return `${label}: ${a.en} (${aCore}) ${relation} ${b.en} (${bCore}).`;
}

function topicConclusion(){
  const p=isUp(current[1]), f=isUp(current[2]);
  const key=(p?'p':'n')+(f?'p':'n');
  const base={
    love:{pp:'There is usable emotional or relational energy in the present, and the future remains open. Watch whether attention, effort and honesty stay mutual instead of rushing to define the relationship.',pn:'There is something workable now, but the future card shows friction ahead. Boundaries, expectations or communication need attention before attraction turns into strain.',np:'The present is still blocked, yet the future opens. Progress is possible if the core issue is named clearly and behavior changes with it.',nn:'Both the present and future are more resistant. The useful question is not “How do I make this happen?” but “Does this dynamic actually meet my needs and boundaries?”'},
    career:{pp:'You have something usable now and the path can move forward. Convert direction into a concrete result and make sure time, energy and resources can support it.',pn:'An opportunity may be visible now, but the future position shows a bottleneck. Conditions, timing, collaboration or execution may need redesign.',np:'The present is difficult, but the future opens. Solve the most important bottleneck first instead of spreading effort across too many problems.',nn:'Both present and future suggest resistance. This is a strategy-reset reading: reconsider the route, conditions and cost before pushing harder.'},
    money:{pp:'The financial direction looks more manageable, but verify it through cash flow, downside risk and what you can genuinely afford. Upright cards are not profit guarantees.',pn:'Resources may look available now, but the future warns that risk could appear later. Check costs, deadlines, contracts and exit conditions.',np:'Current pressure can improve, but the best sequence is repair first, expansion second. Close leaks and stabilize obligations before adding new risk.',nn:'Both present and future are cautionary. Reduce unnecessary exposure, protect liquidity and delay optional risk until the numbers are clearer.'},
    general:{pp:'The present and future have continuity. You already hold some useful resources, so steady follow-through matters more than repeatedly changing direction.',pn:'The present works, but the future shows resistance. Add risk management now instead of waiting for the problem to become obvious.',np:'The present is blocked, but the future opens. Treat the current obstacle as a process problem, not a final verdict.',nn:'Both present and future ask for simplification. Slow down, reduce noise and reorder priorities before deciding what comes next.'}
  };
  return base[topic][key];
}

function adviceText(){
  const pools={
    love:[
      'Return to observable behavior: consistency, effort, boundaries and whether both people are actually participating. Choose one honest, low-pressure conversation instead of filling gaps with assumptions.',
      'Separate what you hope the other person feels from what they repeatedly do. If you want to move closer, take one small action that lets you observe a real response.',
      'Do not ask only whether there is chemistry. Ask whether the connection can be healthy, mutual and sustainable. Let behavior carry more weight than fantasy.'
    ],
    career:[
      'Turn the present card into one action you can complete within seven days: apply, negotiate, finish a piece of work, practice a skill or verify a condition. Let evidence guide the next step.',
      'Find the single biggest bottleneck. List time, pay, skill, cooperation and risk, then fix the one factor that most affects the outcome.',
      'Bring the decision back to real conditions: opportunity cost, growth, income, workload and sustainability. Symbolism can show direction; facts decide whether the route works.'
    ],
    money:[
      'Make a numbers-first snapshot: cash, fixed expenses, debt, reserves and maximum acceptable loss. Decide on new commitments only after those are visible.',
      'Protect cash flow before chasing returns. If the question involves investment or a large purchase, define a limit, an exit condition and the worst-case scenario first.',
      'Separate “I want this” from “I can safely carry this.” Stabilize essentials and downside risk before expanding.'
    ],
    general:[
      'Use the spread as an order of operations: stop repeating the past pattern, use the strength of the present card, then move toward the healthier expression of the future card.',
      'Do not solve everything at once. Choose one small step that can test the direction today, then use real feedback before asking the cards again.',
      'Ask one practical question: “What can I influence right now?” Start there. The rest of the reading becomes clearer through action.'
    ]
  };
  const present=current[1];
  const finalLine=isUp(present)?`${present.en} is the strongest usable resource in the present position. Put its healthiest quality into action.`:`${present.en} reversed is the first knot to untangle. Work on that pattern before trying to force the future.`;
  return `${chooseVariant(pools[topic],17)} ${finalLine}`;
}

function buildAnalysis(){
  const [past,present,future]=current;
  const opening=chooseVariant([
    `This ${topicTitles[topic].toLowerCase()} reading works best as one moving story rather than three separate answers.`,
    `The key is the transition: what the past created, what the present asks of you, and what the future may become if the pattern continues.`,
    `Read these cards as a sequence. The strongest message is not any single card, but how the energy changes from one position to the next.`
  ]);
  const flow=` Past: ${past.en} (${orientationLabel(past)}) — ${coreMeaning(past)}. Present: ${present.en} (${orientationLabel(present)}) — ${coreMeaning(present)}. Future: ${future.en} (${orientationLabel(future)}) — ${coreMeaning(future)}.`;
  const overall=`${opening}${flow} ${orientationPattern()} ${majorPattern()}`;
  const connections=[pairTransition(past,present,'Past → Present'),pairTransition(present,future,'Present → Future'),suitPattern(),...specialConnections()].filter(Boolean).join(' ');
  const futureFrame=isUp(future)?`${future.en} describes a possible direction if the current pattern continues; it still needs real choices and action to become concrete.`:`${future.en} reversed is better read as a pattern to adjust or avoid, not a prediction that must happen.`;
  const conclusion=`${topicConclusion()} ${futureFrame}`;
  return {overall,connections,conclusion,advice:adviceText()};
}

function renderAnalysis(){
  revealPrompt.textContent='Your full reading is open.';
  const r=buildAnalysis();
  analysisText.textContent=r.overall;
  comboText.textContent=r.connections;
  conclusionText.textContent=r.conclusion;
  adviceText.textContent=r.advice;
  readingAnalysis.classList.remove('hidden');
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
