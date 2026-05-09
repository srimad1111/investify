import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMarketStore } from '../../store/marketStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function SentimentScanner() {
  const activeSymbol = useMarketStore(state => state.activeSymbol);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSentiment() {
      if (!activeSymbol) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/sentiment/scan?symbol=${activeSymbol}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching sentiment", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSentiment();
  }, [activeSymbol]);

  if (loading) {
    return <div className="fintech-card p-4 animate-pulse h-48"></div>;
  }

  if (!data) return null;

  return (
    <div className="fintech-card p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center justify-between">
        AI Sentiment Scanner
        <span className={`text-xs px-2 py-1 rounded font-bold ${
          data.signal === 'BULLISH' ? 'bg-fintech-green/20 text-fintech-green' : 
          data.signal === 'BEARISH' ? 'bg-fintech-red/20 text-fintech-red' : 
          'bg-gray-600/50 text-gray-300'
        }`}>
          {data.signal} ({data.confidence}%)
        </span>
      </h3>
      
      <div className="flex justify-between text-sm mb-4 bg-[#1A202C] p-2 rounded">
        <span className="text-fintech-green flex flex-col items-center">
          <span className="text-xs text-fintech-text">Bullish Hits</span>
          <span className="font-bold">{data.bullish_hits}</span>
        </span>
        <span className="text-fintech-red flex flex-col items-center">
          <span className="text-xs text-fintech-text">Bearish Hits</span>
          <span className="font-bold">{data.bearish_hits}</span>
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-fintech-text">Latest News</h4>
        {data.headlines.map((item, i) => (
          <a 
            key={i} 
            href={item.link} 
            target="_blank" 
            rel="noreferrer"
            className="block text-sm hover:bg-[#1A202C] p-2 rounded transition-colors"
          >
            <p className="line-clamp-2">{item.title}</p>
            <div className="flex justify-between items-center mt-1 text-xs text-fintech-text">
              <span>{item.source}</span>
              <span className={item.sentiment === 'bullish' ? 'text-fintech-green' : item.sentiment === 'bearish' ? 'text-fintech-red' : ''}>
                {item.sentiment.toUpperCase()}
              </span>
            </div>
          </a>
        ))}
        {data.headlines.length === 0 && <p className="text-sm text-fintech-text">No recent news found.</p>}
      </div>
    </div>
  );
}
