const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const port = process.env.PORT || 14420;
const app = express();
app.use(cors());
app.use(express.static(__dirname));

app.get("/", (req, res) => res.status(200).send(html));

const processGpsData = (data) =>
  new Promise((resolve) =>
    axios
      .post(process.env.PING_SERVER + "/ping", {
        data,
        key: process.env.LAPTOP_KEY,
        device: process.env.DEVICE,
      })
      .catch((err) => console.log("ping error", err))
      .finally(resolve)
  );

const run = async () => {
  try {
    axios
      .get("https://freegeoip.app/json/")
      .then(async (res) => {
        await processGpsData(res.data);
      })
      .catch((err) => console.log("err", err))
      .finally(setTimeout(run, 2 * 60 * 1000));
  } catch (err) {
    console.log("Main function error", err);
  }
};

const server = http.createServer(app);
server.listen(port, run);
