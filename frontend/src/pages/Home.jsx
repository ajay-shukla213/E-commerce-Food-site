import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Truck } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-8">
      {/* HERO SECTION */}
      <div className="text-center space-y-6 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="h-4 w-4" />
          <span>Real-time Live Food Order Status Updates</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-tight">
          Delicious Food, <br />
          <span className="text-orange-500">Delivered At Lightning Speed.</span>
        </h1>

        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore gourmet cuisines, real-time live order tracking, and seamless cloud technology checkout.
        </p>

        <div className="pt-4 flex justify-center">
          <Link
            to="/menu"
            className="inline-flex items-center space-x-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Explore Menu</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800/80 pt-16">
        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-orange-500/10 text-orange-500 w-fit rounded-xl">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Super Fast Delivery</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Hot and fresh meals delivered straight to your doorstep within 30 minutes.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-orange-500/10 text-orange-500 w-fit rounded-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Quality Assurance</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Prepared by top-rated local chefs using 100% fresh and high-grade ingredients.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-2xl space-y-3">
          <div className="p-3 bg-orange-500/10 text-orange-500 w-fit rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Live Tracking</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Real-time updates on your order progress from kitchen to your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;