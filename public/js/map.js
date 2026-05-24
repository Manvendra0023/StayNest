// ============================================================
// map.js — Leaflet map initialization for StayNest
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ---- INDEX PAGE MAP (multiple listings) ----
    const listingsMapEl = document.getElementById("listings-map");
    if (listingsMapEl && typeof mapListings !== "undefined" && mapListings.length > 0) {
        const map = L.map("listings-map").setView([mapListings[0].lat, mapListings[0].lng], 5);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
            maxZoom: 19,
        }).addTo(map);

        // Custom marker icon
        const redIcon = L.divIcon({
            html: `<div style="
                background: #FF385C;
                color: white;
                border-radius: 50% 50% 50% 0;
                width: 32px;
                height: 32px;
                transform: rotate(-45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            "><i class="fa-solid fa-home" style="transform: rotate(45deg); font-size: 14px;"></i></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
            className: "",
        });

        mapListings.forEach(listing => {
            L.marker([listing.lat, listing.lng], { icon: redIcon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width: 140px; font-family: 'Plus Jakarta Sans', sans-serif;">
                        <img src="${listing.image}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px;">
                        <strong style="font-size:0.9rem;">${listing.title}</strong><br>
                        <span style="color:#FF385C;font-weight:600;">₹${listing.price?.toLocaleString("en-IN")}/night</span><br>
                        <a href="/listings/${listing.id}" style="color:#FF385C;font-size:0.8rem;">View →</a>
                    </div>
                `, { maxWidth: 200 });
        });

        // Fit map to markers
        if (mapListings.length > 1) {
            const bounds = L.latLngBounds(mapListings.map(l => [l.lat, l.lng]));
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }

    // ---- SHOW PAGE MAP (single listing) ----
    const showMapEl = document.getElementById("show-map");
    if (showMapEl) {
        const lat = parseFloat(showMapEl.dataset.lat);
        const lng = parseFloat(showMapEl.dataset.lng);
        const title = showMapEl.dataset.title;

        const map = L.map("show-map").setView([lat, lng], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>",
            maxZoom: 19,
        }).addTo(map);

        L.circle([lat, lng], {
            color: "#FF385C",
            fillColor: "#FF385C",
            fillOpacity: 0.2,
            radius: 500,
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<strong>${title}</strong><br><small>Exact location provided after booking</small>`)
            .openPopup();
    }

});
