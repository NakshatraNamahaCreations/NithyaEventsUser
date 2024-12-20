import {createSlice} from '@reduxjs/toolkit';

const techCartSlice = createSlice({
  name: 'technicianCart',
  initialState: [],
  reducers: {
    // addTechToCart: (state, action) => {
    //   const item = action.payload;
    //   const orderId =
    //     BigInt(Math.floor(Math.random() * 1e16)) * BigInt(1e4) +
    //     BigInt(Math.floor(Math.random() * 1e4));
    //   state.push({
    //     orderId: orderId.toString().padStart(20, '0'),
    //     service_id: item.service_id,
    //     category: item.category,
    //     price: item.price,
    //     service_name: item.service_name,
    //     shop_name: item.shop_name,
    //     vendor_id: item.vendor_id,
    //     vendor_name: item.vendor_name,
    //     eventStartDate: item.eventStartDate,
    //     eventEndDate: item.eventEndDate,
    //     quantity: 1,
    //     totalPrice: item.price,
    //   });
    // },

    // removeTechFromCart: (state, action) => {
    //   return state.filter(item => item.service_id !== action.payload.id);
    // },

    // incrementTechQuantity: (state, action) => {
    //   const tech = state.find(item => item.id === action.payload.id);
    //   if (tech) {
    //     tech.quantity += 1;
    //     tech.totalPrice = tech.price * tech.quantity;
    //   }
    // },

    // decrementTechQuantity: (state, action) => {
    //   const tech = state.find(item => item.id === action.payload.id);
    //   if (tech && tech.quantity > 1) {
    //     tech.quantity -= 1;
    //     tech.totalPrice = tech.price * tech.quantity;
    //   }
    // },

    addTechToCart: (state, action) => {
      const item = action.payload;
      const orderId =
        BigInt(Math.floor(Math.random() * 1e16)) * BigInt(1e4) +
        BigInt(Math.floor(Math.random() * 1e4));

      // Check if the item already exists in the cart
      const existingItem = state.find(
        cartItem => cartItem.service_id === item.service_id,
      );

      if (existingItem) {
        // If it exists, increase the quantity and update the totalPrice
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.price * existingItem.quantity;
      } else {
        // If not, add it as a new entry
        state.push({
          orderId: orderId.toString().padStart(20, '0'),
          service_id: item.service_id,
          category: item.category,
          price: item.price,
          service_name: item.service_name,
          shop_name: item.shop_name,
          vendor_id: item.vendor_id,
          vendor_name: item.vendor_name,
          eventStartDate: item.eventStartDate,
          eventEndDate: item.eventEndDate,
          quantity: 1,
          totalPrice: item.price,
        });
      }
    },

    removeTechFromCart: (state, action) => {
      // Use service_id for comparison, as that's the identifier
      return state.filter(
        item => item.service_id !== action.payload.service_id,
      );
    },

    incrementTechQuantity: (state, action) => {
      // Find the item by service_id
      const tech = state.find(
        item => item.service_id === action.payload.service_id,
      );
      if (tech) {
        tech.quantity += 1;
        tech.totalPrice = tech.price * tech.quantity; // Update totalPrice
      }
    },

    decrementTechQuantity: (state, action) => {
      // Find the item by service_id
      const tech = state.find(
        item => item.service_id === action.payload.service_id,
      );
      if (tech && tech.quantity > 1) {
        tech.quantity -= 1;
        tech.totalPrice = tech.price * tech.quantity; // Update totalPrice
      }
    },

    clearTechCart: state => {
      return [];
    },
  },
});

export const {
  addTechToCart,
  removeTechFromCart,
  incrementTechQuantity,
  decrementTechQuantity,
  clearTechCart,
} = techCartSlice.actions;

export default techCartSlice.reducer;
