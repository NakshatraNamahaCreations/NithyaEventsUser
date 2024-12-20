import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

export default function HeaderNew({vendorAsync, location}) {
  const navigation = useNavigation();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const placeholderTexts = [
    "Search for 'Vendor'",
    "Search for 'Shop'",
    "Search for 'Vendor'",
    "Search for 'Shop'",
  ];
  const placeholderText = new Animated.Value(0);

  useEffect(() => {
    animatePlaceholder();
  }, []);

  const animatePlaceholder = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(placeholderText, {
          toValue: 1,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(placeholderText, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    ).start(() => {
      setPlaceholderIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
    });
  };

  return (
    <LinearGradient colors={['#9a9a9a', '#9a9a9a']}>
      <View style={{paddingTop: 10}}>
        {/* <Image
        style={{
          width: '100%',
          height: 350,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          resizeMode: 'cover',
        }}
        source={require('../../../assets/kiru-01.jpg')}
        // source={{
        //   uri: 'https://media.istockphoto.com/id/613517724/photo/light-of-colorful-background.jpg?s=1024x1024&w=is&k=20&c=E14N0zfjY66QFsC0Tr3s0mlHSNhM06c55dTcserOPQg=',
        // }}
      /> */}
        {/* <View
          style={
            {
              // position: 'absolute', width: '100%',
              // marginTop: 3,
            }
          }> */}
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <View style={{flex: 0.8}}>
            <Text
              style={{
                fontSize: 20,
                color: 'black',
                // letterSpacing: 1,
                // marginBottom: 10,
                // padding: 20,
                fontFamily: 'bookmanoldstyle_bold',
              }}>
              {vendorAsync?.username}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                color: 'black',
                marginBottom: 5,
                width: 250,
                fontFamily: 'Montserrat-Medium',
              }}>
              {location?.address || ''}
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity style={{paddingHorizontal: 10}}>
              <Fontisto
                name="date"
                color="#7460e4"
                size={20}
                onPress={() => {
                  navigation.navigate('Calender');
                }}
                // onPress={enableCalendar}
                style={{
                  backgroundColor: 'white',
                  // borderColor: '#757575',
                  // borderWidth: 1,
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  paddingTop: 9,
                  borderRadius: 50,
                  flexDirection: 'row',
                  elevation: 3,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="notifications-outline"
                color="#7460e4"
                size={26}
                onPress={() => {
                  navigation.navigate('Notifications');
                }}
                style={{
                  backgroundColor: 'white',
                  // borderColor: '#757575',
                  // borderWidth: 1,
                  width: 40,
                  height: 40,
                  textAlign: 'center',
                  paddingTop: 7,
                  borderRadius: 50,
                  flexDirection: 'row',
                  elevation: 3,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            paddingRight: 10,
            // marginTop: 10,
          }}
          onPress={() => navigation.navigate('Search')}>
          <Feather
            name="search"
            size={19}
            color="#7460e4"
            style={{
              position: 'absolute',
              zIndex: 11111,
              left: 20,
              top: 13,
            }}
          />
          <View
            style={{
              backgroundColor: 'white',
              elevation: 3,
              borderRadius: 10,
              width: '100%',
              borderWidth: 1,
              borderColor: 'transparent',
              height: 45,
              padding: 5,
              paddingLeft: 40,
              paddingRight: 60,
              marginBottom: 10,
            }}
            editable={false}
            // placeholder={placeholderText.interpolate({
            //   inputRange: [0, 0.5, 1],
            //   outputRange: [
            //     "Search for 'vendor'",
            //     "Search for 'shop'",
            //     "Search for 'vendor'",
            //   ],
            // })}
          >
            <Text
              style={{
                color: '#737373',
                fontSize: 15,
                fontFamily: 'Montserrat-Medium',
                marginTop: 6,
              }}>
              Search Products...
            </Text>
          </View>
          {/* <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                zIndex: 11111,
                right: 30,
                top: 6,
                alignItems: 'center',
              }}>
              <Text style={{color: '#e0e0e0', letterSpacing: 1, fontSize: 20}}>
                {' '}
                |{' '}
              </Text>
              <TouchableOpacity>
                <Feather name="mic" size={20} color="black" />
              </TouchableOpacity>
            </View> */}
        </Pressable>
        {/* </View> */}
      </View>
    </LinearGradient>
  );
}

// background: rgb(47,78,158);
// background: linear-gradient(180deg, rgba(47,78,158,1) 35%, rgba(17,28,56,1) 100%);

const styles = StyleSheet.create({
  logo: {
    width: 40,
    height: 40,
  },
  categories: {flex: 0.3, padding: 15, alignItems: 'center'},
  categoryText: {
    color: 'white',
    fontSize: 12,
  },
});
