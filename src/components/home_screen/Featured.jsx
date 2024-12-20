import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../state-management/cartSlice';
const {width} = Dimensions.get('window');
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
function Featured() {
  const navigation = useNavigation();
  const [isWishlist, setIsWishlist] = useState(false);
  const [allRentalProduct, setallRentalProduct] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getallrentalproduct();
  }, []);

  const getallrentalproduct = async () => {
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
      );
      if (res.status === 200) {
        setallRentalProduct(res.data);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: allRentalProduct?._id,
        productName: allRentalProduct?.product_name,
        productPrice: allRentalProduct?.product_price,
        mrpPrice: allRentalProduct?.mrp_rate,
        store: allRentalProduct?.shop_name,
        imageUrl: allRentalProduct?.product_image[0],
      }),
    );
  };

  console.log('allRentalProduct', allRentalProduct);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}>
      {allRentalProduct.map((vendor, index) => (
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

          {/* <VendorImageSlider images={vendor.productImage} /> */}
          <View style={{paddingTop: 10, padding: 3}}>
            <Text style={styles.productName}>
              {/* {vendor.productName} */}
              {vendor.product_name?.length < 20
                ? vendor.product_name
                : vendor.product_name?.substring(0, 20) + '...'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                // marginTop: 10,
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
              <TouchableOpacity
                onPress={handleAddToCart}
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
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

export default Featured;

// <Pressable
//   key={index}
//   style={styles.vendorContainer}
//   onPress={() => {
//     navigation.navigate("VendorProfile", { vendorProfile: vendor });
//   }}
// >
//   <VendorImageSlider images={vendor.vendorBannerImage} />
//   <View style={styles.vendorDetails}>
//     <View style={styles.locationContainer}>
//       <Text style={styles.vendorLocation}>
//         <MaterialCommunityIcons
//           name="map-marker"
//           size={14}
//           color="#ea5362"
//         />
//         {" " + vendor.location} . 5 km
//       </Text>
//       {/* <Text
//         style={{
//           fontSize: 11,
//           color: '#363636',
//           fontFamily: 'Poppins-Medium',
//         }}></Text> */}
//     </View>
//     <View style={styles.vendorInfo}>
//       <Text style={styles.vendorName}>{vendor.shopName}</Text>
//       <View style={styles.ratingContainer}>
//         <MaterialCommunityIcons
//           name="star-box"
//           size={20}
//           color="#236339"
//         />
//         <Text style={styles.vendorRatingText}>{vendor.rating}</Text>
//       </View>
//     </View>
//     <View style={styles.discountContainer}>
//       <Text style={styles.discountText}>
//         <MaterialCommunityIcons
//           name="brightness-percent"
//           size={18}
//           color="#1256cb"
//         />
//         {" " + vendor.discount}% OFF {vendor.clausesCondition}
//       </Text>

//       <TouchableOpacity
//         style={styles.wishlistButton}
//         onPress={() => setIsWishlist(!isWishlist)}
//       >
//         <Octicons
//           name={!isWishlist ? "heart" : "heart-fill"}
//           size={22}
//           color={!isWishlist ? "black" : "#ea5362"}
//         />
//       </TouchableOpacity>
//     </View>
//   </View>
// </Pressable>
