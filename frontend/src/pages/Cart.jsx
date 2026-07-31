import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import axiosClient from '../api/axiosClient';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Loader2, MapPin, CreditCard } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deliveryFee = cartItems.length > 0 ? 40 : 0;
  const grandTotal = totalAmount + deliveryFee;

  const handleQuantityChange = (item, newQty) => {
    if (newQty <= 0) {
      dispatch(removeFromCart(item._id));
    } else {
      dispatch(updateQuantity({ id: item._id, quantity: newQty }));
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      navigate('/login');
      return;
    }

    if (!address.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: grandTotal,
        shippingAddress: address,
        paymentMethod,
      };

      await axiosClient.post('/orders', orderData);
      dispatch(clearCart());
      setLoading(false);
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl my-8">
        <ShoppingBag className="h-16 w-16 text-slate-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm mb-6">Looks like you haven't added any delicious food items yet.</p>
        <Link
          to="/menu"
          className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/20"
        >
          <span>Browse Menu</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8">
      <h1 className="text-3xl font-black text-white">Your Shopping Cart</h1>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img
                  src={item.image || item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-950 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <p className="text-slate-400 text-sm">₹{item.price} each</p>
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
                <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-white text-sm min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <span className="font-bold text-orange-500 text-lg min-w-[70px] text-right">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  onClick={() => dispatch(removeFromCart(item._id))}
                  className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-slate-800 pb-4">
            Order Summary
          </h2>

          <form onSubmit={handleCheckout} className="space-y-5">
            {/* Delivery Address */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Delivery Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Building, Flat No."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Payment Method
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-3 h-5 w-5 text-slate-500" />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="UPI">UPI / Net Banking</option>
                  <option value="CARD">Credit / Debit Card</option>
                </select>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-orange-500">₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <span>{userInfo ? 'Confirm Order' : 'Login to Checkout'}</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;