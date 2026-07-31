import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import FoodCard from '../components/FoodCard';
import { Search, Utensils, Loader2 } from 'lucide-react';

const categories = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages', 'Fast Food'];

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/food');
        setItems(res.data);
      } catch (err) {
        console.error('Failed to fetch menu:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
  const matchesCategory =
    selectedCategory === "All" ||
    item.category.toLowerCase() === selectedCategory.toLowerCase();

  const matchesSearch =
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

  return matchesCategory && matchesSearch;
});
  return (
    <div className="space-y-8 py-6">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Explore Menu</h1>
          <p className="text-slate-400 text-sm mt-1">Freshly prepared meals delivered straight to you</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === category
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Grid / Loader */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-sm font-medium">Fetching delicious menu items...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
          <Utensils className="h-12 w-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No Menu Items Found</h3>
          <p className="text-slate-400 text-sm mt-1">Try resetting your filter or search query.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;