import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native';
import React, {useState} from 'react';
import {Checkbox} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';

const CancellationPolicy = ({bookingInfo}) => {
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);
  const route = useRoute();
  // const bookingInfo = route.params.bookingInfo;

  const cancelOrder = () => {
    if (checked === false) {
      Alert.alert(
        'Cancellation Policy',
        'Please confirm that you have read and understood the cancellation policy by checking the box before proceeding.',
        [{text: 'OK'}],
      );
    } else {
      navigation.navigate('ReasonForCancel', {bookingInfo: bookingInfo});
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
              {index + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. In et nibh ac tortor sodales fringilla. Proin ante tortor,
              posuere vel mi vitae, rhoncus porta mi. Cras quis hendrerit
              tellus.
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
                By clicking here, I state that I have read and understood the
                cancellation policy.
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
                Cancel Order
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default CancellationPolicy;
