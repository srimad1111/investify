# Investify - Indian Stock Trading & Analysis Platform

Investify is a high-performance web application designed for the Indian stock market. It provides real-time market data, advanced paper trading simulations, and AI-driven stock analysis to help investors learn and refine their trading strategies without financial risk.

## 🚀 Live Demo
**Website:** [https://investify-frontend-112040644736.us-central1.run.app](https://investify-frontend-112040644736.us-central1.run.app)

## ✨ Features

- **Live Market Explorer**: Real-time price tracking for NIFTY 50, SENSEX, and major NSE/BSE stocks (Reliance, TCS, HDFC, etc.).
- **Paper Trading Simulator**: Start with ₹10,00,000 in virtual capital. Place market orders and track your performance with a real-time P&L dashboard.
- **Institutional Design**: A sleek, high-end "Dark Mode" interface inspired by premium trading terminals like Bloomberg and TradingView.
- **AI Assist**: Integrated AI chatbot (powered by Groq) to help you analyze stock news and market sentiment.
- **Dynamic Charts**: Interactive candlestick charts for technical analysis.
- **Global Search**: Instantly find and analyze any Indian stock by name or symbol.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Framer Motion (for smooth animations), Zustand (State Management).
- **Backend**: FastAPI (Python), WebSocket (for real-time price broadcasting), yfinance API.
- **Deployment**: Google Cloud Run (Dockerized), Google Cloud Build.
- **Styling**: Modern premium aesthetics with glassmorphism and custom color palettes.

## 📦 Project Structure

```text
├── frontend/             # React (Vite) frontend application
│   ├── src/              # Components, stores, hooks, and pages
│   └── Dockerfile        # Frontend container configuration
├── backend/              # FastAPI backend service
│   ├── app/              # API routes, services, and logic
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend container configuration
└── README.md             # Project documentation
```

## 🚀 Local Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker (optional)

### Backend Setup
1. Navigate to the backend folder: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Create a `.env` file based on `.env.example` and add your `GROQ_API_KEY`.
6. Start the server: `uvicorn app.main:app --reload --port 8080`

### Frontend Setup
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file: `VITE_API_URL=http://localhost:8080/api`
4. Start the dev server: `npm run dev`

## ☁️ Deployment

This project is optimized for **Google Cloud Run**. 

### Build & Deploy Backend
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/investify-backend
gcloud run deploy investify-backend --image gcr.io/[PROJECT_ID]/investify-backend --region us-central1 --allow-unauthenticated
```

### Build & Deploy Frontend
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/investify-frontend
gcloud run deploy investify-frontend --image gcr.io/[PROJECT_ID]/investify-frontend --region us-central1 --allow-unauthenticated
```

## 📄 License
This project is for educational purposes.

## 👨‍💻 Author
**Srimad Snehashis**
- LinkedIn: [https://www.linkedin.com/in/srimadsnehashis/](https://www.linkedin.com/in/srimadsnehashis/)
- Portfolio: [https://srimad.dev](https://srimad.dev)
