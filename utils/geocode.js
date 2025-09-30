require('dotenv').config();
const fetch = require('node-fetch');



async function geocodeLocation(location) {
  const apiKey = process.env.POSITIONSTACK_API_KEY;
  const url = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${encodeURIComponent(location)}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!data.data || !data.data.length) {
    throw new Error('Location not found');
  }

  const { latitude, longitude } = data.data[0];
  console.log(data.data[0]);

  return { latitude, longitude };
}

module.exports = geocodeLocation;
