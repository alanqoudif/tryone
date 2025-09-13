import React, { useRef } from 'react';
import { Pressable, ViewStyle, Animated, Easing } from 'react-native';
import { theme } from '../../constants/design';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  scale?: number;
  duration?: number;
}

export function AnimatedCard({ 
  children, 
  onPress, 
  style, 
  disabled = false,
  scale = 0.95,
  duration = theme.animation.duration.fast
}: AnimatedCardProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: scale,
        useNativeDriver: true,
        tension: 150,
        friction: 15,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.8,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 150,
        friction: 15,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={style}
      >
        <Animated.View style={{
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        }}>
          {children}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View style={[{
      transform: [{ scale: scaleValue }],
      opacity: opacityValue,
    }, style]}>
      {children}
    </Animated.View>
  );
}
