from fastapi import APIRouter, Query
from typing import List, Optional
from app.services.market_service import (
    get_quotes, get_history, search_stocks, get_market_status, INDEX_META, get_all_stocks
)

router = APIRouter()

DEFAULT_INDICES = list(INDEX_META.keys())


@router.get("/quotes")
def quotes(symbols: Optional[str] = Query(None)):
    syms = symbols.split(",") if symbols else DEFAULT_INDICES
    return get_quotes(syms)


@router.get("/indices")
def indices():
    return get_quotes(DEFAULT_INDICES)


@router.get("/history")
def history(
    symbol: str = Query(...),
    period: str = Query("1d"),
    interval: str = Query("5m"),
):
    bars = get_history(symbol, period, interval)
    return {"symbol": symbol, "period": period, "interval": interval, "bars": bars}


@router.get("/search")
def search(q: str = Query(..., min_length=1)):
    return search_stocks(q)


@router.get("/stocks")
def all_stocks():
    """Return all known tradeable stocks (not indices)."""
    return get_all_stocks()


@router.get("/status")
def market_status():
    return get_market_status()
