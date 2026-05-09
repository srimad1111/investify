from fastapi import APIRouter, Query
from app.services.sentiment_service import get_sentiment

router = APIRouter()


@router.get("/scan")
def scan(symbol: str = Query(...)):
    return get_sentiment(symbol)


@router.get("/bulk")
def bulk_scan(symbols: str = Query(...)):
    syms = [s.strip() for s in symbols.split(",")][:10]
    return [get_sentiment(s) for s in syms]
