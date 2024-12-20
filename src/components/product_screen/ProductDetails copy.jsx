import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';

import Video from 'react-native-video';
import axios from 'axios';
import moment from 'moment';

import {Badge} from 'react-native-paper';
import {apiUrl} from '../../api-services/api-constants';
import ProductTab from './ProductTab';

import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../state-management/cartSlice';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../state-management/cartSlice';

function ProductDetails({route}) {
  const product = route.params.product;
  console.log('product>>>>>', product);
  const cart = useSelector(state => state.cart);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [buttonText, setButtonText] = React.useState('ADD TO CART');
  const [mainMedia, setMainMedia] = useState(product?.product_image[0] || '');
  const [loading, setLoading] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [reviews, setReviews] = useState(product?.Reviews);

  console.log('CART', cart);

  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    refreshReviews();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0a6fe8" style={styles.loader} />
      </View>
    );
  }

  const refreshReviews = async () => {
    try {
      const response = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_REVIEW}${product._id}`,
      );
      setReviews(response.data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
        reviews.length
      : 0;

  // const handleProductClick = item => {
  //   navigation.navigate('ProductDetails', {item});
  // };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product?._id,
        productName: product?.product_name,
        productPrice: product?.product_price,
        mrpPrice: product?.mrp_rate,
        store: product?.shop_name,
        imageUrl: product?.product_image[0],
        productCategory: product?.product_category,
        sellerName: product?.vendor_name,
        sellerId: product?.vendor_id,
      }),
    );
    setButtonText('VIEW CART');
  };

  useEffect(() => {
    getallrelevantdata();
  }, []);

  const getallrelevantdata = async () => {
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
      );
      if (res.status === 200) {
        const filteringRelevant = res.data.filter(item => {
          return (
            item.product_category === product?.product_category &&
            String(item._id) !== String(product?._id)
          );
        });

        setRelevantProducts(filteringRelevant);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  console.log('relevenTt', relevantProducts);

  const AddToCartForRelevantProduct = product => {
    dispatch(
      addToCart({
        id: product._id,
        productName: product.product_name,
        productPrice: product.product_price,
        mrpPrice: product.mrp_rate,
        store: product.shop_name,
        imageUrl: product.product_image[0],
        productCategory: product.product_category,
        sellerName: product.vendor_name,
        sellerId: product.vendor_id,
      }),
    );
  };

  const handleDecrementQuantity = productId => {
    const productInCart = cart.find(item => item.id === productId);
    if (productInCart.quantity === 1) {
      // When the quantity is 1, dispatch an action to remove the item from the cart
      dispatch(removeFromCart({id: productId}));
    } else {
      // Otherwise, just decrement the quantity
      dispatch(decrementQuantity({id: productId}));
    }
  };

  const handleButtonPress = () => {
    if (buttonText === 'VIEW CART') {
      navigation.navigate('CartStack');
    } else {
      handleAddToCart();
    }
  };

  const handleProductClick = item => {
    navigation.navigate('ProductDetails', {item});
  };

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
          alignItems: 'center',
          backgroundColor: 'white',
          elevation: 4,
          paddingBottom: 10,
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: 1,
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color="black"
            size={19}
            style={{
              backgroundColor: '#f5f5f5',
              width: 40,
              height: 40,
              textAlign: 'center',
              paddingTop: 10,
              borderRadius: 50,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        </TouchableOpacity>
        <View
          style={{paddingLeft: 20, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={navigateToSearch}>
            <AntDesign
              name="search1"
              color="black"
              size={23}
              style={{marginHorizontal: 5}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <AntDesign
              name="shoppingcart"
              size={23}
              color="black"
              style={{marginHorizontal: 5}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
          }}>
          <Badge theme={{colors: {primary: 'green'}}}>{cart?.length}</Badge>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            // backgroundColor: 'white',
            marginBottom: 10,
            // borderRadius: 10,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: 10,
              color: '#0a6fe8',
              // letterSpacing: 1,
              fontFamily: 'Montserrat-Medium',
              marginBottom: 2,
            }}>
            {product?.brand}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: 'black',
              fontFamily: 'Montserrat-Bold',
            }}>
            {product?.product_name}
          </Text>

          <View style={{width: '100%', height: 350, marginBottom: 10}}>
            {mainMedia.endsWith('.mp4') ? (
              <Video
                source={{
                  uri: `http://192.168.1.67:9000/${mainMedia.replace(
                    /\\/g,
                    '/',
                  )}?${new Date().getTime()}`,
                }}
                style={styles.mainMedia}
                controls={true}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={{
                  uri: `http://192.168.1.67:9000/${mainMedia.replace(
                    /\\/g,
                    '/',
                  )}?${new Date().getTime()}`,
                }}
                style={[styles.mainMedia, {marginTop: 20}]}
                resizeMode="contain"
              />
            )}
          </View>

          <ScrollView horizontal style={styles.thumbnailContainer}>
            {product?.product_image.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setMainMedia(image)}>
                <Image
                  source={{
                    uri: `http://192.168.1.67:9000/${image.replace(
                      /\\/g,
                      '/',
                    )}`,
                  }}
                  style={[
                    styles.thumbnail,
                    mainMedia === image && {
                      borderColor: '#007185', // Highlight color
                      borderWidth: 2,
                    },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
            {product?.product_video && (
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  opacity: 0.6,
                  width: 60,
                  height: 60,
                  borderRadius: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor:
                    mainMedia === product?.product_video ? '#007185' : '#ccc', // Highlight color
                  borderWidth: mainMedia === product?.product_video ? 2 : 1,
                }}
                onPress={() => setMainMedia(product?.product_video)}>
                {/* <Image
                  source={require('../../../assets/play-button.png')}
                  style={{width: 40, height: 40}}
                  resizeMode="contain"
                /> */}
              </TouchableOpacity>
            )}
          </ScrollView>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff9ce',
                  flexDirection: 'row',
                  borderRadius: 6,
                  paddingVertical: 2,
                  paddingHorizontal: 4,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {averageRating}
                </Text>
                <AntDesign
                  name="star"
                  size={12}
                  color="#fdd663"
                  style={{marginLeft: 3, marginTop: 2}}
                />
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    marginLeft: 3,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {' '}
                  {/* {Math.round(averageRating)}  */}
                  {reviews?.length > 0 ? reviews?.length : 0} rating
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 8,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    fontFamily: 'Montserrat-Bold',
                  }}>
                  ₹ {product?.product_price}
                </Text>
              </View>
              <View style={{marginLeft: 5, marginTop: 7}}>
                <Text
                  style={{
                    fontSize: 10,
                    color: 'black',
                    fontFamily: 'Montserrat-Medium',
                    textDecorationLine: 'line-through',
                  }}>
                  {' '}
                  ₹ {product?.mrp_rate}
                </Text>
              </View>
              <View style={{marginLeft: 5, marginTop: 7}}>
                <Text
                  style={{
                    fontSize: 10,
                    color: '#CC0C39',
                    // letterSpacing: 1,
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {' '}
                  {product?.discount ? product?.discount + '%' + ' OFF' : ''}
                </Text>
              </View>
            </View>

            <ProductTab product={product} />
            <Text
              style={{
                color: '#2c2c2c',
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                marginTop: 20,
                marginBottom: 10,
              }}>
              Relevant Products
            </Text>
            <View style={{flexDirection: 'row'}}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {relevantProducts.map((items, index) => {
                  const productInCart = cart?.find(
                    item => item.id === items._id,
                  );
                  return (
                    <Pressable
                      key={index}
                      style={styles.addsOnView}
                      onPress={() => handleProductClick(items)}>
                      <View style={{padding: 3}}>
                        {items.product_image &&
                        items.product_image.length > 0 ? (
                          <Image
                            style={styles.addsOnImage}
                            source={{
                              uri: `http://192.168.1.67:9000/${items.product_image[0].replace(
                                /\\/g,
                                '/',
                              )}`,
                            }}
                          />
                        ) : (
                          <View
                            style={{
                              width: '100%',
                              height: 100,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#f3f3f3',
                              borderRadius: 10,
                            }}>
                            <Text style={{color: '#ccc'}}>No Image</Text>
                          </View>
                        )}
                      </View>
                      <View
                        style={{backgroundColor: 'transparent', padding: 5}}>
                        <Text style={styles.addsOnText}>
                          {items.product_name.length < 15
                            ? items.product_name
                            : items.product_name.substring(0, 14) + '...'}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View style={{flex: 0.6}}>
                            <Text
                              style={{
                                fontSize: 13,
                                color: 'black',
                                fontFamily: 'Montserrat-Medium',
                              }}>
                              {/* <MaterialIcons
                                name="currency-rupee"
                                size={13}
                                color="black"
                              /> */}
                              ₹ {items.product_price}
                            </Text>
                          </View>
                          {productInCart ? (
                            productInCart.quantity > 0 ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  flex: 0.6,
                                }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    handleDecrementQuantity(items._id)
                                  }>
                                  <AntDesign
                                    name="minus"
                                    size={13}
                                    color="black"
                                    style={{
                                      backgroundColor: 'lightgrey',
                                      padding: 5,
                                      borderRadius: 50,
                                    }}
                                  />
                                </TouchableOpacity>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: 'black',
                                    marginHorizontal: 10,
                                    fontFamily: 'Montserrat-Medium',
                                    textAlign: 'center',
                                  }}>
                                  {productInCart.quantity}
                                </Text>
                                <TouchableOpacity
                                  onPress={() =>
                                    dispatch(incrementQuantity({id: items._id}))
                                  }>
                                  <AntDesign
                                    name="plus"
                                    size={13}
                                    color="black"
                                    style={{
                                      backgroundColor: 'lightgrey',
                                      padding: 5,
                                      borderRadius: 50,
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  AddToCartForRelevantProduct(items)
                                }
                                style={{
                                  flex: 0.6,
                                  backgroundColor: 'lightgrey',
                                  borderRadius: 5,
                                  height: 30,
                                  paddingTop: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: 'black',
                                    fontFamily: 'Montserrat-Medium',
                                    textAlign: 'center',
                                  }}>
                                  + Add
                                </Text>
                              </TouchableOpacity>
                            )
                          ) : (
                            <TouchableOpacity
                              onPress={() => AddToCartForRelevantProduct(items)}
                              style={{
                                flex: 0.6,
                                backgroundColor: 'lightgrey',
                                borderRadius: 5,
                                height: 30,
                                paddingTop: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: 'black',
                                  fontFamily: 'Montserrat-Medium',
                                  textAlign: 'center',
                                }}>
                                + Add
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <Text
              style={{
                color: '#2c2c2c',
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                marginBottom: 10,
                // letterSpacing: 1,
              }}>
              Customer Reviews
            </Text>
            {reviews.length > 0 ? (
              <>
                {reviews.map((ratingItem, index) => (
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
                            index < ratingItem.ratings ? '#fdd663' : '#d3d3d3'
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
                }}>
                Be the first to review this product!
              </Text>
            )}
            <TouchableOpacity
              style={{
                borderRadius: 20,
                borderColor: '#616161',
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 7,
                alignItems: 'center',
                marginTop: 25,
                marginHorizontal: 50,
              }}
              onPress={() =>
                navigation.navigate('ProductReview', {
                  productId: product._id,
                  // productImage: mainMedia,
                  refreshReviews: refreshReviews,
                })
              }>
              <Text
                style={{
                  fontSize: 13,
                  color: 'black',
                  fontFamily: 'Montserrat-Medium',
                }}>
                Write a review
              </Text>
              <EvilIcons name="pointer" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={{
          backgroundColor: 'green',
          paddingVertical: 10,
        }}
        onPress={handleButtonPress}>
        <Text
          style={{
            fontSize: 13,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          <AntDesign
            name="shoppingcart"
            size={15}
            color="black"
            style={{margin: 3}}
          />{' '}
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainMediaContainer: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  productsDetailsAns: {
    color: '#2c2c2c',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginTop: 5,
  },
  productsDetasilRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  productDetailsHead: {
    color: '#2c2c2c',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 5,
    // letterSpacing: 1,
  },
  addsOnText: {
    fontSize: 13,
    color: '#2c2c2c',
    fontFamily: 'Montserrat-SemiBold',
    // width: 200,
    // fontWeight: '500',
    // color: 'black',
    marginBottom: 5,
  },
  addsOnImage: {
    // width: '50%',
    width: 150,
    height: 100,
    resizeMode: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    // borderWidth: 1,
    // borderColor: '#ededed',
    // alignSelf: 'center',
  },
  addsOnView: {
    elevation: 1,
    margin: 5,
    borderWidth: 1,
    borderColor: '#e7e7e7',
    backgroundColor: 'white',
    // padding: 5,
    borderRadius: 10,
    // width: '15%',
  },
  mainMedia: {
    width: '100%',
    height: '80%',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 25,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
  },
  addsOnText: {
    fontSize: 13,
    color: '#2c2c2c',
    fontFamily: 'Montserrat-SemiBold',
    // width: 200,
    // fontWeight: '500',
    // color: 'black',
    marginBottom: 5,
  },
});
export default ProductDetails;
