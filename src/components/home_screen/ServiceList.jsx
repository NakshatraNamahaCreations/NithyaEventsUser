import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';

function ServiceList() {
  const route = useRoute();
  const navigation = useNavigation();
  const serviceList = route.params.serviceList || [];
  const filterOnlyService = serviceList.filter(
    item => item.service_name !== 'Vendor & Seller' && item.isActive === true,
  );
  const [searchService, setSearchService] = useState('');
  const [filteredService, setFilteredService] = useState(filterOnlyService);

  const handleSearch = text => {
    setSearchService(text);

    const filtered = filterOnlyService.filter(item =>
      item.service_name.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredService(filtered);
  };

  return (
    <View style={{backgroundColor: '#f3f3f3', height: '100%'}}>
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
          Services
        </Text>
      </View>

      <TextInput
        placeholderTextColor="#757575"
        placeholder="Search services..."
        value={searchService}
        onChangeText={handleSearch}
        style={{
          color: 'black',
          fontSize: 15,
          borderRadius: 7,
          margin: 10,
          paddingLeft: 20,
          fontFamily: 'Montserrat-Medium',
          backgroundColor: 'white',
          elevation: 3,
        }}
      />

      <ScrollView>
        <View
          style={{
            // marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {filteredService.map(ele => (
            <TouchableOpacity
              key={ele._id}
              onPress={() =>
                navigation.navigate('ServiceCategory', {
                  serviceList: ele,
                })
              }
              style={{
                width: '45%',
                padding: 10,
                elevation: 2,
                // height: 200,
                // borderColor: '#c4cdd5',
                // borderWidth: 1,
                borderRadius: 7,
                backgroundColor: 'white',
                margin: 5,
              }}>
              {/* <View style={{flexDirection: 'row', alignItems: 'center'}}> */}
              {/* <Image
                  source={{
                    uri: 'https://as2.ftcdn.net/v2/jpg/04/10/11/59/1000_F_410115973_n5PUnStlduZSKcdkK0AtGWM7sloCZHdD.jpg',
                  }}
                  style={{
                    width: 50,
                    marginRight: 12,
                    height: 45,
                    borderRadius: 50,
                    flex: 0.3,
                  }}
                /> */}
              <Text
                style={{
                  // flex: 0.7,
                  color: 'black',
                  fontSize: 15,
                  fontFamily: 'Montserrat-Medium',
                  textAlign: 'center',
                }}>
                {ele.service_name}
              </Text>
              {/* </View> */}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default ServiceList;
