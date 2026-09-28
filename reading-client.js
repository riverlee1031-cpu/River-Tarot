const RiverAI = (() => {
  const labels={
    love:['你的狀態','對方與互動','關係中的挑戰','給你的建議'],
    career:['你的狀態','工作環境','可能的挑戰','給你的建議'],
    money:['你的狀態','現實條件','可能的挑戰','給你的建議'],
    general:['你的狀態','外在環境','可能的挑戰','給你的建議']
  };
  function validate(reading,cards){
    const text=(s,max)=>typeof s==='string'&&s.trim().length>0&&s.length<=max;
    if(!reading||!Array.isArray(reading.cards)||reading.cards.length!==4||!text(reading.conclusion,700)||!text(reading.shareSummary,200))throw Error('AI 回覆不完整，請重試。');
    reading.cards.forEach((c,i)=>{
      if(!c||c.position!==i||c.cardId!==cards[i].id||c.orientation!==cards[i].orientation||!text(c.meaning,400)||!text(c.application,900))throw Error('AI 回覆與牌組不符，請重試。');
    });
    return reading;
  }
  function createSession({fetchImpl=fetch}={}){
    let revision=0,controller=null,result=null,pending=null;
    function reset(){revision++;controller?.abort();controller=null;result=null;pending=null;}
    function request(payload,endpoint){
      if(result)return Promise.resolve(result);
      if(pending)return pending;
      const ownRevision=revision;
      controller=new AbortController();
      const signal=controller.signal;
      const ownController=controller;
      const timer=setTimeout(()=>ownController.abort(),55000);
      pending=(async()=>{
        try{
          const response=await fetchImpl(endpoint||'/api/reading',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal});
          if(!response.ok){
            if(response.status===404)throw Error('AI 解牌服務尚未連線，請稍後再試。');
            const body=await response.json().catch(()=>({}));
            const code=body.error?.code;
            throw Error(code==='NOT_CONFIGURED'?'AI 解牌尚未啟用。可先使用「ChatGPT 深度解牌」。':code==='REFUSED'?'這個問題暫時無法解讀，可以調整提問後再試。':response.status===429?'解牌服務忙碌或額度已用完，請稍後再試。':'AI 暫時無法回覆，請重試。');
          }
          const data=await response.json();
          if(ownRevision!==revision)return null;
          result=validate(data.reading,payload.cards);
          return result;
        }catch(error){
          if(ownRevision!==revision)return null;
          if(signal.aborted)throw Error('解牌等候時間較長，請按重新解讀。');
          throw error;
        }finally{
          clearTimeout(timer);
          if(ownRevision===revision)pending=null;
        }
      })();
      return pending;
    }
    return {request,reset,get result(){return result;},get pending(){return Boolean(pending);}};
  }
  return {labels,createSession,validate};
})();
