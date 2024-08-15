const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log(">>>>>>>>>>>> a user connected");
  socket.on("send-changes", (delta) => {
    console.log(delta);
    socket.broadcast.emit("receive-changes", delta);
  });
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
