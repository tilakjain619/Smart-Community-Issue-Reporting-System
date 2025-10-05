async function getLocation(lat, lon) {
  const apiKey = process.env.OPENCAGE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  const components = data.results[0]?.components || {};
  const city = components.city || components.town || components.village || "";
  const state = components.state || "";

  return { city, state };
}
module.exports = getLocation;