# 🏡 StayNest - Vacation Rental Platform

A full-stack web application for listing and booking vacation rentals, built with Node.js, Express, MongoDB, and EJS. Users can browse listings by category, create their own listings, leave reviews, and manage their bookings.

## 🌐 Live Demo
👉 https://staynest-b414.onrender.com

## ✨ Features

### 🔐 User Authentication & Authorization
- Secure user registration and login with Passport.js
- Password hashing and session management
- Protected routes for authenticated users only
- User-specific listing management

### 🏠 Listing Management
- Create, read, update, and delete (CRUD) vacation rental listings
- Upload images to Cloudinary for cloud-based storage
- Multiple property categories including:
  - Beach, Mountains, Castles, Camping
  - Amazing Pools, Arctic, Iconic Cities
  - Pet Friendly, Historical, and more
- Detailed property information (title, description, price, location)
- Image upload and management

### ⭐ Review System
- Leave ratings and comments on listings
- Star-based rating system (1-5 stars)
- Review ownership and deletion controls
- Average ratings display

### 🎨 User Interface
- Responsive design with Bootstrap
- Clean and modern UI/UX
- Flash messages for user feedback
- Category-based filtering
- Search and filter functionality

### 🔒 Security Features
- Input validation with Joi
- CSRF protection
- Secure password storage
- HTTP-only cookies
- Environment variable configuration

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Frontend
- **EJS** - Templating engine
- **Bootstrap** - CSS framework
- **JavaScript** - Client-side scripting

### Authentication
- **Passport.js** - Authentication middleware
- **Passport-Local** - Local authentication strategy
- **Passport-Local-Mongoose** - Mongoose plugin for authentication

### Cloud Services
- **Cloudinary** - Image hosting and management
- **MongoDB Atlas** - Cloud database hosting

### Additional Libraries
- **express-session** - Session management
- **connect-flash** - Flash messages
- **connect-mongo** - MongoDB session store
- **method-override** - HTTP method override
- **multer** - File upload handling
- **joi** - Schema validation
- **dotenv** - Environment variable management

## 🏗️ System Architecture

```
┌──────────────────┐
│      Browser     │
│  (User / Client) │
└─────────┬────────┘
          │ HTTP Requests
          ▼
┌──────────────────┐
│   Express Server │
│   (Node.js)      │
│                  │
│ Routes / Auth    │
│ Controllers      │
│ Middleware       │
└───────┬────┬─────┘
        │    │
        │    │ Image Uploads
        │    ▼
        │  ┌────────────────┐
        │  │  Cloudinary     │
        │  │  (Images CDN)   │
        │  └────────────────┘
        │
        ▼
┌──────────────────┐
│   MongoDB Atlas  │
│   (Database)     │
│ Listings, Users  │
│ Reviews, Sessions│
└──────────────────┘
```

**Architecture Explanation:**

StayNest follows a client-server architecture where the frontend sends requests to a Node.js and Express backend. The backend handles authentication, listings, and reviews, stores data in MongoDB Atlas, and uploads images to Cloudinary. The entire application is deployed on Render.

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- npm or yarn package manager
- Cloudinary account (for image uploads)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/staynest.git
   cd staynest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=production
   ATLASDB_URL=your_mongodb_atlas_connection_string
   SESSION_SECRET=your_session_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Initialize the database with sample data (optional)**
   ```bash
   node init/index.js
   ```

5. **Start the server**
   ```bash
   node app.js
   ```

6. **Access the application**
   
   Open your browser and navigate to `http://localhost:8080`

## 📁 Project Structure

```
staynest/
│
├── controllers/          # Route controllers
│   ├── listings.js      # Listing CRUD operations
│   ├── reviews.js       # Review operations
│   └── users.js         # User authentication
│
├── models/              # Mongoose models
│   ├── listing.js       # Listing schema
│   ├── review.js        # Review schema
│   └── user.js          # User schema
│
├── routes/              # Express routes
│   ├── listing.js       # Listing routes
│   ├── review.js        # Review routes
│   └── user.js          # User routes
│
├── views/               # EJS templates
│   ├── layouts/         # Layout templates
│   ├── listings/        # Listing views
│   ├── users/           # User views
│   ├── pages/           # Static pages
│   └── includes/        # Reusable components
│
├── public/              # Static files
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side scripts
│   └── images/          # Static images
│
├── utils/               # Utility functions
│   ├── ExpressError.js  # Custom error class
│   ├── wrapAsync.js     # Async error wrapper
│   └── categories.js    # Listing categories
│
├── init/                # Database initialization
│   ├── data.js          # Sample data
│   └── index.js         # Initialization script
│
├── middleware.js        # Custom middleware
├── schema.js            # Joi validation schemas
├── cloudConfig.js       # Cloudinary configuration
├── app.js               # Main application file
└── package.json         # Project dependencies
```

## 🎯 Key Features Implementation

### Authentication Flow
1. Users register with username, email, and password
2. Passwords are hashed using passport-local-mongoose
3. Sessions are stored in MongoDB for persistence
4. Protected routes check authentication status

### Listing Creation
1. Users upload property images via Multer
2. Images are stored on Cloudinary
3. Form data is validated using Joi schemas
4. Listings are saved to MongoDB with owner reference

### Review System
1. Authenticated users can leave reviews
2. Reviews include rating (1-5) and comment
3. Reviews are linked to listings via ObjectId references
4. Users can only delete their own reviews

## 🔧 Configuration

### MongoDB Configuration
Update the `ATLASDB_URL` in your `.env` file with your MongoDB connection string.

### Cloudinary Configuration
Set up your Cloudinary credentials in the `.env` file. The configuration is handled in `cloudConfig.js`.

