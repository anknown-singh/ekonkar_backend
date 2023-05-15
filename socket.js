const { Server } = require("socket.io");

// const whitelist = [
//   "*",
//   "https://monkeybanana.ae/",
//   "http://localhost:3000",
//   "http://localhost:3001",
//   "http://127.0.0.1:3000",
//   "http://127.0.0.1:3001",
//   "http://192.168.165.208:3001",
//   "http://192.168.165.208:3000",
//   "http://0.0.0.0:3001",
//   "http://0.0.0.0:3000",
// ];

const server = (httpServer) => {
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    socket.on("disconnect", function () {
      console.log("Got disconnect!");
    });
  });

  return io;
};

module.exports = server;
