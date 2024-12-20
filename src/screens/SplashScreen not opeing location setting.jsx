import {
  View,
  Text,
  Animated,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
import {useUserContext} from '../utilities/UserContext';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import Geocoder from 'react-native-geocoding';
import DeviceInfo from 'react-native-device-info';
// import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';

Geocoder.init('AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk');

const SplashScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const {userDataFromContext, setUserDataFromContext} = useUserContext();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setUser(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };
    getUserData();
  }, []);

  const getProfile = async () => {
    try {
      const userRes = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_USER_PROFILE}${user._id}`,
      );
      if (userRes.status === 200) {
        setUserDataFromContext(userRes.data);
      }
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    if (user?._id) {
      getProfile();
    }
  }, [user?._id]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const permissionResult = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      handlePermissionResult(permissionResult);
    } else if (Platform.OS === 'ios') {
      const permissionResult = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      );
      handlePermissionResult(permissionResult);
    }
  };

  const handlePermissionResult = async result => {
    if (result === RESULTS.GRANTED) {
      console.log('Location permission granted');
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      if (isLocationEnabled) {
        // If location is already enabled, get the location
        getLocation();
      } else {
        openLocationSettings();
      }
    } else if (result === RESULTS.DENIED) {
      console.log('Location permission denied');
    } else if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Required',
        'Please enable location permission in settings to continue using this feature.',
        [{text: 'OK'}],
      );
    }
  };

  const openLocationSettings = () => {
    Alert.alert(
      'Enable Location Services',
      'Please enable location services to proceed.',
      [
        {
          text: 'Open Location Settings',
          onPress: () => {
            if (Platform.OS === 'android') {
              Linking.openURL('settings:').catch(() => {
                Linking.openURL(
                  'content://com.android.settings/location',
                ).catch(() => {
                  Alert.alert(
                    'Error',
                    'Unable to open location settings. Please enable it manually.',
                  );
                });
              });
            } else if (Platform.OS === 'ios') {
              Linking.openURL('App-Prefs:root=LOCATION_SERVICES').catch(() => {
                Alert.alert(
                  'Error',
                  'Unable to open location settings. Please enable it manually.',
                );
              });
            }
          },
        },
      ],
    );
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('Location enabled:', position);
        setLocationEnabled(true); // Set location enabled to true once location is obtained
        saveAddress(position.coords);
      },
      error => {
        console.error('Error getting location', error);
        Alert.alert(
          'Location Error',
          'Unable to retrieve your location. Please make sure GPS is enabled.',
          [{text: 'Retry', onPress: getLocation}],
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      },
    );
  };

  const saveAddress = async coords => {
    try {
      const {latitude, longitude} = coords;
      const response = await Geocoder.from(latitude, longitude);
      const address = response.results[0].formatted_address;
      console.log('Address:', address);

      // Store the address (or handle it as needed)
      await AsyncStorage.setItem('userAddress', address);
    } catch (error) {
      console.error('Failed to convert coordinates to address', error);
    }
  };

  const showCustomPermissionDialog = () => {
    Alert.alert(
      'Location Permission',
      "Allow Nithyaevent to access this device's location?",
      [
        {text: 'DENY', onPress: () => console.log('Permission denied')},
        {text: 'ALLOW', onPress: requestLocationPermission},
      ],
    );
  };

  useEffect(() => {
    showCustomPermissionDialog();
  }, []);

  useEffect(() => {
    if (locationEnabled) {
      // Navigate to BottomTab once the location is enabled
      navigation.navigate('BottomTab');
    } else if (user === null) {
      // If the user denies permission, stay on SplashScreen
      console.log(
        'Waiting for user to enable location services or grant permissions',
      );
    }
  }, [locationEnabled, user, navigation]);

  // working
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (user) {
  //       navigation.navigate('BottomTab');
  //     } else {
  //       navigation.navigate('FlashScreen');
  //     }
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, [user, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: fadeAnim,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontFamily: 'Montserrat-SemiBold',
            letterSpacing: 2,
            color: 'black',
          }}>
          <MaterialCommunityIcons
            name="drawing-box"
            size={50}
            color="#9a9a9a"
          />
          EVENT BOX
        </Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
