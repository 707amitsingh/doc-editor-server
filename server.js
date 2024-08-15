const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const { findOrCreateDocument, saveDocument } = require("./schemas/utils");

mongoose.connect("");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    console.log(">>>>>>> documentIdRequested: ", documentId);
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      console.log(">>>>>>>>>>> saving changes: ", data);
      await saveDocument(data);
    });
  });
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
