const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve(__dirname + '/public'));
                                                       //網站沒內容，請求失敗會直接回應404
app.listen(3000);

console.log('listening on port 3000');