import {View, Text, Animated, Platform, PermissionsAndroid} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
import {useUserContext} from '../utilities/UserContext';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, request, RESULTS} from 'react-native-permissions';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const {userDataFromContext, setUserDataFromContext} = useUserContext();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [location, setLocation] = useState(null);

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

  // this one working
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } else {
        getLocation();
      }
    };

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          setLocation(position.coords);
          // console.log('Location:', position.coords);
        },
        error => {
          console.error('Error getting location', error);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  // const requestLocationPermission = async () => {
  //   try {
  //     let permission;

  //     if (Platform.OS === 'android') {
  //       permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  //     } else if (Platform.OS === 'ios') {
  //       permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  //     }

  //     const result = await request(permission);

  //     if (result === RESULTS.GRANTED) {
  //       console.log('Location permission granted');
  //       // Call a function to get the user's location here if needed
  //     } else {
  //       console.log('Location permission denied');
  //     }
  //   } catch (error) {
  //     console.error('Error requesting location permission', error);
  //   }
  // };

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigation.navigate('BottomTab');
      } else {
        navigation.navigate('FlashScreen');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [user, navigation]);

  // console.log(
  //   'user data stored in userDataFromContext in splashscreen',
  //   userDataFromContext,
  // );
  console.log('getting users location from splashscreen', location);

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
