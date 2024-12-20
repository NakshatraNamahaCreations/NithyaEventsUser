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
import RNHTMLtoPDF from 'react-native-html-to-pdf';
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

const screenWidth = Dimensions.get('window').width;
const posterHeight = 400; // Same as the height defined in styles for the poster
const posterWidth = screenWidth - 20;

const items = [
  {id: 1, name: 'Chair', icon: require('../../assets/category/kiru6_9.png')},
  {id: 2, name: 'Mic', icon: require('../../assets/category/light1.png')},
  // Add more items here
];

function Moodbooard() {
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [images, setImages] = useState([]);

  const [imagesboard, setImagesboard] = useState([
    {id: 1, image: One, name: 'Chair', quantity: 0},
    {id: 2, image: Two, name: 'Mic-Stand', quantity: 0},
    {id: 3, image: Three, name: 'Spotlight', quantity: 0},
    {id: 4, image: Four, name: 'tablecloth', quantity: 0},
    {id: 5, image: Five, name: 'Tribune', quantity: 0},
    {id: 6, image: Six, name: 'theatre', quantity: 0},
  ]);

  const handleColorChange = color => {
    setBackgroundColor(color);
    setShowColorPicker(false);
  };

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

  const renderColorOption = color => (
    <TouchableOpacity
      key={color}
      style={[styles.colorOption, {backgroundColor: color}]}
      onPress={() => handleColorChange(color)}
    />
  );

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'This app needs access to your storage to download the PDF',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const generatePDF = async () => {
    const permissionGranted = await requestStoragePermission();
    if (!permissionGranted) {
      Alert.alert(
        'Permission Denied',
        'Storage permission is required to download the PDF.',
      );
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f8f8f8;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
            .poster {
              width: 100%;
              height: 400px;
              position: relative;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .image {
              position: absolute;
              width: 100px;
              height: 100px;
            }
          </style>
        </head>
        <body>
          <div class="poster">
            <!-- You can add images or other content here -->
          </div>
        </body>
      </html>
    `;

    const options = {
      html: htmlContent,
      fileName: 'MoodboardImages',
      directory: 'Documents',
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      const destPath = `${RNFS.DownloadDirectoryPath}/MoodboardImages.pdf`;

      await RNFS.copyFile(file.filePath, destPath);
      console.log('file', file.filePath, destPath);

      Alert.alert('PDF Created', 'PDF file created and saved to: ' + destPath);
    } catch (error) {
      console.error('Error creating PDF:', error);
      Alert.alert('Error', 'An error occurred while creating the PDF.');
    }
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

  return (
    <View style={styles.container}>
      <ScrollView style={{padding: 10}}>
        <View style={styles.boardContainer}>
          <View style={[styles.poster, {backgroundColor}]}>
            {images.map(image => (
              <Draggable
                key={image.id}
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
        <View style={{flexDirection: 'row-reverse'}}>
          <TouchableOpacity>
            <Text
              style={{
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
                textAlign: 'center',
              }}>
              Preview
            </Text>
          </TouchableOpacity>
        </View>
        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
            }}>
            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity onPress={() => handleTabClick('details')}>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name="info-circle"
                    size={16}
                    color={productDetails ? 'black' : ''}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 13,
                      color: productDetails ? 'black' : '#8d8d8d',
                      textAlign: 'center',
                    }}>
                    Chairs
                  </Text>
                  <View
                    style={{
                      borderBottomColor: productDetails
                        ? 'black'
                        : 'transparent',
                      borderBottomWidth: productDetails ? 4.5 : 0,
                      position: 'relative',
                      top: 2,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity
                onPress={() => handleTabClick('specifications')}>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name="info-circle"
                    size={16}
                    color={productDetails ? 'black' : ''}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 13,
                      textAlign: 'center',
                      color: productSpecification ? 'black' : '#8d8d8d',
                    }}>
                    Mic-Stand
                  </Text>
                  <View
                    style={{
                      borderBottomColor: productSpecification
                        ? 'black'
                        : 'transparent',
                      borderBottomWidth: productSpecification ? 4.5 : 0,
                      position: 'relative',
                      top: 2,
                    }}></View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity onPress={() => handleTabClick('origin')}>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name="info-circle"
                    size={16}
                    color={productDetails ? 'black' : ''}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 13,
                      textAlign: 'center',
                      color: coutryOfOrgin ? 'black' : '#8d8d8d',
                    }}>
                    Spotlight
                  </Text>
                  <View
                    style={{
                      borderBottomColor: coutryOfOrgin
                        ? 'black'
                        : 'transparent',
                      borderBottomWidth: coutryOfOrgin ? 4.5 : 0,
                      position: 'relative',
                      top: 2,
                    }}></View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{marginHorizontal: 10}}>
              <TouchableOpacity onPress={() => handleTabClick('manufacturer')}>
                <View style={{alignItems: 'center'}}>
                  <Icon
                    name="info-circle"
                    size={16}
                    color={productDetails ? 'black' : ''}
                    style={{marginRight: 5}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Montserrat-Medium',
                      fontSize: 13,
                      color: manufacturer ? 'black' : '#8d8d8d',
                      textAlign: 'center',
                    }}>
                    Table Cloths
                  </Text>
                  <View
                    style={{
                      borderBottomColor: manufacturer ? 'black' : 'transparent',
                      borderBottomWidth: manufacturer ? 4.5 : 0,
                      position: 'relative',
                      top: 2,
                    }}></View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView> */}
      </ScrollView>

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

      {/* Color Picker Modal
        {showColorPicker && (
          <Modal
            transparent={true}
            animationType="slide"
            visible={showColorPicker}
            onRequestClose={() => setShowColorPicker(false)}>
            <View style={styles.colorPickerContainer}>
              <View style={styles.colorPicker}>
                <Text style={styles.colorPickerText}>
                  Choose a Background Color:
                </Text>
                <View style={styles.colorOptions}>
                  {[
                    'red',
                    'blue',
                    'green',
                    'yellow',
                    'orange',
                    'purple',
                    'white',
                    'black',
                  ].map(renderColorOption)}
                </View>
              </View>
            </View>
          </Modal>
        )} */}
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
    marginVertical: 20,
  },
  poster: {
    width: '100%',
    height: 500,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
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
    position: 'absolute',
    bottom: 0,
    margin: 0,
    width: '100%',
    height: 300,
    flex: 1,
    elevation: 3,
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
