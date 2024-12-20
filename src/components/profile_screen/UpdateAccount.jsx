import {
  Dimensions,
  Image,
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
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import {Picker} from '@react-native-picker/picker';
import {useUserContext} from '../../utilities/UserContext';

function UpdateAccount({navigation}) {
  const {userDataFromContext} = useUserContext();
  // console.log(
  //   'userDataFromContext in the update acoount',
  //   userDataFromContext,
  // );

  const [userName, setUserName] = useState(userDataFromContext.username || '');
  const [email, setEmail] = useState(userDataFromContext.email || '');
  const [phone, setPhone] = useState(userDataFromContext.mobilenumber || '');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [companyName, setCompanyName] = useState(userDataFromContext);
  const [designation, setDesignation] = useState(userDataFromContext);
  const [mDName, setMDName] = useState('Jimin');
  const [mcaPanelNumber, setMcaPanelNumber] = useState('L17110MH1973PLC019786');
  const [gstNumber, setGstNumber] = useState('29AAACH7409R1ZX');

  const [gstUri, setGstUri] = useState('');
  const [gstFileName, setGstFileName] = useState('');
  const [MOAUri, setMOAUri] = useState('');
  const [MOAFileName, setMOAFileName] = useState('');
  const [panUri, setPanUri] = useState('');
  const [panFileName, setPanFileName] = useState('');
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
    //   {
    //     type: 'Individual',
    //   },
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
    <>
      <View
        style={{
          padding: 15,
          backgroundColor: 'white',
          height: '100%',
        }}>
        <ScrollView>
          <Text
            style={{
              color: 'black',
              fontSize: 13,
              fontFamily: 'Montserrat-SemiBold',
              marginVertical: 10,
            }}>
            BASIC DETAILS
          </Text>
          {/* <TextInput
            placeholder="NAME"
            placeholderTextColor="#7d8592"
            textColor="black"
            underlineColor="black"
            activeUnderlineColor="#ea5362"
            autoCapitalize="none"
            style={styles.input}
            onChangeText={text => setUserName(text)}
            value={userName}
          />
          <TextInput
            placeholder="PHONE NUMBER"
            placeholderTextColor="#7d8592"
            textColor="black"
            underlineColor="black"
            activeUnderlineColor="#ea5362"
            style={styles.input}
            value={phone}
            onChangeText={text => setPhone(text)}
          />
          <TextInput
            placeholder="EMAIL ADDRESS"
            placeholderTextColor="#7d8592"
            textColor="black"
            underlineColor="black"
            activeUnderlineColor="#ea5362"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={text => setEmail(text)}
          /> */}
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                marginVertical: 10,
              }}>
              Name:
            </Text>
            <View style={styles.input}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                {userDataFromContext.username}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                marginVertical: 10,
              }}>
              Email Id:
            </Text>
            <View style={styles.input}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                {userDataFromContext.email}
              </Text>
            </View>
          </View>

          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-Medium',
                marginVertical: 10,
              }}>
              Mobile Number:
            </Text>
            <View style={styles.input}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                {userDataFromContext.mobilenumber}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
                marginVertical: 10,
              }}>
              COMPANY DETAILS
            </Text>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                Company Name:
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.company_name}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                Company Type:
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.company_type}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                Designation:
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.designation}
                </Text>
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                PAN Card
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.pan_number}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{flex: 0.5}}>
                <Image
                  source={
                    userDataFromContext.company_profile[0]?.pan_front_image
                      ? {
                          uri: userDataFromContext.company_profile[0]
                            ?.pan_front_image,
                        }
                      : require('../../../assets/default-fallback-image.png') // Local fallback image
                  }
                  style={{width: '100%', height: 100, resizeMode: 'contain'}}
                />
              </View>
              <View style={{flex: 0.5}}>
                <Image
                  source={
                    userDataFromContext.company_profile[0]?.pan_back_image
                      ? {
                          uri: userDataFromContext.company_profile[0]
                            ?.pan_back_image,
                        }
                      : require('../../../assets/default-fallback-image.png') // Local fallback image
                  }
                  style={{width: '100%', height: 100, resizeMode: 'contain'}}
                />
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                GST Number
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.gst_number}
                </Text>
              </View>
            </View>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}>
                CIN Number
              </Text>
              <View style={styles.input}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 13,
                    fontFamily: 'Montserrat-Medium',
                    marginVertical: 10,
                  }}>
                  {userDataFromContext.company_profile[0]?.cin_number}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      {/* <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          position: 'absolute',
          bottom: 1,
          width: '100%',
        }}>
        <TouchableOpacity
          style={{
            // marginTop: 20,
            backgroundColor: '#9a9a9a',
            padding: 15,
            borderRadius: 5,
            elevation: 3,
            // marginBottom: 20,
          }}
          onPress={() => {
            navigation.navigate('You');
          }}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Montserrat-Medium',
              textAlign: 'center',
              fontSize: 18,
              // letterSpacing: 1,
            }}>
            UPDATE PROFILE
          </Text>
        </TouchableOpacity>
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    color: 'black',
    fontSize: 14,
    borderRadius: 10,
    fontFamily: 'Montserrat-Medium',
    marginBottom: 5,
    paddingHorizontal: 10,
  },
});

export default UpdateAccount;
