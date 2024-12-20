import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiUrl} from '../api-services/api-constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import * as ImagePicker from 'react-native-image-picker';
// import ImageResizer from 'react-native-image-resizer';

const screenHeight = Dimensions.get('window').height;

export default function Register() {
  const [showEye, setShowEye] = useState(false);
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [emailId, setEmailId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isResponse, setIsResponse] = useState(false);

  const animatedInput4 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedInput5 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedInput6 = useRef(new Animated.Value(-screenHeight)).current;

  const animatedInput1 = useRef(new Animated.Value(100)).current;
  const animatedInput2 = useRef(new Animated.Value(300)).current;
  const animatedInput3 = useRef(new Animated.Value(300)).current;
  const animatedButton = useRef(new Animated.Value(400)).current;
  const animatedRadio1 = useRef(new Animated.Value(400)).current;
  // const animatedRadio2 = useRef(new Animated.Value(400)).current;

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

  const handleSubmit = async () => {
    if (!userName || !mobileNumber || !emailId || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setIsResponse(true);
    try {
      const config = {
        url: apiUrl.USER_REGISTER,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          username: userName,
          mobilenumber: mobileNumber,
          email: emailId,
          password: password,
        },
      };
      const response = await axios(config);
      if (response.status === 201) {
        // console.log('New user Data:', response.data.newUser);
        Alert.alert('Success', response.data.message);
        const userData = response.data.newUser;
        // await AsyncStorage.setItem('user', JSON.stringify(userData));
        navigation.navigate('AddProfile', {
          userData: userData,
          // hasCheckout: false,
        });
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
          {transform: [{translateX: animatedInput4}]},
        ]}>
        <Ionicons
          name="arrow-back"
          size={25}
          color="black"
          style={{paddingLeft: 15, marginVertical: 20}}
          onPress={() => navigation.goBack()}
        />
      </Animated.View>
      <View style={{paddingLeft: 20, paddingRight: 20}}>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateX: animatedInput5}], marginBottom: 10},
          ]}>
          <Text style={styles.title}>Sign up</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput1}]},
          ]}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="gray"
            value={userName}
            onChangeText={val => setUserName(val)}
            // activeUnderlineColor="#ea5362"
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput2}]},
          ]}>
          <TextInput
            style={styles.input}
            placeholder="Email id"
            placeholderTextColor="gray"
            keyboardType="email-address"
            value={emailId}
            onChangeText={val => setEmailId(val.toLowerCase())}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput3}]},
          ]}>
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor="gray"
            keyboardType="number-pad"
            maxLength={10}
            value={mobileNumber}
            onChangeText={val => setMobileNumber(val)}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateY: animatedInput6}]},
          ]}>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Create New Password"
              placeholderTextColor="gray"
              secureTextEntry={!showEye}
              value={password}
              onChangeText={val => setPassword(val)}
            />
            <TouchableOpacity
              style={{position: 'absolute', right: 15, top: 13}}
              onPress={() => setShowEye(prev => !prev)}>
              <Ionicons
                name={showEye ? 'eye-outline' : 'eye-off-outline'}
                color="black"
                size={25}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <Animated.View
          style={[
            styles.animatedView,
            {transform: [{translateX: animatedButton}]},
          ]}>
          <TouchableOpacity style={styles.otpBtn} onPress={handleSubmit}>
            {isResponse ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Next
              </Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 50,
    resizeMode: 'cover',
    marginBottom: 32,
  },
  title: {
    color: 'black',
    fontSize: 20,
    // marginBottom: 15,
    fontFamily: 'Montserrat-SemiBold',
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
  otpBtn: {
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
  },
  animatedView: {
    // marginBottom: 16, // Adjust spacing between animated elements
    // marginBottom: 5,
  },
  textContainer: {
    position: 'relative',
    // top: ,
    borderRadius: 10,
  },
  textContainer1: {
    position: 'relative',
    // top: 30,
    borderRadius: 10,
  },
  text: {
    color: '#878787',
    fontFamily: 'Montserrat-Medium',
  },
  link: {
    textDecorationLine: 'underline',
    textDecorationColor: '#878787',
  },
});
