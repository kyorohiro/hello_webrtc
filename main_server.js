var WebSocket = require('ws')
var express = require('express')
var https = require("https")

//
var fs = require('fs');
var path = require('path');
var ssl_server_key = "key.pem";
var ssl_server_crt = "cert.pem"
var port = 18443



var app = express(port)
/*
app.get('/', function(req,res){
    res.send("Hello,World!!")
})
*/
app.use('/', express.static('static'))
//
//app.listen(port)

var server_secure = https.createServer({
  key: fs.readFileSync(ssl_server_key),
  cert: fs.readFileSync(ssl_server_crt)
}, app);

//
// websocket
//
let ws_sockets = [];
var wss_secure = new WebSocket.Server({ server: server_secure, path: "/wss" });

wss_secure.on('connection', function connection(ws_socket) {
  ws_sockets.push(ws_socket);
  ws_socket.on('message', function incoming(data) {
    console.log("on message --")
    console.log(data)
    // ほかの接続へブロードキャスト
    wss_secure.clients.forEach(function each(client) {
      //if (client !== ws_socket && client.readyState === WebSocket.OPEN) {
      client.send("Hello!!");
      //}
    });
  });
});

server_secure.listen(port);

