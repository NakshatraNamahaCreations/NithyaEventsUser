import {View, Text, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import moment from 'moment';
import {useDateContext} from '../../utilities/DateSelection';
import {useNavigation} from '@react-navigation/native';

const CalenderDisplay = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(true);
  const [isRangeSelection, setIsRangeSelection] = useState(true);
  const [disabledDate, setDisabledDate] = useState({});
  const {dateSelection, setDateSelection} = useDateContext();

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
        navigation.navigate('BottomTab');
      } catch (error) {
        console.error('Error saving dates:', error);
      }
    }
  };
  // console.log('dateSelection in calenderdisplay page', dateSelection);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{margin: 15}}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'Montserrat-SemiBold',
              marginBottom: 20,
              color: 'black',
            }}>
            Select Event Dates{' '}
          </Text>
        </View>
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
          style={{
            // width: '100%',
            backgroundColor: 'white',
            // padding: 20,
            borderRadius: 10,
            // alignItems: 'center',
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#7460e4',
            padding: 10,
            borderRadius: 50,
            marginHorizontal: 20,
            marginTop: 10,
            // width: '100%',
          }}
          onPress={handleSave}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Montserrat-SemiBold',
              textAlign: 'center',
              fontSize: 14,
            }}>
            Confirm
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CalenderDisplay;
