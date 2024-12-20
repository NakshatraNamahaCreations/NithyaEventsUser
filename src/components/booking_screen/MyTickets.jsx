import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {useUserContext} from '../../utilities/UserContext';
import {apiUrl} from '../../api-services/api-constants';
import axios from 'axios';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const MyTickets = () => {
  const [myTickets, setMyTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const {userDataFromContext} = useUserContext();
  console.log('userDataFromContext in MyTickets page', userDataFromContext);

  const getMyTicketListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl.BASEURL}${apiUrl.GET_TICKET_BY_ID}${userDataFromContext?._id}`,
      );
      if (res.status === 200) {
        setMyTickets(res.data.data.reverse());
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyTicketListings();
  }, [userDataFromContext?._id]);

  console.log('myTickets', myTickets);

  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          backgroundColor: 'white',
          elevation: 2,
          //   borderBottomColor: '#e3e3e3',
          //   borderBottomWidth: 1,
        }}>
        <Text
          style={{
            fontSize: 18,
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            marginVertical: 15,
            marginLeft: 15,
          }}>
          My Tickets
        </Text>
      </View>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={{padding: 10}}>
          {myTickets.length === 0 ? (
            <Text
              style={{
                fontSize: 15,
                color: '#adadad',
                fontFamily: 'Montserrat-Medium',
                textAlign: 'center',
                marginTop: 100,
              }}>
              <FontAwesome6 name={'ticket'} size={16} color={'#adadad'} /> No
              tickets created
            </Text>
          ) : (
            <ScrollView>
              {myTickets.map(ele => (
                <View
                  key={ele._id}
                  style={{
                    backgroundColor: 'white',
                    marginBottom: 3,
                    borderRadius: 10,
                    padding: 15,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'black',
                      fontFamily: 'Montserrat-SemiBold',
                    }}>
                    Ticket Id: #{ele._id}
                  </Text>
                  <View style={{marginTop: 5}}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: 'black',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {ele.ticket_reason}
                    </Text>
                  </View>
                  <View style={{marginTop: 5, flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: 13,
                        flex: 0.5,
                        color: 'green',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      Status: {ele.ticket_status}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        flex: 0.5,
                        color: 'blue',
                        fontFamily: 'Montserrat-Medium',
                      }}>
                      {ele.ticket_created_date}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default MyTickets;
