import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../../api-services/api-constants';
import moment from 'moment';
import axios from 'axios';

const ReasonForCancel = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const bookingInfo = route.params.bookingInfo;
  const [reasonForCancel, setReasonForCancel] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  console.log('bookingInfo in reason for cancel order', bookingInfo);

  const handleCancel = async () => {
    setLoading(true);
    try {
      const config = {
        url: `${apiUrl.CANCEL_ORDER}${bookingInfo._id}`,
        method: 'put',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          cancel_reason: reasonForCancel,
          cancelled_date: moment().format('LLL'),
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        Alert.alert('Event Has Cancelled Successfully');
        navigation.navigate('Home');
        // navigation.goBack();
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <ScrollView>
        <Text
          style={{
            fontSize: 15,
            marginTop: 10,
            color: 'black',
            textAlign: 'center',
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Reason For Cancel
        </Text>
        <View style={{marginVertical: 10}}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Enter the reason"
            placeholderTextColor="gray"
            textAlignVertical="top"
            onChangeText={text => setReasonForCancel(text)}
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
          <View
            style={{
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'space-between',
              paddingHorizontal: 50,
            }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                Back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={{
                backgroundColor: loading ? '#ad2b2b90' : '#ad2b2b', // Change opacity if loading
                paddingVertical: 10,
                borderRadius: 5,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Cancelling <ActivityIndicator size="small" color="#ffffff" />
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  Cancel Order
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReasonForCancel;
