import { useEffect, useRef } from 'react';
import { useMarketStore } from '../store/marketStore';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws/feed';

export function useWebSocket() {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);
  const updateQuotesRef = useRef(null);
  
  // Keep ref in sync so the handler always uses the latest version without causing reconnects
  updateQuotesRef.current = useMarketStore.getState().updateQuotes;

  useEffect(() => {
    let destroyed = false;

    const connect = () => {
      if (destroyed) return;
      
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'quotes') {
            updateQuotesRef.current(message.data);
          }
        } catch (error) {
          console.error('WebSocket message parse error', error);
        }
      };

      ws.current.onerror = (err) => {
        console.warn('WebSocket error', err);
      };

      ws.current.onclose = () => {
        if (!destroyed) {
          reconnectTimer.current = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      destroyed = true;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (ws.current) {
        ws.current.onclose = null; // prevent reconnect on intentional close
        ws.current.close();
      }
    };
  }, []); // empty deps — stable connection for lifetime of component

  return ws.current;
}
