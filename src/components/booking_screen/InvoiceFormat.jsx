import {
  Alert,
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useUserContext} from '../../utilities/UserContext';
import moment from 'moment';
import RNFS from 'react-native-fs';
import {useGenerateInvoice} from '../../utilities/useGenerateInvoice';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';

const InvoiceFormat = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const bookingInfo = route.params.bookingInfo || null;
  const {userDataFromContext} = useUserContext();
  const [profileData, setProfileData] = useState({});
  const [payoutData, setPayoutData] = useState({});
  // console.log('bookingInfo in invoice format component', userDataFromContext);
  const bookingId = bookingInfo._id.slice(-4);
  const userId = userDataFromContext._id.slice(-4);
  const invoiceNumber = String(userId + bookingId);
  const order = bookingInfo.product_data;
  const serviceOrders = bookingInfo.service_data;

  const fetchData = async () => {
    try {
      const payoutRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PAYOUT_CONFIG}`,
      );
      if (payoutRes.status === 200) {
        const payout = payoutRes.data.profile;
        setPayoutData(payout);
      }
      const profileRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_PROFILE}`,
      );
      if (profileRes.status === 200) {
        const profile = profileRes.data.profile;
        setProfileData(profile);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // console.log('profileData', profileData),
  //   console.log('payoutData', payoutData);

  const address = [
    {
      id: 1,
      line: profileData.corporate_address,
    },
    // {
    //   id: 2,
    //   line: 'Taskar Town, Off. Queens Road,',
    // },
    // {
    //   id: 3,
    //   line: 'Bangalore - 560 051.',
    // },
    {
      id: 4,
      line: profileData.contact_email,
    },
  ];

  const invoiceInfo = [
    {
      id: 0,
      head: 'Invoice #',
      value: `INV${invoiceNumber.toUpperCase()}`,
    },
    {
      id: 1,
      head: 'Event Name',
      value: `${bookingInfo.event_name}`,
    },
    {
      id: 2,
      head: 'Ordered Date',
      value: moment(bookingInfo.ordered_date).format('YYYY-MM-DD'),
    },
    {
      id: 3,
      head: 'Venue Name',
      value: bookingInfo.venue_name,
    },
    {
      id: 4,
      head: 'Venue Location',
      value: bookingInfo.event_location,
    },
    {
      id: 5,
      head: 'Venue Available Time',
      value: bookingInfo.venue_open_time,
    },
    {
      id: 6,
      head: 'Event Date',
      value: `${bookingInfo.event_date}`,
    },
    {
      id: 7,
      head: 'Event Time',
      value: `${bookingInfo.event_start_time} - ${bookingInfo.event_end_time}`,
    },
    {
      id: 8,
      head: 'No of Days',
      value: bookingInfo.number_of_days,
    },
  ];

  const billingDetails = [
    {
      id: 1,
      title: 'Total',
      // value: `₹100`,
      value: `₹${bookingInfo.base_amount.toFixed(2)}`,
    },
    {
      id: 2,
      title: 'TDS Charges 2%',
      value: `₹${bookingInfo.tds_deduction.toFixed(2)}`,
    },
    {
      id: 3,
      title: 'Amount After TDS Deduction',
      value: `₹${bookingInfo.amount_after_deduction.toFixed(2)}`,
    },
    {
      id: 4,
      title: 'CGST 9%',
      value: `₹${(bookingInfo.gst_applied_value / 2).toFixed(2)}`,
    },
    {
      id: 5,
      title: 'SGST 9%',
      value: `₹${(bookingInfo.gst_applied_value / 2).toFixed(2)}`,
    },

    {
      id: 6,
      title: 'Grand Total',
      value: `₹${bookingInfo.paid_amount.toFixed(2)}`,
    },
  ];

  const termsConditions = [
    {
      id: 1,
      title: 'Payment Terms',
      paragraph:
        'Payment is due [specify terms, e.g., upon receipt, before delivery, etc.]. Accepted payment methods include [list methods, e.g., credit card, cash, bank transfer].',
    },
    {
      id: 2,
      title: 'Reservation and Deposit',
      paragraph: 'A 100% deposit is required to secure your reservation.',
    },
    {
      id: 3,
      title: 'Cancellation Policy',
      paragraph:
        'Cancellations must be made at least 2 days in advance. Cancellations made within a day will be no refund.',
    },
    {
      id: 4,
      title: 'Rental Period',
      paragraph: `The rental periods starts from [${bookingInfo.event_date}/${bookingInfo.event_start_time}]. Any extension must be arranged in advance and is subject to availability.`,
    },
    {
      id: 5,
      title: 'Delivery and Pickup',
      paragraph:
        'Delivery and pickup services are available for an additional fee. The customer must ensure the rental location is accessible for delivery.',
    },
    {
      id: 6,
      title: 'Condition of Equipment',
      paragraph:
        'Rented items should be returned in their original condition. Customers are responsible for any damage or loss incurred during the rental period.',
    },
    {
      id: 7,
      title: 'Liability',
      paragraph:
        'The customer agrees to assume all liability for rented items during the rental period. [Include any insurance requirements if applicable.]',
    },
    {
      id: 8,
      title: 'Indemnification',
      paragraph:
        'The customer agrees to indemnify and hold Nithya events or kadagam ventures pvt Ltd harmless from any claims or damages arising from the use of rented items.',
    },
    {
      id: 9,
      title: 'Governing Law',
      paragraph:
        'This agreement shall be governed by the laws of Bangalore karnataka.',
    },
    {
      id: 10,
      title: 'Changes to Terms',
      paragraph:
        'Nithya event or kadagam ventures pvt Ltd reserves the right to change these terms and conditions at any time. Customers will be notified of any significant changes.',
    },
    {
      id: 11,
      title: 'Contact Information',
      paragraph:
        'For questions or concerns regarding these terms, please contact us at support@nithyaevent.com.',
    },
  ];

  const {generatePdf} = useGenerateInvoice();

  async function requestStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save PDFs.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  requestStoragePermission();
  async function copyToDownloads(filePath) {
    const hasPermission = await requestStoragePermission();

    if (!hasPermission) {
      Alert.alert(
        'Permission denied',
        'Unable to save the PDF to Downloads folder.',
      );
      return;
    }

    const downloadsPath = `${RNFS.DownloadDirectoryPath}/Nithyaevent.pdf`;

    try {
      await RNFS.copyFile(filePath, downloadsPath);
      console.log('PDF copied to Downloads folder:', downloadsPath);
      Alert.alert(
        'Success',
        `PDF saved to Downloads folder:\n${downloadsPath}`,
      );
    } catch (error) {
      console.error('Error copying PDF to Downloads folder:', error);
      Alert.alert('Error', 'Failed to save the PDF to Downloads folder.');
    }
  }

  const handleGeneratePdf = async () => {
    try {
      const filePath = await generatePdf(
        order,
        bookingInfo,
        address,
        invoiceNumber,
        invoiceInfo,
        billingDetails,
        termsConditions,
        userDataFromContext,
        serviceOrders,
      );
      if (filePath) {
        console.log('PDF File:', filePath);
        copyToDownloads(filePath);
        // Optionally, open the file using Linking
        // Linking.openURL(`file://${filePath}`);
      } else {
        console.error('PDF generation failed, file path is undefined.');
      }
      console.log('PDF File:', filePath);
      // Linking.openURL(`file://${filePath}`); // This should prompt you to open the file with a PDF viewer
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <View style={{padding: 5}}>
      <ScrollView>
        <View style={{borderColor: '#616161', borderWidth: 1}}>
          <View style={{padding: 5}}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    fontSize: 11,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  KADAGAM VENTURES PRIVATE LIMITED
                </Text>
                {address.map(ele => (
                  <Text
                    key={ele.id}
                    style={{
                      fontSize: 12,
                      color: 'black',
                      textAlign: 'left',
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    {ele.line}
                  </Text>
                ))}
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-SemiBold',
                    marginTop: 5,
                  }}>
                  GSTIN : {payoutData.company_gst}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    // marginTop: 5,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  SAC CODE : {payoutData.company_saccode}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Bold',
                    marginTop: 10,
                  }}>
                  To
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  {userDataFromContext.username},
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  +91 {bookingInfo.receiver_mobilenumber}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {bookingInfo.event_location}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Medium',
                    marginTop: 5,
                  }}>
                  GST :{' '}
                  {userDataFromContext?.company_profile?.length > 0
                    ? userDataFromContext.company_profile[0].gst_number
                    : 'N/A'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Medium',
                    marginTop: 5,
                  }}>
                  PAN :{' '}
                  {userDataFromContext?.company_profile?.length > 0
                    ? userDataFromContext.company_profile[0].pan_number
                    : 'N/A'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    textAlign: 'left',
                    fontFamily: 'Montserrat-Medium',
                    marginTop: 5,
                  }}>
                  Kind Attn : {bookingInfo.receiver_name}
                </Text>
                {userDataFromContext?.company_profile?.length > 0 &&
                  userDataFromContext?.company_profile[0]?.company_type !==
                    'Self/Others' && (
                    <Text
                      style={{
                        fontSize: 10,
                        color: 'green',
                        textAlign: 'left',
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 5,
                      }}>
                      PAN Card details has been uploaded
                    </Text>
                  )}
              </View>
              <View style={{flex: 0.6}}>
                <View style={{borderColor: 'black', borderWidth: 1}}>
                  {invoiceInfo.map((ele, index) => (
                    <View
                      key={ele.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderColor:
                          invoiceInfo.length - 1 === index
                            ? 'transparent'
                            : 'black',
                        borderBottomWidth:
                          invoiceInfo.length - 1 === index ? 0 : 1,
                      }}>
                      <Text
                        style={{
                          flex: 0.6,
                          fontSize: 12,
                          color: 'black',
                          textAlign: 'left',
                          padding: 3,
                          fontFamily: 'Montserrat-SemiBold',
                        }}>
                        {ele.head}
                      </Text>
                      <Text
                        style={{
                          flex: 0.6,
                          fontSize: 12,
                          padding: 3,
                          color: 'black',
                          textAlign: 'right',
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        {ele.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <View style={{borderWidth: 1, borderColor: 'black', marginTop: 5}}>
              <View
                style={{
                  flexDirection: 'row',
                  backgroundColor: '#cacaca',
                  alignItems: 'center',
                  borderBottomColor: 'black',
                  borderBottomWidth: 1,
                  padding: 3,
                }}>
                <Text
                  style={{
                    flex: 2,
                    fontSize: 12,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    textAlign: 'center',
                  }}>
                  Product
                </Text>
                <Text
                  style={{
                    flex: 2,
                    fontFamily: 'Montserrat-SemiBold',
                    textAlign: 'center',
                    color: 'black',
                    fontSize: 12,
                  }}>
                  Size
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    textAlign: 'left',
                    fontSize: 12,
                  }}>
                  Qty
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    textAlign: 'left',
                    fontSize: 12,
                  }}>
                  Price
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat-SemiBold',
                    color: 'black',
                    textAlign: 'left',
                    fontSize: 12,
                  }}>
                  Days
                </Text>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Montserrat-SemiBold',
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'black',
                  }}>
                  Amount
                </Text>
              </View>
              {order.length > 0 && (
                <View
                  style={{
                    backgroundColor: 'yellow',
                    marginBottom: 10,
                    marginTop: 1,
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                    }}>
                    Product
                  </Text>
                </View>
              )}
              {order.map((item, index) => (
                <View key={item.id}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 2,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      {item.productName}
                    </Text>
                    <Text
                      style={{
                        flex: 2,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                        fontSize: 11,
                      }}>
                      {item.productDimension}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        textAlign: 'center',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      {item.quantity}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'left',
                        fontSize: 11,
                      }}>
                      ₹{item.productPrice}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                        fontSize: 11,
                      }}>
                      {bookingInfo.number_of_days}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      ₹{item.totalPrice * bookingInfo.number_of_days}
                    </Text>
                  </View>
                </View>
              ))}
              {serviceOrders.length > 0 && (
                <View
                  style={{
                    backgroundColor: 'yellow',
                    marginBottom: 10,
                    borderTopColor: 'black',
                    borderTopWidth: 1,
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 12,
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                    }}>
                    Service
                  </Text>
                </View>
              )}
              {serviceOrders.map(item => (
                <View key={item.id}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      alignItems: 'center',
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        flex: 2,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      {item.shopName}
                    </Text>
                    <Text
                      style={{
                        flex: 2,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                        fontSize: 11,
                      }}>
                      {' '}
                      -
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        textAlign: 'left',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      {' '}
                      -
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'left',
                        fontSize: 11,
                      }}>
                      ₹{item.pricing}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                        fontSize: 11,
                      }}>
                      {bookingInfo.number_of_days}
                    </Text>
                    <Text
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 11,
                      }}>
                      ₹{item.pricing * bookingInfo.number_of_days}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <View
              style={{
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderBottomWidth: 1,
                padding: 3,
              }}>
              {billingDetails.map(ele => (
                <View
                  key={ele.id}
                  style={{flexDirection: 'row', marginVertical: 2}}>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {ele.title}
                    </Text>
                  </View>
                  <View style={{flex: 0.5}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'right',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {ele.value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Bold',
                fontSize: 13,
                marginTop: 10,
              }}>
              Terms & Conditions
            </Text>
            {termsConditions.map((TC, index) => (
              <View key={TC.id} style={{marginVertical: 5}}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 12,
                    padding: 2,
                  }}>
                  {index + 1}. {TC.title}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 12,
                    padding: 2,
                  }}>
                  {TC.paragraph}
                </Text>
              </View>
            ))}

            <View style={{flexDirection: 'row-reverse', marginVertical: 20}}>
              <View style={{marginRight: 20}}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 13,
                    textAlign: 'right',
                  }}>
                  Signature
                </Text>
                <Image
                  source={require('../../../assets/signature.png')}
                  style={{
                    width: 100,
                    height: 50,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{marginVertical: 20}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                color: 'black',
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop: 20}} onPress={handleGeneratePdf}>
            <Text
              style={{
                fontFamily: 'Montserrat-Bold',
                fontSize: 18,
                color: 'black',
              }}>
              Download
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default InvoiceFormat;
