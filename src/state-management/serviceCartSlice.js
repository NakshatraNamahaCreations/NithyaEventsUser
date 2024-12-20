import {createSlice} from '@reduxjs/toolkit';

const serviceCartSlice = createSlice({
  name: 'serviceCart',
  initialState: [],
  reducers: {
    addToServiceCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.find(i => i.id === item.id);

      //   if (existingItem) {
      // Update the quantity if the item already exists
      // existingItem.quantity += 1;
      //   } else {
      const orderId =
        BigInt(Math.floor(Math.random() * 1e16)) * BigInt(1e4) +
        BigInt(Math.floor(Math.random() * 1e4));
      state.push({
        orderId: orderId.toString().padStart(20, '0'),
        id: item.id,
        context: 'service',
        shopName: item.store,
        storeImage: item.imageUrl,
        vendorName: item.vendor_name,
        pricing: item.productPrice,
        totalPrice: item.productPrice,
        orderDate: item.ordered_date,
        commissionTax: item.commissionTax || 0,
        commissionPercentage: item.commissionPercentage || 0,
        // mrpPrice: action.payload.mrpPrice, // Explicitly assign mrpPrice here
      });
      //   }
    },

    removeFromServiceCart: (state, action) => {
      return state.filter(item => item.id !== action.payload.id);
    },

    incrementServiceQuantity: (state, action) => {
      const service = state.find(item => item.id === action.payload.id);
      if (service) {
        service.quantity += 1;
        service.totalPrice = service.servicePrice * service.quantity;
      }
    },

    decrementServiceQuantity: (state, action) => {
      const service = state.find(item => item.id === action.payload.id);
      if (service && service.quantity > 1) {
        service.quantity -= 1;
        service.totalPrice = service.servicePrice * service.quantity;
      }
    },

    clearServiceCart: state => {
      return [];
    },
  },
});

export const {
  addToServiceCart,
  removeFromServiceCart,
  //   incrementServiceQuantity,
  //   decrementServiceQuantity,
  clearServiceCart,
} = serviceCartSlice.actions;

export default serviceCartSlice.reducer;
