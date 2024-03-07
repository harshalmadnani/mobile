import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ensure this package is installed

const BouncyIcon = () => {
  const scale = useRef(new Animated.Value(1)).current; // Initial scale

  useEffect(() => {
    const animate = () => {
      // Looping animation
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2, // Enlarge icon
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1, // Return to original size
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(() => animate()); // Loop the animation
    };

    animate(); // Start the animation when the component mounts
  }, [scale]); // Empty dependency array ensures this effect runs only once

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon name="expand-less" size={24} color="#fff" />
      </Animated.View>
    </View>
  );
};

export default BouncyIcon;
