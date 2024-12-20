import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {View, Text, TextInput} from 'react-native';
import Geocoder from 'react-native-geocoding';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MapView, {Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {useUserContext} from '../../utilities/UserContext';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useAddressContext} from '../../utilities/AddressContext';
import {apiUrl} from '../../api-services/api-constants';
import THEMECOLOR from '../../utilities/color';

function AddAddress() {
  const navigation = useNavigation();
  const {userDataFromContext} = useUserContext();
  const [searchText, setSearchText] = useState('');
  const {setAddressDataContext} = useAddressContext(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [region, setRegion] = useState({
    latitude: 12.900724675418454,
    longitude: 77.52341310849678,
    latitudeDelta: 0.015, // Zoom level
    longitudeDelta: 0.0121, // Zoom level
  });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    Geocoder.init('AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g');
  }, []);

  const uniqueKey = uuidv4();

  // console.log('selectedRegion', selectedRegion);
  // console.log('region', region);

  const formattedData = {
    id: uniqueKey,
    selected_region: selectedRegion,
    latitude: region.latitude,
    longitude: region.longitude,
    latitudeDelta: region.latitudeDelta,
    longitudeDelta: region.longitudeDelta,
  };

  const addAddress = async () => {
    if (selectedRegion === '') {
      Alert.alert('Please select a location');
      return;
    }
    setIsLoading(true);
    try {
      const config = {
        url: `${apiUrl.ADD_ADDRESS}${userDataFromContext._id}`,
        // url: `${apiUrl.ADD_ADDRESS}${userDataFromContext._id}`,
        method: 'put',
        // baseURL: 'https://api.nithyaevent.com/api',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          saved_address: formattedData,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        Alert.alert('Success', 'Address added successfully');
        console.log('Address in successResponse>>>>', response);

        // setAddressDataContext(response.data.saved_address);
        navigation.navigate('My Cart');
      } else {
        Alert.alert('Error', 'Failed to add the address. Please try again.');
        console.log('Error response:', response);
      }
    } catch (error) {
      console.error('Error adding address:', error);
      Alert.alert('Error', 'An error occurred while adding the address.');
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row', // Ensures both items are in the same row
          // alignItems: 'center', // Align items vertically in the center
          padding: 10,
          backgroundColor: 'white',
          elevation: 2,
          zIndex: 111111,
        }}>
        <Ionicons
          style={{flex: 0.1, marginTop: 11}} // Add margin to create space between the icon and the search bar
          name="chevron-back"
          color="black"
          size={25}
          onPress={() => navigation.navigate('My Cart')}
        />
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // console.log('data', data);
            // console.log('details>>>>', details);
            if (details) {
              const {lat, lng} = details.geometry?.location;
              setRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              });
              setMarkerPosition({latitude: lat, longitude: lng});
              setSelectedRegion(data.description);
            }
          }}
          fetchDetails={true} // Fetch details like lat/lng
          query={{
            key: 'AIzaSyDLyeYKWC3vssuRVGXktAT_cY-8-qHEA_g',
            language: 'en',
          }}
          styles={{
            textInput: {
              borderColor: '#7a7a7a',
              borderWidth: 1,
              borderRadius: 15,
              // width: '100%',
              height: 50,
              padding: 5,
              flex: 0.9,
              color: 'black',
              fontFamily: 'Montserrat-Medium',
              fontSize: 16,
              paddingLeft: 16,
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            container: {
              flex: 1, // Allow GooglePlacesAutocomplete to take up remaining space
              zIndex: 1, // Ensure suggestions appear above other elements
            },
            listView: {
              zIndex: 2, // Ensure that the listView appears above other elements
            },
            row: {
              backgroundColor: '#ffffff', // Background color of suggestion rows
              padding: 13,
              height: 44,
              flexDirection: 'row',
            },
            description: {
              color: 'black', // This sets the text color of the suggestion results to black
              fontFamily: 'Montserrat-Medium', // Optional: Keep font consistent
            },
            separator: {
              height: 0.5,
              backgroundColor: '#c8c7cc', // Line between suggestions
            },
          }}
          textInputProps={{
            value: searchText,
            onChangeText: text => setSearchText(text),
            placeholderTextColor: '#999999',
          }}
        />
      </View>
      {/* <MapView
        style={StyleSheet.absoluteFillObject}
        region={region} // Update map's region based on search result
        onRegionChangeComplete={region => setRegion(region)}>
        {markerPosition && (
          <Marker
            coordinate={markerPosition} // Show marker at the selected place
            title="Selected Location"
          />
        )}
      </MapView> */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        region={region}
        showsUserLocation>
        {markerPosition && (
          <Marker coordinate={markerPosition} title="Selected Location" />
        )}
      </MapView>
      {selectedRegion !== null && (
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            position: 'absolute',
            bottom: 1,
            width: '100%',
            paddingTop: 20,
          }}>
          <View style={{marginTop: 5, flexDirection: 'row', flex: 1}}>
            <View style={{flex: 0.1}}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                }}>
                📍
              </Text>
            </View>
            <View style={{flex: 0.9}}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                }}>
                {selectedRegion}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: isLoading ? 'gray' : THEMECOLOR.mainColor, // Disable color when loading
              padding: 10,
              borderRadius: 7,
              marginTop: 30,
              elevation: 3,
              marginHorizontal: 50,
            }}
            onPress={!isLoading ? addAddress : null} // Prevent multiple clicks
            disabled={isLoading} // Disable button during loading
          >
            {isLoading ? (
              <ActivityIndicator color="white" /> // Show loader
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Montserrat-Medium',
                  textAlign: 'center',
                }}>
                Save Location
              </Text>
            )}
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: '#7460e4',
              padding: 15,
              borderRadius: 5,
              marginBottom: 20,
              elevation: 3,
            }}
            onPress={addAddress}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              Save Location
            </Text>
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
}

export default AddAddress;
