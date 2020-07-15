d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson",
jsonData => {
    console.log(jsonData);
});