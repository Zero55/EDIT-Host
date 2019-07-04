const express = require("express");
const app = express();
const path = require("path");
const WebSocket = require("ws");

// server
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.use(express.static("./dist/"));

app.listen(3000, () => console.log("Server running on port 3000!"));

// websocket - host gui
const wsHostGui = new WebSocket.Server({ port: 8081 });

// websocket - clients
const wsClients = new WebSocket.Server({ port: 8080 });

wsClients.on("connection", function connection(connection) {
  let egmName = "";

  connection.on("message", function incoming(incoming) {
    const message = JSON.parse(incoming);
    let logMessage, responseCommand;

    switch (message.command) {
      case "commsOnLine":
        egmName = message.name;
        logMessage = `${egmName} - online.`;
        responseCommand = "commsOnLineAck";
        break;
      case "heartbeat":
        logMessage = `${egmName} - heartbeat (${message.sessionId}).`;
        responseCommand = "heartbeatAck";
        break;
      case "reportMeter":
        logMessage = `${egmName} - report meter (${message.name} = ${message.value}).`;
        responseCommand = "meterAck";
        break;
      case "reportEvent":
        logMessage = `${egmName} - report event (${message.name}).`;
        responseCommand = "eventAck";
        break;
      case "reportStatus":
        logMessage = `${egmName} - report status (${message.value}).`;
        responseCommand = "statusAck";
        break;
      default:
        return;
    }

    connection.send(JSON.stringify({ command: responseCommand }));

    wsHostGui.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(logMessage));
      }
    });

    console.log(logMessage);
  });
});
