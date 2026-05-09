import uuid
from datetime import datetime
from typing import Dict, List, Optional
import pytz

IST = pytz.timezone("Asia/Kolkata")

# In-memory paper trade store: {uid -> [orders]}
_orders: Dict[str, List[Dict]] = {}

# Virtual portfolio: {uid -> {symbol -> {qty, avg_price}}}
_portfolio: Dict[str, Dict[str, Dict]] = {}

# User balances: {uid -> cash_balance}
_balances: Dict[str, float] = {}

INITIAL_BALANCE = 1000000.0

def _get_uid_orders(uid: str) -> List[Dict]:
    return _orders.setdefault(uid, [])

def _get_balance(uid: str) -> float:
    if uid not in _balances:
        _balances[uid] = INITIAL_BALANCE
    return _balances[uid]

def place_order(
    uid: str,
    symbol: str,
    exchange: str,
    side: str,
    order_type: str,
    product: str,
    quantity: int,
    price: Optional[float],
    trigger_price: Optional[float],
    current_price: Optional[float] = None,
) -> Dict:
    now = datetime.now(IST).isoformat()
    order_id = str(uuid.uuid4())[:8].upper()
    
    balance = _get_balance(uid)
    port = _portfolio.get(uid, {})
    pos = port.get(symbol, {"qty": 0, "avg_price": 0.0})

    # Validate for MARKET orders
    exec_price = current_price if order_type == "MARKET" else price
    if not exec_price:
        raise ValueError("Price not available for order")

    total_cost = exec_price * quantity
    
    if side == "BUY":
        if balance < total_cost:
            raise ValueError(f"Insufficient funds. Required: ₹{total_cost}, Available: ₹{balance}")
    elif side == "SELL":
        if pos["qty"] < quantity:
            raise ValueError(f"Insufficient holdings. Required: {quantity}, Available: {pos['qty']}")

    # For paper trading, we assume instant execution for both Market and Limit
    # in this simplified simulation.
    filled_price = exec_price
    status = "EXECUTED"
    _update_portfolio(uid, symbol, side, quantity, filled_price)

    order = {
        "id": order_id,
        "uid": uid,
        "symbol": symbol,
        "exchange": exchange,
        "side": side,
        "order_type": order_type,
        "product": product,
        "quantity": quantity,
        "price": price,
        "trigger_price": trigger_price,
        "filled_price": filled_price,
        "status": status,
        "pnl": None,
        "created_at": now,
    }

    _get_uid_orders(uid).append(order)
    return order


def _update_portfolio(uid: str, symbol: str, side: str, qty: int, price: float):
    port = _portfolio.setdefault(uid, {})
    pos = port.setdefault(symbol, {"qty": 0, "avg_price": 0.0})
    
    current_balance = _get_balance(uid)

    if side == "BUY":
        total_cost = pos["avg_price"] * pos["qty"] + price * qty
        pos["qty"] += qty
        pos["avg_price"] = round(total_cost / pos["qty"], 2) if pos["qty"] else 0
        _balances[uid] = round(current_balance - (price * qty), 2)
    elif side == "SELL":
        # Calculate PnL for this specific sell
        realized_pnl = (price - pos["avg_price"]) * qty
        pos["qty"] = max(0, pos["qty"] - qty)
        if pos["qty"] == 0:
            pos["avg_price"] = 0.0
        _balances[uid] = round(current_balance + (price * qty), 2)


def get_order_book(uid: str) -> List[Dict]:
    return list(reversed(_get_uid_orders(uid)))


def cancel_order(uid: str, order_id: str) -> Optional[Dict]:
    orders = _get_uid_orders(uid)
    for order in orders:
        if order["id"] == order_id and order["status"] == "OPEN":
            order["status"] = "CANCELLED"
            return order
    return None


def get_portfolio(uid: str, current_prices: Dict[str, float] = None) -> Dict:
    port = _portfolio.get(uid, {})
    positions = []
    total_invested_val = 0
    total_current_val = 0
    
    cash_balance = _get_balance(uid)

    for symbol, pos in port.items():
        if pos["qty"] == 0:
            continue
        invested = pos["avg_price"] * pos["qty"]
        curr_price = (current_prices or {}).get(symbol, pos["avg_price"])
        current_val = curr_price * pos["qty"]
        pnl = round(current_val - invested, 2)
        pnl_pct = round((pnl / invested) * 100, 2) if invested else 0
        
        total_invested_val += invested
        total_current_val += current_val
        
        positions.append({
            "symbol": symbol,
            "qty": pos["qty"],
            "avg_price": pos["avg_price"],
            "current_price": round(curr_price, 2),
            "invested": round(invested, 2),
            "current_value": round(current_val, 2),
            "pnl": pnl,
            "pnl_pct": pnl_pct,
        })

    # Total Virtual Wealth = Cash Balance + Current Value of Positions
    total_virtual_wealth = round(cash_balance + total_current_val, 2)
    total_pnl = round(total_virtual_wealth - INITIAL_BALANCE, 2)
    total_pnl_pct = round((total_pnl / INITIAL_BALANCE) * 100, 2)

    return {
        "positions": positions,
        "total_invested": round(total_invested_val, 2),
        "total_current_value": round(total_current_val, 2),
        "total_pnl": total_pnl,
        "total_pnl_pct": total_pnl_pct,
        "available_margin": cash_balance,
        "total_virtual_wealth": total_virtual_wealth,
        "initial_balance": INITIAL_BALANCE,
    }
