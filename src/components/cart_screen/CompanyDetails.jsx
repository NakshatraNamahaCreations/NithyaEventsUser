import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenHeight = Dimensions.get('window').height;

const CompanyDetails = ({route}) => {
  const navigation = useNavigation();
  const {imagedata} = route.params;
  const [selectedCategory, setSelectedCategory] = useState('');
  const [checkedTerms1, setCheckedTerms1] = React.useState(false);
  const [checkedTerms2, setCheckedTerms2] = React.useState(false);
  const [gstUri, setGstUri] = useState('');
  const [gstFileName, setGstFileName] = useState('');
  const [MOAUri, setMOAUri] = useState('');
  const [MOAFileName, setMOAFileName] = useState('');
  const [panUri, setPanUri] = useState('');
  const [panFileName, setPanFileName] = useState('');
  console.log('imagedata', imagedata);

  const [companyname, setcompanyname] = useState('');
  const [designation, setdesignation] = useState('');
  const [name, setname] = useState('');
  const [panelnumber, setpanelnumber] = useState('');
  const [gst, setgst] = useState('');
  const [pan, setpan] = useState('');
  const [moa, setmoa] = useState('');
  const [loading, setLoading] = useState(false); // For handling loading state
  const [vendorAsync, setVendorAsync] = useState(null);

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setVendorAsync(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };

    getVendorData();
  }, []);

  console.log('vendorAsync', vendorAsync);

  const updateProfile = async () => {
    const payload = {
      company_type: selectedCategory,
      company_name: companyname,
      designation: designation,
      name: name,
      mca_panel_member_name: panelnumber,
      gst_number: gst,
      pan_number: pan,
      moa_number: moa,
    };
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.1.67:9000/api/user/updateprofile/${vendorAsync._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (response.ok) {
        console.log('Profile updated:', data);
        alert('profile updated');
        setLoading(false);
        navigation.navigate('Order Summary', {imagedata: imagedata});
        // await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
      } else {
        console.error('Error updating profile:', data.error);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  const colorScheme = useColorScheme();

  const companyType = [
    // {
    //   type: 'Select',
    // },
    {
      type: 'Private Limited',
    },
    {
      type: 'Partnership',
    },
    {
      type: 'Proprietorship',
    },
    {
      type: 'Trust',
    },
    {
      type: 'Others',
    },
  ];

  const resizeImage = async imageUri => {
    const resizedImage = await ImageResizer.createResizedImage(
      imageUri,
      800,
      600,
      'JPEG',
      80,
      0,
    );

    return resizedImage.uri;
  };

  const uploadGSTCert = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      const source = {uri: response.uri};
      if (response.assets) {
        console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setGstUri(resizedImageUri);
        setGstFileName(fileNAME);
      }
    });
  };
  const uploadMOA = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      const source = {uri: response.uri};
      if (response.assets) {
        console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setMOAUri(resizedImageUri);
        setMOAFileName(fileNAME);
      }
    });
  };
  const uploadPAN = () => {
    ImagePicker.launchImageLibrary({noData: true}, async response => {
      const source = {uri: response.uri};
      if (response.assets) {
        console.log('Gellery image:', response);
        const fileNAME = response.assets[0].fileName;
        const galleryPic = response.assets[0].uri;
        const resizedImageUri = await resizeImage(galleryPic);
        setPanUri(resizedImageUri);
        setPanFileName(fileNAME);
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{marginBottom: 10}}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            Company Details
          </Text>
        </View>
        <View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 10,
              overflow: 'hidden',
              marginBottom: 5,
              fontSize: 13,
            }}>
            <Picker
              selectedValue={selectedCategory}
              style={{height: 50, width: '100%', color: 'black'}}
              onValueChange={itemValue => {
                if (itemValue !== selectedCategory) {
                  setSelectedCategory(itemValue);
                }
              }}>
              <Picker.Item
                label="Company Type"
                value=""
                style={{
                  fontSize: 13,
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
                    fontSize: 13,
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
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Company Name"
            placeholderTextColor="gray"
            value={companyname}
            onChangeText={text => setcompanyname(text)}
            // activeUnderlineColor="#ea5362"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Designation"
            placeholderTextColor="gray"
            value={designation}
            onChangeText={text => setdesignation(text)}
            // activeUnderlineColor="#ea5362"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="gray"
            onChangeText={text => setname(text)}
            // activeUnderlineColor="#ea5362"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="MCA Panel Member (Optional)"
            placeholderTextColor="gray"
            value={panelnumber}
            onChangeText={text => setpanelnumber(text)}
            // activeUnderlineColor="#ea5362"
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="GST Number (Optional)"
            placeholderTextColor="gray"
            value={gst}
            onChangeText={text => setgst(text)}
            // activeUnderlineColor="#ea5362"
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            placeholder="PAN Number (Optional)"
            placeholderTextColor="gray"
            value={pan}
            onChangeText={text => setpan(text)}

            // activeUnderlineColor="#ea5362"
          />
        </View>

        <View>
          <TextInput
            style={styles.input}
            placeholder="MOA (Optional)"
            placeholderTextColor="gray"
            value={moa}
            onChangeText={text => setmoa(text)}
            maxLength={10}
            editable={false}
            // activeUnderlineColor="#ea5362"
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={{
          backgroundColor: '#9a9a9a',
          padding: 15,
          borderRadius: 7,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: 'transparent',
          marginBottom: 10,
          elevation: 1,
        }}
        // onPress={() =>
        //   navigation.navigate('Order Summary', {imagedata: imagedata})
        // }
        onPress={updateProfile}>
        <Text
          style={{
            color: 'black',
            fontSize: 15,
            fontFamily: 'Montserrat-SemiBold',
          }}>
          {loading ? 'Loading...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CompanyDetails;

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
    fontSize: 13,
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
