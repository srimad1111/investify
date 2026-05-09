import { useEffect } from 'react';
import { useTradeStore } from '../store/tradeStore';
import { StockLogo } from '../components/ui/StockLogo';

export function Orders() {
  const fetchOrders = useTradeStore(state => state.fetchOrders);
  const cancelOrder = useTradeStore(state => state.cancelOrder);
  const orders = useTradeStore(state => state.orders);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full p-8 space-y-6 min-h-[calc(100vh-64px)]">
      <h1 className="font-headline-xl text-headline-xl">Order Book</h1>
      
      <div className="bg-surface-container-low border border-surface-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-surface-variant text-xs text-outline uppercase tracking-wider bg-surface-container-high">
                <th className="p-4">Time</th>
                <th className="p-4">Symbol</th>
                <th className="p-4">Type</th>
                <th className="p-4">Qty</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(!orders || orders.length === 0) ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-outline">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <tr key={i} className="border-b border-surface-variant/50 hover:bg-surface-container-high transition-colors text-sm">
                    <td className="p-4 text-outline whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-on-surface">
                      <div className="flex items-center gap-3">
                        <StockLogo symbol={order.symbol} className="w-8 h-8 rounded-full" />
                        <span>{order.symbol}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${order.side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-error/20 text-error'}`}>
                        {order.side} {order.order_type}
                      </span>
                    </td>
                    <td className="p-4 text-on-surface">{order.quantity}</td>
                    <td className="p-4 text-on-surface font-data-mono">
                      {order.order_type === 'MARKET' ? 'MKT' : `₹${order.price}`}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'EXECUTED' ? 'bg-green-500/20 text-green-400' : 
                        order.status === 'CANCELLED' ? 'bg-error/20 text-error' : 
                        'bg-yellow-500/20 text-yellow-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => cancelOrder(order.id)}
                          className="text-xs text-error hover:text-white border border-error hover:bg-error px-3 py-1 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      )}
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
