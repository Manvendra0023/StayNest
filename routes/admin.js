const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/admin");

// Admin dashboard
router.get("/admin/dashboard", isLoggedIn, isAdmin, wrapAsync(adminController.dashboard));

// Manage listings
router.get("/admin/listings", isLoggedIn, isAdmin, wrapAsync(adminController.manageListings));
router.delete("/admin/listings/:id", isLoggedIn, isAdmin, wrapAsync(adminController.deleteListing));

// Manage users
router.get("/admin/users", isLoggedIn, isAdmin, wrapAsync(adminController.manageUsers));
router.post("/admin/users/:userId/toggle-admin", isLoggedIn, isAdmin, wrapAsync(adminController.toggleAdmin));
router.delete("/admin/users/:userId", isLoggedIn, isAdmin, wrapAsync(adminController.deleteUser));

// Manage bookings
router.get("/admin/bookings", isLoggedIn, isAdmin, wrapAsync(adminController.manageBookings));

module.exports = router;
