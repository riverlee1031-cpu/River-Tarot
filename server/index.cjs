const http=require('node:http');
const fs=require('node:fs/promises');
const path=require('node:path');
const {generateReading,ReadingError}=require('./reading.cjs');
const ROOT=path.resolve(__dirname,'..');
const publicFiles=new Set(['index.html','app.js','style.css','tarot.json','reading-client.js','runtime-config.js']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.gif':'image/gif','.mp3':'audio/mpeg'};

function readJSON(req){
  return new Promise((resolve,reject)=>{
    let size=0,done=false; const chunks=[];
    req.on('data',chunk=>{
      if(done) return;
      size+=chunk.length;
      if(size>8192){done=true;reject(new ReadingError('TOO_LARGE',413,'問題資料過長。'));return;}
      chunks.push(chunk);
    });
    req.on('end',()=>{
      if(done) return;
      try{resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));}
      catch{reject(new ReadingError('INVALID_JSON',400,'問題資料格式有誤。'));}
    });
    req.on('error',reject);
  });
}

function createServer({env=process.env,fetchImpl=fetch,now=Date.now}={}){
  const origins=new Set((env.ALLOWED_ORIGINS||'http://localhost:3000,http://127.0.0.1:3000').split(',').map(x=>x.trim()).filter(Boolean));
  const dailyLimit=Number(env.MAX_DAILY_READINGS||100);
  if(!Number.isInteger(dailyLimit)||dailyLimit<1) throw Error('MAX_DAILY_READINGS must be a positive integer');
  if(env.NODE_ENV==='production' && !env.ALLOWED_ORIGINS) throw Error('Set ALLOWED_ORIGINS before production deployment');
  let day='',daily=0,active=0,minute=0,minuteCount=0;
  const send=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
  return http.createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    let url;
    try{url=new URL(req.url,'http://local');}catch{send(res,400,{error:{message:'無效網址。'}});return;}
    if(url.pathname.startsWith('/api/')){
      const origin=req.headers.origin;
      if(origin && !origins.has(origin)){send(res,403,{error:{code:'ORIGIN_DENIED',message:'無法從此網站使用解牌服務。'}});return;}
      if(origin){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');}
      if(req.method==='OPTIONS'){
        res.writeHead(204,{'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'});res.end();return;
      }
      if(url.pathname==='/api/health' && req.method==='GET'){
        send(res,200,{ready:Boolean(env.OPENAI_API_KEY&&env.OPENAI_MODEL)});return;
      }
      if(url.pathname!=='/api/reading'){send(res,404,{error:{message:'找不到服務。'}});return;}
      if(req.method!=='POST'){res.setHeader('Allow','POST');send(res,405,{error:{message:'請使用 POST。'}});return;}
      if(!req.headers['content-type']?.startsWith('application/json')){send(res,415,{error:{message:'請使用 JSON。'}});return;}
      let counted=false;
      const controller=new AbortController();
      res.on('close',()=>{if(!res.writableEnded)controller.abort();});
      try{
        const body=await readJSON(req);
        // Validate before spending a quota or sending anything to OpenAI.
        require('./reading.cjs').validateInput(body);
        if(!env.OPENAI_API_KEY||!env.OPENAI_MODEL)throw new ReadingError('NOT_CONFIGURED',503,'AI 解牌尚未啟用，請稍後再試。');
        const today=new Date(now()).toISOString().slice(0,10),currentMinute=Math.floor(now()/60000);
        if(today!==day){day=today;daily=0;}
        if(currentMinute!==minute){minute=currentMinute;minuteCount=0;}
        if(daily>=dailyLimit||minuteCount>=10||active>=3){res.setHeader('Retry-After','60');throw new ReadingError('RATE_LIMIT',429,'目前解牌人數較多或今日額度已用完，請稍後再試。');}
        daily++;minuteCount++;active++;counted=true;
        const reading=await generateReading(body,{apiKey:env.OPENAI_API_KEY,model:env.OPENAI_MODEL,fetchImpl,signal:controller.signal});
        if(!res.destroyed)send(res,200,{reading});
      }catch(error){
        const known=error instanceof ReadingError;
        if(!res.destroyed)send(res,known?error.status:500,{error:{code:known?error.code:'SERVER_ERROR',message:known?error.message:'解牌服務暫時無法使用。'}});
      }finally{if(counted)active--;}
      return;
    }
    if(!['GET','HEAD'].includes(req.method)){send(res,405,{error:{message:'Method not allowed'}});return;}
    let relative;
    try{relative=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';}catch{send(res,400,{});return;}
    const asset=/^(cards\/[a-z0-9-]+\.webp|assets\/[a-z0-9-]+\.(gif|mp3))$/.test(relative);
    if(!publicFiles.has(relative)&&!asset){send(res,404,{error:{message:'Not found'}});return;}
    try{
      const file=await fs.readFile(path.join(ROOT,relative));
      res.writeHead(200,{'Content-Type':types[path.extname(relative)]||'application/octet-stream','Cache-Control':'no-cache'});
      res.end(req.method==='HEAD'?undefined:file);
    }catch{send(res,404,{error:{message:'Not found'}});}
  });
}
if(require.main===module){
  const port=Number(process.env.PORT||3000);
  createServer().listen(port,'0.0.0.0',()=>console.log(`RIVER Tarot server listening on port ${port}`));
}
module.exports={createServer};
