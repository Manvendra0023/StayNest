// ============================================================
// booking.js — Flatpickr date picker & price calculator
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ---- DATE PICKERS ----
    const checkInInput = document.getElementById("checkIn");
    const checkOutInput = document.getElementById("checkOut");

    if (!checkInInput || !checkOutInput) return;

    // Build disabled date ranges from blocked bookings
    const disabledRanges = typeof blockedDates !== "undefined" ? blockedDates : [];

    const checkInPicker = flatpickr(checkInInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: disabledRanges.map(b => ({ from: b.from, to: b.to })),
        onChange: function(selectedDates) {
            // Set checkout min date to day after check-in
            if (selectedDates[0]) {
                const nextDay = new Date(selectedDates[0]);
                nextDay.setDate(nextDay.getDate() + 1);
                checkOutPicker.set("minDate", nextDay);
                checkOutPicker.clear();
                updatePriceSummary();
            }
        },
    });

    const checkOutPicker = flatpickr(checkOutInput, {
        minDate: "today",
        dateFormat: "Y-m-d",
        disable: disabledRanges.map(b => ({ from: b.from, to: b.to })),
        onChange: function() {
            updatePriceSummary();
        },
    });

    // ---- PRICE CALCULATOR ----
    function updatePriceSummary() {
        const checkIn = checkInPicker.selectedDates[0];
        const checkOut = checkOutPicker.selectedDates[0];

        if (!checkIn || !checkOut) {
            document.getElementById("priceSummary").style.display = "none";
            return;
        }

        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        if (nights <= 0) {
            document.getElementById("priceSummary").style.display = "none";
            return;
        }

        const pricePerN = typeof pricePerNight !== "undefined" ? pricePerNight : 0;
        const subtotal = nights * pricePerN;
        const gst = Math.round(subtotal * 0.18);
        const total = subtotal + gst;

        document.getElementById("nightsText").textContent = 
            `${nights} night${nights > 1 ? 's' : ''} × ₹${pricePerN.toLocaleString("en-IN")}`;
        document.getElementById("totalText").textContent = `₹${subtotal.toLocaleString("en-IN")}`;
        document.getElementById("grandTotal").textContent = `₹${total.toLocaleString("en-IN")}`;
        document.getElementById("priceSummary").style.display = "block";
    }

    // ---- FAVORITE TOGGLE ----
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const listingId = btn.dataset.listingId;
            if (!listingId) return;

            try {
                const res = await fetch(`/favorites/${listingId}/toggle`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();

                const icon = btn.querySelector("i");
                if (data.favorited) {
                    icon.classList.remove("fa-regular");
                    icon.classList.add("fa-solid");
                    btn.classList.add("fav-active");
                    btn.title = "Remove from Wishlist";
                } else {
                    icon.classList.remove("fa-solid");
                    icon.classList.add("fa-regular");
                    btn.classList.remove("fav-active");
                    btn.title = "Add to Wishlist";
                }

                // Show toast
                showToast(data.message);
            } catch (err) {
                console.error("Favorite toggle failed:", err);
            }
        });
    });

    // ---- MINI TOAST NOTIFICATION ----
    function showToast(message) {
        let toast = document.getElementById("fav-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "fav-toast";
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                background: #1f2937;
                color: white;
                padding: 10px 24px;
                border-radius: 30px;
                font-size: 0.9rem;
                z-index: 9999;
                box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                transition: opacity 0.3s;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = "1";
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => { toast.style.opacity = "0"; }, 2500);
    }

});
