const express = require("express");
const {writeFileSync, readFileSync, appendFileSync} = require("fs");
const axios = require("axios").default;
const {NGROK_API_TOKEN} = require("./configs/tokens.json");
const app = express();

writeFileSync(
  "./log.txt",
  `<colorization id="error">[Website] [Server up/WARN]:</colorization> Server sender offline.`
);

app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json());
app.use((req, res, next) => {
  var allowed = false;
  const ips = require("./configs/allowed_ip.json");
  for (var i in ips) {
    if (req.ip == ips[i]) {
      allowed = true;
    }
  }
  if (!allowed) {
    console.warn("No allowed IP tryed access: " + req.ip);
    return res.status(405).send(`<style>body {
        font-family: sans-serif;
        color: rgb(184, 184, 184);
        text-align: center;
        background-color: rgb(32, 32, 32);
      }</style> <h1>This access has been declined.</h1><p>for some reason this request has been declined :<</p><p>we sorry man!!</p>`);
  } else {
    next();
  }
});
app.use(express.static("public"), (req, res, next) => {
  if (
    req.url.includes("/listener/logs/put") ||
    req.url.includes("/listener/logs/get_all") ||
    req.url.includes("/listener/logs/clear") ||
    req.url.includes("/listener/logs/ended") ||
    req.url.includes("/listener/printer/get_public_url")
  ) {
    next();
  } else {
    return res.status(404).sendFile(__dirname + "/public/404.html");
  }
});

var deployed = null;

async function getDeployer() {
  await axios
    .get("https://api.ngrok.com/tunnels", {
      headers: {
        Authorization: "Bearer " + NGROK_API_TOKEN,
        ["Ngrok-Version"]: 2,
      },
    })
    .then(function (response) {
      if (
        response.data[0] != null ||
        response.data.tunnels != null ||
        response.data.tunnels[0] != null
      ) {
        deployed = response.data.tunnels[0];
      }
    })
    .catch(function (error) {
      if (!error.response || !error.response.data) {
        console.warn("FATAL: No response data! 44");
      } else {
        console.log(error.response.data);
      }
    });
}

app.listen(5000, () => {
  console.log("adress: http://localhost:5000");
  console.log("logs:");
});

app.post("/listener/logs/put", (req, res) => {
  if (!req.body) {
    return res.send({
      success: false,
      message: "no body added..",
    });
  }
  if (!req.body.log) {
    return res.send({
      success: false,
      message: "no log member of body added..",
    });
  }
  writeFileSync("./log.txt", req.body.log);
  res.send({
    success: true,
    message: "thank",
  });
});

app.get("/listener/logs/get_all", (req, res) => {
  const e = readFileSync("./log.txt", "utf8");
  res.send({
    success: true,
    log: e,
    message: "returned",
  });
});

app.get("/listener/printer/get_public_url", async (req, res) => {
  await getDeployer();
  if (deployed == null) {
    res.send({
      success: false,
      message: "'No found'",
    });
  } else {
    res.send({
      success: false,
      message: deployed.public_url,
    });
  }
});

app.post("/listener/logs/clear", (req, res) => {
  writeFileSync(
    "./log.txt",
    `<colorization id="error">[Website] [Server up/WARN]: Server sender offline</colorization>`
  );
  res.send({
    success: true,
    message: "returned (clear data)",
  });
});

app.post("/listener/logs/ended", (req, res) => {
  appendFileSync(
    "./log.txt",
    "<colorization id='error'>Connection finished!</colorization>"
  );
  res.send({
    success: true,
    message: "returned (finished data)",
  });
});
