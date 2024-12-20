import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';
import {categories, categories1} from '../../data/global-data';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useNavigation} from '@react-navigation/native';

export default function CategoryList() {
  const navigation = useNavigation();

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 10,
          backgroundColor: 'white',
          elevation: 1,
          borderBottomColor: '#e0e0e0',
          borderBottomWidth: 1,
          // elevation: 2,
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 18,
          }}>
          Categories
        </Text>
      </View>
      <ScrollView style={{backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            padding: 20,
          }}>
          {categories.map((ele, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginTop: 15,
                borderRadius: 29,
                backgroundColor: '#f2edff',
                elevation: 3,
                // backgroundColor: ele.backgroundColor,
                width: '45%',
                marginBottom: 10,
              }}
              onPress={() =>
                navigation.navigate('ProductFiltered', {category: ele})
              }>
              <View
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  marginTop: 10,
                }}>
                <Image
                  source={ele.categoryImage}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Montserrat-SemiBold',
                    fontSize: 15,
                    textAlign: 'center',
                    marginVertical: 10, // Add some margin for spaci
                  }}>
                  {ele.categoryName}
                </Text>
                <FontAwesome6
                  name="circle-arrow-right"
                  color="black"
                  size={18}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* {categories1.map((ele, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              marginVertical: 5,
              padding: 10,
              borderRadius: 6,
              elevation: 2,
              alignItems: 'center',
              borderColor: '#acc99378',
              borderWidth: 1,
            }}>
            <View style={{flex: 0.4}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 16,
                  marginLeft: 10,
                }}>
                {ele.categoryName}
              </Text>
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'relative',
              }}>
              {ele.categoryImage?.map((image, imageIndex) => (
                <View
                  style={{
                    backgroundColor: '#acc99378',
                    borderRadius: 50,
                    width: 60,
                    height: 60,
                    // elevation: 1,
                    padding: 5,
                  }}>
                  <Image
                    key={imageIndex}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 50,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={image.imageUrl}
                  />
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))} */}

        {/* <View style={{marginTop: 15}}>
        {categories.map((ele, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: 'row',
              backgroundColor: ele.backgroundColor,
              marginVertical: 5,
              padding: 10,
              borderRadius: 6,
              alignItems: 'center',
              borderColor: '#acc99378',
              borderWidth: 1,
            }}>
            <View style={{flex: 0.4}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 16,
                  marginLeft: 10,
                }}>
                {ele.categoryName}
              </Text>
            </View>
            <View
              style={{
                flex: 0.6,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'relative',
              }}>
              {ele.categoryImage?.map((image, imageIndex) => (
                <View
                  style={{
                    backgroundColor: '#acc99378',
                    borderRadius: 50,
                    width: 60,
                    height: 60,
                    // elevation: 1,
                    padding: 5,
                  }}>
                  <Image
                    key={imageIndex}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 50,
                      resizeMode: 'contain',
                      alignSelf: 'center',
                    }}
                    source={image.imageUrl}
                  />
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View> */}
      </ScrollView>
    </View>
  );
}
