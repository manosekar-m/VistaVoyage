# VistaVoyage - Travel Agency Web Application 🌍

A full-stack MERN travel agency platform with Admin & User modules, AI chatbot, booking system, and analytics dashboard.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- OpenAI API key (optional – fallback AI works without it)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed       # Creates admin account + sample packages
npm run dev        # Starts server on port 5000
```

### Environment Variables (backend/.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/vistavoyage
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENAI_API_KEY=your_openai_api_key   # Optional

ADMIN_EMAIL=admin@vistavoyage.com
ADMIN_PASSWORD=Admin@123
```

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm start    # Starts on http://localhost:3000
```

---

## 🔑 Default Credentials

| Role  | Email                      | Password  |
|-------|----------------------------|-----------|
| Admin | admin@vistavoyage.com      | Admin@123 |
| User  | Register via /register     | Your choice |

---

## 📁 Project Structure

```
VistaVoyage/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js     # Cloudinary + multer setup
│   │   ├── db.js             # MongoDB connection
│   │   └── seed.js           # DB seeder (admin + packages)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── packageController.js
│   │   ├── bookingController.js
│   │   ├── feedbackController.js
│   │   ├── paymentController.js
│   │   ├── userController.js
│   │   └── aiController.js
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Package.js
│   │   ├── Booking.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── packageRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── userRoutes.js
│   │   └── aiRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── context/
        │   └── AuthContext.jsx      # Global auth state
        ├── utils/
        │   └── api.js               # Axios instance
        ├── components/
        │   └── shared/
        │       ├── Navbar.jsx
        │       ├── Footer.jsx
        │       ├── ChatBot.jsx       # AI Travel Assistant
        │       └── AdminLayout.jsx   # Sidebar layout
        ├── pages/
        │   ├── user/
        │   │   ├── HomePage.jsx
        │   │   ├── LoginPage.jsx
        │   │   ├── RegisterPage.jsx
        │   │   ├── PackagesPage.jsx
        │   │   ├── PackageDetail.jsx
        │   │   ├── BookingPage.jsx
        │   │   ├── MyBookings.jsx
        │   │   ├── ProfilePage.jsx
        │   │   ├── FeedbackPage.jsx
        │   │   ├── AboutPage.jsx
        │   │   └── ContactPage.jsx
        │   └── admin/
        │       ├── AdminLogin.jsx
        │       ├── AdminDashboard.jsx  # Charts + Stats
        │       ├── AdminBookings.jsx
        │       ├── AdminPackages.jsx
        │       ├── AdminUsers.jsx
        │       ├── AdminFeedback.jsx
        │       └── AdminProfile.jsx
        ├── App.jsx
        ├── index.js
        └── index.css
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint               | Access |
|--------|------------------------|--------|
| POST   | /api/auth/register     | Public |
| POST   | /api/auth/login        | Public |
| GET    | /api/auth/me           | User   |
| POST   | /api/auth/admin/login  | Public |
| GET    | /api/auth/admin/me     | Admin  |

### Packages
| Method | Endpoint              | Access |
|--------|-----------------------|--------|
| GET    | /api/packages         | Public |
| GET    | /api/packages/:id     | Public |
| POST   | /api/packages         | Admin  |
| PUT    | /api/packages/:id     | Admin  |
| DELETE | /api/packages/:id     | Admin  |

### Bookings
| Method | Endpoint                   | Access |
|--------|----------------------------|--------|
| POST   | /api/bookings              | User   |
| GET    | /api/bookings/my           | User   |
| PUT    | /api/bookings/:id/cancel   | User   |
| DELETE | /api/bookings/:id          | User   |
| GET    | /api/bookings              | Admin  |
| PUT    | /api/bookings/:id/status   | Admin  |

### Feedback
| Method | Endpoint                  | Access |
|--------|---------------------------|--------|
| POST   | /api/feedback             | User   |
| GET    | /api/feedback/my          | User   |
| GET    | /api/feedback             | Admin  |
| PUT    | /api/feedback/:id/reply   | Admin  |

### Admin
| Method | Endpoint              | Access |
|--------|-----------------------|--------|
| GET    | /api/admin/dashboard  | Admin  |
| GET    | /api/admin/users      | Admin  |
| DELETE | /api/admin/users/:id  | Admin  |
| PUT    | /api/admin/profile    | Admin  |

### AI & Payment
| Method | Endpoint             | Access |
|--------|----------------------|--------|
| POST   | /api/ai/chat         | Public |
| POST   | /api/payment/process | User   |

---

## 🤖 AI Chatbot

- Uses OpenAI GPT-3.5-turbo with package data as context
- Falls back to rule-based responses if no API key
- Example queries: "packages under ₹5000", "best 3 day trips", "packages in Goa"

---

## 🚢 Deployment

### Backend (Railway / Render)
```bash
# Set environment variables in dashboard
# Start command: node server.js
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the build/ folder
# Set REACT_APP_API_URL to your backend URL
```

### MongoDB Atlas
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/vistavoyage
```

---

## ✅ Features Checklist

- [x] JWT Authentication (User + Admin)
- [x] Admin Dashboard with Charts (Recharts)
- [x] Package CRUD with Cloudinary image upload
- [x] Multi-step Booking Flow
- [x] Dummy Payment Simulation
- [x] Feedback + Admin Reply System
- [x] AI Travel Chatbot (OpenAI + fallback)
- [x] User Profile Management
- [x] Responsive Design
- [x] Admin Sidebar with Collapsible Nav
- [x] Package Filtering (price, location, duration)
- [x] Booking Status Management
- [x] Auto Booking ID generation (VV00001)

---

Made with ❤️ for VistaVoyage
