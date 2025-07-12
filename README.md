# 🔗 URL Shortener App

A full-stack URL Shortener web application where users can shorten long URLs, view their history, and manage links through a modern interface.

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Express Validator

## 📁 Project Structure

URL-Shortener-App/
├── backend/
│   ├── models/              # Mongoose schemas (URL, User, etc.)
│   ├── routes/              # Express routes (auth, url, etc.)
│   ├── middleware/          # JWT auth middleware, error handlers
│   ├── controllers/         # Route logic handling
│   └── server.js            # Entry point of backend server
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (forms, navbar, etc.)
│   │   ├── pages/           # Page components (Home, Login, Dashboard)
│   │   └── App.jsx          # Main React component
├── .env                     # Environment variables (in backend folder)
├── README.md                # Project documentation



## 🚀 Features

- 🔐 User Authentication (Register/Login with JWT)
- 🔗 URL shortening with random short codes
- 📜 View user-specific URL history
- 🌐 Responsive and modern UI
- 🧪 Form validation
- 🗑️ Delete shortened URLs (optional)
- ✨ Protected routes (only logged-in users can shorten/view URLs)

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Environment Variables

Create a `.env` file in the `backend` directory and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
