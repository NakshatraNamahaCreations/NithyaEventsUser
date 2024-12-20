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
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
  const navigation = useNavigation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const product = route.params.product;
  const today = moment().format('YYYY-MM-DD');
  console.log('order status>>>>>>>>>>', product.order_status);

  console.log('event name', product.event_name);
  console.log('event start date', product.event_start_date);

  const formatDate = dateString => {
    5;
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  const cart = useSelector(state => state.cart);

  const calculateProductSubtotal = () => {
    return product.product_data.reduce(
      (acc, product) => acc + product.totalPrice,
      0,
    );
  };

  const calculateServiceSubtotal = () => {
    return product.service_data.reduce(
      (acc, service) => acc + service.totalPrice,
      0,
    );
  };

  const calculateGST = subtotal => {
    return subtotal * 0.18; // GST at 18%
  };

  const productTotal = calculateProductSubtotal();
  const serviceTotal = calculateServiceSubtotal();

  const subTotal = productTotal + serviceTotal;

  const gst = calculateGST(subTotal).toFixed(2);
  const total = Number(subTotal) + Number(gst);
  // const grand = total.toFixed(2);
  const calculateTax = gst / 2;

  const showPopup = () => {
    setIsOpenModal(true);
  };

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
  }, [product]);
  console.log('orderData', orderData.order_status);

  const cancelOrder = () => {
    if (checked === false) {
      Alert.alert(
        'Cancellation Policy',
        'Please confirm that you have read and understood the cancellation policy by checking the box before proceeding.',
        [{text: 'OK'}],
      );
    } else {
      navigation.navigate('ReasonForCancel', {bookingInfo: product});
    }
  };

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
                {moment(product.ordered_date).format('lll')}
              </Text>

              {/* <Text
            style={{
              fontSize: 12,
              color: 'green',
              letterSpacing: 1,
              fontFamily: 'Montserrat-Medium',
              // marginBottom: 20,
            }}>
            {product.bookingStatus}
          </Text> */}
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  {product.product_data?.length + product.service_data?.length}{' '}
                  items in this order
                </Text>
              </View>
              <View>
                {product.product_data?.map((item, productIndex) => (
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
                {product.service_data?.map((item, serviceIndex) => (
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
                      {product.cart_total.toFixed(2)}
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
                      {product.number_of_days} Days
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
                      {product.sub_total.toFixed(2)}
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
                      {(product.gst_applied_value / 2).toFixed(2)}
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
                      {(product.gst_applied_value / 2).toFixed(2)}
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
                      {product.paid_amount.toFixed(2)}
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

            {/* <View
          style={{
            borderColor: '#f7f6fd',
            borderWidth: 2,
            marginBottom: 5,
          }}></View> */}
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
                  EVTBX{product._id.slice(-6)}
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
                    {product.event_name}
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
                    {product.payment_method}
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
                    {product.venue_name},
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                    }}>
                    {product.event_location},
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
                    {product.event_date}
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
            {orderData.order_status === 'Order Placed' ? (
              // Show Cancel Order if the order is placed
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={showPopup}
                // onPress={() => {
                //   navigation.navigate('Cancellation Policy', {
                //     bookingInfo: product,
                //   });
                // }}
              >
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
              // Show Return Order if the order is delivered
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={() => {
                  navigation.navigate('Raise Ticket', {
                    order: product.product_data,
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
            ) : // : orderData.order_status === 'Order Returned' ? (
            //   // Show Order Returned if the order has been returned
            //   <Text
            //     style={{
            //       color: '#ad2b2b',
            //       flex: 0.5,
            //       fontSize: 13,
            //       fontFamily: 'Montserrat-Medium',
            //     }}>
            //     Order Returned
            //   </Text>
            // )
            orderData.order_status === 'Order Cancelled' ? (
              // Show Order Cancelled if the order has been Cancelled
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
              // Show Event Started if the event starts today
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
              // Show Event Going to complete if the event ends today
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
            ) : null}

            {/* View Invoice Button (Always Accessible) */}
            <TouchableOpacity
              style={{flex: 0.5}}
              onPress={() => {
                navigation.navigate('InvoiceFormat', {
                  bookingInfo: product,
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
          {/* Policy */}
          <Modal isVisible={isOpenModal}>
            <View
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 20, // Added padding to improve layout
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
                      paddingHorizontal: 50,
                    }}>
                    <TouchableOpacity
                      onPress={() => setIsOpenModal(false)}
                      style={{
                        backgroundColor: '#cdcdcd',
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          textAlign: 'center',
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        Close
                      </Text>
                    </TouchableOpacity>
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
                        Continue
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
});
