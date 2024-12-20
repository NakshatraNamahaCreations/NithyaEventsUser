import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
// import Feather from 'react-native-vector-icons/Feather';
// import * as ImagePicker from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';
import {Picker} from '@react-native-picker/picker';
// import Entypo from 'react-native-vector-icons/Entypo';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../utilities/UserContext';
import DeviceInfo from 'react-native-device-info';

const screenHeight = Dimensions.get('window').height;

const CompanyProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {userDataFromContext} = useUserContext();
  const imageData = route.params?.imagedata || {};
  const userData = route.params?.userData || {};
  const hasCheckout = route.params?.hasCheckout || '';
  // console.log(
  //   "user's value userDataFromContext addprofile page theought params from cart",
  //   userDataFromContext,
  // );
  // console.log("user's value in addprofile page theought params", imageData);
  // console.log('has checkout', hasCheckout);
  // console.log("Add profile user's value from reguster", userData);

  const [selectedCategory, setSelectedCategory] = useState('');
  // const [checkedTerms1, setCheckedTerms1] = React.useState(false);
  // const [checkedTerms2, setCheckedTerms2] = React.useState(false);
  // const [gstUri, setGstUri] = useState('');
  // const [gstFileName, setGstFileName] = useState('');
  // const [MOAUri, setMOAUri] = useState('');
  // const [MOAFileName, setMOAFileName] = useState('');
  // const [panUri, setPanUri] = useState('');
  // const [panFileName, setPanFileName] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [gstNumber, setGSTNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [cin, setCIN] = useState('');
  const [tardeLisence, setTardeLisence] = useState('');
  const [isResponse, setIsResponse] = useState(false);

  const colorScheme = useColorScheme();

  const companyType = [
    {
      type: 'Private Limited',
    },
    {
      type: 'Partnership & LLP',
    },
    {
      type: 'Proprietorship',
    },
    {
      type: 'Limited',
    },
    {
      type: 'Others',
    },
  ];

  const animatedInput4 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedInput5 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedInput6 = useRef(new Animated.Value(-screenHeight)).current;

  const animatedInput1 = useRef(new Animated.Value(100)).current;
  const animatedInput2 = useRef(new Animated.Value(300)).current;
  const animatedInput3 = useRef(new Animated.Value(300)).current;
  const animatedButton = useRef(new Animated.Value(400)).current;
  const animatedRadio1 = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(animatedInput4, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedInput5, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedInput6, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedInput1, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedInput2, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedInput3, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedButton, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedRadio1, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    animatedInput4,
    animatedInput6,
    animatedInput5,
    animatedInput1,
    animatedInput2,
    animatedInput3,
    animatedButton,
    animatedRadio1,
  ]);

  // const resizeImage = async imageUri => {
  //   const resizedImage = await ImageResizer.createResizedImage(
  //     imageUri,
  //     800,
  //     600,
  //     'JPEG',
  //     80,
  //     0,
  //   );

  //   return resizedImage.uri;
  // };

  // const uploadGSTCert = () => {
  //   ImagePicker.launchImageLibrary({noData: true}, async response => {
  //     const source = {uri: response.uri};
  //     if (response.assets) {
  //       console.log('Gellery image:', response);
  //       const fileNAME = response.assets[0].fileName;
  //       const galleryPic = response.assets[0].uri;
  //       const resizedImageUri = await resizeImage(galleryPic);
  //       setGstUri(resizedImageUri);
  //       setGstFileName(fileNAME);
  //     }
  //   });
  // };
  // const uploadMOA = () => {
  //   ImagePicker.launchImageLibrary({noData: true}, async response => {
  //     const source = {uri: response.uri};
  //     if (response.assets) {
  //       console.log('Gellery image:', response);
  //       const fileNAME = response.assets[0].fileName;
  //       const galleryPic = response.assets[0].uri;
  //       const resizedImageUri = await resizeImage(galleryPic);
  //       setMOAUri(resizedImageUri);
  //       setMOAFileName(fileNAME);
  //     }
  //   });
  // };
  // const uploadPAN = () => {
  //   ImagePicker.launchImageLibrary({noData: true}, async response => {
  //     const source = {uri: response.uri};
  //     if (response.assets) {
  //       console.log('Gellery image:', response);
  //       const fileNAME = response.assets[0].fileName;
  //       const galleryPic = response.assets[0].uri;
  //       const resizedImageUri = await resizeImage(galleryPic);
  //       setPanUri(resizedImageUri);
  //       setPanFileName(fileNAME);
  //     }
  //   });
  // };
  // console.log('selectedCategory', selectedCategory);

  // const handleAddCompanyProfile = async () => {
  //   if (
  //     ((selectedCategory === 'Private Limited' ||
  //       selectedCategory === 'Limited' ||
  //       selectedCategory === 'Proprietorship' ||
  //       selectedCategory === 'Partnership & LLP') &&
  //       !gstNumber) ||
  //     ((selectedCategory === 'Partnership & LLP' ||
  //       selectedCategory === 'Proprietorship') &&
  //       !panNumber) ||
  //     ((selectedCategory === 'Limited' ||
  //       selectedCategory === 'Private Limited') &&
  //       !cin) ||
  //     (selectedCategory === 'Proprietorship' && !tardeLisence)
  //   ) {
  //     Alert.alert('Error', 'Please fill all fields');
  //     return;
  //   }
  //   setIsResponse(true);
  //   try {
  //     const config = {
  //       url: `${apiUrl.UPDATE_VENDOR_PROFILE}${user._id}`,
  //       method: 'put',
  //       baseURL: apiUrl.BASEURL,
  //       headers: {'Content-Type': 'application/json'},
  //       data: {
  //         company_type: selectedCategory,
  //         company_name: companyName,
  //         designation: designation,
  //         gst_number: gstNumber,
  //         pan_number: panNumber,
  //         cin_number: cin,
  //         trade_license: tardeLisence,
  //       },
  //     };
  //     const response = await axios(config);
  //     if (response.status === 200) {
  //       // console.log('New user Data:', response.data.data);

  //       if (hasCheckout === false) {
  //         Alert.alert(
  //           'Success',
  //           response.data.success || 'Company Details Added Successfully!',
  //         );
  //         // const userData = response.data.data;
  //         // console.log('userData', userData);

  //         // await AsyncStorage.setItem('user', JSON.stringify(userData));
  //         navigation.navigate('Enable Location');
  //       } else {
  //         navigation.navigate('Order Summary', {
  //           imagedata: imageData,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log('Unknown error:', error);
  //     if (error.response && error.response.data) {
  //       Alert.alert('Error', error.response.data.message);
  //     } else {
  //       Alert.alert('Error', 'An unknown error occurred');
  //     }
  //   } finally {
  //     setIsResponse(false);
  //   }
  // };

  const checkLocationEnabled = async () => {
    try {
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      return isLocationEnabled;
    } catch (error) {
      console.error('Error checking location services', error);
      return false; // Return false if there's an error
    }
  };
  const handleAddCompanyProfile = async () => {
    // Define a message to show based on missing fields
    let errorMessage = '';
    if (!selectedCategory) {
      errorMessage = 'Please select a category';
    }

    // Validate GST Number for specific categories
    else if (
      [
        'Private Limited',
        'Limited',
        'Proprietorship',
        'Partnership & LLP',
      ].includes(selectedCategory) &&
      !gstNumber
    ) {
      errorMessage = 'GST Number is required.';
    }

    // Validate PAN Number for specific categories
    else if (
      ['Partnership & LLP', 'Proprietorship'].includes(selectedCategory) &&
      !panNumber
    ) {
      errorMessage = 'PAN Number is required.';
    }

    // Validate CIN for specific categories
    else if (
      ['Limited', 'Private Limited'].includes(selectedCategory) &&
      !cin
    ) {
      errorMessage = 'CIN is required.';
    }

    // Validate Trade License for Proprietorship
    else if (selectedCategory === 'Proprietorship' && !tardeLisence) {
      errorMessage = 'Trade License is required.';
    }

    // If there's an error message, show the alert and return early
    if (errorMessage) {
      Alert.alert('Error', errorMessage);
      return;
    }

    // If all fields are valid, proceed with the API call
    setIsResponse(true);
    try {
      const config = {
        url: `${apiUrl.UPDATE_VENDOR_PROFILE}${
          userDataFromContext !== null ? userDataFromContext._id : userData._id
        }`,
        method: 'put',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          company_type: selectedCategory,
          company_name: companyName,
          designation: designation,
          gst_number: gstNumber,
          pan_number: panNumber,
          cin_number: cin,
          trade_license: tardeLisence,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        if (hasCheckout === false) {
          Alert.alert(
            'Success',
            response.data.success || 'Company Details Added Successfully!',
          );

          // const isLocationEnabled = await checkLocationEnabled();
          // if (isLocationEnabled) {
          //   navigation.navigate('BottomTab');
          // } else {
          //   navigation.navigate('Enable Location');
          // }
          // navigation.navigate('BottomTab');
          // navigation.navigate('Enable Location', {userData: userData});
        } else {
          navigation.navigate('Order Summary', {
            imagedata: imageData,
          });
        }
      }
    } catch (error) {
      console.log('Unknown error:', error);
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    } finally {
      setIsResponse(false);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateX: animatedInput6}], marginBottom: 10},
        ]}>
        <Text
          style={{
            color: 'black',
            fontSize: 18,
            fontFamily: 'Montserrat-SemiBold',
          }}>
          Company Details
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateY: animatedInput6}]},
        ]}>
        <View
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            overflow: 'hidden',
            marginBottom: 5,
          }}>
          <Picker
            selectedValue={selectedCategory}
            itemStyle={{backgroundColor: 'white'}}
            style={{height: 50, width: '100%', color: 'black'}}
            onValueChange={itemValue => {
              if (itemValue !== selectedCategory) {
                setSelectedCategory(itemValue);
              }
            }}>
            <Picker.Item
              label="Company Type *"
              value=""
              style={{
                fontSize: 14,
                fontFamily: 'Montserrat-Regular',
                // letterSpacing: 1,
                color: colorScheme === 'dark' ? 'white' : '#757575',
              }}
            />
            {companyType.map((item, index) => (
              <Picker.Item
                key={index}
                label={item.type}
                value={item.type}
                style={{
                  color: colorScheme === 'dark' ? 'white' : 'black',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Regular',
                  // letterSpacing: 1,
                }}
              />
            ))}
          </Picker>
          {/* <View style={{position: 'absolute', right: 20, top: 16}}>
            <Entypo name="chevron-down" size={20} color="black" />
          </View> */}
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateY: animatedInput6}]},
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Company Name *"
          placeholderTextColor="gray"
          value={companyName}
          onChangeText={name => setCompanyName(name)}
        />
      </Animated.View>
      {selectedCategory !== 'Others' ? (
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <TextInput
            style={styles.input}
            placeholder="Designation *"
            placeholderTextColor="gray"
            value={designation}
            onChangeText={des => setDesignation(des)}
          />
        </Animated.View>
      ) : null}
      {selectedCategory !== 'Others' && (
        <>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              fontFamily: 'Montserrat-Medium',
              marginLeft: 5,
            }}>
            TDS *
          </Text>
          <Animated.View
            style={[
              styles.animatedView,
              {transform: [{translateY: animatedInput6}]},
            ]}>
            <TextInput
              style={[styles.input, {backgroundColor: '#d5d5d5'}]}
              placeholder="TDS *"
              placeholderTextColor="gray"
              value="2"
            />
          </Animated.View>
        </>
      )}
      {/* <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateY: animatedInput6}]},
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="gray" 
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateY: animatedInput6}]},
        ]}>
        <TextInput
          style={styles.input}
          placeholder="MCA Panel Member (Optional)"
          placeholderTextColor="gray" 
        />
      </Animated.View> */}
      {(selectedCategory === 'Private Limited' ||
        selectedCategory === 'Limited' ||
        selectedCategory === 'Proprietorship' ||
        selectedCategory === 'Partnership & LLP') && (
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <TextInput
            style={[styles.input]}
            placeholder="GST Number *"
            placeholderTextColor="gray"
            value={gstNumber}
            onChangeText={gst => setGSTNumber(gst)}
          />
        </Animated.View>
      )}
      {(selectedCategory === 'Partnership & LLP' ||
        selectedCategory === 'Proprietorship') && (
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <TextInput
            style={[styles.input]}
            placeholder="PAN Number *"
            placeholderTextColor="gray"
            maxLength={10}
            value={panNumber}
            onChangeText={pan => setPanNumber(pan)}
          />
        </Animated.View>
      )}
      {(selectedCategory === 'Limited' ||
        selectedCategory === 'Private Limited') && (
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <TextInput
            style={[styles.input]}
            placeholder="CIN *"
            placeholderTextColor="gray"
            maxLength={10}
            value={cin}
            onChangeText={cin => setCIN(cin)}
          />
        </Animated.View>
      )}
      {selectedCategory === 'Proprietorship' && (
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <TextInput
            style={[styles.input]}
            placeholder="Trade License *"
            placeholderTextColor="gray"
            value={tardeLisence}
            onChangeText={license => setTardeLisence(license)}
          />
        </Animated.View>
      )}

      <Animated.View
        style={[
          styles.animatedView,
          {transform: [{translateX: animatedButton}]},
        ]}>
        <TouchableOpacity
          style={{
            backgroundColor: '#7460e4',
            // height: 50,
            padding: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            borderColor: 'transparent',
            elevation: 3,
            marginTop: '5%',
            marginHorizontal: 70,
          }}
          onPress={handleAddCompanyProfile}>
          {isResponse ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: 15,
                fontFamily: 'Montserrat-Medium',
              }}>
              Submit
            </Text>
          )}
        </TouchableOpacity>
        {/* {hasCheckout === false && (
          <TouchableOpacity
            style={{
              // backgroundColor: '#9a9a9a2b',
              // height: 50,
              // borderColor: '#9a9a9a',
              // borderWidth: 1,
              // padding: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // borderRadius: 50,
              marginTop: '3%',
              // marginHorizontal: 70,
              // elevation: 1,
            }}
            onPress={() => navigation.navigate('Enable Location')}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Montserrat-Medium',
                textDecorationLine: 'underline',
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        )} */}
      </Animated.View>
    </View>
  );
};

export default CompanyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 14,
    borderRadius: 10,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  animatedView: {
    // marginBottom: 16, // Adjust spacing between animated elements
    // marginBottom: 5,
  },
});
