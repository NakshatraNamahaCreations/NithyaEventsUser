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
import React, {useState, useEffect} from 'react';
import Modal from 'react-native-modal';
import withBackgroundColor from './withBackgroundColor';
import CartHeader from './CartHeader';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Calendar} from 'react-native-calendars';

const CartHeaderWithBackground = withBackgroundColor(CartHeader, 'white');

export default function Reschedule() {
  const navigation = useNavigation();
  const deviceWidth = Dimensions.get('window').width;
  const {userDataFromContext} = useUserContext();
  const {addressDataContext} = useAddressContext();
  const {dateSelection} = useDateContext();
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  // const route = useRoute();
  // const selectedAdd = route.params?.selectedAddress;
  // console.log(
  //   'user data stored in userDataFromContext in cart',
  //   userDataFromContext,
  // );
  console.log('selected Address context api in cart>>', addressDataContext);
  console.log('dateSelection', dateSelection);
  const cart = useSelector(state => state.cart);
  // console.log('products in cart>>', cart);
  const serviceCart = useSelector(state => state.serviceCart);
  console.log('services in cart===', serviceCart);
  const [showPolicy, setShowPolicy] = useState(false);
  // const [showAddressList, setShowAddressList] = useState(false);
  const [checked, setChecked] = useState(false);
  // const [selected, setSelected] = useState('');
  const [invitationImage, setInvitationImage] = useState('');
  const [invitationFileName, setInvitationFileName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [datesCount, setDatesCount] = useState(null);
  const [eventname, setEventName] = useState('');
  const [eventaddress, seteventaddress] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [googlemaplink, setgooglemaplink] = useState('');
  const [showHallTime, setShowHallTime] = useState(false);
  const [selectedHallTime, setSelectedHallTime] = useState('');
  const [showEventTime, setShowEventTime] = useState(false);
  const [selectedEventTime, setSelectedEventTime] = useState('');
  const [disabledDate, setDisabledDate] = useState({});

  const [showEventEndTime, setShowEventEndTime] = useState(false);
  const [selectedEventEndTime, setSelectedEventEndTime] = useState('');
  const [isRangeSelection, setIsRangeSelection] = useState(true);
  const [gatePassImage, setGatePassImage] = useState('');
  const [gatePassFileName, setGatePassFileName] = useState('');
  const [receivername, setreceivername] = useState('');
  const [receivernumber, setreceivernumber] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [eventAddress, setEventAddress] = useState(null);

  const dispatch = useDispatch();

  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0);

  const openModal = () => setShowPolicy(true);
  const closeModal = () => setShowPolicy(false);

  // hall timing
  const showDatePicker = () => {
    console.log('Open modal');
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
    console.log('Open modal');
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
    console.log('Open modal');
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
        console.log('Gellery image:', response);
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

  const calculateGST = item => {
    return item * 0.18; // GST at 18%
  };

  const numberOfDays = getNumberOfSelectedDates(startDate, endDate);

  const productCartTotal = calculateProductCarttotal();
  const serviceCartTotal = calculateServiceCarttotal();
  const cartTotal = productCartTotal + serviceCartTotal;
  const subTotal = cartTotal * dateSelection.numberOfDays;
  // console.log('subTotal', subTotal);
  const gst = calculateGST(subTotal).toFixed(2);
  const grandTotal = Number(subTotal) + Number(gst);
  const calculateTax = gst / 2;
  // console.log('calculateTax', calculateTax);
  // console.log('total', grand);

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
    cartTotal: cartTotal,
    subTotal: subTotal,
    gst: gst,
    grandTotal: grandTotal,
  };
  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

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
      if (
        userDataFromContext &&
        userDataFromContext?.company_profile?.length === 0
      ) {
        navigation.navigate('CompanyProfile', {
          imagedata: imagedata,
          hasCheckout: true,
        });
        // alert('Please add products or services to proceed checkout');
      } else {
        navigation.navigate('Order Summary', {
          imagedata: imagedata,
        });
      }
    }
  };
  const today = moment().format('YYYY-MM-DD');
  const enableCalendar = () => setIsCalendarVisible(!isCalendarVisible);

  const calculateDisabledDates = () => {
    let disabledDates = {};
    let date = moment().subtract(1, 'year'); // Start from yesterday

    // Loop to disable all dates before today
    while (date.isBefore(today, 'day')) {
      disabledDates[date.format('YYYY-MM-DD')] = {
        disabled: true,
        disableTouchEvent: true,
        color: '#f3f3f3', // Gray color for past dates
      };
      date = date.add(1, 'days'); // Move to the next day
    }
    return disabledDates;
  };

  useEffect(() => {
    const disabledDates = calculateDisabledDates();
    setDisabledDate(disabledDates);
  }, []);

  const handleDayPress = day => {
    if (isRangeSelection) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(day.dateString); // Set start date
        setEndDate(null); // Reset end date for new selection
      } else if (startDate && !endDate) {
        const start = new Date(startDate);
        const end = new Date(day.dateString);
        if (end > start) {
          setEndDate(day.dateString); // Valid range, set end date
        } else {
          // If selected date is before the start date, reset the range
          setStartDate(day.dateString);
          setEndDate(null);
        }
      }
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };
  const getMarkedDates = () => {
    let markedDates = {...disabledDate};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }

    if (startDate && endDate) {
      let currentDate = new Date(startDate);
      let endDateObj = new Date(endDate);

      while (currentDate <= endDateObj) {
        let dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== startDate && dateString !== endDate) {
          markedDates[dateString] = {
            color: '#70d7c7',
            textColor: 'white',
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  const handleSave = async () => {
    if (!startDate) {
      Alert.alert('Message', 'Please select a date');
    } else {
      try {
        const selectedDates = {
          startDate,
          endDate: endDate || startDate,
          numberOfDays,
        };
        // setDateSelection(selectedDates);
        setIsCalendarVisible(false);
      } catch (error) {
        console.error('Error saving dates:', error);
      }
    }
  };

  return (
    <>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row', // Ensures both items are in the same row
            alignItems: 'center', // Align items vertically in the center
            padding: 10,
            backgroundColor: 'white',
            // elevation: 3,
          }}>
          <Ionicons
            style={{flex: 0.1}} // Add margin to create space between the icon and the search bar
            name="chevron-back"
            color="black"
            size={25}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              color: 'black',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            }}>
            {' '}
            Reschedule
          </Text>
        </View>
        <View style={{marginBottom: 5, backgroundColor: 'white', padding: 10}}>
          <Text
            style={{
              color: '#2c2c2c',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
            }}>
            Event details
          </Text>
          <Text
            style={{
              color: '#2c2c2c',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
            }}>
            Select Date
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
                Venue Hall Time {asterisk()}
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
                  {selectedHallTime === '' ? 'Select Time' : selectedHallTime}
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
                  {selectedEventTime === '' ? 'Select Time' : selectedEventTime}
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
                    fontSize: 13,
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
                // borderBottomColor: '#d7d7d7',
                // borderBottomWidth: 1,
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
                      <Feather name="upload" size={20} color="black" /> Upload
                      invitation
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
                      <Feather name="upload" size={25} color="black" /> Upload
                      gate pass
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

                    fontSize: 13,
                  }}>
                  Total
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
                  <MaterialIcons
                    name="currency-rupee"
                    size={13}
                    color="black"
                  />
                  {cartTotal.toFixed(2)}
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
                  <MaterialIcons
                    name="currency-rupee"
                    size={13}
                    color="black"
                  />
                  {subTotal.toFixed(2)}
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
                  <MaterialIcons
                    name="currency-rupee"
                    size={14}
                    color="black"
                  />
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
                  <MaterialIcons
                    name="currency-rupee"
                    size={13}
                    color="black"
                  />
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
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 13,
                  }}>
                  Grand Total
                </Text>
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
        <View
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
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: 'white',
          borderTopColor: '#e1e1e1',
          borderWidth: 1,
          borderColor: 'transparent',
        }}>
        <View style={{flexDirection: 'row', padding: 10, alignItems: 'center'}}>
          <View style={{flex: 0.4}}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 15,
                // letterSpacing: 1,
              }}>
              <MaterialIcons name="currency-rupee" size={14} color="black" />
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
            <TouchableOpacity
              style={{
                backgroundColor: '#9a9a9a',
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
                  color: 'black',
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
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isCalendarVisible}
        onRequestClose={() => setIsCalendarVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Select Event Dates
              {/* Choose a {isRangeSelection ? 'Date Range' : 'Date'} */}
            </Text>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              // markingType={isRangeSelection ? 'period' : 'simple'}
              markingType="period"
              theme={{
                selectedDayBackgroundColor: '#e8d94b',
                selectedDayTextColor: 'white',
                todayTextColor: 'black',
                dayTextColor: 'black',
                textDisabledColor: 'grey',
                arrowColor: 'black',
                monthTextColor: 'black',
                indicatorColor: 'blue',
                todayBackgroundColor: '#e8d94b',
              }}
              style={styles.calendar}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
    color: 'black',
  },
  confirmButton: {
    backgroundColor: '#e8d94b',
    padding: 10,
    borderRadius: 50,
    width: '100%',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 14,
  },
});
