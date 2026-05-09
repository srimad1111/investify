import { useState } from 'react';
import { useMarketStore } from '../../store/marketStore';
import { useTradeStore } from '../../store/tradeStore';
import { INDICES } from '../../constants/indices';

export function PaperTradePanel({ symbol }) {
  const quotes = useMarketStore(state => state.quotes);
  const placeOrder = useTradeStore(state => state.placeOrder);
  
  const [side, setSide] = useState('BUY');
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  
  const currentPrice = quotes[symbol]?.price || 0;
  const isIndex = symbol?.startsWith('^') || INDICES.some(idx => idx.symbol === symbol);

  const handlePlaceOrder = async () => {
    if (isIndex || !symbol) return;
    await placeOrder({
      symbol: symbol,
      exchange: 'NSE',
      side,
      order_type: orderType,
      product: 'CNC',
      quantity: Number(quantity),
      price: orderType === 'LIMIT' ? Number(price) : null,
      trigger_price: null
    });
    setQuantity(1);
    setPrice('');
  };

  if (!symbol) return null;

  if (isIndex) {
    return (
      <div className="fintech-card p-4 flex flex-col items-center justify-center text-center h-full min-h-[250px]">
        <div className="w-12 h-12 rounded-full bg-fintech-border flex items-center justify-center mb-3">
          <span className="text-xl">📊</span>
        </div>
        <h3 className="text-white font-medium mb-2">{symbol} is an Index</h3>
        <p className="text-sm text-fintech-text max-w-[250px]">
          Indices cannot be traded directly. Please select a stock from the browser to place a paper trade.
        </p>
      </div>
    );
  }

  return (
    <div className="fintech-card p-4 h-full">
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => setSide('BUY')}
          className={`flex-1 py-2 rounded font-bold ${side === 'BUY' ? 'bg-fintech-green text-white' : 'bg-[#1A202C] text-fintech-text'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setSide('SELL')}
          className={`flex-1 py-2 rounded font-bold ${side === 'SELL' ? 'bg-fintech-red text-white' : 'bg-[#1A202C] text-fintech-text'}`}
        >
          SELL
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        {['MARKET', 'LIMIT'].map(type => (
          <button
            key={type}
            onClick={() => setOrderType(type)}
            className={`px-3 py-1 text-sm rounded ${orderType === type ? 'bg-fintech-border text-white' : 'text-fintech-text hover:text-white'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-fintech-text mb-1">Quantity</label>
          <input 
            type="number" 
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="fintech-input" 
          />
        </div>
        
        {orderType === 'LIMIT' && (
          <div>
            <label className="block text-sm text-fintech-text mb-1">Price</label>
            <input 
              type="number" 
              step="0.05"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              className="fintech-input" 
            />
          </div>
        )}
        
        <div className="pt-2 border-t border-fintech-border flex justify-between items-center text-sm">
          <span className="text-fintech-text">Margin Required</span>
          <span className="font-medium text-white">
            ₹{((orderType === 'LIMIT' && price ? price : currentPrice) * quantity).toFixed(2)}
          </span>
        </div>

        <button 
          onClick={handlePlaceOrder}
          className={`w-full py-3 rounded font-bold transition-transform active:scale-95 ${side === 'BUY' ? 'bg-fintech-green' : 'bg-fintech-red'}`}
        >
          {side} {symbol}
        </button>
        
        <p className="text-xs text-center text-fintech-text mt-2">
          Paper Trading Simulation Mode
        </p>
      </div>
    </div>
  );
}
