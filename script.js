// Get references to HTML elements
const xCoords = document.getElementById('x-coordinates');
const yCoords = document.getElementById('y-coordinates');
const button = document.getElementById('btn');
var msg = document.getElementById('msg');

// Initial latitude and longitude values
var lat = 0.02;
var long = 36.90;

// Event listener for button click
button.addEventListener('click', () => {
    // Update latitude and longitude from input values
    lat = xCoords.value;
    long = yCoords.value;
    // Clear input fields
    xCoords.value = "";
    yCoords.value = "";
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
    // Round latitude and longitude to 2 decimal places
    var lat = roundTo(popLocation.lat,2);
    var long = roundTo(popLocation.lng,2);
    var result ;
    // Fetch reverse geocoding information and country details using Geoapify and Restcountries APIs
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&format=json&apiKey=process.env.API_KEY_geoapify`)
    .then(response => response.json())
    .then(data =>{
          result = data.results[0].address_line1
          country_result = data.results[0].country
          console.log(result)
          console.log(country_result)
          fetch(`https://restcountries.com/v3.1/name/${country_result}?fullText=true`)
          .then(response => response.json())
          .then(data=> {
            console.log(data)
            // Create a popup with location and country information
            var popup = L.popup()
            .setLatLng(popLocation)
            .setContent(`<h5><b>${result}</b></h5>
                          <br /> 
                          <h6>Country: ${country_result}</h6>
                          <p>
                          <b>Population</b>: ${data[0].population}
                          <br />
                          <b>Area</b>: ${data[0].area}
                          </p>`)
            .openOn(map);    
            console.log(popLocation)    
            // Update message to display the new coordinates
            msg.innerHTML = `The coordinates are now:</br> latitude: ${lat}°</br>longitude: ${long}°`
      })
     
          })
          
});

// Add OpenStreetMap tile layer to the map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 2,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)
