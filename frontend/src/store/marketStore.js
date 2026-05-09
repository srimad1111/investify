import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Key index symbols to always fetch first for immediate display
const INDEX_SYMBOLS = ['^NSEI','^NSEBANK','^CNXIT','^NSMIDCP','^CNXAUTO','^CNXPHARMA','^CNXFMCG','^BSESN'];
const STOCK_SYMBOLS = [
  'RELIANCE.NS','TCS.NS','HDFCBANK.NS','INFY.NS','ICICIBANK.NS','SBIN.NS',
  'BHARTIARTL.NS','ITC.NS','KOTAKBANK.NS','HINDUNILVR.NS','BAJFINANCE.NS','MARUTI.NS',
  'SUNPHARMA.NS','AXISBANK.NS','WIPRO.NS','HCLTECH.NS','TATASTEEL.NS','NTPC.NS',
  'LT.NS','TITAN.NS','DRREDDY.NS','CIPLA.NS','ULTRACEMCO.NS','ADANIENT.NS',
  'POWERGRID.NS','JSWSTEEL.NS','COALINDIA.NS','HAL.NS','BEL.NS'
];

export const useMarketStore = create((set, get) => ({
  quotes: {},
  marketStatus: { status: 'CLOSED', message: 'Market Closed' },
  activeSymbol: '^NSEI',
  
  setActiveSymbol: (symbol) => set({ activeSymbol: symbol }),
  
  updateQuotes: (newQuotes) => {
    set((state) => {
      const updated = { ...state.quotes };
      newQuotes.forEach(q => {
        if (q.price !== null && q.price !== undefined) {
          updated[q.symbol] = q;
        }
      });
      return { quotes: updated };
    });
  },

  // REST polling fallback — fetch indices first for instant display, then stocks
  fetchAllQuotes: async () => {
    const { updateQuotes } = get();
    try {
      // Fetch indices immediately
      const idxRes = await axios.get(`${API_URL}/market/quotes?symbols=${INDEX_SYMBOLS.join(',')}`, { timeout: 10000 });
      updateQuotes(idxRes.data);
    } catch (e) {
      console.warn('Index fetch failed', e);
    }
    try {
      // Then fetch stocks in 2 batches
      const half = Math.ceil(STOCK_SYMBOLS.length / 2);
      const [batch1, batch2] = [STOCK_SYMBOLS.slice(0, half), STOCK_SYMBOLS.slice(half)];
      const r1 = await axios.get(`${API_URL}/market/quotes?symbols=${batch1.join(',')}`, { timeout: 15000 });
      updateQuotes(r1.data);
      const r2 = await axios.get(`${API_URL}/market/quotes?symbols=${batch2.join(',')}`, { timeout: 15000 });
      updateQuotes(r2.data);
    } catch (e) {
      console.warn('Stock fetch failed', e);
    }
  },

  fetchMarketStatus: async () => {
    try {
      const res = await axios.get(`${API_URL}/market/status`);
      set({ marketStatus: res.data });
    } catch (error) {
      console.error('Error fetching market status', error);
    }
  },

  searchStocks: async (query) => {
    try {
      const res = await axios.get(`${API_URL}/market/search?q=${query}`);
      return res.data;
    } catch (error) {
      console.error('Error searching stocks', error);
      return [];
    }
  }
}));
