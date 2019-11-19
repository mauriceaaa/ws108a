const Koa = require('koa')
const fs = require('fs')
const koaBody = require('koa-body')
const MarkdownIt = require('markdown-it')
const mdit = new MarkdownIt()

const app = module.exports = new Koa()
const path = require('path')
const extname = path.extname

app.use(koaBody({ jsonLimit: '1kb' }))

app.use(async function (ctx) {
  const fpath = path.join(__dirname, ctx.path)
  const fstat = await fs.promises.stat(fpath)
  console.log('fpath=', fpath)
  if (fstat.isFile()) {
    let ext = extname(fpath)
    if (ext === '.md') {
      let md = await fs.promises.readFile(fpath, 'utf8')    //檔案讀成字串再設成變數md
      let op = ctx.query.op
      ctx.type = '.html'
      switch (op) {
        case 'edit': ctx.body = mdEdit(md, ctx.path); break
        case 'save':
          let mdText = ctx.request.body.mdText              //把mdEdit的mdText(textarea)設為變數mdText
          await fs.promises.writeFile(fpath, mdText)
          ctx.redirect(ctx.path)                            //將儲存後的內容導回沒有參數的網址
          break
        default: ctx.body = mdRender(md, ctx.path)          //使用md回傳結果
      }
    } else {
      ctx.type = ext
      ctx.body = fs.createReadStream(fpath)
    }
  }
})

app.listen(3000)
console.log('server run at http://localhost:3000/')

function layout (html) {
  return `
<html>
<head>
  <link rel="stylesheet" type="text/css" href="theme.css">
</head>
<body>
${html}
</body>
</html>
`
}

function mdRender (md, path) {
  return layout(`
  <div><a href="${path}?op=edit">Edit</a></div>
  ${mdit.render(md)}
  `)
}

function mdEdit (md, path) {
  return layout(`
  <div>
    <form action="${path}?op=save" method="post">
      <h2>Path: ${path}</h2>
      <textarea name="mdText">${md}</textarea>
      <br/><br/>
      <button>Save</button>
    </form>
  </div>
  `)
}