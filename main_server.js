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
app.get('/api/create_annonymous_id', function (req, res) {
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

var user_map = {}
var user_from_ws_socket_map = {}


wss_secure.on('connection', function connection(ws_socket) {
  ws_sockets.push(ws_socket);

  ws_socket.on('message', function incoming(data) {
    console.log("on message --")
    var obj = JSON.parse(data)["message"]

    switch (obj["type"]) {
      case "hello":
        user_map[obj["user_id"]] = {
          "ws_socket": ws_socket,
        }
        user_from_ws_socket_map[ws_socket] = {
          "id": obj["user_id"]
        }
        ws_socket.send(
          JSON.stringify({
            "result": "ok",
            "response_id": obj["request_id"]
          })
        )
        return;
      case "peer_list":
        ret = []
        for (var k in user_map.keys) {
          ret.push(k)
        }
        ws_socket.send(
          JSON.stringify({
            "result": "ok",
            "user_ids": ret,
            "response_id": obj["request_id"]
          })
        )
        return;
    }

    console.log(JSON.parse(data)["message"])
  });
  ws_socket.on("close", function () {
    var obj = user_from_ws_socket_map[ws_socket]
    if (obj) {
      user_map.delete(obj["id"])
    }
    ws_socket.close()
    ws_sockets = ws_sockets.filter(item => item !== ws_socket)
  });
});

server_secure.listen(port);

