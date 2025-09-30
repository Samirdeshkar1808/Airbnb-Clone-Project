document.addEventListener("DOMContentLoaded", function () {
  const map = L.map('map').setView([window.latitude, window.longitude], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([window.latitude, window.longitude]).addTo(map)
    .bindPopup(window.locationName)
    .openPopup();
});