### Session Configuration
Session lifetime is set to 7 days. Modify in `app.js` if needed:
```javascript
cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
}
```

## 🧪 API Endpoints

### Listings
- `GET /listings` - Get all listings
- `GET /listings/new` - Show create listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - Show listing details
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Create review
- `DELETE /listings/:id/reviews/:reviewId` - Delete review

### Users
- `GET /signup` - Show signup form
- `POST /signup` - Register new user
- `GET /login` - Show login form
- `POST /login` - Authenticate user
- `GET /logout` - Logout user

## 🎨 Available Categories

- Trending
- Rooms
- Iconic Cities
- Amazing Pools
- Arctic
- Castles
- Camping
- Beach
- Mountains
- Wellness
- National Parks
- OMG!
- Vineyards
- Design
- Domes
- Cabins
- Lake Front
- Pet Friendly
- Historical

## 🔐 Security Best Practices

- Environment variables for sensitive data
- Password hashing with bcrypt
- HTTP-only cookies
- Session secret for cookie signing
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection through EJS escaping

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Manvendra**

## 🙏 Acknowledgments

- Bootstrap for UI components
- Unsplash for sample images
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- The Node.js and Express.js communities

## 📞 Support

For support, email manvendrakumar0023@gmail.com or open an issue in the repository.

## 🚀 New Features Added (v2.0)

### 📅 Booking System with Calendar
- Interactive date picker (Flatpickr) with blocked dates
- Conflict detection prevents double-bookings
- Dynamic price calculator with 18% GST
- Booking confirmation page with details summary
- "My Bookings" page with cancel functionality

### 🗺️ Map Integration (Leaflet.js + OpenStreetMap)
- Free, no API key required
- Auto-geocoding of listing locations via OpenStreetMap Nominatim
- Single-listing show page map with radius circle
- Multi-listing index map with clickable popups

### 🔍 Advanced Search & Filters
- Price range (min/max) filter
- Guest count filter
- Sort by: Price Low→High, Price High→Low, Newest
- Collapsible filter panel with active indicator

### 👤 User Profiles & Favorites/Wishlist
- Profile page with avatar, bio, listing count
- Avatar upload via Cloudinary
- Wishlist (favorites) with AJAX heart toggle
- Toast notifications for wishlist actions

### 📧 Email Notifications (Nodemailer)
- Welcome email on signup (HTML template)
- Booking confirmation email to guest
- New booking notification email to host
- Gracefully disabled if EMAIL_USER/EMAIL_PASS not set

### 💬 Host-Guest Chat
- In-app messaging between hosts and guests
- "Contact Host" button on every listing
- Inbox with all conversations
- Unread message count badge in navbar
- Chat bubble UI (blue = me, white = them)

### 🌐 Multi-language Support (i18n)
- English & Hindi locale files
- Language toggle in navbar (🇬🇧 EN / 🇮🇳 हिं)
- Language preference saved in cookie & user profile

### 🛠️ Admin Dashboard
- Stats: total listings, users, bookings, reviews, revenue
- Manage all listings (search, edit, delete)
- Manage all users (search, grant/revoke admin, delete)
- Manage all bookings (full table view)
- Protected by `isAdmin` middleware

---

## 🛠️ Additional Tech Stack (v2.0)

- **Flatpickr** — Date picker for bookings
- **Leaflet.js** — Open-source interactive maps
- **OpenStreetMap Nominatim** — Free geocoding API
- **Nodemailer** — Email notifications
- **i18n** — Internationalization (EN + HI)

---

## 📋 Updated API Endpoints

### Bookings
- `GET /listings/:id/book` — Booking form
- `POST /listings/:id/book` — Create booking
- `GET /bookings` — My bookings list
- `GET /bookings/:id/confirmation` — Booking confirmation
- `POST /bookings/:id/cancel` — Cancel booking

### Chat
- `GET /chat` — Inbox
- `GET /chat/:userId` — Conversation
- `POST /chat/:userId` — Send message
- `GET /listings/:id/contact-host` — Contact host

### Profile & Favorites
- `GET /profile/:userId` — View profile
- `GET /profile/edit/me` — Edit profile form
- `POST /profile/edit/me` — Update profile
- `POST /favorites/:listingId/toggle` — Toggle favorite (AJAX)
- `GET /favorites` — My wishlist

### Admin
- `GET /admin/dashboard` — Admin dashboard
- `GET /admin/listings` — Manage listings
- `DELETE /admin/listings/:id` — Delete listing
- `GET /admin/users` — Manage users
- `POST /admin/users/:id/toggle-admin` — Toggle admin
- `DELETE /admin/users/:id` — Delete user
- `GET /admin/bookings` — Manage bookings

### Language
- `GET /lang/:locale` — Switch language (en/hi)

---

## ⚙️ Setup for New Features

### Email Notifications (Optional)
Add to your `.env`:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```
> Generate an App Password at: https://myaccount.google.com/apppasswords

### First Admin User
To make yourself an admin, run in MongoDB shell:
```js
db.users.updateOne({ username: "your_username" }, { $set: { isAdmin: true } })
```

---

## 🚧 Future Enhancements

- [x] Add booking functionality with calendar ✅
- [x] Add advanced search with filters ✅
- [x] Include map integration for locations ✅
- [x] Add user profiles with favorite listings ✅
- [x] Implement email notifications ✅
- [x] Add chat functionality between hosts and guests ✅
- [x] Multi-language support ✅
- [x] Admin dashboard for platform management ✅
- [ ] Payment gateway integration (Razorpay) — Coming Soon
- [ ] Mobile app development — Planned
