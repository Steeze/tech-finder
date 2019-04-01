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
