# Investify AI - Indian Stock Trading & Analysis Platform

![Investify Header](https://investify-frontend-112040644736.us-central1.run.app/logo.png)

Investify is a high-performance web application designed for the Indian stock market. It provides real-time market data, advanced paper trading simulations, and AI-driven stock analysis to help investors learn and refine their trading strategies without financial risk.

## 🚀 Live Demo
**Website:** [https://investify-frontend-112040644736.us-central1.run.app](https://investify-frontend-112040644736.us-central1.run.app)

## ✨ Core Features

- **📊 Live Market Explorer**: Real-time price tracking for **NIFTY 50**, **SENSEX**, and major NSE/BSE stocks with high-frequency updates.
- **💰 Paper Trading Simulator**: Learn to trade with **₹10,00,000** virtual capital. Experience real market conditions without financial risk.
- **🕯️ Professional Charting**: High-performance interactive candlestick charts powered by `lightweight-charts` for deep technical analysis.
- **🔍 Intelligent Search**: Instantly locate any Indian stock using our fuzzy-search enabled global navigation.
- **📱 Responsive Institutional UI**: A "Bloomberg-inspired" dark mode interface optimized for both desktop and high-end mobile experiences.

---

## 🤖 AI-Powered Intelligence

Investify integrates cutting-edge AI to provide institutional-grade insights to retail traders:

### 💬 Investify AI Assistant
Powered by **Groq (Llama 3)**, our resident market expert is available 24/7 to:
- **Context-Aware Analysis**: It automatically knows the real-time data of the stock you are currently viewing.
- **Educational Support**: Explains complex technical indicators like RSI, MACD, and Bollinger Bands in simple terms.
- **Market Concepts**: Answers questions about market hours, order types, and trading strategies.

### 📰 Real-time Sentiment Scanner
Never miss a market-moving headline. Our AI engine:
- **Aggregates Global News**: Fetches the latest updates from Google News RSS for specific stocks.
- **Proprietary Scoring**: Uses a custom NLP algorithm to assign **Bullish/Bearish** scores to every headline.
- **Confidence Index**: Provides an overall sentiment signal with a confidence percentage to help validate your trades.

---

## 🛠️ Tech Stack

- **Frontend**: `React.js`, `Vite`, `Tailwind CSS`, `Framer Motion` (Animations), `Zustand` (State).
- **Backend**: `FastAPI` (Python), `WebSocket` (Real-time Streaming), `yfinance` API.
- **AI Engine**: `Groq Cloud SDK`, `Feedparser` (RSS Analysis).
- **Infrastructure**: `Google Cloud Run`, `Docker`.

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
- [Groq API Key](https://console.groq.com/)

### Backend Setup
1. `cd backend`
2. `python -m venv venv`
3. Activate: `venv\Scripts\activate` (Win) or `source venv/bin/activate` (Unix)
4. `pip install -r requirements.txt`
5. Create `.env` and add `GROQ_API_KEY=your_key_here`
6. `uvicorn app.main:app --reload --port 8080`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` with `VITE_API_URL=http://localhost:8080/api`
4. `npm run dev`

## ☁️ Deployment

Investify is fully dockerized and ready for **Google Cloud Run**.

```bash
# Deploy Backend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/investify-backend
gcloud run deploy investify-backend --image gcr.io/[PROJECT_ID]/investify-backend --region us-central1 --allow-unauthenticated

# Deploy Frontend
gcloud builds submit --tag gcr.io/[PROJECT_ID]/investify-frontend
gcloud run deploy investify-frontend --image gcr.io/[PROJECT_ID]/investify-frontend --region us-central1 --allow-unauthenticated
```

---

## 📄 License
Educational purposes only. Market data provided by Yahoo Finance.

## 👨‍💻 Author
**Srimad Snehashis**
- [LinkedIn](https://www.linkedin.com/in/srimadsnehashis/)
- [Portfolio](https://srimad.dev)
