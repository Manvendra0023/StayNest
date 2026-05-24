const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const chatController = require("../controllers/chat");

// Inbox
router.get("/chat", isLoggedIn, wrapAsync(chatController.inbox));

// Conversation with user
router.get("/chat/:userId", isLoggedIn, wrapAsync(chatController.conversation));

// Send message
router.post("/chat/:userId", isLoggedIn, wrapAsync(chatController.sendMessage));

// Contact host from listing
router.get("/listings/:id/contact-host", isLoggedIn, wrapAsync(chatController.contactHost));

module.exports = router;
