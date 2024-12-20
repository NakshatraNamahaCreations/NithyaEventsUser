import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useAddressContext} from '../../utilities/AddressContext';
import ImageResizer from 'react-native-image-resizer';
import * as ImagePicker from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import {useUserContext} from '../../utilities/UserContext';

const Reschedule = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const events = route.params.bookingInfo;
  const {userDataFromContext} = useUserContext();
  const {addressDataContext} = useAddressContext();
  // console.log('addressDataContext', addressDataContext);

  const [isRangeSelection, setIsRangeSelection] = useState(true);
  const [startDate, setStartDate] = useState(events.event_start_date);
  const [endDate, setEndDate] = useState(events.event_end_date);
  const [disabledDate, setDisabledDate] = useState({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [showHallTime, setShowHallTime] = useState(false);
  const [selectedHallTime, setSelectedHallTime] = useState(
    events.venue_open_time,
  );
  const [showEventTime, setShowEventTime] = useState(false);
  const [selectedEventTime, setSelectedEventTime] = useState(
    events.event_start_time,
  );
  const [showEventEndTime, setShowEventEndTime] = useState(false);
  const [selectedEventEndTime, setSelectedEventEndTime] = useState(
    events.event_end_time,
  );
  const [eventname, setEventName] = useState(events.event_name);
  const [eventVenue, setEventVenue] = useState(events.venue_name);
  const [invitationImage, setInvitationImage] = useState('');
  const [invitationFileName, setInvitationFileName] = useState('');
  const [gatePassImage, setGatePassImage] = useState('');
  const [gatePassFileName, setGatePassFileName] = useState('');
  const [receivername, setreceivername] = useState(events.receiver_name);
  const [receivernumber, setreceivernumber] = useState(
    events.receiver_mobilenumber,
  );
  const [showTooltip, setShowTooltip] = useState(false);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  // const numberOfDays = getNumberOfSelectedDates(startDate, endDate);
  const [dateObj, setDateObj] = useState(null);
  const numberOfDays = events.number_of_days;

  const calculateDisabledDates = () => {
    let disabledDates = {};
    let today = moment().format('YYYY-MM-DD');

    // Disable all dates before today
    let date = moment().subtract(1, 'year');
    while (date.isBefore(today, 'day')) {
      disabledDates[date.format('YYYY-MM-DD')] = {
        disabled: true,
        disableTouchEvent: true,
        color: '#f3f3f3',
      };
      date = date.add(1, 'days');
    }

    return disabledDates;
  };

  const handleDayPress = day => {
    const selectedStartDate = moment(day.dateString);

    if (selectedStartDate.isBefore(moment().format('YYYY-MM-DD'))) {
      return; // Ignore invalid selections
    }

    // Update startDate and calculate endDate
    setStartDate(selectedStartDate.format('YYYY-MM-DD'));
    const calculatedEndDate = selectedStartDate.add(numberOfDays - 1, 'days');
    setEndDate(calculatedEndDate.format('YYYY-MM-DD'));
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
      let currentDate = moment(startDate);
      let endDateObj = moment(endDate);

      while (currentDate.isBefore(endDateObj, 'day')) {
        currentDate = currentDate.add(1, 'day');
        markedDates[currentDate.format('YYYY-MM-DD')] = {
          color: '#70d7c7',
          textColor: 'white',
        };
      }
    }

    return markedDates;
  };

  const getNumberOfSelectedDates = (startDate, endDate) => {
    if (!startDate) {
      return 0;
    }
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - start;

    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays === 0 ? 1 : diffDays + 1;
  };

  const handleSave = async () => {
    if (!startDate) {
      Alert.alert('Message', 'Please select a start date.');
    } else {
      try {
        const selectedDates = {
          startDate,
          endDate,
          numberOfDays,
        };
        setDateObj(selectedDates);
        setIsCalendarVisible(false);
      } catch (error) {
        console.error('Error saving dates:', error);
      }
    }
  };

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

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
  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
  };
  const closeTooltip = () => {
    if (showTooltip) {
      setShowTooltip(false);
    }
  };

  console.log('location_lat:', addressDataContext);

  const proceedToReschedule = async () => {
    setLoading(true);
    if (addressDataContext === null || !remark) {
      Alert.alert(
        'Please check a location and add a remark before proceeding to reschedule',
      );
    } else {
      try {
        const formData = new FormData();
        formData.append('receiver_mobilenumber', receivernumber);
        formData.append('receiver_name', receivername);
        formData.append(
          'event_location',
          addressDataContext === null
            ? events.event_location
            : addressDataContext?.selected_region,
        );
        formData.append('location_lat', addressDataContext.latitude);
        formData.append('location_long', addressDataContext.longitude);
        // formData.append(
        //   'location_lat',
        //   addressDataContext === null
        //     ? parseFloat(events.location_lat?.toString() || events.location_lat)
        //     : addressDataContext.latitude,
        // );

        // formData.append(
        //   'location_long',
        //   addressDataContext === null
        //     ? parseFloat(events.location_long?.toString() || events.location_long)
        //     : addressDataContext.longitude,
        // );
        formData.append('venue_name', eventVenue);
        formData.append('venue_open_time', selectedHallTime);
        formData.append('event_start_time', selectedEventTime);
        formData.append('event_end_time', selectedEventEndTime);
        formData.append('event_name', eventname);
        formData.append('event_date', `${startDate} to ${endDate}`);
        formData.append('event_start_date', startDate);
        formData.append('event_end_date', endDate);
        formData.append('reschedule_remark', remark);
        if (gatePassImage) {
          formData.append('upload_gatepass', {
            uri: gatePassImage,
            name: gatePassImage.name || 'gatepass.jpg',
            type: gatePassImage.type || 'image/jpeg',
          });
        }

        if (invitationImage) {
          formData.append('upload_invitation', {
            uri: invitationImage,
            name: invitationImage.name || 'invitation.jpg',
            type: invitationImage.type || 'image/jpeg',
          });
        }

        formData.append('order_status', 'Order Rescheduled');
        formData.append('rescheduled_date', moment(new Date()).format('lll'));

        const config = {
          url: `${apiUrl.RESCHEDULE_ORDER}${events._id}`,
          method: 'put',
          baseURL: apiUrl.BASEURL,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: formData,
        };

        const response = await axios(config);
        if (response.status === 200) {
          // console.log('Message:', response.data.order);
          Alert.alert('Event Rescheduled!!!');
          navigation.navigate('OrderSuccess');
        }
      } catch (error) {
        console.log('error', error);
        // if (error.response) {
        //   // The server responded with a status code outside 2xx
        //   console.log('Error Response Data:', error.response.data);
        //   // console.log('Error Response Status:', error.response.status);
        //   // console.log('Error Response Headers:', error.response.headers);
        // } else if (error.request) {
        //   // The request was made but no response was received
        //   console.log('Error Request:', error.request._response);
        // } else {
        //   // Something happened in setting up the request
        //   console.log('Error Message:', error.message);
        // }
        // console.log('Config:', error.config);
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <View style={{backgroundColor: 'white', padding: 10, height: '100%'}}>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row', // Ensures both items are in the same row
            alignItems: 'center', // Align items vertically in the center
            marginTop: 5,
          }}>
          <Ionicons
            style={{flex: 0.1}} // Add margin to create space between the icon and the search bar
            name="chevron-back"
            color="black"
            size={20}
            onPress={() => navigation.goBack()}
          />
          <Text
            style={{
              color: 'black',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 16,
            }}>
            Reschedule
          </Text>
        </View>
        {events.product_data?.map((item, index) => (
          <View
            key={item.id}
            style={{
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 2,
              marginVertical: 10,
            }}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                  }}
                  source={{uri: item.imageUrl}}
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
                    {item.productName?.length < 55
                      ? item.productName
                      : item.productName?.substring(0, 35) + '...'}
                  </Text>
                </View>
                <View style={{paddingTop: 7}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    <MaterialIcons name="currency-rupee" color="black" />
                    {item.productPrice}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  flex: 0.2,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                  }}>
                  x{item.quantity}
                </Text>
              </View>
            </View>
          </View>
        ))}
        {events.service_data.map((item, index) => (
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
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}
                  source={{
                    uri: item.storeImage,
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
                        fontSize: 12,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      <MaterialIcons name="currency-rupee" color="black" />
                      {item.totalPrice}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
        {events.tech_data?.map((item, index) => (
          <View
            key={item.service_id}
            style={{
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 2,
              marginVertical: 10,
            }}>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              {/* <View
                style={{
                  flex: 0.2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Image
                  style={{
                    width: 60,
                    height: 60,
                    alignSelf: 'center',
                  }}
                  source={{uri: item.imageUrl}}
                />
              </View> */}

              <View style={{flex: 0.8, marginLeft: 12}}>
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
                <View style={{paddingTop: 7}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    <MaterialIcons name="currency-rupee" color="black" />
                    {item.totalPrice}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginLeft: 5,
                  marginRight: 5,
                  flex: 0.2,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                  }}>
                  x{item.quantity}
                </Text>
              </View>
            </View>
          </View>
        ))}
        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: '#2c2c2c',
              fontSize: 14,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Event details
          </Text>
          <View>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                marginVertical: 5,
                fontSize: 12,
              }}>
              Select Event Date
            </Text>
            <TouchableOpacity
              style={{marginTop: 5}}
              onPress={() => setIsCalendarVisible(true)}>
              <TextInput
                style={{
                  borderRadius: 10,
                  padding: 5,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                  paddingLeft: 16,
                  borderColor: '#d7d7d7',
                  borderWidth: 1,
                  fontSize: 12,
                }}
                // value={`${startDate ? startDate : ''} - ${
                //   endDate ? endDate : startDate ? startDate : ''
                // }`}
                value={`${
                  dateObj ? dateObj?.startDate : events.event_start_date
                } - ${
                  dateObj
                    ? dateObj?.endDate
                    : dateObj?.startDate
                    ? dateObj?.startDate
                    : events.event_end_date
                }`}
                editable={false}
              />
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: 5}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                marginVertical: 3,
                fontSize: 12,
              }}>
              Venue Hall Time
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
              Event Start Time
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
              Event End Time
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
              Event Name
            </Text>
            <TextInput
              placeholder="Enter event name"
              placeholderTextColor="#a3a3a3"
              value={eventname}
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
              Event Venue Name
            </Text>
            <TextInput
              placeholder="Event Venue"
              placeholderTextColor="#a3a3a3"
              value={eventVenue}
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
                  {addressDataContext === null
                    ? events.event_location
                    : addressDataContext?.selected_region}
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
            <TouchableOpacity
              style={{flex: 0.6, alignItems: 'flex-end'}}
              onPress={uploadInvitation}>
              {invitationFileName ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 12,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {invitationFileName}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    <Feather name="upload" size={20} color="black" /> Upload
                    invitation
                  </Text>
                </>
              )}
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

            <TouchableOpacity
              style={{flex: 0.6, alignItems: 'flex-end'}}
              onPress={uploadGatePass}>
              {gatePassFileName ? (
                <Text
                  style={{
                    color: 'black',
                    fontSize: 12,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {gatePassFileName}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    <Feather name="upload" size={20} color="black" /> Upload
                    gate pass
                  </Text>
                </>
              )}
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
                Receiver Name
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
                Receiver Mobile Number
              </Text>
              <TextInput
                placeholderTextColor="#a3a3a3"
                value={receivernumber}
                onChangeText={text => setreceivernumber(text)}
                keyboardType="number-pad"
                maxLength={10}
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
              />
            </View>
          </View>
          <View style={{marginVertical: 5}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                marginVertical: 3,
                fontSize: 12,
              }}>
              Reason for Rescheduling {asterisk()}
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Enter the reason"
              placeholderTextColor="gray"
              textAlignVertical="top"
              onChangeText={text => setRemark(text)}
              style={{
                borderWidth: 1,
                borderColor: '#c6c6c6',
                color: 'black',
                borderRadius: 5,
                padding: 10,
                marginTop: 5,
                fontSize: 12,
              }}
            />
          </View>
        </View>
        <View style={{padding: 10}}>
          <TouchableWithoutFeedback onPress={closeTooltip}>
            <View style={{position: 'relative', zIndex: 1}}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#d7d7d7',
                  padding: 15,
                  borderStyle: 'dashed',
                  // borderTopLeftRadius: 10,
                  // borderTopRightRadius: 10,
                  borderBottomColor: '#d7d7d7',
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
              borderStyle: 'dashed',
              // borderBottomColor: '#d7d7d7',
              // borderBottomRightRadius: 10,
              // borderBottomLeftRadius: 10,
              padding: 15,
              borderColor: '#d7d7d7',
            }}>
            {/* <View
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
                  {events?.cart_total.toFixed(2)}
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
                  {events?.number_of_days} Days
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
                events?.sub_total.toFixed(2)
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
                  {(events?.gst_applied_value / 2).toFixed(2)}
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
                  {(events?.gst_applied_value / 2).toFixed(2)}
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
                  {events.paid_amount.toFixed(2)}
                </Text>
              </View>
            </View> */}
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
                    {events?.cart_total?.toFixed(2)}
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
                    {events?.number_of_days} Days
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
                    Base Amount
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
                    {events?.base_amount?.toFixed(2)}
                  </Text>
                </View>
              </View>
              {userDataFromContext?.company_profile[0]?.company_type !==
                'Others' && (
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
                      TDS Charges (2%)
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
                      {events?.tds_deduction?.toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              {userDataFromContext?.company_profile[0]?.company_type !==
                'Others' && (
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
                      Amount After TDS Deduction
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
                      {events?.amount_after_deduction?.toFixed(2)}
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
                    {(events?.gst_applied_value / 2)?.toFixed(2)}
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
                    {(events?.gst_applied_value / 2)?.toFixed(2)}
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
                    {events?.paid_amount?.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={loading ? null : proceedToReschedule}
          style={{
            backgroundColor: '#7460e4',
            marginHorizontal: 50,
            marginBottom: 10,
            borderRadius: 10,
            paddingVertical: 10,
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 15,
              textAlign: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 15,
                  textAlign: 'center',
                }}>
                Proceed to Reschedule
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isCalendarVisible}
        onRequestClose={() => setIsCalendarVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              width: '80%',
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Montserrat-SemiBold',
                marginBottom: 20,
                color: 'black',
              }}>
              Select Event Dates
            </Text>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
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
              style={{
                borderRadius: 10,
                marginBottom: 20,
              }}
            />
            <TouchableOpacity
              style={{
                backgroundColor: '#e8d94b',
                padding: 10,
                borderRadius: 50,
                width: '100%',
              }}
              onPress={handleSave}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                  fontSize: 14,
                }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Reschedule;
