import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import THEMECOLOR from '../../utilities/color';

const {width} = Dimensions.get('window');

function ProductFiltered({route}) {
  const navigation = useNavigation();
  const category = route.params.category;
  const refRBSheet = useRef();
  const [isModalVisible, setModalVisible] = useState(false);
  const [showItems, setShowItems] = useState({});
  // const [readMore, setReadMore] = useState(false);
  // const [showPrice, setShowPrice] = useState(true);
  // const [showBrand, setShowBrand] = useState(false);
  // const [showShop, setShowShop] = useState(false);
  const [showSort, setShowSort] = useState(false);
  // const [expandedItems, setExpandedItems] = useState({});
  // const [productList, setProductList] = useState([]);
  const [categoryObject, setCategoryObject] = useState(null);
  const [brandObject, setBrandObject] = useState(null);
  const [searchProduct, setSearchProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = React.useState('first');
  const [tempChecked, setTempChecked] = useState('default');
  console.log('category', category);

  const categories = [
    {id: 1, name: 'Sound'},
    {id: 2, name: 'Lighting'},
    {id: 3, name: 'Video'},
    {id: 4, name: 'Fabrication'},
    {id: 5, name: 'Genset'},
    {id: 6, name: 'shamiana'},
  ];

  const toggleModal = item => {
    setShowItems(item);
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true);
      try {
        const rentalProductRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
        );

        if (rentalProductRes.status === 200) {
          const productList = rentalProductRes.data?.filter(
            item => item.product_category === category.categoryName,
          );
          setFilteredProducts(productList);
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  console.log(
    'filteredProducts>>>>>>',
    filteredProducts.map(ele => ele.Specifications),
  );
  // console.log('category.categoryName>>>>>>', category.categoryName);

  // console.log(
  //   'productList',
  //   filteredProducts.map(ele => ele.product_name),
  // );

  const selectedCategory = product => {
    const category = categories.find(item => item.name === product);
    if (category) {
      setCategoryObject(category.name);
    }
  };

  const uniqueBrands = [...new Set(filteredProducts.map(ele => ele.brand))];

  const selectedBrand = brand => {
    const brandItem = filteredProducts.find(item => item.brand === brand);
    // console.log('brandItem inside function', brandItem);
    if (brandItem) {
      setBrandObject(brand);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (imgActive < vendor.length - 1) {
  //       scrollViewRef.current.scrollTo({
  //         x: (imgActive + 1) * width,
  //         animated: true,
  //       });
  //     } else {
  //       scrollViewRef.current?.scrollTo({x: 0, animated: true});
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

  // const VendorImageSlider = ({images}) => {
  //   const scrollViewRef = useRef(null);
  //   const [currentIndex, setCurrentIndex] = useState(0);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       const nextIndex = (currentIndex + 1) % images.length;
  //       setCurrentIndex(nextIndex);
  //       scrollViewRef.current.scrollTo({x: nextIndex * width, animated: true});
  //     }, 3000);

  //     return () => clearInterval(interval);
  //   }, [currentIndex, images.length]);

  //   return (
  //     <View style={{position: 'relative'}}>
  //       <ScrollView
  //         ref={scrollViewRef}
  //         horizontal
  //         pagingEnabled
  //         showsHorizontalScrollIndicator={false}
  //         style={styles.sliderContainer}>
  //         {images.map((image, index) => (
  //           <Image
  //             key={index}
  //             source={{uri: image.imageUrl}}
  //             style={styles.sliderImage}
  //           />
  //         ))}
  //       </ScrollView>
  //       <View style={styles.paginationDots}>
  //         {images.map((_, index) => (
  //           <Text
  //             key={index}
  //             style={currentIndex === index ? styles.dotActive : styles.dot}>
  //             ●
  //           </Text>
  //         ))}
  //       </View>
  //     </View>
  //   );
  // };

  // const FirstRoute = () => (
  // <ScrollView>
  //   <View style={{flex: 1, backgroundColor: 'white'}}>
  //     {filteredProducts.length === 0 ? (
  //       <Text
  //         style={{
  //           marginTop: 30,
  //           color: '#878697',
  //           fontSize: 17,
  //           fontWeight: '500',
  //           fontFamily: 'Poppins-SemiBold',
  //           textAlign: 'center',
  //         }}>
  //         {`No results for ${category.categoryName.toLowerCase()}`}
  //       </Text>
  //     ) : (
  //       <>
  //         <View
  //           style={{
  //             marginLeft: 5,
  //             flexDirection: 'row',
  //             justifyContent: 'space-evenly',
  //             alignItems: 'center',
  //             marginTop: 20,
  //           }}>
  //           <View
  //             style={{
  //               flex: 0.1,
  //               borderBottomWidth: 1,
  //               borderBottomColor: '#e0e0e0',
  //             }}></View>
  //           <View style={{flex: 0.8}}>
  //             <Text
  //               style={{
  //                 // marginTop: 30,
  //                 color: '#696969',
  //                 fontSize: 15,
  //                 textAlign: 'center',
  //                 fontFamily: 'Poppins-Medium',
  //                 letterSpacing: 3,
  //               }}>
  //               {`ALL SHOPS OFFERING ${category.categoryName.toUpperCase()}`}
  //             </Text>
  //           </View>

  //           <View
  //             style={{
  //               flex: 0.1,
  //               borderBottomWidth: 1,
  //               borderBottomColor: '#e0e0e0',
  //             }}></View>
  //         </View>
  //         <ScrollView contentContainerStyle={styles.scrollViewContent}>
  //           {vendor.map((vendor, vIndex) => (
  //             <Pressable
  //               key={vIndex}
  //               style={{marginBottom: 30}}
  //               onPress={() => {
  //                 navigation.navigate('VendorProfile', {
  //                   vendorProfile: vendor,
  //                 });
  //               }}>
  //               <View style={styles.vendorContainer}>
  //                 <TouchableOpacity
  //                   style={{
  //                     marginTop: 10,
  //                     position: 'absolute',
  //                     right: 20,
  //                     zIndex: 1,
  //                     width: 40,
  //                     height: 40,
  //                     flexDirection: 'row',
  //                     justifyContent: 'center',
  //                     alignItems: 'center',
  //                     backgroundColor: '#00000047',
  //                     borderRadius: 15,
  //                   }}
  //                   onPress={() => setIsWishlist(!isWishlist)}>
  //                   <Octicons
  //                     name={!isWishlist ? 'heart' : 'heart-fill'}
  //                     size={22}
  //                     color={!isWishlist ? 'white' : '#ea5362'}
  //                   />
  //                 </TouchableOpacity>
  //                 <VendorImageSlider images={vendor.vendorBannerImage} />
  //                 <View style={styles.vendorDetails}>
  //                   <View
  //                     style={{
  //                       backgroundColor: 'white',
  //                       position: 'absolute',
  //                       top: -20,
  //                       left: 0,
  //                       borderTopRightRadius: 15,
  //                     }}>
  //                     <Text style={styles.vendorLocation}>
  //                       <MaterialCommunityIcons
  //                         name="map-marker"
  //                         size={14}
  //                         color="#ea5362"
  //                       />{' '}
  //                       {vendor.location}
  //                     </Text>
  //                   </View>
  //                   <View
  //                     style={{
  //                       // flex: 1,
  //                       flexDirection: 'row',
  //                       // justifyContent: 'space-between',
  //                     }}>
  //                     <View style={{flex: 0.6}}>
  //                       <Text style={styles.vendorName}>{vendor.shopName}</Text>
  //                     </View>
  //                     <View
  //                       style={{
  //                         flex: 0.6,
  //                         flexDirection: 'row',
  //                         justifyContent: 'flex-end',
  //                         alignItems: 'center',
  //                       }}>
  //                       <MaterialCommunityIcons
  //                         name="star-box"
  //                         size={20}
  //                         color="#236339"
  //                       />
  //                       <View
  //                         style={{
  //                           marginLeft: 2,
  //                         }}>
  //                         <Text style={styles.vendorRatingText}>
  //                           {vendor.rating}
  //                         </Text>
  //                       </View>
  //                     </View>
  //                   </View>
  //                   <View
  //                     style={{
  //                       marginTop: 5,
  //                     }}>
  //                     <Text
  //                       style={{
  //                         color: '#1256cb',
  //                         fontSize: 14,
  //                         fontWeight: '500',
  //                         fontFamily: 'Poppins-Medium',
  //                       }}>
  //                       <MaterialCommunityIcons
  //                         name="brightness-percent"
  //                         size={18}
  //                         color="#1256cb"
  //                       />{' '}
  //                       {vendor.discount}% OFF {vendor.clausesCondition}{' '}
  //                     </Text>
  //                   </View>
  //                 </View>
  //               </View>
  //             </Pressable>
  //           ))}
  //         </ScrollView>
  //       </>
  //     )}
  //   </View>
  // </ScrollView>;
  // );

  // const SecondRoute = () => <></>;

  // const [sortedAndFilteredProducts, setsortedAndFilteredProducts] = useState(allProducts);

  const toggleSortModal = () => {
    setShowSort(true);
  };
  const closeSortModal = () => {
    setShowSort(false);
  };
  const toggleFilterModal = () => {
    setShowFilter(true);
  };
  const closeFilterModal = () => {
    setShowFilter(false);
  };
  //  const filterPrice = item.product_price >= minPrice && item.product_price <= maxPrice;

  // filter products based on search query
  useEffect(() => {
    if (searchProduct.trim() !== '') {
      const searchingProducts = filteredProducts.filter(item =>
        item.product_name.toLowerCase().includes(searchProduct.toLowerCase()),
      );
      setSearchedProducts(searchingProducts);
    } else {
      setSearchedProducts(filteredProducts); // Show all products if search is cleared
    }
  }, [searchProduct, filteredProducts]);

  const calculateAverageRating = reviews => {
    if (reviews.length === 0) return 0;
    return (
      reviews.reduce((sum, review) => sum + review.ratings, 0) / reviews.length
    );
  };

  const sortProducts = (products, criteria) => {
    return [...products].sort((a, b) => {
      switch (criteria) {
        case 'new':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'low':
          return a.product_price - b.product_price;
        case 'high':
          return b.product_price - a.product_price;
        case 'ratingLow':
          return (
            calculateAverageRating(a.Reviews) -
            calculateAverageRating(b.Reviews)
          );
        case 'ratingHigh':
          return (
            calculateAverageRating(b.Reviews) -
            calculateAverageRating(a.Reviews)
          );
        default:
          return 0; // No sorting for 'default'
      }
    });
  };

  // Now apply sorting on searched products using useMemo for optimization
  const sortedAndFilteredProducts = useMemo(
    () => sortProducts(filteredProducts, checked),
    [checked, searchedProducts],
  );

  const handleSortOptionSelect = sortOption => {
    setTempChecked(sortOption);
  };

  const handleApplySort = () => {
    setChecked(tempChecked);
    setShowSort(false);
  };

  const applyFilters = () => {
    const filtered = filteredProducts.filter(item => {
      const filterByCategory = categoryObject
        ? item.product_category === categoryObject
        : true;
      const filterByBrand = brandObject ? item.brand === brandObject : true;
      return filterByCategory && filterByBrand;
    });
    setFilteredProducts(filtered);
    closeFilterModal();
  };

  const clearFilters = () => {
    setCategoryObject(null);
    setBrandObject(null);
    setFilteredProducts(filteredProducts);
    closeFilterModal();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <ActivityIndicator size="large" color="#0a6fe8" />
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        // backgroundColor: '#f7f6fd',
        height: '100%',
      }}>
      {/* <LinearGradient
        colors={['#9a9a9a', '#f4ffeb', '#fff']}
        style={{paddingTop: 35, paddingBottom: 10}}> */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          elevation: 1,
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 10,
        }}>
        <Pressable>
          <Ionicons
            name="chevron-back-sharp"
            size={25}
            color="#575656"
            // style={{marginLeft: 5}}
            onPress={() => navigation.goBack()}
          />
        </Pressable>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            marginBottom: 3,
            fontFamily: 'Montserrat-SemiBold',
            width: '100%',
          }}>
          {category.categoryName}
        </Text>
      </View>
      {/* </LinearGradient> */}
      <View>
        {filteredProducts?.length === 0 ? null : (
          <>
            {/* <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
              style={{
                flexDirection: 'row',
              }}> */}
            <View
              style={{
                flexDirection: 'row',
                marginTop: 15,
                alignItems: 'center',
              }}>
              {/* <View
                style={{
                  flex: 0.8,
                  marginTop: 7,
                  marginRight: 15,
                  width: '100%',
                }}>
                <Feather
                  name="search"
                  size={19}
                  color="#ea5362"
                  style={{
                    position: 'absolute',
                    zIndex: 11111,
                    left: 15,
                    top: 15,
                  }}
                />
                <TextInput
                  style={{
                    backgroundColor: 'white',
                    elevation: 3,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'transparent',
                    // height: 45,
                    paddingVertical: 10,
                    color: 'black',
                    fontSize: 15,
                    paddingLeft: 40,
                    marginBottom: 10,
                    fontFamily: 'Montserrat-Medium',
                    // letterSpacing: 1
                  }}
                  placeholderTextColor="#737373"
                  placeholder={`Search for ${category.categoryName}`}
                  value={searchProduct}
                  onChangeText={item => setSearchProduct(item)}
                />
              </View> */}
              {/* <Pressable
                onPress={toggleSortModal}
                style={{
                  flex: 0.1,
                }}>
                <MaterialCommunityIcons name="sort" size={25} color="#575656" />
              </Pressable> */}

              <Pressable
                onPress={toggleSortModal}
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#efefef',
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  elevation: 1,
                  marginLeft: 15,
                  paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    color: '#2f2f2f',
                    fontSize: 13,
                    fontFamily: 'Montserrat-SemiBold',
                    textAlign: 'center',
                    // letterSpacing: 1,
                  }}>
                  Sort{' '}
                  <MaterialCommunityIcons
                    name="sort"
                    size={20}
                    color="#575656"
                  />
                </Text>
              </Pressable>
            </View>
            {/* </ScrollView> */}
          </>
        )}
        <ScrollView>
          <View style={{flex: 1}}>
            {filteredProducts?.length === 0 ? (
              <Text
                style={{
                  marginTop: 30,
                  color: '#878697',
                  fontSize: 17,
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                  // letterSpacing: 1,
                }}>
                {`No results for ${category.categoryName.toLowerCase()}`}
              </Text>
            ) : (
              <ScrollView>
                {/* <Text
                  style={{
                    color: '#696969',
                    fontSize: 15,
                    textAlign: 'center',
                    fontFamily: 'Poppins-Medium',
                    letterSpacing: 3,
                    marginTop: 20,
                  }}>
                  {`ALL SHOPS OFFERING ${category.categoryName.toUpperCase()}`}
                </Text> */}
                <View style={{marginTop: 10, marginBottom: 100}}>
                  <View
                    style={{
                      backgroundColor: 'white',
                    }}>
                    {sortedAndFilteredProducts?.map((ele, index) => {
                      // console.log(
                      //   'rating',
                      //   ele.map(ele => ele.Reviews),
                      // );
                      const averageRating =
                        ele.Reviews.length > 0
                          ? ele.Reviews.reduce((a, b) => a + b.ratings, 0) /
                            ele.Reviews.length
                          : 0;
                      return (
                        <View key={ele._id}>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('ProductDetails', {
                                item: ele,
                              })
                            }
                            style={{
                              flexDirection: 'row',
                              margin: 10,
                            }}>
                            <View style={{padding: 5, flex: 0.6}}>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: 15,
                                  marginBottom: 3,
                                  fontFamily: 'Montserrat-SemiBold',
                                }}>
                                {ele.product_name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  marginVertical: 4,
                                }}>
                                <MaterialCommunityIcons
                                  name="star-box"
                                  size={20}
                                  color="#006705"
                                />
                                <View
                                  style={{
                                    marginLeft: 2,
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 15,
                                      color: '#006705',
                                      fontFamily: 'Montserrat-Bold',
                                      marginTop: 0,
                                    }}>
                                    {Math.round(averageRating)}
                                  </Text>
                                </View>
                              </View>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: 'black',
                                  // letterSpacing: 1,
                                  marginVertical: 5,
                                  fontFamily: 'Montserrat-SemiBold',
                                }}>
                                <MaterialIcons
                                  name="currency-rupee"
                                  size={13}
                                  color="black"
                                />
                                {ele.product_price}
                              </Text>
                              {/* <Text
                              style={{
                                fontSize: 14,
                                marginTop: 6,
                                color: '#02060c99',
                                // letterSpacing: 1,
                                fontFamily: 'Montserrat-Medium',
                              }}>
                              {expandedItems[ele._id] ||
                              ele.productDescription?.length < 68
                                ? ele.productDescription
                                : ele.productDescription?.substring(0, 67) +
                                  '...'}
                            </Text>
                            {ele.productDescription?.length > 68 ? (
                              <Pressable
                                onPress={() => handleReadMore(ele._id)}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    // letterSpacing: 1,
                                    color: '#02060c99',
                                    fontFamily: 'Montserrat-SemiBold',
                                  }}>
                                  {expandedItems[ele._id]
                                    ? 'show less'
                                    : 'read more'}
                                </Text>
                              </Pressable>
                            ) : (
                              ''
                            )} */}
                            </View>
                            <View style={{flex: 0.4}}>
                              {/* <Pressable
                              style={
                                {
                                  // borderWidth: 1,
                                  // borderColor: '#e0e0e0',
                                  // borderRadius: 16,
                                }
                              }
                              onPress={() => toggleModal(ele)}> */}
                              <Image
                                style={{
                                  marginTop: 8,
                                  width: 100,
                                  height: 100,
                                  alignSelf: 'center',
                                  borderRadius: 16,
                                }}
                                source={{
                                  uri: ele.product_image[0],
                                }}
                                // source={{
                                //   uri: 'https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/m/y/y/-original-imahfcgwza6fty8w.jpeg?q=70',
                                // }}
                              />
                              {/* </Pressable> */}
                            </View>
                          </TouchableOpacity>
                          <View
                            style={{
                              borderWidth: 1,
                              borderColor:
                                sortedAndFilteredProducts.length - 1 === index
                                  ? 'transparent'
                                  : '#dadde1',
                              borderStyle:
                                sortedAndFilteredProducts.length - 1 === index
                                  ? null
                                  : 'dashed',
                              margin: 10,
                            }}></View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </View>
      {/* show short details */}
      <Modal
        isVisible={isModalVisible}
        animationIn="slideInUp"
        // animationInTiming={400}
        // animationOut={400}
        backdropOpacity={0.5}
        style={{margin: 0, position: 'absolute', bottom: 0, width: '100%'}}>
        <TouchableOpacity
          style={{
            position: 'relative',
            top: -20,
          }}
          onPress={toggleModal}>
          <AntDesign
            name="closecircle"
            size={35}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#f7f6fd',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 15,
          }}>
          <ScrollView>
            <View
              style={{
                backgroundColor: 'white',
                marginBottom: 10,
                borderRadius: 10,
                padding: 6,
              }}>
              <View style={{width: '100%'}}>
                <Image
                  style={{
                    width: '100%',
                    height: 300,
                    resizeMode: 'stretch',
                    alignSelf: 'center',
                    borderRadius: 10,
                  }}
                  // source={{
                  //   uri: showItems.productImage[0]?.imageUrl,
                  // }}
                  source={{
                    uri: 'https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/m/y/y/-original-imahfcgwza6fty8w.jpeg?q=70',
                  }}
                />
              </View>
              <View style={{padding: 10}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 18,
                    marginTop: 10,
                    letterSpacing: 1,
                    marginVertical: 5,
                    fontFamily: 'Montserrat-SemiBold',
                  }}>
                  {showItems.product_name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      backgroundColor: '#fff9ce',
                      borderColor: '#f1e698',
                      borderWidth: 1,
                      alignItems: 'center',
                      flexDirection: 'row',
                      borderRadius: 5,
                    }}>
                    {Array.from({length: 5}).map((_, index) => (
                      <MaterialCommunityIcons
                        key={index}
                        name="star"
                        size={13}
                        color="#ffa41c"
                      />
                    ))}
                  </View>
                  <View
                    style={{
                      marginLeft: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                        marginTop: 0,
                        letterSpacing: 1,
                        marginTop: 2,
                      }}>
                      {' '}
                      435 ratings
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    marginTop: 6,
                    letterSpacing: 1,
                    color: '#696969',
                    fontFamily: 'Montserrat-Medium',
                  }}>
                  {/* {showItems.productDescription} */}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: 'white',
                marginBottom: 10,
                borderRadius: 10,
                padding: 6,
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              {/* <View
                style={{
                  flexDirection: 'row',
                  marginTop: 5,
                  borderColor: '#ea5362',
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 5,
                  backgroundColor: '#ea53621a',
                  flex: 0.3,
                }}>
                <TouchableOpacity
                  style={{
                    padding: 9,
                    marginTop: 3,
                  }}>
                  <FontAwesome5
                    name="minus"
                    size={14}
                    color="#ea5362"
                    style={{fontWeight: '500'}}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'black',
                    padding: 9,
                    fontFamily: 'Poppins-SemiBold',
                    letterSpacing: 1,
                    fontSize: 15,
                  }}>
                  1
                </Text>
                <TouchableOpacity
                  style={{
                    padding: 9,
                    marginTop: 3,
                  }}>
                  <FontAwesome5 name="plus" size={14} color="#ea5362" />
                </TouchableOpacity>
              </View> */}
              {/* <View style={{flex: 0.1}}></View> */}
              <View>
                <Pressable
                  style={{
                    backgroundColor: '#9a9a9a',
                    padding: 10,
                    borderRadius: 7,
                    elevation: 3,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 16,
                      fontFamily: 'Montserrat-Medium',
                      textAlign: 'center',
                      letterSpacing: 1,
                    }}>
                    Add Item{' '}
                    {/* <MaterialIcons
                      name="currency-rupee"
                      size={14}
                      color="black"
                    />
                    {showItems.productPrice} */}
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Sort========================================= */}
      <Modal
        isVisible={showSort}
        style={{margin: 0, position: 'absolute', bottom: 0, width: '100%'}}>
        <TouchableOpacity
          style={{
            position: 'relative',
            top: -20,
          }}
          onPress={closeSortModal}>
          <AntDesign
            name="closecircle"
            size={35}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#f7f6fd',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 15,
          }}>
          <ScrollView>
            <View
              style={{
                // backgroundColor: 'white',
                marginBottom: 10,
                borderRadius: 10,
                padding: 6,
              }}>
              <View style={{width: '100%'}}>
                <TouchableOpacity
                  style={{position: 'absolute', bottom: 10, left: 10}}>
                  <Ionicons name="heart-outline" size={27} color="#e91e63" />
                </TouchableOpacity>
              </View>
              <View>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 15,
                    // marginBottom: 10,
                    marginTop: 10,
                    fontFamily: 'Montserrat-SemiBold',
                    // borderBottomWidth: 1,
                    // borderBottomColor: '#f2f2f2',
                  }}>
                  Sort
                </Text>
                <View style={{padding: 10}}>
                  {[
                    'default',
                    'new',
                    'low',
                    'high',
                    'ratingLow',
                    'ratingHigh',
                  ].map(sortOption => (
                    <TouchableOpacity
                      key={sortOption}
                      onPress={() => handleSortOptionSelect(sortOption)}
                      style={{
                        paddingVertical: 10,
                      }}>
                      <Text
                        style={{
                          color:
                            tempChecked === sortOption
                              ? THEMECOLOR.mainColor
                              : 'black',
                          fontSize: 14,
                          fontFamily: 'Montserrat-Medium',
                        }}>
                        {sortOption === 'default'
                          ? 'Default'
                          : sortOption === 'new'
                          ? 'Newest'
                          : sortOption === 'low'
                          ? 'Price: Low to High'
                          : sortOption === 'high'
                          ? 'Price: High to Low'
                          : sortOption === 'ratingLow'
                          ? 'Rating: Low to High'
                          : 'Rating: High to Low'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{borderColor: '#e9e9e9', borderWidth: 0.8}}></View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    padding: 10,
                  }}>
                  <TouchableOpacity
                    onPress={handleApplySort}
                    style={{
                      backgroundColor: '#21005d',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 5,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 15,
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Apply
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Filter========================================= */}
      {/* <Modal
        isVisible={showFilter}
        style={{margin: 0, position: 'absolute', bottom: 0, width: '100%'}}>
        <TouchableOpacity
          style={{
            position: 'relative',
            top: -20,
          }}
          onPress={closeFilterModal}>
          <AntDesign
            name="closecircle"
            size={35}
            color="white"
            style={{textAlign: 'center'}}
          />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: '#f7f6fd',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 15,
          }}>
          <View
            style={{
              // backgroundColor: 'white',
              marginBottom: 10,
              borderRadius: 10,
              padding: 6,
            }}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontSize: 15,
                  // marginBottom: 10,
                  marginTop: 10,
                  fontFamily: 'Montserrat-SemiBold',
                }}>
                Filter
              </Text>
              <View
                style={{
                  padding: 10,
                  borderBottomColor: '#e9e9e9',
                  borderBottomWidth: 1,
                }}>
                <View style={{marginBottom: 5}}>
                  <Text
                    style={{
                      color: '#2f2f2f',
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    Categories
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      margin: 2,
                    }}>
                    {categories.map(ele => (
                      <TouchableOpacity
                        key={ele.id}
                        onPress={() => selectedCategory(ele.name)}
                        style={{
                          marginBottom: 5,
                          backgroundColor:
                            categoryObject === ele.name
                              ? '#cfcfcf'
                              : 'transparent',
                          borderColor: '#cfcfcf',
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 13,
                            textAlign: 'center',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {ele.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View
                style={{
                  padding: 10,
                  borderBottomColor: '#e9e9e9',
                  borderBottomWidth: 1,
                }}>
                <View style={{marginBottom: 5}}>
                  <Text
                    style={{
                      color: '#2f2f2f',
                      fontSize: 13,
                      textAlign: 'left',
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    Brand
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      margin: 2,
                    }}>
                    {uniqueBrands.map(brand => (
                      <TouchableOpacity
                        key={brand}
                        onPress={() => selectedBrand(brand)}
                        style={{
                          marginBottom: 5,
                          backgroundColor:
                            brandObject === brand ? '#cfcfcf' : 'transparent',
                          borderColor: '#cfcfcf',
                          borderWidth: 1,
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            fontSize: 13,
                            textAlign: 'center',
                            fontFamily: 'Montserrat-Medium',
                          }}>
                          {brand}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <TouchableOpacity
                  onPress={clearFilters}
                  style={{
                    backgroundColor: '#3b3026',
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    Clear
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={applyFilters}
                  style={{
                    backgroundColor: '#21005d',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal> */}
    </View>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    // margin: 8,
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'Poppins-SemiBold',
  },
  activeTab: {
    color: 'black', // Active tab text color
    fontWeight: '500',
    // fontSize: 17,
  },
  inactiveTab: {
    color: '#696969', // Inactive tab text color
  },
  // scrollViewContent: {
  //   paddingVertical: 20,
  // },
  bannerImage: {
    width: width - 40,
    height: 200,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginHorizontal: 10,
  },
  imageContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
  },
  viewBox: {
    width: width,
    height: 200,
  },
  dotContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    alignItems: 'center',
    bottom: 50,
  },
  // dot: {
  //   margin: 3,
  //   color: 'yellow',
  // },
  // dotActive: {
  //   margin: 3,
  //   color: 'white',
  // },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  vendorDe: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    backgroundColor: 'white',
    elevation: 3,
    width: width - 40,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  scrollViewContent: {
    paddingVertical: 20,
  },
  vendorContainer: {
    // backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 3,
  },
  sliderContainer: {
    width: width,
    height: 200,
  },
  sliderImage: {
    width: width,
    height: 200,
    resizeMode: 'cover',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    margin: 3,
    color: 'gray',
  },
  dotActive: {
    margin: 3,
    color: 'white',
  },
  vendorDetails: {
    padding: 15,
    alignItems: 'flex-start',
    backgroundColor: 'white',
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins-Bold',
    color: '#252525',
  },
  vendorLocation: {
    fontSize: 14,
    color: '#363636',
    fontFamily: 'Poppins-Medium',
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  vendorRatingText: {
    fontSize: 16,
    color: '#363636',
    fontFamily: 'Poppins-Medium',
    marginTop: 2,
    letterSpacing: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    margin: 0,
  },
  centeredView: {
    // flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5,
    backgroundColor: '#f7f6fd',
    // paddingLeft: 12,
    // paddingRight: 12,
    // paddingTop: 15,
    shadowColor: '#000',
  },
});

export default ProductFiltered;
