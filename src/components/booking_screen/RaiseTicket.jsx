import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiUrl} from '../../api-services/api-constants';
import {RadioButton} from 'react-native-paper';
import THEMECOLOR from '../../utilities/color';
import moment from 'moment';
import email from 'react-native-email';
import axios from 'axios';
import {useUserContext} from '../../utilities/UserContext';
import ImageResizer from 'react-native-image-resizer';
import * as ImagePicker from 'react-native-image-picker';

function RaiseTicket({route}) {
  const orderData = route.params.order;
  const eventId = route.params.eventid;
  const {userDataFromContext} = useUserContext();
  // const vendorData = route.params.vendorData;
  console.log('orderData in raise ticket page', eventId);
  const navigation = useNavigation();
  const reasonList = [
    {id: 1, reason: 'Performance or quality not adequate'},
    {id: 2, reason: 'Product damaged, but shipping box OK'},
    {id: 3, reason: 'Missing parts or accesssories'},
    {id: 4, reason: 'Both products and shipping box damaged'},
    {id: 5, reason: 'Wrong item was sent'},
    {id: 6, reason: "Item defective or doesn't work"},
  ];
  const [selectedValue, setSelectedValue] = React.useState('');
  const [selectedItems, setSelectedItems] = React.useState(null);
  const [commandForReason, setCommandForReason] = React.useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedUri, setAttachedUri] = useState('');

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

  const handleSelectItem = item => {
    setSelectedItems(item);
  };
  // console.log('selectedItems', selectedItems);
  // React.useEffect(() => {
  //   console.log('selectedItems updated:', selectedItems);
  // }, [selectedItems]);

  const handleSelectReason = item => {
    setSelectedValue(item);
    // console.log('selectedValue', selectedValue);
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

  const attachmentFile = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      if (response.assets) {
        // console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setAttachedUri(resizedImageUri);
        setAttachedFileName(fileNAME);
      }
    });
  };

  // const updateStatus = async () => {
  //   try {
  //     const config = {
  //       url: `${apiUrl.CANCEL_ORDER}${eventId}`,
  //       method: 'put',
  //       baseURL: apiUrl.BASEURL,
  //       headers: {'Content-Type': 'application/json'},
  //     };
  //     const response = await axios(config);
  //     if (response.status === 200) {
  //     }
  //   } catch (error) {
  //     console.log('Unknown error:', error);
  //     if (error.response && error.response.data) {
  //       Alert.alert('Error', error.response.data.message);
  //     } else {
  //       Alert.alert('Error', 'An unknown error occurred');
  //     }
  //   }
  // };

  // const submiteRequest = async () => {
  //   if (selectedValue === '') {
  //     Alert.alert('Please select a reason');
  //   } else {
  //     try {
  //       const formData = new FormData();
  //       formData.append('user_id', userDataFromContext._id);
  //       formData.append('user_name', userDataFromContext.username);
  //       formData.append('user_email', userDataFromContext.email);
  //       formData.append('ticket_reason', selectedValue.reason);
  //       formData.append('ticket_command', commandForReason);
  //       formData.append('product_id', selectedItems.id);
  //       formData.append('product_name', selectedItems.productName);
  //       formData.append('vendor_id', selectedItems.sellerId);
  //       formData.append('vendor_name', selectedItems.sellerName);
  //       formData.append('ticket_created_date', moment().format('lll'));
  //       formData.append('attachment_file', {
  //         uri: attachedUri,
  //         type: 'image/jpeg',
  //         name: attachedFileName || 'image.jpg',
  //       });
  //       const config = {
  //         url: apiUrl.CREATE_TICKET,
  //         method: 'post',
  //         baseURL: apiUrl.BASEURL,
  //         headers: {'Content-Type': 'multipart/form-data'},
  //         data: formData,
  //       };
  //       const response = await axios(config);
  //       if (response.status === 200) {
  //         Alert.alert('Ticket Submitted!');
  //         console.log('response:', response.data.message);
  //         await updateStatus()
  //         navigation.navigate('BottomTab');
  //         sendEmail();
  //       }
  //     } catch (error) {
  //       console.log('Unknown error:', error);
  //       if (error.response && error.response.data) {
  //         Alert.alert('Error', error.response.data.message);
  //       } else {
  //         Alert.alert('Error', 'An unknown error occurred');
  //       }
  //     }
  //   }
  // };

  const updateStatus = async () => {
    try {
      const config = {
        url: `${apiUrl.UPDATING_EVENT_STATUS}${eventId}`,
        method: 'put',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
      };
      const response = await axios(config);
      if (response.status === 200) {
        console.log('Status updated successfully.');
      }
    } catch (error) {
      console.log('Error updating status:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An error occurred while updating the status.');
      }
    }
  };

  const submitRequest = async () => {
    if (!selectedValue) {
      Alert.alert('Validation Error', 'Please select a reason.');
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('user_id', userDataFromContext._id);
      formData.append('user_name', userDataFromContext.username);
      formData.append('user_email', userDataFromContext.email);
      formData.append('ticket_reason', selectedValue.reason || 'N/A');
      formData.append('ticket_command', commandForReason || 'N/A');
      formData.append('product_id', selectedItems?.id || 'N/A');
      formData.append('product_name', selectedItems?.productName || 'N/A');
      formData.append('vendor_id', selectedItems?.sellerId || 'N/A');
      formData.append('vendor_name', selectedItems?.sellerName || 'N/A');
      formData.append('ticket_created_date', moment().format('lll'));

      // Add attachment if available
      if (attachedUri) {
        formData.append('attachment_file', {
          uri: attachedUri,
          type: 'image/jpeg',
          name: attachedFileName || 'image.jpg',
        });
      }

      const config = {
        url: apiUrl.CREATE_TICKET,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'multipart/form-data'},
        data: formData,
      };

      const response = await axios(config);

      if (response.status === 200) {
        console.log('Ticket submitted successfully:', response.data.message);
        Alert.alert('Success', 'Ticket Submitted!');

        // Update status
        await updateStatus();

        // Navigate and send email after successful submission
        navigation.navigate('BottomTab');
        sendEmail();
      } else {
        Alert.alert('Error', 'Failed to submit the ticket.');
      }
    } catch (error) {
      console.log('Error during ticket submission:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert(
          'Error',
          'An unknown error occurred while submitting the ticket.',
        );
      }
    }
  };

  const sendEmail = () => {
    const to = 'support@nithyaevent.com';
    email(to, {
      // cc: 'kiruthikamani0599@gmail.com',
      // bcc: 'kiruthikamani0599@gmail.com',
      subject: `Ticket Issue for Product ID - ${selectedItems.id}`,
      body: `${selectedValue?.reason || 'No reason provided'}\n\n${
        commandForReason || ''
      }`,
      checkCanOpen: false,
    }).catch(console.error);
  };

  // console.log('selectedValue', selectedValue);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View style={{marginTop: 20, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{marginLeft: 10}}>
          <Ionicons
            name="arrow-back"
            color="black"
            size={19}
            style={{
              backgroundColor: '#f5f5f5',
              width: 40,
              height: 40,
              textAlign: 'center',
              paddingTop: 10,
              borderRadius: 50,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 5,
            marginLeft: 15,
          }}>
          Raise a Ticket
        </Text>
      </View>
      <ScrollView style={{padding: 10}}>
        {/* <Text
          style={{
            fontSize: 14,
            color: 'green',
            fontFamily: 'Montserrat-Medium',
            marginBottom: 10,
          }}>
          Ticket ID: {orderData._id}
        </Text> */}
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 0.7}}>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                fontFamily: 'Montserrat-Medium',
              }}>
              {orderData.event_name}
            </Text>
          </View>
        </View> */}

        <Text
          style={{
            fontSize: 15,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            marginBottom: 10,
            marginTop: 10,
          }}>
          Select item
        </Text>

        {orderData.map((item, index) => (
          <View key={item.id}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
              }}>
              <View style={{flex: 0.1}}>
                <RadioButton
                  status={
                    selectedItems?.id === item.id ? 'checked' : 'unchecked'
                  }
                  onPress={() => handleSelectItem(item)}
                />
              </View>
              <View style={{flex: 0.9}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    marginLeft: 2,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {item.productName}
                </Text>
              </View>
            </View>
            {index !== orderData.length - 1 && (
              <View
                style={{
                  borderBottomColor: '#c6c6c6',
                  borderBottomWidth: 1,
                }}></View>
            )}
          </View>
        ))}
        {selectedItems !== null ? (
          <>
            <View
              style={{
                borderColor: '#f7f6fd',
                borderWidth: 2,
                marginBottom: 5,
                marginTop: 10,
              }}></View>
            <View>
              <Text
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Remark
              </Text>
              <View
                style={{
                  //   padding: 5,
                  borderColor: '#c6c6c6',
                  borderWidth: 1,
                  borderRadius: 5,
                  marginTop: 20,
                }}>
                {reasonList.map((item, index) => (
                  <View key={item.id}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                      }}>
                      <View style={{flex: 0.1}}>
                        <RadioButton
                          status={
                            selectedValue?.id === item.id
                              ? 'checked'
                              : 'unchecked'
                          }
                          onPress={() => handleSelectReason(item)}
                        />
                      </View>
                      <View style={{flex: 0.9}}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: 'black',
                            marginLeft: 2,
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {item.reason}
                        </Text>
                      </View>
                    </View>
                    {selectedValue?.id === item.id && (
                      <View style={{marginHorizontal: 20, marginBottom: 10}}>
                        <TextInput
                          multiline
                          numberOfLines={4}
                          placeholder="Command (optional)"
                          placeholderTextColor="gray"
                          textAlignVertical="top"
                          onChangeText={text => setCommandForReason(text)}
                          style={{
                            borderWidth: 1,
                            borderColor: '#c6c6c6',
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 15,
                            color: 'black',
                            borderRadius: 5,
                            padding: 10,
                          }}
                        />
                        <View style={{marginTop: 10, flexDirection: 'row'}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: 'black',
                              fontFamily: 'Montserrat-SemiBold',
                              textAlign: 'center',
                            }}>
                            Attachment {asterisk()} :
                          </Text>
                          <TouchableOpacity onPress={attachmentFile}>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 14,
                                marginLeft: 5,
                                fontFamily: 'Montserrat-Medium',
                              }}>
                              {attachedFileName ? (
                                attachedFileName
                              ) : (
                                <Ionicons
                                  name="attach"
                                  size={20}
                                  color="black"
                                />
                              )}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                    {index !== reasonList.length - 1 && (
                      <View
                        style={{
                          borderBottomColor: '#c6c6c6',
                          borderBottomWidth: 1,
                        }}></View>
                    )}
                  </View>
                ))}
              </View>
              <View style={{marginVertical: 20}}>
                <TouchableOpacity
                  style={{
                    backgroundColor: THEMECOLOR.mainColor,
                    borderRadius: 5,
                    paddingVertical: 15,
                  }}
                  onPress={submitRequest}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'white',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    Submit Ticket
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#727272',
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                    }}>
                    Issuing by{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: '#727272',
                      fontFamily: 'Montserrat-SemiBold',
                      textAlign: 'center',
                    }}>
                    {moment(new Date()).format('ll')}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          ''
        )}
      </ScrollView>
    </View>
  );
}

export default RaiseTicket;
