import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Aboutus = () => {
  return (
    <ScrollView style={{paddingHorizontal: 5}}>
      <Text
        style={[
          styles.subHeader,
          {textAlign: 'center', marginTop: 15, marginBottom: 20},
        ]}>
        ABOUT US
      </Text>

      <Text style={[styles.listItem, {marginBottom: 15}]}>
        <Text style={styles.bold}>Welcome to Nithyaevent,</Text> where your
        dream events come to life with ease and elegance. We specialize in
        offering premium event rental services to make every occasion
        unforgettable. Whether it's a wedding, corporate gathering, birthday
        celebration, or any special event, we provide a wide range of
        high-quality products to suit your unique needs.
      </Text>
      <Text style={[styles.listItem, {marginBottom: 15}]}>
        With a focus on exceptional service and attention to detail, we take
        pride in delivering everything you need to create the perfect
        atmosphere. From furniture and decor to audio-visual equipment and
        bespoke setups, our diverse inventory ensures that your event reflects
        your vision and style.
      </Text>

      <Text style={styles.listItem}>
        At Nithyaevent, our team of professionals is committed to making event
        planning stress-free and enjoyable. We go above and beyond to ensure
        timely delivery, seamless setup, and impeccable quality. Partner with us
        to transform your ideas into reality and create memories that last a
        lifetime.
      </Text>
      <Text style={[styles.listItem, {marginTop: 20}]}>
        <Text style={styles.bold}>
          Nithyaevent – Your trusted partner for every celebration.
        </Text>
      </Text>
    </ScrollView>
  );
};

export default Aboutus;

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
