import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const OrderSuccess = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}>
      <AntDesign
        name="checkcircle"
        size={50}
        color="#16a34a"
        style={{textAlign: 'center', marginBottom: 10}}
      />
      <Text
        style={{
          color: 'black',
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 20,
          marginVertical: 15,
          textAlign: 'center',
        }}>
        Thank you!
        {/* Thank you for ordering! */}
      </Text>
      <Pressable
        style={{
          backgroundColor: '#7460e4',
          paddingVertical: 13,
          paddingHorizontal: 20,
          marginHorizontal: 70,
          borderRadius: 5,
          // elevation: 3,
        }}
        onPress={() => {
          navigation.navigate('Home');
        }}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'Montserrat-SemiBold',
            //   fontSize: 15,
            // letterSpacing: 1,
            textAlign: 'center',
          }}>
          GO BACK
        </Text>
      </Pressable>
    </View>
  );
};

export default OrderSuccess;

const styles = StyleSheet.create({});
