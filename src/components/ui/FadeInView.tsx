import React, { useEffect, useRef } from 'react';
import { ViewStyle, Animated, Easing } from 'react-native';
import { theme } from '../../constants/design';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  style?: ViewStyle;
}

export function FadeInView({ 
  children, 
  delay = 0, 
  duration = theme.animation.duration.normal,
  direction = 'up',
  style 
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(direction === 'up' ? 20 : direction === 'down' ? -20 : 0)).current;
  const translateX = useRef(new Animated.Value(direction === 'left' ? 20 : direction === 'right' ? -20 : 0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, opacity, translateY, translateX]);

  return (
    <Animated.View style={[
      style,
      {
        opacity,
        transform: [
          { translateY },
          { translateX },
        ],
      }
    ]}>
      {children}
    </Animated.View>
  );
}
