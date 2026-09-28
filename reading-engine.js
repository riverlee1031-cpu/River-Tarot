/* RIVER's local reading rules: meaning → situation → practical response.
   This is a curated, offline interpretation engine, not a live model. */
const RiverReading = (() => {
  const labels = {
    love:['你的狀態','對方與互動','關係中的挑戰','給你的建議'],
    career:['你的狀態','工作環境','可能的挑戰','給你的建議'],
    money:['你的狀態','現實條件','可能的挑戰','給你的建議'],
    general:['你的狀態','外在環境','可能的挑戰','給你的建議']
  };
  // Each side is classified separately: reversed cards can indicate recovery.
  const themes = {
    conflict:{
      focus:'立場與合作',
      love:'先把不同的期待說清楚，別讓每次談話都變成爭輸贏。',
      career:'被糾正時，先確認做法和標準，不必急著證明自己是對的。',
      money:'先把費用、責任和分配方式談清楚，避免事後各說各話。',
      general:'先找出真正的分歧，選一件能一起處理的事。'
    },
    burden:{
      focus:'負擔與界線',
      love:'別把維持關係的責任全攬下來，說清楚你需要怎樣的回應。',
      career:'接下新任務前，先確認優先順序，忙不過來就提早說。',
      money:'先列出固定支出和已有承諾，確認自己還能負擔多少。',
      general:'先減少一件不必要的責任，讓重要的事有空間完成。'
    },
    pace:{
      focus:'速度與反應',
      love:'互動可能推進得快，確認彼此舒服的步調再往前。',
      career:'指令和任務可能接連而來，不懂就當下確認，避免越急越亂。',
      money:'遇到需要快速決定的事，仍要留時間核對金額與條件。',
      general:'變化來得快時，一次處理眼前最重要的一步。'
    },
    uncertainty:{
      focus:'資訊與方向',
      love:'先問清楚對方的意思，別只靠回訊速度或猜測下結論。',
      career:'先了解分工、流程和要求，再決定怎麼做，別靠猜測接任務。',
      money:'先補齊收支和條款資訊，暫時不要用期待代替數字。',
      general:'把已知事實和擔心的事情分開，先查清一個關鍵問題。'
    },
    rest:{
      focus:'休息與整理',
      love:'給自己一點整理情緒的時間，再談真正想說的話。',
      career:'留時間消化新資訊，疲累時先檢查容易出錯的步驟。',
      money:'先暫停非必要的決定，整理帳目後再看下一步。',
      general:'先讓自己休息，再判斷哪些事情真的需要現在處理。'
    },
    change:{
      focus:'改變與適應',
      love:'相處方式可能需要改變，先談哪些習慣已經不適合彼此。',
      career:'舊經驗未必完全適用，觀察現場做法，再調整自己的習慣。',
      money:'安排變動時，先重新確認手上的資源和必要支出。',
      general:'先承認情況已經不同，再找一個能調整的小地方。'
    },
    recovery:{
      focus:'恢復與放下',
      love:'可以慢慢放下過去的不愉快，但修復仍需要雙方的實際回應。',
      career:'把失誤整理成下一次能用的經驗，不必一直拿它否定自己。',
      money:'先穩住基本收支，再逐步處理之前留下的壓力。',
      general:'留意自己已經做得到的事，不用要求一次就完全恢復。'
    },
    connection:{
      focus:'互動與支持',
      love:'觀察彼此是否願意回應、付出，讓好感落在實際相處裡。',
      career:'主動和同事確認合作方式，遇到問題找對的人請教。',
      money:'合作時把雙方能提供的資源說清楚，維持公平的交換。',
      general:'可以向可信任的人求助，也把自己的需要說具體。'
    },
    practice:{
      focus:'基本功與累積',
      love:'比起一次很大的承諾，穩定的小行動更能建立信任。',
      career:'把流程記下來，先把基本工作做穩，再逐步加快速度。',
      money:'先做好持續的收支紀錄，用實際變化檢查安排是否可行。',
      general:'選一件可以持續做的小事，讓進展慢慢累積。'
    },
    agency:{
      focus:'主動與選擇',
      love:'可以主動表達一次心意，再看對方是否也願意靠近。',
      career:'選一件能力範圍內的事主動完成，讓成果替你說話。',
      money:'先確認目標和可用資源，再做自己承擔得起的安排。',
      general:'先選一個可執行的方向，做完第一步再調整。'
    },
    boundaries:{
      focus:'規則與界線',
      love:'說清楚自己能接受什麼，也留空間聽對方的需要。',
      career:'先確認權責和工作標準，遇到超出範圍的事再協調。',
      money:'把預算和可接受的條件訂清楚，別為了人情勉強答應。',
      general:'把自己的底線說清楚，再討論有彈性的部分。'
    },
    fulfillment:{
      focus:'成果與穩定',
      love:'珍惜已經有的好互動，也繼續用行動維持它。',
      career:'把目前有效的做法穩定下來，再和主管確認下一個目標。',
      money:'先保留已經建立的穩定，再評估新的安排。',
      general:'看看哪些努力已經有成果，把有效的習慣留下來。'
    }
  };
  const upright = `agency agency uncertainty connection boundaries boundaries connection agency agency rest change boundaries rest change boundaries burden change recovery uncertainty fulfillment change fulfillment agency uncertainty change connection conflict fulfillment boundaries pace boundaries burden agency pace agency agency connection connection connection rest rest connection uncertainty change fulfillment fulfillment connection connection connection boundaries agency uncertainty rest rest conflict change uncertainty uncertainty rest change agency pace boundaries boundaries agency burden practice boundaries burden connection practice practice fulfillment fulfillment practice practice connection fulfillment`.split(' ');
  const reversed = `pace uncertainty uncertainty burden boundaries change conflict uncertainty uncertainty rest uncertainty conflict uncertainty uncertainty burden recovery change uncertainty uncertainty uncertainty uncertainty uncertainty uncertainty uncertainty uncertainty uncertainty recovery uncertainty burden uncertainty rest burden uncertainty pace uncertainty boundaries rest conflict conflict recovery recovery change uncertainty uncertainty uncertainty conflict uncertainty uncertainty burden burden uncertainty uncertainty recovery rest recovery uncertainty recovery recovery recovery recovery uncertainty pace conflict boundaries uncertainty burden conflict uncertainty recovery conflict uncertainty uncertainty burden uncertainty uncertainty uncertainty burden boundaries`.split(' ');

  function context(topic, question){
    const text=String(question || '');
    const workTopic=topic==='career';
    return {
      topic, question:text,
      newJob:workTopic && /入職|到職|新工作|報到|轉職|換工作|去.{0,20}(工作|上班)|剛.{0,6}(工作|上班)/u.test(text),
      hospitality:workTopic && /餐廳|米其林|廚房|餐飲|主廚|內場|外場/u.test(text)
    };
  }
  function meaning(card){return card.plain?.[card.orientation] || card[card.orientation] || '';}
  function theme(card){return themes[(card.orientation==='reversed'?reversed:upright)[card.id]] || themes.uncertainty;}
  function application(card, position, ctx){
    const t=theme(card);
    if(ctx.newJob && ctx.topic==='career'){
      const key=`${card.slug}:${card.orientation}:${position}`;
      const examples={
        'five-of-swords:upright:0':'你可能很在意自己能不能勝任，容易把被糾正當成能力被否定。先別急著證明自己，願意學比一開始就做得漂亮更重要。',
        'two-of-wands:reversed:1':'實際工作可能和想像有落差。先了解現場的規矩和分工，再找到自己的做事節奏。',
        'eight-of-wands:upright:2':'考驗可能是指令接連而來，要一邊學、一邊跟上。遇到不懂的，當下確認會比較穩。',
        'ten-of-wands:upright:3':'別把「我可以」說得太快。先把自己的工作做好，也讓主管知道你目前能負擔多少。'
      };
      if(examples[key]) return examples[key];
    }
    const frame=[
      `放在你的狀態，值得留意自己如何面對「${t.focus}」。`,
      ctx.topic==='love'?`放在互動位置，可以觀察彼此在「${t.focus}」上的表現，不能只靠牌面認定對方的想法。`:`放在環境位置，可以先確認「${t.focus}」相關的實際條件。`,
      `放在挑戰位置，要留意「${t.focus}」會不會成為需要調整的地方。`,
      '這張建議牌可以化成一個實際做法：'
    ][position];
    let action=t[ctx.topic];
    if(ctx.newJob && t===themes.practice) action='剛到新環境，先把流程記下來，做穩基本工作，再逐步加快速度。';
    if(ctx.hospitality && t===themes.pace) action='忙碌時指令可能接連而來，先複述確認，再按順序處理手上的工作。';
    return frame+action;
  }
  function interpret(card, position, ctx){
    return {label:labels[ctx.topic][position], meaning:meaning(card), application:application(card,position,ctx)};
  }
  function conclusion(cards, ctx){
    const groups=cards.slice(0,3).map(theme);
    const pressure=new Set([themes.conflict,themes.burden,themes.uncertainty,themes.rest]);
    const demanding=groups.filter(t=>pressure.has(t)).length;
    const pace=groups.includes(themes.pace);
    let assessment=demanding>=2?'這組牌比較需要留意磨合和壓力，先把眼前的問題處理清楚。':demanding===1?'這組牌同時有可用的空間和需要調整的地方，適合邊做邊確認。':'這組牌有可以運用的資源，適合把想法落實，再觀察實際回應。';
    if(ctx.newJob && demanding>=2 && pace) assessment='有機會逐步站穩，但開頭可能不輕鬆。先把工作節奏學會，不必急著證明自己。';
    const main=theme(cards[2]);
    const recommendation=application(cards[3],3,ctx);
    return `${assessment}「${cards[2].zh}」提醒你留意${main.focus}；「${cards[3].zh}」給出的方向是：${recommendation.replace('這張建議牌可以化成一個實際做法：','')}實際發展仍要看後續的安排與行動。`;
  }
  return {labels,context,interpret,conclusion,theme};
})();
