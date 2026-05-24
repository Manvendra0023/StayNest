if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const categories = require("./utils/categories.js");
const i18n = require("i18n");
const Message = require("./models/message.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const chatRouter = require("./routes/chat.js");
const profileRouter = require("./routes/profile.js");
const adminRouter = require("./routes/admin.js");


//connecting Database to Node/Express.

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main(){
    await mongoose.connect(dbUrl);
}


// i18n Configuration
i18n.configure({
    locales: ["en", "hi"],
    directory: path.join(__dirname, "locales"),
    defaultLocale: "en",
    cookie: "lang",
    autoReload: true,
    updateFiles: false,
    objectNotation: true,
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(i18n.init);


// session setup & cookie--> 

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: process.env.SESSION_SECRET,
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("Error in Mongo session store", err) 
});      


app.use(session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}));


app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Categories
app.use((req, res, next) => {
  res.locals.categories = categories;
  res.locals.activeCategory = req.query.category;
  next();
});

// Language switcher
app.get("/lang/:locale", (req, res) => {
    const { locale } = req.params;
    if (["en", "hi"].includes(locale)) {
        res.cookie("lang", locale, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        // Also save to user profile if logged in
        if (req.user) {
            User.findByIdAndUpdate(req.user._id, { language: locale }).catch(() => {});
        }
    }
    res.redirect("back");
});

// Unread message count for navbar
app.use(async (req, res, next) => {
    if (req.user) {
        try {
            res.locals.unreadMessages = await Message.countDocuments({ receiver: req.user._id, read: false });
        } catch (e) {
            res.locals.unreadMessages = 0;
        }
    } else {
        res.locals.unreadMessages = 0;
    }
    next();
});


//HOME PAGE ROUTE 
app.get("/", (req, res) => {
    res.render("home.ejs");
});


// For Listings Route
app.use("/", listingRouter);

// For Reviews Route
app.use("/listings/:id/reviews", reviewRouter);

//user
app.use("/", userRouter);

// Bookings
app.use("/", bookingRouter);

// Chat
app.use("/", chatRouter);

// Profile & Favorites
app.use("/", profileRouter);

// Admin
app.use("/", adminRouter);

//health check
app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

 
//Express Error 404 Error handling (very important)
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
});


//for server start ->on port 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`server is listening to port ${port}`);
});

