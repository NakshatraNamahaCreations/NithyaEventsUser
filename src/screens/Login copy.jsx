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

const screenHeight = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default function Login() {
  const [showEye, setShowEye] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // For handling loading state
  const navigation = useNavigation();
  const [errorText, setErrorText] = useState('');

  const background = require('../../assets/background.mp4');

  const animatedTop1 = useRef(new Animated.Value(-screenHeight)).current;
  const animatedTop2 = useRef(new Animated.Value(-screenHeight)).current;

  const animatedInput1 = useRef(new Animated.Value(100)).current;
  const animatedInput2 = useRef(new Animated.Value(300)).current;
  const animatedButton = useRef(new Animated.Value(400)).current;

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
      setErrorText('Email and password are required');
      return;
    }

    setLoading(true);
    setErrorText(''); // Clear any previous errors before making a new request

    try {
      const response = await axios.post(
        'http://192.168.1.67:9000/api/user/login',
        {
          email,
          password,
        },
      );
      setLoading(false);
      setEmail('');
      setPassword('');
      // Navigate to the home page if login is successful
      navigation.navigate('BottomTab');
    } catch (error) {
      setLoading(false);
      // Set error message from backend response
      setErrorText(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/pexels-background.jpg')}
        style={styles.backgroundVideo}
      />
      <View style={styles.overlay}></View>
      <View style={{position: 'absolute', zIndex: 2, width: '100%'}}>
        <View style={{padding: 20}}>
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
            <Text>email not match</Text>
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

          {errorText ? (
            <Text
              style={{
                color: 'red',
                fontFamily: 'Poppins-Regular',
                textAlign: 'center',
              }}>
              {errorText}
            </Text>
          ) : null}

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
                  color: 'black',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    height: '100%',
    width: width,
  },
  title: {
    color: 'white',
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
  },
  otpBtn: {
    backgroundColor: '#9a9a9a',
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
