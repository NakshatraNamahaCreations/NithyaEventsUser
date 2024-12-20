import React, {useRef, useState} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';

// Get the screen dimensions for boundary calculations
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const DraggableImage = ({imageSource, dropZoneValues, style}) => {
  const pan = useRef(new Animated.ValueXY()).current; // Initial position is (0,0)
  const [isDropped, setIsDropped] = useState(false); // State to check if image is dropped in the target area

  // PanResponder to handle drag events
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        // Check if the image is dropped inside the drop zone
        if (isDropZone(gesture)) {
          setIsDropped(true);
          // Set the image position inside the drop zone
          Animated.spring(pan, {
            toValue: {
              x: dropZoneValues.x + gesture.moveX - dropZoneValues.width / 2,
              y: dropZoneValues.y + gesture.moveY - dropZoneValues.height / 2,
            },
            useNativeDriver: false,
          }).start();
        } else {
          // Snap back to the original position if not dropped in the drop zone
          Animated.spring(pan, {
            toValue: {x: 0, y: 0},
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const isDropZone = gesture => {
    const {moveX, moveY} = gesture;
    return (
      moveX > dropZoneValues.x &&
      moveX < dropZoneValues.x + dropZoneValues.width &&
      moveY > dropZoneValues.y &&
      moveY < dropZoneValues.y + dropZoneValues.height
    );
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{translateX: pan.x}, {translateY: pan.y}],
        },
        style,
      ]}
      {...panResponder.panHandlers}>
      <Image source={imageSource} style={styles.image} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default DraggableImage;
