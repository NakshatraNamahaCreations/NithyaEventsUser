import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

// Initialize Google Geocoding
Geocoder.init('AIzaSyBF48uqsKVyp9P2NlDX-heBJksvvT_8Cqk');

function EnableLocation({navigation}) {
  const [address, setAddress] = useState({address: '', markerCoordinate: {}});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    checkAndRequestLocation();
  }, []);

  const checkAndRequestLocation = async () => {
    try {
      const locationPermissionGranted = await requestLocationPermission();
      if (locationPermissionGranted) {
        checkLocationServices();
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission granted');
        return true;
      } else {
        console.log('Location permission denied');
        Alert.alert('Permission Denied', 'Location permission is required.');
        return false;
      }
    } catch (err) {
      console.warn('Error checking location permissions:', err);
      return false;
    }
  };

  const checkLocationServices = async () => {
    try {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: `
          <h3 style="text-align: left;">Location Permission</h3>
          <p style="text-align: left;">
           Allow <b>Nithyaevent</b> to access this device's location?              
          </p>
        `,
        ok: 'ALLOW',
        cancel: 'DENY',
      })
        .then(function (success) {
          // When location services are enabled, get the current location
          getLocation();
        })
        .catch(function (error) {
          Alert.alert(
            'Location Services',
            'Please enable Location Services to use this application.',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => LocationServicesDialogBox.forceCloseDialog(),
              },
            ],
          );
        });
    } catch (err) {
      console.warn('Error checking location services:', err);
    }
  };

  const getLocation = async () => {
    setIsModalVisible(true);
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 10000,
        });
      });

      const {latitude, longitude} = position.coords;

      Geocoder.from(latitude, longitude)
        .then(data => {
          console.log('full format location', data);
          const fetchedAddress = data.results[0]?.formatted_address;
          // Extract city name
          const addressComponents = data.results[0]?.address_components;

          let city = '';
          for (let component of addressComponents) {
            if (
              component.types.includes('locality') || // City level
              component.types.includes('administrative_area_level_2') || // District level
              component.types.includes('sublocality') // Sublocality (if city not available)
            ) {
              city = component.long_name;
              break; // Stop when we find the first relevant component
            }
          }
          const newAddress = {
            address: fetchedAddress,
            markerCoordinate: {latitude, longitude},
          };

          console.log('Full Address:', fetchedAddress);
          console.log('City Name:', city);

          // Store the fetched address in AsyncStorage
          AsyncStorage.setItem('address', JSON.stringify(newAddress));
          setAddress(newAddress);
          setIsModalVisible(false);
          navigation.navigate('Calender');
        })
        .catch(error => {
          console.error('Error fetching address:', error);
          setIsModalVisible(false);
        });
    } catch (error) {
      console.error('Error getting location:', error);
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    // Load the address from AsyncStorage once on component mount
    const loadStoredAddress = async () => {
      try {
        const storedAddress = await AsyncStorage.getItem('address');
        if (storedAddress) {
          setAddress(JSON.parse(storedAddress));
        }
      } catch (error) {
        console.error('Error loading stored address:', error);
      }
    };

    loadStoredAddress();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../../assets/LocationMarker.gif')} />
        <Text style={styles.addressText}>
          {address?.address || 'Fetching address...'}
        </Text>
      </View>
      {isModalVisible && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    padding: 5,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default EnableLocation;
