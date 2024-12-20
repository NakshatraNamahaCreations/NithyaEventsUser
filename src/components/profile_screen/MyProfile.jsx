import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {clearCart} from '../../state-management/cartSlice';
import {clearServiceCart} from '../../state-management/serviceCartSlice';
import {useAddressContext} from '../../utilities/AddressContext';
import {useUserContext} from '../../utilities/UserContext';
import {clearTechCart} from '../../state-management/technicianSlice';

export default function MyProfile({navigation}) {
  const {userDataFromContext} = useUserContext();
  const [user, setUser] = useState('');
  useEffect(() => {
    const getVendorData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };

    getVendorData();
  }, []);

  const navigationDecision = () => {
    if (
      userDataFromContext &&
      userDataFromContext.company_profile &&
      userDataFromContext.company_profile.length > 0
    ) {
      navigation.navigate('Account');
    } else {
      // navigation.navigate('AddProfile');
      navigation.navigate('CompanyProfile');
    }
  };

  const dispatch = useDispatch();

  const clearAllCarts = () => {
    dispatch(clearCart()); // Clear the product cart
    dispatch(clearServiceCart()); // Clear the service cart
    dispatch(clearTechCart()); // Clear the service cart
  };

  const handlelogout = () => {
    AsyncStorage.removeItem('user');
    navigation.navigate('Login');
    clearAllCarts();
    alert('Logout Successfully');
  };

  const {clearAddressDataContext} = useAddressContext();

  const handleClearContext = () => {
    // Call the clear function to reset the context data
    clearAddressDataContext();
  };

  const clearStoredAddress = async () => {
    try {
      await AsyncStorage.removeItem('address');
      console.log('Stored address removed.');
    } catch (error) {
      console.error('Error removing stored address:', error);
    }
  };
  return (
    <ScrollView style={{padding: 10, paddingTop: 30}}>
      <Text
        style={{
          color: 'black',
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 18,
        }}>
        My account
      </Text>
      <Text
        style={{
          color: 'red',
          fontFamily: 'Montserrat-SemiBold',
          fontSize: 14,
          marginTop: 10,
        }}>
        {user.username}
      </Text>
      <View style={{marginTop: 20}}>
        <Text
          style={{
            color: '#595959',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 12,
            marginBottom: 20,
          }}>
          YOUR INFORMATION
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={navigationDecision}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome5
                name={'user-alt'}
                size={16}
                color={'#737373'}
                // #737373
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              Profile
            </Text>
          </View>
          <View
            style={{
              backgroundColor: '#ffa0a030',
              position: 'absolute',
              right: 50,
              // paddingVertical: 2,
              paddingHorizontal: 5,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: '#d12828',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              {userDataFromContext &&
              userDataFromContext.company_profile &&
              userDataFromContext.company_profile.length > 0
                ? '100% completed'
                : '50% completed'}
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('MyTickets');
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome6
                name={'ticket'}
                size={16}
                color={'#737373'}
                // #737373
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              My Tickets
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('Favourites');
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Octicons
                name={'heart'}
                size={16}
                color={'#737373'}
                // #737373
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 14,
                letterSpacing: 1,
              }}>
              Favourites
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('Address');
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome
                name={'address-book-o'}
                size={16}
                color={'#737373'}
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 14,
                letterSpacing: 1,
              }}>
              Address
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity> */}
      </View>
      <View style={{marginTop: 10}}>
        <Text
          style={{
            color: '#595959',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 12,
            marginBottom: 20,
          }}>
          OTHER INFORMATION
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('Aboutus')}
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome6
                name={'circle-exclamation'}
                size={16}
                color={'#737373'}
                // #737373
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 14,
              }}>
              About us
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('PrivacyPolicy')}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <Fontisto name={'locked'} size={16} color={'#737373'} />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              Privacy policy
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('HelpCentre')}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <MaterialCommunityIcons
                name={'face-agent'}
                size={16}
                color={'#737373'}
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              Help centre
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}
          onPress={() => navigation.navigate('TermsCondition')}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome5
                name={'clipboard-list'}
                size={16}
                color={'#737373'}
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              Terms & Condition
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FAQ')}
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <MaterialCommunityIcons
                name={'chat-question'}
                size={16}
                color={'#737373'}
              />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              FAQ
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlelogout}
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <View style={{flex: 0.2}}>
            <View
              style={{
                width: 30,
                height: 30,
                backgroundColor: '#e7e7e7',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 50,
              }}>
              <FontAwesome6 name={'power-off'} size={16} color={'#737373'} />
            </View>
          </View>
          <View style={{flex: 0.9}}>
            <Text
              style={{
                color: '#414141',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
              }}>
              Logout
            </Text>
          </View>
          <View style={{flex: 0.1}}>
            <Octicons name={'chevron-right'} size={16} color={'#737373'} />
          </View>
        </TouchableOpacity>
      </View>
      {/* <TouchableOpacity
        style={{
          backgroundColor: 'red',
          paddingVertical: 10,
        }}
        onPress={clearAllCarts} // Calls the function to clear both carts
      >
        <Text
          style={{
            fontSize: 13,
            color: 'white',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          Clear All Carts
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          paddingVertical: 10,
          marginTop: 20,
        }}
        onPress={handleClearContext} // Calls the function to clear both carts
      >
        <Text
          style={{
            fontSize: 13,
            color: 'white',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          Clear Address Context
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: 'red',
          paddingVertical: 10,
          marginTop: 20,
        }}
        onPress={clearStoredAddress} // Calls the function to clear both carts
      >
        <Text
          style={{
            fontSize: 13,
            color: 'white',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          Clear Location
        </Text>
      </TouchableOpacity> */}
      <View style={{marginVertical: 50}}>
        <Text
          style={{
            fontFamily: 'Montserrat-Bold',
            color: '#a9a9a9',
            fontSize: 20,
            textAlign: 'center',
          }}>
          Nithyaevent{' '}
        </Text>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            color: '#a9a9a9',
            fontSize: 15,
            textAlign: 'center',
          }}>
          © 2024 Nithyaevent. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}
