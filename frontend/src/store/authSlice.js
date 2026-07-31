import { createSlice } from '@reduxjs/toolkit';

// LocalStorage se user load karo
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
      state.isLoading = false;

      localStorage.setItem(
        'userInfo',
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      state.isLoading = false;

      localStorage.removeItem('userInfo');
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;