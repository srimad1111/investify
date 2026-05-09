from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class QuoteData(BaseModel):
    symbol: str
    name: str
    price: Optional[float] = None
    change: Optional[float] = None
    change_pct: Optional[float] = None
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    prev_close: Optional[float] = None
    volume: Optional[int] = None
    market_cap: Optional[float] = None
    exchange: str = "NSE"
    timestamp: Optional[str] = None
    error: Optional[str] = None


class OHLCVBar(BaseModel):
    time: int  # Unix timestamp
    open: float
    high: float
    low: float
    close: float
    volume: float


class HistoryResponse(BaseModel):
    symbol: str
    interval: str
    bars: List[OHLCVBar]


class SearchResult(BaseModel):
    symbol: str
    name: str
    exchange: str
    type: str


class OrderRequest(BaseModel):
    uid: str
    symbol: str
    exchange: str = "NSE"
    side: str          # BUY | SELL
    order_type: str    # MARKET | LIMIT | SL
    product: str       # CNC | MIS | NRML
    quantity: int
    price: Optional[float] = None
    trigger_price: Optional[float] = None


class OrderResponse(BaseModel):
    id: str
    uid: str
    symbol: str
    exchange: str
    side: str
    order_type: str
    product: str
    quantity: int
    price: Optional[float]
    trigger_price: Optional[float]
    status: str
    filled_price: Optional[float] = None
    pnl: Optional[float] = None
    created_at: str


class SentimentResult(BaseModel):
    symbol: str
    signal: str        # BULLISH | BEARISH | NEUTRAL
    score: float       # -1.0 to 1.0
    confidence: int    # percentage
    bullish_hits: int
    bearish_hits: int
    headlines: List[dict]
    cached: bool = False
    cached_at: Optional[str] = None
