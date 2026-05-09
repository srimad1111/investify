import yfinance as yf
import pandas as pd
from typing import List, Dict, Optional
from datetime import datetime
import pytz
import requests

IST = pytz.timezone("Asia/Kolkata")

INDEX_META = {
    "^NSEI":       {"name": "NIFTY 50",        "exchange": "NSE"},
    "^NSEBANK":    {"name": "NIFTY BANK",       "exchange": "NSE"},
    "^CNXIT":      {"name": "NIFTY IT",         "exchange": "NSE"},
    "^NSMIDCP":    {"name": "NIFTY MIDCAP 100", "exchange": "NSE"},
    "^CNXAUTO":    {"name": "NIFTY AUTO",       "exchange": "NSE"},
    "^CNXPHARMA":  {"name": "NIFTY PHARMA",     "exchange": "NSE"},
    "^CNXFMCG":    {"name": "NIFTY FMCG",       "exchange": "NSE"},
    "^BSESN":      {"name": "SENSEX",           "exchange": "BSE"},
}

POPULAR_STOCKS = {
    # IT
    "TCS.NS":      {"name": "TCS",                 "exchange": "NSE", "sector": "IT"},
    "INFY.NS":     {"name": "Infosys",             "exchange": "NSE", "sector": "IT"},
    "WIPRO.NS":    {"name": "Wipro",               "exchange": "NSE", "sector": "IT"},
    "HCLTECH.NS":  {"name": "HCL Technologies",    "exchange": "NSE", "sector": "IT"},
    "TECHM.NS":    {"name": "Tech Mahindra",       "exchange": "NSE", "sector": "IT"},
    "LTIM.NS":     {"name": "LTIMindtree",         "exchange": "NSE", "sector": "IT"},
    "PERSISTENT.NS":{"name": "Persistent Systems", "exchange": "NSE", "sector": "IT"},
    "COFORGE.NS":  {"name": "Coforge",             "exchange": "NSE", "sector": "IT"},
    "OFSS.NS":     {"name": "Oracle Fin Services", "exchange": "NSE", "sector": "IT"},
    # Banking
    "HDFCBANK.NS": {"name": "HDFC Bank",           "exchange": "NSE", "sector": "Banking"},
    "ICICIBANK.NS":{"name": "ICICI Bank",          "exchange": "NSE", "sector": "Banking"},
    "SBIN.NS":     {"name": "SBI",                 "exchange": "NSE", "sector": "Banking"},
    "AXISBANK.NS": {"name": "Axis Bank",           "exchange": "NSE", "sector": "Banking"},
    "KOTAKBANK.NS":{"name": "Kotak Mahindra Bank", "exchange": "NSE", "sector": "Banking"},
    "INDUSINDBK.NS":{"name": "IndusInd Bank",      "exchange": "NSE", "sector": "Banking"},
    "FEDERALBNK.NS":{"name": "Federal Bank",       "exchange": "NSE", "sector": "Banking"},
    "IDFCFIRSTB.NS":{"name": "IDFC First Bank",    "exchange": "NSE", "sector": "Banking"},
    "PNB.NS":      {"name": "Punjab Natl Bank",    "exchange": "NSE", "sector": "Banking"},
    "BANKBARODA.NS":{"name": "Bank of Baroda",     "exchange": "NSE", "sector": "Banking"},
    "CANBK.NS":    {"name": "Canara Bank",         "exchange": "NSE", "sector": "Banking"},
    # Finance
    "BAJFINANCE.NS":{"name": "Bajaj Finance",      "exchange": "NSE", "sector": "Finance"},
    "BAJAJFINSV.NS":{"name": "Bajaj Finserv",      "exchange": "NSE", "sector": "Finance"},
    "CHOLAFIN.NS": {"name": "Cholamandalam Fin",   "exchange": "NSE", "sector": "Finance"},
    "MUTHOOTFIN.NS":{"name": "Muthoot Finance",    "exchange": "NSE", "sector": "Finance"},
    "LICHSGFIN.NS":{"name": "LIC Housing Finance", "exchange": "NSE", "sector": "Finance"},
    "SHRIRAMFIN.NS":{"name": "Shriram Finance",    "exchange": "NSE", "sector": "Finance"},
    # Energy
    "RELIANCE.NS": {"name": "Reliance Industries", "exchange": "NSE", "sector": "Energy"},
    "ONGC.NS":     {"name": "ONGC",                "exchange": "NSE", "sector": "Energy"},
    "IOC.NS":      {"name": "Indian Oil Corp",     "exchange": "NSE", "sector": "Energy"},
    "BPCL.NS":     {"name": "BPCL",                "exchange": "NSE", "sector": "Energy"},
    "HINDPETRO.NS":{"name": "HPCL",                "exchange": "NSE", "sector": "Energy"},
    "GAIL.NS":     {"name": "GAIL India",          "exchange": "NSE", "sector": "Energy"},
    "POWERGRID.NS":{"name": "Power Grid Corp",     "exchange": "NSE", "sector": "Energy"},
    "NTPC.NS":     {"name": "NTPC",                "exchange": "NSE", "sector": "Energy"},
    "ADANIGREEN.NS":{"name": "Adani Green Energy", "exchange": "NSE", "sector": "Energy"},
    "TATAPOWER.NS":{"name": "Tata Power",          "exchange": "NSE", "sector": "Energy"},
    # Auto
    "MARUTI.NS":   {"name": "Maruti Suzuki",       "exchange": "NSE", "sector": "Auto"},
    "TATAMOTORS.NS":{"name": "Tata Motors",        "exchange": "NSE", "sector": "Auto"},
    # Pharma
    "SUNPHARMA.NS":{"name": "Sun Pharma",          "exchange": "NSE", "sector": "Pharma"},
    "DRREDDY.NS":  {"name": "Dr Reddy's Labs",     "exchange": "NSE", "sector": "Pharma"},
    "CIPLA.NS":    {"name": "Cipla",               "exchange": "NSE", "sector": "Pharma"},
    "DIVISLAB.NS": {"name": "Divi's Laboratories", "exchange": "NSE", "sector": "Pharma"},
    "BIOCON.NS":   {"name": "Biocon",              "exchange": "NSE", "sector": "Pharma"},
    "AUROPHARMA.NS":{"name": "Aurobindo Pharma",   "exchange": "NSE", "sector": "Pharma"},
    "LUPIN.NS":    {"name": "Lupin",               "exchange": "NSE", "sector": "Pharma"},
    "TORNTPHARM.NS":{"name": "Torrent Pharma",     "exchange": "NSE", "sector": "Pharma"},
    # FMCG
    "HINDUNILVR.NS":{"name": "HUL",                "exchange": "NSE", "sector": "FMCG"},
    "ITC.NS":      {"name": "ITC",                 "exchange": "NSE", "sector": "FMCG"},
    "NESTLEIND.NS":{"name": "Nestle India",        "exchange": "NSE", "sector": "FMCG"},
    "BRITANNIA.NS":{"name": "Britannia",           "exchange": "NSE", "sector": "FMCG"},
    "DABUR.NS":    {"name": "Dabur India",         "exchange": "NSE", "sector": "FMCG"},
    "MARICO.NS":   {"name": "Marico",              "exchange": "NSE", "sector": "FMCG"},
    "COLPAL.NS":   {"name": "Colgate-Palmolive",   "exchange": "NSE", "sector": "FMCG"},
    "GODREJCP.NS": {"name": "Godrej Consumer",     "exchange": "NSE", "sector": "FMCG"},
    "VBL.NS":      {"name": "Varun Beverages",     "exchange": "NSE", "sector": "FMCG"},
    # Metals
    "TATASTEEL.NS":{"name": "Tata Steel",          "exchange": "NSE", "sector": "Metals"},
    "JSWSTEEL.NS": {"name": "JSW Steel",           "exchange": "NSE", "sector": "Metals"},
    "HINDALCO.NS": {"name": "Hindalco Industries", "exchange": "NSE", "sector": "Metals"},
    "VEDL.NS":     {"name": "Vedanta",             "exchange": "NSE", "sector": "Metals"},
    "COALINDIA.NS":{"name": "Coal India",          "exchange": "NSE", "sector": "Metals"},
    "NMDC.NS":     {"name": "NMDC",                "exchange": "NSE", "sector": "Metals"},
    "SAIL.NS":     {"name": "SAIL",                "exchange": "NSE", "sector": "Metals"},
    "HINDZINC.NS": {"name": "Hindustan Zinc",      "exchange": "NSE", "sector": "Metals"},
    # Infra / Realty
    "LT.NS":       {"name": "Larsen & Toubro",     "exchange": "NSE", "sector": "Infra"},
    "ADANIENT.NS": {"name": "Adani Enterprises",   "exchange": "NSE", "sector": "Infra"},
    "ADANIPORTS.NS":{"name": "Adani Ports",        "exchange": "NSE", "sector": "Infra"},
    "DLF.NS":      {"name": "DLF",                 "exchange": "NSE", "sector": "Realty"},
    "GODREJPROP.NS":{"name": "Godrej Properties",  "exchange": "NSE", "sector": "Realty"},
    "PRESTIGE.NS": {"name": "Prestige Estates",    "exchange": "NSE", "sector": "Realty"},
    # Telecom
    "BHARTIARTL.NS":{"name": "Bharti Airtel",      "exchange": "NSE", "sector": "Telecom"},
    "IDEA.NS":     {"name": "Vodafone Idea",       "exchange": "NSE", "sector": "Telecom"},
    # Cement
    "ULTRACEMCO.NS":{"name": "UltraTech Cement",   "exchange": "NSE", "sector": "Cement"},
    "AMBUJACEM.NS":{"name": "Ambuja Cements",      "exchange": "NSE", "sector": "Cement"},
    "ACC.NS":      {"name": "ACC",                 "exchange": "NSE", "sector": "Cement"},
    "SHREECEM.NS": {"name": "Shree Cement",        "exchange": "NSE", "sector": "Cement"},
    # Insurance
    "SBILIFE.NS":  {"name": "SBI Life Insurance",  "exchange": "NSE", "sector": "Insurance"},
    "HDFCLIFE.NS": {"name": "HDFC Life",           "exchange": "NSE", "sector": "Insurance"},
    "LICI.NS":     {"name": "LIC of India",        "exchange": "NSE", "sector": "Insurance"},
    # Defence / Capital Goods
    "BEL.NS":      {"name": "Bharat Electronics",  "exchange": "NSE", "sector": "Defence"},
    "HAL.NS":      {"name": "HAL",                 "exchange": "NSE", "sector": "Defence"},
    "BHEL.NS":     {"name": "BHEL",                "exchange": "NSE", "sector": "Capital Goods"},
    "ABB.NS":      {"name": "ABB India",           "exchange": "NSE", "sector": "Capital Goods"},
    # Consumer Durables
    "HAVELLS.NS":  {"name": "Havells India",       "exchange": "NSE", "sector": "Consumer"},
    "TITAN.NS":    {"name": "Titan Company",       "exchange": "NSE", "sector": "Consumer"},
    "TRENT.NS":    {"name": "Trent",               "exchange": "NSE", "sector": "Consumer"},
    # BSE versions
    "RELIANCE.BO": {"name": "Reliance Industries", "exchange": "BSE", "sector": "Energy"},
    "TCS.BO":      {"name": "TCS",                 "exchange": "BSE", "sector": "IT"},
    "INFY.BO":     {"name": "Infosys",             "exchange": "BSE", "sector": "IT"},
    "HDFCBANK.BO": {"name": "HDFC Bank",           "exchange": "BSE", "sector": "Banking"},
    "ICICIBANK.BO":{"name": "ICICI Bank",          "exchange": "BSE", "sector": "Banking"},
    "SBIN.BO":     {"name": "SBI",                 "exchange": "BSE", "sector": "Banking"},
    "TATAMOTORS.BO":{"name": "Tata Motors",        "exchange": "BSE", "sector": "Auto"},
    "SUNPHARMA.BO":{"name": "Sun Pharma",          "exchange": "BSE", "sector": "Pharma"},
    "ITC.BO":      {"name": "ITC",                 "exchange": "BSE", "sector": "FMCG"},
    "LT.BO":       {"name": "Larsen & Toubro",     "exchange": "BSE", "sector": "Infra"},
    "WIPRO.BO":    {"name": "Wipro",               "exchange": "BSE", "sector": "IT"},
    "HINDUNILVR.BO":{"name": "HUL",               "exchange": "BSE", "sector": "FMCG"},
    "TATASTEEL.BO":{"name": "Tata Steel",          "exchange": "BSE", "sector": "Metals"},
    "BHARTIARTL.BO":{"name": "Bharti Airtel",      "exchange": "BSE", "sector": "Telecom"},
    "TITAN.BO":    {"name": "Titan Company",       "exchange": "BSE", "sector": "Consumer"},
    "AXISBANK.BO": {"name": "Axis Bank",           "exchange": "BSE", "sector": "Banking"},
    "BAJFINANCE.BO":{"name": "Bajaj Finance",      "exchange": "BSE", "sector": "Finance"},
    "ULTRACEMCO.BO":{"name": "UltraTech Cement",   "exchange": "BSE", "sector": "Cement"},
    "MARUTI.BO":   {"name": "Maruti Suzuki",       "exchange": "BSE", "sector": "Auto"},
}

