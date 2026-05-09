import feedparser
import re
from typing import List, Dict
from datetime import datetime, timedelta

BULLISH_KEYWORDS = [
    "surge", "rally", "gain", "rise", "growth", "profit", "beat",
    "upgrade", "strong", "positive", "record", "outperform", "bull",
    "buy", "upside", "momentum", "recovery", "robust", "boost",
    "dividend", "expansion", "milestone", "acquisition", "order",
    "contract", "win", "launch", "partnership", "ipo", "allotment",
    "high", "top", "best", "breakout", "jump", "soar", "climbs",
]

BEARISH_KEYWORDS = [
    "crash", "fall", "drop", "loss", "decline", "downgrade", "weak",
    "negative", "low", "underperform", "bear", "sell", "risk",
    "warning", "cut", "miss", "plunge", "slump", "debt", "fraud",
    "probe", "penalty", "fine", "lawsuit", "concern", "uncertainty",
    "inflation", "slowdown", "recession", "default", "resign",
    "scam", "investigation", "raid", "seizure", "below", "tumbles",
]

# In-memory cache: {symbol -> {result, cached_at}}
_sentiment_cache: Dict[str, Dict] = {}
CACHE_TTL_MINUTES = 15


def _score_text(text: str) -> tuple:
    text_lower = text.lower()
    bull = sum(1 for kw in BULLISH_KEYWORDS if kw in text_lower)
    bear = sum(1 for kw in BEARISH_KEYWORDS if kw in text_lower)
    total = bull + bear
    score = (bull - bear) / max(total, 1) if total > 0 else 0.0
    return bull, bear, score


def _fetch_news(symbol: str) -> List[Dict]:
    # Strip exchange suffix for cleaner search
    clean = re.sub(r"\.(NS|BO)$", "", symbol).replace("^", "")
    url = (
        f"https://news.google.com/rss/search?q={clean}+India+stock"
        f"&hl=en-IN&gl=IN&ceid=IN:en"
    )
    headlines = []
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:
            headlines.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": entry.get("published", ""),
                "source": entry.get("source", {}).get("title", "Google News"),
            })
    except Exception:
        pass
    return headlines


def get_sentiment(symbol: str) -> Dict:
    now = datetime.utcnow()

    # Return from cache if fresh
    if symbol in _sentiment_cache:
        cached = _sentiment_cache[symbol]
        age = (now - cached["cached_at"]).total_seconds() / 60
        if age < CACHE_TTL_MINUTES:
            result = cached["result"].copy()
            result["cached"] = True
            result["cached_at"] = cached["cached_at"].isoformat()
            return result

    headlines = _fetch_news(symbol)

    if not headlines:
        result = {
            "symbol": symbol,
            "signal": "NEUTRAL",
            "score": 0.0,
            "confidence": 0,
            "bullish_hits": 0,
            "bearish_hits": 0,
            "headlines": [],
            "cached": False,
        }
        return result

    total_bull, total_bear = 0, 0
    scored_headlines = []

    for h in headlines:
        combined = h["title"]
        bull, bear, score = _score_text(combined)
        total_bull += bull
        total_bear += bear
        if score > 0.2:
            sentiment_label = "bullish"
        elif score < -0.2:
            sentiment_label = "bearish"
        else:
            sentiment_label = "neutral"
        scored_headlines.append({**h, "sentiment": sentiment_label, "score": round(score, 2)})

    total = total_bull + total_bear
    overall_score = (total_bull - total_bear) / max(total, 1)

    if overall_score > 0.2:
        signal = "BULLISH"
    elif overall_score < -0.2:
        signal = "BEARISH"
    else:
        signal = "NEUTRAL"

    confidence = int(abs(overall_score) * 100)

    result = {
        "symbol": symbol,
        "signal": signal,
        "score": round(overall_score, 3),
        "confidence": confidence,
        "bullish_hits": total_bull,
        "bearish_hits": total_bear,
        "headlines": scored_headlines[:5],
        "cached": False,
    }

    _sentiment_cache[symbol] = {"result": result, "cached_at": now}
    return result
