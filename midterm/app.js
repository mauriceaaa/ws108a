const Koa = require('koa')
const fs = require('fs')
const app = new Koa()
const path = require('path')

app.use(async function(ctx) //將中間內容添加到這個函數
                            //只要function標記為async，就表示裡頭可以撰寫 await 的同步語法
{                     
  const fpath = path.join(__dirname, ctx.path)   //使用 path.join 方式取得檔案絕對路徑
  console.log('__dirname=', __dirname)
  console.log('fpath=', fpath)
  const fstat = await fs.promises.stat(fpath)      //等待時間
  console.log('fstat=', fstat)
  if (fstat.isFile()) {                           //fstat是檔案?
    let type = path.extname(fpath)           
    console.log('type=', type)
    ctx.type = type                                //response 的 API
    console.log('ctx.type=', ctx.type)
    ctx.body = fs.createReadStream(fpath)
  }
})

app.listen(3000)   //以http創建伺服器，將設定的参数傳給 Server#listen()
console.log('server run at http://localhost:3000/')

