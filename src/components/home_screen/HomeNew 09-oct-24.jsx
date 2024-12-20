import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  // BackHandler,
  // ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import VendorDisplay from '../vendor/VendorDisplay';
import HeaderNew from './HeaderNew';
import Category from '../product_screen/Category';
// import LinearGradient from 'react-native-linear-gradient';
// import Featured from './Featured';
import Footer from '../../screens/Footer';
import Service from './Service';
import businessman from '../../../assets/businessman.json';
import Professionals from '../../../assets/Professionals.json';
import Reliable from '../../../assets/Reliable.json';
import Support from '../../../assets/Support.json';
import {useNavigation} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import NewArrivals from './NewArrivals';
import {Calendar} from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import moment from 'moment';
// import {orderData, productData} from '../../data/global-data';

// import homevideo from '../../../assets/homevideo.mp4';
// import Video, {VideoRef} from 'react-native-video';
// import SliderBanner from './sliderBanner';

const {width} = Dimensions.get('window');

function HomeNew() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vendorAsync, setVendorAsync] = useState(null);
  const vendor = [
    {
      imageUrl: require('../../../assets/event1.jpeg'),
    },
    {
      imageUrl: require('../../../assets/event2.jpeg'),
    },
    {
      imageUrl: require('../../../assets/event2.jpeg'),
    },
    {
      imageUrl: require('../../../assets/event1.jpeg'),
    },
  ];

  useEffect(() => {
    const getVendorData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setVendorAsync(userData ? JSON.parse(userData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };

    getVendorData();
  }, []);

  // console.log('vendorAsync', vendorAsync);

  const lastBackPressed = useRef(0);

  // const useDoubleBackExit = () => {
  //   const lastBackPressed = useRef(0);

  //   const onBackPress = () => {
  //     const currentTime = new Date().getTime();
  //     const DOUBLE_PRESS_DELAY = 2000;
  //     if (currentTime - lastBackPressed.current < DOUBLE_PRESS_DELAY) {
  //       BackHandler.exitApp();
  //       return true;
  //     }
  //     lastBackPressed.current = currentTime;
  //     ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
  //     return true;
  //   };

  //   useEffect(() => {
  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () => {
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //     };
  //   }, []);
  // };

  // useDoubleBackExit();

  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isRangeSelection, setIsRangeSelection] = useState(true);
  const [allRentalProduct, setallRentalProduct] = useState([]);
  const [allorderproduct, setAllOrderProduct] = useState([]);
  const [allProductVendors, setAllProductVendors] = useState([]);
  const [serviceListData, setServiceListData] = useState([]);

  const [disabledDate, setDisabledDate] = useState({});

  const today = moment().format('YYYY-MM-DD');

  const enableCalendar = () => setIsCalendarVisible(!isCalendarVisible);

  const calculateDisabledDates = () => {
    let disabledDates = {};

    let date = moment().subtract(1, 'days');
    while (date.isBefore(today)) {
      disabledDates[date.format('YYYY-MM-DD')] = {
        disabled: true,
        disableTouchEvent: true,
      };
      date = date.add(1, 'days');
    }
    return disabledDates;
  };

  useEffect(() => {
    const disabledDates = calculateDisabledDates();
    setDisabledDate(disabledDates);
  }, []);

  const getMarkedDates = () => {
    let markedDates = {...disabledDate};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: 'blue',
        textColor: 'white',
      };
    }

    if (startDate && endDate) {
      let currentDate = new Date(startDate);
      let endDateObj = new Date(endDate);

      while (currentDate <= endDateObj) {
        let dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== startDate && dateString !== endDate) {
          markedDates[dateString] = {
            color: '#70d7c7',
            textColor: 'white',
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rentalProductRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
        );
        if (rentalProductRes.status === 200) {
          setallRentalProduct(rentalProductRes.data);
        }
        const orderRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ORDER}`,
        );
        if (orderRes.status === 200) {
          setAllOrderProduct(orderRes.data);
        }
        const vendorRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_PRODUCT_VENDOR}`,
        );
        if (vendorRes.status === 200) {
          setAllProductVendors(vendorRes.data.data);
        }
        const serviceRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_SERVICE}`,
        );
        if (serviceRes.status === 200) {
          setServiceListData(serviceRes.data.data);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  const filterOnlyServiceVendor = serviceListData.filter(
    item => item.service_name !== 'Vendor & Seller',
  );

  // console.log('serviceListData', serviceListData);

  // console.log('allProductVendors', allProductVendors);

  // Fetch order products when component mounts
  // useEffect(() => {
  //   const getAllOrderProduct = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl.BASEURL}${apiUrl.GET_ORDER}`);
  //       if (res.status === 200) {
  //         setAllOrderProduct(res.data);
  //       }
  //     } catch (error) {
  //       console.log('Error:', error);
  //     }
  //   };

  //   getAllOrderProduct();
  // }, []); // Fetch only once on mount

  // Handle date selection and fetch date-range data

  const handleDayPress = day => {
    if (isRangeSelection) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(day.dateString);
        setEndDate(null);
      } else if (startDate && !endDate) {
        const start = new Date(startDate);
        const end = new Date(day.dateString);
        if (end > start) {
          setEndDate(day.dateString);
        } else {
          setStartDate(day.dateString);
          setEndDate(null);
        }
      }
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchDateRangeData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const fetchDateRangeData = (start, end) => {
    console.log(`Fetching data from ${start} to ${end}`);
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('startDate', startDate);
      // await AsyncStorage.setItem('endDate', endDate || startDate);

      // console.log('Saved startDate:', startDate);
      // console.log('Saved endDate:', endDate || startDate);

      setIsCalendarVisible(false);
    } catch (error) {
      console.error('Error saving dates:', error);
    }
  };

  const imageSliderData = vendor.map(item => ({
    img: item.imageUrl,
  }));

  // console.log('imageSliderData', imageSliderData);

  const makesDiffD = [
    {
      _id: '65ec0b80474d5d0ee66d3f17',
      title: 'Trusted by Professionals',
      animation: businessman,
    },
    {
      _id: '65d09d3461ad81ac9aa6541c',
      title: 'Tailored Professionals',
      animation: Professionals,
    },
    {
      _id: '65ec0b80474d5d0ee66d3f17',
      title: 'Reliable',
      animation: Reliable,
    },
    {
      _id: '65d09d3461ad81ac9aa6541c',
      title: '24/7 Support',
      animation: Support,
    },
  ];
  useEffect(() => {
    setIsCalendarVisible(true);
  }, []);

  const orders = allorderproduct.flatMap(item => item.product_data);
  // console.log('allorderproduct', allorderproduct);
  // console.log('product_id', allRentalProduct?._id);

  function calculateAvailableQuantity(product, orderValue, startDateValue) {
    // Convert the startDate to a comparable format
    const formattedStartDate = moment(startDateValue).format('YYYY-MM-DD');

    // Filter orders for the given product and matching the selected date
    const ordersForDate = orderValue.filter(order => {
      return (
        moment(order.event_date).format('YYYY-MM-DD') === formattedStartDate &&
        order.id === product?._id
      );
    });

    console.log('Orders for date:', ordersForDate);
    console.log('Available Quantity for Product:', product.product_name);

    const totalAppliedQuantity = ordersForDate.reduce(
      (sum, order) => sum + order.quantity,
      0,
    );

    // Calculate and return available quantity
    return product.stock_in_hand - totalAppliedQuantity;
  }

  // Function to get products with available quantities based on orders and selected start date
  function getAvailableProducts(products, orderValue, startDateValue) {
    return products
      .map(product => {
        const availableQuantity = calculateAvailableQuantity(
          product,
          orderValue,
          startDateValue,
        );
        console.log('availableQuantity', availableQuantity);

        return {
          ...product,
          availableQuantity,
          isAvailable: availableQuantity > 0, // Mark product as available if quantity > 0
        };
      })
      .filter(product => product.isAvailable); // Only return available products
  }

  // Example usage: Getting available products after a date is selected
  const availableProducts = getAvailableProducts(
    allRentalProduct,
    orders,
    startDate,
  );
  console.log('Selected Start Date:', startDate);

  // Output available products
  // console.log('Available Products:', availableProducts.length);

  // console.log('startDate', startDate);

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNew enableCalendar={enableCalendar} vendorAsync={vendorAsync} />
        {/* <TouchableOpacity
          onPress={() => setIsCalendarVisible(true)}
          style={styles.selectDateButton}>
          <Text style={styles.selectDateButtonText}>Select Your Date</Text>
        </TouchableOpacity> */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={isCalendarVisible}
          onRequestClose={() => setIsCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Choose a {isRangeSelection ? 'Date Range' : 'Date'}
              </Text>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
                markingType={isRangeSelection ? 'period' : 'simple'}
                theme={{
                  selectedDayBackgroundColor: '#e8d94b',
                  selectedDayTextColor: 'white',
                  todayTextColor: 'black',
                  dayTextColor: 'black',
                  textDisabledColor: 'grey',
                  arrowColor: 'black',
                  monthTextColor: 'black',
                  indicatorColor: 'blue',
                  todayBackgroundColor: '#e8d94b',
                }}
                style={styles.calendar}
              />

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleSave}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* <Image
            style={{
              marginTop: 8,
              width: '100%',
              height: 160,
              resizeMode: 'cover',
              borderRadius: 15,
            }}
            source={require('../../../assets/kIRU3-07.jpeg')}
          /> */}

        {/* <View
          style={{
            padding: 10,
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
          }}>
          
          <View style={{flex: 0.5}}>
            <View
              style={{
                backgroundColor: '#ebebeb',
                padding: 10,
                borderRadius: 7,
                paddingHorizontal: 15,
                width: '80%',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'Montserrat-Bold',
                  color: '#282727',
                }}>
                New Project
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#808080',
                  marginTop: 10,
                }}>
                Tap to get
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Montserrat-SemiBold',
                  color: '#808080',
                }}>
                started
              </Text>
              <View style={{flexDirection: 'row-reverse'}}>
                <AntDesign name="pluscircle" size={30} color="#adadad" />
              </View>
            </View>
          </View>
          <View style={{flex: 0.5}}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                color: '#282727',
                marginTop: 10,
              }}>
              Design your event, just the way you like it.
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Montserrat-SemiBold',
                color: '#282727',
                marginTop: 20,
              }}>
              Start a new project from scratch.
            </Text>
          </View>
        </View> */}
        <TouchableOpacity
          style={{
            backgroundColor: '#ebebeb',
            paddingVertical: 15,
            borderRadius: 50,
            paddingHorizontal: 15,
            marginVertical: 10,
            marginHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => navigation.navigate('project')}>
          <Image
            style={{
              marginLeft: 8,
              width: 40,
              height: 50,
              resizeMode: 'center',
              borderRadius: 15,
              flex: 0.2,
              transform: [{rotate: '280deg'}, {scale: 1}, {translateX: 0.1}],
            }}
            source={require('../../../assets/office-material.png')}
          />
          <Text
            style={{
              color: 'black',
              // fontSize: 13,
              flex: 0.7,
              fontFamily: 'Montserrat-SemiBold',
              // letterSpacing: 1,
            }}>
            Design your event, just the way you like it. Tap to get started
          </Text>
          <AntDesign
            style={{flex: 0.1}}
            name="pluscircle"
            size={25}
            color="#adadad"
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
            // alignItems: 'center',
          }}>
          <Text style={[styles.vendorTitle, {flex: 0.6}]}>
            EXPLORE CATEGORY
          </Text>
          <TouchableOpacity
            style={{
              flex: 0.6,
              alignItems: 'flex-end',
            }}
            onPress={() => navigation.navigate('CategoryStack')}>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              View All
            </Text>
          </TouchableOpacity>
          {/* <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            width: '100%',
            marginLeft: 2,
          }}></View> */}
        </View>
        <View style={styles.vendorSection}>
          <Category />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginTop: 30,
          }}>
          <Text style={[styles.vendorTitle, {flex: 0.6}]}>
            FEATURED PRODUCTS
          </Text>
          <TouchableOpacity
            style={{
              flex: 0.6,
              alignItems: 'flex-end',
            }}
            onPress={() => navigation.navigate('AllProducts')}>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}>
            {/* <Featured /> */}
            {availableProducts.map((vendor, index) => (
              <TouchableOpacity
                key={vendor._id}
                style={styles.featuredItem}
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    item: vendor,
                  })
                }>
                <Image
                  key={index} // Ensure each image has a unique key
                  source={{uri: `${apiUrl.IMAGEURL}${vendor.product_image[0]}`}}
                  style={{
                    width: '100%',
                    height: 150,
                    borderColor: '#e8e8e8',
                    borderWidth: 1,
                    borderRadius: 10,
                    // resizeMode: 'cover',
                  }}
                />
                <View style={{paddingTop: 10, padding: 3}}>
                  <Text style={styles.productName}>
                    {vendor.product_name?.length < 20
                      ? vendor.product_name
                      : vendor.product_name?.substring(0, 20) + '...'}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Montserrat-SemiBold',
                        fontSize: 15,
                        color: '#363636',
                        letterSpacing: 1,
                      }}>
                      ₹{vendor.product_price}
                    </Text>
                    {/* <TouchableOpacity
                      // onPress={handleAddToCart}
                      style={{
                        backgroundColor: '#e6e6e6',
                        borderRadius: 5,
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                      }}>
                      <Text
                        style={{
                          fontFamily: 'Montserrat-SemiBold',
                          fontSize: 13,
                          color: '#363636',
                          letterSpacing: 1,
                          textAlign: 'center',
                        }}>
                        + Add
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            paddingVertical: 10,
            // alignItems: 'center',
          }}>
          <Text style={[styles.vendorTitle, {flex: 0.6}]}>
            EXPLORE OUR SERVICES
          </Text>
          <TouchableOpacity
            style={{
              flex: 0.6,
              alignItems: 'flex-end',
            }}
            onPress={() =>
              navigation.navigate('ServiceList', {
                serviceList: serviceListData,
              })
            }>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Service serviceListData={filterOnlyServiceVendor} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            marginVertical: 10,
          }}>
          <Text style={[styles.vendorTitle, {flex: 0.6}]}>VENDORS FOR YOU</Text>

          <TouchableOpacity
            style={{
              flex: 0.6,
              alignItems: 'flex-end',
            }}
            onPress={() => navigation.navigate('AllVendors')}>
            <Text
              style={{
                color: 'black',
                fontSize: 13,
                fontFamily: 'Montserrat-SemiBold',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <VendorDisplay allProductVendors={allProductVendors} />
        </View>
        <View
          style={{
            // flexDirection: 'row',
            // justifyContent: 'space-between',
            // alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            // alignItems: 'center',
            // paddingVertical: 10,
          }}>
          <Text style={styles.vendorTitle}>EVENTS</Text>
          {/* <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            width: '100%',
            marginLeft: 2,
          }}></View> */}
        </View>
        {/* Banner Sctions========================= */}
        <View style={styles.bannerSection}>
          {/* <ScrollView
          ref={scrollViewRef}
          onScroll={({nativeEvent}) => onChange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={styles.viewBox}>
          {imageSliderData.map((e, index) => (
            <View key={index.toString()} style={styles.imageContainer}>
              <Image
                key={index}
                resizeMode="stretch"
                style={styles.bannerImage}
                source={e.img}
                // source={{uri: e.img}}
                onError={() => console.log('Error loading image:', e.img)}
              />
            </View>
          ))}
        </ScrollView> */}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {imageSliderData.map((e, vIndex) => (
              <View
                key={vIndex}
                style={{marginTop: 15}}
                // onPress={() => {
                //   navigation.navigate('VendorProfile', {
                //     vendorProfile: vdr,
                //   });
                // }}
              >
                <Image style={styles.bannerImage} source={e.img} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View
          style={{
            // flexDirection: 'row',
            // alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            // alignItems: 'center',
            marginVertical: 15,
          }}>
          <Text style={styles.vendorTitle}>WHAT MAKES US DIFFERENT</Text>
          {/* <View
          style={{
            marginTop: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            width: '100%',
            marginLeft: 2,
          }}></View> */}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {makesDiffD.map((ele, index) => (
            <View key={index} style={styles.makesDiff}>
              <View>
                <LottieView
                  source={ele.animation}
                  autoPlay
                  loop
                  style={styles.diffImage}
                />
                {/* <Image
      resizeMode="cover"
      style={styles.diffImage}
      source={require('../../../assets/businessman.gif')}
    /> */}
                <Text style={styles.diffText}> {ele.title} </Text>
              </View>
            </View>
          ))}
        </View>
        {/* <View>
        <SliderBanner />
      </View> */}
        <View
          style={{
            // flexDirection: 'row',
            // alignItems: 'center',
            marginLeft: 20,
            marginRight: 20,
            // alignItems: 'center',
          }}>
          <Text style={styles.vendorTitle}>HOW IT WORKS? </Text>
        </View>
        <View
          style={{
            // marginLeft: 10,
            // marginRight: 10,
            padding: 5,
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: '#ebebeb',
          }}>
          <Image
            source={require('../../../assets/Steps3-12.png')}
            style={{
              width: '100%',
              height: 280,
              resizeMode: 'contain',
            }}
          />
        </View>
        <View>
          <Footer />
        </View>
      </ScrollView>
      <View style={{position: 'absolute', bottom: 50, right: 10}}>
        <NewArrivals navigation={navigation} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  moodBoardSection: {backgroundColor: 'white'},
  moodBoard: {
    padding: 20,
    flexDirection: 'row',
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  text1: {
    color: 'black',
    fontSize: 15,
    marginTop: 20,
    fontWeight: '400',
  },
  boardDesign: {
    padding: 15,
    width: 135,
    height: 135,
    borderRadius: 10,
    backgroundColor: '#E3A400',
  },
  newProject: {
    fontSize: 15,
    color: 'white',
  },
  tab: {
    marginTop: 10,
    fontSize: 15,
    color: '#fed66d',
  },
  addIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  bannerImage: {
    width: 150,
    height: 250,
    borderRadius: 15,
    marginHorizontal: 5,
    resizeMode: 'cover',
  },
  viewBox: {
    // width: width - 20,
    width: width,
    height: 200,
  },
  dotContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',

    alignItems: 'center',
  },
  // imageContainer: {
  //   borderRadius: 10,
  //   marginHorizontal: 10,
  // },
  wrapDot: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: 'white',
  },
  dot: {
    margin: 3,
    color: 'yellow',
  },
  vendorTitle: {
    fontSize: 13,
    color: 'black',
    fontFamily: 'Montserrat-ExtraBold',
    // fontFamily: 'Poppins-SemiBold',
    // letterSpacing: 1,
  },
  seeAll: {
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#2f4e9e',
    // marginRight: 10,
  },
  vendorSection: {
    // marginTop: 10,
    marginBottom: 20,
    // flexDirection: 'row',
  },
  diffImage: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    // marginBottom: 10,
  },
  diffText: {
    color: 'black',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 12,
    // letterSpacing: 1,
    textAlign: 'center',
  },
  makesDiff: {
    width: '25%',
    // borderRadius: 15,
    // borderWidth: 1,
    // borderColor: '#e0e0e0',
    marginBottom: 30,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    opacity: 0.5, // Change this value to adjust the opacity
  },
  howItWorks: {
    paddingLeft: 15,
    marginBottom: 20,
    marginTop: 25,
  },
  howItWorksText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  howItWorkSubText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  video: {
    width: '100%',
    height: 300,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
    color: 'black',
  },
  gifImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  headerText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 20,
  },
  subText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    fontSize: 9,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  switchLabel: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    marginHorizontal: 10,
  },
  selectDateButton: {
    backgroundColor: '#e13131',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  selectDateButtonText: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  calendar: {
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#e8d94b',
    padding: 10,
    borderRadius: 50,
    width: '100%',
  },
  confirmButtonText: {
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    fontSize: 14,
  },
  scrollViewContent: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    // padding: 5,
    marginTop: 5,
  },

  featuredItem: {
    // backgroundColor: '#c0d8ff',
    width: 150,
    margin: 10,
    borderRadius: 15,
    // Ensure consistent width
  },

  productName: {
    fontSize: 14,
    color: '#363636',
    // letterSpacing: 1,
    marginBottom: 3,
    fontFamily: 'Montserrat-Medium',
    // textAlign: 'center',
    // fontFamily: 'Karla-SemiBold',
  },

  vendorContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 3,
    marginBottom: 20,
  },
  vendorDetails: {
    backgroundColor: 'white',
    padding: 10,
  },
  locationContainer: {
    position: 'absolute',
    marginTop: 10,
    top: -30,
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    borderTopRightRadius: 15,
  },
  vendorLocation: {
    fontSize: 12,
    color: '#363636',
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
  vendorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  vendorName: {
    fontSize: 17,
    letterSpacing: 1,
    fontFamily: 'Poppins-Bold',
    color: '#252525',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vendorRatingText: {
    fontSize: 16,
    color: '#363636',
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
    letterSpacing: 1,
  },
  discountContainer: {
    marginTop: 5,
    marginBottom: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishlistButton: {
    marginRight: 10,
  },
  discountText: {
    color: '#1256cb',
    fontSize: 14,
    letterSpacing: 1,
    fontFamily: 'Poppins-Medium',
  },
});
export default HomeNew;
