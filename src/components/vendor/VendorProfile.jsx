import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Button,
  TextInput,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useUserContext} from '../../utilities/UserContext';

const {width} = Dimensions.get('window');

export default function VendorProfile() {
  const route = useRoute();
  const navigation = useNavigation();
  const vendor = route.params.vendorProfile;
  const [isWishlist, setIsWishlist] = useState(false);
  const {userDataFromContext} = useUserContext();
  // console.log('vendor profile component===', vendor);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [product, setProduct] = useState([]);
  const [vendorProfile, setVendorProfile] = useState([]);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  const asterisk = () => <Text style={{color: '#f44336'}}>*</Text>;

  const toggleModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    console.log('Modal close triggered');
    setModalVisible(false);
  };

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SERVICE_REVIEW}${vendor._id}`,
      );
      if (response.status === 200) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  useEffect(() => {
    const getAllOrderProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_PARTICULAR_VENDOR_PRODUCTS}/${vendor._id}`,
        );
        if (res.status === 200) {
          setProduct(res.data);
        }
        // VENDOR PROFILE
        const vendorRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_VENDOR_PROFILE}${vendor._id}`,
        );
        if (vendorRes.status === 200) {
          setVendorProfile(vendorRes.data);
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getAllOrderProduct();
  }, []); // Fetch only once on mount

  console.log('vendorProfile', vendorProfile);

  const animateWishlist = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false, // This must be false for certain properties
    }).start(() => {
      // Optional: You can perform additional actions after animation completes
    });
  };
  // console.log('product', product.length);

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist);
    animateWishlist(); // Call animation function when wishlist state changes
  };

  const heartScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  // const scrollViewRef = useRef(null);
  // const [imgActive, setImgActive] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (imgActive < vendor.length - 1) {
  //       scrollViewRef.current.scrollTo({
  //         x: (imgActive + 1) * width,
  //         animated: true,
  //       });
  //     } else {
  //       scrollViewRef.current.scrollTo({x: 0, animated: true});
  //     }
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }, [imgActive]);

  // const onChange = event => {
  //   const slide = Math.ceil(
  //     event.contentOffset.x / event.layoutMeasurement.width,
  //   );
  //   if (slide !== imgActive) {
  //     setImgActive(slide);
  //   }
  // };

  const writeReview = async () => {
    if (!rating || !reviewTitle) {
      Alert.alert('Error', 'Please fill all fields');
    } else {
      try {
        const config = {
          url: `${apiUrl.WRITE_VENDORS_REVIEW}${vendor._id}`,
          method: 'put',
          baseURL: apiUrl.BASEURL,
          headers: {'Content-Type': 'application/json'},
          data: {
            user_id: userDataFromContext._id,
            user_name: userDataFromContext.username,
            review_title: reviewTitle,
            review_description: reviewDescription,
            ratings: rating,
          },
        };
        const response = await axios(config);
        if (response.status === 200) {
          Alert.alert(
            'Thanks for sharing your rating with us and the community!',
          );
          setRating(0);
          setReviewTitle('');
          setReviewDescription('');
          refreshReviews();
          closeModal();
          // Reset form or navigate away
          // navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        console.log('error', error);
        Alert.alert('Error', 'Error');
      }
    }
  };
  console.log('reviews', reviews);

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              backgroundColor: '#f0f0f5',
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              padding: 15,
              paddingTop: 25,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{flex: 0.3}}>
                <Pressable>
                  <Ionicons
                    name="chevron-back-sharp"
                    size={25}
                    color="#575656"
                    onPress={() => navigation.goBack()}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    alignSelf: 'center',
                  }}
                  source={{
                    uri: vendor.shop_image_or_logo,
                  }}
                />
              </View>

              <View
                style={{
                  flex: 0.3,
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  marginRight: 10,
                }}>
                <TouchableOpacity onPress={toggleModal}>
                  <MaterialCommunityIcons
                    name={'star-plus'}
                    size={25}
                    color={'#ea5362'}
                  />
                  {/* <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      // textAlign: 'center',
                      fontFamily: 'Montserrat-SemiBold',
                      // marginTop: 3,
                      // marginLeft: 2,
                    }}>
                    Write Review
                  </Text> */}
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={toggleWishlist}>
                  <Animated.View style={{transform: [{scale: heartScale}]}}>
                    <Octicons
                      name={!isWishlist ? 'heart' : 'heart-fill'}
                      size={25}
                      color={!isWishlist ? '#02060c99' : '#ea5362'}
                    />
                  </Animated.View>
                </TouchableOpacity> */}
                {/* <Octicons
                  onPress={() => setIsWishlist(!isWishlist)}
                  name={!isWishlist ? 'heart' : 'heart-fill'}
                  size={25}
                  color={!isWishlist ? '#02060c99' : '#ea5362'}
                /> */}
              </View>
            </View>
            <View
              style={{
                marginTop: 20,
                borderRadius: 15,
                borderColor: '#e2e2e7',
                borderWidth: 1,
                backgroundColor: 'white',
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}>
              <View style={{flexDirection: 'row', flex: 1, marginVertical: 5}}>
                {reviews && reviews.length > 0 ? (
                  <>
                    {reviews.map(review => (
                      <View
                        key={review._id}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          flex: 0.5,
                        }}>
                        {Array.from({length: 5}).map((_, index) => (
                          <AntDesign
                            key={index}
                            name="star"
                            size={17}
                            color={
                              index < review.ratings ? '#fdd663' : '#cccccc'
                            }
                            style={{marginTop: 3}}
                          />
                        ))}
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                            textAlign: 'center',
                            fontFamily: 'Montserrat-SemiBold',
                            marginTop: 3,
                            marginLeft: 2,
                          }}>
                          {` ${review.ratings} rating`}
                        </Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 0.5,
                    }}>
                    {Array.from({length: 5}).map((_, index) => (
                      <AntDesign
                        key={index}
                        name="star"
                        size={17}
                        color={'#cccccc'}
                        style={{marginTop: 3}}
                      />
                    ))}
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'black',
                        textAlign: 'center',
                        fontFamily: 'Montserrat-SemiBold',
                        marginTop: 3,
                        marginLeft: 2,
                      }}>
                      {' '}
                      0 rating
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={{flex: 0.5}}>
                  {/* <Text
                    style={{
                      fontSize: 12,
                      color: '#ee5353',
                      textAlign: 'right',
                      fontFamily: 'Montserrat-SemiBold',
                      marginTop: 3,
                      marginLeft: 7,
                      textDecorationColor: '#ee5353',
                      textDecorationLine: 'underline',
                    }}>
                    Review
                  </Text> */}
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.profileText}>{vendor.shop_name} </Text>
              </View>
              <View
                style={{
                  // flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={styles.profileHelperText}>
                  {vendor.address[0]?.houseFlatBlock},{' '}
                  {vendor.address[0]?.roadArea},{' '}
                  {vendor.address[0]?.cityDownVillage},{' '}
                  {vendor.address[0]?.distric}, {vendor.address[0]?.state} -
                  {vendor.address[0]?.pincode}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.profile}>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Bold',
                }}>
                <Ionicons name="flower-outline" size={10} color="black" /> ITEMS{' '}
                <Ionicons name="flower-outline" size={10} color="black" />
              </Text>

              {/* <View style={{marginTop: 15}}>
                <Feather
                  name="search"
                  size={19}
                  color="#ea5362"
                  style={{
                    position: 'absolute',
                    zIndex: 11111,
                    left: 15,
                    top: 13,
                  }}
                />
                <TextInput
                  style={{
                    backgroundColor: '#d1d1d14d',
                    borderRadius: 10,
                    width: '100%',
                    borderWidth: 1,
                    borderColor: 'transparent',
                    height: 50,
                    color: 'black',
                    fontSize: 17,
                    paddingLeft: 40,
                    marginBottom: 10,
                    fontFamily: 'Montserrat-Regular',
                  }}
                  placeholderTextColor="#737373"
                  placeholder="Search for items"
                />
              </View> */}
            </View>
            {product?.length === 0 ? (
              <Text
                style={{
                  fontSize: 17,
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                  letterSpacing: 1,
                }}>
                No items found
              </Text>
            ) : (
              <View style={{marginTop: 15}}>
                {product?.map((ele, index) => {
                  const averageRating =
                    ele.Reviews.length > 0
                      ? ele.Reviews.reduce((a, b) => a + b.rating, 0) /
                        ele.Reviews.length
                      : 0;
                  return (
                    <Pressable
                      key={ele._id}
                      onPress={() =>
                        navigation.navigate('ProductDetails', {
                          item: ele,
                        })
                      }>
                      <View
                        style={{
                          flexDirection: 'row',
                          margin: 10,
                          marginBottom: 3,
                        }}>
                        <View style={{padding: 5, flex: 0.6}}>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: 'black',
                              fontSize: 14,
                              // fontWeight: '500',
                              marginBottom: 1,
                              fontFamily: 'Montserrat-SemiBold',
                            }}>
                            {ele.product_name}
                          </Text>
                          {/* <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <MaterialCommunityIcons
                              name="star-box"
                              size={20}
                              color="#236339"
                            />
                            <View
                              style={{
                                marginLeft: 2,
                              }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#236339',
                                  fontFamily: 'Montserrat-Bold',
                                  marginTop: 0,
                                  // letterSpacing: 1,
                                }}>
                                {Math.round(averageRating)}
                              </Text>
                            </View>
                          </View> */}
                          <Text
                            style={{
                              fontSize: 13,
                              color: 'black',
                              fontFamily: 'Montserrat-Medium',
                              marginTop: 10,
                            }}>
                            {/* <MaterialIcons
                              name="currency-rupee"
                              size={13}
                              color="black"
                            /> */}
                            ₹{ele.product_price}
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              color: '#e91e63',
                              fontFamily: 'Montserrat-Medium',
                              marginTop: 5,
                            }}>
                            {ele.product_category}
                          </Text>
                        </View>
                        <View style={{flex: 0.4}}>
                          {ele.product_image && ele.product_image.length > 0 ? (
                            <Image
                              style={{
                                marginTop: 8,
                                width: 100,
                                height: 100,
                                alignSelf: 'center',
                                borderRadius: 15,
                              }}
                              source={{
                                uri: ele.product_image[0],
                              }}
                            />
                          ) : (
                            <View
                              style={{
                                backgroundColor: 'gray',
                                width: 150,
                                height: 150,
                              }}>
                              <Text
                                style={{
                                  color: 'black',
                                  size: 12,
                                  textAlign: 'center',
                                }}>
                                {' '}
                                No image available
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      {product.length - 1 === index ? null : (
                        <View
                          style={{
                            borderWidth: 0.3,
                            borderColor: 'black',
                            borderStyle: 'dotted',
                            margin: 10,
                          }}></View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
          {/* <View
        style={{backgroundColor: '#f7f7f7', marginTop: 15, marginBottom: 30}}>
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            padding: 15,
            fontFamily: 'Montserrat-Medium',
          }}>
          Add Ons you will need
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 15,
          }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {Array.from({length: 8}).map((_, index) => (
              <View key={index} style={styles.addsOnView}>
                <Image
                  style={styles.addsOnImage}
                  source={{
                    uri: 'https://ik.imagekit.io/faskf16pg/dslr-cameras/38_OgbjFNvll.png?ik-sdk-version=javascript-1.4.3&updatedAt=1661426226096',
                  }}
                />
                <View style={{padding: 5}}>
                  <Text style={styles.addsOnText}>
                    {'Nikkor Z DX 50-250MM'.substring(0, 50)}
                  </Text>

                  <View style={{flexDirection: 'row', marginBottom: 2}}>
                    {Array.from({length: 5}).map((_, index) => (
                      <AntDesign
                        key={index}
                        name="star"
                        size={14}
                        color="#fdd663"
                      />
                    ))}
                    <View style={{marginLeft: 9, marginTop: -2}}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 14,
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        45
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.productPrice}>₹ 1000.00</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View> */}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        // animationInTiming={400}
        // animationOut={400}
        // backdropOpacity={0.6}
        style={{
          margin: 0,
          position: 'absolute',
          bottom: 0,
          width: '100%',
          // height: '100%',
        }}>
        <TouchableOpacity
          style={{
            position: 'relative',
            top: -5,
            zIndex: 1000,
          }}
          onPress={closeModal}>
          <AntDesign
            name="closecircle"
            size={25}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity>
        {/* <Button title="Close" color="#841584" onPress={closeModal} /> */}
        <View
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 15,
          }}>
          <View
            style={{
              backgroundColor: 'white',
              marginBottom: 10,
              borderRadius: 10,
              padding: 6,
            }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                alignSelf: 'center',
              }}
              source={{
                uri: `${apiUrl.IMAGEURL}${vendor.shop_image_or_logo}`,
              }}
            />
            <View style={{marginVertical: 15}}>
              <Text
                style={{
                  fontSize: 18,
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                {`How was your shopping with ${vendor.shop_name}?`}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 10,
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Rate your experience
              </Text>
              {/* <TouchableOpacity onPress={toggleWishlist}>
                <Animated.View style={{transform: [{scale: heartScale}]}}>
                  <AntDesign
                    name={!isWishlist ? 'staro' : 'star'}
                    size={25}
                    color={!isWishlist ? '#02060c99' : '#ea5362'}
                  />
                </Animated.View>
              </TouchableOpacity> */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                {Array.from({length: 5}).map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(index + 1)}>
                    <AntDesign
                      name={rating > index ? 'star' : 'staro'}
                      size={25}
                      color={rating > index ? '#ea5362' : '#ea5362'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  marginTop: 20,
                }}>
                Title your review {asterisk()}
              </Text>
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#b7b4b4',
                  color: 'black',
                  fontSize: 13,
                  padding: 10,
                  marginBottom: 10,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                }}
                placeholderTextColor="#a1a1a1"
                placeholder="What's most important to know?"
                value={reviewTitle}
                onChangeText={reTit => setReviewTitle(reTit)}
              />
              <Text
                style={{
                  color: 'black',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Write your review
              </Text>
              <TextInput
                style={{
                  backgroundColor: 'transparent',
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: '#b7b4b4',
                  color: 'black',
                  fontSize: 13,
                  padding: 10,
                  marginBottom: 10,
                  fontFamily: 'Montserrat-Medium',
                  marginVertical: 10,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor="#a1a1a1"
                placeholder="What did you use this product for?"
                multiline
                numberOfLines={4}
                // maxLength={40}
                value={reviewDescription}
                onChangeText={revDesc => setReviewDescription(revDesc)}
              />
            </View>
          </View>
          <View
            style={{
              // marginHorizontal: 50,
              marginBottom: 20,
              // flexDirection: 'row',
              // alignItems: 'flex-end',
              // justifyContent: 'flex-end',
            }}>
            <Pressable
              style={{
                backgroundColor: '#171a9d',
                paddingVertical: 15,
                borderRadius: 7,
                elevation: 3,
              }}
              onPress={writeReview}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                }}>
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#c9c5d152',
    // paddingTop: 10,
    backgroundColor: 'white',
  },
  viewBox: {
    width: width,
    height: 200,
    marginTop: 10,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  bannerImage: {
    width: width - 40,
    height: 200,
    borderRadius: 15,
    marginHorizontal: 10,
  },
  profile: {
    margin: 10,
    // marginTop: 20,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  profileText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  profileHelperText: {
    fontSize: 13,
    color: 'black',
    // textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    marginTop: 3,
  },
  border: {
    borderWidth: 2,
    borderColor: '#f7f7f7',
  },
  productImage: {
    width: 100,
    height: 100,
    // borderRadius: 50,
    alignSelf: 'center',
  },
  productName: {
    // color: '#333',
    fontSize: 14,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    marginBottom: 5,
    // textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    color: '#414242',
    fontFamily: 'Montserrat-SemiBold',
  },
  addsOnView: {
    margin: 5,
    borderWidth: 2,
    borderColor: '#ededf1',
    backgroundColor: 'white',
  },
  addsOnImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  addsOnText: {
    fontSize: 14,
    width: 200,
    fontFamily: 'Montserrat-Medium',
    color: 'black',
    marginBottom: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
