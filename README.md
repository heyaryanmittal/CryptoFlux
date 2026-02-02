# 🚀 CryptoFlux – Cryptocurrency Portfolio & Market Analytics Platform

CryptoFlux is a production-ready MERN stack cryptocurrency tracking and analytics platform that delivers real-time market insights, interactive charts, secure authentication, and personalized portfolio & watchlist management — fully deployed on Vercel.

🌐 Live Demo: https://cryptoflux-cf.vercel.app/

---

## 📌 Overview

CryptoFlux helps users track cryptocurrencies, analyze market trends, manage watchlists, and maintain a personal crypto portfolio through a fast, responsive, and secure single-page application (SPA).

Designed with scalability and real-world usage in mind, CryptoFlux uses a modern React frontend, a secure Express backend, MongoDB persistence, and cloud-native deployment.

---

## ✨ Features

### 🔐 Authentication & Security
- Secure user signup & login using JWT
- Password hashing with bcrypt
- Protected routes with token validation
- Logout with session cleanup
- Environment-based secrets management

### 📊 Cryptocurrency Market Data
- Real-time prices via CoinGecko API
- Instant cryptocurrency search
- Grid & list view toggle
- Detailed coin pages with live price trends
- 24-hour high / low indicators
- Interactive charts using Chart.js
- External resources & related links

### ⭐ Watchlist
- Add or remove cryptocurrencies with one click
- Persistent watchlist stored in MongoDB
- Quick access from dashboard

### 💼 Portfolio Management
- Add purchased cryptocurrencies
- Track quantity owned per coin
- Secure portfolio storage per user
- Clean portfolio summary dashboard

### 👤 User Profile
- View personal details (name & email)
- Watchlist and portfolio overview
- Terms & Conditions modal

### 🎨 UI & UX
- Modern investor-focused design
- Fully responsive layout
- Clean color palette: White, Black, Green, Gold
- Smooth SPA routing with refresh support

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Chart.js
- Tailwind CSS / Modern CSS

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt

### Deployment & Infrastructure
- Vercel (Frontend & Backend)
- MongoDB Atlas
- Secure environment variables

---

## 📂 Project Structure

```bash
CryptoFlux/
├── frontend/   # React + Vite client
└── backend/    # Express + MongoDB API
```

⚙️ Environment Variables
Backend (.env)
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Frontend (.env)
```bash
VITE_API_URL=your_backend_vercel_url
VITE_CG_API_KEY=your_coingecko_api_key
```

🚀 Clone the Repository
```bash
git clone https://github.com/heyaryanmittal/CryptoFlux.git
cd CryptoFlux
```

Install Dependencies
```bash
npm install --prefix backend
npm install --prefix frontend
```

Run Backend
```bash
cd backend
npm run dev
```

Run Frontend
```bash
cd frontend
npm run dev
```
## 🌍 Deployment

- Backend deployed as a **serverless Express API** on Vercel
- Frontend deployed as a **Vite + React SPA** on Vercel
- Frontend and backend deployed as **separate Vercel projects**
- Fully production-ready with **SPA routing support**

---

## 📈 Future Enhancements

- Portfolio Profit & Loss (P&L)
- Price alerts & notifications
- Exchange comparison
- OAuth authentication (Google / GitHub)

---

## 👨‍💻 Author

**Aryan Mittal**  
GitHub: https://github.com/heyaryanmittal

---

## ⭐ Support

If you find this project useful, please consider giving it a ⭐ on GitHub — it really helps and motivates further development.
