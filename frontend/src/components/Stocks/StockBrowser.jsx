import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMarketStore } from '../../store/marketStore';
import { useAuthStore } from '../../store/authStore';
import { StockLogo } from '../ui/StockLogo';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Fallback stock list if backend is slow/unavailable
const FALLBACK_STOCKS = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries", exchange: "NSE", sector: "Energy" },
  { symbol: "TCS.NS", name: "TCS", exchange: "NSE", sector: "IT" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank", exchange: "NSE", sector: "Banking" },
  { symbol: "INFY.NS", name: "Infosys", exchange: "NSE", sector: "IT" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank", exchange: "NSE", sector: "Banking" },
  { symbol: "SBIN.NS", name: "SBI", exchange: "NSE", sector: "Banking" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel", exchange: "NSE", sector: "Telecom" },
  { symbol: "ITC.NS", name: "ITC", exchange: "NSE", sector: "FMCG" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", exchange: "NSE", sector: "Banking" },
  { symbol: "HINDUNILVR.NS", name: "HUL", exchange: "NSE", sector: "FMCG" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance", exchange: "NSE", sector: "Finance" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki", exchange: "NSE", sector: "Auto" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors", exchange: "NSE", sector: "Auto" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma", exchange: "NSE", sector: "Pharma" },
  { symbol: "AXISBANK.NS", name: "Axis Bank", exchange: "NSE", sector: "Banking" },
  { symbol: "WIPRO.NS", name: "Wipro", exchange: "NSE", sector: "IT" },
  { symbol: "HCLTECH.NS", name: "HCL Technologies", exchange: "NSE", sector: "IT" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel", exchange: "NSE", sector: "Metals" },
  { symbol: "NTPC.NS", name: "NTPC", exchange: "NSE", sector: "Energy" },
  { symbol: "LT.NS", name: "Larsen & Toubro", exchange: "NSE", sector: "Infra" },
  { symbol: "TITAN.NS", name: "Titan Company", exchange: "NSE", sector: "Consumer" },
  { symbol: "DRREDDY.NS", name: "Dr Reddy's Labs", exchange: "NSE", sector: "Pharma" },
  { symbol: "CIPLA.NS", name: "Cipla", exchange: "NSE", sector: "Pharma" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement", exchange: "NSE", sector: "Cement" },
  { symbol: "ADANIENT.NS", name: "Adani Enterprises", exchange: "NSE", sector: "Infra" },
  { symbol: "POWERGRID.NS", name: "Power Grid Corp", exchange: "NSE", sector: "Energy" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel", exchange: "NSE", sector: "Metals" },
  { symbol: "COALINDIA.NS", name: "Coal India", exchange: "NSE", sector: "Metals" },
  { symbol: "HAL.NS", name: "HAL", exchange: "NSE", sector: "Defence" },
  { symbol: "BEL.NS", name: "Bharat Electronics", exchange: "NSE", sector: "Defence" },
];

export function StockBrowser() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [showAll, setShowAll] = useState(false);
  
  const quotes = useMarketStore(state => state.quotes);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleTrade = (e, symbol) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/stock/${symbol}`);
    }
  };

  useEffect(() => {
    async function fetchStocks() {
      try {
        const res = await axios.get(`${API_URL}/market/stocks`, { timeout: 5000 });
        setStocks(res.data);
      } catch (err) {
        console.warn("API slow/unavailable, using fallback stock list");
        setStocks(FALLBACK_STOCKS);
      } finally {
        setLoading(false);
      }
    }
    fetchStocks();
  }, []);

  const sectors = ['All', ...new Set(stocks.map(s => s.sector).filter(Boolean))].sort();

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  if (loading) {
    return (
      <div className="bg-surface-container-low border border-surface-variant p-8 rounded-xl flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-outline text-sm">Loading markets...</span>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-low border border-surface-variant rounded-xl flex flex-col h-full min-h-[500px] overflow-hidden">
      <div className="p-4 border-b border-surface-variant space-y-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            type="text" 
            placeholder="Search by name or symbol..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high border border-outline-variant py-3 pl-12 pr-4 rounded-xl text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md"
          />
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
          {sectors.map(sector => (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`whitespace-nowrap px-4 py-1.5 text-xs font-label-caps uppercase tracking-wider rounded-full transition-colors border ${
                selectedSector === sector 
                  ? 'bg-primary-container text-white border-primary-container' 
                  : 'bg-surface-container-high text-outline border-surface-variant hover:text-white'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
        {filteredStocks.length === 0 ? (
          <p className="text-center text-outline text-sm py-8 col-span-full">No stocks found.</p>
        ) : (
          (showAll ? filteredStocks : filteredStocks.slice(0, 12)).map((stock) => {
            const quote = quotes[stock.symbol];
            const isPositive = quote?.change >= 0;
            
            return (
              <div 
                key={stock.symbol}
                onClick={() => navigate(`/stock/${stock.symbol}`)}
                className="p-2 rounded-lg cursor-pointer transition-all border bg-surface-container-high border-surface-variant hover:border-primary/50 hover:bg-surface-container-highest group h-fit"
              >
                <div className="flex justify-between items-start mb-0.5">
                  <div className="flex items-center gap-2">
                    <StockLogo symbol={stock.symbol} className="w-8 h-8 rounded-full" />
                    <div>
                      <h3 className="font-headline-md text-sm font-bold group-hover:text-primary transition-colors">{stock.symbol.split('.')[0]}</h3>
                      <p className="text-[10px] text-outline truncate max-w-[120px]">{stock.name}</p>
                    </div>
                  </div>
                  {quote?.price ? (
                    <div className="text-right">
                      <p className={`font-data-mono text-sm font-bold ${isPositive ? 'text-green-400' : 'text-error'}`}>
                        ₹{quote.price?.toFixed(2)}
                      </p>
                      <p className={`text-[10px] font-data-mono ${isPositive ? 'text-green-400' : 'text-error'}`}>
                        {isPositive ? '+' : ''}{quote.change_pct}%
                      </p>
                    </div>
                  ) : (
                    <div className="text-right">
                      <div className="h-4 w-16 bg-surface-variant animate-pulse rounded mb-1"></div>
                      <div className="h-3 w-12 bg-surface-variant animate-pulse rounded ml-auto"></div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-1.5">
                  <span className="text-[9px] font-label-caps tracking-wider uppercase bg-surface-container-lowest px-1.5 py-0.5 rounded border border-surface-variant text-outline">
                    {stock.sector}
                  </span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleTrade(e, stock.symbol)}
                      className="text-[9px] font-bold tracking-widest bg-primary-container/10 text-primary px-2 py-0.5 rounded hover:bg-primary-container hover:text-white transition-colors uppercase"
                    >
                      {user ? 'Trade' : 'Login to Trade'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Show More / Less Button */}
      {filteredStocks.length > 12 && (
        <div className="p-4 border-t border-surface-variant">
          <button 
            onClick={() => setShowAll(prev => !prev)}
            className="w-full py-2.5 text-sm font-medium text-primary hover:text-white bg-primary/5 hover:bg-primary-container border border-primary/20 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">{showAll ? 'expand_less' : 'expand_more'}</span>
            {showAll ? 'Show Less' : `Show More (${filteredStocks.length - 12} more)`}
          </button>
        </div>
      )}
    </div>
  );
}
