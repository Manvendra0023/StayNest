const Listing = require("../models/listing");
const { geocodeLocation } = require("../utils/geocoder");


module.exports.index = async (req, res) => {
    const { category, search, minPrice, maxPrice, guests, sort } = req.query;

    let query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        query.$or = [
            { location: { $regex: search, $options: "i" } },
            { country: { $regex: search, $options: "i" } },
            { title: { $regex: search, $options: "i"}},
        ];
    }

    // Price filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Guest filter
    if (guests) {
        query.maxGuests = { $gte: Number(guests) };
    }

    // Sort options
    let sortOption = {};
    if (sort === "price_asc") sortOption = { price: 1 };
    else if (sort === "price_desc") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { _id: -1 };

    const allListings = await Listing.find(query).sort(sortOption);
    res.render("listings/index.ejs", { allListings, filters: req.query });
};



module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); 
    }

    // User favorites check
    let isFavorited = false;
    if (req.user) {
        const user = await require("../models/user").findById(req.user._id).select("favorites");
        isFavorited = user.favorites.some(f => f.toString() === id);
    }

    return res.render("listings/show.ejs", { listing, isFavorited }); 
};


module.exports.createListing = async (req, res, next) => {  
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    // Geocode location
    const geo = await geocodeLocation(newListing.location, newListing.country);
    if (geo) {
        newListing.geometry = geo;
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/c_fill,h_250,w_300");
    return res.render("listings/edit.ejs", {listing, originalImageUrl});
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // 1. Update listing WITH validation
    let listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { runValidators: true, new: true }
    );

    // 2. If new image uploaded, update image
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    // 3. Re-geocode if location/country changed
    const geo = await geocodeLocation(listing.location, listing.country);
    if (geo) {
        listing.geometry = geo;
    }

    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};