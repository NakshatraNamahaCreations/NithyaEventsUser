import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import Video from 'react-native-video';
import axios from 'axios';
import moment from 'moment';
import {Badge, Checkbox} from 'react-native-paper';
import {apiUrl} from '../../api-services/api-constants';
import ProductTab from './ProductTab';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../state-management/cartSlice';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '../../state-management/cartSlice';
import THEMECOLOR from '../../utilities/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {
  addTechToCart,
  removeTechFromCart,
} from '../../state-management/technicianSlice';
import {useDateContext} from '../../utilities/DateSelection';

// function ProductDetails({selectedProduct, closeModal}) {
function ProductDetails() {
  const deviceWidth = Dimensions.get('window').width;
  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(false);
  // const [checked, setChecked] = useState(false);
  const {dateSelection} = useDateContext();
  const [checkedState, setCheckedState] = useState({});

  // console.log('dateSelection', dateSelection);

  const product = route.params.item;
  // console.log('product in product detailed page>>>>>', product);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const cart = useSelector(state => state.cart);

  const serviceCart = useSelector(state => state.serviceCart);
  const techCart = useSelector(state => state.technicianCart);

  console.log('techCart in product detailed page>>>>>', techCart);

  const totalCart =
    (cart.length > 0 ? cart.length : 0) +
    (serviceCart.length > 0 ? serviceCart.length : 0) +
    (techCart.length > 0 ? techCart.length : 0);

  const [buttonText, setButtonText] = React.useState('ADD TO CART');
  const [mainMedia, setMainMedia] = useState(product?.product_image[0] || '');
  const [loading, setLoading] = useState(false);
  const [relevantProducts, setRelevantProducts] = useState([]);
  const [reviews, setReviews] = useState(product?.Reviews);
  const [allTechnician, setAllTechnician] = useState([]);
  const navigateToSearch = () => {
    navigation.navigate('Search');
  };

  useEffect(() => {
    fetchData();
  }, [route.params.item]);

  const fetchData = async () => {
    // setLoading(true);
    try {
      let res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
      );
      if (res.status === 200) {
        const filteringRelevant = res.data.filter(item => {
          return (
            item.product_category === product.product_category &&
            String(item._id) !== String(product._id)
          );
        });
        setRelevantProducts(filteringRelevant);
      }
    } catch (error) {
      console.log('Error:', error);
    }
    // finally {
    //   setLoading(false);
    // }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const techRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_TECHNICIAN}`,
        );
        if (techRes.status === 200) {
          // console.log('tech', techRes.data.tech);
          setAllTechnician(techRes.data.tech.reverse());
        }
      } catch (error) {
        console.log('Error fetching technician:', error);
      }
    };

    fetchData();
  }, []);
  const filterCategoryTechnicians = allTechnician.filter(
    item => item.category === product.product_category,
  );
  // console.log('filterCategoryTechnicians', filterCategoryTechnicians);

  useEffect(() => {
    refreshReviews();
  }, []);

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

  // console.log('reviews', reviews);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0a6fe8" style={styles.loader} />
      </View>
    );
  }

  // const handleProductClick = async productId => {
  //   try {
  //     let res = await axios.get(
  //       `${apiUrl.IMAGEURL}/api/product/getproduct/${productId}`,
  //     );
  //     if (res.status === 200) {
  //       setSelectedProduct(res.data.product);
  //       setMainMedia(res.data.product.product_image[0]);
  //     }
  //   } catch (error) {
  //     console.log('Error:', error);
  //   }
  // };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.ratings, 0) /
        reviews.length
      : 0;
  // console.log('averageRating', averageRating);

  const handleProductClick = item => {
    navigation.navigate('ProductDetails', {item});
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product._id,
        productName: product.product_name,
        productPrice: product.product_price,
        mrpPrice: product.mrp_rate,
        productDimension: product.product_dimension,
        store: product.shop_name,
        imageUrl: product.product_image[0],
        sellerName: product.vendor_name,
        sellerId: product.vendor_id,
        eventStartDate: dateSelection.startDate,
        eventEndDate: dateSelection.endDate,
        commissionTax: product.commission_tax,
        commissionPercentage: product.commission_percentage,
      }),
    );
    setButtonText('VIEW CART');
  };

  const AddToCartForRelevantProduct = product => {
    dispatch(
      addToCart({
        id: product._id,
        productName: product.product_name,
        productPrice: product.product_price,
        mrpPrice: product.mrp_rate,
        productDimension: product.product_dimension,
        store: product.shop_name,
        imageUrl: product.product_image[0],
        productCategory: product.product_category,
        sellerName: product.vendor_name,
        sellerId: product.vendor_id,
        eventStartDate: dateSelection.startDate,
        eventEndDate: dateSelection.endDate,
        commissionTax: product.commission_tax,
        commissionPercentage: product.commission_percentage,
      }),
    );
  };

  const isTechInCart = techId => {
    return techCart.some(item => item.service_id === techId);
  };

  const handleCheckboxChange = tech => {
    console.log('tech', tech);
    const existingTech = techCart.find(item => item.service_id === tech._id);
    const isChecked = checkedState[tech._id];
    if (existingTech) {
      // If checked, remove from cart
      dispatch(removeTechFromCart({service_id: tech._id}));
    } else {
      // If unchecked, add to cart
      dispatch(
        addTechToCart({
          service_id: tech._id,
          category: tech.category,
          price: tech.price,
          service_name: tech.service_name,
          shop_name: tech.shop_name,
          vendor_id: tech.vendor_id,
          vendor_name: tech.vendor_name,
          eventStartDate: dateSelection.startDate,
          eventEndDate: dateSelection.endDate,
        }),
      );
    }

    // Update the checked state
    setCheckedState(prevState => ({
      ...prevState,
      [tech._id]: !isChecked, // Toggle the checked state for this technician
    }));
  };

  // const AddToCartForTechnicians = tech => {
  //   dispatch(
  //     addTechToCart({
  //       service_id: tech._id,
  //       category: tech.category,
  //       price: tech.price,
  //       service_name: tech.service_name,
  //       shop_name: tech.shop_name,
  //       vendor_id: tech.vendor_id,
  //       vendor_name: tech.vendor_name,
  //       eventStartDate: dateSelection.startDate,
  //       eventEndDate: dateSelection.endDate,
  //     }),
  //   );
  // };

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

  const openModal = () => {
    console.log('modal open', modalVisible);
    setModalVisible(true);
  };

  // const renderItem = ({item}) => {
  //   if (item.endsWith('.mp4')) {
  //     return (
  //       <Video
  //         source={{
  //           uri: `${item.replace(/\\/g, '/')}`,
  //         }}
  //         style={styles.mainMedia}
  //         controls={true}
  //         resizeMode="contain"
  //       />
  //     );
  //   } else {
  //     return (
  //       <Image
  //         source={{
  //           uri: `${item.replace(/\\/g, '/')}`,
  //         }}
  //         style={styles.mainMedia}
  //         resizeMode="cover"
  //       />
  //     );
  //   }
  // };

  // console.log('reviews', reviews);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      {/* <TouchableOpacity
          style={{
            position: 'relative',
            top: -20,
          }}
          onPress={closeModal}>
          <AntDesign
            name="closecircle"
            size={35}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity> */}
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
              color={THEMECOLOR.textColor}
              size={23}
              style={{marginHorizontal: 5}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CartStack')}>
            <AntDesign
              name="shoppingcart"
              size={23}
              color={THEMECOLOR.textColor}
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
          <Badge theme={{colors: {primary: 'green'}}}>{totalCart}</Badge>
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
            {product.product_name}
          </Text>
          {/* working below code for showing product frist image  */}
          {/* .............. */}
          <View style={{width: '100%', height: 300, marginBottom: 10}}>
            {mainMedia.endsWith('.mp4') ? (
              <Video
                source={{
                  uri: mainMedia,
                }}
                // source={{
                //   uri: `${mainMedia.replace(
                //     /\\/g,
                //     '/',
                //   )}?${new Date().getTime()}`,
                // }}
                style={styles.mainMedia}
                controls={true}
                resizeMode="contain"
              />
            ) : (
              <Image
                // source={{
                //   uri: `${mainMedia.replace(
                //     /\\/g,
                //     '/',
                //   )}?${new Date().getTime()}`,
                // }}
                source={{
                  uri: mainMedia,
                }}
                style={[styles.mainMedia, {marginTop: 20}]}
                resizeMode="contain"
              />
            )}
          </View>
          {/* ................. */}
          {/* not working */}
          {/* <View>
            <FlatList
              data={[mainMedia]} // Render only the current main media
              renderItem={renderItem}
              keyExtractor={item => item}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.mainMediaContainer}
            />
          </View> */}
          {/* //uncommand */}
          <ScrollView horizontal style={styles.thumbnailContainer}>
            {product?.product_image?.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => setMainMedia(image)}>
                <Image
                  source={{
                    uri: image,
                    // uri: `${image?.replace(/\\/g, '/')}`,
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
            {product.product_video && (
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
                    mainMedia === product.product_video ? '#007185' : '#ccc', // Highlight color
                  borderWidth: mainMedia === product?.product_video ? 2 : 1,
                }}
                onPress={() => setMainMedia(product?.product_video)}>
                <Octicons color="gray" size={12} />
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
                  {reviews.length > 0 ? reviews.length : 0} rating
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
                  ₹ {product.product_price} / Day
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
                  ₹ {product.mrp_rate}
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
                  {product.discount ? product.discount + '%' + ' OFF' : ''}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              {/* <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  marginLeft: 3,
                  fontFamily: 'Montserrat-Medium',
                }}>
                Quantity: 1
              </Text> */}
              {/* <Dropdown
                data={quantityOptions}
                onSelect={selectedItem => setQuantity(selectedItem.value)}
                buttonTextAfterSelection={selectedItem => selectedItem.label}
                rowTextForSelection={item => item.label}
                placeholder="Select quantity"
                dropdownStyle={{
                  width: 200,
                  height: 50,
                  backgroundColor: '#E9ECEF',
                  borderRadius: 12,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                }}
              /> */}
            </View>
            <ProductTab product={product} />
            {/* <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                }}>
                <View style={{marginHorizontal: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setProductSpecification(false);
                      setCoutryOfOrgin(false);
                      setProductDetails(true);
                      setManufacturer(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                        color: productDetails
                          ? THEMECOLOR.textColor
                          : '#8d8d8d',
                        textAlign: 'center',
                      }}>
                      Product Details
                    </Text>
                    <View
                      style={{
                        borderBottomColor: productDetails
                          ? THEMECOLOR.mainColor
                          : 'transparent',
                        borderBottomWidth: productDetails ? 4.5 : 0,
                        position: 'relative',
                        top: 2,
                      }}></View>
                  </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setProductSpecification(true);
                      setCoutryOfOrgin(false);
                      setProductDetails(false);
                      setManufacturer(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                        textAlign: 'center',
                        color: productSpecification
                          ? THEMECOLOR.textColor
                          : '#8d8d8d',
                      }}>
                      Specifications
                    </Text>
                    <View
                      style={{
                        borderBottomColor: productSpecification
                          ? THEMECOLOR.mainColor
                          : 'transparent',
                        borderBottomWidth: productSpecification ? 4.5 : 0,
                        position: 'relative',
                        top: 2,
                      }}></View>
                  </TouchableOpacity>
                </View>

                <View style={{marginHorizontal: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setProductSpecification(false);
                      setCoutryOfOrgin(true);
                      setProductDetails(false);
                      setManufacturer(false);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                        textAlign: 'center',
                        color: coutryOfOrgin ? THEMECOLOR.textColor : '#8d8d8d',
                      }}>
                      Country Of Orgin
                    </Text>
                    <View
                      style={{
                        borderBottomColor: coutryOfOrgin
                          ? THEMECOLOR.mainColor
                          : 'transparent',
                        borderBottomWidth: coutryOfOrgin ? 4.5 : 0,
                        position: 'relative',
                        top: 2,
                      }}></View>
                  </TouchableOpacity>
                </View>
                <View style={{marginHorizontal: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setProductSpecification(false);
                      setCoutryOfOrgin(false);
                      setProductDetails(false);
                      setManufacturer(true);
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-Medium',
                        fontSize: 13,
                        color: manufacturer ? THEMECOLOR.textColor : '#8d8d8d',
                        textAlign: 'center',
                      }}>
                      Manufacturer
                    </Text>
                    <View
                      style={{
                        borderBottomColor: manufacturer
                          ? THEMECOLOR.mainColor
                          : 'transparent',
                        borderBottomWidth: manufacturer ? 4.5 : 0,
                        position: 'relative',
                        top: 2,
                      }}></View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <View style={{marginTop: 10}}>
              {productSpecification ? (
                <View>
                  {product.Specifications.length > 0 ? (
                    <>
                      {product.Specifications.map(spe => (
                        <View key={spe._id} style={styles.productsDetasilRow}>
                          <View style={{flex: 0.5}}>
                            <Text style={styles.productDetailsHead}>
                              {spe.name}
                            </Text>
                          </View>
                          <View style={{flex: 0.5}}>
                            <Text style={styles.productsDetailsAns}>
                            
                              {spe.value}
                            </Text>
                          </View>
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
              ) : productDetails ? (
                <View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>Brand</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.brand ? product.brand : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>
                        Product Category
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.product_category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>Model Name</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.model_name ? product.model_name : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>
                        Product Dimensions
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.product_dimension
                          ? product.product_dimension
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>Item Weight</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.product_weight
                          ? product.product_weight
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>
                        Material Type
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.material_type ? product.material_type : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>Color</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.product_color ? product.product_color : 'N/A'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>
                        Warrenty Type
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.warranty ? product.warranty : 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : coutryOfOrgin ? (
                <>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>
                        Country of Orgin
                      </Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.country_of_orgin
                          ? product.country_of_orgin
                          : 'Unkown'}
                      </Text>
                    </View>
                  </View>
                </>
              ) : manufacturer ? (
                <>
                  <View style={styles.productsDetasilRow}>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productDetailsHead}>Manufacture</Text>
                    </View>
                    <View style={{flex: 0.5}}>
                      <Text style={styles.productsDetailsAns}>
                        {product.manufature_name
                          ? product.manufature_name
                          : 'Unknown'}
                      </Text>
                    </View>
                  </View>
                </>
              ) : null}
            </View> */}
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
                  const productInCart = cart.find(
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
                              uri: items.product_image[0],
                            }}
                            // source={{
                            //   uri: 'https://playeventrentals.com/wp-content/uploads/2022/03/play-rental-item-eternal-lighting-echomate-247x247.jpg',
                            // }}
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
                        {/* <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <MaterialCommunityIcons
                            name="star-box"
                            size={16}
                            color="#236339"
                            style={{
                              marginTop: 2,
                            }}
                          />
                          <View
                            style={{
                              marginLeft: 2,
                            }}>
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#236339',
                                fontFamily: 'Poppins-SemiBold',
                                letterSpacing: 1,
                              }}>
                              4.3
                            </Text>
                          </View>
                        </View> */}
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
                                    color="white"
                                    style={{
                                      backgroundColor: '#7460e4',
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
                                    color="white"
                                    style={{
                                      backgroundColor: '#7460e4',
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
                                  backgroundColor: THEMECOLOR.mainColor,
                                  borderRadius: 5,
                                  // height: 30,
                                  paddingTop: 5,
                                }}>
                                <Text
                                  style={{
                                    fontSize: 13,
                                    color: 'white',
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
                                backgroundColor: '#7460e4',
                                borderRadius: 5,
                                height: 30,
                                paddingTop: 5,
                              }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  color: 'white',
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

            {/* <Text
              style={{
                color: '#2c2c2c',
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                marginTop: 20,
                marginBottom: 10,
              }}>
              Pick up Technicians
            </Text>
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                >
                {allTechnician.map((ele, index) => (
                  <View key={index} style={[styles.addsOnView, {padding: 5}]}>
                    

                    <View style={{paddingTop: 10, padding: 3}}>
                      <Text numberOfLines={1} style={styles.addsOnText}>
                        {ele.service_name}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontFamily: 'Montserrat-Medium',
                            fontSize: 13,
                            color: 'black',
                          }}>
                          ₹{ele.price}/Day
                        </Text>
                        <TouchableOpacity
                          style={{
                            backgroundColor: THEMECOLOR.mainColor,
                            borderRadius: 5,
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Montserrat-Medium',
                              fontSize: 12,
                              color: 'white',
                              textAlign: 'center',
                            }}>
                            + Add
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View> */}
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
                  productImage: mainMedia,
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
          backgroundColor: THEMECOLOR.mainColor,
          paddingVertical: 10,
        }}
        onPress={
          filterCategoryTechnicians.length > 0 ? openModal : handleButtonPress
        }>
        <Text
          style={{
            fontSize: 13,
            color: 'white',
            fontFamily: 'Montserrat-SemiBold',
            textAlign: 'center',
          }}>
          <AntDesign
            name="shoppingcart"
            size={15}
            color="white"
            style={{margin: 3}}
          />{' '}
          {buttonText}
        </Text>
      </TouchableOpacity>
      <Modal
        animationIn="slideInUp"
        isVisible={modalVisible}
        deviceWidth={deviceWidth}
        style={{
          margin: 0,
          position: 'absolute',
          width: '100%',
          backgroundColor: '#efefef',
          shadowColor: '#000',
          bottom: 0,
          // height: '100%',
          // marginTop: '45%',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        transparent={true}>
        <View style={{padding: 15}}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-circle" color={'black'} size={25} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              fontFamily: 'Montserrat-Bold',
            }}>
            Add Technicians
          </Text>
          <View
            style={{
              borderBottomColor: '#cdcdcd',
              borderBottomWidth: 1,
              marginVertical: 10,
            }}></View>
          <ScrollView>
            <Text
              style={{
                fontSize: 14,
                color: '#2e2e2e',
                fontFamily: 'Montserrat-Bold',
                marginBottom: 10,
              }}>
              {product.product_category}
            </Text>
            <View
              style={{backgroundColor: 'white', padding: 10, borderRadius: 6}}>
              {filterCategoryTechnicians?.length > 0 ? (
                <>
                  {filterCategoryTechnicians?.map((ele, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        marginVertical: 5,
                        alignItems: 'center',
                      }}>
                      <View style={{flex: 0.6}}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {ele.service_name}
                        </Text>
                      </View>
                      <View style={{flex: 0.3}}>
                        <Text
                          style={{
                            fontSize: 13,
                            color: 'black',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          <MaterialIcons
                            name="currency-rupee"
                            color="black"
                            size={10}
                          />{' '}
                          {ele.price} / Day
                        </Text>
                      </View>
                      <View style={{flex: 0.1}}>
                        <Checkbox
                          status={
                            isTechInCart(ele._id) ? 'checked' : 'unchecked'
                          }
                          onPress={() => handleCheckboxChange(ele)}
                        />
                      </View>
                    </View>
                  ))}
                </>
              ) : null}
            </View>
          </ScrollView>
          <View>
            <TouchableOpacity onPress={handleButtonPress}>
              <Text
                style={{
                  fontSize: 13,
                  color: 'white',
                  fontFamily: 'Montserrat-SemiBold',
                  margin: 10,
                  padding: 10,
                  backgroundColor: '#7460e4',
                  borderRadius: 10,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 2,
                  // elevation: 5,
                  textAlign: 'center',
                }}>
                {buttonText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    height: '100%',
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
});
export default ProductDetails;
