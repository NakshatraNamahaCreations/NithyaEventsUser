import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform,
  PermissionsAndroid,
  Button,
  Dimensions,
} from 'react-native';
import Draggable from 'react-native-draggable';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import One from '../assets/wooden-chair.png';
import Two from '../assets/mic-stand.png';
import Three from '../assets/spotlight1.png';
import Four from '../assets/tablecloth.png';
import Five from '../assets/tribune.png';
import Six from '../assets/theatre.png';
// import BottomSheet, {BottomSheetMethods} from '@devvie/bottom-sheet';
// import MoodboardTab from '../mood board/MoodboardTab';
// import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const screenWidth = Dimensions.get('window').width;
const posterHeight = 400; // Same as the height defined in styles for the poster
const posterWidth = screenWidth - 20;

function Moodbooard() {
  const captureMoodBoard = useRef();
  const [images, setImages] = useState([]);

  const [imagesboard, setImagesboard] = useState([
    {id: 1, image: One, name: 'Chair', quantity: 0},
    {id: 2, image: Two, name: 'Mic-Stand', quantity: 0},
    {id: 3, image: Three, name: 'Spotlight', quantity: 0},
    {id: 4, image: Four, name: 'tablecloth', quantity: 0},
    {id: 5, image: Five, name: 'Tribune', quantity: 0},
    {id: 6, image: Six, name: 'theatre', quantity: 0},
  ]);

  const handleAddImage = (imageSource, quantity) => {
    const newImages = [];
    for (let i = 0; i < quantity; i++) {
      const newImage = {
        id: images.length + 1 + i,
        uri: imageSource,
        x: 100,
        y: 100,
      };
      newImages.push(newImage);
    }
    setImages([...images, ...newImages]);
  };

  const incrementQuantity = id => {
    setImagesboard(
      imagesboard.map(image =>
        image.id === id ? {...image, quantity: image.quantity + 1} : image,
      ),
    );
  };

  const decrementQuantity = id => {
    setImagesboard(
      imagesboard.map(image =>
        image.id === id && image.quantity > 1
          ? {...image, quantity: image.quantity - 1}
          : image,
      ),
    );
  };

  const handleDeleteImage = imageId => {
    setImages(images.filter(image => image.id !== imageId));
  };

  const confirmDeleteImage = imageId => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => handleDeleteImage(imageId),
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const saveImageToDevice = async () => {
    try {
      // Request storage permission on Android
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission denied');
          return;
        }
      }

      // Capture the image
      const uri = await captureMoodBoard.current.capture();

      // Get a unique file path to save the image
      const filePath = `${
        RNFS.DownloadDirectoryPath
      }/Moodboard_${Date.now()}.jpg`;

      // Copy the image to the Downloads folder (on Android)
      await RNFS.copyFile(uri, filePath);

      console.log('Image saved to:', filePath);
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const shareMoodBoardImage = async () => {
    try {
      // Capture the image using ViewShot
      const uri = await captureMoodBoard.current.capture();

      // Copy the image to a shareable location (usually the app's storage path or temporary directory)
      const filePath = `${
        RNFS.DocumentDirectoryPath
      }/Moodboard_${Date.now()}.jpg`;
      await RNFS.copyFile(uri, filePath);

      // Share the image
      await Share.open({
        title: 'Share Moodboard Image',
        url: 'file://' + filePath, // Ensure proper URI format for sharing
        type: 'image/jpeg',
        subject: 'My Moodboard', // Optional email subject
      });
    } catch (error) {
      console.log('Error sharing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View
          style={{
            position: 'absolute',
            right: 10,
            top: 20,
            zIndex: 1,
            backgroundColor: 'white',
            elevation: 6,
            // paddingVertical: 15,
            // paddingHorizontal: 10,
            borderRadius: 15,
            // height: 50,
          }}>
          <TouchableOpacity onPress={saveImageToDevice} style={{margin: 5}}>
            <AntDesign name="download" color="black" size={25} />
          </TouchableOpacity>
          <View
            style={{
              borderColor: '#f0f0f0',
              borderWidth: 0.4,
              marginVertical: 10,
            }}></View>
          <TouchableOpacity onPress={shareMoodBoardImage} style={{margin: 5}}>
            <Octicons name="share-android" color="black" size={18} />
          </TouchableOpacity>
        </View>

        <ViewShot
          ref={captureMoodBoard}
          options={{format: 'jpg', quality: 0.9}}>
          {/* <ScrollView style={{padding: 10}}> */}
          <View style={styles.boardContainer}>
            <View style={styles.poster}>
              {images.map((image, index) => (
                <Draggable
                  key={index}
                  x={image.x}
                  y={image.y}
                  renderSize={100}
                  renderColor="transparent"
                  shouldReverse={false}
                  style={{flexDirection: 'column'}}
                  onLongPress={() => confirmDeleteImage(image.id)} // Long press to delete
                >
                  <Image source={image.uri} style={styles.image} />
                </Draggable>
              ))}
            </View>
          </View>
          {/* </ScrollView> */}
        </ViewShot>
        <View style={styles.wrapper}>
          <ScrollView>
            {imagesboard.map(data => (
              <View key={data.id} style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={() => handleAddImage(data.image, data.quantity)}>
                  <Image source={data.image} style={styles.image} />
                </TouchableOpacity>
                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => decrementQuantity(data.id)}>
                    <AntDesign
                      style={styles.quantityButton}
                      name="minuscircleo"
                      color="black"
                      size={25}
                    />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{data.quantity}</Text>
                  <TouchableOpacity onPress={() => incrementQuantity(data.id)}>
                    <AntDesign
                      style={styles.quantityButton}
                      name="pluscircleo"
                      color="black"
                      size={25}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{paddingHorizontal: 10}}
                    onPress={() => handleAddImage(data.image, data.quantity)}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Medium',
                        backgroundColor: 'white',
                        paddingHorizontal: 20,
                        paddingVertical: 2,
                        borderRadius: 10,
                      }}>
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // padding: 10,
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  poster: {
    width: '100%',
    height: 650,
    elevation: 2,
    backgroundColor: '#fcd4ba',
    // position: 'relative',
    // borderWidth: 1,
    // borderColor: '#ddd',
    // borderRadius: 5,
  },
  colorPickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  colorPicker: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  colorPickerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorOption: {
    width: 40,
    height: 40,
    margin: 5,
    borderRadius: 20,
  },
  wrapper: {
    // position: 'absolute',
    // bottom: 0,
    // margin: 0,
    width: '100%',
    height: 200,
    flex: 1,
    elevation: 6,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    // borderTopEndRadius: 20,
    // borderTopStartRadius: 20,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    margin: 5,
    flexBasis: '30%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
  },
  imageText: {
    color: 'black',
    fontFamily: 'Montserrat-Regular',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  pdfButton: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  pdfButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    paddingHorizontal: 10,
    color: 'black',
    // borderRadius: 50,
    // backgroundColor: 'white',
  },
  quantityText: {
    fontSize: 16,
    marginHorizontal: 10,
    fontFamily: 'Montserrat-Regular',
    color: 'black',
  },
});

export default Moodbooard;
