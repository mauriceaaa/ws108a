const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve(__dirname/*根目錄*/ + '/public'));
app.listen(3000);

console.log('listening on port 3000');
console.log('__dirname=',__dirname)