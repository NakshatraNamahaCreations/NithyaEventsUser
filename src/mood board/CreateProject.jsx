import {View, ScrollView, StyleSheet, Image} from 'react-native';
import React, {useState} from 'react';
import Draggable from 'react-native-draggable';

const items = [
  {id: 1, name: 'Chair', icon: require('../../assets/category/kiru6_9.png')},
  {id: 2, name: 'Mic', icon: require('../../assets/category/light1.png')},
  // Add more items here
];

const CreateProject = () => {
  const [placedItems, setPlacedItems] = useState([]);

  return (
    <View style={styles.container}>
      {/* This image outside of Draggable */}
      <Image
        source={require('../../assets/category/kiru6_9.png')}
        style={{width: 100, height: 100}}
      />

      {/* Scrollable list of items */}
      <ScrollView horizontal={true} style={styles.itemList}>
        {items.map(item => (
          <Draggable
            key={item.id}
            onDragRelease={(e, gestureState, bounds) => {
              setPlacedItems([
                ...placedItems,
                {...item, x: bounds.left, y: bounds.top},
              ]);
            }}>
            {/* Child image inside Draggable */}
            <Image
              source={item.icon}
              style={{width: 50, height: 50}} // Set image dimensions
            />
          </Draggable>
        ))}
      </ScrollView>

      {/* Drop Area */}
      <View style={styles.dropArea}>
        {placedItems.map(item => (
          <Draggable key={item.id} x={item.x} y={item.y}>
            {/* Dropped Image */}
            <Image
              source={item.icon}
              style={{width: 50, height: 50}} // Ensure image dimensions
            />
          </Draggable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  itemList: {height: 100, backgroundColor: 'blue'},
  dropArea: {flex: 1, backgroundColor: '#fff'},
});

export default CreateProject;