ALL_META = {**INDEX_META, **POPULAR_STOCKS}


import concurrent.futures

def fetch_single_quote(sym: str) -> Dict:
    try:
        ticker = yf.Ticker(sym)
        
        try:
            # Try fast_info first for reliable real-time data
            info = ticker.fast_info
            price = float(info.last_price)
            prev_close = float(info.previous_close)
            open_price = float(info.open)
            high_price = float(info.day_high)
            low_price = float(info.day_low)
            volume = int(info.last_volume)
            is_stale = False # Assume live if fast_info succeeds
        except Exception:
            # Fallback to history if fast_info fails
            hist = ticker.history(period="5d", interval="1d", auto_adjust=True)
            if hist.empty:
                raise ValueError("No history data returned")
            price = float(hist["Close"].iloc[-1])
            prev_close = float(hist["Close"].iloc[-2]) if len(hist) >= 2 else price
            latest = hist.iloc[-1]
            open_price = float(latest.get("Open", price))
            high_price = float(latest.get("High", price))
            low_price = float(latest.get("Low", price))
            volume = int(latest.get("Volume", 0) or 0)
            last_date = hist.index[-1].date()
            today = datetime.now(IST).date()
            is_stale = last_date < today

        change = round(price - prev_close, 2)
        change_pct = round((change / prev_close) * 100, 2) if prev_close else 0

        meta = ALL_META.get(sym, {"name": sym, "exchange": "NSE", "sector": "Other"})
        return {
            "symbol": sym,
            "name": meta["name"],
            "exchange": meta["exchange"],
            "sector": meta.get("sector", "Other"),
            "price": round(price, 2),
            "change": change,
            "change_pct": change_pct,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "prev_close": round(prev_close, 2),
            "volume": volume,
            "is_stale": is_stale,
            "timestamp": datetime.now(IST).isoformat(),
        }
    except Exception as e:
        meta = ALL_META.get(sym, {"name": sym, "exchange": "NSE", "sector": "Other"})
        return {
            "symbol": sym,
            "name": meta["name"],
            "exchange": meta["exchange"],
            "sector": meta.get("sector", "Other"),
            "price": None,
            "is_stale": False,
            "error": str(e),
            "timestamp": datetime.now(IST).isoformat(),
        }


