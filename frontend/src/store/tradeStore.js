import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const useTradeStore = create((set, get) => ({
  orders: [],
  portfolio: { positions: [], total_invested: 0, total_current_value: 0, total_pnl: 0, total_pnl_pct: 0 },
  
  fetchOrders: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/orders/book?uid=${user.id}`);
      set({ orders: res.data });
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  },

  fetchPortfolio: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;
    try {
      const res = await axios.get(`${API_URL}/orders/portfolio?uid=${user.id}`);
      set({ portfolio: res.data });
    } catch (error) {
      console.error("Error fetching portfolio", error);
    }
  },

  placeOrder: async (orderData) => {
    const { user } = useAuthStore.getState();
    if (!user) return null;
    try {
      const payload = { ...orderData, uid: user.id };
      const res = await axios.post(`${API_URL}/orders/place`, payload);
      get().fetchOrders();
      get().fetchPortfolio();
      return res.data;
    } catch (error) {
      console.error("Error placing order", error);
      return null;
    }
  },

  cancelOrder: async (orderId) => {
    const { user } = useAuthStore.getState();
    if (!user) return false;
    try {
      await axios.delete(`${API_URL}/orders/${orderId}?uid=${user.id}`);
      get().fetchOrders();
      return true;
    } catch (error) {
      console.error("Error cancelling order", error);
      return false;
    }
  }
}));
