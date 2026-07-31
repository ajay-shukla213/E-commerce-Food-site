import React, { useEffect, useState } from 'react';
import { PlusCircle, Trash2, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const categories = ['Starters', 'Main Course', 'Desserts', 'Beverages', 'Fast Food'];

const AdminProducts = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Fast Food');
  const [imageUrl, setImageUrl] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axiosClient.get('/food');
      setMenuItems(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const res = await axiosClient.post('/food', {
        name,
        description,
        price: Number(price),
        category,
        imageUrl,
      });

      setMenuItems((prev) => [res.data, ...prev]);
      setSuccess('Product added successfully');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setCategory('Fast Food');
    } catch (err) {
      setError(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      setSubmitting(true);
      await axiosClient.delete(`/food/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
      setSuccess('Product removed');
    } catch (err) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Product Panel</h1>
          <p className="text-slate-400 text-sm mt-1">Add or manage food items from here</p>
        </div>

        <button
          onClick={fetchMenu}
          className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 text-slate-300 px-4 py-2 rounded-xl text-sm hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-bold text-white">Add New Product</h2>

          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">Product Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                placeholder="e.g. Crispy Chicken Wrap"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                placeholder="Short description"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-slate-300">Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none focus:border-orange-500"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                <><PlusCircle className="h-4 w-4" /> Add Product</>
              )}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Existing Products</h2>
            <span className="text-sm text-slate-400">{menuItems.length}</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : menuItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-sm text-slate-400">
              No products yet.
            </div>
          ) : (
            <div className="space-y-3">
              {menuItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-sm text-slate-400">₹{item.price} • {item.category}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={submitting}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
