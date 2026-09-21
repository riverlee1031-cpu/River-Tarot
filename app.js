let cards=[], topic='love', current=[], manualSelection=[], readingMode='random', shuffledDeck=[];
const topicLabels={love:'♥ LOVE',career:'▣ CAREER',money:'◉ MONEY',general:'✦ GENERAL'};
const topicNames={love:'感情',career:'工作',money:'財務',general:'整體狀態'};
const positionNames=['過去','現在','未來'];

const suitProfiles={
  '權杖':{element:'火',focus:'行動、企圖、熱情與推進',love:'吸引力與主動性',career:'企圖心與執行力',money:'開拓與風險承擔',general:'動能與方向'},
  '聖杯':{element:'水',focus:'情緒、關係、直覺與感受',love:'情感交流與親密',career:'人際感受與工作滿足',money:'情緒性消費與價值感',general:'內在感受'},
  '寶劍':{element:'風',focus:'思考、溝通、衝突與決斷',love:'溝通與認知落差',career:'決策、競爭與壓力',money:'判斷、合約與風險',general:'思考與選擇'},
  '星幣':{element:'土',focus:'現實、資源、身體與長期成果',love:'穩定與承諾',career:'能力、職位與實際成果',money:'收入、資產與現金流',general:'現實基礎'}
};
const rankProfiles={
  'Ace':{stage:1,label:'起點',meaning:'新機會與原始潛力'},'2':{stage:2,label:'選擇',meaning:'平衡、互動與兩端拉扯'},'3':{stage:3,label:'形成',meaning:'合作、成長與初步成果'},'4':{stage:4,label:'穩定',meaning:'建立結構，也可能停滯'},'5':{stage:5,label:'變動',meaning:'摩擦、失衡與調整'},'6':{stage:6,label:'修復',meaning:'重新取得平衡與前進'},'7':{stage:7,label:'考驗',meaning:'評估、堅持與策略'},'8':{stage:8,label:'推進',meaning:'力量集中、加速與熟練'},'9':{stage:9,label:'成熟',meaning:'接近完成，也帶來壓力或收穫'},'10':{stage:10,label:'完成',meaning:'一個週期走到極致或收尾'},
  'Page':{stage:2,label:'訊息',meaning:'學習、探索、消息與初始互動'},'Knight':{stage:6,label:'行動者',meaning:'追求、移動、推進與態度'},'Queen':{stage:8,label:'內在掌控',meaning:'成熟、接納、照顧與內在權威'},'King':{stage:9,label:'外在掌控',meaning:'責任、決策、領導與穩定控制'}
};
const majorProfiles={
  '00-fool':['new_start','freedom','risk'], '01-magician':['agency','manifest','skill'], '02-high-priestess':['intuition','hidden','patience'],
  '03-empress':['growth','care','abundance'], '04-emperor':['structure','control','authority'], '05-hierophant':['tradition','commitment','system'],
  '06-lovers':['choice','bond','values'], '07-chariot':['drive','victory','direction'], '08-strength':['courage','self_control','patience'],
  '09-hermit':['reflection','distance','wisdom'], '10-wheel-of-fortune':['change','cycle','timing'], '11-justice':['truth','balance','consequence'],
  '12-hanged-man':['pause','surrender','perspective'], '13-death':['ending','transformation','release'], '14-temperance':['balance','healing','integration'],
  '15-devil':['attachment','temptation','bondage'], '16-tower':['disruption','truth','breakdown'], '17-star':['hope','healing','renewal'],
  '18-moon':['uncertainty','emotion','illusion'], '19-sun':['clarity','success','joy'], '20-judgement':['awakening','decision','reckoning'],
  '21-world':['completion','achievement','closure']
};
const specialCombos=[
  {a:'06-lovers',b:'two-of-cups',text:'「戀人＋聖杯二」把關係、價值一致與雙向互動放到核心；若兩張皆正位，互相確認的訊號較強，若其中有逆位，則更像是在檢查彼此是否真正站在同一邊。'},
  {a:'06-lovers',b:'15-devil',text:'「戀人＋惡魔」形成強烈吸引與依附的對照：喜歡不等於健康，關鍵是自由選擇、界線與是否存在控制。'},
  {a:'16-tower',b:'17-star',text:'「高塔＋星星」常呈現先破後立：原有結構被打開之後，才有機會重新建立更真實的希望與方向。'},
  {a:'13-death',b:'21-world',text:'「死神＋世界」把結束感放大，代表某個週期已接近真正收尾；重點不是回到原樣，而是進入下一階段。'},
  {a:'18-moon',b:'02-high-priestess',text:'「月亮＋女祭司」讓直覺與未知同時升高；感受值得聽，但更需要區分直覺、恐懼與投射。'},
  {a:'19-sun',b:'17-star',text:'「太陽＋星星」提升清晰、恢復與信心的主題；它更像是方向變明朗，而不是保證所有事情自動成功。'},
  {a:'01-magician',b:'07-chariot',text:'「魔術師＋戰車」把主動性與執行力疊加，代表目前不是缺方法，而是要把資源集中到一條清楚路線。'},
  {a:'09-hermit',b:'12-hanged-man',text:'「隱者＋吊人」會放慢節奏；與其硬推，不如暫時抽離、換角度，讓真正的答案浮現。'},
  {a:'04-emperor',b:'03-empress',text:'「皇帝＋皇后」形成結構與滋養的互補；最好的發展往往來自規則與彈性同時存在。'},
  {a:'11-justice',b:'20-judgement',text:'「正義＋審判」強調結果、責任與重新判斷；現在需要的是誠實面對事實，而不是延後決定。'},
  {a:'08-strength',b:'07-chariot',text:'「力量＋戰車」是控制與推進的組合；真正有效的前進不是更用力，而是把力氣用在正確方向。'},
  {a:'15-devil',b:'16-tower',text:'「惡魔＋高塔」提醒被壓住的依附、慣性或問題可能被迫浮出；越早主動面對，越能降低失控感。'}
];

