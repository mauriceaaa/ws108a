const V = require('./view')
const M = require('./model')
const logger = require('koa-logger')
const router = require('koa-router')()
const koaBody = require('koa-body')
const session = require('koa-session')

const Koa = require('koa')
const app = (module.exports = new Koa())

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

app.use(session(CONFIG, app));
app.use(logger())
app.use(koaBody())

router
  .get('/', list)
  .get('/post/new', add)
  .get('/post/:id', show)
  .get('/edit/:id', edit)
  .get('/login', showLogin)
  .get('/logout', V.logout)
  .post('/post', create)
  .post('/login', login)
  .post('/modify/:id', modify)
  .get('/delete/:id',remove)

app.use(router.routes())

async function logout(ctx)  {
  ctx.session.user = null
  ctx.body = V.logout()
}

async function login(ctx) {
  console.log('ctx.request.body=', ctx.request.body)
  const { user, password } = ctx.request.body
  if (M.login(user, password)) {
    ctx.session.user = user
    ctx.redirect('/') // ???
  }else {
    ctx.status = 404
    ctx.body = '登入失敗！'
  }
}

async function showLogin(ctx) {
  ctx.body = V.showLogin()
}

async function list (ctx) {
  const posts = M.list()
  ctx.body = await V.list(posts)
}

async function add (ctx) {
  ctx.body = await V.new()
}


async function show (ctx) {
  const id = ctx.params.id
  const post = M.get(id)
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await V.show(post)
} 
async function remove (ctx) {
  const id = ctx.params.id
  const post = M.remove(id)
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.redirect('/')
} 
async function edit (ctx) {
  const id = ctx.params.id
  const post = M.get(id)
  if (!post) ctx.throw(404, 'invalid post id')
  ctx.body = await V.edit(post)
} 

async function create (ctx) {
  const post = ctx.request.body
  M.add(post)
  ctx.redirect('/')
}
async function modify (ctx) {
  const post = ctx.request.body
  post.id = ctx.params.id
  M.modify(post)
  ctx.redirect('/')
}


if (!module.parent) {
  app.listen(3000)
  console.log('Server run at http://localhost:3000')
}
