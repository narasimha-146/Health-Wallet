# 🏥 Digital Health Wallet

## Architecture Diagram

```
┌────────────────────────┐
│        Frontend        │
│  React.js (Web App)    │
│                        │
│ - Dashboard            │
│ - Reports              │
│ - Vitals (Charts)      │
│ - Sharing              │
│ - Profile              │
└───────────▲────────────┘
            │ HTTPS (JWT)
            │
┌───────────┴────────────┐
│        Backend         │
│   Node.js + Express    │
│                        │
│ - Auth Middleware      │
│ - Reports APIs         │
│ - Vitals APIs          │
│ - Share APIs           │
│ - Profile APIs         │
│ - Email Service        │
└───────▲─────────▲──────┘
        │         │
        │         │
┌───────┴───┐ ┌───┴────────┐
│ Supabase  │ │  External  │
│ PostgreSQL│ │  Services  │
│ + Storage │ │            │
│           │ │ - Gmail    │
│ Tables:   │ │   (Email)  │
│ - users   │ │ - Twilio   │
│ - reports │ │   WhatsApp │
│ - vitals  │ │            │
│ - access  │ └────────────┘
└───────────┘
```

---

## 📌 Overview

Digital Health Wallet is a full-stack application that allows users to securely upload,
manage, track, and share medical reports and vital health data anytime, anywhere.

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- Recharts
- React Icons
- CSS

### Backend
- Node.js
- Express.js
- Supabase (PostgreSQL, Auth, Storage)
- JWT Authentication
- Nodemailer (Email)
- Twilio WhatsApp API

---

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
npm install
npm run dev
```

Create `.env`:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
TWILIO_ACCOUNT_SID=xxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Frontend
```bash
cd client
npm install
npm start
```

---

## 🔐 Key Features

- Secure authentication & authorization
- Medical report upload (Web & WhatsApp)
- Vitals tracking with charts
- Date & category based filtering
- Report sharing with permissions
- Email notifications
- Strong data security using RLS

---

## 📡 API Documentation

### Reports
- POST /reports/upload
- GET /reports

### Vitals
- POST /vitals
- GET /vitals

### Sharing
- POST /share/reports/share
- GET /reports/shared-with-me
- GET /reports/shared-by-me
- DELETE /reports/share/:id

### Profile
- GET /profile/get
- PUT /profile/update
- GET /profile/summary
- PUT /profile/change-password

---

## 🚀 Future Enhancements

- Signed URLs for secure downloads
- Explicit user roles
- Mobile app support
- Audit logs

---

## 👨‍💻 Author
Digital Health Wallet – Full Stack Health Management System
