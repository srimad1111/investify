import asyncio
import json
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.routers import market, orders, sentiment, chatbot
from app.services.market_service import get_quotes, fetch_single_quote, INDEX_META, POPULAR_STOCKS


class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: str):
        for ws in self.active[:]:
            try:
                await ws.send_text(message)
            except Exception:
                self.active.remove(ws)


manager = ConnectionManager()
# Broadcast both indices and all popular stocks
_BROADCAST_STOCKS = list(POPULAR_STOCKS.keys())
DEFAULT_SYMBOLS = list(INDEX_META.keys()) + _BROADCAST_STOCKS


async def price_broadcast_loop():
    loop = asyncio.get_event_loop()
    while True:
        try:
            if manager.active:
                # Fetch and broadcast in batches of 10 so prices appear quickly
                BATCH = 10
                for i in range(0, len(DEFAULT_SYMBOLS), BATCH):
                    batch = DEFAULT_SYMBOLS[i:i+BATCH]
                    data = await loop.run_in_executor(None, get_quotes, batch)
                    await manager.broadcast(json.dumps({"type": "quotes", "data": data}))
                    await asyncio.sleep(0)  # yield to event loop
        except Exception as e:
            print(f"Broadcast error: {e}")
        await asyncio.sleep(25)


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(price_broadcast_loop())
    yield
    task.cancel()


app = FastAPI(title="Investify API", version="1.0.0", lifespan=lifespan)

import os

# CORS Configuration
cors_origins_env = os.getenv("CORS_ORIGINS", "*")
origins = cors_origins_env.split(",") if cors_origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(market.router, prefix="/api/market", tags=["Market"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(sentiment.router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(chatbot.router, prefix="/api/chatbot", tags=["Chatbot"])


@app.get("/")
def root():
    return {"status": "ok", "service": "Investify API v1.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.websocket("/ws/feed")
async def websocket_feed(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        loop = asyncio.get_event_loop()
        # Send initial data in batches so prices appear immediately
        BATCH = 10
        for i in range(0, len(DEFAULT_SYMBOLS), BATCH):
            batch = DEFAULT_SYMBOLS[i:i+BATCH]
            data = await loop.run_in_executor(None, get_quotes, batch)
            await websocket.send_text(json.dumps({"type": "quotes", "data": data}))
            await asyncio.sleep(0)  # yield to event loop between batches
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
