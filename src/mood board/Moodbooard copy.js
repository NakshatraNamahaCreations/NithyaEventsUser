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
} from 'react-native';
import Draggable from 'react-native-draggable';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import One from '../assets/dining.png';
import Two from '../assets/mic-stand.png';
import Three from '../assets/spotlight.png';
import Four from '../assets/spotlight1.png';
import Five from '../assets/tablecloth.png';
import Six from '../assets/tribune.png';
import Seven from '../assets/theatre.png';
import BottomSheet, {BottomSheetMethods} from '@devvie/bottom-sheet';
import MoodboardTab from '../mood board/MoodboardTab';
import Icon from 'react-native-vector-icons/FontAwesome';

function Moodbooard() {
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [images, setImages] = useState([]);
  const sheetRef = useRef(null);
  const [productSpecification, setProductSpecification] = useState(false);
  const [productDetails, setProductDetails] = useState(true);
  const [coutryOfOrgin, setCoutryOfOrgin] = useState(false);
  const [manufacturer, setManufacturer] = useState(false);

  const handleTabClick = tabName => {
    setProductSpecification(tabName === 'specifications');
    setProductDetails(tabName === 'details');
    setCoutryOfOrgin(tabName === 'origin');
    setManufacturer(tabName === 'manufacturer');
  };

  const handleColorChange = color => {
    setBackgroundColor(color);
    setShowColorPicker(false);
  };

  const handleAddImage = imageSource => {
    // Add a new image with a default position
    const newImage = {
      id: images.length + 1,
      uri: imageSource,
      x: 100,
      y: 100,
    };
    setImages([...images, newImage]);
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

  const imagesboard = [
    {id: 1, image: One, name: 'Dining'},
    {id: 2, image: Two, name: 'Mic-Stand'},
    {id: 3, image: Three, name: 'Spotlight'},
    {id: 4, image: Four, name: 'Spotlight'},
    {id: 5, image: Five, name: 'tablecloth'},
    {id: 6, image: Six, name: 'Tribune'},
    {id: 7, image: Seven, name: 'theatre'},
  ];

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

  return (
    <View style={styles.container}>
      <ScrollView>
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
                onLongPress={() => confirmDeleteImage(image.id)} // Long press to delete
              >
                <Image source={image.uri} style={styles.image} />
              </Draggable>
            ))}
          </View>
        </View>

        {/* <View style={styles.wrapper}>
          {imagesboard.map(data => (
            <TouchableOpacity
              key={data.id}
              onPress={() => handleAddImage(data.image)} // Pass the image source dynamically
              style={styles.imageContainer}>
              <Image source={data.image} style={styles.image} />
              <Text style={styles.imageText}>{data.name}</Text>
            </TouchableOpacity>
          ))}
        </View> */}

        {/* <Button title="Open" onPress={() => sheetRef.current?.open()} />

        <BottomSheet ref={sheetRef} style={{padding: 10}}>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            The smart 😎, tiny 📦, and flexible 🎗 bottom sheet your app craves
            🚀
          </Text>
        </BottomSheet> */}

        {/* <TouchableOpacity style={styles.pdfButton} onPress={generatePDF}>
          <Text style={styles.pdfButtonText}>Download PDF</Text>
        </TouchableOpacity> */}
        {/* <MoodboardTab /> */}

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
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
        </ScrollView>

        <View style={{marginTop: 10}}>
          {productSpecification ? (
            <View>
              <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
                Specification Page
              </Text>
            </View>
          ) : productDetails ? (
            <View>
              <View style={styles.wrapper}>
                {imagesboard.map(data => (
                  <TouchableOpacity
                    key={data.id}
                    onPress={() => handleAddImage(data.image)} // Pass the image source dynamically
                    style={styles.imageContainer}>
                    <Image source={data.image} style={styles.image} />
                    {/* <Text style={styles.imageText}>{data.name}</Text> */}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : coutryOfOrgin ? (
            <>
              <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
                Country Page
              </Text>
            </>
          ) : manufacturer ? (
            <>
              <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
                Manufacture Page
              </Text>
            </>
          ) : null}
        </View>

        {/* Color Picker Modal */}
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
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  poster: {
    width: '100%',
    height: 400,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    margin: 5,
    flexBasis: '30%',
    alignItems: 'center',
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
});

export default Moodbooard;
