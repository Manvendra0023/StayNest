const Listing = require("../models/listing");
const User = require("../models/user");
const Booking = require("../models/booking");
const Review = require("../models/review");

// Admin dashboard - stats overview
module.exports.dashboard = async (req, res) => {
    const [totalListings, totalUsers, totalBookings, totalReviews, recentBookings, recentListings] = await Promise.all([
        Listing.countDocuments(),
        User.countDocuments(),
        Booking.countDocuments(),
        Review.countDocuments(),
        Booking.find().sort({ createdAt: -1 }).limit(5).populate("listing", "title").populate("guest", "username"),
        Listing.find().sort({ _id: -1 }).limit(5).populate("owner", "username"),
    ]);

    const revenue = await Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

    res.render("admin/dashboard.ejs", {
        stats: { totalListings, totalUsers, totalBookings, totalReviews, totalRevenue },
        recentBookings,
        recentListings,
    });
};

// Manage all listings
module.exports.manageListings = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
        ];
    }
    const listings = await Listing.find(query).populate("owner", "username").sort({ _id: -1 });
    res.render("admin/listings.ejs", { listings, search });
};

// Delete any listing (admin only)
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted by admin.");
    res.redirect("/admin/listings");
};

// Manage all users
module.exports.manageUsers = async (req, res) => {
    const { search } = req.query;
    let query = {};
    if (search) {
        query.$or = [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
        ];
    }
    const users = await User.find(query).sort({ _id: -1 });
    res.render("admin/users.ejs", { users, search });
};

// Toggle admin status
module.exports.toggleAdmin = async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        req.flash("error", "User not found!");
        return res.redirect("/admin/users");
    }
    // Prevent self-demotion
    if (user._id.equals(req.user._id)) {
        req.flash("error", "You cannot change your own admin status!");
        return res.redirect("/admin/users");
    }
    user.isAdmin = !user.isAdmin;
    await user.save();
    req.flash("success", `${user.username} is now ${user.isAdmin ? "an admin" : "a regular user"}.`);
    res.redirect("/admin/users");
};

// Delete user
module.exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
    if (req.params.userId === req.user._id.toString()) {
        req.flash("error", "You cannot delete yourself!");
        return res.redirect("/admin/users");
    }
    await User.findByIdAndDelete(userId);
    req.flash("success", "User deleted.");
    res.redirect("/admin/users");
};

// Manage all bookings
module.exports.manageBookings = async (req, res) => {
    const bookings = await Booking.find()
        .populate("listing", "title")
        .populate("guest", "username email")
        .sort({ createdAt: -1 });
    res.render("admin/bookings.ejs", { bookings });
};
