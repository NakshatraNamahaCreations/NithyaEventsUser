import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, RadioButton} from 'react-native-paper';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import {useUserContext} from '../../utilities/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAddressContext} from '../../utilities/AddressContext';

export default function AddressList() {
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const {userDataFromContext, setUserDataFromContext} = useUserContext();
  const {setAddressDataContext} = useAddressContext();
  const [loading, setLoading] = useState(false);

  const handleAddressSelect = async address => {
    try {
      setSelectedAddress(address);
      setAddressDataContext(address);
      //   const addressString = JSON.stringify(address);
      //   await AsyncStorage.setItem('selectedAddress', addressString);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const handleSelect = async () => {
    try {
      if (!selectedAddress) {
        Alert.alert('Please select an address');
        return;
      }
      // navigation.navigate('My Cart');
      navigation.goBack();
    } catch (error) {
      console.error('Error during navigation:', error);
    }
  };

  const getProfile = async () => {
    setLoading(true);
    try {
      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USER_PROFILE}${userDataFromContext._id}`,
      );
      if (userRes.status === 200) {
        setUserDataFromContext(userRes.data);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userDataFromContext?._id) {
      getProfile();
    }
  }, [userDataFromContext?._id]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // flexDirection: 'row',
          position: 'relative',
          backgroundColor: 'transparent',
        }}>
        <ActivityIndicator size="large" color="#0a6fe8" />
      </View>
    );
  }
  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'left',
          padding: 10,
          fontFamily: 'Montserrat-Bold',
          marginTop: 10,
        }}>
        Saved Address
      </Text>

      <ScrollView>
        <View style={{margin: 10}}>
          {userDataFromContext &&
            userDataFromContext.saved_address?.length > 0 && (
              <>
                {userDataFromContext.saved_address.map((addr, index) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      alignItems: 'center',
                    }}
                    key={index}>
                    <RadioButton
                      value="default"
                      status={
                        selectedAddress?.id === addr.id
                          ? 'checked'
                          : 'unchecked'
                      }
                      onPress={() => handleAddressSelect(addr)}
                      style={{flex: 0.1}}
                    />
                    <View style={{flex: 0.9}}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-Medium',
                          color: '#595959',
                          fontSize: 12,
                        }}>
                        {addr.selected_region}
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}
        </View>
        <TouchableOpacity
          style={{
            // backgroundColor: 'white',
            marginBottom: 10,
            marginTop: 15,
            padding: 8,
            borderRadius: 10,
            borderColor: '#7460e4',
            borderWidth: 1,
            borderStyle: 'dashed',
            marginHorizontal: 30,
          }}
          onPress={() => navigation.navigate('Add Address')}>
          <Text
            style={{
              fontFamily: 'Montserrat-Medium',
              color: '#7460e4',
              fontSize: 15,
              textAlign: 'center',
            }}>
            + Add new address
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{padding: 20}}>
        <Pressable
          onPress={handleSelect}
          style={{
            borderRadius: 5,
            padding: 10,
            backgroundColor: '#7460e4',
            marginHorizontal: 100,
            elevation: 3,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
              textAlign: 'center',
            }}>
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
