const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });
const profileController = require("../controllers/profile");

// View profile
router.get("/profile/:userId", wrapAsync(profileController.showProfile));

// Edit profile form
router.get("/profile/edit/me", isLoggedIn, profileController.renderEditProfile);

// Update profile
router.post("/profile/edit/me", isLoggedIn, upload.single("avatar"), wrapAsync(profileController.updateProfile));

// Toggle favorite
router.post("/favorites/:listingId/toggle", isLoggedIn, wrapAsync(profileController.toggleFavorite));

// View favorites
router.get("/favorites", isLoggedIn, wrapAsync(profileController.getFavorites));

module.exports = router;
