process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const WebSocket = require('ws');

const ws = new WebSocket('wss://118.27.105.203:18443/wss');


ws.on('open', function open() {
    console.log("on open");
  ws.send('something');
});

ws.on('message', function incoming(data) {
    console.log("on message");
    console.log(data);
});

ws.on('error',function(err) {
    console.log("something wrong");
    console.log(err);
});
