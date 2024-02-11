// Get references to HTML elements
const xCoords = document.getElementById('x-coordinates');
const yCoords = document.getElementById('y-coordinates');
const button = document.getElementById('btn');
var msg = document.getElementById('msg');

// Initial latitude and longitude values
var lat = 0.02;
var long = 36.90;
var result ;

function createPopups(lat,long){
  
    // Fetch reverse geocoding information and country details using Geoapify and Restcountries APIs
    fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}&api_key=658eee18a9d00961635940cisab19fd`)
    .then(response => response.json())
    .then(data =>{
          result = data.display_name
          country_result = data.address.country
          console.log(data)
          console.log(country_result)
          fetch(`https://restcountries.com/v3.1/name/${country_result}?fullText=true`)
          .then(response => response.json())
          .then(data=> {
            console.log(data)
            // Create a popup with location and country information
            var popup = L.popup()
            .setLatLng([lat,long])
            .setContent(`<h5><b>${result}</b></h5>
                          <br /> 
                          <h6>Country: ${country_result}</h6>
                          <p>
                          <b>Population</b>: ${data[0].population}
                          <br />
                          <b>Area</b>: ${data[0].area}
                          </p>`)
            .openOn(map);    })
          })
}

// Event listener for button click
button.addEventListener('click', () => {
    // Update latitude and longitude from input values
    lat = xCoords.value;
    long = yCoords.value;
    // Clear input fields
    xCoords.value = "";
    yCoords.value = "";

    createPopups(lat,long)
    // Pan the map to the new coordinates and add a marker
    map.panTo(new L.LatLng(lat, long), {
        Zoom: 6.1,
    });
    L.marker([lat,long]).addTo(map);
    // Update message to display the new coordinates
    msg.innerHTML = `The coordinates are now:</br> latitude: ${lat}°</br>longitude: ${long}°`;
});

// Initialize Leaflet map
var map = L.map('map').setView([lat, long], 6.1);

// Function to round a number to specified digits
function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
    if (n < 0) {
        negative = true;
        n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(digits);
    if (negative) {
        n = (n * -1).toFixed(digits);
    }
    return n;
}

// Event listener for map click
map.on('click', function(e) {        
    var popLocation= e.latlng;
    var lat = roundTo(popLocation.lat,2);
    var long = roundTo(popLocation.lng,2);
    // Round latitude and longitude to 2 decimal places
            console.log(popLocation)    
            createPopups(lat,long)
            // Update message to display the new coordinates
            msg.innerHTML = `The coordinates are now:</br> latitude: ${lat}°</br>longitude: ${long}°`
      })
     


// Add OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)
