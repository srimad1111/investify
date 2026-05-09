import { useEffect } from 'react';
import { useTradeStore } from '../store/tradeStore';

export function Portfolio() {
  const fetchPortfolio = useTradeStore(state => state.fetchPortfolio);
  const portfolio = useTradeStore(state => state.portfolio);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6 min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl font-bold">Your Portfolio</h1>
      
      {/* High-Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="fintech-card p-6">
          <p className="text-sm text-fintech-text mb-1">Total Invested</p>
          <p className="text-2xl font-bold">₹{portfolio.total_invested}</p>
        </div>
        <div className="fintech-card p-6">
          <p className="text-sm text-fintech-text mb-1">Current Value</p>
          <p className="text-2xl font-bold">₹{portfolio.total_current_value}</p>
        </div>
        <div className="fintech-card p-6">
          <p className="text-sm text-fintech-text mb-1">Total P&L</p>
          <p className={`text-2xl font-bold ${portfolio.total_pnl >= 0 ? 'text-fintech-green' : 'text-fintech-red'}`}>
            {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl} ({portfolio.total_pnl_pct}%)
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="fintech-card overflow-hidden">
        <div className="p-4 border-b border-fintech-border bg-[#1A202C]">
          <h2 className="font-semibold text-lg">Current Holdings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-fintech-border text-xs text-fintech-text uppercase tracking-wider">
                <th className="p-4">Symbol</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Avg Price</th>
                <th className="p-4">LTP</th>
                <th className="p-4">Current Value</th>
                <th className="p-4 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {(!portfolio.positions || portfolio.positions.length === 0) ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-fintech-text">
                    You don't have any active positions.
                  </td>
                </tr>
              ) : (
                portfolio.positions.map((pos, i) => (
                  <tr key={i} className="border-b border-fintech-border/50 hover:bg-[#1A202C] transition-colors">
                    <td className="p-4 font-medium">{pos.symbol}</td>
                    <td className="p-4">{pos.qty}</td>
                    <td className="p-4">₹{pos.avg_price}</td>
                    <td className="p-4">₹{pos.current_price}</td>
                    <td className="p-4">₹{(pos.qty * pos.current_price).toFixed(2)}</td>
                    <td className={`p-4 text-right font-medium ${pos.pnl >= 0 ? 'text-fintech-green' : 'text-fintech-red'}`}>
                      {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl} <br/>
                      <span className="text-xs">({pos.pnl_pct}%)</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
