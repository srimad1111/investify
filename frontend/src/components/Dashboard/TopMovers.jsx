import { useMarketStore } from '../../store/marketStore';
import { useNavigate } from 'react-router-dom';

export function TopMovers() {
  const quotes = useMarketStore(state => state.quotes);
  const navigate = useNavigate();

  // Convert quotes object to array and sort by change_pct
  const quotesArray = Object.values(quotes).filter(q => q && typeof q.change_pct === 'number' && !q.symbol.startsWith('^'));
  const gainers = [...quotesArray].sort((a, b) => b.change_pct - a.change_pct).slice(0, 3);
  const losers = [...quotesArray].sort((a, b) => a.change_pct - b.change_pct).slice(0, 3);
  
  const allMovers = [...gainers, ...losers];

  const generateSparkline = (isPositive) => {
    return isPositive 
      ? "M0 35 L20 25 L40 28 L60 10 L80 15 L100 5" 
      : "M0 5 L25 10 L50 30 L75 25 L100 38";
  };

  return (
    <div className="bg-surface-container-low border border-surface-variant rounded-xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-surface-variant bg-surface-container">
            <th className="px-4 lg:px-6 py-4 font-label-caps text-label-caps text-outline">Symbol</th>
            <th className="px-4 lg:px-6 py-4 font-label-caps text-label-caps text-outline text-right">Price</th>
            <th className="px-4 lg:px-6 py-4 font-label-caps text-label-caps text-outline text-right">Change (%)</th>
            <th className="hidden lg:table-cell px-6 py-4 font-label-caps text-label-caps text-outline text-center">Trend (24H)</th>
            <th className="px-4 lg:px-6 py-4 font-label-caps text-label-caps text-outline text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-variant/50">
          {allMovers.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-outline">Loading market data...</td>
            </tr>
          ) : (
            allMovers.map(stock => {
              const isPositive = stock.change >= 0;
              return (
                <tr key={stock.symbol} className="hover:bg-surface-variant/30 transition-colors cursor-pointer" onClick={() => navigate(`/stock/${stock.symbol}`)}>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center font-bold text-on-surface text-xs border border-surface-variant">
                        {stock.symbol.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface">{stock.symbol.split('.')[0]}</p>
                        <p className="text-xs text-outline truncate max-w-[100px] lg:max-w-[150px]">{stock.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right font-data-mono text-data-mono text-on-surface">
                    ₹{stock.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <span className={`font-data-mono text-data-mono ${isPositive ? 'text-green-400' : 'text-error'}`}>
                      {isPositive ? '+' : ''}{stock.change_pct}%
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4">
                    <div className="w-20 h-8 mx-auto">
                      <svg className={`w-full h-full fill-none stroke-2 ${isPositive ? 'stroke-green-400' : 'stroke-error'}`} viewBox="0 0 100 40">
                        <path d={generateSparkline(isPositive)}></path>
                      </svg>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 text-right">
                    <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">
                      trending_up
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
