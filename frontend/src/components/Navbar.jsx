import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Utensils, ShoppingBag, LogOut, User, ShieldAlert, PlusCircle } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <Utensils className="h-5 w-5 text-orange-500" />
            BiteRush
          </Link>

          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/menu" className="hover:text-white transition">Menu</Link>
            <Link to="/cart" className="relative hover:text-white transition">
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <>
                {userInfo.role === 'admin' && (
                  <>
                    <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-white transition">
                      <ShieldAlert className="h-4 w-4" />
                      Admin
                    </Link>
                    <Link to="/admin/products" className="flex items-center gap-1 hover:text-white transition">
                      <PlusCircle className="h-4 w-4" />
                      Products
                    </Link>
                  </>
                )}
                <Link to="/my-orders" className="flex items-center gap-1 hover:text-white transition">
                  <User className="h-4 w-4" />
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-orange-500 font-semibold hover:text-orange-400 transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;