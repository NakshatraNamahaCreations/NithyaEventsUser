import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import THEMECOLOR from '../../utilities/color';
import {apiUrl} from '../../api-services/api-constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
// import Fontisto from 'react-native-vector-icons/Fontisto';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {addToServiceCart} from '../../state-management/serviceCartSlice';
import {Badge} from 'react-native-paper';
import {useUserContext} from '../../utilities/UserContext';

export default function ServiceDetails() {
  const deviceWidth = Dimensions.get('window').width;
  const route = useRoute();
  const navigation = useNavigation();
  const serviceData = route.params.serviceDetails || {};
  const {userDataFromContext} = useUserContext();
  const [isModalVisible, setModalVisible] = useState(false);
  const [services, setServices] = useState(true);
  const [review, setReview] = useState(false);
  const [serviceImage, setServiceImage] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [buttonText, setButtonText] = React.useState('ADD TO CART');
  const [reviews, setReviews] = useState([]);

  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const serviceCart = useSelector(state => state.serviceCart);
  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0);

  // console.log('cart in service detailed page>>>', serviceCart);

  // console.log('serviceData in service detailed page', serviceData);

  const today = new Date().toLocaleString('en-us', {weekday: 'long'});

  const extractBusinessHours =
    serviceData.business_hours.length > 0 ? serviceData.business_hours : [];

  const matchDay = extractBusinessHours?.find(element => {
    return element.day === today;
  });
  // console.log('matchDay', matchDay);

  const handleAddToCart = () => {
    dispatch(
      addToServiceCart({
        id: serviceData._id,
        store: serviceData.shop_name,
        imageUrl: serviceData.shop_image_or_logo,
        vendor_name: serviceData.vendor_name,
        // productName: serviceData.shop_name,
        productPrice: serviceData.pricing,
        // mrpPrice: serviceData.pricing,
        ordered_date: new Date().toISOString(),
        commissionTax: serviceData.commission_tax,
        commissionPercentage: serviceData.commission_percentage,
      }),
    );
    setButtonText('VIEW CART');
  };

  const handleButtonPress = () => {
    if (buttonText === 'VIEW CART') {
      navigation.navigate('CartStack');
    } else {
      handleAddToCart();
    }
  };

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_SERVICE_REVIEW}${serviceData._id}`,
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, []);
  // console.log('reviews for service details page', reviews);

  const writeReview = async () => {
    if (!rating || !reviewTitle) {
      Alert.alert('Error', 'Please fill all fields');
    } else {
      try {
        const config = {
          url: `${apiUrl.WRITE_VENDORS_REVIEW}${serviceData._id}`,
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
          // Reset form or navigate away
          refreshReviews();
          // navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        console.log('error', error);
        Alert.alert('Error', 'Error');
      }
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
        reviews.length
      : 0;
  console.log('averageRating', averageRating);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <ScrollView>
        <View
          style={{
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            paddingVertical: 15,
            paddingHorizontal: 15,
            elevation: 3,
          }}>
          <TouchableOpacity
            style={{flex: 0.9}}
            onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              color={THEMECOLOR.textColor}
              size={18}
              // style={{marginHorizontal: 5}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              // flexDirection: 'row',
              // justifyContent: 'flex-end',
              // alignItems: 'center',
              flex: 0.1,
            }}
            onPress={() => navigation.navigate('CartStack')}>
            <AntDesign
              name="shoppingcart"
              size={23}
              color={THEMECOLOR.textColor}
              style={{marginHorizontal: 5}}
            />
            <View
              style={{
                position: 'absolute',
                right: 0,
                top: -10,
              }}>
              <Badge theme={{colors: {primary: 'green'}}}>{totalCart}</Badge>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: 15, marginTop: 20}}>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
            }}>
            <View style={{flex: 0.5}}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Montserrat-SemiBold',
                  color: 'black',
                }}>
                {serviceData.shop_name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Montserrat-Bold',
                  color: '#ff9800',
                  marginTop: 5,
                }}>
                ₹ {serviceData.pricing} / Day
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    marginTop: 10,
                  }}>
                  {serviceData.profession} •{' '}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontFamily: 'Montserrat-Regular',
                    marginTop: 12,
                  }}>
                  {serviceData.experience_in_business} years in Business
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
              }}>
              <Image
                source={{
                  uri: `${apiUrl.IMAGEURL}${serviceData.shop_image_or_logo}`,
                }}
                style={{width: 80, height: 80, borderRadius: 15}}
              />
            </View>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={{
                fontSize: 13,
                color: 'black',
                fontFamily: 'Montserrat-Regular',
              }}>
              {serviceData?.address[0]?.houseFlatBlock},{' '}
              {serviceData?.address[0]?.roadArea},{' '}
              {serviceData?.address[0]?.cityDownVillage},{' '}
              {serviceData?.address[0]?.distric},{' '}
              {serviceData?.address[0]?.state}{' '}
              {serviceData?.address[0]?.pincode}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text
              style={{
                fontSize: 14,
                color: '#3f8448',
                fontFamily: 'Montserrat-Medium',
              }}>
              Business Hours :{' '}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {matchDay === undefined || null ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: 'black',
                    fontFamily: 'Montserrat-Regular',
                  }}>
                  N/A
                </Text>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'black',
                      fontFamily: 'Montserrat-Regular',
                    }}>
                    Untill {matchDay?.end_time}{' '}
                    {/* <Entypo
                    name="chevron-small-down"
                    color={THEMECOLOR.textColor}
                    size={18}
                  /> */}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: '#0063bb',
                      marginTop: 4,
                      marginLeft: 1,
                      textDecorationLine: 'underline',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Show
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setServices(true);
                  setReview(false);
                  setServiceImage(false);
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Services
                </Text>
                <View
                  style={{
                    borderBottomColor: services
                      ? THEMECOLOR.mainColor
                      : 'transparent',
                    borderBottomWidth: services ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setServices(false);
                  setReview(true);
                  setServiceImage(false);
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Reviews
                </Text>
                <View
                  style={{
                    borderBottomColor: review
                      ? THEMECOLOR.mainColor
                      : 'transparent',
                    borderBottomWidth: review ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setServices(false);
                  setReview(false);
                  setServiceImage(true);
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  Photos
                </Text>
                <View
                  style={{
                    borderBottomColor: serviceImage
                      ? THEMECOLOR.mainColor
                      : 'transparent',
                    borderBottomWidth: serviceImage ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{marginTop: 10, paddingHorizontal: 10, marginBottom: 20}}>
            {services ? (
              <View>
                {serviceData.additional_services.length > 0 ? (
                  <>
                    {serviceData.additional_services.map((para, index) => (
                      <View key={index} style={styles.productsDetasilRow}>
                        <Text style={styles.productDetailsHead}>
                          {/* <FontAwesome
                            name="dot-circle-o"
                            size={9}
                            color="black"
                          />{' '} */}
                          {para.parameter}
                        </Text>
                        <Text style={{flex: 0.1, color: 'black'}}></Text>
                        <Text style={styles.productsDetailsAns}>
                          {' '}
                          {para.value}
                        </Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <>
                    <Text style={styles.productsDetailsAns}>
                      Specifications not Available
                    </Text>
                  </>
                )}
              </View>
            ) : review ? (
              <View style={{marginTop: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    // marginBottom: 50,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'green',
                      flexDirection: 'row',
                      borderRadius: 6,
                      // paddingVertical: 2,
                      paddingHorizontal: 4,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'white',
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 2,
                      }}>
                      {averageRating}{' '}
                      <AntDesign
                        name="star"
                        size={12}
                        color="white"
                        // style={{marginLeft: 3, marginTop: 2}}
                      />
                      {/* {averageRating} */}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        marginLeft: 3,
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 1,
                      }}>
                      {' '}
                      {/* {Math.round(averageRating)}  */}
                      {reviews.length > 0 ? reviews.length : 0} rating
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 20,
                    marginBottom: 30,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Customer Reviews
                  </Text>
                  {reviews?.length > 0 ? (
                    <>
                      {reviews?.map((ratingItem, index) => (
                        <View key={index}>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 10,
                              alignItems: 'center',
                            }}>
                            <View>
                              <AntDesign name="user" color="black" size={15} />
                            </View>
                            <View style={{marginLeft: 10}}>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: 15,
                                  fontFamily: 'Montserrat-SemiBold',
                                }}>
                                {ratingItem.user_name}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            {Array.from({length: 5}).map((_, index) => (
                              <AntDesign
                                key={index}
                                name="star"
                                size={13}
                                color={
                                  index < ratingItem.ratings
                                    ? '#fdd663'
                                    : '#d3d3d3'
                                } // Change color based on rating
                              />
                            ))}
                          </View>
                          <View>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 13,
                                marginBottom: 1,
                                marginTop: 5,
                                fontFamily: 'Montserrat-SemiBold',
                              }}>
                              {ratingItem.review_title}
                            </Text>
                            <Text
                              style={{
                                color: '#616161',
                                fontSize: 12,
                                marginBottom: 1,
                                marginTop: 2,
                                fontFamily: 'Montserrat-Regular',
                              }}>
                              {/* Review on 9 July 2024 */}
                              {ratingItem.review_on
                                ? moment(ratingItem.review_on).format('ll')
                                : // ? new Date(ratingItem.review_on).toLocaleDateString()
                                  'No date provided'}
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 12,
                                marginBottom: 1,
                                marginTop: 5,
                                fontFamily: 'Montserrat-Regular',
                                lineHeight: 18,
                              }}>
                              {ratingItem.review_description}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  ) : (
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 10,
                      }}>
                      Be the first to review this product!
                    </Text>
                  )}
                </View>

                <View
                  style={{
                    marginBottom: 20,
                    borderTopColor: '#eeeeee',
                    borderTopWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                      color: 'black',
                      marginBottom: 10,
                      marginTop: 10,
                    }}>
                    Reviews for {serviceData.shop_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                      color: 'black',
                    }}>
                    Start your review
                  </Text>
                  <View style={{flexDirection: 'row', marginVertical: 15}}>
                    {Array.from({length: 5}).map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setRating(index + 1)}>
                        <AntDesign
                          name={rating > index ? 'star' : 'staro'}
                          size={25}
                          color={rating > index ? '#ffa41c' : '#c2c2c2'}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Title your review
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
                    Tell us about your experience
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
                    placeholder="Can you share your experience with the business on product availability, ambience, service and value for money?"
                    multiline
                    numberOfLines={4}
                    // maxLength={40}
                    value={reviewDescription}
                    onChangeText={revDesc => setReviewDescription(revDesc)}
                  />
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      marginHorizontal: 100,
                    }}
                    onPress={writeReview}>
                    <Text
                      style={{
                        color: 'black',
                        padding: 10,
                        fontSize: 13,
                        borderRadius: 7,
                        backgroundColor: THEMECOLOR.mainColor,
                        // letterSpacing: 1,
                        fontFamily: 'Montserrat-Medium',
                        textAlign: 'center',
                      }}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : serviceImage ? (
              <View style={{marginTop: 10}}>
                {serviceData?.additional_images?.length > 0 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                    }}>
                    {serviceData?.additional_images?.map((ele, index) => (
                      <View
                        key={index}
                        style={{width: '45%', marginBottom: 15}}>
                        <Image
                          source={{
                            uri: `${apiUrl.IMAGEURL}${ele}`,
                          }}
                          style={{width: '100%', height: 100, borderRadius: 15}}
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text
                    style={[styles.productsDetailsAns, {textAlign: 'center'}]}>
                    Images not found
                  </Text>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: THEMECOLOR.mainColor,
          paddingVertical: 10,
        }}
        onPress={handleButtonPress}>
        <Text
          style={{
            fontSize: 13,
            color: THEMECOLOR.textColor,
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          <AntDesign
            name="shoppingcart"
            size={15}
            color={THEMECOLOR.textColor}
            style={{margin: 3}}
          />{' '}
          {buttonText}
        </Text>
      </TouchableOpacity>
      <Modal
        animationIn="slideInUp"
        isVisible={isModalVisible}
        deviceWidth={deviceWidth}
        style={styles.modal}
        transparent={true}>
        <View style={styles.centeredView}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-SemiBold',
                fontSize: 15,
              }}>
              Business Hours
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <AntDesign name="closecircle" size={20} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: 10}}>
            {extractBusinessHours.map((hours, index) => (
              <View
                key={index}
                style={[
                  styles.hoursContainer,
                  {
                    borderBlockColor:
                      extractBusinessHours.length - 1 === index ? '' : 'black',
                    borderBottomWidth:
                      extractBusinessHours.length - 1 === index ? 0 : 1,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily:
                      matchDay.day === hours.day
                        ? 'Montserrat-SemiBold'
                        : 'Montserrat-Regular',
                  }}>
                  {matchDay.day === hours.day
                    ? hours.day + ' (Today)'
                    : hours.day}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    color: 'black',
                    fontFamily:
                      matchDay.day === hours.day
                        ? 'Montserrat-SemiBold'
                        : 'Montserrat-Regular',
                  }}>
                  {hours?.start_time} - {hours?.end_time}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    margin: 0,
  },
  centeredView: {
    // flex: 1,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5,
    backgroundColor: '#f7f6fd',
    // paddingLeft: 12,
    // paddingRight: 12,
    // paddingTop: 15,
    shadowColor: '#000',
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  productsDetasilRow: {
    marginBottom: 3,
    marginTop: 10,
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    flexDirection: 'row',
    flex: 1,
  },
  productDetailsHead: {
    color: '#2c2c2c',
    fontSize: 13,
    fontFamily: 'Montserrat-Medium',
    marginTop: 5,
    flex: 0.4,
    // letterSpacing: 1,
  },
  productsDetailsAns: {
    color: '#2c2c2c',
    fontSize: 12,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 5,
    flex: 0.4,
  },
});
