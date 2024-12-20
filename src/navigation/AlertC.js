import {View, Text, Alert} from 'react-native';
import React from 'react';

const AlertC = () => {
  const showAler = () => {
    Alert.alert('Please Select Event Dates');
  };

  return (
    <View>
      <Text>{showAler}</Text>
    </View>
  );
};

export default AlertC;
