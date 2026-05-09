from fastapi import APIRouter, HTTPException, Query
from app.models import OrderRequest
from app.services import paper_trade_service as pts
from app.services.market_service import get_quotes

router = APIRouter()


@router.post("/place")
def place_order(order: OrderRequest):
    # Get current price for market orders
    current_price = None
    try:
        quotes = get_quotes([order.symbol])
        if quotes and quotes[0].get("price"):
            current_price = quotes[0]["price"]
    except Exception:
        pass

    try:
        result = pts.place_order(
            uid=order.uid,
            symbol=order.symbol,
            exchange=order.exchange,
            side=order.side,
            order_type=order.order_type,
            product=order.product,
            quantity=order.quantity,
            price=order.price,
            trigger_price=order.trigger_price,
            current_price=current_price,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/book")
def order_book(uid: str = Query(...)):
    return pts.get_order_book(uid)


@router.delete("/{order_id}")
def cancel_order(order_id: str, uid: str = Query(...)):
    result = pts.cancel_order(uid, order_id)
    if not result:
        raise HTTPException(status_code=404, detail="Order not found or already executed")
    return result


@router.get("/portfolio")
def portfolio(uid: str = Query(...)):
    return pts.get_portfolio(uid)
