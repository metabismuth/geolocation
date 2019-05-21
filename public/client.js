/* eslint-disable no-console */
const MAPBOX_ACCESSTOKEN = "pk.eyJ1Ijoia296aWxlayIsImEiOiJjanIzZ2cwYW0xZWJsNDRxcWJwNjYwb2lkIn0.dzIAG-AfgeCyHzAN2fN0_g";

const map = L.map("map");
map.setView([0, 0], 2.1);
let marker;

L.tileLayer(
  "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
  {
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: MAPBOX_ACCESSTOKEN
  }
).addTo(map);

const geocode = () => {
  let input = document.getElementById("text").value;
  fetch(`/geocode/${input}`)
    .then(res => res.json())
    .then(data => {
      // Go there in the map
      map.flyToBounds(data.bounds);

      // Display a marker
      if (marker) marker.remove();
      marker = L.marker(data.coords);
      marker.addTo(map);
      marker.bindPopup(`<h2 style="text-align:center">${data.name}</h2>`)
        .openPopup();
    })
    .catch(err => console.error(err));
};

document.getElementById("go").addEventListener("click", geocode);
document.getElementById("text").addEventListener("keypress", (e) => {
  // If Enter is pressed
  if (e.keyCode === 13) geocode();
});
