// Geocoder using OpenStreetMap Nominatim (free, no API key needed)
const geocodeLocation = async (location, country) => {
    try {
        const query = encodeURIComponent(`${location}, ${country}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
        
        const response = await fetch(url, {
            headers: {
                "User-Agent": "StayNest/1.0 (staynest-app)",
            },
        });

        const data = await response.json();

        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        }
        return null;
    } catch (err) {
        console.error("Geocoding error:", err.message);
        return null;
    }
};

module.exports = { geocodeLocation };
