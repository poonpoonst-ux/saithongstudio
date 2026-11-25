// Local preview, using only Node built-ins. POSTs are never stored or forwarded.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = fileURLToPath(new URL('../public/',import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png','.mp4':'video/mp4','.webm':'video/webm','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const server = http.createServer((req,res)=>{
  if (!['GET','HEAD'].includes(req.method)) {
    res.writeHead(405,{'Content-Type':'text/plain; charset=utf-8',Allow:'GET, HEAD'});
    res.end('Local preview. No inquiry was sent. / แสดงตัวอย่างบนเครื่อง ยังไม่มีการส่งคำสอบถาม'); return;
  }
  let route;
  try {route=decodeURIComponent(new URL(req.url,'http://localhost').pathname);} catch {res.writeHead(400).end();return;}
  if (route.includes('\\') || route.includes('\0') || route.split('/').includes('..')) {res.writeHead(400).end();return;}
  let file=path.resolve(dir,'.'+route);
  if (file!==path.resolve(dir) && !file.startsWith(path.resolve(dir)+path.sep)) {res.writeHead(403).end();return;}
  let code=200;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!route.endsWith('/')) {res.writeHead(301,{Location:encodeURI(route)+'/'}).end();return;}
    file=path.join(file,'index.html');
  }
  if (!fs.existsSync(file)) {file=path.join(dir,'errors',route.startsWith('/th/')?'th.html':'en.html');code=404;}
  const type=path.extname(file);
  const headers={'Content-Type':mime[type] || 'application/octet-stream','Cache-Control':'no-cache'};
  if (type==='.html') {
    const html=fs.readFileSync(file,'utf8').replace('<head>','<head><meta name="studio-local-preview" content="true">');
    res.writeHead(code,headers).end(req.method==='HEAD'?'':html);return;
  }
  const size=fs.statSync(file).size;
  const range=req.headers.range;
  if (range && (type==='.mp4' || type==='.webm')) {
    const match=/^bytes=(\d+)-(\d*)$/.exec(range);
    const start=match?Number(match[1]):-1;
    const end=match&&match[2]?Math.min(Number(match[2]),size-1):size-1;
    if (start<0 || start>end || start>=size) {res.writeHead(416,{'Content-Range':`bytes */${size}`}).end();return;}
    res.writeHead(206,{...headers,'Accept-Ranges':'bytes','Content-Range':`bytes ${start}-${end}/${size}`,'Content-Length':end-start+1});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file,{start,end}).pipe(res);
    return;
  }
  res.writeHead(code,{...headers,'Content-Length':size,'Accept-Ranges':'bytes'});
  if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
});
server.listen(port,'127.0.0.1',()=>console.log(`SAITHONG STUDIO · http://localhost:${port}/`));

