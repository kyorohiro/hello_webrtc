var WebSocket = require('ws')
var express = require('express')
var https = require("https")
var uuid = require('uuid');

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
app.get('/api/create_annonymous_id', function(req,res){
  // curl https://0.0.0.0:18443/api/create_annonymous_id --insecure
  res.send(uuid.v1())
})
//
//app.listen(port)c

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
    //
    //
    wss_secure.clients.forEach(function each(client) {
      //if (client !== ws_socket && client.readyState === WebSocket.OPEN) {
      client.send("Hello!! " + ws_sockets.length);
      //}
    });
  });
  ws_socket.on("close", function() {
    ws_socket.close()
    ws_sockets =  ws_sockets.filter(item => item !== ws_socket)
  }); 
});

server_secure.listen(port);

