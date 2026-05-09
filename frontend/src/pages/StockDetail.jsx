import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useMarketStore } from '../store/marketStore';
import { ChartPanel } from '../components/Chart/ChartPanel';
import { PaperTradePanel } from '../components/Trading/PaperTradePanel';
import { SentimentScanner } from '../components/Sentiment/SentimentScanner';

export function StockDetail() {
  useWebSocket();
  const { symbol } = useParams();
  const fetchMarketStatus = useMarketStore(state => state.fetchMarketStatus);

  useEffect(() => {
    fetchMarketStatus();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
        
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 text-fintech-text">
          <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Markets
          </Link>
          <span>/</span>
          <span className="text-white font-medium">{symbol}</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left Column - Chart & Sentiment */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            <ChartPanel symbol={symbol} />
            <SentimentScanner />
          </div>
          
          {/* Right Column - Trading */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
            <div className="sticky top-4">
              <PaperTradePanel symbol={symbol} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
