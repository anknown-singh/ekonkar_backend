const express = require("express");
const app = express();
const http = require("http").Server(app);
const mongoose = require("mongoose");
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const socketServer = require("./socket");

const io = socketServer(http);

app.use((req, res, next) => {
  req.io = io;
  next();
});

const routes = require("./routes");

const {
  db: { url, options },
  port,
} = require("./config/keys");

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// const corsOptions = {
//   origin: function (origin, callback) {
//     var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
//     callback(null, originIsWhitelisted);
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors());

app.use(cookieParser());
app.use(morgan("combined"));

app.use(routes);

// Connect to MongoDB
mongoose.set("useCreateIndex", true);
mongoose
  .connect(url, options)
  .then(() =>
    console.log(`${chalk.green("✓")} ${chalk.blue("MongoDB Connected!")}`)
  )
  .then(() => {
    const PORT = port || 5000;
    const HOST = process.env.HOST || "127.0.0.1";
    http.listen(PORT, HOST, () => {
      console.log(
        `${chalk.green("✓")} ${chalk.blue(
          "Server Started on"
        )} http://${chalk.bgMagenta.white(`${HOST}:${PORT}`)}`
      );
    });
  })
  .catch((err) => console.log(err));
