const express = require("express");
const loki = require("lokijs");

const app = express();
var db = new loki("loki.json");

var locationUpdate = db.addCollection("locationUpdate");

const WebSocket = require("ws");

const ws = new WebSocket(
  "ws://13.59.114.154:8003/ws?device=mark&family=truefalses&encoding=text"
);
const ws1 = new WebSocket(
  "ws://13.59.114.154:8003/ws?device=s5&family=truefalses&encoding=text"
);
const ws2 = new WebSocket(
  "ws://13.59.114.154:8003/ws?device=brandon&family=truefalses&encoding=text"
);

ws.on("message", function incoming(data) {
  const { time, location, sensors, guesses } = JSON.parse(data);
  const guess = guesses.find(x => x.location === location);
  const readableTime = new Date(time);
  const user = sensors.d;
  const probability = Math.round(guess.probability * 100);

  console.log(
    `${readableTime} -- ${location} --  ${sensors.d} --  ${Math.round(
      guess.probability * 100
    )}`
  );
  locationUpdate.insert({
    user: user,
    omni: location,
    probability: probability,
    time: readableTime
  });
});

ws2.on("message", function incoming(data) {
  const { time, location, sensors, guesses } = JSON.parse(data);
  const guess = guesses.find(x => x.location === location);
  const readableTime = new Date(time);
  const user = sensors.d;
  const probability = Math.round(guess.probability * 100);

  console.log(
    `${readableTime} -- ${location} --  ${sensors.d} --  ${Math.round(
      guess.probability * 100
    )}`
  );
  locationUpdate.insert({
    user: user,
    omni: location,
    probability: probability,
    time: readableTime
  });
});

ws1.on("message", function incoming(data) {
  const { time, location, sensors, guesses } = JSON.parse(data);
  const guess = guesses.find(x => x.location === location);
  const readableTime = new Date(time);
  const user = sensors.d;
  const probability = Math.round(guess.probability * 100);

  console.log(
    `${readableTime} -- ${location} --  ${sensors.d} --  ${Math.round(
      guess.probability * 100
    )}`
  );
  locationUpdate.insert({
    user: user,
    omni: location,
    probability: probability,
    time: readableTime
  });
});

/**
 * Allow CORS to work for every request.
 * http://stackoverflow.com/a/13148080/135786
 */
app.use(function(req, res, next) {
  var oneof = false;
  if (req.headers.origin) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    oneof = true;
  }
  if (req.headers["access-control-request-method"]) {
    res.header(
      "Access-Control-Allow-Methods",
      req.headers["access-control-request-method"]
    );
    oneof = true;
  }
  if (req.headers["access-control-request-headers"]) {
    res.header(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"]
    );
    oneof = true;
  }
  // if we don't have this, no other headers will show.
  res.header("Access-Control-Expose-Headers", "Content-Type, Location");
  if (oneof) {
    res.header("Access-Control-Max-Age", 60 * 60 * 24 * 365);
  }

  // intercept OPTIONS method
  if (oneof && req.method == "OPTIONS") {
    res.send(200);
  } else {
    next();
  }
});

app.get("/omni/:location", (req, res) => {
  const temp = req.params;
  const results = locationUpdate
    .chain()
    .find({ omni: `${temp.location}` })
    .simplesort("time", { desc: true })
    .data();

  res.send(results);
});

app.listen(4000, () => {
  console.log("express is listening port 4000....");
});
