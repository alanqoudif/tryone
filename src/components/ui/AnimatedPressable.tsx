import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, ViewStyle } from 'react-native';

interface AnimatedPressableProps extends PressableProps {
  scaleTo?: number; // scale on press, default 0.96
  style?: ViewStyle | ViewStyle[] | any;
}

const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  scaleTo = 0.96,
  style,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to: number) => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      friction: 6,
      tension: 220,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale }] }]}> 
      <Pressable
        onPressIn={(e) => {
          animateTo(scaleTo);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animateTo(1);
          onPressOut?.(e);
        }}
        style={style}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default AnimatedPressable;

