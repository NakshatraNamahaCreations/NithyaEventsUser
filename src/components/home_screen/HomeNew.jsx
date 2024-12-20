import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
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
import {useDateContext} from '../../utilities/DateSelection';
import Video from 'react-native-video';
import WebView from 'react-native-webview';
import Youtube from './Youtube';
// import {orderData, productData} from '../../data/global-data';

// import homevideo from '../../../assets/homevideo.mp4';
// import Video, {VideoRef} from 'react-native-video';
// import SliderBanner from './sliderBanner';

const {width} = Dimensions.get('window');
// const deviceWidth = #7460e4ions.get('window').width;

function HomeNew() {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [vendorAsync, setVendorAsync] = useState(null);
  const [location, setLocation] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isRangeSelection, setIsRangeSelection] = useState(true);
  const [allRentalProduct, setallRentalProduct] = useState([]);
  const [allOrderProduct, setAllOrderProduct] = useState([]);
  const [allProductVendors, setAllProductVendors] = useState([]);
  const [serviceListData, setServiceListData] = useState([]);
  const [disabledDate, setDisabledDate] = useState({});
  const [allBanners, setAllBanners] = useState([]);
  const [allVideos, setAllVideo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAsyncStoredValue = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setVendorAsync(userData ? JSON.parse(userData) : null);
        const locationData = await AsyncStorage.getItem('address');
        setLocation(locationData ? JSON.parse(locationData) : null);
      } catch (error) {
        console.error('Failed to load vendor data', error);
      }
    };
    getAsyncStoredValue();
  }, []);

  useEffect(() => {
    setIsCalendarVisible(true);
  }, []);

  const today = moment().format('YYYY-MM-DD');
  const enableCalendar = () => setIsCalendarVisible(!isCalendarVisible);

  const calculateDisabledDates = () => {
    let disabledDates = {};
    let date = moment().subtract(1, 'year'); // Start from yesterday

    // Loop to disable all dates before today
    while (date.isBefore(today, 'day')) {
      disabledDates[date.format('YYYY-MM-DD')] = {
        disabled: true,
        disableTouchEvent: true,
        color: '#f3f3f3', // Gray color for past dates
      };
      date = date.add(1, 'days'); // Move to the next day
    }
    return disabledDates;
  };

  useEffect(() => {
    const disabledDates = calculateDisabledDates();
    setDisabledDate(disabledDates);
  }, []);

  const handleDayPress = day => {
    if (isRangeSelection) {
      if (!startDate || (startDate && endDate)) {
        setStartDate(day.dateString); // Set start date
        setEndDate(null); // Reset end date for new selection
      } else if (startDate && !endDate) {
        const start = new Date(startDate);
        const end = new Date(day.dateString);
        if (end > start) {
          setEndDate(day.dateString); // Valid range, set end date
        } else {
          // If selected date is before the start date, reset the range
          setStartDate(day.dateString);
          setEndDate(null);
        }
      }
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const getMarkedDates = () => {
    let markedDates = {...disabledDate};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: '#7460e4',
        textColor: 'white',
      };
    }
    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: '#7460e4',
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
            color: '#baaff9',
            textColor: 'white',
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return markedDates;
  };

  const getNumberOfSelectedDates = (startDate, endDate) => {
    if (!startDate) {
      return 0; // If startDate is not selected, return 0
    }

    const start = new Date(startDate); // Convert startDate string to Date object
    const end = endDate ? new Date(endDate) : start; // Use current date if endDate is null
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    // Calculate the time difference in milliseconds
    const diffTime = end - start;

    // Convert time difference from milliseconds to days
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    // If diffDays is exactly 0, return 1 (same day case), otherwise return the actual difference
    return diffDays === 0 ? 1 : diffDays + 1;
  };

  const numberOfDays = getNumberOfSelectedDates(startDate, endDate);
  // console.log('numberOfDays', numberOfDays);
  const {dateSelection, setDateSelection} = useDateContext();

  // const handleSave = async () => {
  //   try {
  //     setDateSelection(startDate);
  //     setDateSelection(endDate || startDate);
  //     setDateSelection(numberOfDays);

  //     await AsyncStorage.setItem('startDate', startDate);
  //     await AsyncStorage.setItem('endDate', endDate || startDate);
  //     await AsyncStorage.setItem('numberOfDays', String(numberOfDays));
  //     setIsCalendarVisible(false);
  //   } catch (error) {
  //     console.error('Error saving dates:', error);
  //   }
  // };
  // console.log('dateSelection in homenew', dateSelection);

  const handleSave = async () => {
    if (!startDate) {
      Alert.alert('Message', 'Please select a date');
    } else {
      try {
        const selectedDates = {
          startDate,
          endDate: endDate || startDate,
          numberOfDays,
        };
        setDateSelection(selectedDates);
        setIsCalendarVisible(false);
      } catch (error) {
        console.error('Error saving dates:', error);
      }
    }
  };
  // console.log('dateSelection', dateSelection);

  // console.log('numberOfDays selectd from the home screen', numberOfDays);
  // console.log('startDate', startDate);
  // console.log('endDate', endDate);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannerRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_ALL_BANNERS}`,
        );
        if (bannerRes.status === 200) {
          setAllBanners(bannerRes.data.data.reverse());
        }
      } catch (error) {
        console.log('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rentalProductRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
        );
        if (rentalProductRes.status === 200) {
          setallRentalProduct(rentalProductRes.data?.reverse());
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

        // const bannerRes = await axios.get(
        //   `${apiUrl.BASEURL}${apiUrl.GET_ALL_BANNERS}`,
        // );
        // if (bannerRes.status === 200) {
        //   setAllBanners(bannerRes.data.data.reverse());
        // }
        const youtubeRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_YOUTUBE_VIDEO_LINK}`,
        );
        if (youtubeRes.status === 200) {
          setAllVideo(youtubeRes.data.data.reverse());
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // flexDirection: 'row',
          position: 'relative',
          backgroundColor: 'transparent',
        }}>
        <ActivityIndicator size="large" color="#0a6fe8" />
      </View>
    );
  }

  // console.log('allBanners', allBanners);

  const filterOnlyServiceVendor = serviceListData.filter(
    item => item.service_name !== 'Vendor & Seller' && item.isActive === true, //check the like is_approved or isActive
  );

  // const vendor = [
  //   {
  //     imageUrl: require('../../../assets/kIRU3-07.jpeg'),
  //   },
  //   {
  //     imageUrl: require('../../../assets/kIRU3-07.png'),
  //   },
  //   {
  //     imageUrl: require('../../../assets/KIRU4-07.jpeg'),
  //   },
  //   {
  //     imageUrl: require('../../../assets/kiru-discount-03.png'),
  //   },
  // ];

  // const imageSliderData = allBanners.map(item => ({
  //   img: item.banner_image,
  // }));

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

  const orders = allOrderProduct.flatMap(item => item.product_data);

  function calculateAvailableQuantity(product, orderValue, startDate, endDate) {
    const eventStart = moment(startDate);
    const eventEnd = moment(endDate);

    // Find orders that overlap with the selected date range
    const ordersForDate = orderValue.filter(order => {
      const orderStart = moment(order.eventStartDate);
      const orderEnd = moment(order.eventEndDate);

      // Check for overlap between selected dates and order dates
      return (
        order.id === product?._id && // Match the product ID
        orderStart.isSameOrBefore(eventEnd) && // Order starts before or on the end date
        orderEnd.isSameOrAfter(eventStart) // Order ends after or on the start date
      );
    });

    // Calculate the total quantity applied for overlapping orders
    const totalAppliedQuantity = ordersForDate.reduce(
      (sum, order) => sum + order.quantity,
      0,
    );

    // Calculate available quantity
    const availableQuantity = product.stock_in_hand - totalAppliedQuantity;

    return availableQuantity < 0 ? 0 : availableQuantity; // Ensure it doesn't go below zero
  }

  function getAvailableProducts(products, orderValue, startDate, endDate) {
    return products
      .map(product => {
        const availableQuantity = calculateAvailableQuantity(
          product,
          orderValue,
          startDate,
          endDate,
        );

        return {
          ...product,
          availableQuantity,
          isAvailable: availableQuantity > 0,
        };
      })
      .filter(product => product.isAvailable); // Filter out unavailable products
  }

  // Example usage
  const availableProducts = getAvailableProducts(
    allRentalProduct,
    orders,
    dateSelection.startDate,
    dateSelection.endDate,
    // startDate,
    // endDate,
  );
  // console.log('getAvailableProducts', availableProducts.length);

  function calculateRemainingQuantity(product, orderValue, startDate, endDate) {
    const eventStart = moment(startDate);
    const eventEnd = moment(endDate);

    // Filter orders that overlap with the selected date range
    const overlappingOrders = orderValue.filter(order => {
      const orderStart = moment(order.eventStartDate);
      const orderEnd = moment(order.eventEndDate);

      return (
        order.id === product?._id && // Match the product ID
        orderStart.isSameOrBefore(eventEnd) && // Order starts before or on the end date
        orderEnd.isSameOrAfter(eventStart) // Order ends after or on the start date
      );
    });

    // Calculate total quantity applied from overlapping orders
    const totalAppliedQuantity = overlappingOrders.reduce(
      (sum, order) => sum + order.quantity,
      0,
    );

    // Calculate remaining quantity after orders are accounted for
    const remainingQuantity = product.stock_in_hand - totalAppliedQuantity;

    return remainingQuantity < 0 ? 0 : remainingQuantity; // Ensure it doesn't go below zero
  }

  function getRemainingQuantities(products, orderValue, startDate, endDate) {
    return products.map(product => {
      const remainingQuantity = calculateRemainingQuantity(
        product,
        orderValue,
        startDate,
        endDate,
      );

      return {
        ...product,
        remainingQuantity,
        isAvailable: remainingQuantity > 0, // Determine if it's available
      };
    });
  }

  // Example usage
  const remainingQuantities = getRemainingQuantities(
    allRentalProduct,
    orders,
    dateSelection.startDate,
    dateSelection.endDate,
    // startDate,
    // endDate,
  );

  // console.log(
  //   'Remaining Quantities:',
  //   remainingQuantities
  //     .map(ele => ({
  // product_name: ele.product_name,
  //       remainingQuantity: ele.remainingQuantity,
  //     }))
  //     .filter(ele => ele.remainingQuantity > 0), // Optional: Only log products that are available
  // );

  //  ---------------------------------------------------------------------

  const checkAvailableProducts = selectedDate => {
    // Parse the selected date to a moment object for easy comparison
    const selectedMoment = moment(selectedDate);

    // Create a copy of the rental products to track availability
    const availableProducts = allRentalProduct.map(product => ({
      ...product,
      availableStock: product.stock_in_hand, // Start with total stock
    }));

    // Loop through the orders to check for availability
    allOrderProduct.forEach(order => {
      order.product_data.forEach(item => {
        // Check if the selected date falls within the event date range
        const eventStart = moment(item.eventStartDate);
        const eventEnd = moment(item.eventEndDate);

        // If selected date is within the event range, reduce stock
        if (selectedMoment.isBetween(eventStart, eventEnd, null, '[]')) {
          // Find the corresponding product in availableProducts
          const product = availableProducts.find(p => p._id === item.id);
          if (product) {
            product.availableStock -= item.quantity; // Decrease the available stock
          }
        }
      });
    });

    // Filter products that have positive available stock
    return availableProducts.filter(product => product.availableStock > 0);
  };

  // Usage example
  const selectedDate = dateSelection.startDate && dateSelection.endDate; // Use your selected date logic
  const availableProductsForSelectedDate = checkAvailableProducts(selectedDate);
  // console.log(
  //   'availableProductsForSelectedDate',
  //   availableProductsForSelectedDate.length,
  // );
  // console.log('async location in homenew', location);

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderNew
          enableCalendar={enableCalendar}
          vendorAsync={vendorAsync}
          location={location}
        />

        {/* <TouchableOpacity
          onPress={() => setIsCalendarVisible(true)}
          style={styles.selectDateButton}>
          <Text style={styles.selectDateButtonText}>Select Your Date</Text>
        </TouchableOpacity> */}

        {/* <Modal
          transparent={true}
          animationType="slide"
          visible={isCalendarVisible}
          onRequestClose={() => setIsCalendarVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Event Dates </Text>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={getMarkedDates()}
                markingType="period"
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
        </Modal> */}

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
                  fontFamily: 'Poppins-Bold',
                  color: '#282727',
                }}>
                New Project
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                  color: '#808080',
                  marginTop: 10,
                }}>
                Tap to get
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
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
                fontFamily: 'Poppins-SemiBold',
                color: '#282727',
                marginTop: 10,
              }}>
              Design your event, just the way you like it.
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Poppins-SemiBold',
                color: '#282727',
                marginTop: 20,
              }}>
              Start a new project from scratch.
            </Text>
          </View>
        </View> */}
        <View style={{paddingHorizontal: 10}}>
          <Image
            style={{
              // marginTop: 8,
              width: '100%',
              height: 100,
              resizeMode: 'contain',
              borderRadius: 15,
            }}
            source={require('../../../assets/nithyaevent.jpeg')}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: '#f2edff',
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
              flex: 0.7,
              fontFamily: 'Poppins-SemiBold',
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
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold',
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
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold',
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
            {availableProducts.slice(0, 10).map((vendor, index) => (
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
                  source={{uri: vendor.product_image[0]}}
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
                  <Text style={styles.productName} numberOfLines={1}>
                    {vendor.product_name}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 15,
                        color: '#363636',
                        // letterSpacing: 1,
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
                          fontFamily: 'Poppins-SemiBold',
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
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold',
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
          <Text style={[styles.vendorTitle, {flex: 0.6}]}>NEAR BY VENDORS</Text>

          <TouchableOpacity
            style={{
              flex: 0.6,
              alignItems: 'flex-end',
            }}
            onPress={() =>
              navigation.navigate('AllVendors', {
                vendorList: allProductVendors,
              })
            }>
            <Text
              style={{
                color: 'black',
                fontSize: 11,
                fontFamily: 'Poppins-SemiBold',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 20}}>
          <VendorDisplay allProductVendors={allProductVendors} />
        </View>
        {/* Youtube video Sections========================= */}
        <View
          style={{
            marginTop: 10,
          }}>
          <Youtube />
        </View>

        {/* Banner Sctions========================= */}

        <View
          style={{
            marginVertical: 10,
            paddingLeft: 10,
          }}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {
              allBanners.length > 0
                ? allBanners.map(ele => (
                    <View key={ele._id} style={styles.bannerContainer}>
                      <Image
                        style={styles.bannerImage}
                        source={{
                          uri: ele.banner_image,
                        }}
                      />
                    </View>
                  ))
                : null
              // <Text style={styles.loadingText}>Loading banners...</Text>
            }
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
        {/* <View>
          <Footer />
        </View> */}
      </ScrollView>
      <View style={{position: 'absolute', bottom: 50, right: 10}}>
        <NewArrivals
          availableProducts={availableProducts}
          navigation={navigation}
        />
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
    width: width - 25,
    height: 150,
    borderRadius: 15,
    marginHorizontal: 5,
    // resizeMode: 'cover',
  },
  loadingText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
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
    fontSize: 12,
    color: 'black',
    fontFamily: 'Poppins-ExtraBold',
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
    fontFamily: 'Poppins-SemiBold',
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
    backgroundColor: '#7460e4',
    padding: 10,
    borderRadius: 50,
    width: '100%',
  },
  confirmButtonText: {
    color: 'white',
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
    fontFamily: 'Poppins-Medium',
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
