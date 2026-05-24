const Message = require("../models/message");
const User = require("../models/user");
const Listing = require("../models/listing");

// Show inbox (all conversations)
module.exports.inbox = async (req, res) => {
    // Get all unique people this user has chatted with
    const sent = await Message.find({ sender: req.user._id }).distinct("receiver");
    const received = await Message.find({ receiver: req.user._id }).distinct("sender");

    const allUserIds = [...new Set([...sent.map(String), ...received.map(String)])];
    const conversationUsers = await User.find({ _id: { $in: allUserIds } }).select("username email");

    // Get unread count
    const unreadCount = await Message.countDocuments({ receiver: req.user._id, read: false });

    res.render("chat/inbox.ejs", { conversationUsers, unreadCount });
};

// Show conversation with a specific user
module.exports.conversation = async (req, res) => {
    const { userId } = req.params;
    const otherUser = await User.findById(userId).select("username email");
    if (!otherUser) {
        req.flash("error", "User not found!");
        return res.redirect("/chat");
    }

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: userId },
            { sender: userId, receiver: req.user._id },
        ],
    }).sort({ createdAt: 1 }).populate("sender", "username").populate("listing", "title");

    // Mark messages as read
    await Message.updateMany(
        { sender: userId, receiver: req.user._id, read: false },
        { read: true }
    );

    res.render("chat/conversation.ejs", { messages, otherUser });
};

// Send a message
module.exports.sendMessage = async (req, res) => {
    const { userId } = req.params;
    const { text, listingId } = req.body;

    if (!text || !text.trim()) {
        req.flash("error", "Message cannot be empty!");
        return res.redirect(`/chat/${userId}`);
    }

    const message = new Message({
        sender: req.user._id,
        receiver: userId,
        text: text.trim(),
        listing: listingId || null,
    });

    await message.save();
    res.redirect(`/chat/${userId}`);
};

// Contact host from listing page (initiate chat)
module.exports.contactHost = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You cannot message yourself!");
        return res.redirect(`/listings/${id}`);
    }

    res.redirect(`/chat/${listing.owner._id}?listingId=${id}`);
};
