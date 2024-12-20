// import React, {useState} from 'react';
// import {
//   View,
//   Image,
//   Button,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   PermissionsAndroid,
// } from 'react-native';
// import {launchImageLibrary} from 'react-native-image-picker';

// const MoodBoard = () => {
//   const [images, setImages] = useState([]);

//   const requestPermissions = async () => {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         {
//           title: 'Gallery Access Permission',
//           message: 'This app needs access to your gallery to select images.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log('Gallery permission denied');
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   };

//   const addImage = async () => {
//     await requestPermissions();
//     launchImageLibrary({}, response => {
//       if (!response.didCancel && !response.error && response.assets) {
//         const selectedImage = response.assets[0];
//         setImages([...images, selectedImage]);
//       }
//     });
//   };

//   const removeImage = index => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Add Image" onPress={addImage} />
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         {images.map((image, index) => (
//           <TouchableOpacity key={index} onPress={() => removeImage(index)}>
//             <Image source={{uri: image.uri}} style={styles.image} />
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollView: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//   },
//   image: {
//     width: 100,
//     height: 100,
//     margin: 5,
//   },
// });

// export default MoodBoard;

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import React from 'react';

export default function Project({navigation}) {
  return (
    // <View style={{height: '100%', padding: 20, backgroundColor: 'white'}}>
    //   <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
    //     <View style={{flex: 0.2}}>
    //       <Image
    //         source={require('../../assets/blueprint_6475483.png')}
    //         style={{width: 100, height: 100}}
    //       />
    //     </View>
    //     <View style={{flex: 0.8}}>
    //       <View style={{padding: 10}}>
    //         <Text style={{color: '#353535', fontWeight: '600', fontSize: 19}}>
    //           From scratch
    //         </Text>
    //         <Text style={{color: '#353535', fontSize: 16}}>
    //           Use your creativity
    //         </Text>
    //       </View>
    //     </View>
    //   </TouchableOpacity>
    // </View>
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('moodboard')}
        style={{
          margin: 10,
          flexDirection: 'row',
          backgroundColor: 'white',
          elevation: 2,
          padding: 5,
          borderRadius: 5,
        }}>
        <View style={{flex: 0.3, alignItems: 'center'}}>
          <Image
            source={require('../../assets/blueprint_6475483.png')}
            style={{width: 70, height: 70}}
          />
        </View>
        <View style={{flex: 0.8, justifyContent: 'center'}}>
          <Text
            style={{
              color: '#353535',
              fontWeight: '600',
              fontSize: 15,
              fontFamily: 'Montserrat-SemiBold',
            }}>
            From scratch
          </Text>
          <Text
            style={{
              color: '#353535',
              fontSize: 14,
              fontFamily: 'Montserrat-Regular',
            }}>
            Use your creativity
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
