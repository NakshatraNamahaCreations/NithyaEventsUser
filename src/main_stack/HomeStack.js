import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Home from '../components/home_screen/Home';
import VendorProfile from '../components/vendor/VendorProfile';
// import ProductFiltered from '../components/product_screen/ProductFiltered';
// import ProductDetails from '../components/product_screen/ProductDetails';
import AllVendors from '../components/vendor/AllVendors';
import HomeNew from '../components/home_screen/HomeNew';
import ServiceList from '../components/home_screen/ServiceList';
import ServiceCategory from '../components/home_screen/ServiceCategory';
// import ProductReview from '../components/product_screen/ProductReview';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeNew}
        // component={Home}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="ProductFiltered"
        component={ProductFiltered}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ProductReview"
        component={ProductReview}
        options={{headerShown: false}}
      /> */}
      <Stack.Screen
        name="VendorProfile"
        component={VendorProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AllVendors"
        component={AllVendors}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ServiceList"
        component={ServiceList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ServiceCategory"
        component={ServiceCategory}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;
