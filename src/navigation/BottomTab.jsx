import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeStack from '../main_stack/HomeStack';
import CartStack from '../main_stack/CartStack';
import MyProfile from '../components/profile_screen/MyProfile';
import BookingStack from '../main_stack/BookingStack';
import CategoryStack from '../main_stack/CategoryStack';
import {TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {useDateContext} from '../utilities/DateSelection';
// import CustomTabBar from './CustomTabBar';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const {dateSelection} = useDateContext();
  console.log('dateSelection', dateSelection);
  const cart = useSelector(state => state.cart);
  const [user, setUser] = useState(null);

  const serviceCart = useSelector(state => state.serviceCart);
  const techCart = useSelector(state => state.technicianCart);
  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0) +
    (techCart.length > 0 ? techCart.length : 0);

  const CustomTabBarButton = ({children, onPress, accessibilityState}) => {
    const isSelected = accessibilityState.selected;

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isSelected ? '#7460e4' : 'transparent',
          borderRadius: 0, // Adjust the border radius as needed
        }}>
        {children}
      </TouchableOpacity>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      // tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: 'white',
        headerTintColor: '#01007B',
        tabBarActiveBackgroundColor: '#7460e4',
        tabBarStyle: {height: 55},
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="home" color={color} size={size} />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />
      <Tab.Screen
        name="BookingStack"
        component={BookingStack}
        options={{
          tabBarLabel: 'My Bookings',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="CategoryStack"
        component={CategoryStack}
        options={{
          tabBarLabel: 'Categories',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="category" color={color} size={size} />
          ),
        }}
      />
      {dateSelection !== null && (
        <Tab.Screen
          name="CartStack"
          component={CartStack}
          options={{
            tabBarBadge: totalCart,
            tabBarLabel: 'Cart',
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <AntDesign name="shoppingcart" color={color} size={size} />
            ),
          }}
        />
      )}
      <Tab.Screen
        name="You"
        component={MyProfile}
        options={{
          tabBarLabel: 'You',
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
