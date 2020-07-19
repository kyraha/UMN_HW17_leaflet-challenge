// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: "pk.eyJ1IjoidTRzdHdxIiwiYSI6ImNrYzE1N3Y2ZTBwdngyeXJ1dHlmMG80YTIifQ.d-9ZPJg0m959ovxqWP9n2g"
});


// Create the map with our layers
var map = L.map("map", {
    center: [40, -115],
    zoom: 5,
    layers: [ new L.LayerGroup() ]
  });
  
// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

function markerSize(mag) {
    return 5000 + mag * 20000;
}

function markerColor(mag) {
    var normMag = mag / 6.0;
    if(normMag > 1.0) normMag = 1.0;
    var g = (15 - Math.floor(normMag * 15)).toString(16);
    var r = (Math.floor(normMag * 15)).toString(16);
    return `#${r}${g}0`;
}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
jsonData => {
    jsonData.features.forEach(feature => {
        var quake = feature.properties;
        var props = {
            fillOpacity: 0.5,
            color: "brown",
            weight: 1,
            fillColor: markerColor(quake.mag),
            // Setting our circle's radius equal to the output of our markerSize function
            // This will make our marker's size proportionate to its population
            radius: markerSize(quake.mag)
        };
        var coords = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
        L.circle(coords, props)
            .bindPopup(
                `<div class="quake-pop"><a href="${quake.url}" target="_blank">${quake.title}</a> <br/>
                ${new Date(quake.time).toLocaleString("en-US", {"timeZoneName": "short"})}<br />
                Type: ${quake.type}`)
            .addTo(map);
        
    });

    // Set up the legend
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [0,1,2,3,4,5,6,7];
        var colors = limits.map(x => markerColor(x));
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Earthquake Magnitude</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach((limit, index) => {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Adding legend to the map
    legend.addTo(map);
});

