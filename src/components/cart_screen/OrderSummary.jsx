import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import {removeFromCart} from '../../api-services/api-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {clearCart} from '../../state-management/cartSlice';
import {clearServiceCart} from '../../state-management/serviceCartSlice';
import {Modal} from 'react-native-paper';
import MapView, {Marker} from 'react-native-maps';
import {useUserContext} from '../../utilities/UserContext';
import {useAddressContext} from '../../utilities/AddressContext';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  clearTechCart,
  decrementTechQuantity,
  incrementTechQuantity,
  removeTechFromCart,
} from '../../state-management/technicianSlice';

export default function OrderSummary() {
  const navigation = useNavigation();
  const route = useRoute();
  const deviceWidth = Dimensions.get('window').width;
  const [showMessage, setShowMessage] = useState(false);
  const {imagedata} = route.params;
  const {userDataFromContext} = useUserContext();
  const {addressDataContext} = useAddressContext();
  const cart = useSelector(state => state.cart);
  const serviceCart = useSelector(state => state.serviceCart);
  const techCart = useSelector(state => state.technicianCart);
  const dispatch = useDispatch();
  // console.log('cart', cart);
  // console.log('SERVICE>>>', serviceCart);
  console.log('imagedata in ordeer summary page', imagedata);
  const [region, setRegion] = useState({
    latitude: 12.900724675418454,
    longitude: 77.52341310849678,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [vendorMessage, setVendorMessgae] = useState('');

  useEffect(() => {
    if (addressDataContext) {
      setRegion({
        latitude: addressDataContext.latitude,
        longitude: addressDataContext.longitude,
        latitudeDelta: addressDataContext.latitudeDelta,
        longitudeDelta: addressDataContext.longitudeDelta,
      });

      setMarkerPosition({
        latitude: addressDataContext.latitude,
        longitude: addressDataContext.longitude,
      });
    }
  }, [addressDataContext]);

  let todayDate = new Date();
  const handlePay = () => {
    setShowMessage(true);
  };

  // console.log('user from params data ordersummary>>>', userDataFromContext);

  function openLink() {
    const lat = addressDataContext.latitude;
    const lng = addressDataContext.longitude;

    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    Linking.openURL(url).catch(err => console.error('Error opening map:', err));
  }

  // const constructingCart = cart.map((item, index) => ({
  //   ...item,
  //   AindexValue: index + 1,
  //   order_id: item.orderId,
  //   product_id: item.id,
  //   product_image: item.imageUrl,
  //   product_name: item.productName,
  //   store_or_seller: item.store,
  //   product_price: item.productPrice,
  //   applied_quantity: item.quantity,
  //   totalPrice: item.totalPrice,
  //   product_mrp: item.mrpPrice,
  //   receiver_mobilenumber: imagedata.receivernumber,
  //   receiver_name: imagedata.receiver_name,
  //   delivery_address: imagedata.eventaddress,
  //   // cart_value: subtotal,
  //   gst_applied_value: imagedata.gst,
  //   paid_amount: imagedata.total,
  //   payment_method: 'offline',
  //   payment_status: 'success',
  //   order_status: 'Order Placed',
  //   user_id: user?._id,
  //   user_name: user?.name,
  // }));

  // const constructingServiceCart = serviceCart.map((item, index) => ({
  //   ...item,
  //   AindexValue: index + 1,
  //   order_id: item.orderId,
  //   product_id: item.id,
  //   product_image: item.imageUrl,
  //   product_name: item.productName,
  //   store_or_seller: item.store,
  //   product_price: item.productPrice,
  //   applied_quantity: item.quantity,
  //   totalPrice: item.totalPrice,
  //   product_mrp: item.mrpPrice,
  //   receiver_mobilenumber: imagedata.receivernumber,
  //   receiver_name: imagedata.receiver_name,
  //   delivery_address: imagedata.eventaddress,
  //   // cart_value: subtotal,
  //   gst_applied_value: imagedata.gst,
  //   paid_amount: imagedata.total,
  //   payment_method: 'offline',
  //   payment_status: 'success',
  //   order_status: 'Order Placed',
  //   user_id: user?._id,
  //   user_name: user?.name,
  // }));

  // console.log('constructingServiceCart', constructingServiceCart);

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const calculateGST = subtotal => {
    return subtotal * 0.18; // GST at 18%
  };

  const subtotal = calculateSubtotal();
  // console.log('subtotal', subtotal);
  const gst = calculateGST(subtotal).toFixed(2);
  const total = Number(subtotal) + Number(gst);
  const grand = total.toFixed(2);
  // console.log('subtotal', subtotal);
  // console.log('gst', gst / 2);
  // console.log('total', grand);

  // console.log('constructingCart', constructingCart);
  // console.log(moment(new Date()).format('lll'));

  // const proceedToPay = async () => {
  //   try {
  //     const config = {
  //       url: apiUrl.CREATE_ORDER,
  //       method: 'post',
  //       baseURL: apiUrl.BASEURL,
  //       headers: {'Content-Type': 'application/json'},
  //       data: {
  //         product_data: cart,
  //         service_data: serviceCart,
  //         receiver_mobilenumber: imagedata.receivernumber,
  //         receiver_name: imagedata.receiver_name,
  //         delivery_address: imagedata.eventaddress,
  //         gst_applied_value: imagedata.gst,
  //         paid_amount: imagedata.total,
  //         event_name: imagedata.eventname,
  //         event_date: imagedata.eventdate,
  //         upload_gatepass: imagedata.gatePassImage,
  //         upload_invitation: imagedata.invitationImage,
  //         payment_method: 'offline',
  //         payment_status: 'success',
  //         order_status: 'Order Placed',
  //         user_id: user?._id,
  //         user_name: user?.username,
  //         ordered_date: moment(new Date()).format('lll'),
  //       },
  //     };

  //     const response = await axios(config);
  //     if (response.status === 200) {
  //       console.log('Message:', response.data.order);
  //       dispatch(clearCart());
  //       dispatch(clearServiceCart());
  //       navigation.navigate('OrderSuccess');
  //     }
  //   } catch (error) {
  //     console.log('Unknown error:', error);
  //   }
  // };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showPopup = () => {
    setIsModalVisible(true);
  };

  const modifyTheDetails = () => {
    navigation.navigate('Calender');
  };

  const [isLoading, setIsLoading] = useState(false);

  const proceedToPay = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('product_data', JSON.stringify(cart));
      formData.append('service_data', JSON.stringify(serviceCart));
      formData.append('tech_data', JSON.stringify(techCart));
      formData.append('receiver_mobilenumber', imagedata?.receivernumber);
      formData.append('receiver_name', imagedata?.receivername);
      formData.append('event_location', imagedata?.eventaddress);
      formData.append('location_lat', addressDataContext.latitude);
      formData.append('location_long', addressDataContext.longitude);
      formData.append('venue_name', imagedata?.eventvenue);
      formData.append('venue_open_time', imagedata?.venueHallTime);
      formData.append('event_start_time', imagedata?.eventStartTime);
      formData.append('event_end_time', imagedata?.eventEndTime);
      formData.append('base_amount', imagedata?.total);
      formData.append('gst_applied_value', imagedata?.gst);
      formData.append('cart_total', imagedata?.cartTotal);
      formData.append('tds_deduction', imagedata?.tdsDeduction);
      formData.append(
        'amount_after_deduction',
        imagedata?.amountAfterTDSDeduction,
      );
      formData.append('paid_amount', imagedata?.grandTotal);
      formData.append('event_name', imagedata?.eventname);
      formData.append('event_date', imagedata?.eventDate);
      formData.append('event_start_date', imagedata?.eventStartDate);
      formData.append('event_end_date', imagedata?.eventEndDate);
      formData.append('number_of_days', imagedata?.numberOfDays);
      // Check if gatePassImage exists before appending
      if (imagedata?.gatePassImage) {
        formData.append('upload_gatepass', {
          uri: imagedata?.gatePassImage,
          name: imagedata?.gatePassImage.name || 'gatepass.jpg',
          type: imagedata?.gatePassImage.type || 'image/jpeg',
        });
      }

      // Check if invitationImage exists before appending
      if (imagedata?.invitationImage) {
        formData.append('upload_invitation', {
          uri: imagedata?.invitationImage,
          name: imagedata?.invitationImage.name || 'invitation.jpg',
          type: imagedata?.invitationImage.type || 'image/jpeg',
        });
      }

      formData.append('payment_method', 'offline');
      formData.append('payment_status', 'success');
      formData.append('order_status', 'Order Placed');
      formData.append('user_id', userDataFromContext?._id);
      formData.append('user_name', userDataFromContext?.username);
      formData.append('ordered_date', moment(new Date()).format('lll'));
      formData.append('vendors_message', vendorMessage);
      const config = {
        url: apiUrl.CREATE_ORDER,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      };

      const response = await axios(config);
      if (response.status === 200) {
        console.log('Message:', response.data.order);
        dispatch(clearCart());
        dispatch(clearServiceCart());
        dispatch(clearTechCart());
        navigation.navigate('OrderSuccess');
      }
    } catch (error) {
      if (error.response) {
        // The server responded with a status code outside 2xx
        // console.log('Error Response Data:', error.response.data);
        // console.log('Error Response Status:', error.response.status);
        // console.log('Error Response Headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log('Error Request:', error.request._response);
      } else {
        // Something happened in setting up the request
        console.log('Error Message:', error.message);
      }
      console.log('Config:', error.config);
    } finally {
      setIsLoading(false); // Stop loader
    }
  };
  // console.log('addressDataContext', addressDataContext);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <ScrollView style={{marginVertical: 5}}>
        <Text
          style={{
            fontSize: 20,
            padding: 15,
            fontFamily: 'Montserrat-SemiBold',
            color: '#7460e4',
          }}>
          Order Summary
        </Text>
        <View>
          <View style={{padding: 15}}>
            <View>
              {cart.map((item, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
                  <View style={{flex: 0.6}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'left',
                      }}>
                      {item.productName}
                    </Text>
                  </View>
                  <View style={{flex: 0.1}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        textAlign: 'right',

                        fontFamily: 'Montserrat-Medium',
                      }}>
                      X{item.quantity}
                    </Text>
                  </View>
                  <View style={{flex: 0.3}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        textAlign: 'right',
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
            <View>
              {serviceCart.map((item, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
                  <View style={{flex: 0.6}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'left',
                      }}>
                      {item.shopName}
                    </Text>
                  </View>
                  <View style={{flex: 0.1}}></View>
                  <View style={{flex: 0.3}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        textAlign: 'right',

                        fontFamily: 'Montserrat-Medium',
                      }}>
                      <MaterialIcons
                        name="currency-rupee"
                        // size={13}
                        color="#3c4145"
                      />
                      {item.pricing}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View>
              {techCart.map((item, index) => (
                <View
                  key={index}
                  style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
                  <View style={{flex: 0.6}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'left',
                      }}>
                      {item.service_name}
                    </Text>
                  </View>
                  <View style={{flex: 0.1}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        textAlign: 'right',

                        fontFamily: 'Montserrat-Medium',
                      }}>
                      X{item.quantity}
                    </Text>
                  </View>
                  <View style={{flex: 0.3}}>
                    <Text
                      style={{
                        color: '#3c4145',
                        fontSize: 14,
                        textAlign: 'right',
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
          <View
            style={{
              borderWidth: 1,
              borderColor: '#e2e2e2',
              borderStyle: 'dashed',
              marginBottom: 15,
            }}></View>
          <View style={{padding: 15}}>
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Total
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',

                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {imagedata.cartTotal?.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Event Days
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  {imagedata?.numberOfDays} Day
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
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Base Amount
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {imagedata?.total.toFixed(2)}
                </Text>
              </View>
            </View>
            {userDataFromContext?.company_profile[0]?.company_type !==
              'Others' && (
              <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
                <View style={{flex: 0.6}}>
                  <Text
                    style={{
                      color: '#3c4145',
                      fontSize: 14,
                      textAlign: 'left',
                      // letterSpacing: 1,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    TDS Charges (2%)
                  </Text>
                </View>

                <View style={{flex: 0.4}}>
                  <Text
                    style={{
                      color: '#3c4145',
                      fontSize: 14,
                      textAlign: 'right',
                      // letterSpacing: 1,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    <MaterialIcons
                      name="currency-rupee"
                      // size={13}
                      color="#3c4145"
                    />
                    {imagedata?.tdsDeduction.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
            {userDataFromContext?.company_profile[0]?.company_type !==
              'Others' && (
              <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
                <View style={{flex: 0.6}}>
                  <Text
                    style={{
                      color: '#3c4145',
                      fontSize: 14,
                      textAlign: 'left',
                      // letterSpacing: 1,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    Amount After TDS Deduction
                  </Text>
                </View>

                <View style={{flex: 0.4}}>
                  <Text
                    style={{
                      color: '#3c4145',
                      fontSize: 14,
                      textAlign: 'right',
                      // letterSpacing: 1,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    <MaterialIcons
                      name="currency-rupee"
                      // size={13}
                      color="#3c4145"
                    />
                    {imagedata?.amountAfterTDSDeduction.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  CGST 9%
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {(imagedata?.gst / 2).toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  SGST 9%
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {(imagedata?.gst / 2).toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Total GST (CGST + SGST)
                </Text>
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 14,
                    textAlign: 'right',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {imagedata?.gst.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1, marginBottom: 10}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 16,
                    textAlign: 'left',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Grand Total
                </Text>
                {userDataFromContext.company_profile[0]?.company_type !==
                  'Others' && (
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 11,
                    }}>
                    (GST and TDS Deduction)
                  </Text>
                )}
              </View>

              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    color: '#3c4145',
                    fontSize: 16,
                    textAlign: 'right',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    // size={13}
                    color="#3c4145"
                  />
                  {imagedata?.grandTotal?.toFixed(2)}
                  {/* {total}.00 */}
                </Text>
              </View>
            </View>
          </View>
          <View style={{padding: 15}}>
            <Text
              style={{
                color: '#7460e4',
                fontSize: 17,
                textAlign: 'left',
                marginBottom: 10,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              Event Details{' '}
            </Text>

            <MapView
              style={{
                width: '100%',
                height: 200,
              }}
              region={region}
              showsUserLocation>
              {markerPosition && (
                <Marker coordinate={markerPosition} title="Selected Location" />
              )}
            </MapView>

            <Text
              style={{
                color: 'black',
                fontSize: 15,
                textAlign: 'left',
                marginVertical: 5,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              {imagedata?.eventname}
            </Text>

            <Text
              style={{
                color: '#6e7a83',
                fontSize: 13,
                marginTop: 5,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              🏢 {imagedata?.eventvenue}
            </Text>
            <TouchableOpacity onPress={openLink}>
              <Text
                style={{
                  color: '#6e7a83',
                  fontSize: 13,
                  marginTop: 10,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                📍
                {/* <Ionicons name="location-sharp" color="#6e7a83" size={18} /> */}
                {imagedata?.eventaddress}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                textAlign: 'left',
                marginTop: 10,
                fontFamily: 'Montserrat-Medium',
              }}>
              📅 {imagedata?.eventDate} at ⏰ {imagedata?.eventStartTime} to{' '}
              {imagedata?.eventEndTime}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 6,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                }}>
                <FontAwesome5 name="user-tie" color="black" size={13} />{' '}
                {imagedata?.receivername}
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginTop: 6,
                  marginLeft: 10,
                }}>
                <Ionicons name="call" color="black" size={13} /> +91-
                {imagedata?.receivernumber}
              </Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{width: 100, height: 100, marginRight: 10}}>
                <Image
                  source={
                    imagedata?.gatePassImage
                      ? {uri: imagedata?.gatePassImage}
                      : require('../../../assets/default-fallback-image.png') // Local fallback image
                  }
                  style={{width: '100%', height: 100, resizeMode: 'contain'}}
                />
              </View>
              <View style={{width: 100, height: 100}}>
                <Image
                  source={
                    imagedata?.invitationImage
                      ? {uri: imagedata?.invitationImage}
                      : require('../../../assets/default-fallback-image.png') // Local fallback image
                  }
                  style={{width: '100%', height: 100, resizeMode: 'contain'}}
                />
              </View>
            </View>
            <View style={{marginTop: 5}}>
              <Text
                style={{
                  color: '#7460e4',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginTop: 6,
                }}>
                Enter your message to vendor's (Optional)
              </Text>
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#b7b4b4',
                  color: 'black',
                  fontSize: 13,
                  padding: 10,
                  marginBottom: 10,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor="#a1a1a1"
                placeholder="Start write..."
                multiline
                numberOfLines={4}
                // maxLength={40}
                value={vendorMessage}
                onChangeText={message => setVendorMessgae(message)}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            marginTop: 20,
            backgroundColor: '#7460e4',
            padding: 15,
            borderRadius: 5,
            marginBottom: 20,
            marginHorizontal: 50,
            elevation: 1,
          }}
          onPress={showPopup}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
            }}>
            Proceed to Pay ₹ {imagedata?.grandTotal?.toFixed(2)}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            position: 'relative',
            bottom: 0,
            width: '100%',
            padding: 15,
          }}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <View style={{flex: 0.8}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 13,
                  // letterSpacing: 1,
                }}>
                Safe, easy and secure Payments
              </Text>
            </View>
            <View style={{flex: 0.2}}>
              <Image
                source={require('../../../assets/icons8-magnetic-card-48.png')}
                style={{width: 55, height: 55}}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal visible={isModalVisible}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 5,
          }}>
          <AntDesign
            onPress={() => setIsModalVisible(false)}
            name="closecircle"
            color="black"
            size={23}
          />
        </TouchableOpacity>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 5,
            paddingVertical: 10,
            marginHorizontal: 10,
            paddingHorizontal: 20, // Added padding to improve layout
          }}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Montserrat-SemiBold',
              color: 'black',
              marginTop: 10,
              marginBottom: 10, // Added margin bottom for spacing
            }}>
            Setup & Rehearsal
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'Montserrat-Medium',
              color: 'black',
              textAlign: 'center', // Centered text for better alignment
              marginBottom: 20, // Added margin bottom for spacing
            }}>
            Please ensure the selected date ({imagedata?.eventDate}) is correct.
            Otherwise you may modify the date if needed.
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                marginVertical: 10,
              }}
              onPress={modifyTheDetails}>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                  backgroundColor: '#f0f0f0', // Added background color for button
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderRadius: 5, // Added border radius for button
                }}>
                Modify
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginHorizontal: 5,
                marginVertical: 10,
                backgroundColor: '#7460e4', // Added background color for button
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 5, // Added border radius for button
              }}
              onPress={!isLoading ? proceedToPay : null}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" /> // Show loader
              ) : (
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'white',
                  }}>
                  Yes! Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
