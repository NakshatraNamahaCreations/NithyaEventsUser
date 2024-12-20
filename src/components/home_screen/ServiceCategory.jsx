import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {apiUrl} from '../../api-services/api-constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function ServiceCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const serviceList = route.params.serviceList || {};
  const serviceName = serviceList.service_name;
  const [serviceVendors, setServiceVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchVendor, setSearchVendor] = useState('');
  const [filteredVendor, setFilteredVendor] = useState([]);

  // const encodedServiceName = encodeURIComponent(serviceName.trim());
  // console.log('encodedServiceName', encodedServiceName);

  // const formattedServiceName = serviceName.replace(/\s+/g, '+');
  // console.log('formattedServiceName', formattedServiceName);

  const handleSearch = text => {
    setSearchVendor(text);
  };

  useEffect(() => {
    const getFetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${apiUrl.BASEURL}${apiUrl.GET_SERVICES_BY_SERVICE_NAME}/${serviceName}`,
        );
        if (res.status === 200) {
          setServiceVendors(res.data.data);
          setFilteredVendor(res.data.data);
        }
      } catch (error) {
        console.log('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getFetchData();
  }, [serviceName]);

  // console.log('serviceVendors in servicecategory', serviceVendors);

  useEffect(() => {
    const search = serviceVendors.filter(vend => {
      const lowerCaseQuery = searchVendor.toLowerCase();
      return (
        vend.shop_name.toLowerCase().includes(lowerCaseQuery) ||
        (vend.address &&
          vend.address.length > 0 &&
          (
            vend.address[0]?.cityDownVillage.toLowerCase() +
            vend.address[0].distric.toLowerCase() +
            vend.address[0].state.toLowerCase()
          ).includes(lowerCaseQuery))
      );
    });
    setFilteredVendor(search);
  }, [searchVendor]);

  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View
        style={{
          padding: 15,
          backgroundColor: 'white',
          elevation: 4,
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign
            name="arrowleft"
            size={20}
            color="black"
            style={{marginTop: 4}}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: 'black',
            fontSize: 18,
            marginLeft: 10,
          }}>
          {' '}
          {serviceName}
        </Text>
      </View>

      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {serviceVendors.length === 0 ? (
            <Text
              style={{
                fontFamily: 'Montserrat-Medium',
                color: 'black',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 50,
              }}>
              No Services Found
            </Text>
          ) : (
            <ScrollView>
              <View style={{marginTop: 5}}>
                <TextInput
                  placeholderTextColor="#757575"
                  placeholder="Search service or address..."
                  onChangeText={handleSearch}
                  style={{
                    color: 'black',
                    fontSize: 15,
                    borderRadius: 15,
                    margin: 10,
                    paddingLeft: 20,
                    fontFamily: 'Montserrat-Medium',
                    backgroundColor: 'white',
                    elevation: 3,
                    marginBottom: 5,
                  }}
                />
                {filteredVendor.map((ele, index) => {
                  const averageRating =
                    ele.Reviews.length > 0
                      ? ele.Reviews.reduce((a, b) => a + b.ratings, 0) /
                        ele.Reviews.length
                      : 0;
                  // console.log('averageRating', averageRating);
                  return (
                    <View style={{padding: 10}} key={ele._id}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ServiceDetails', {
                            serviceDetails: ele,
                          })
                        }
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View style={{flex: 0.3, marginRight: 20}}>
                          <Image
                            source={{
                              uri: `${apiUrl.IMAGEURL}${ele.shop_image_or_logo}`,
                            }}
                            style={{
                              width: '100%',
                              height: 120,
                              borderRadius: 10,
                            }}
                          />
                        </View>
                        <View style={{flex: 0.7, marginTop: 5}}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: 15,
                              fontFamily: 'Montserrat-SemiBold',
                            }}>
                            {ele.shop_name}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginVertical: 5,
                              alignItems: 'center',
                            }}>
                            <View
                              style={{
                                backgroundColor: 'green',
                                padding: 3,
                                flexDirection: 'row',
                                borderRadius: 4,
                              }}>
                              <AntDesign
                                // style={{marginTop: 7, marginRight: 3}}
                                name="star"
                                color="white"
                                size={11}
                              />
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: 14,
                                  fontFamily: 'Montserrat-Medium',
                                  // marginTop: 3,
                                  marginLeft: 5,
                                }}>
                                {Math.round(averageRating)}
                              </Text>
                            </View>
                          </View>

                          <Text
                            style={{
                              color: '#717171',
                              fontSize: 14,
                              fontFamily: 'Montserrat-Medium',
                            }}>
                            {ele.address && ele.address.length > 0
                              ? `${ele.address[0].cityDownVillage}, ${ele.address[0].distric}, ${ele.address[0].state}`
                              : ''}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          borderColor:
                            serviceVendors?.length - 1 === index
                              ? ''
                              : '#c4cdd5',
                          borderWidth:
                            serviceVendors?.length - 1 === index ? 0 : 0.2,
                          marginTop: 15,
                        }}></View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
