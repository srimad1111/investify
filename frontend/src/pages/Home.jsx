import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMarketStore } from '../store/marketStore';
import { useTradeStore } from '../store/tradeStore';
import { useAuthStore } from '../store/authStore';
import { IndexTicker } from '../components/Dashboard/IndexTicker';
import { StockBrowser } from '../components/Stocks/StockBrowser';
import { StockLogo } from '../components/ui/StockLogo';

export function Home() {
  useWebSocket();
  const fetchMarketStatus = useMarketStore(state => state.fetchMarketStatus);
  const marketStatus = useMarketStore(state => state.marketStatus);
  const fetchAllQuotes = useMarketStore(state => state.fetchAllQuotes);
  const fetchPortfolio = useTradeStore(state => state.fetchPortfolio);
  const fetchOrders = useTradeStore(state => state.fetchOrders);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchMarketStatus();
    fetchAllQuotes(); // Load prices immediately via REST as fallback
    if (user) {
      fetchPortfolio();
      fetchOrders();
    }
    // Poll every 30s as backup if WebSocket misses updates
    const interval = setInterval(fetchAllQuotes, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <main className="pt-0">
      <IndexTicker />
      
      {/* Hero Section */}
      <section className="relative px-8 pt-6 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/10 via-background to-background -z-10"></div>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] mb-3 font-label-caps uppercase tracking-widest ${marketStatus.status === 'OPEN' ? 'bg-green-500/10 text-green-500' : 'bg-error/10 text-error'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${marketStatus.status === 'OPEN' ? 'bg-green-500 animate-pulse' : 'bg-error'}`}></span>
            MARKET {marketStatus.status === 'OPEN' ? 'OPENED' : 'CLOSED'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 max-w-2xl leading-tight">Empowering Your Investment Journey</h1>
          <p className="text-on-surface-variant text-sm md:text-base max-w-xl mb-6">
            Access professional-grade tools, real-time data streaming, and advanced analytics to trade with institutional precision.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xl">
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search symbols (e.g. RELIANCE, TCS, INFY)" 
                className="w-full bg-surface-container border border-surface-variant py-3 pl-10 pr-4 rounded-lg text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
            <button className="w-full sm:w-auto bg-primary hover:brightness-110 text-white font-bold py-3 px-6 rounded-lg transition-all active:scale-[0.98] whitespace-nowrap text-sm">
              Start Trading
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="max-w-7xl mx-auto px-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Market Explorer (Full 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-lg text-headline-lg">Market Explorer</h2>
          </div>
          <StockBrowser />
        </div>

        {/* Right Column - Wallet, Portfolio & News */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {user ? (
            <>
              <VirtualWallet />
              <div className="bg-surface-container-high border border-surface-variant rounded-xl p-6">
                <h3 className="font-headline-md text-headline-md mb-4">Portfolio Summary</h3>
                <PortfolioSummary />
              </div>
            </>
          ) : (
            <div className="bg-gradient-to-br from-primary-container/20 to-surface-container-low border border-primary/20 rounded-xl p-6 flex flex-col items-center text-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">account_balance_wallet</span>
              <div>
                <h3 className="font-headline-md text-headline-md text-white mb-2">Track Your Portfolio</h3>
                <p className="text-outline text-sm">Sign in to access your virtual wallet, portfolio, and paper trading features.</p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Link to="/login" className="w-full text-center bg-primary hover:brightness-110 text-white font-bold py-2.5 px-6 rounded-lg transition-all text-sm">Log In</Link>
                <Link to="/signup" className="w-full text-center bg-surface-container-high hover:bg-surface-container-highest border border-surface-variant text-on-surface font-medium py-2.5 px-6 rounded-lg transition-all text-sm">Create Account</Link>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full mt-2 text-left">
                <div className="bg-surface-container p-3 rounded-lg border border-surface-variant">
                  <span className="material-symbols-outlined text-primary text-lg">trending_up</span>
                  <p className="text-xs text-white font-bold mt-1">₹10,00,000</p>
                  <p className="text-[10px] text-outline">Virtual Capital</p>
                </div>
                <div className="bg-surface-container p-3 rounded-lg border border-surface-variant">
                  <span className="material-symbols-outlined text-green-400 text-lg">shield</span>
                  <p className="text-xs text-white font-bold mt-1">Risk Free</p>
                  <p className="text-[10px] text-outline">Paper Trading</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
            <h2 className="font-headline-lg text-headline-lg">Market News</h2>
            <button className="text-primary text-sm font-medium hover:underline">Full Feed</button>
          </div>
          <MarketNews />
        </div>
      </section>

      {/* CTA Signup Section */}
      <section className="max-w-7xl mx-auto px-8 mb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary-container p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <h2 className="font-headline-xl text-headline-xl text-white mb-6">Join 1M+ Global Traders Today</h2>
            <p className="text-on-primary-container text-body-lg opacity-90 mb-0">Experience the next generation of financial trading with Investify. Sign up now and get access to premium market insights for free for 30 days.</p>
          </div>
          
          <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-label-caps text-white/80 uppercase">Email Address</label>
                <input className="w-full bg-white text-slate-900 px-4 py-3 rounded-lg focus:ring-4 focus:ring-on-primary-fixed-variant outline-none" placeholder="name@company.com" type="email"/>
              </div>
              <button className="w-full bg-slate-950 text-white font-bold py-4 rounded-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2" type="button">
                Get Started Free
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <p className="text-[11px] text-white/60 text-center">No credit card required. Cancel anytime.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border-l border-primary-container bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">bolt</span>
            <h4 className="font-headline-md text-headline-md mb-2">Ultra-Low Latency</h4>
            <p className="text-outline text-sm leading-relaxed">Our infrastructure is optimized for speed, ensuring your orders are executed in milliseconds at the best possible market prices.</p>
          </div>
          <div className="p-8 border-l border-primary-container bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">analytics</span>
            <h4 className="font-headline-md text-headline-md mb-2">Advanced Analytics</h4>
            <p className="text-outline text-sm leading-relaxed">Leverage over 100 technical indicators, custom screening tools, and historical backtesting to validate your strategies.</p>
          </div>
          <div className="p-8 border-l border-primary-container bg-surface-container-low">
            <span className="material-symbols-outlined text-primary text-3xl mb-4">security</span>
            <h4 className="font-headline-md text-headline-md mb-2">Institutional Security</h4>
            <p className="text-outline text-sm leading-relaxed">Assets are protected by multi-signature cold storage and bank-grade encryption protocols for maximum peace of mind.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function VirtualWallet() {
  const portfolio = useTradeStore(state => state.portfolio);
  
  return (
    <div className="bg-gradient-to-br from-primary-container/20 to-surface-container-low border border-primary/20 rounded-xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
      </div>
      <p className="text-xs font-label-caps text-outline uppercase tracking-wider mb-2">Available Margin</p>
      <p className="font-headline-xl text-headline-xl text-white mb-6">₹{portfolio.available_margin?.toLocaleString('en-IN') || '10,00,000'}</p>
      
      <div className="flex justify-between border-t border-surface-variant pt-4 mt-4">
        <div>
          <p className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">Total Wealth</p>
          <p className="font-data-mono text-data-mono text-on-surface">₹{portfolio.total_virtual_wealth?.toLocaleString('en-IN') || '10,00,000'}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">Initial</p>
          <p className="font-data-mono text-data-mono text-on-surface">₹10,00,000</p>
        </div>
      </div>
    </div>
  );
}

function PortfolioSummary() {
  const portfolio = useTradeStore(state => state.portfolio);
  
  if (!portfolio.positions || portfolio.positions.length === 0) {
    return <p className="text-outline text-sm">No active positions.</p>;
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 bg-surface-container-lowest border border-surface-variant p-4 rounded-lg">
        <div>
          <p className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">Total Invested</p>
          <p className="font-data-mono text-data-mono">₹{portfolio.total_invested}</p>
        </div>
        <div>
          <p className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">Current Value</p>
          <p className="font-data-mono text-data-mono">₹{portfolio.total_current_value}</p>
        </div>
        <div className="col-span-2 pt-3 border-t border-surface-variant mt-2">
          <p className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-1">Total P&L</p>
          <p className={`font-data-mono text-lg font-bold ${portfolio.total_pnl >= 0 ? 'text-green-400' : 'text-error'}`}>
            {portfolio.total_pnl >= 0 ? '+' : ''}₹{portfolio.total_pnl} ({portfolio.total_pnl_pct}%)
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-[10px] font-label-caps text-outline uppercase tracking-wider mb-3">Top Holdings</h4>
        {portfolio.positions.slice(0, 5).map((pos, i) => (
          <div key={i} className="flex justify-between items-center text-sm border-b border-surface-variant pb-3 last:border-0 hover:bg-surface-container-highest transition-colors rounded -mx-2 px-2 py-1">
            <div className="flex items-center gap-3">
              <StockLogo symbol={pos.symbol} className="w-8 h-8 rounded-full" />
              <div>
                <p className="font-bold text-on-surface">{pos.symbol}</p>
                <p className="text-xs text-outline">{pos.qty} Qty • Avg ₹{pos.avg_price}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-data-mono text-data-mono text-on-surface">₹{pos.current_price}</p>
              <p className={`text-xs font-data-mono ${pos.pnl >= 0 ? 'text-green-400' : 'text-error'}`}>
                {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketNews() {
  return (
    <div className="space-y-4">
      <article className="p-4 rounded-xl bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all group cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-label-caps text-[10px] text-primary-container px-2 py-0.5 rounded bg-primary-container/10 border border-primary-container/20 uppercase">Breaking</span>
          <span className="text-[11px] text-outline">Reuters • 12m ago</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-sm mb-3 group-hover:text-primary transition-colors">Fed Signals Potential Rate Cut by Late Summer as Inflation Cools</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1">
            <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] text-outline border border-outline-variant/30">MONETARY POLICY</span>
          </div>
          <span className="material-symbols-outlined text-sm text-outline">share</span>
        </div>
      </article>
      <article className="p-4 rounded-xl bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all group cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] text-outline">Bloomberg • 45m ago</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-sm mb-3 group-hover:text-primary transition-colors">Tech Giants Outperform Expectations in Q1 Earnings Rally</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1">
            <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] text-outline border border-outline-variant/30">EARNINGS</span>
            <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] text-outline border border-outline-variant/30">TECH</span>
          </div>
          <span className="material-symbols-outlined text-sm text-outline">share</span>
        </div>
      </article>
      <article className="p-4 rounded-xl bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all group cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] text-outline">CNBC • 2h ago</span>
        </div>
        <h3 className="font-headline-md text-headline-md text-sm mb-3 group-hover:text-primary transition-colors">Crude Oil Prices Stabilize Amid Easing Geopolitical Tensions in Middle East</h3>
        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-1">
            <span className="bg-surface-container-lowest px-2 py-0.5 rounded text-[10px] text-outline border border-outline-variant/30">COMMODITIES</span>
          </div>
          <span className="material-symbols-outlined text-sm text-outline">share</span>
        </div>
      </article>
    </div>
  );
}
