import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { 
  PlusCircle, Trash2, Package, Utensils, Loader2, 
  CheckCircle2, Clock, Truck, RefreshCw, AlertCircle 
} from 'lucide-react';

const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Fast Food'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'add-item' | 'manage-items'
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // New Item Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Starters');
  const [imageUrl, setImageUrl] = useState('');

  // Fetch Orders and Menu Data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, menuRes] = await Promise.all([
        axiosClient.get('/orders'),
        axiosClient.get('/food')
      ]);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setActionLoading(true);
      await axiosClient.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );
      setSuccessMsg('Order status updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Add New Menu Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError(null);
      const res = await axiosClient.post('/food', {
        name,
        description,
        price: Number(price),
        category,
        imageUrl,
      });

      setMenuItems((prev) => [res.data, ...prev]);
      setSuccessMsg('Food item added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Menu Item
  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    try {
      setActionLoading(true);
      await axiosClient.delete(`/food/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
      setSuccessMsg('Item deleted successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="py-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Manage kitchen orders and menu catalog</p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm transition-colors self-start md:self-auto"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center space-x-2 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center space-x-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>All Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('add-item')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'add-item'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Food Item</span>
        </button>

        <button
          onClick={() => setActiveTab('manage-items')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'manage-items'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Utensils className="h-4 w-4" />
          <span>Menu Catalog ({menuItems.length})</span>
        </button>
      </div>

      {/* TAB 1: ALL ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
              No customer orders received yet.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-6 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">ORDER ID</span>
                    <span className="text-sm font-bold text-white">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Customer: <span className="text-slate-200 font-medium">{order.user?.name || 'Guest'} ({order.user?.email})</span>
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-400">Update Status:</span>
                    <select
                      value={order.status}
                      disabled={actionLoading}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                {/* Items & Address */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Items</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-800/40 last:border-none">
                        <span className="text-slate-200">
                          <span className="text-orange-500 font-bold mr-2">{item.quantity}x</span>
                          {item.name || item.menuItem?.name || 'Item'}
                        </span>
                        <span className="text-slate-400 font-mono">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-slate-400 uppercase block mb-1">Address</span>
                    <p className="text-slate-300 font-medium">{order.shippingAddress}</p>
                    <div className="pt-2 text-slate-400">
                      Total: <span className="text-orange-500 font-bold text-sm">₹{order.totalAmount}</span> ({order.paymentMethod})
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: ADD FOOD ITEM FORM */}
      {activeTab === 'add-item' && (
        <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Create New Menu Item</h2>
          
          <form onSubmit={handleAddItem} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Dish Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Double Cheese Burger"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Image URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of ingredients and taste..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Adding Item...</span>
                </>
              ) : (
                <span>Add Item to Menu</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANAGE EXISTING MENU */}
      {activeTab === 'manage-items' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover bg-slate-950"
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white">{item.name}</h3>
                    <span className="text-xs bg-slate-800 text-orange-400 px-2 py-0.5 rounded font-medium">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                <span className="font-bold text-orange-500">₹{item.price}</span>
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  disabled={actionLoading}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;