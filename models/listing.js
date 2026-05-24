const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        url: String,
        filename: String,
    },

    price: Number,
    location: String,
    country: String,

    // Map coordinates (geocoded)
    geometry: {
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
    },

    // Booking-related
    maxGuests: {
        type: Number,
        default: 4,
        min: 1,
    },

    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Trending",
            "Rooms",
            "Iconic Cities",
            "Amazing pools",
            "Arctic",
            "Castles",
            "Camping",
            "Beach",
            "Mountains",
            "Wellness",
            "National parks",
            "OMG!",
            "Vineyards",
            "Design",
            "Domes",
            "Cabins",
            "Lake front",
            "Pet friendly",
            "Historical",
        ],
    },
});



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

