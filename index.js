/* eslint-disable no-console */
const
  express = require("express"),
  fetch   = require("node-fetch"),
  port    = process.argv[2] || 3000,
  app     = express();

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

app.get("/geocode/:place", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  fetch(`https://nominatim.openstreetmap.org/search/${req.params.place}?format=json&addressdetails=1&limit=1`)
    .then(res => {
      if (!res.ok) throw new Error("Request failed " + res.statusText);
      return res;
    })
    .then(res => res.json())
    .then(data => {
      return JSON.stringify({
        name: data[0].display_name,
        coords: [data[0].lat, data[0].lon],
        bounds: [
          [data[0].boundingbox[0], data[0].boundingbox[2]],
          [data[0].boundingbox[1], data[0].boundingbox[3]]
        ]
      });
    })
    .then(data => res.send(data))
    .catch(err => console.error(err));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
