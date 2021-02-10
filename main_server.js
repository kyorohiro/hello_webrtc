var WebSocket = require('ws')
var https = require("https")
var fs = require('fs');
var path = require('path');
var ssl_server_key = "key.pem";
var ssl_server_crt = "cert.pem"
var port = 18443
//
// ref about https
// https://kaworu.jpn.org/javascript/node.js%E3%81%AB%E3%82%88%E3%82%8BHTTPS%E3%82%B5%E3%83%BC%E3%83%90%E3%81%AE%E4%BD%9C%E3%82%8A%E6%96%B9
// https://www.iseeit.jp/if-sub-181010.html

let sockets = [];

var options = {
  key: fs.readFileSync(ssl_server_key),
  cert: fs.readFileSync(ssl_server_crt)
};

///

var staticBasePath = './static';
var server_secure = https.createServer(options, function (req, res) {
  // https://stackabuse.com/node-http-servers-for-static-file-serving/
  var resolvedBase = path.resolve(staticBasePath);
  var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
  var fileLoc = path.join(resolvedBase, safeSuffix);
  
  fs.readFile(fileLoc, function(err, data) {
      if (err) {
          res.writeHead(404, 'Not Found');
          res.write('404: File Not Found!');
          return res.end();
      }
      
      res.statusCode = 200;

      res.write(data);
      return res.end();
  });
})

///




///
var wss_secure = new WebSocket.Server({ server: server_secure, path: "/wss" });

wss_secure.on('connection', function connection(ws_socket) {
  sockets.push(ws_socket);
  ws_socket.on('message', function incoming(data) {
    console.log("on message --")
    console.log(data)
    // ほかの接続へブロードキャスト
    wss_secure.clients.forEach(function each(client) {
      //if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send("Hello!!");
     // }
    });
  });
  //wss.broadcast(data);
});

server_secure.listen(port);
/*
const WebSocket = require('ws')

const server = new WebSocket.Server({
    port:8080
});

let sockets = []

let sockets = [];
server.on('connection', function(socket) {
  sockets.push(socket);

  // When you receive a message, send that message to every socket.
  socket.on('message', function(msg) {
    sockets.forEach(s => s.send(msg));
  });

  // When a socket closes, or disconnects, remove it from the array.
  socket.on('close', function() {
    sockets = sockets.filter(s => s !== socket);
  });
});
*/