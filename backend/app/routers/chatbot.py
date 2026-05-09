from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import requests
from app.services.market_service import get_quotes, ALL_META

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    symbol: Optional[str] = None

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def find_answer(message: str, symbol: Optional[str] = None) -> dict:
    if not GROQ_API_KEY:
        return {
            "answer": "Groq API key not configured. Chatbot is currently unavailable.",
            "type": "error"
        }
        
    system_prompt = (
        "You are Investify AI, a helpful and knowledgeable Indian stock market assistant. "
        "You help users understand market concepts, technical indicators (RSI, MACD, etc.), "
        "and provide general information about NSE/BSE stocks. "
        "Do NOT provide direct financial advice or recommendations to buy/sell. "
        "Keep your answers concise, well-formatted using Markdown, and friendly."
    )
    
    # Try to identify symbol from message if not explicitly provided
    matched_symbol = symbol
    if not matched_symbol:
        msg_lower = message.lower()
        for sym, meta in ALL_META.items():
            sym_short = sym.replace(".NS", "").replace(".BO", "").lower()
            if sym_short in msg_lower or meta["name"].lower() in msg_lower:
                matched_symbol = sym
                break

    # Provide context to the LLM if a symbol is matched
    context = ""
    if matched_symbol:
        try:
            quotes = get_quotes([matched_symbol])
            if quotes and quotes[0].get("price"):
                q = quotes[0]
                context = f"\n\nContext: The user is asking about {q['name']} ({q['symbol']}). The current price is ₹{q['price']}, Change: {q.get('change_pct', 0)}%, High: ₹{q['high']}, Low: ₹{q['low']}."
        except Exception:
            pass

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama3-8b-8192",
                "messages": [
                    {"role": "system", "content": system_prompt + context},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.5,
                "max_tokens": 500
            },
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        answer = data["choices"][0]["message"]["content"]
        return {"answer": answer, "type": "ai_response"}
    except Exception as e:
        print(f"Groq API Error: {e}")
        return {
            "answer": "I'm sorry, I'm having trouble connecting to my AI brain right now. Please try again later.",
            "type": "error"
        }


@router.post("/ask")
def ask_chatbot(req: ChatRequest):
    if not req.message or len(req.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    result = find_answer(req.message, req.symbol)
    return result
