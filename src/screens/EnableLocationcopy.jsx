import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {check, RESULTS} from 'react-native-permissions';

import Geocoder from 'react-native-geocoding';

export default function EnableLocationcopy() {
  const navigation = useNavigation();
  const animatedButton = useRef(new Animated.Value(400)).current;
  const [location, setLocation] = useState(null);

  const GOOGLE_API_KEY = 'AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk';

  Geocoder.init(GOOGLE_API_KEY);
  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(animatedButton, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animatedButton]);
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (!result) {
        requestAndroidLocationPermission();
      } else {
        getCurrentLocation();
      }
    } else {
      const result = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      handlePermission(result, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    }
  };

  const requestAndroidLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message:
            'This app needs access to your location to show you nearby places.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission denied',
          'Location permission is required to use this feature.',
        );
      }
    } catch (err) {
      console.warn('Error requesting Android location permission:', err);
    }
  };

  const handlePermission = async (result, permission) => {
    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else if (result === RESULTS.DENIED) {
      const requestResult = await request(permission);
      if (requestResult === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission denied',
          'Location permission is required to use this feature.',
        );
      }
    } else {
      Alert.alert(
        'Permission denied',
        'Location permission is required to use this feature.',
      );
    }
  };

  // const getCurrentLocation = () => {
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setLocation(position.coords);
  //       Alert.alert(
  //         'Location',
  //         `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`,
  //       );
  //     },
  //     error => {
  //       console.error('Error fetching location:', error); // Logging the error
  //       Alert.alert(
  //         'Error',
  //         `Unable to fetch location. Error code: ${error.code}, message: ${error.message}`,
  //       );
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  // const getCurrentLocation = async () => {
  //   try {
  //     const position = await new Promise((resolve, reject) => {
  //       Geolocation.getCurrentPosition(resolve, reject, {
  //         enableHighAccuracy: false,
  //         timeout: 15000,
  //         maximumAge: 10000,
  //       });
  //     });

  //     let lat = position.coords.latitude;
  //     let long = position.coords.longitude;

  //     Geocoder.from(lat, long).then(data => {
  //       let fetchedAddress = data.results[0]?.formatted_address;

  //       const abc = {
  //         address: fetchedAddress,
  //         markerCoordinate: {latitude: lat, longitude: long},
  //       };

  //       console.log('abc---', abc);
  //     });
  //   } catch (error) {
  //     console.error('Error getting location:', error.message);
  //   }
  // };
  console.log('user permitted location', location);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View style={{padding: 15}}></View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Image
          source={require('../../assets/LocationMarker.gif')}
          resizeMode="cover"
          style={{
            height: 300,
            width: 300,
          }}
        />
        <View
          style={{
            padding: 15,
            marginTop: 20,
            width: '80%',
            marginBottom: 20,
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'black',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Locate what you need!
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
            }}>
            Please allow us to access your location service
          </Text>
        </View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedButton}]},
          ]}>
          <TouchableOpacity
            style={{
              backgroundColor: '#9a9a9a',
              borderRadius: 10,
              elevation: 3,
              padding: 10,
            }}
            onPress={requestLocationPermission}
            // onPress={  () => navigation.navigate('BottomTab')}
          >
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
              }}>
              Allow access
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.6,
  },
  animatedView: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});
