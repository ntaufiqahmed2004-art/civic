export const getCityFromBrowser = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await res.json();
        // Returns "Coimbatore" or similar
        resolve(data.city || data.locality || "Unknown City");
      } catch (err) {
        reject("Failed to fetch city name");
      }
    }, (err) => reject("Permission denied"));
  });
};