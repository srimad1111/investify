import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export function SEBIDisclosure() {
  const { sebiAcknowledged, setSebiAcknowledged } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(false);

  if (sebiAcknowledged) return null;

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) setScrolled(true);
  };

  const handleAccept = () => {
    if (scrolled && checked) {
      setSebiAcknowledged(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-fintech-card border border-fintech-border max-w-2xl w-full rounded-lg shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-fintech-border bg-[#1A202C] rounded-t-lg">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-yellow-500">⚠️</span> Risk Disclosures on Derivatives
          </h2>
        </div>
        
        <div 
          className="p-6 overflow-y-auto space-y-4 text-sm text-fintech-text"
          onScroll={handleScroll}
        >
          <p className="font-bold text-white mb-2">As per SEBI guidelines, please acknowledge the following risks:</p>
          <ol className="list-decimal pl-5 space-y-3">
            <li>9 out of 10 individual traders in equity Futures and Options Segment, incurred net losses.</li>
            <li>On an average, loss makers registered net trading loss close to ₹ 50,000.</li>
            <li>Over and above the net trading losses incurred, loss makers expended an additional 28% of net trading losses as transaction costs.</li>
            <li>Those making net trading profits, incurred between 15% to 50% of such profits as transaction cost.</li>
            <li>Trading in derivatives is subject to market risks. Past performance is not indicative of future returns.</li>
            <li>Leverage can magnify both your profits and your losses.</li>
            <li>This is a Paper Trading Simulation. No real money is involved, but the same market risks apply in real trading.</li>
          </ol>
          <div className="h-10"></div> {/* Spacer to ensure scroll triggers */}
        </div>

        <div className="p-4 border-t border-fintech-border bg-[#1A202C] rounded-b-lg">
          <label className="flex items-center gap-3 mb-4 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded border-fintech-border bg-fintech-dark text-fintech-primary focus:ring-fintech-primary"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              disabled={!scrolled}
            />
            <span className={!scrolled ? 'text-gray-500' : 'text-white'}>
              I have read and understood the risk disclosures.
            </span>
          </label>
          
          <button 
            onClick={handleAccept}
            disabled={!scrolled || !checked}
            className={`w-full py-3 rounded font-bold transition-colors ${
              scrolled && checked 
                ? 'bg-fintech-primary text-white hover:bg-blue-600' 
                : 'bg-fintech-border text-gray-500 cursor-not-allowed'
            }`}
          >
            Acknowledge & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