async function init(){cards=await fetch('tarot.json').then(r=>r.json());setupNav();setupTopics();renderPreview();renderDeck();renderHistory();updateClock();setInterval(updateClock,1000);draw(false)}
function setupNav(){
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>show(b.dataset.view));
  document.querySelectorAll('[data-goto]').forEach(b=>b.onclick=()=>show(b.dataset.goto));
  startBtn.onclick=()=>{readingMode='random';drawBtn.textContent='↻ DRAW AGAIN';show('reading');draw(true)};
  chooseBtn.onclick=openChoose;chooseBackBtn.onclick=()=>show('home');chooseClearBtn.onclick=reshuffleManual;chooseRevealBtn.onclick=revealManualReading;
  drawBtn.onclick=()=>readingMode==='manual'?openChoose():draw(true);saveBtn.onclick=saveHistory;shareBtn.onclick=shareResult;
  clearHistory.onclick=()=>{localStorage.removeItem('riverTarotHistory');renderHistory()};
}
function show(id){document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.nav').forEach(n=>n.classList.toggle('active',n.dataset.view===id));if(id==='history')renderHistory();window.scrollTo({top:0,behavior:'smooth'})}
function setupTopics(){document.querySelectorAll('.topic').forEach(b=>b.onclick=()=>{topic=b.dataset.topic;document.querySelectorAll('.topic').forEach(x=>x.classList.toggle('active',x===b));topicBadge.textContent=topicLabels[topic];chooseTopicBadge.textContent=topicLabels[topic]})}
function renderPreview(){let sample=[cards.find(c=>c.slug==='18-moon'),cards.find(c=>c.slug==='17-star'),cards.find(c=>c.slug==='09-hermit')];previewCards.innerHTML=sample.map(c=>`<img src="${c.image}" alt="${c.zh}">`).join('')}
function draw(revealView=true){if(!cards.length)return;readingMode='random';drawBtn.textContent='↻ DRAW AGAIN';let pool=[...cards],picked=[];for(let i=0;i<3;i++){let n=Math.floor(Math.random()*pool.length);let c=pool.splice(n,1)[0];picked.push({...c,orientation:Math.random()<.5?'upright':'reversed',revealed:false})}current=picked;prepareReading(revealView)}
function prepareReading(revealView=true){renderSpread();detail.innerHTML='<h3>CARD READING</h3><p>點擊任一張牌翻開並查看牌義。</p>';summaryText.textContent='三張牌尚未全部揭曉。依序翻開「過去／現在／未來」。';readingAnalysis.classList.add('hidden');analysisText.textContent='';comboText.textContent='';conclusionText.textContent='';adviceText.textContent='';cautionText.textContent='';status.textContent='';if(revealView)show('reading')}
function renderSpread(){const pos=[['PAST','WHAT YOU CARRY'],['PRESENT','WHAT IS HERE'],['FUTURE','WHAT COULD BE']];spread.classList.remove('one-card');spread.innerHTML=current.map((c,i)=>`<div class="slot"><div class="card ${c.revealed?'revealed':''}" data-i="${i}"><div class="card-inner"><div class="card-face card-back"></div><div class="card-face card-front ${c.orientation==='reversed'?'reversed':''}"><img src="${c.image}" alt="${c.zh}"></div></div></div><h4>${pos[i][0]}</h4><small>${pos[i][1]}</small></div>`).join('');spread.querySelectorAll('.card').forEach(el=>el.onclick=()=>reveal(+el.dataset.i))}
function reveal(i){current[i].revealed=true;renderSpread();showDetail(i);if(current.every(c=>c.revealed))renderSummary()}
function showDetail(i){let c=current[i],o=c.orientation,key=topic;detail.innerHTML=`<h3>CARD READING</h3><img class="mini ${o==='reversed'?'rev':''}" src="${c.image}"><h2>${c.en}<br><small>${c.zh}</small></h2><div class="orientation">${o==='upright'?'UPRIGHT 正位':'REVERSED 逆位'}</div><h3>CORE MEANING</h3><p>${c.meanings[o].core}</p><h3>${topicLabels[key]} READING</h3><p>${c.meanings[o][key]}</p><h3>RIVER READING</h3><p>${c.river[o]}</p>`}
function renderSummary(){
  summaryText.textContent=current.map((c,i)=>`${positionNames[i]}：${c.zh}${c.orientation==='upright'?'正位':'逆位'} — ${c.meanings[c.orientation][topic]}`).join('　');
  const result=buildReadingAnalysis();analysisText.textContent=result.analysis;comboText.textContent=result.combo;conclusionText.textContent=result.conclusion;adviceText.textContent=result.advice;cautionText.textContent=result.caution;readingAnalysis.classList.remove('hidden');
}
function cardSeed(){return current.reduce((n,c,i)=>n+(c.id+1)*(i+7)+(c.orientation==='reversed'?97:0),topic.length*31)}
function chooseVariant(arr,offset=0){return arr[(cardSeed()+offset)%arr.length]}
function dir(c){return c.orientation==='upright'?'正位':'逆位'}
function shortCore(c){return c.meanings[c.orientation].core.split(/[、；]/).slice(0,2).join('、')}
function rankNumber(c){const p=rankProfiles[c.rank];return p?p.stage:null}
function cardTags(c){
  let tags=[];
  if(c.arcana==='major')tags.push(...(majorProfiles[c.slug]||[]));
  if(c.suit==='權杖')tags.push('action','passion');
  if(c.suit==='聖杯')tags.push('emotion','relationship');
  if(c.suit==='寶劍')tags.push('mind','communication');
  if(c.suit==='星幣')tags.push('reality','resource');
  if(c.orientation==='reversed')tags.push('blocked','internalized'); else tags.push('available','expressed');
  return tags;
}
function getSpecialCombos(){
  const slugs=new Set(current.map(c=>c.slug));
  return specialCombos.filter(x=>slugs.has(x.a)&&slugs.has(x.b)).map(x=>x.text);
}
function suitPattern(){
  const minors=current.filter(c=>c.arcana==='minor'&&c.suit);
  const counts={};minors.forEach(c=>counts[c.suit]=(counts[c.suit]||0)+1);
  const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
  if(!entries.length)return '';
  const [suit,count]=entries[0];
  if(count===3)return `三張牌都落在${suit}，${suitProfiles[suit].focus}成為這次解讀最強的底色；在「${topicNames[topic]}」上尤其指向${suitProfiles[suit][topic]}。`;
  if(count===2)return `三張中有兩張${suit}，代表${suitProfiles[suit].focus}不是旁支，而是這次問題的主要驅動因素；在「${topicNames[topic]}」上要特別看${suitProfiles[suit][topic]}。`;
  if(entries.length>=2){const pair=entries.slice(0,2).map(e=>e[0]);return `牌組同時出現${pair[0]}與${pair[1]}，表示需要把「${suitProfiles[pair[0]].focus}」和「${suitProfiles[pair[1]].focus}」一起考量，單看其中一面容易失真。`;}
  return '';
}
function rankPattern(){
  const nums=current.map(rankNumber);
  if(nums.every(n=>n!==null)){
    if(nums[0]<nums[1]&&nums[1]<nums[2])return '牌階從過去到未來逐步上升，表示事情有累積與推進性；後續結果更取決於你如何承接現在的行動。';
    if(nums[0]>nums[1]&&nums[1]>nums[2])return '牌階逐步下降，常代表能量在收斂、降速或回到基本問題；比起擴張，現在更適合減法與整理。';
    if(new Set(nums).size===1)return '三張牌落在相近的發展階段，表示同一課題正在不同時間位置反覆出現，真正要改的是處理模式，而不只是單一事件。';
  }
  const ranks=current.map(c=>c.rank).filter(Boolean);
  const courts=ranks.filter(r=>['Page','Knight','Queen','King'].includes(r)).length;
  if(courts>=2)return `牌組出現 ${courts} 張宮廷牌，人、角色與互動方式比事件本身更重要；可能要分辨誰在主導、誰在等待、誰真正承擔責任。`;
  const aces=ranks.filter(r=>r==='Ace').length,tens=ranks.filter(r=>r==='10').length;
  if(aces&&tens)return '牌組同時出現 Ace 與 10，形成「開始—完成」的跨度：舊週期的收尾與新週期的開啟可能正在同時發生。';
  return '';
}
function orientationPattern(){
  const code=current.map(c=>c.orientation==='upright'?'U':'R').join('');
  const map={
    UUU:'三張皆正位，能量較容易在現實中直接表現，重點是把機會轉成行動，而不是只停留在理解。',
    RRR:'三張皆逆位，這次更像內部整理期：阻力、誤解或尚未消化的情緒比外在事件更值得先處理。',
    RUU:'走勢呈現「過去卡住 → 現在打開 → 未來可推進」，重點是不要再用舊問題定義現在。',
    URU:'走勢呈現「過去有基礎 → 現在遇卡點 → 未來仍有修正空間」，真正的轉折點就在現在。',
    UUR:'前兩張較順、未來逆位，代表目前並非沒有進展，但若沿用同一模式，後面可能出現延遲、偏差或代價。',
    RRU:'前兩張逆位、未來正位，像是先經過兩層整理才逐漸打開；不要因當下阻力就把未來判成負面。',
    RUR:'過去逆位、現在正位、未來逆位，代表你已找到一部分方法，但穩定性仍不足，後續需要持續調整而非一次突破。',
    URR:'過去正位、現在與未來逆位，表示原本有效的方式可能正在失效；繼續複製舊方法反而容易加重阻力。'
  };
  return map[code];
}
function majorPattern(){
  const majors=current.filter(c=>c.arcana==='major');
  if(majors.length===3)return '三張全是大阿爾克那，這組牌較像重要人生課題或階段性轉折；短期細節不是唯一焦點，真正要看的是你正在成為什麼樣的人、做什麼核心選擇。';
  if(majors.length===2)return `有兩張大阿爾克那（${majors.map(c=>c.zh).join('、')}），核心課題的重量偏高；日常事件很可能只是更深層選擇的表面。`;
  if(majors.length===1)return `唯一的大阿爾克那「${majors[0].zh}」可視為這組牌的主軸，另外兩張小牌則在說明它如何落到日常情境。`;
  return '三張皆為小阿爾克那，這次解讀較偏向日常可調整的選擇、互動與執行方式，改變空間相對較大。';
}
function pairTransition(a,b,label){
  const at=cardTags(a),bt=cardTags(b);
  const aCore=shortCore(a),bCore=shortCore(b);
  let relation='轉換';
  if(a.orientation==='reversed'&&b.orientation==='upright')relation='鬆動與打開';
  else if(a.orientation==='upright'&&b.orientation==='reversed')relation='由順轉卡';
  else if(a.orientation===b.orientation)relation=a.orientation==='upright'?'延續與放大':'重複卡點';
  if(at.includes('emotion')&&bt.includes('mind'))return `${label}是從情緒走向理性：先承認感受，再用清楚溝通或判斷把事情說明白。`;
  if(at.includes('mind')&&bt.includes('action'))return `${label}是從思考走向行動：真正的關鍵不是再分析，而是選一個方向開始做。`;
  if(at.includes('action')&&bt.includes('reality'))return `${label}把企圖拉回現實成果：計畫需要資源、節奏與可持續性才能落地。`;
  if(at.includes('relationship')&&bt.includes('resource'))return `${label}提醒情感與現實要對得上：承諾、時間、金錢或實際投入會比口頭感受更能驗證關係。`;
  return `${label}呈現「${a.zh}${dir(a)}：${aCore}」到「${b.zh}${dir(b)}：${bCore}」的${relation}；後一張不是單獨答案，而是前一張被處理後的下一階段。`;
}
function topicConclusion(){
  const [past,present,future]=current;
  const p=present.orientation==='upright',f=future.orientation==='upright';
  const base={
    love:{pp:'關係目前有可用的正向資源，而且未來牌也保持開放；比較值得觀察的是互動能否持續、雙方投入是否對等，而不是急著定義結果。',pn:'目前的互動或感受有正向基礎，但未來牌出現阻力，表示下一步需要處理界線、期待或溝通落差，否則容易從靠近變成消耗。',np:'現在仍有卡點，但未來牌轉正，代表只要核心問題被說清楚或行為模式改變，關係仍有往較健康方向發展的空間。',nn:'現在與未來都偏逆位，這組牌不適合解讀成「只要再努力就會好」；更重要的是先確認這段互動是否真的符合彼此需求與界線。'},
    career:{pp:'目前有可運用的能力或機會，未來也偏向可推進；重點在把方向轉成具體成果，並確認資源與時間能承接。',pn:'現在看得到機會，但未來有阻力；可能不是能力不足，而是條件、時機、合作或執行方式需要重新配置。',np:'現階段有卡點，但未來有打開跡象；先解決最關鍵瓶頸，比同時做很多事更有效。',nn:'現在與未來皆偏阻力，這次比較像策略重整訊號；與其硬撐，不如重新評估路線、條件與交換成本。'},
    money:{pp:'財務走勢偏向可管理與改善，但仍應以現金流、風險與可承受損失驗證牌面，而不是把正位當成獲利保證。',pn:'現在看似有資源或機會，但未來牌提醒風險可能後移；需要特別檢查成本、期限、合約與退出條件。',np:'目前可能有壓力或不確定，但未來有改善空間；先堵住漏洞、整理負擔，再談新的投入。',nn:'現在與未來都偏逆位，這組牌更適合保守處理：先減少不必要風險、確認現金流，再做新的財務決策。'},
    general:{pp:'整體從現在到未來有延續性，代表你已經握有一些有效資源；接下來最重要的是持續做對的事，而不是頻繁換方向。',pn:'現在可行、未來受阻，表示當下的做法需要提早加入風險管理，不要等問題發生才修正。',np:'現在卡住、未來轉開，代表目前的阻力比較像過程而非終點；處理好現在的核心問題，方向會逐漸清楚。',nn:'現在與未來皆有阻力，這次的訊息更偏向減速、釐清與重新排序；先讓事情變簡單，再決定下一步。'}
  };
  return base[topic][(p?'p':'n')+(f?'p':'n')];
}
function buildReadingAnalysis(){
  const [past,present,future]=current;
  const opening=chooseVariant([
    `${topicNames[topic]}這組牌不是三個獨立答案，而是一條由過去推到未來的時間線。`,
    `這次三張牌的重點在「變化過程」：過去留下什麼、現在能處理什麼、未來可能因而往哪裡走。`,
    `把這組牌連起來看，比單看任何一張更重要；真正的訊息藏在三張牌之間的轉折。`
  ]);
  const flow=`過去「${past.zh}${dir(past)}」帶出${shortCore(past)}；現在「${present.zh}${dir(present)}」把焦點轉到${shortCore(present)}；未來「${future.zh}${dir(future)}」則指向${shortCore(future)}。`;
  const analysis=`${opening}${flow}${orientationPattern()}${majorPattern()}`;

  const comboParts=[pairTransition(past,present,'過去 → 現在'),pairTransition(present,future,'現在 → 未來'),suitPattern(),rankPattern(),...getSpecialCombos()].filter(Boolean);
  const combo=comboParts.join(' ');

  const conclusionIntro=chooseVariant(['綜合來看，','把三張牌收斂成一句話：','如果只抓這組牌最重要的結論，']);
  const conclusion=`${conclusionIntro}${topicConclusion()} ${future.orientation==='reversed'?`未來牌「${future.zh}」是需要調整或避免的模式，不是必然會發生的結果。`:`未來牌「${future.zh}」比較像目前方向延續後的可能落點，仍需要現實行動去形成。`}`;

  const topicAdvice={
    love:[
      '把焦點放回可驗證的互動：聯絡頻率、承諾、界線與雙方是否都有實際投入。下一步最好是一次清楚但不施壓的溝通，而不是靠猜測補完答案。',
      '先分清楚「我希望對方怎樣」和「對方實際做了什麼」。若要推進，選一個低壓力、可觀察回應的行動，再依對方持續行為調整。',
      '不要只問有沒有感覺，也要問這段互動能不能長期成立。把需求、界線與投入程度說清楚，讓關係靠行為而不是想像前進。'
    ],
    career:[
      '把現在牌轉成一個 7 天內能完成的具體行動：投遞、談條件、完成作品、練習技能或確認資源。先產生可驗證結果，再決定是否擴大投入。',
      '先找出目前最大的單一瓶頸，不要同時處理所有問題。把時間、薪資、能力、合作與風險列出來，優先解決最影響結果的一項。',
      '讓選擇回到現實條件：機會成本、成長性、收入、工時與可持續性。牌面可以幫你看方向，但最後要用條件表把方向落地。'
    ],
    money:[
      '先做數字版的現況盤點：現金、固定支出、債務、預備金與可承受損失。只有在這些數字清楚後，才決定新的投入。',
      '先保住現金流，再追求報酬。若這次問題涉及投資或大額支出，至少設定上限、退出條件與最壞情境，不要因牌面好看就放大部位。',
      '把「想要」和「負擔得起」分開看。先處理必要支出與風險，再決定是否擴張；任何高風險決策都要有第二個現實依據。'
    ],
    general:[
      '把三張牌當成行動順序：先停止重複過去的模式，再把現在牌的優勢用起來，最後朝未來牌較健康的方向靠近。',
      '不要一次解決全部。今天只選一個最小、最明確、能驗證方向的下一步；做完後再看現實回饋，而不是一直重抽。',
      '把牌面轉成一個問題：「我現在最能控制的是什麼？」從可控制的部分開始，其他答案會隨行動變清楚。'
    ]
  };
  const presentAdvice=present.orientation==='reversed'?`現在牌「${present.zh}」逆位是整組最值得先處理的卡點；先修正它，再談未來。`:`現在牌「${present.zh}」正位是目前最可用的資源；請把它落實成一個具體行動。`;
  const advice=`${chooseVariant(topicAdvice[topic],17)} ${presentAdvice}`;

  let caution='塔羅適合用來整理象徵、感受與決策框架，不是固定預言。若牌面和可驗證事實衝突，以現實資訊與你的判斷為優先。';
  if(topic==='love')caution='不要用牌面替對方讀心，也不要把「未來牌」當成對方一定會採取某行動的證據。判斷關係仍要看雙方持續、可驗證的行為。';
  if(topic==='money')caution='涉及投資、借貸或大額支出時，牌面不能取代財務資料、合約、風險評估與可承受損失。';
  if(topic==='career')caution='涉及離職、簽約或重大職涯變動時，請核對薪資、工時、職務、合約與實際機會，不要只依牌面做不可逆決定。';
  return{analysis,combo,conclusion,advice,caution};
}
function shuffleForManual(){shuffledDeck=[...cards].sort(()=>Math.random()-.5)}
function openChoose(){readingMode='manual';manualSelection=[];chooseTopicBadge.textContent=topicLabels[topic];chooseStatus.textContent='牌已洗好，請依直覺依序選出 3 張牌。';shuffleForManual();renderChooseGallery();renderChooseSlots();show('choose')}
function renderChooseGallery(){if(!cards.length)return;const selectedIds=new Set(manualSelection.map(c=>c.id));chooseGallery.innerHTML=shuffledDeck.map((c,i)=>`<button class="choose-card ${selectedIds.has(c.id)?'selected':''}" data-id="${c.id}" aria-label="第 ${i+1} 張牌背"><span class="mystic-back">☾<b>✦</b></span></button>`).join('');chooseGallery.querySelectorAll('.choose-card').forEach(el=>el.onclick=()=>selectManualCard(+el.dataset.id,el))}
function selectManualCard(id,el){if(manualSelection.length>=3||manualSelection.some(c=>c.id===id))return;const base=cards.find(c=>c.id===id);const item={...base,orientation:Math.random()<.5?'upright':'reversed',revealed:false};const target=document.querySelector(`.choose-slot[data-slot="${manualSelection.length}"]`);animateCardToSlot(el,target);manualSelection.push(item);el.classList.add('selected');renderChooseSlots();chooseStatus.textContent=manualSelection.length<3?`已選 ${manualSelection.length} 張，再選 ${3-manualSelection.length} 張。`:'✓ 已選好 3 張牌，按 REVEAL READING。'}
function animateCardToSlot(source,target){const a=source.getBoundingClientRect(),b=target.getBoundingClientRect();const clone=source.cloneNode(true);clone.className='flying-card';Object.assign(clone.style,{left:a.left+'px',top:a.top+'px',width:a.width+'px',height:a.height+'px'});document.body.appendChild(clone);const dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2);if(clone.animate){clone.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(.6) rotate(5deg)`,opacity:.25}],{duration:430,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>clone.remove()}else clone.remove()}
function renderChooseSlots(){const slots=document.querySelectorAll('.choose-slot');slots.forEach((slot,i)=>{const c=manualSelection[i];slot.style.display='flex';slot.classList.toggle('filled',!!c);if(c){slot.innerHTML=`<div class="chosen-back"><span class="mystic-back">☾<b>✦</b></span></div><div class="slot-caption">${['PAST','PRESENT','FUTURE'][i]} · SELECTED</div>`}else slot.innerHTML=`<span>${['PAST','PRESENT','FUTURE'][i]}</span><small>${['1ST CARD','2ND CARD','3RD CARD'][i]}</small>`});chooseSlots.classList.remove('one');chooseCounter.textContent=`SELECT ${manualSelection.length} / 3`;chooseRevealBtn.disabled=manualSelection.length!==3;chooseRevealBtn.classList.toggle('pulse-ready',manualSelection.length===3)}
function reshuffleManual(){manualSelection=[];shuffleForManual();renderChooseGallery();renderChooseSlots();chooseStatus.textContent='牌已重新洗牌。請重新選 3 張。'}
function revealManualReading(){if(manualSelection.length!==3){chooseStatus.textContent='請先選滿 3 張牌。';return}readingMode='manual';current=manualSelection.map(c=>({...c,revealed:false}));drawBtn.textContent='✦ CHOOSE AGAIN';prepareReading(true)}
function saveHistory(){if(current.length!==3||!current.every(c=>c.revealed)){status.textContent='請先把三張牌全部翻開。';return}let h=JSON.parse(localStorage.getItem('riverTarotHistory')||'[]');h.unshift({time:new Date().toISOString(),topic,mode:readingMode,cards:current.map(c=>({id:c.id,orientation:c.orientation}))});h=h.slice(0,50);localStorage.setItem('riverTarotHistory',JSON.stringify(h));status.textContent='✓ Saved to history log.'}
function renderHistory(){if(!cards.length)return;let h=JSON.parse(localStorage.getItem('riverTarotHistory')||'[]');historyList.innerHTML=h.length?h.map(x=>`<div class="history-item"><strong>${new Date(x.time).toLocaleString('zh-TW')} · ${topicLabels[x.topic]} · ${x.mode==='manual'?'CHOSEN':'RANDOM'}</strong><div class="history-cards">${x.cards.map(z=>{let c=cards.find(q=>q.id===z.id);return `<div class="history-card"><img class="${z.orientation==='reversed'?'rev':''}" src="${c.image}"><span>${c.zh} · ${z.orientation==='upright'?'正位':'逆位'}</span></div>`}).join('')}</div></div>`).join(''):'<p>尚無抽牌紀錄。</p>'}
async function shareResult(){if(current.length!==3||!current.every(c=>c.revealed)){status.textContent='請先把三張牌全部翻開。';return}const result=buildReadingAnalysis();let text=`RIVER TAROT · ${topicLabels[topic]}\n`+current.map((c,i)=>`${positionNames[i]}：${c.zh}（${dir(c)}）`).join('\n')+`\n\n解析結論：${result.conclusion}\n建議：${result.advice}`;try{if(navigator.share)await navigator.share({title:'RIVER TAROT',text});else{await navigator.clipboard.writeText(text);status.textContent='✓ 結果已複製。'}}catch(e){status.textContent='分享已取消。'}}
function renderDeck(){if(!cards.length)return;deckGrid.innerHTML=cards.map(c=>`<figure><img loading="lazy" src="${c.image}"><figcaption>${c.zh}</figcaption></figure>`).join('')}
function updateClock(){let d=new Date();clock.textContent=d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})+' · '+d.toLocaleDateString('en-US',{year:'numeric',month:'short',day:'2-digit'})}
init();
