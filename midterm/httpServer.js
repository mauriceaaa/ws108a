const http = require('http');  //載入 Node.js 原生模組 http

const port = 3000, hostname = 'localhost'

const server = http.createServer((request, response) =>             // 2 建立server
{
  console.log('url:', request.url);
  console.log('  method:', request.method);                         //在此處理 客戶端向 http server 發送過來的 req。
  console.log('  headers', request.headers);
  response.statusCode = 200;                                     //請求成功
  response.setHeader('Content-Type', 'text/plain');           //接到文本之後以讓瀏覽器以普通文本解析  
  response.write('Hello World\n');                    //網站內容
  response.end()
});

server.listen(port, () => {                
  console.log(`Server running at http://${hostname}:${port}/`);                     //// 進入此網站的監聽 port, 就是 localhost:xxxx 的 xxxx
});