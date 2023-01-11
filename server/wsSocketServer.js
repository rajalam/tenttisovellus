// (A) INIT + CREATE WEBSOCKET SERVER AT PORT 8080
var ws = require("ws"),
    wss = new ws.Server({ port: 8080 }),
    users = {};
 
// (B) ON CLIENT CONNECT
wss.on("connection", (socket, req) => {
  // (B1) REGISTER CLIENT

  //console.log("connection: ", socket)

  let id = 0;
  while (true) {
    if (!users.hasOwnProperty(id)) { 
      users[id] = socket; 
      break; }
    id++;
  }
 
  // (B2) DEREGISTER CLIENT ON DISCONNECT
  socket.on("close", () => delete users[id]);
 
  // (B3) FORWARD MESSAGE TO ALL ON RECEIVING MESSAGE
  socket.on("message", msg => {
    let message = msg.toString().replace(/(<([^>]+)>)/gi, "");
    for (let u in users) { 
      users[u].send(message); 
    }
  });
});