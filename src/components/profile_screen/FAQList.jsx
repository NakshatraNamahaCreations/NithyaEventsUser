import {View, Text, ScrollView} from 'react-native';
import React from 'react';

export default function FAQList() {
  const FAQ = [
    {
      id: 1,
      additional: '',
      question: 'What types of events do you rent equipment for?',
      answer:
        'We provide rentals for a variety of events, including weddings, corporate events, parties, festivals, and more.',
    },
    {
      id: 2,
      additional: '',
      question: 'How do I make a reservation?',
      answer:
        'You can reserve equipment by visiting our website or dowloading our application. A deposit is usually required to secure your reservation.',
    },
    {
      id: 3,
      additional: '',
      question: 'What is your cancellation policy?',
      answer:
        'Cancellations must be made at least 2 days in advance. Cancellations made within a day will be no refund.Equipment and Services',
    },
    {
      id: 4,
      additional: '',
      question: 'What types of equipment do you offer?',
      answer:
        'We offer a wide range of rental equipment, including tables, chairs, tents, linens, audio/visual equipment, and more.',
    },
    {
      id: 5,
      additional: '',
      question: 'Can I pick up the equipment myself?',
      answer:
        'Yes, you can choose to pick up your equipment from our location. However, delivery and setup services are also available for an additional fee.',
    },
    {
      id: 6,
      additional: 'Delivery and Setup',
      question: 'Is there a minimum rental amount?',
      answer:
        'Yes, everything in adanve, which varies depending on the type of equipment.',
    },
    {
      id: 7,
      additional: '',
      question: 'Do you offer delivery and setup?',
      answer:
        'Yes, we provide delivery and setup services for an additional fee. Please contact us for details and pricing.',
    },
    {
      id: 8,
      additional: 'Payment and Fees',
      question: 'How far in advance should I schedule my delivery?',
      answer:
        'We recommend scheduling your delivery at least one week in advance to ensure availability.',
    },
    {
      id: 9,
      additional: '',
      question: 'What payment methods do you accept?',
      answer:
        'We accept credit cards, and bank transfers. Full payment is typically required before delivery.',
    },
    {
      id: 10,
      additional: '',
      question: 'Are there any additional fees I should be aware of?',
      answer:
        'Additional fees may apply for delivery, setup, and cleaning services. Please inquire for a detailed breakdown.',
    },
    {
      id: 11,
      additional: 'After the Event',
      question: 'What is the process for returning rented equipment?',
      answer:
        'Please return the equipment in its original condition by the agreed-upon time. If you opted for our pickup service, we will coordinate a pickup time.',
    },
    {
      id: 12,
      additional: '',
      question: 'What happens if the equipment is damaged or lost?',
      answer:
        'Customers are responsible for any damages or losses incurred during the rental period. Fees will apply based on the extent of the damage.',
    },
    {
      id: 13,
      question: 'Can I customize my rental package?',
      answer:
        'Absolutely! We offer flexible rental packages to suit your specific needs. Just let us know what you are looking for, and we will help you create the perfect setup.',
      additional: 'Customization',
    },
    {
      id: 14,
      additional: 'Contact',
      question: 'How can I contact you for more information?',
      answer:
        'You can reach us by phone, email, or through our websites contact form. We’re happy to answer any questions you may have! You can also write us on support@nithyaevent.com',
    },
  ];
  return (
    <View style={{flex: 1, padding: 15}}>
      <ScrollView>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-SemiBold',
            fontSize: 18,
          }}>
          Frequently Asked Quantions
        </Text>
        {FAQ.map(ele => (
          <View style={{marginTop: 20}} key={ele.id}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                fontSize: 14,
              }}>
              Q: {ele.question}
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Medium',
                fontSize: 13,
                marginTop: 10,
              }}>
              {ele.additional}
            </Text>

            <Text
              style={{
                color: 'black',
                fontFamily: 'Montserrat-Regular',
                fontSize: 13,
                marginTop: 10,
              }}>
              A: {ele.answer}
            </Text>
          </View>
        ))}
        {/* <Text
          style={{
            color: 'black',
            fontFamily: 'Montserrat-Medium',
            fontSize: 15,
            marginTop: 20,
            textDecorationLine: 'underline',
          }}>
          Feel free to modify these questions and answers.
        </Text> */}
      </ScrollView>
    </View>
  );
}
