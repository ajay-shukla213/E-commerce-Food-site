import { createSlice } from '@reduxjs/toolkit';

// LocalStorage se saved cart items load karein
const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const totalAmountFromStorage = localStorage.getItem('totalAmount')
  ? JSON.parse(localStorage.getItem('totalAmount'))
  : 0;

const initialState = {
  cartItems: cartItemsFromStorage,
  totalAmount: totalAmountFromStorage,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        existItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }

      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== id);

      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((x) => x._id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      localStorage.setItem('totalAmount', JSON.stringify(state.totalAmount));
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      localStorage.removeItem('cartItems');
      localStorage.removeItem('totalAmount');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;