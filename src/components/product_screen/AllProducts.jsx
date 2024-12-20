import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import {apiUrl} from '../../api-services/api-constants';
import Feather from 'react-native-vector-icons/Feather';

function AllProducts() {
  const navigation = useNavigation();
  const [allRentalProducts, setAllRentalProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const getAllProducts = async () => {
      setLoading(true);
      try {
        const rentalProductRes = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_RENTAL_PRODUCTS}`,
        );
        if (rentalProductRes.status === 200) {
          setAllRentalProducts(rentalProductRes.data);
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    getAllProducts();
  }, []);

  // console.log('allRentalProducts>>>>>>', allRentalProducts);

  const categories = [
    {
      categoryName: 'All',
    },
    {
      categoryName: 'Sound',
    },
    {
      categoryName: 'Lighting',
    },
    {
      categoryName: 'Video',
    },
    {
      categoryName: 'Fabrication',
    },
    {
      categoryName: 'Genset',
    },
    {
      categoryName: 'Shamiana',
    },
  ];

  const showSelectedProducts = allRentalProducts.filter(product =>
    selectedCategory === 'All'
      ? allRentalProducts
      : product.product_category === selectedCategory,
  );

  console.log('selectedCategory', selectedCategory);
  // console.log('showSelectedProducts', showSelectedProducts);

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
        height: '100%',
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          elevation: 1,
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 10,
        }}>
        <Ionicons
          name="chevron-back-sharp"
          size={25}
          color="black"
          style={{flex: 0.1}}
          onPress={() => navigation.goBack()}
        />

        <Text
          style={{
            color: 'black',
            fontSize: 16,
            marginBottom: 3,
            fontFamily: 'Montserrat-SemiBold',
            flex: 0.8,
          }}>
          {' '}
          All Products
        </Text>
        <Feather
          name="search"
          size={19}
          color="black"
          style={{flex: 0.1}}
          onPress={() => navigation.navigate('Search')}
        />
      </View>
      <View style={{flexDirection: 'row', marginTop: 20, marginLeft: 5}}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedCategory(item.categoryName)}
              style={{
                borderWidth: 1,
                marginHorizontal: 5,
                borderColor: '#d9d9d9',
                backgroundColor:
                  selectedCategory === item.categoryName
                    ? '#efefef'
                    : 'transparent',
                borderRadius: 7,
                padding: 10,
              }}>
              <Text
                style={{
                  color: '#2f2f2f',
                  fontSize: 13,
                  fontFamily: 'Montserrat-SemiBold',
                  textAlign: 'center',
                }}>
                {item.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView>
        <View style={{flex: 1}}>
          {showSelectedProducts?.length === 0 ? (
            <Text
              style={{
                marginTop: 30,
                color: '#878697',
                fontSize: 14,
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                // letterSpacing: 1,
              }}>
              {`No results found for your search`}
            </Text>
          ) : (
            <ScrollView style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  marginHorizontal: 10,
                }}>
                {showSelectedProducts?.map((ele, index) => {
                  const averageRating =
                    ele.Reviews.length > 0
                      ? ele.Reviews.reduce((a, b) => a + b.ratings, 0) /
                        ele.Reviews.length
                      : 0;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{
                        width: '49%',
                        borderWidth: 1,
                        borderColor: '#d9d9d9',
                        marginVertical: 5,
                        borderRadius: 10,
                      }}
                      onPress={() =>
                        navigation.navigate('ProductDetails', {
                          item: ele,
                        })
                      }>
                      <View>
                        <Image
                          style={{
                            width: '100%',
                            height: 150,
                            alignSelf: 'stretch',
                            borderRadius: 10,
                            marginBottom: 10,
                          }}
                          source={{
                            uri: ele.product_image[0],
                          }}
                        />
                        <View style={{paddingHorizontal: 5}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 13,
                              marginBottom: 3,
                              fontFamily: 'Montserrat-SemiBold',
                              width: '100%',
                            }}
                            numberOfLines={2}
                            ellipsizeMode="tail">
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
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default AllProducts;
