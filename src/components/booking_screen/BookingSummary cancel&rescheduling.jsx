import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {Checkbox} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {apiUrl} from '../../api-services/api-constants';
import moment from 'moment';
import {useNavigation, useRoute} from '@react-navigation/native';
import Modal from 'react-native-modal';
import axios from 'axios';

export default function BookingSummary() {
  const deviceWidth = Dimensions.get('window').width;
  const route = useRoute();
  const product = route.params.product;
  const navigation = useNavigation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openReschedule, setOpenReschedule] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);

  // console.log('order status>>>>>>>>>>', orderData.order_status);
  // console.log('event name', product.event_name);
  // console.log('event name', product);
  // console.log('event start date', product.event_start_date);
  // console.log('48 hours before event:', formatted48HoursDate);
  // console.log('Event start date:', formattedEventStartDate);
  // console.log("Today's date:", formattedToday);

  const getOnlyThisBooking = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_ORDER_BY_ORDER_ID}${product?._id}`,
      );
      if (res.status === 200) {
        setOrderData(res.data.orderId);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOnlyThisBooking();
  }, [product?._id]);
  console.log('orderData', orderData);
  console.log('event status>>>', orderData.order_status);

  const showPopup = () => {
    setIsOpenModal(true);
  };

  const showReschedulePop = () => {
    setOpenReschedule(true);
  };

  // const calculateProductSubtotal = () => {
  //   return orderData?.product_data?.reduce(
  //     (acc, value) => acc + value.totalPrice,
  //     0,
  //   );
  // };

  // const calculateServiceSubtotal = () => {
  //   return orderData?.service_data?.reduce(
  //     (acc, service) => acc + service.totalPrice,
  //     0,
  //   );
  // };

  // const calculateGST = subtotal => {
  //   return subtotal * 0.18;
  // };

  // const productTotal = calculateProductSubtotal();
  // const serviceTotal = calculateServiceSubtotal();

  // const subTotal = productTotal + serviceTotal;

  // const gst = calculateGST(subTotal).toFixed(2);
  // const total = Number(subTotal) + Number(gst);

  const cancelOrder = () => {
    if (checked === false) {
      Alert.alert(
        'Cancellation Policy',
        'Please confirm that you have read and understood the cancellation policy by checking the box before proceeding.',
        [{text: 'OK'}],
      );
    } else {
      navigation.navigate('ReasonForCancel', {bookingInfo: orderData});
    }
  };

  const handlingEventStatus = () => {
    const eventStartDate = new Date(orderData.event_start_date);
    const eventEndDate = new Date(orderData.event_end_date);
    const hoursToSubtract = 48 * 60 * 60 * 1000;
    const date48HoursBefore = new Date(
      eventStartDate.getTime() - hoursToSubtract,
    );

    const today = new Date();
    const formattedToday = moment(today).format('YYYY-MM-DD');
    const formattedEventStartDate = moment(eventStartDate).format('YYYY-MM-DD');
    const formattedEventEndDate = moment(eventEndDate).format('YYYY-MM-DD');
    const formatted48HoursDate = moment(date48HoursBefore).format('YYYY-MM-DD');

    // Check if today is the event start date
    if (formattedToday === formattedEventStartDate) {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              color: '#b58800',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            <FontAwesome name="flag" size={20} color="#b58800" /> Event Started
          </Text>
        </View>
      );
    }

    // Check if today is the event end date
    if (formattedToday === formattedEventEndDate) {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              color: '#0a580d',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            <FontAwesome name="flag" size={20} color="#0a580d" /> Event has
            ended!
          </Text>
        </View>
      );
    }
    // Event is completed (today is after the event_end_date)
    if (moment(today).isAfter(eventEndDate)) {
      return (
        <View>
          <Text
            style={{
              fontSize: 14,
              color: '#0a580d',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            <FontAwesome name="flag" size={20} color="#0a580d" /> Event
            completed
          </Text>
        </View>
      );
    }

    // Check if the event is within the 48-hour cancellation window
    if (
      orderData.order_status === 'Order Placed' &&
      moment(today).isSameOrBefore(date48HoursBefore)
    ) {
      return (
        <TouchableOpacity onPress={showPopup}>
          <Text
            style={{
              color: '#ad2b2b',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            <MaterialCommunityIcons name="close" size={20} color="#ad2b2b" />{' '}
            Cancel Event
          </Text>
        </TouchableOpacity>
      );
    }

    // Handle "Order Cancelled" status
    if (orderData.order_status === 'Order Cancelled') {
      return (
        <Text
          style={{
            color: '#ad2b2b',
            fontSize: 14,
            fontFamily: 'Montserrat-Medium',
            textAlign: 'center',
          }}>
          Event has been cancelled
        </Text>
      );
    }

    // Handle "Order Delivered" status
    if (orderData.order_status === 'Order Delivered') {
      return (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Raise Ticket', {
              order: orderData.product_data,
            });
          }}>
          <Text
            style={{
              color: '#ad2b2b',
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            <FontAwesome6 name="ticket" size={20} color="#ad2b2b" /> Raise
            Ticket
          </Text>
        </TouchableOpacity>
      );
    }

    // Handle "Order Rescheduled" status
    if (orderData.order_status === 'Order Rescheduled') {
      return (
        <Text
          style={{
            color: '#ad2b2b',
            fontSize: 14,
            fontFamily: 'Montserrat-Medium',
            textAlign: 'center',
          }}>
          Event has been rescheduled
        </Text>
      );
    }
    return (
      // Default case: allow rescheduling or other actions
      <TouchableOpacity onPress={showReschedulePop}>
        <Text
          style={{
            color: '#ad2b2b',
            fontSize: 14,
            fontFamily: 'Montserrat-Medium',
            textAlign: 'center',
          }}>
          <AntDesign name="retweet" size={20} color="#ad2b2b" />{' '}
          {/* Cancel Order 
          change later */}
          Reschedule Event
        </Text>
        {/* <Text style={styles.text}>Reschedule Event Only</Text> */}
      </TouchableOpacity>
    );

    // return (
    //   <TouchableOpacity onPress={showPopup}>
    //     <Text
    //       style={{
    //         color: '#ad2b2b',
    //         fontSize: 14,
    //         fontFamily: 'Montserrat-Medium',
    //         textAlign: 'center',
    //       }}>
    //       <MaterialCommunityIcons name="close" size={20} color="#ad2b2b" />{' '}
    //       Reschedule Event
    //     </Text>
    //   </TouchableOpacity>
    // );
  };

  // old workign case
  // const handlingEventStatus = () => {
  //   const eventStartDate = new Date(orderData.event_start_date);
  //   const hoursToSubtract = 48 * 60 * 60 * 1000;
  //   const date48HoursBefore = new Date(
  //     eventStartDate.getTime() - hoursToSubtract,
  //   );

  //   const today = new Date();
  //   const formattedToday = moment(today).format('YYYY-MM-DD');
  //   const formattedEventStartDate = moment(eventStartDate).format('YYYY-MM-DD');
  //   const formatted48HoursDate = moment(date48HoursBefore).format('YYYY-MM-DD');

  //   if (
  //     orderData.order_status === 'Order Placed' &&
  //     formattedToday === formattedEventStartDate
  //   ) {
  //     return (
  //       <View>
  //         <Text style={styles.text}>Event starts today!</Text>
  //       </View>
  //     );
  //   } else if (
  //     orderData.order_status === 'Order Placed' &&
  //     moment(today).isSameOrBefore(date48HoursBefore)
  //   ) {
  //     return (
  //       <TouchableOpacity onPress={showPopup}>
  //         <Text
  //           style={{
  //             color: '#ad2b2b',
  //             fontSize: 14,
  //             fontFamily: 'Montserrat-Medium',
  //             textAlign: 'center',
  //           }}>
  //           <MaterialCommunityIcons name="close" size={20} color="#ad2b2b" />{' '}
  //           Cancel Event
  //         </Text>
  //         {/* <Text style={styles.text}>Cancel order allow</Text> */}
  //       </TouchableOpacity>
  //     );
  //   } else if (orderData.order_status === 'Order Cancelled') {
  //     return (
  //       <Text
  //         style={{
  //           color: '#ad2b2b',
  //           fontSize: 14,
  //           fontFamily: 'Montserrat-Medium',
  //           textAlign: 'center',
  //         }}>
  //         Event has been cancelled
  //       </Text>
  //     );
  //   } else if (orderData.order_status === 'Order Delivered') {
  //     <TouchableOpacity
  //       onPress={() => {
  //         navigation.navigate('Raise Ticket', {
  //           order: orderData.product_data,
  //         });
  //       }}>
  //       <Text
  //         style={{
  //           color: '#ad2b2b',
  //           fontSize: 14,
  //           fontFamily: 'Montserrat-Medium',
  //           textAlign: 'center',
  //         }}>
  //         <FontAwesome6 name="ticket" size={20} color="#ad2b2b" /> Raise Ticket
  //       </Text>
  //     </TouchableOpacity>;
  //   } else {
  //     return (
  //       <TouchableOpacity onPress={showPopup}>
  //         <Text
  //           style={{
  //             color: '#ad2b2b',
  //             fontSize: 14,
  //             fontFamily: 'Montserrat-Medium',
  //             textAlign: 'center',
  //           }}>
  //           <MaterialCommunityIcons name="close" size={20} color="#ad2b2b" />{' '}
  //           Cancel Order
  //         </Text>
  //         {/* <Text style={styles.text}>Reschedule Event Only</Text> */}
  //       </TouchableOpacity>
  //     );
  //   }
  // };

  // console.log('handlingEventStatus', handlingEventStatus());

  return (
    <>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{backgroundColor: 'white', height: '100%'}}>
          <TouchableOpacity style={{paddingTop: 20, padding: 10}}>
            <Ionicons
              name="chevron-back-sharp"
              size={30}
              color="black"
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <ScrollView>
            <View style={{padding: 10}}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  // marginBottom: 20,
                }}>
                Booking Summary
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: '#636363',
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 5,
                }}>
                Bookings Created At:{' '}
                {moment(orderData.ordered_date).format('lll')}
              </Text>

              {/* <Text
            style={{
              fontSize: 12,
              color: 'green',
              letterSpacing: 1,
              fontFamily: 'Montserrat-Medium',
              // marginBottom: 20,
            }}>
            {orderData.bookingStatus}
          </Text> */}
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  {orderData.product_data?.length +
                    orderData.service_data?.length}{' '}
                  items in this order
                </Text>
              </View>
              <View>
                {orderData.product_data?.map((item, productIndex) => (
                  <View
                    key={productIndex}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                      marginBottom: 5,
                    }}>
                    <View style={{flex: 0.2}}>
                      <View
                        style={{
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          borderWidth: 1,
                          borderColor: '#e3e1e1',
                          borderRadius: 10,
                        }}>
                        <Image
                          source={{
                            uri: `${apiUrl.IMAGEURL}${item.imageUrl}`,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{flex: 0.6}}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        {item.productName}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          marginTop: 5,
                          color: '#ea5362',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Qty: {item.quantity}
                      </Text>
                    </View>
                    <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'black',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        <MaterialIcons
                          name="currency-rupee"
                          // size={13}
                          color="black"
                        />
                        {item.productPrice}
                      </Text>
                    </View>
                  </View>
                ))}
                {orderData.service_data?.map((item, serviceIndex) => (
                  <View
                    key={serviceIndex}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                      marginBottom: 5,
                    }}>
                    <View style={{flex: 0.2}}>
                      <View
                        style={{
                          borderRadius: 50,
                          width: 50,
                          height: 50,
                          borderWidth: 1,
                          borderColor: '#e3e1e1',
                          borderRadius: 10,
                        }}>
                        <Image
                          source={{
                            uri: `${apiUrl.IMAGEURL}${item.storeImage.replace(
                              /\\/g,
                              '/',
                            )}`,
                          }}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 50,
                          }}
                        />
                      </View>
                    </View>
                    <View style={{flex: 0.6}}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        {item.shopName}
                      </Text>
                    </View>
                    <View style={{flex: 0.2, alignItems: 'flex-end'}}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: 'black',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        <MaterialIcons
                          name="currency-rupee"
                          // size={13}
                          color="#3c4145"
                        />
                        {item.totalPrice}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={{marginHorizontal: 10}}>
              <Image
                source={require('../../../assets/close-up.jpg')}
                resizeMode="cover"
                style={{width: deviceWidth - 20, height: 135, borderRadius: 5}}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 10, // Optional for text padding
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  LET'S FIGHT
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    color: '#fdb33a',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-ExtraBold',
                  }}>
                  HUNGER!
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  DONATE NOW AND SAVE THEIR LIFE
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  MORE INFORMATION AT OUR WEBSITE
                </Text>
                <TouchableOpacity
                  style={{marginTop: 5}}
                  onPress={() => Linking.openURL('https://www.google.com/')}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#f2f2f2',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                      backgroundColor: '#ad2b2b',
                      borderRadius: 5,
                      padding: 5,
                      // width: 115,
                      flexDirection: 'row', // to align icon and text
                      alignItems: 'center', // to center items in row
                      justifyContent: 'center', // center content horizontally
                    }}>
                    <MaterialIcons name="fastfood" size={14} color="#f2f2f2" />{' '}
                    DONATE FOOD
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginBottom: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  padding: 10,
                }}>
                Bill details
              </Text>
              <View
                style={{
                  borderTopColor: '#f5f5f5',
                  borderTopWidth: 1,
                  marginBottom: 5,
                }}></View>
              <View style={{padding: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Total
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      <MaterialIcons
                        name="currency-rupee"
                        size={14}
                        color="black"
                      />
                      {/* 1025000{' '} */}
                      {orderData?.cart_total?.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Event Days
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {orderData?.number_of_days} Days
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderColor: 'black',
                    borderWidth: 0.3,
                    marginVertical: 15,
                    borderStyle: 'dashed',
                  }}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Sub Total
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 13,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      <MaterialIcons
                        name="currency-rupee"
                        size={14}
                        color="black"
                      />
                      {/* 1025000{' '} */}
                      {orderData?.sub_total?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                      }}>
                      CGST 9%
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      <MaterialIcons
                        name="currency-rupee"
                        size={14}
                        color="black"
                      />
                      {(orderData?.gst_applied_value / 2)?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                      }}>
                      SGST 9%
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 14,
                      }}>
                      <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      />
                      {(orderData?.gst_applied_value / 2)?.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                      }}>
                      Bill total
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                      }}>
                      {' '}
                      <MaterialIcons
                        name="currency-rupee"
                        size={14}
                        color="black"
                      />
                      {/* 10,45,000{' '} */}
                      {orderData?.paid_amount?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                borderColor: '#f7f6fd',
                borderWidth: 2,
                marginBottom: 5,
              }}></View>
            <View
              style={{
                marginBottom: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  // color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  padding: 10,
                  color: 'black',
                }}>
                Order details
              </Text>
              <View
                style={{
                  borderTopColor: '#f5f5f5',
                  borderTopWidth: 1,
                  marginBottom: 5,
                }}></View>
              <View style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Order id
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 3,
                  }}>
                  {/* {item.orderId} */}
                  EVTBX{orderData?._id?.slice(-6)}
                </Text>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Event Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                    }}>
                    {orderData?.event_name}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Payment
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                    }}>
                    {orderData?.payment_method}
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Address
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      // color: '#ff6666',
                      fontFamily: 'Montserrat-Medium',
                      //
                    }}>
                    {orderData?.venue_name},
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                    }}>
                    {orderData?.event_location},
                  </Text>
                </View>
                <View style={{marginTop: 10}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Event Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                    }}>
                    {orderData?.event_date}
                    {/* June 28, 2024, 10:00 AM - June 28, 2024, 6:00 PM */}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              backgroundColor: 'white',
              flexDirection: 'row',
              elevation: 2,
              borderTopColor: '#f5f5f5',
              borderTopWidth: 1,
              padding: 15,
            }}>
            {/* {orderData.order_status === 'Order Placed' ? (
              <TouchableOpacity style={{flex: 0.5}} onPress={showPopup}>
                <Text
                  style={{
                    color: '#ad2b2b',
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    textAlign: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#ad2b2b"
                  />{' '}
                  Cancel Order
                </Text>
              </TouchableOpacity>
            ) : orderData.order_status === 'Order Delivered' ? (
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={() => {
                  navigation.navigate('Raise Ticket', {
                    order: orderData.product_data,
                  });
                }}>
                <Text
                  style={{
                    color: '#ad2b2b',
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    textAlign: 'center',
                  }}>
                  <FontAwesome6 name="ticket" size={20} color="#ad2b2b" /> Raise
                  Ticket
                </Text>
              </TouchableOpacity>
            ) : orderData.order_status === 'Order Cancelled' ? (
              <Text
                style={{
                  color: '#ad2b2b',
                  flex: 0.5,
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Order Cancelled
              </Text>
            ) : orderData.event_start_date === today ? (
              <Text
                style={{
                  color: '#ad2b2b',
                  flex: 0.5,
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Event Started{' '}
                <MaterialCommunityIcons
                  name="party-popper"
                  size={20}
                  color="#ad2b2b"
                />
              </Text>
            ) : orderData.event_end_date === today ? (
              <Text
                style={{
                  color: '#ad2b2b',
                  flex: 0.5,
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Event Completed{' '}
                <MaterialCommunityIcons
                  name="party-popper"
                  size={20}
                  color="#ad2b2b"
                />
              </Text>
            ) : null} */}
            {/* {orderData.order_status === 'Order Placed' ? (
              <TouchableOpacity style={{flex: 0.5}} onPress={showPopup}>
                <Text
                  style={{
                    color: '#ad2b2b',
                    fontSize: 14,
                    fontFamily: 'Montserrat-Medium',
                    textAlign: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#ad2b2b"
                  />{' '}
                  Cancel Order
                </Text>
              </TouchableOpacity>
            ) : null} */}
            <View style={{flex: 0.5}}>{handlingEventStatus()}</View>
            <TouchableOpacity
              style={{flex: 0.5}}
              onPress={() => {
                navigation.navigate('InvoiceFormat', {
                  bookingInfo: orderData,
                });
              }}>
              <Text
                style={{
                  color: '#053879',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium',
                  textAlign: 'center',
                }}>
                <MaterialCommunityIcons
                  name="file-document"
                  size={20}
                  color="#053879"
                />{' '}
                View Invoice
              </Text>
            </TouchableOpacity>
          </View>
          {/* CANCEL EVENT POPUP */}
          <Modal isVisible={isOpenModal}>
            <TouchableOpacity
              onPress={() => setIsOpenModal(false)}
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <AntDesign name="closecircle" size={20} color="white" />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}>
              <ScrollView>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 10,
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Cancellation Policy
                </Text>
                <View style={{marginVertical: 10}}>
                  {Array.from({length: 5}).map((_, index) => (
                    <Text
                      key={index}
                      style={{
                        fontSize: 12,
                        color: 'black',
                        marginVertical: 5,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {index + 1}. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit. In et nibh ac tortor sodales fringilla.
                      Proin ante tortor, posuere vel mi vitae, rhoncus porta mi.
                      Cras quis hendrerit tellus.
                    </Text>
                  ))}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.1}}>
                      <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked(!checked);
                        }}
                      />
                    </View>
                    <View style={{flex: 0.9}}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                          marginTop: 6,
                        }}>
                        By clicking here, I state that I have read and
                        understood the cancellation policy.
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 30,
                      justifyContent: 'space-between',
                      paddingHorizontal: 30,
                    }}>
                    <TouchableOpacity
                      onPress={cancelOrder}
                      style={{
                        backgroundColor: '#ad2b2b',
                        // backgroundColor: '#FFC107',
                        paddingVertical: 10,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Cancel Event
                      </Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      onPress={cancelOrder}
                      style={{
                        backgroundColor: '#cdcdcd',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Reschedule Event
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
          {/* RESCHEDULE EVENT POPUP */}
          <Modal isVisible={openReschedule}>
            <TouchableOpacity
              onPress={() => setOpenReschedule(false)}
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <AntDesign name="closecircle" size={20} color="white" />
            </TouchableOpacity>
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}>
              <ScrollView>
                <Text
                  style={{
                    fontSize: 15,
                    marginTop: 10,
                    color: 'black',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Cancellation Policy
                </Text>
                <View style={{marginVertical: 10}}>
                  {Array.from({length: 5}).map((_, index) => (
                    <Text
                      key={index}
                      style={{
                        fontSize: 12,
                        color: 'black',
                        marginVertical: 5,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {index + 1}. Lorem ipsum dolor sit amet, consectetur
                      adipiscing elit. In et nibh ac tortor sodales fringilla.
                      Proin ante tortor, posuere vel mi vitae, rhoncus porta mi.
                      Cras quis hendrerit tellus.
                    </Text>
                  ))}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.1}}>
                      <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked(!checked);
                        }}
                      />
                    </View>
                    <View style={{flex: 0.9}}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                          marginTop: 6,
                        }}>
                        By clicking here, I state that I have read and
                        understood the cancellation policy.
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 30,
                      justifyContent: 'space-between',
                      paddingHorizontal: 30,
                    }}>
                    <TouchableOpacity
                      onPress={cancelOrder}
                      style={{
                        backgroundColor: '#ad2b2b',
                        // backgroundColor: '#FFC107',
                        paddingVertical: 10,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Cancel Event
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={cancelOrder}
                      style={{
                        backgroundColor: '#cdcdcd',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Reschedule Event
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </Modal>
        </View>
      )}
    </>
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
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white    ',
    borderRadius: 10,
    padding: 10,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
});
