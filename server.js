const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const { findOrCreateDocument, saveDocument } = require("./schemas/utils");

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT || "http://localhost:3000";

mongoose.connect(process.env.CONNECTION_STR);

const allowedOrigins = [
  "*",
  "https://doc-editor-client-n1y1.vercel.app/",
  "http://localhost:3000",
];

const app = express();

const server = createServer(app);
const io = new Server(server);

app.use(cors());

app.get("/health", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await saveDocument(documentId, data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
