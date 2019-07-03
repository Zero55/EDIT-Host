const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");

// SERVER
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use(express.static("./dist/"));

app.listen(3000, () => console.log("Server running on port 3000!"));

// WEBSOCKET
const ws = new WebSocket.Server({ port: 8080 });

ws.on("connection", function connection(connection) {
  connection.on("message", function incoming(message) {
    console.log("Message recieved: %s", message);
  });

  connection.send(JSON.stringify("something"));

  connection.on("close", function close() {
    console.log("Connection closed.");
  });
});
