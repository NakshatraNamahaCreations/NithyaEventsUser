import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
// import {bookingHistory} from '../../data/global-data';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../../api-services/api-constants';
import moment from 'moment';
import {useUserContext} from '../../utilities/UserContext';

export default function Booking() {
  const navigation = useNavigation();
  const {userDataFromContext} = useUserContext();
  const [allOrderData, setAllOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAllBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USER_ORDER}${userDataFromContext?._id}`,
      );
      if (res.status === 200) {
        setAllOrder(res.data.userOrder.reverse());
      }
    } catch (error) {
      console.log('error');
    } finally {
      setLoading(false);
    }
  };
  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USER_ORDER}${userDataFromContext?._id}`,
      );
      if (res.status === 200) {
        setAllOrder(res.data.userOrder.reverse());
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
      console.error('Error refreshing bookings:', error);
    } finally {
      setRefreshing(false); // Stop refreshing
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [userDataFromContext?._id]);

  // console.log('context store value in booking', userDataFromContext);

  // console.log('user', user);

  // console.log(
  //   'allbooking>>>',
  //   allOrderData.map(e => e.service_data),
  // );

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {allOrderData.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}>
              <Entypo name="shopping-bag" size={25} color="#adadad" />
              <Text
                style={{
                  fontSize: 15,
                  color: '#adadad',
                  fontFamily: 'Montserrat-Medium',
                  marginTop: 10,
                }}>
                You have not made any bookings yet
              </Text>
            </View>
          ) : (
            <View style={{padding: 10}}>
              {allOrderData.map(item => (
                <TouchableOpacity
                  key={item._id}
                  style={{
                    backgroundColor: 'white',
                    marginBottom: 10,
                    borderRadius: 7,
                    borderColor: '#eee',
                    borderWidth: 1,
                  }}
                  onPress={() =>
                    navigation.navigate('Booking Summary', {
                      product: item,
                    })
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
                          backgroundColor: '#7460e4',
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FontAwesome
                          // name={
                          //   item.bookingStatus === 'Event Completed'
                          //     ? 'flag-checkered'
                          //     : 'calendar-check-o'
                          // }
                          name="flag-checkered"
                          size={25}
                          color="white"
                        />
                      </View>
                    </View>
                    <View style={{flex: 0.7}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          // letterSpacing: 1,
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        {item.event_name}
                      </Text>

                      <View style={{flexDirection: 'row', marginTop: 10}}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          ₹ {item.paid_amount.toFixed(2)}
                        </Text>
                        <Entypo name="dot-single" size={20} color="gray" />
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {moment(item.ordered_date).format('lll')}
                        </Text>
                      </View>
                      {/* <Text
                          style={{
                            color: 'black',
                            // item.order_status === 'Order Placed'
                            //   ? '#2f4e9e'
                            //   : item.order_status === 'Order Delivered'
                            //   ? '#009688'
                            //   : item.order_status === 'Order Cancelled'
                            //   ? '#f44336'
                            //   : item.order_status === 'Order Rescheduled'
                            //   ? '#2196f3'
                            //   : '#3b3b3b',
                            marginTop: 5,
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {item.order_status}
                        </Text> */}
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
                    {item.product_data?.slice(0, 2).map(ele => (
                      <Image
                        key={ele.id}
                        source={{
                          uri: ele?.imageUrl,
                        }}
                        style={{
                          flex: 0.2,
                          borderWidth: 1,
                          borderColor: '#e3e1e1',
                          paddingVertical: 10,
                          height: 80,
                          borderRadius: 10,
                          resizeMode: 'cover',
                          margin: 4,
                        }}
                      />
                    ))}
                    {item.service_data?.slice(0, 2).map((ele, eleIndex) => (
                      <Image
                        key={eleIndex}
                        source={{
                          uri: ele?.storeImage,
                        }}
                        style={{
                          flex: 0.2,
                          borderWidth: 1,
                          borderColor: '#e3e1e1',
                          paddingVertical: 10,
                          height: 80,
                          borderRadius: 10,
                          resizeMode: 'cover',
                          margin: 4,
                        }}
                      />
                    ))}
                    {item.product_data?.length + item.service_data?.length >
                      4 && (
                      <View
                        style={{
                          flex: 0.2,
                          height: 80,
                          borderRadius: 10,
                          margin: 4,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#efefef',
                        }}>
                        <Text
                          style={{
                            color: '#575757',
                            fontFamily: 'Montserrat-SemiBold',
                          }}>
                          +
                          {item?.product_data?.length +
                            item.service_data?.length -
                            4}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
