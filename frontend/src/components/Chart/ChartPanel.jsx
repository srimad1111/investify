import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import axios from 'axios';
import { calculateSMA, calculateEMA, calculateBollingerBands } from '../../utils/indicators';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export function ChartPanel({ symbol }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const seriesRef = useRef();
  const smaSeriesRef = useRef();
  const emaSeriesRef = useRef();
  const bbUpperRef = useRef();
  const bbLowerRef = useRef();
  const bbMiddleRef = useRef();

  const [interval, setInterval] = useState('5m');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Indicator states
  const [showSMA, setShowSMA] = useState(false);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight
        });
      }
    };

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#151924' },
        textColor: '#B7BDC6',
      },
      grid: {
        vertLines: { color: '#2B3139' },
        horzLines: { color: '#2B3139' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#2B3139',
      },
      timeScale: {
        borderColor: '#2B3139',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#0ECB81',
      downColor: '#F6465D',
      borderDownColor: '#F6465D',
      borderUpColor: '#0ECB81',
      wickDownColor: '#F6465D',
      wickUpColor: '#0ECB81',
    });

    smaSeriesRef.current = chartRef.current.addLineSeries({ color: '#2962FF', lineWidth: 2 });
    emaSeriesRef.current = chartRef.current.addLineSeries({ color: '#FFD700', lineWidth: 2 });
    bbUpperRef.current = chartRef.current.addLineSeries({ color: '#00BCD4', lineWidth: 1, lineStyle: 2 });
    bbLowerRef.current = chartRef.current.addLineSeries({ color: '#00BCD4', lineWidth: 1, lineStyle: 2 });
    bbMiddleRef.current = chartRef.current.addLineSeries({ color: '#00BCD4', lineWidth: 1, lineStyle: 0 });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current.remove();
    };
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      if (!symbol) return;
      setLoading(true);
      try {
        const period = interval === '1d' ? '3mo' : interval === '1h' ? '1mo' : '5d';
        const res = await axios.get(`${API_URL}/market/history?symbol=${symbol}&interval=${interval}&period=${period}`);
        if (res.data && res.data.bars) {
          setData(res.data.bars);
          seriesRef.current.setData(res.data.bars);
          chartRef.current.timeScale().fitContent();
        }
      } catch (err) {
        console.error("Error fetching chart data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [symbol, interval]);

  // Update indicators
  useEffect(() => {
    if (data.length === 0) return;

    if (showSMA) {
      smaSeriesRef.current.setData(calculateSMA(data, 20));
    } else {
      smaSeriesRef.current.setData([]);
    }

    if (showEMA) {
      emaSeriesRef.current.setData(calculateEMA(data, 50));
    } else {
      emaSeriesRef.current.setData([]);
    }

    if (showBB) {
      const { upper, lower, middle } = calculateBollingerBands(data, 20, 2);
      bbUpperRef.current.setData(upper);
      bbLowerRef.current.setData(lower);
      bbMiddleRef.current.setData(middle);
    } else {
      bbUpperRef.current.setData([]);
      bbLowerRef.current.setData([]);
      bbMiddleRef.current.setData([]);
    }
  }, [data, showSMA, showEMA, showBB]);

  return (
    <div className="fintech-card flex flex-col h-full min-h-[500px] relative">
      <div className="flex flex-wrap items-center justify-between p-3 border-b border-fintech-border gap-2">
        <h2 className="font-semibold text-lg">{symbol}</h2>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-fintech-dark rounded p-1 text-xs">
            <button onClick={() => setShowSMA(!showSMA)} className={`px-2 py-1 rounded ${showSMA ? 'bg-[#2962FF] text-white' : 'text-fintech-text'}`}>SMA(20)</button>
            <button onClick={() => setShowEMA(!showEMA)} className={`px-2 py-1 rounded ${showEMA ? 'bg-[#FFD700] text-black' : 'text-fintech-text'}`}>EMA(50)</button>
            <button onClick={() => setShowBB(!showBB)} className={`px-2 py-1 rounded ${showBB ? 'bg-[#00BCD4] text-black' : 'text-fintech-text'}`}>BB(20,2)</button>
          </div>

          <div className="flex bg-fintech-dark rounded p-1">
            {['1m', '5m', '15m', '1h', '1d'].map(i => (
              <button
                key={i}
                onClick={() => setInterval(i)}
                className={`px-3 py-1 text-sm rounded ${interval === i ? 'bg-fintech-border text-white' : 'text-fintech-text hover:text-white'}`}
              >
                {i.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="absolute inset-0 z-10 bg-[#151924]/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fintech-primary"></div>
        </div>
      )}
      
      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
}
