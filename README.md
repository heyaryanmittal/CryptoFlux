🚀 CryptoFlux

CryptoFlux is a production-ready MERN stack cryptocurrency tracking and analytics platform that provides real-time market data, advanced charts, secure authentication, and personalized portfolio management — all deployed live on Vercel.

🌐 Live Demo:
👉 https://cryptoflux-cf.vercel.app/

📌 Features

🔐 Authentication

Secure signup & login using JWT

Password hashing with bcrypt

Protected routes

Logout with session cleanup

📊 Cryptocurrency Market Data

Real-time prices using CoinGecko API

Search for any cryptocurrency

Grid & list view toggle

Detailed coin pages with:

Price trends

High / Low

Interactive charts (Chart.js)

Related news & external links

⭐ Watchlist

Add/remove coins using star icon

Persistent watchlist stored in MongoDB

Quick access from dashboard

💼 Portfolio

Add purchased coins

Set quantity owned

Portfolio data saved securely

Portfolio summary on dashboard

👤 Profile

View name & email

Watchlist & portfolio overview

Terms & Conditions modal

🎨 UI & UX

Modern investor-focused design

Responsive layout

Theme colors: White, Black, Green & Gold

SPA routing with refresh support

🛠 Tech Stack
Frontend

React (Vite)

React Router DOM

Axios

Chart.js

Tailwind CSS / Modern CSS

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

bcrypt

Deployment

Vercel (Frontend & Backend)

MongoDB Atlas

Environment variables for security

📂 Project Structure
CryptoFlux/
├── frontend/   # React + Vite client
└── backend/    # Express + MongoDB API

⚙️ Environment Variables
Backend (Vercel)
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Frontend (Vercel)
VITE_API_URL=your_backend_deployed_vercel_url
VITE_CG_API_KEY=your_coingecko_api_key

🚀 Local Development
1️⃣ Clone Repository
git clone https://github.com/heyaryanmittal/CryptoFlux.git
cd CryptoFlux

2️⃣ Run Backend
cd backend
npm install
npm run dev

3️⃣ Run Frontend
cd frontend
npm install
npm run dev

🌍 Deployment

Backend deployed as serverless Express API on Vercel

Frontend deployed as Vite React app on Vercel

Frontend and backend deployed as separate Vercel projects

Fully production-ready with SPA routing support

📈 Future Enhancements

Portfolio Profit & Loss (P&L)

Price alerts & notifications

Exchange comparison

OAuth login (Google/GitHub)

👨‍💻 Author

Aryan Mittal
GitHub: https://github.com/heyaryanmittal

⭐ Support

If you like this project, consider giving it a star ⭐ on GitHub — it really helps!
