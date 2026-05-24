const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const { cloudinary } = require("../cloudConfig");

// Show user profile
module.exports.showProfile = async (req, res) => {
    const { userId } = req.params;
    const profileUser = await User.findById(userId).populate("favorites");
    if (!profileUser) {
        req.flash("error", "User not found!");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({ owner: userId });
    const isOwner = req.user && req.user._id.equals(userId);

    res.render("profile/show.ejs", { profileUser, listings, isOwner });
};

// Render edit profile form
module.exports.renderEditProfile = async (req, res) => {
    res.render("profile/edit.ejs", { user: req.user });
};

// Update profile
module.exports.updateProfile = async (req, res) => {
    const { bio } = req.body;
    const update = { bio };

    if (req.file) {
        // Delete old avatar from cloudinary if exists
        if (req.user.avatar && req.user.avatar.filename) {
            await cloudinary.uploader.destroy(req.user.avatar.filename).catch(() => {});
        }
        update.avatar = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    await User.findByIdAndUpdate(req.user._id, update);
    req.flash("success", "Profile updated successfully!");
    res.redirect(`/profile/${req.user._id}`);
};

// Toggle favorite
module.exports.toggleFavorite = async (req, res) => {
    const { listingId } = req.params;
    const user = await User.findById(req.user._id);

    const idx = user.favorites.findIndex(f => f.toString() === listingId);
    if (idx === -1) {
        user.favorites.push(listingId);
        await user.save();
        return res.json({ favorited: true, message: "Added to wishlist!" });
    } else {
        user.favorites.splice(idx, 1);
        await user.save();
        return res.json({ favorited: false, message: "Removed from wishlist!" });
    }
};

// Get favorites list
module.exports.getFavorites = async (req, res) => {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("profile/favorites.ejs", { favorites: user.favorites });
};
