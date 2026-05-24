const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/bookings");

// Booking form for a listing
router.get("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.renderBookingForm));

// Create booking
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createBooking));

// My bookings list
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.listBookings));

// Booking confirmation
router.get("/bookings/:bookingId/confirmation", isLoggedIn, wrapAsync(bookingController.showConfirmation));

// Cancel booking
router.post("/bookings/:bookingId/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

module.exports = router;
