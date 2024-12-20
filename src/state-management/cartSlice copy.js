import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],

  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.find(
        item => item.productId === action.payload.productId,
      );
      console.log(existingProduct, 'existingProduct');

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice =
          existingProduct.quantity * existingProduct.productPrice;
      } else {
        const orderId =
          BigInt(Math.floor(Math.random() * 1e16)) * BigInt(1e4) +
          BigInt(Math.floor(Math.random() * 1e4));
        state.push({
          orderId: orderId.toString().padStart(20, '0'),
          productId: action.payload.productId,
          productName: action.payload.productName,
          productPrice: action.payload.productPrice,
          mrpPrice: action.payload.mrpPrice,
          store: action.payload.store,
          imageUrl: action.payload.imageUrl,
          totalPrice: action.payload.productPrice,
          quantity: 1,
          context: 'product',
          eventDate: action.payload.eventDate,
          productCategory: action.payload.productCategory,
          sellerName: action.payload.sellerName,
          sellerId: action.payload.sellerId,
        });
      }
    },

    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity: (state, action) => {
      const product = state.find(item => item.id === action.payload.produid);
      if (product) {
        product.quantity += 1;
        product.totalPrice = product.productPrice * product.quantity;
        // product.totalPrice = product.productPrice * product.quantity;
      }
    },
    decrementQuantity: (state, action) => {
      const product = state.find(item => item.id === action.payload.produid);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
        product.totalPrice = product.productPrice * product.quantity;
      }
    },

    // addServiceInCart: (state, action) => {
    //   const item = action.payload;
    //   const existingItem = state.find(i => i.id === item.id);

    //   if (existingItem) {
    //     // Update the quantity if the item already exists
    //     existingItem.quantity += 1;
    //   } else {
    //     const orderId =
    //       BigInt(Math.floor(Math.random() * 1e16)) * BigInt(1e4) +
    //       BigInt(Math.floor(Math.random() * 1e4));
    //     state.push({
    //       orderId: orderId.toString().padStart(20, '0'),
    //       id: item.id,
    //       shopName: item.store,
    //       storeImage: item.store_image,
    //       orderDate: item.ordered_date,
    //       quantity: 1,
    //       vendorName: item.vendor_name,
    //       // mrpPrice: action.payload.mrpPrice, // Explicitly assign mrpPrice here
    //     });
    //   }
    // },
    // removeServicesFromCart: (state, action) => {
    //   const itemId = action.payload.id;
    //   state.items = state.filter(item => item.id !== itemId);
    // },

    clearCart: state => {
      return [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  // addServiceInCart,
  // removeServicesFromCart,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;

// Clear the persisted state
// persistor.purge();