def get_quotes(symbols: List[str]) -> List[Dict]:
    if not symbols:
        return []
    
    results = []
    quote_map = {}
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(symbols), 15)) as executor:
        futures = {executor.submit(fetch_single_quote, sym): sym for sym in symbols}
        for future in concurrent.futures.as_completed(futures):
            res = future.result()
            quote_map[res["symbol"]] = res
            
    # Preserve original order
    for sym in symbols:
        if sym in quote_map:
            results.append(quote_map[sym])
            
    return results



def get_history(symbol: str, period: str = "1d", interval: str = "5m") -> List[Dict]:
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period, interval=interval)
        bars = []
        for ts, row in hist.iterrows():
            bars.append({
                "time": int(ts.timestamp()),
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": float(row["Volume"]),
            })
        return bars
    except Exception:
        return []


def search_stocks(query: str) -> List[Dict]:
    query_lower = query.lower()
    results = []
    seen_symbols = set()

    for sym, meta in ALL_META.items():
        if query_lower in sym.lower() or query_lower in meta["name"].lower():
            results.append({
                "symbol": sym,
                "name": meta["name"],
                "exchange": meta["exchange"],
                "sector": meta.get("sector", "Other"),
                "type": "INDEX" if sym.startswith("^") else "STOCK",
            })
            seen_symbols.add(sym)

    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={query}&quotesCount=15&newsCount=0"
        res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)
        if res.status_code == 200:
            data = res.json()
            for q in data.get("quotes", []):
                sym = q.get("symbol", "")
                if (sym.endswith(".NS") or sym.endswith(".BO") or sym.startswith("^")) and sym not in seen_symbols:
                    exch = "NSE" if sym.endswith(".NS") else ("BSE" if sym.endswith(".BO") else "INDEX")
                    local = ALL_META.get(sym, {})
                    results.append({
                        "symbol": sym,
                        "name": local.get("name") or q.get("shortname") or q.get("longname") or sym,
                        "exchange": exch,
                        "sector": local.get("sector", "Other"),
                        "type": "INDEX" if sym.startswith("^") else "STOCK",
                    })
                    seen_symbols.add(sym)
    except Exception as e:
        print(f"Search error: {e}")

    return results[:20]


def get_all_stocks() -> List[Dict]:
    return [
        {
            "symbol": sym,
            "name": meta["name"],
            "exchange": meta["exchange"],
            "sector": meta.get("sector", "Other"),
            "type": "STOCK",
        }
        for sym, meta in POPULAR_STOCKS.items()
    ]


def get_market_status() -> Dict:
    now = datetime.now(IST)
    weekday = now.weekday()
    hour, minute = now.hour, now.minute
    current_minutes = hour * 60 + minute

    if weekday >= 5:
        return {"status": "CLOSED", "message": "Market Closed (Weekend)", "color": "red"}
    if 9 * 60 <= current_minutes < 9 * 60 + 15:
        return {"status": "PRE_OPEN", "message": "Pre-Open Session", "color": "yellow"}
    if 9 * 60 + 15 <= current_minutes <= 15 * 60 + 30:
        return {"status": "OPEN", "message": "Market Open", "color": "green"}
    return {"status": "CLOSED", "message": "Market Closed", "color": "red"}
