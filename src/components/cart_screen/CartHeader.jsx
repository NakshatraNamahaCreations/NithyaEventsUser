import {View, Text} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';

export default function CartHeader({cartSize}) {
  const cart = useSelector(state => state.cart);
  const serviceCart = useSelector(state => state.serviceCart);
  const techCart = useSelector(state => state.technicianCart);
  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (techCart.length > 0 ? techCart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0);

  return (
    <View
      style={{
        // backgroundColor: 'white',
        padding: 15,
        // elevation: 10,
        borderWidth: 2,
        borderColor: '#e3e3e3',
        flexDirection: 'row',
      }}>
      <Text
        style={{
          color: 'black',
          fontSize: 17,
          fontFamily: 'Montserrat-SemiBold',
          marginRight: 5,
        }}>
        Cart
      </Text>
      <Text
        style={{
          color: 'black',
          fontSize: 17,
          fontFamily: 'Montserrat-SemiBold',
        }}>
        ({totalCart})
      </Text>
    </View>
  );
}
