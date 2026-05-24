const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send booking confirmation to guest
module.exports.sendBookingConfirmation = async ({ guestEmail, guestName, listingTitle, checkIn, checkOut, totalPrice, bookingId }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"StayNest 🏡" <${process.env.EMAIL_USER}>`,
            to: guestEmail,
            subject: `Booking Confirmed — ${listingTitle}`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="background: linear-gradient(135deg, #FF385C, #e31c5f); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 1.8rem;">🏡 StayNest</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Your booking is confirmed!</p>
                    </div>
                    <div style="padding: 32px;">
                        <h2 style="color: #1f2937;">Hello, ${guestName}! 🎉</h2>
                        <p style="color: #4b5563; line-height: 1.7;">Your booking for <strong>${listingTitle}</strong> has been successfully confirmed.</p>
                        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #FF385C;">
                            <p style="margin: 6px 0; color: #374151;"><strong>📅 Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
                            <p style="margin: 6px 0; color: #374151;"><strong>📅 Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
                            <p style="margin: 6px 0; color: #374151;"><strong>💰 Total Paid:</strong> ₹${totalPrice.toLocaleString("en-IN")}</p>
                            <p style="margin: 6px 0; color: #374151;"><strong>🔖 Booking ID:</strong> ${bookingId}</p>
                        </div>
                        <p style="color: #6b7280; font-size: 0.9rem;">Need help? Reply to this email or visit <a href="https://staynest-b414.onrender.com/help" style="color: #FF385C;">our help page</a>.</p>
                    </div>
                    <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #9ca3af; font-size: 0.85rem;">
                        © StayNest Private Limited · <a href="https://staynest-b414.onrender.com/privacy" style="color: #9ca3af;">Privacy</a>
                    </div>
                </div>
            `,
        });
    } catch (err) {
        console.error("Email error (booking confirmation):", err.message);
    }
};

// Send notification to host
module.exports.sendHostNotification = async ({ hostEmail, hostName, guestName, listingTitle, checkIn, checkOut }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"StayNest 🏡" <${process.env.EMAIL_USER}>`,
            to: hostEmail,
            subject: `New Booking — ${listingTitle}`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #FF385C, #e31c5f); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0;">🏡 StayNest</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">You have a new booking!</p>
                    </div>
                    <div style="padding: 32px;">
                        <h2 style="color: #1f2937;">Hello, ${hostName}!</h2>
                        <p style="color: #4b5563;"><strong>${guestName}</strong> has booked your listing <strong>${listingTitle}</strong>.</p>
                        <div style="background: white; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #22c55e;">
                            <p style="margin: 6px 0; color: #374151;"><strong>👤 Guest:</strong> ${guestName}</p>
                            <p style="margin: 6px 0; color: #374151;"><strong>📅 Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
                            <p style="margin: 6px 0; color: #374151;"><strong>📅 Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
                        </div>
                        <p style="color: #6b7280; font-size: 0.9rem;">Manage your bookings on <a href="https://staynest-b414.onrender.com/bookings" style="color: #FF385C;">StayNest</a>.</p>
                    </div>
                    <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #9ca3af; font-size: 0.85rem;">
                        © StayNest Private Limited
                    </div>
                </div>
            `,
        });
    } catch (err) {
        console.error("Email error (host notification):", err.message);
    }
};

// Welcome email on signup
module.exports.sendWelcomeEmail = async ({ email, username }) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
        const transporter = createTransporter();
        await transporter.sendMail({
            from: `"StayNest 🏡" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Welcome to StayNest, ${username}! 🏡`,
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; background: #f8fafc; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #FF385C, #e31c5f); padding: 40px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 2rem;">🏡 StayNest</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 1.1rem;">Find Your Comfort Away from Home</p>
                    </div>
                    <div style="padding: 40px;">
                        <h2 style="color: #1f2937;">Welcome, ${username}! 🎉</h2>
                        <p style="color: #4b5563; line-height: 1.8;">You've joined StayNest — your gateway to discovering unique vacation rentals around the world. Here's what you can do:</p>
                        <ul style="color: #374151; line-height: 2.2;">
                            <li>🔍 <strong>Browse</strong> thousands of unique stays</li>
                            <li>🏠 <strong>Host</strong> your own property</li>
                            <li>❤️ <strong>Save</strong> your favorite listings</li>
                            <li>📅 <strong>Book</strong> with ease</li>
                        </ul>
                        <a href="https://staynest-b414.onrender.com/listings" style="display: inline-block; background: #FF385C; color: white; padding: 14px 30px; border-radius: 30px; text-decoration: none; font-weight: 600; margin-top: 16px;">Explore Stays →</a>
                    </div>
                    <div style="background: #f1f5f9; padding: 16px; text-align: center; color: #9ca3af; font-size: 0.85rem;">
                        © StayNest Private Limited
                    </div>
                </div>
            `,
        });
    } catch (err) {
        console.error("Email error (welcome):", err.message);
    }
};
