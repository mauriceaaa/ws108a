  
const Koa = require('koa')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const mdit = new MarkdownIt()

const app = new Koa()
const path = require('path')

app.use(async function(ctx) {
  const fpath = path.join(__dirname, ctx.path)
  const fstat = await fs.promises.stat(fpath)                 //讀取檔案狀態
  console.log('fpath=', fpath)
  if (fstat.isFile()) {
    let ext = path.extname(fpath)
    // console.log('ext=', ext)
    if (ext === '.md') {                                      //判斷type是否為md,是:轉成html,否:以串流方式傳回檔案內容
      let md = await fs.promises.readFile(fpath, 'utf8')      //讀取檔案並轉為字串(utf-8碼)放在md
      let html = mdit.render(md)                              //md檔案轉為html
      ctx.type = '.html'
      ctx.body = html
    } else {
      ctx.type = ext                                          //ctx = 物件、type區塊 = 描述檔案屬性
      ctx.body = fs.createReadStream(fpath)                   //body區塊 = 用以放置檔案串流
    }                                                         //ctx有(body+type)2個區塊
  }
})

app.listen(3000)
console.log('server run at http://localhost:3000/')