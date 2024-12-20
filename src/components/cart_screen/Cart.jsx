import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import withBackgroundColor from './withBackgroundColor';
import CartHeader from './CartHeader';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {Checkbox, RadioButton} from 'react-native-paper';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../state-management/cartSlice';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import {removeFromServiceCart} from '../../state-management/serviceCartSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
// import {Calendar} from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useUserContext} from '../../utilities/UserContext';
import {useAddressContext} from '../../utilities/AddressContext';
import {useDateContext} from '../../utilities/DateSelection';
import TermsNCondition from './TermsNCondition';
import {
  decrementTechQuantity,
  incrementTechQuantity,
  removeTechFromCart,
} from '../../state-management/technicianSlice';

const CartHeaderWithBackground = withBackgroundColor(CartHeader, 'white');

export default function Cart() {
  const navigation = useNavigation();
  const deviceWidth = Dimensions.get('window').width;
  const {userDataFromContext, setUserDataFromContext} = useUserContext();
  const {addressDataContext} = useAddressContext();
  const {dateSelection} = useDateContext();
  // const route = useRoute();
  // const selectedAdd = route.params?.selectedAddress;
  // console.log(
  //   'user data stored in userDataFromContext in cart',
  //   userDataFromContext,
  // );
  console.log('selected Address context api in cart>>', addressDataContext);
  // console.log('dateSelection', dateSelection);
  const cart = useSelector(state => state.cart);
  // console.log('products in cart>>', cart);
  const serviceCart = useSelector(state => state.serviceCart);
  // console.log('services in cart===', serviceCart);
  const techCart = useSelector(state => state.technicianCart);
  // console.log('techCart in  in cart page>>>>>', techCart);
  const [showPolicy, setShowPolicy] = useState(false);
  // const [showAddressList, setShowAddressList] = useState(false);
  const [checked, setChecked] = useState(false);
  // const [selected, setSelected] = useState('');
  const [invitationImage, setInvitationImage] = useState('');
  const [invitationFileName, setInvitationFileName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, EndDate] = useState(null);
  const [datesCount, setDatesCount] = useState(null);
  const [eventname, setEventName] = useState('');
  const [eventaddress, seteventaddress] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [showHallTime, setShowHallTime] = useState(false);
  const [selectedHallTime, setSelectedHallTime] = useState('');
  const [showEventTime, setShowEventTime] = useState(false);
  const [selectedEventTime, setSelectedEventTime] = useState('');
  const [showEventEndTime, setShowEventEndTime] = useState(false);
  const [selectedEventEndTime, setSelectedEventEndTime] = useState('');
  const [gatePassImage, setGatePassImage] = useState('');
  const [gatePassFileName, setGatePassFileName] = useState('');
  const [receivername, setreceivername] = useState('');
  const [receivernumber, setreceivernumber] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  // const [eventAddress, setEventAddress] = useState(null);

  const dispatch = useDispatch();

  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0) +
    (techCart.length > 0 ? techCart.length : 0);

  // const loadStoredData = async () => {
  //   try {
  //     const storedStartDate = await AsyncStorage.getItem('startDate');
  //     const storeddateSelection.EndDate = await AsyncStorage.getItem('dateSelection.endDate');
  //     const numberOfDays = await AsyncStorage.getItem('numberOfDays');

  //     if (storedStartDate !== null) {
  //       setStartDate(storedStartDate);
  //     }
  //     if (storeddateSelection.EndDate !== null) {
  //       setdateSelection.EndDate(storeddateSelection.EndDate);
  //     }
  //     if (numberOfDays !== null) {
  //       setDatesCount(Number(numberOfDays));
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving dates:', error);
  //   }
  // };
  // console.log('datesCount', datesCount);
  // console.log('eventAddress in cart', eventAddress);
  // console.log('dateSelection.endDate', dateSelection.endDate);

  // Use useEffect to load the stored dates when the component mounts
  // useEffect(() => {
  //   loadStoredData(); // Retrieve stored dates on component mount
  // }, []);

  // console.log('startdate', startdate);

  // let totalCart = 5;

  useEffect(() => {
    const getUserData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setUserData(user ? JSON.parse(user) : null);
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };
    getUserData();
  }, []);
  // console.log('userData in cart screen, async storage', userData);

  const openModal = () => setShowPolicy(true);
  const closeModal = () => setShowPolicy(false);

  // hall timing
  const showDatePicker = () => {
    // console.log('Open modal');
    setShowHallTime(true);
  };

  const hideDatePicker = () => {
    setShowHallTime(false);
  };

  const handleConfirm = time => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSelectedHallTime(formattedTime);
    hideDatePicker();
  };
  // ....
  // event start timing
  const openEventTimePicker = () => {
    // console.log('Open modal');
    setShowEventTime(true);
  };

  const hideEventDatePicker = () => {
    setShowEventTime(false);
  };

  const handleConfirmEventTime = time => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSelectedEventTime(formattedTime);
    hideEventDatePicker();
  };
  // .....
  // event end timing
  const openEventEndTimePicker = () => {
    // console.log('Open modal');
    setShowEventEndTime(true);
  };

  const hideEventEndTimePicker = () => {
    setShowEventEndTime(false);
  };

  const handleConfirmEventEndTime = time => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setSelectedEventEndTime(formattedTime);
    hideEventEndTimePicker();
  };

  const resizeImage = async imageUri => {
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      800,
      600,
      'JPEG',
      80,
      0,
    );

    return resizedImage.uri;
  };

  // console.log('startDate', startDate, '-', 'dateSelection.endDate', dateSelection.endDate);

  const uploadInvitation = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setInvitationImage(resizedImageUri);
        setInvitationFileName(fileNAME);
      }
    });
  };

  const uploadGatePass = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setGatePassImage(resizedImageUri);
        setGatePassFileName(fileNAME);
      }
    });
  };

  const calculateProductCarttotal = () => {
    return cart.reduce((acc, product) => acc + product.totalPrice, 0);
  };

  const calculateServiceCarttotal = () => {
    return serviceCart.reduce((acc, service) => acc + service.totalPrice, 0);
  };
  const calculateTechnicianCarttotal = () => {
    return techCart.reduce((acc, tech) => acc + tech.totalPrice, 0);
  };
  const calculateGST = item => {
    return item * 0.18; // GST at 18%
  };

  const productCartTotal = calculateProductCarttotal();
  const serviceCartTotal = calculateServiceCarttotal();
  const techCartTotal = calculateTechnicianCarttotal();
  const cartValue = productCartTotal + serviceCartTotal + techCartTotal;
  const total = cartValue * dateSelection.numberOfDays;
  // console.log('total', total);
  const gst = calculateGST(total);
  const calculateTax = gst / 2; //Total GST
  const subTotal = Number(total) + parseFloat(gst);
  // const grandTotal = Number(total) + Number(gst);
  const tdsDeduction =
    userDataFromContext.company_profile.length > 0 &&
    userDataFromContext?.company_profile[0]?.company_type === 'Self/Others'
      ? 0
      : (2 / 100) * total;
  // console.log('tdsDeduction', tdsDeduction);
  console.log(
    'company_profile',
    userDataFromContext?.company_profile[0]?.company_type,
  );

  const amountAfterTDSDeduction = total - tdsDeduction; //Amount After TDS Deduction

  const grandTotal = amountAfterTDSDeduction + gst;
  // console.log('amountAfterTDSDeduction', amountAfterTDSDeduction);
  // console.log('grandTotal', grandTotal);

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  const closeTooltip = () => {
    if (showTooltip) {
      setShowTooltip(false);
    }
  };
  const imagedata = {
    gatePassImage: gatePassImage,
    gatePassFileName: gatePassFileName,
    invitationImage: invitationImage,
    invitationFileName: invitationFileName,
    eventStartDate: dateSelection.startDate,
    eventEndDate: dateSelection.endDate,
    eventDate: `${dateSelection.startDate} to ${dateSelection.endDate}`,
    numberOfDays: dateSelection.numberOfDays,
    // numberOfDays: dateSelection.datesCount,
    eventname: eventname,
    eventvenue: eventVenue,
    eventaddress: addressDataContext?.selected_region,
    venueHallTime: selectedHallTime,
    eventStartTime: selectedEventTime,
    eventEndTime: selectedEventEndTime,
    receivername: receivername,
    receivernumber: receivernumber,
    cartTotal: cartValue,
    tdsDeduction: tdsDeduction,
    amountAfterTDSDeduction: amountAfterTDSDeduction,
    total: total, //cart + number of days
    gst: gst,
    // subTotal: subTotal,
    grandTotal: grandTotal,
  };
  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

  const agreeToTerms = () => {
    if (checked === false) {
      Alert.alert('Please agree to the terms and conditions');
    } else {
      setShowPolicy(false);
    }
  };
  const preceedCheckout = () => {
    if (
      !eventname ||
      !eventVenue ||
      addressDataContext === null ||
      !receivername ||
      !receivernumber
    ) {
      Alert.alert('Please fill in all the required fields');
    } else if (checked === false) {
      Alert.alert('Please agree to the terms and conditions');
    } else {
      navigation.navigate('Order Summary', {
        imagedata: imagedata,
      });
      // if (
      //   userDataFromContext &&
      //   userDataFromContext?.company_profile?.length === 0
      // ) {
      //   navigation.navigate('CompanyProfile', {
      //     imagedata: imagedata,
      //     hasCheckout: true,
      //   });
      //   // alert('Please add products or services to proceed checkout');
      // } else {
      //   navigation.navigate('Order Summary', {
      //     imagedata: imagedata,
      //   });
      // }
    }
  };

  return (
    <>
      <CartHeaderWithBackground cartSize={totalCart} />
      {cart.length === 0 &&
      serviceCart.length === 0 &&
      techCart.length === 0 ? (
        <View style={styles.emptyCart}>
          <AntDesign name="shoppingcart" size={25} color="#adadad" />
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        </View>
      ) : (
        <>
          <ScrollView>
            <View style={{marginBottom: 4, paddingTop: 5}}>
              {cart.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 2,
                    marginTop: 1,
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View
                      style={{
                        flex: 0.2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        // backgroundColor: '#f5f5f5',
                        // width: 60,
                        // height: 60,
                      }}>
                      <Image
                        style={{
                          width: 60,
                          height: 60,
                          alignSelf: 'center',
                        }}
                        source={{
                          uri: item.imageUrl.replace(/\\/g, '/'),
                        }}
                      />
                    </View>

                    <View style={{flex: 0.6, marginLeft: 12}}>
                      <View style={{paddingTop: 15}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#333',
                            fontFamily: 'Montserrat-SemiBold',
                          }}>
                          {/* {item.productName} */}
                          {item.productName?.length < 55
                            ? item.productName
                            : item.productName?.substring(0, 35) + '...'}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{paddingTop: 7}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 14,
                              fontFamily: 'Montserrat-Medium',
                            }}>
                            <MaterialIcons
                              name="currency-rupee"
                              color="black"
                            />
                            {item.totalPrice}
                            {/* {item.productPrice} */}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{flex: 0.2}}>
                      <TouchableOpacity
                        onPress={() => dispatch(removeFromCart({id: item.id}))}
                        style={{
                          marginTop: 17,
                          marginBottom: 10,
                        }}>
                        <EvilIcons
                          name="trash"
                          size={25}
                          color="#333"
                          style={{textAlign: 'center'}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#7460e4',
                          borderRadius: 5,
                          padding: 3,
                          justifyContent: 'center',
                          marginHorizontal: 5,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.quantity === 1) {
                              dispatch(removeFromCart({id: item.id}));
                            } else {
                              dispatch(decrementQuantity({id: item.id}));
                              // dispatch(updateQuantity({id: item.id, quantity: item.quantity - 1}))
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <AntDesign name="minus" size={17} color="white" />
                        </TouchableOpacity>
                        <View
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                            }}>
                            {item.quantity}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            dispatch(incrementQuantity({id: item.id}))
                          }
                          style={{
                            flexDirection: 'row',
                            alignContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          <AntDesign name="plus" size={17} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              {serviceCart.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 2,
                    marginTop: 1,
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View
                      style={{
                        flex: 0.2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        // backgroundColor: '#f5f5f5',
                        // width: 60,
                        // height: 60,
                      }}>
                      <Image
                        style={{
                          width: 60,
                          height: 60,
                          alignSelf: 'center',
                          borderRadius: 10,
                        }}
                        source={{
                          uri: `${apiUrl.IMAGEURL}${item.storeImage.replace(
                            /\\/g,
                            '/',
                          )}`,
                        }}
                      />
                    </View>

                    <View style={{flex: 0.6, marginLeft: 12}}>
                      <View style={{paddingTop: 15}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#333',
                            fontFamily: 'Montserrat-SemiBold',
                          }}>
                          {/* {item.productName} */}
                          {item.shopName?.length < 55
                            ? item.shopName
                            : item.shopName?.substring(0, 35) + '...'}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{paddingTop: 7}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 14,
                              fontFamily: 'Montserrat-Medium',
                              letterSpacing: 1,
                            }}>
                            <MaterialIcons
                              name="currency-rupee"
                              color="black"
                            />
                            {item.totalPrice}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{flex: 0.2}}>
                      <TouchableOpacity
                        onPress={() =>
                          dispatch(removeFromServiceCart({id: item.id}))
                        }
                        style={{
                          marginTop: 17,
                          marginBottom: 10,
                        }}>
                        <EvilIcons
                          name="trash"
                          size={25}
                          color="#333"
                          style={{textAlign: 'center'}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {techCart.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 2,
                    marginTop: 1,
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <View
                      style={{
                        flex: 0.2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        // backgroundColor: '#f5f5f5',
                        // width: 60,
                        // height: 60,
                      }}></View>

                    <View style={{flex: 0.6, marginLeft: 12}}>
                      <View style={{paddingTop: 15}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: '#333',
                            fontFamily: 'Montserrat-SemiBold',
                          }}>
                          {item.service_name?.length < 55
                            ? item.service_name
                            : item.service_name?.substring(0, 35) + '...'}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <View style={{paddingTop: 7}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 14,
                              fontFamily: 'Montserrat-Medium',
                            }}>
                            <MaterialIcons
                              name="currency-rupee"
                              color="black"
                            />
                            {item.totalPrice}
                            {/* {item.price} */}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{flex: 0.2}}>
                      <TouchableOpacity
                        onPress={() =>
                          dispatch(
                            removeTechFromCart({service_id: item.service_id}),
                          )
                        }
                        style={{
                          marginTop: 17,
                          marginBottom: 10,
                        }}>
                        <EvilIcons
                          name="trash"
                          size={25}
                          color="#333"
                          style={{textAlign: 'center'}}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: 'row',
                          backgroundColor: '#7460e4',
                          borderRadius: 5,
                          padding: 3,
                          justifyContent: 'center',
                          marginHorizontal: 5,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            if (item.quantity === 1) {
                              dispatch(
                                removeTechFromCart({
                                  service_id: item.service_id,
                                }),
                              );
                            } else {
                              dispatch(
                                decrementTechQuantity({
                                  service_id: item.service_id,
                                }),
                              );
                              // dispatch(updateQuantity({id: item.id, quantity: item.quantity - 1}))
                            }
                          }}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <AntDesign name="minus" size={17} color="white" />
                        </TouchableOpacity>
                        <View
                          style={{
                            marginLeft: 5,
                            marginRight: 5,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontFamily: 'Montserrat-SemiBold',
                              fontSize: 13,
                            }}>
                            {item.quantity}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            dispatch(
                              incrementTechQuantity({
                                service_id: item.service_id,
                              }),
                            )
                          }
                          style={{
                            flexDirection: 'row',
                            alignContent: 'flex-end',
                            alignItems: 'center',
                          }}>
                          <AntDesign name="plus" size={17} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={{marginBottom: 5, backgroundColor: 'white', padding: 10}}>
              <Text
                style={{
                  color: '#2c2c2c',
                  fontSize: 14,
                  fontFamily: 'Montserrat-SemiBold',
                  // letterSpacing: 1,
                }}>
                Event details
              </Text>
              <View style={{marginVertical: 10}}>
                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Event Date
                  </Text>
                  <TextInput
                    style={{
                      borderRadius: 10,
                      padding: 5,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                      fontSize: 12,
                    }}
                    value={`${dateSelection.startDate} - ${dateSelection.endDate}`}
                    editable={false}
                  />
                </View>

                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Venue Start Time {asterisk()}
                  </Text>
                  <TouchableOpacity
                    onPress={showDatePicker}
                    style={{
                      borderRadius: 10,
                      padding: 5,
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 12,
                      }}>
                      {selectedHallTime === ''
                        ? 'Select Time'
                        : selectedHallTime}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showHallTime}
                    mode="time"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                  />
                </View>

                {/* ........................ */}
                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Event Start Time {asterisk()}
                  </Text>
                  <TouchableOpacity
                    onPress={openEventTimePicker}
                    style={{
                      borderRadius: 10,
                      padding: 5,
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 12,
                      }}>
                      {selectedEventTime === ''
                        ? 'Select Time'
                        : selectedEventTime}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEventTime}
                    mode="time"
                    onConfirm={handleConfirmEventTime}
                    onCancel={hideEventDatePicker}
                  />
                </View>
                {/* ........................ */}
                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Event End Time {asterisk()}
                  </Text>
                  <TouchableOpacity
                    onPress={openEventEndTimePicker}
                    style={{
                      borderRadius: 10,
                      padding: 5,
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 12,
                      }}>
                      {selectedEventEndTime === ''
                        ? 'Select Time'
                        : selectedEventEndTime}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={showEventEndTime}
                    mode="time"
                    onConfirm={handleConfirmEventEndTime}
                    onCancel={hideEventEndTimePicker}
                  />
                </View>
                {/*  */}
                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Event Name {asterisk()}
                  </Text>
                  <TextInput
                    placeholder="Enter event name"
                    placeholderTextColor="#a3a3a3"
                    onChangeText={text => setEventName(text)}
                    style={{
                      borderRadius: 10,
                      // width: '100%',
                      // height: 50,
                      padding: 5,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                      fontSize: 12,
                      // letterSpacing: 1,
                    }}
                  />
                </View>
                <View style={{marginVertical: 5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      fontSize: 12,
                    }}>
                    Event Venue Name {asterisk()}
                  </Text>
                  <TextInput
                    placeholder="Event Venue"
                    placeholderTextColor="#a3a3a3"
                    onChangeText={text => setEventVenue(text)}
                    style={{
                      borderRadius: 10,
                      // width: '100%',
                      // height: 50,
                      padding: 5,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      paddingLeft: 16,
                      borderColor: '#d7d7d7',
                      borderWidth: 1,
                      marginTop: 5,
                      fontSize: 12,
                      // letterSpacing: 1,
                    }}
                  />
                </View>
                <View style={{marginVertical: 5}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Address List')}>
                    <Text
                      style={{
                        color: 'green',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 15,
                      }}>
                      📍 Select Address {asterisk()}
                    </Text>
                  </TouchableOpacity>
                  {addressDataContext === null ? null : (
                    <View
                      style={{
                        borderRadius: 10,
                        padding: 5,
                        fontFamily: 'Montserrat-Medium',
                        paddingLeft: 16,
                        borderColor: '#d7d7d7',
                        borderWidth: 1,
                        marginTop: 5,
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                          marginVertical: 3,
                          fontSize: 12,
                        }}>
                        {addressDataContext?.selected_region}{' '}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      flex: 0.6,
                      fontSize: 12,
                    }}>
                    Event Invitation
                  </Text>
                  <TouchableOpacity onPress={uploadInvitation}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        // marginLeft: 5,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {invitationFileName ? (
                        invitationFileName
                      ) : (
                        <>
                          <Feather name="upload" size={20} color="black" />{' '}
                          Upload invitation
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 3,
                      flex: 0.6,
                      fontSize: 12,
                    }}>
                    Gate Pass
                  </Text>
                  <TouchableOpacity onPress={uploadGatePass}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        marginLeft: 5,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {gatePassFileName ? (
                        gatePassFileName
                      ) : (
                        <>
                          <Feather name="upload" size={25} color="black" />{' '}
                          Upload gate pass
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    marginVertical: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <View style={{flex: 0.6, marginRight: 2}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 12,
                      }}>
                      Receiver Name {asterisk()}
                    </Text>
                    <TextInput
                      // placeholder="Enter receiver name"
                      placeholderTextColor="#a3a3a3"
                      onChangeText={text => setreceivername(text)}
                      value={receivername}
                      style={{
                        borderRadius: 10,
                        // width: '100%',
                        // height: 50,
                        padding: 5,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        paddingLeft: 16,
                        borderColor: '#d7d7d7',
                        borderWidth: 1,
                        marginTop: 5,
                        fontSize: 12,
                        // letterSpacing: 1,
                      }}
                    />
                  </View>
                  <View style={{flex: 0.6, marginLeft: 2}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginVertical: 3,
                        fontSize: 12,
                      }}>
                      Receiver Mobile Number {asterisk()}
                    </Text>
                    <TextInput
                      // placeholder="Enter receiver Mobilenumber"
                      placeholderTextColor="#a3a3a3"
                      onChangeText={text => setreceivernumber(text)}
                      keyboardType="number-pad"
                      maxLength={10}
                      style={{
                        borderRadius: 10,
                        // width: '100%',
                        // height: 50,
                        padding: 5,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        paddingLeft: 16,
                        borderColor: '#d7d7d7',
                        borderWidth: 1,
                        marginTop: 5,
                        fontSize: 12,
                        // letterSpacing: 1,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: 'white', padding: 10}}>
              {userDataFromContext?.company_profile[0]?.company_type !==
                'Self/Others' && (
                <View>
                  <Text
                    style={{
                      color: 'green',
                      fontFamily: 'Montserrat-Medium',
                      marginVertical: 5,
                    }}>
                    <Feather name="check-circle" color="green" size={15} /> PAN
                    card details has been uploaded successfully
                  </Text>
                </View>
              )}
              <TouchableWithoutFeedback onPress={closeTooltip}>
                <View style={{position: 'relative', zIndex: 1}}>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#eee',
                      padding: 15,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      borderBottomColor: '#e1e1e1',
                      // borderBottomWidth: 2,
                      // backgroundColor: 'white',
                      // elevation: 1,
                    }}>
                    <Text
                      style={{
                        color: '#2c2c2c',
                        fontSize: 14,
                        fontFamily: 'Montserrat-SemiBold',
                        // letterSpacing: 1,
                      }}>
                      Bill details{' '}
                      <TouchableOpacity onPress={toggleTooltip}>
                        <AntDesign name="infocirlce" size={10} color="black" />
                      </TouchableOpacity>
                    </Text>
                  </View>
                  {showTooltip && (
                    <View
                      style={{
                        position: 'absolute', // Tooltip position relative to the icon
                        backgroundColor: '#f0f0f0',
                        padding: 10,
                        borderRadius: 5,
                        top: 40, // Adjust based on your design
                        left: 20, // Adjust based on your design
                        shadowColor: '#000', // Optional: add shadow for better visibility
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                      }}>
                      <Text style={{fontSize: 12, color: '#000'}}>
                        Prices may vary based on the selected event date
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
              <View
                style={{
                  borderWidth: 1,
                  borderTopWidth: 0,
                  padding: 15,
                  borderColor: '#eee',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                      }}>
                      Cart Value
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      {/* <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      /> */}
                      {cartValue.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                      }}>
                      Event Days
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      {dateSelection.numberOfDays} Days
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
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 12,
                      }}>
                      Base Amount
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      {/* <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      /> */}
                      {/* number of days with cart value */}
                      {total.toFixed(2)}
                    </Text>
                  </View>
                </View>
                {userDataFromContext?.company_profile[0]?.company_type !==
                  'Self/Others' && (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}>
                    <View style={{flex: 0.5}}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                          fontSize: 12,
                        }}>
                        TDS Charges (2%)
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text
                        style={{
                          color: 'black',
                          fontFamily: 'Montserrat-Medium',
                          textAlign: 'right',
                          fontSize: 12,
                        }}>
                        -
                        {/* <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      />{" "} */}
                        {tdsDeduction.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                )}
                {userDataFromContext.company_profile.length > 0 &&
                  userDataFromContext.company_profile[0]?.company_type !==
                    'Self/Others' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                      }}>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: 'Montserrat-SemiBold',
                            fontSize: 12,
                          }}>
                          Amount After TDS Deduction
                        </Text>
                      </View>
                      <View style={{flex: 0.5}}>
                        <Text
                          style={{
                            color: 'black',
                            fontFamily: 'Montserrat-SemiBold',
                            textAlign: 'right',
                            fontSize: 12,
                          }}>
                          {/* Amount After TDS Deduction */}
                          {amountAfterTDSDeduction.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                      }}>
                      CGST 9%
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        textAlign: 'right',
                      }}>
                      {/* <MaterialIcons
                        name="currency-rupee"
                        size={14}
                        color="black"
                      /> */}
                      {calculateTax.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                      }}>
                      SGST 9%
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                        textAlign: 'right',
                      }}>
                      {/* <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      /> */}
                      {calculateTax.toFixed(2)}
                    </Text>
                  </View>
                </View>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 12,
                      }}>
                      Sub Total
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      {subTotal.toFixed(2)}
                    </Text>
                  </View>
                </View> */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 12,
                      }}>
                      Total GST (CGST + SGST)
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        textAlign: 'right',
                        fontSize: 12,
                      }}>
                      {gst.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 10,
                  }}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                      }}>
                      Grand Total
                    </Text>
                    {userDataFromContext.company_profile.length > 0 &&
                      userDataFromContext.company_profile[0]?.company_type !==
                        'Self/Others' && (
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
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 13,
                        textAlign: 'right',
                      }}>
                      {' '}
                      <MaterialIcons
                        name="currency-rupee"
                        size={13}
                        color="black"
                      />
                      {grandTotal.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* <View
              style={{
                marginTop: 5,
                marginBottom: 20,
                backgroundColor: 'white',
                paddingLeft: 5,
              }}>
              <View style={{padding: 5}}>
                <Text
                  style={{
                    // textAlign: 'left',
                    fontSize: 13,
                    color: 'green',
                    // textDecorationLine: 'underline',
                    fontFamily: 'Montserrat-SemiBold',
                    // letterSpacing: 1,
                  }}>
                  Terms & Conditions
                </Text>
                <View style={{flexDirection: 'row'}}>
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
                        // textAlign: 'left',
                        color: 'black',
                        // letterSpacing: 1,
                        // textDecorationLine: 'underline',
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 6,
                      }}>
                      {`Once booked service, you will get to chat with vendors/ Celebrities/ DJs/ etc. You will be provided with their managers or PAs numbers. Please DO NOT misuse or engage in shady activities. Your account will be terminated immediately.`.substring(
                        0,
                        79,
                      )}
                    </Text>
                    <TouchableOpacity onPress={openModal}>
                      <Text
                        style={{
                          fontSize: 12,
                          // textAlign: 'left',
                          color: 'black',
                          letterSpacing: 1,
                          textDecorationLine: 'underline',
                          fontFamily: 'Montserrat-SemiBold',
                          marginTop: 6,
                        }}>
                        Read More
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View> */}
          </ScrollView>

          <View
            style={{
              backgroundColor: 'white',
              borderTopColor: '#e1e1e1',
              borderWidth: 1,
              borderColor: 'transparent',
            }}>
            <View
              style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
              <View style={{flex: 0.4}}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 15,
                    // letterSpacing: 1,
                  }}>
                  <MaterialIcons
                    name="currency-rupee"
                    size={14}
                    color="black"
                  />
                  {grandTotal.toFixed(2)}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: '#555',
                    fontFamily: 'Montserrat-Medium',
                    // letterSpacing: 1,
                    // marginTop: 5,
                  }}>
                  Grand Total
                </Text>
              </View>
              <View style={{flex: 0.6}}>
                {checked === false ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#7460e4',
                      padding: 10,
                      borderRadius: 7,
                    }}
                    onPress={openModal}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        textAlign: 'center',
                        fontFamily: 'Montserrat-SemiBold',
                      }}>
                      Terms & Condition
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#7460e4',
                      padding: 10,
                      borderRadius: 7,
                      flexDirection: 'row',
                      alignContent: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={preceedCheckout}
                    // onPress={() => {
                    //   if (
                    //     !alluser?.company_name &&
                    //     !alluser?.company_type &&
                    //     !alluser?.designation
                    //   ) {
                    //     navigation.navigate('Company Details', {
                    //       imagedata: imagedata,
                    //     });
                    //   } else {
                    //     navigation.navigate('Order Summary', {
                    //       imagedata: imagedata,
                    //     });
                    //   }
                    // }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontFamily: 'Montserrat-SemiBold',
                        // letterSpacing: 1,
                      }}>
                      Checkout
                    </Text>
                    <AntDesign
                      style={{marginTop: 4}}
                      name="arrowright"
                      size={15}
                      color="white"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* Terms & Conditions */}
          <Modal
            animationIn="slideInUp"
            isVisible={showPolicy}
            deviceWidth={deviceWidth}
            style={{
              margin: 0,
              position: 'absolute',
              width: '100%',
              backgroundColor: 'white',
              shadowColor: '#000',
              height: '100%',
              // marginTop: '15%',
            }}
            transparent={true}>
            <TouchableOpacity
              style={{position: 'absolute', zIndex: 111, top: 15, left: 7}}
              onPress={closeModal}>
              <Ionicons
                name="arrow-back"
                color={'#7460e4'}
                size={25}
                onPress={closeModal}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 15,
                color: '#7460e4',
                textAlign: 'center',
                padding: 10,
                fontFamily: 'Montserrat-SemiBold',
                marginTop: 5,
              }}>
              TERMS AND CONDITIONS OF USE
            </Text>
            <ScrollView style={styles.container}>
              <TermsNCondition />
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
                      fontSize: 13,
                      color: '#555',
                      fontFamily: 'Montserrat-Medium',
                      marginTop: 10,
                    }}>
                    {`Once booked service, you will get to chat with vendors/ Celebrities/ DJs/ etc. You will be provided with their managers or PAs numbers. Please DO NOT misuse or engage in shady activities. Your account will be terminated immediately.`.substring(
                      0,
                      79,
                    )}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginVertical: 20,
                }}>
                <TouchableOpacity
                  onPress={agreeToTerms}
                  style={{
                    backgroundColor: '#7460e4',
                    padding: 10,
                    borderRadius: 7,
                    elevation: 3,
                    // marginHorizontal: 40,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Continue To Checkout
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        </>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 10,
    // backgroundColor: "#f9f9f9",
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 15,
    color: '#adadad',
    fontFamily: 'Montserrat-Medium',
    marginTop: 10,
  },
  para: {
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    marginVertical: 5,
  },
  header: {
    fontSize: 17,
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    fontFamily: 'Montserrat-SemiBold',
  },
});
