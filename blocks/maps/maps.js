function loadGoogleMapsScript(callback) {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDVMw03kp6ApXjoIThFfXOYe3arE3U_Lgg&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
  
  window.initMap = callback;
}

export default function decorate(block) {
  const mapDiv = block.querySelector('div');
  if (!mapDiv) return;

  // Extract location from the div's content
  const location = mapDiv.textContent.trim();
  if (!location) return;

  // Clear the original content
  mapDiv.textContent = '';

  // Set a unique ID for the map container
  const mapId = `map-${Math.random().toString(36).substr(2, 9)}`;
  mapDiv.id = mapId;

  // Add necessary classes
  mapDiv.classList.add('maps-container');
  block.classList.add('maps-block');

  // Define the initMap function
  function initializeMap() {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const map = new google.maps.Map(document.getElementById(mapId), {
          zoom: 15,
          center: results[0].geometry.location,
        });
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
        mapDiv.textContent = 'Could not load map';
      }
    });
  }

  // Load Google Maps API and initialize the map
  loadGoogleMapsScript(initializeMap);
}