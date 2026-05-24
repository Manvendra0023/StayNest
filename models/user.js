const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },
    avatar: {
        url: { type: String, default: "" },
        filename: { type: String, default: "" },
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
    language: {
        type: String,
        enum: ["en", "hi"],
        default: "en",
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);