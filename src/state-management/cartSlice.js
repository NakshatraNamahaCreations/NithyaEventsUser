import {createSlice} from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [],

  reducers: {
    addToCart: (state, action) => {
      const existingProduct = state.find(item => item.id === action.payload.id);
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
          // ...action.payload,
          // totalPrice: action.payload.productPrice,
          // mrpPrice: action.payload.mrpPrice,
          // store: action.payload.store,  //old one. working
          // quantity: 1,
          orderId: orderId.toString().padStart(20, '0'),
          id: action.payload.id,
          productName: action.payload.productName,
          productPrice: action.payload.productPrice,
          mrpPrice: action.payload.mrpPrice, // Explicitly assign mrpPrice here
          store: action.payload.store,
          imageUrl: action.payload.imageUrl,
          productDimension: action.payload.productDimension,
          totalPrice: action.payload.productPrice,
          quantity: 1,
          context: 'product',
          sellerName: action.payload.sellerName,
          sellerId: action.payload.sellerId,
          eventStartDate: action.payload.eventStartDate,
          eventEndDate: action.payload.eventEndDate,
          eventEndDate: action.payload.eventEndDate,
          commissionTax: action.payload.commissionTax,
          commissionPercentage: action.payload.commissionPercentage,
          //all woring
        });
      }
    },

    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },
    incrementQuantity: (state, action) => {
      const product = state.find(item => item.id === action.payload.id);
      if (product) {
        product.quantity += 1;
        product.totalPrice = product.productPrice * product.quantity;
        // product.totalPrice = product.productPrice * product.quantity;
      }
    },
    decrementQuantity: (state, action) => {
      const product = state.find(item => item.id === action.payload.id);
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
