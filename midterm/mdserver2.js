const Koa = require('koa')
const fs = require('fs')
const MarkdownIt = require('markdown-it')
const mdit = new MarkdownIt()
const app = new Koa()
const path = require('path')

app.use(async function (ctx) {
  const fpath = path.join(__dirname, ctx.path)
  const fstat = await fs.promises.stat(fpath)
  console.log('fpath=', fpath)
  if (fstat.isFile()) {
    let ext = path.extname(fpath)
    // console.log('ext=', ext)
    if (ext === '.md') {                                      //檔案的副檔名是.md，用mdRender回傳結果
      let md = await fs.promises.readFile(fpath, 'utf8')      //把檔案讀成為字串，設為md
      let html = mdRender(md)                                 //轉為html
      ctx.type = '.html'                                      //ctx.type = 描述檔案屬性
      ctx.body = html
    } else {
      ctx.type = ext
      ctx.body = fs.createReadStream(fpath)                   //讀完檔案用串流方式傳回
    }
  }
})

app.listen(3000)
console.log('server run at http://localhost:3000/')

function mdRender(md) {     //+一個函式讓md套上html的頭尾以及讓css可以套用
  return `
<html>
<head>
  <link rel="stylesheet" type="text/css" href="theme.css">
</head>
<body>
  ${mdit.render(md)}        //用來允許一個程式放在那個位置(通常程式跑完後是字串)
</body>
</html>
  `
}
//${mdit.render(md)} = 讓程式放在那個位置(程式執行結果為字串)、取字串的值插進去
