import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  product: null,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
      console.log(state.product);
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },

    addToCart: (state, action) => {
      const existing = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cartItems.push({ ...action.payload });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    incrementQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    updateQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) item.quantity = action.payload.quantity;
    },
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  updateQuantity,
  setCart,
} = slice.actions;

export default slice.reducer;
