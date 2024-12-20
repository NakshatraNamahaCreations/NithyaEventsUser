import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native';
import {Image} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {apiUrl} from '../../api-services/api-constants';

export default function AllVendors() {
  const navigation = useNavigation();
  const route = useRoute();
  const vendorList = route.params.vendorList;

  const [searchVendor, setSearchVendor] = useState('');
  const [filteredVendor, setFilteredVendor] = useState([]);

  const handleSearch = text => {
    setSearchVendor(text);
  };

  useEffect(() => {
    const search = vendorList.filter(vend => {
      const lowerCaseQuery = searchVendor.toLowerCase();
      return (
        vend.shop_name.toLowerCase().includes(lowerCaseQuery) ||
        (vend.address &&
          vend.address.length > 0 &&
          (
            vend.address[0].cityDownVillage.toLowerCase() +
            vend.address[0].distric.toLowerCase() +
            vend.address[0].state.toLowerCase()
          ).includes(lowerCaseQuery))
      );
    });
    setFilteredVendor(search);
  }, [searchVendor]);

  // console.log('filteredVendor', filteredVendor);
  return (
    <View
      style={{
        backgroundColor: '#f3f3f3',
        flex: 1,
        height: '100%',
      }}>
      <View
        style={{
          padding: 15,
          backgroundColor: 'white',
          elevation: 4,
        }}>
        <Text
          style={{
            fontFamily: 'Montserrat-Medium',
            color: 'black',
            fontSize: 20,
            textAlign: 'left',
          }}>
          All Vendors
        </Text>
      </View>
      <TextInput
        placeholderTextColor="#757575"
        placeholder="Search shop or address..."
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
        }}
      />
      <ScrollView style={{padding: 10}}>
        <View style={{paddingBottom: 10}}>
          {filteredVendor.map((ved, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: 'white',
                borderColor: 'transparent',
                borderWidth: 1,
                borderRadius: 15,
                // padding: 10,
                elevation: 2,
                marginBottom: 10,
              }}
              onPress={() => {
                navigation.navigate('VendorProfile', {
                  vendorProfile: ved,
                });
              }}>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 0.3}}>
                  <Image
                    // key={index}
                    resizeMode="stretch"
                    style={{
                      width: 120,
                      height: 120,
                      borderTopLeftRadius: 15,
                      borderBottomLeftRadius: 15,
                    }}
                    // source={require('../../../assets/samplevendor.png')}
                    source={{
                      uri: ved.shop_image_or_logo,
                    }}
                  />
                </View>
                <View style={{flex: 0.02}}></View>
                <View
                  style={{
                    flex: 0.6,
                    // justifyContent: 'center',
                    //   alignContent: 'center',
                    //   alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                      marginTop: 10,
                    }}>
                    {/* <Ionicons name="storefront-outline" size={18} color="black" />{' '} */}
                    {ved.shop_name}
                  </Text>
                  {/* <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      fontFamily: 'Montserrat-Medium',
                      marginTop: 7,
                      // fontWeight: '500',
                    }}>
                    <SimpleLineIcons name="user" size={15} color="black" />{' '}
                    {ved.vendor_name}
                  </Text> */}
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#5d6fff',
                      marginTop: 7,
                      fontFamily: 'Montserrat-Medium',
                    }}>
                    <SimpleLineIcons
                      name="location-pin"
                      size={13}
                      color="#5d6fff"
                    />{' '}
                    {ved.address && ved.address.length > 0
                      ? `${ved.address[0].cityDownVillage}, ${ved.address[0].distric}, ${ved.address[0].state}`
                      : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* */}
    </View>
  );
}
