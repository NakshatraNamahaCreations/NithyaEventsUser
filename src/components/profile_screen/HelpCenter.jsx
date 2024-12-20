import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const HelpCenter = () => {
  return (
    <ScrollView style={{paddingHorizontal: 15}}>
      <Text style={[styles.subHeader, {textAlign: 'center', marginTop: 15}]}>
        HELP CENTRE
      </Text>
      <Text style={styles.listItem}>
        We’re here to assist you every step of the way, ensuring a seamless
        experience for your event planning and rentals.
      </Text>
      <Text style={styles.subHeader}>Contact Us</Text>
      <Text style={styles.listItem}>[support@nithyaevent.com]</Text>
      <Text style={styles.listItem}>Phone: 9743888803</Text>
      <Text style={styles.listItem}>
        FAQs : Visit our FAQ section for quick answers to common questions.
      </Text>
      <Text style={[styles.listItem, {marginTop: 20}]}>
        At Nithyaevent, we value your satisfaction and are committed to ensuring
        your event is a success. If you need further assistance, don’t hesitate
        to reach out. We’re always happy to help!
      </Text>
      <Text style={[styles.listItem, {marginTop: 20}]}>
        <Text style={styles.bold}>
          Nithyaevent – Making your celebrations hassle-free.
        </Text>
      </Text>
    </ScrollView>
  );
};

export default HelpCenter;

const styles = StyleSheet.create({
  subHeader: {
    fontSize: 15,
    marginVertical: 8,
    color: '#4f4f4f',
    fontFamily: 'Montserrat-SemiBold',
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 8,
    color: '#555',
    fontFamily: 'Montserrat-Medium',
  },
  listItem: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 4,
    color: '#555',
    marginLeft: 16,
    fontFamily: 'Montserrat-Medium',
  },
  bold: {
    fontWeight: 'bold',
  },
});
