import {View, Text, Animated, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
import {useUserContext} from '../utilities/UserContext';
import DeviceInfo from 'react-native-device-info';
import Video from 'react-native-video';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const {setUserDataFromContext} = useUserContext();
  const [fadeAnim] = useState(new Animated.Value(0));

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

  const checkLocationEnabled = async () => {
    try {
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      if (isLocationEnabled) {
        console.log('Location is enabled');
        // Navigate to BottomTab if location services are enabled
        navigation.navigate('Calender');
        // navigation.navigate('BottomTab');
      } else {
        console.log('Location is not enabled');
        // Navigate to EnableLocation if location services are not enabled
        navigation.navigate('Enable Location');
      }
    } catch (error) {
      console.error('Error checking location services', error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        checkLocationEnabled();
      } else {
        navigation.navigate('FlashScreen');
      }
    }, 10000); //change to 10sec (10000)
    return () => clearTimeout(timer);
  }, [user, navigation]);

  // .......................
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

  const background = require('../../assets/02.mp4');

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
      }}>
      <Video
        source={background}
        // onBuffer={onBuffer}
        // onError={onError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          // height: '100%',
        }}
        resizeMode="stretch"
        repeat={false}
      />
      {/* //   <Animated.View
    //     style={{
    //       flex: 1,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       opacity: fadeAnim,
    //     }}>
    //     <Image
    //       source={require('../../assets/logoo.jpeg')}
    //       style={{width: 450, height: 450}}
    //     /> */}
      {/* <Text
          style={{
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
            letterSpacing: 1,
            color: '#9a9a9a ',
          }}> */}
      {/* <MaterialCommunityIcons
            name="drawing-box"
            size={50}
            color="#9a9a9a"
          /> */}
      {/* STOP THINKING, LETS CONNECT... */}
      {/* </Text> */}
      {/* </Animated.View>*/}
    </View>
  );
};

export default SplashScreen;
