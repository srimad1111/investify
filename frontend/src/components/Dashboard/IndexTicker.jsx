import { INDICES } from '../../constants/indices';
import { useMarketStore } from '../../store/marketStore';

export function IndexTicker() {
  const quotes = useMarketStore(state => state.quotes);
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const setActiveSymbol = useMarketStore(state => state.setActiveSymbol);

  // Helper to generate a random sparkline path for visual effect (since we don't have historical arrays here)
  // In a real app, you'd pass actual history points
  const generateSparkline = (isPositive) => {
    return isPositive 
      ? "M0 35 L20 30 L40 32 L60 15 L80 18 L100 5" 
      : "M0 10 L20 15 L40 12 L60 25 L80 22 L100 35";
  };

  return (
    <section className="bg-surface-container-lowest border-y border-surface-variant py-2">
      <div className="max-w-container-max mx-auto px-8 flex gap-3 overflow-x-auto no-scrollbar">
        {INDICES.map((idx) => {
          const quote = quotes[idx.symbol];
          const isPositive = quote?.change >= 0;
          const isActive = activeSymbol === idx.symbol;
          
          return (
            <div 
              key={idx.symbol}
              onClick={() => setActiveSymbol(idx.symbol)}
              className={`flex-shrink-0 flex items-center gap-2 border px-2 py-1.5 rounded-lg min-w-[140px] cursor-pointer transition-all ${
                isActive 
                  ? 'bg-surface-container-high border-primary/50 shadow-[0_0_15px_rgba(0,82,255,0.15)]' 
                  : 'bg-surface-container-low border-surface-variant hover:bg-surface-container'
              }`}
            >
              <div>
                <p className="text-[9px] font-label-caps text-outline uppercase tracking-wider">{idx.name}</p>
                {quote ? (
                  <p className="text-xs font-bold">{quote.price?.toFixed(2)}</p>
                ) : (
                  <div className="h-3 w-16 bg-surface-variant animate-pulse rounded mt-1"></div>
                )}
              </div>
              
              {quote && (
                <div className="ml-auto text-right">
                  <span className={`flex items-center justify-end font-data-mono text-[10px] ${isPositive ? 'text-green-400' : 'text-error'}`}>
                    <span className="material-symbols-outlined text-[10px]">
                      {isPositive ? 'trending_up' : 'trending_down'}
                    </span>
                    {isPositive ? '+' : ''}{quote.change_pct?.toFixed(2)}%
                  </span>
                  <div className="w-10 h-5 mt-1 ml-auto">
                    <svg className={`w-full h-full fill-none stroke-2 ${isPositive ? 'stroke-green-400' : 'stroke-error'}`} viewBox="0 0 100 40">
                      <path d={generateSparkline(isPositive)}></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
