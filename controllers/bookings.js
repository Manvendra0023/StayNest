const Booking = require("../models/booking");
const Listing = require("../models/listing");
const { sendBookingConfirmation, sendHostNotification } = require("../utils/mailer");

// Show booking form
module.exports.renderBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    // Get all existing bookings for this listing (for blocked dates)
    const existingBookings = await Booking.find({
        listing: id,
        status: { $in: ["confirmed", "pending"] },
        checkOut: { $gte: new Date() },
    }).select("checkIn checkOut");

    res.render("bookings/new.ejs", { listing, existingBookings });
};

// Create booking
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body.booking;

    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
        req.flash("error", "Check-out date must be after check-in date!");
        return res.redirect(`/listings/${id}/book`);
    }

    // Conflict check
    const conflict = await Booking.findOne({
        listing: id,
        status: { $in: ["confirmed", "pending"] },
        $or: [
            { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } },
        ],
    });

    if (conflict) {
        req.flash("error", "These dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${id}/book`);
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    const booking = new Booking({
        listing: id,
        guest: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests) || 1,
        totalPrice,
        status: "confirmed",
        paymentStatus: "pending",
    });

    await booking.save();

    // Send emails (non-blocking)
    sendBookingConfirmation({
        guestEmail: req.user.email,
        guestName: req.user.username,
        listingTitle: listing.title,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalPrice,
        bookingId: booking._id,
    }).catch(() => {});

    if (listing.owner && listing.owner.email) {
        sendHostNotification({
            hostEmail: listing.owner.email,
            hostName: listing.owner.username,
            guestName: req.user.username,
            listingTitle: listing.title,
            checkIn: checkInDate,
            checkOut: checkOutDate,
        }).catch(() => {});
    }

    req.flash("success", "Booking confirmed! 🎉 Check your email for details.");
    res.redirect(`/bookings/${booking._id}/confirmation`);
};

// Show confirmation
module.exports.showConfirmation = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
        .populate("listing")
        .populate("guest");

    if (!booking || !booking.guest._id.equals(req.user._id)) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    res.render("bookings/confirmation.ejs", { booking });
};

// List all user bookings
module.exports.listBookings = async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    res.render("bookings/index.ejs", { bookings });
};

// Cancel booking
module.exports.cancelBooking = async (req, res) => {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking || !booking.guest.equals(req.user._id)) {
        req.flash("error", "You cannot cancel this booking!");
        return res.redirect("/bookings");
    }

    if (booking.status === "cancelled") {
        req.flash("error", "Booking already cancelled!");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    await booking.save();
    req.flash("success", "Booking cancelled successfully.");
    res.redirect("/bookings");
};
