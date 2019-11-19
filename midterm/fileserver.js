const Koa = require('koa')
const fs = require('fs')
const app = new Koa()
const path = require('path')

app.use(async function(ctx) {
  const fpath = path.join(__dirname, ctx.path)      //file path檔案路徑
  console.log('__dirname=', __dirname)
  console.log('fpath=', fpath)
  const fstat = await fs.promises.stat(fpath)       //file state檔案狀態
  console.log('fstat=', fstat)
  if (fstat.isFile()) {
    let type = path.extname(fpath)                  //extname=取附檔名，ctx.type會將type轉成http的標準格式
    console.log('type=', type)
    ctx.type = type
    console.log('ctx.type=', ctx.type)
    ctx.body = fs.createReadStream(fpath)           //createReadStream=讀完檔案用串流方式傳回、省記憶體

  }
})

app.listen(3000)
console.log('server run at http://localhost:3000/')
