import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Loader2, Calendar } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Delivered</span>
          </span>
        );
      case 'Out for Delivery':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-full">
            <Truck className="h-3.5 w-3.5" />
            <span>Out for Delivery</span>
          </span>
        );
      case 'Preparing':
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold rounded-full">
            <Clock className="h-3.5 w-3.5" />
            <span>Preparing</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold rounded-full">
            <Package className="h-3.5 w-3.5" />
            <span>Pending</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-sm font-medium">Fetching your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 my-8 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center space-x-3 text-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl my-8">
        <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">No Orders Placed Yet</h2>
        <p className="text-slate-400 text-sm">Once you place an order, you will be able to track its progress here.</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">My Orders</h1>
        <p className="text-slate-400 text-sm mt-1">Track your recent food deliveries and order status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Header: Order Info */}
            <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-500">ORDER ID</span>
                  <span className="text-sm font-bold text-slate-200">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {getStatusBadge(order.status)}
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total</span>
                  <span className="text-lg font-extrabold text-orange-500">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Body: Items List & Address */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</h4>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-slate-800/40 last:border-none">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-orange-500 text-xs bg-orange-500/10 px-2 py-0.5 rounded">
                          {item.quantity}x
                        </span>
                        <span className="text-slate-200 font-medium">{item.name || item.menuItem?.name || 'Food Item'}</span>
                      </div>
                      <span className="text-slate-400 font-mono">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-slate-950 border border-slate-800/60 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery Details</h4>
                <div className="text-sm space-y-1">
                  <p className="text-slate-300 font-medium leading-snug">{order.shippingAddress}</p>
                  <p className="text-xs text-slate-500">Payment Method: <span className="text-slate-300 font-semibold">{order.paymentMethod}</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;