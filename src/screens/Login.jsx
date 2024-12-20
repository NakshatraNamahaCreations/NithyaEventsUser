import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  Dimensions,
  TextInput,
  Image,
  Alert, // For showing alerts
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios'; // Import axios for making API calls
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../api-services/api-constants';
import DeviceInfo from 'react-native-device-info';
import {useUserContext} from '../utilities/UserContext';

const screenHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Login() {
  const [showEye, setShowEye] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For handling loading state
  const navigation = useNavigation();
  const {setUserDataFromContext} = useUserContext();

  const background = require('../../assets/background.mp4');

  const animatedTop1 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedTop2 = useRef(new Animated.Value(-screenHeight)).current;

  const animatedInput1 = useRef(new Animated.Value(100)).current;
  const animatedInput2 = useRef(new Animated.Value(300)).current;
  const animatedButton = useRef(new Animated.Value(400)).current;

  const checkLocationEnabled = async () => {
    try {
      const isLocationEnabled = await DeviceInfo.isLocationEnabled();
      console.log(isLocationEnabled);
      return isLocationEnabled;
    } catch (error) {
      console.error('Error checking location services', error);
      return false;
    }
  };

  useEffect(() => {
    Animated.stagger(200, [
      Animated.timing(animatedTop1, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animatedTop2, {
        toValue: 0,
        duration: 600,
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
      Animated.timing(animatedButton, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    animatedTop1,
    animatedTop2,
    animatedInput1,
    animatedInput2,
    animatedButton,
  ]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const config = {
        url: apiUrl.USER_LOGIN,
        method: 'post',
        baseURL: apiUrl.BASEURL,
        headers: {'Content-Type': 'application/json'},
        data: {
          email: email,
          password: password,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        setUserDataFromContext(response.data.user);
        const isLocationEnabled = await checkLocationEnabled();
        if (isLocationEnabled) {
          navigation.navigate('Calender');
          // navigation.navigate('BottomTab');
        } else {
          navigation.navigate('Enable Location');
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('catch error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Image
        source={require('../../assets/pexels-background.jpg')}
        style={styles.backgroundVideo}
      /> */}
      {/* <View style={styles.overlay}></View> */}
      <View
        style={
          {
            // position: 'absolute',
            // zIndex: 2,
            // width: '100%',
            // backgroundColor: 'white',
          }
        }>
        <View style={{padding: 20}}>
          <Animated.View
            style={[
              styles.animatedView,
              {transform: [{translateX: animatedTop2}]},
            ]}>
            <Image
              source={require('../../assets/nithyaevent-round-2.jpeg')}
              style={styles.logoImahe}
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.animatedView,
              {transform: [{translateX: animatedTop2}]},
            ]}>
            <Text style={styles.title}>Sign in</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.animatedView,
              {transform: [{translateY: animatedInput1}]},
            ]}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#7d8592"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.animatedView,
              {transform: [{translateY: animatedInput2}]},
            ]}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7d8592"
                secureTextEntry={!showEye}
                value={password}
                onChangeText={setPassword}
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
              {transform: [{translateY: animatedInput2}]},
            ]}>
            <TouchableOpacity
              style={styles.otpBtn}
              onPress={handleLogin}
              disabled={loading} // Disable button when loading
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Montserrat-Medium',
                }}>
                {loading ? 'Logging in...' : 'Log in'}
              </Text>
            </TouchableOpacity>
            <Pressable>
              <Text
                style={{
                  color: '#7d8592',
                  fontSize: 15,
                  marginTop: 20,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                }}>
                Have you forgotten your password?
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'white',
    height: '100%',
  },
  backgroundVideo: {
    height: '100%',
    width: width,
  },
  logoImahe: {
    width: '100%',
    height: 100,
    resizeMode: 'center',
  },
  title: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    fontSize: 14,
    marginBottom: 5,
    paddingHorizontal: 15,
    borderColor: '#9a9a9a',
    borderWidth: 1,
  },
  otpBtn: {
    backgroundColor: '#7460e4',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderColor: 'transparent',
    elevation: 3,
    marginTop: '5%',
    marginHorizontal: 100,
  },
  animatedView: {
    marginBottom: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.7,
  },
});
