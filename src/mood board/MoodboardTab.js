import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProductTab({product}) {
  const [productSpecification, setProductSpecification] = useState(false);
  const [productDetails, setProductDetails] = useState(true);
  const [coutryOfOrgin, setCoutryOfOrgin] = useState(false);
  const [manufacturer, setManufacturer] = useState(false);

  const handleTabClick = tabName => {
    setProductSpecification(tabName === 'specifications');
    setProductDetails(tabName === 'details');
    setCoutryOfOrgin(tabName === 'origin');
    setManufacturer(tabName === 'manufacturer');
  };

  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
          }}>
          <View style={{marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => handleTabClick('details')}>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name="info-circle"
                  size={16}
                  color={productDetails ? 'black' : ''}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 13,
                    color: productDetails ? 'black' : '#8d8d8d',
                    textAlign: 'center',
                  }}>
                  Chairs
                </Text>
                <View
                  style={{
                    borderBottomColor: productDetails ? 'black' : 'transparent',
                    borderBottomWidth: productDetails ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => handleTabClick('specifications')}>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name="info-circle"
                  size={16}
                  color={productDetails ? 'black' : ''}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 13,
                    textAlign: 'center',
                    color: productSpecification ? 'black' : '#8d8d8d',
                  }}>
                  Mic-Stand
                </Text>
                <View
                  style={{
                    borderBottomColor: productSpecification
                      ? 'black'
                      : 'transparent',
                    borderBottomWidth: productSpecification ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => handleTabClick('origin')}>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name="info-circle"
                  size={16}
                  color={productDetails ? 'black' : ''}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 13,
                    textAlign: 'center',
                    color: coutryOfOrgin ? 'black' : '#8d8d8d',
                  }}>
                  Spotlight
                </Text>
                <View
                  style={{
                    borderBottomColor: coutryOfOrgin ? 'black' : 'transparent',
                    borderBottomWidth: coutryOfOrgin ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginHorizontal: 10}}>
            <TouchableOpacity onPress={() => handleTabClick('manufacturer')}>
              <View style={{alignItems: 'center'}}>
                <Icon
                  name="info-circle"
                  size={16}
                  color={productDetails ? 'black' : ''}
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    fontFamily: 'Montserrat-Medium',
                    fontSize: 13,
                    color: manufacturer ? 'black' : '#8d8d8d',
                    textAlign: 'center',
                  }}>
                  Table Cloths
                </Text>
                <View
                  style={{
                    borderBottomColor: manufacturer ? 'black' : 'transparent',
                    borderBottomWidth: manufacturer ? 4.5 : 0,
                    position: 'relative',
                    top: 2,
                  }}></View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={{marginTop: 10}}>
        {productSpecification ? (
          <View>
            <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
              Specification Page
            </Text>
          </View>
        ) : productDetails ? (
          <View>
            <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
              Product Page
            </Text>
          </View>
        ) : coutryOfOrgin ? (
          <>
            <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
              Country Page
            </Text>
          </>
        ) : manufacturer ? (
          <>
            <Text style={{color: 'black', fontFamily: 'Montserrat-Regular'}}>
              Manufacture Page
            </Text>
          </>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productsDetasilRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  productsDetailsAns: {
    color: '#2c2c2c',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    marginTop: 5,
  },
  productDetailsHead: {
    color: '#2c2c2c',
    fontSize: 13,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 5,
    // letterSpacing: 1,
  },
});
