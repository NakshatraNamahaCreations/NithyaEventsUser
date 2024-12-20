import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Booking() {
  const navigation = useNavigation();
  const [allbookingdata, setallbookingdata] = useState([]);
  const [user, setuser] = useState('');

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setuser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };

    getVendorData();
  }, []);

  useEffect(() => {
    if (user?._id) {
      getallbooking();
    }
  }, [user]);

  const getallbooking = async () => {
    try {
      const res = await axios.get(
        `http://192.168.1.67:9000/api/userorder/getorder/${user?._id}`,
      );
      if (res.status === 200) {
        setallbookingdata(res.data.userOrder);
      }
    } catch (error) {
      console.log('error');
    }
  };

  return (
    <ScrollView style={{backgroundColor: '#f7f6fd'}}>
      {allbookingdata.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../../assets/nobooking.jpg')}
            style={{width: 300, height: 300}}
            onError={() => console.log('Error loading image')}
          />
          <Text
            style={{
              color: '#012a32',
              fontSize: 20,
              fontWeight: '500',
              marginBottom: 15,
              fontFamily: 'Montserrat-Medium',
              letterSpacing: 1,
            }}>
            You have not made any bookings yet
          </Text>
        </View>
      ) : (
        <View style={{padding: 10}}>
          {allbookingdata.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'white',
                marginBottom: 10,
                borderRadius: 7,
                borderColor: '#eee',
                borderWidth: 1,
              }}
              onPress={() =>
                navigation.navigate('Booking Summary', {product: item})
              }>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  marginBottom: 5,
                }}>
                <View style={{flex: 0.2}}>
                  <View
                    style={{
                      backgroundColor: 'yellow',
                      borderRadius: 50,
                      width: 50,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <FontAwesome
                      name={
                        item.order_status === 'Event Completed'
                          ? 'flag-checkered'
                          : 'calendar-check-o'
                      }
                      size={25}
                      color="#3b3b3b"
                    />
                  </View>
                </View>
                <View style={{flex: 0.7}}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      letterSpacing: 1,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    {item.order_status}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      color: 'black',
                      letterSpacing: 1,
                      marginVertical: 2,
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    ₹{item.paid_amount}
                    <Entypo name="dot-single" size={20} color="gray" />
                    {new Date(item.ordered_date).toLocaleDateString()}
                  </Text>
                </View>
                <TouchableOpacity style={{flex: 0.1}}>
                  <Feather name="arrow-right" size={20} color="#313131" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderTopColor: '#f9f9f9',
                  borderTopWidth: 1,
                  paddingTop: 5,
                  marginBottom: 5,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  marginBottom: 10,
                  paddingLeft: 5,
                  paddingRight: 5,
                }}>
                <Image
                  source={{uri: `http://your-server/${item.product_image}`}}
                  style={{width: 50, height: 50, borderRadius: 5}}
                />
                <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 14, fontWeight: '600'}}>
                    {item.product_name}
                  </Text>
                  <Text style={{fontSize: 12}}>
                    Quantity: {item.applied_quantity}
                  </Text>
                  <Text style={{fontSize: 12}}>Total: ₹{item.totalPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
