import {createServer} from 'node:http'
import {readFile, stat} from 'node:fs/promises'
import {resolve, extname, sep} from 'node:path'
import {gzipSync} from 'node:zlib'
const root=resolve(process.argv[2] || 'dist')
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.ico':'image/x-icon','.xml':'application/xml'}
createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)
    let file=resolve(root,'.'+pathname)
    if(file!==root&&!file.startsWith(root+sep)) {res.writeHead(403).end();return}
    try {
      if ((await stat(file)).isDirectory()) {
        try {await stat(file+'.html');file+='.html'}
        catch {file=resolve(file,'index.html')}
      }
    } catch {file+=extname(file)?'':'.html'}
    const body=await readFile(file)
    const type=types[extname(file)]||'application/octet-stream'
    const compress=/text|json|xml|svg/.test(type)&&/gzip/.test(req.headers['accept-encoding']||'')
    res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache',...(compress?{'Content-Encoding':'gzip','Vary':'Accept-Encoding'}:{})})
    res.end(compress?gzipSync(body):body)
  } catch {res.writeHead(404).end('Not found')}
}).listen(Number(process.argv[3]||5188),'127.0.0.1',()=>console.log('Compressed production preview ready'))
