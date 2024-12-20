import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
// import {services} from '../../data/global-data';
import {useNavigation} from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
import djAnimation from '../../../assets/category/dj.json';
import microphoneAnimation from '../../../assets/category/microphone.json';
import cateringAnimation from '../../../assets/category/catering.json';
import photoCameraAnimation from '../../../assets/category/photo-camera.json';
import videoCameraAnimation from '../../../assets/category/video-camera.json';
import hotelAnimation from '../../../assets/category/hotel.json';
import sunbedAnimation from '../../../assets/category/sunbed.json';
import awardCeremonyAnimation from '../../../assets/category/award-ceremony.json';
// import LottieView from 'lottie-react-native';
// import LinearGradient from 'react-native-linear-gradient';

export default function Service({serviceListData}) {
  // console.log('serviceListData in service component', serviceListData);

  const navigation = useNavigation();

  const colorPalette = [
    {
      color: '#8e7ff0',
    },
    {
      color: '#a89cf5',
    },
    {
      color: '#c3b9fa',
    },
    {
      color: '#ddd6ff',
    },
    {
      color: '#f2edff',
    },
    {
      color: '#fbf8ff',
    },
  ];

  return (
    // <LinearGradient
    //   start={{x: 0, y: 0}}
    //   end={{x: 1, y: 0}}
    //   colors={['#fae4f1', '#f1f7dd', '#ffe6ec']}
    //   style={{paddingVertical: 10}}>
    // <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
    // <View style={{flexDirection: 'row', margin: 10}}>
    //   {services.map((category, index) => (
    //     <View
    //       style={{
    //         flex: 1 / 3,
    //         alignItems: 'center',
    //         marginRight: 20,
    //         flexWrap: 'wrap',
    //       }}>
    //       <LinearGradient
    //         start={{x: 0, y: 0}}
    //         end={{x: 1, y: 0}}
    //         colors={['#ffb133cc', '#ffb1335e']}
    //         style={{
    //           paddingVertical: 10,
    //           alignItems: 'center',
    //           borderRadius: 8,
    //           borderWidth: 2,
    //           borderColor: 'white',
    //           justifyContent: 'center',
    //           height: 110,
    //           width: 110,
    //         }}>
    //         <Pressable key={index} style={{}}>
    //           <Image
    //             source={category.imageUrl}
    //             style={{
    //               height: 60,
    //               width: 60,
    //             }}
    //           />
    //           <Text
    //             style={{
    //               color: 'black',
    //               fontFamily: 'Poppins-Medium',
    //               marginTop: 5,
    //               textAlign: 'center',
    //             }}>
    //             {category.categoryName}
    //           </Text>
    //         </Pressable>
    //       </LinearGradient>
    //     </View>
    //   ))}
    // </View>

    // </ScrollView>
    // </LinearGradient>

    // <LinearGradient
    //   start={{x: 0, y: 0}}
    //   end={{x: 1, y: 0}}
    //   colors={['#bef1e3', '#3f51b557', '#ffe6ec']}>
    <View>
      <View style={styles.container}>
        {serviceListData?.slice(0, 6).map((category, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate('ServiceCategory', {
                serviceList: category,
              })
            }
            style={[
              styles.categoryContainer,
              {
                borderColor: '#7460e4',
                borderWidth: 1,
                backgroundColor: '#f2edff',
                // backgroundColor:
                //   colorPalette[index % colorPalette.length].color,
              },
            ]}>
            <Text numberOfLines={1} style={styles.categoryName}>
              {category.service_name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#373737',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
    justifyContent: 'space-evenly',
  },
  categoryContainer: {
    width: '30%',
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 20,
  },
  categoryName: {
    color: 'black',
    fontFamily: 'Montserrat-Medium',
    fontSize: 13,
    textAlign: 'center',
  },
});
