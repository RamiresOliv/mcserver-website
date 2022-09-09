const express = require("express");
const { writeFileSync, readFileSync, appendFileSync } = require("fs");
const axios = require("axios").default;
const app = express();

/*
.env file:
  AllowedIPs = "<IPS> " # Exemple: "111.111.11.111, 222.222.22.222, 333.333.33.333, ..."
  NgrokAPIKey = "<TOKEN>"
*/

writeFileSync(
  "./filtred_logs.log",
  `<colorization id="error">[Website] [Server up WARN]:</colorization> Server sender offline.`
);

check_allowed_ip = (request_ip) => {
  var allowed = false;
  const ips = process.env.AllowedIPs.replace(" ", "").split(",");
  for (var i in ips) {
    if (request_ip == ips[i]) {
      allowed = true;
    }
  }
  return allowed;
};

require("dotenv").config();
app.disable("x-powered-by");
app.set("trust proxy", true);
app.use(express.json());
app.use((req, res, next) => {
  var allowed = check_allowed_ip(req.ip);
  if (!allowed) {
    console.warn("No allowed IP tryed access: " + req.ip);
    return res.status(405).send(`<style>body {
        font-family: sans-serif;
        color: rgb(184, 184, 184);
        text-align: center;
        background-color: rgb(32, 32, 32);
      }</style> <h1>This access has been declined.</h1><p>for some reason this request has been declined :<</p><p>we sorry man!!</p><p>${req.ip}</p>
      
      <script id="restarter_page"> setTimeout(() => { window.location.reload(); }, 5000);</script>
      <script id="self_src">setTimeout(() => {console.clear(); console.warn('Your connection request has been declined. Address: "${req.ip}"'); setTimeout(() => {document.getElementById("self_src").remove()}, 3000)}, 300)</script>`);
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
    req.url.includes("/client/for_do/make/file") ||
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
        Authorization: "Bearer " + process.env.NgrokAPIKey,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("adress: http://localhost:3000");
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

  const oo = req.body.log.replace("\n", "&&@!_").split("_");
  for (var i in oo) {
    if (
      oo[i].includes("Unbundling libraries to") ||
      oo[i].includes("Expected file") ||
      oo[i].includes("Unpacking")
    ) {
      delete oo.shift();
    }
  }

  const filtred_logs = oo
    .join("@!")
    .replace("&&", "\n")
    .replace("\r", "")
    .replace("@!@!", "");
  writeFileSync("./filtred_logs.log", filtred_logs);
  res.send({
    success: true,
    message: "thank",
  });
});

app.get("/listener/logs/get_all", (req, res) => {
  const check = check_allowed_ip(req.ip);
  if (!check) {
    return res.redirect(req.url);
  } else {
    const e = readFileSync("./filtred_logs.log", "utf8");
    res.send({
      success: true,
      log: e,
      message: "returned",
    });
  }
});

const regions = {
  sa: "South America",
  ca: "Central America",
  na: "North America",
};

app.get("/listener/printer/get_public_url", async (req, res) => {
  await getDeployer();
  if (deployed == null) {
    res.send({
      success: false,
      public_url: "None",
      region: "None",
    });
  } else {
    let region = "Unknow";
    if (regions[deployed.region]) {
      region = regions[deployed.region];
    } else {
      region = deployed.region;
    }
    var date = new Date();
    res.send({
      success: true,
      public_url: deployed.public_url,
      region: region,
      alived_time: null,
    });
  }
});

app.post("/listener/logs/clear", (req, res) => {
  writeFileSync(
    "./filtred_logs.log",
    `<colorization id="error">[Website] [Server up WARN]: Server sender offline</colorization>`
  );
  res.send({
    success: true,
    message: "returned (clear data)",
  });
});

app.post("/listener/logs/ended", (req, res) => {
  appendFileSync(
    "./filtred_logs.log",
    "<colorization id='error'>Connection finished!</colorization>"
  );
  res.send({
    success: true,
    message: "returned (finished data)",
  });
});

app.post("/client/for_do/make/file", (req, res) => {
  const e = readFileSync("./filtred_logs.log", "utf8");
  console.log(e);
  writeFileSync("./public/util/logs/current_log.log", e);
  res.send({
    success: true,
    message: "returned (created file)",
  });
});
