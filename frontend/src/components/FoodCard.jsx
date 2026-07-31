import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Plus, Check } from "lucide-react";
import { addToCart } from "../store/cartSlice";

const FoodCard = ({ item }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(item));

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group">

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            item.image ||
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
          }
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-orange-400 text-xs font-semibold px-3 py-1 rounded-full">
          {item.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-5">

        <div>
          <h3 className="text-lg font-bold text-white">
            {item.name}
          </h3>

          <p className="text-slate-400 text-sm mt-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">

          <div>
            <p className="text-xs text-slate-500">
              Price
            </p>

            <h2 className="text-orange-500 text-xl font-bold">
              ₹{item.price}
            </h2>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!(item.isAvailable ?? true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              added
                ? "bg-green-600 text-white"
                : (item.isAvailable ?? true)
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {added ? (
              <>
                <Check size={18} />
                Added
              </>
            ) : (item.isAvailable ?? true) ? (
              <>
                <Plus size={18} />
                Add
              </>
            ) : (
              "Sold Out"
            )}
          </button>

        </div>

      </div>
    </div>
  );
};

export default FoodCard;