import React, { useEffect, useRef } from 'react';
import { ViewStyle, Animated, Easing } from 'react-native';
import { theme } from '../../constants/design';

interface StaggeredListProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  style?: ViewStyle;
  itemDelay?: number;
}

export function StaggeredList({ 
  children, 
  delay = 0, 
  duration = theme.animation.duration.normal,
  direction = 'up',
  style,
  itemDelay = 100
}: StaggeredListProps) {
  return (
    <Animated.View style={style}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return (
          <StaggeredItem
            key={index}
            delay={delay + (index * itemDelay)}
            duration={duration}
            direction={direction}
          >
            {child}
          </StaggeredItem>
        );
      })}
    </Animated.View>
  );
}

interface StaggeredItemProps {
  children: React.ReactNode;
  delay: number;
  duration: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

function StaggeredItem({ 
  children, 
  delay, 
  duration, 
  direction
}: StaggeredItemProps) {
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
    <Animated.View style={{
      opacity,
      transform: [
        { translateY },
        { translateX },
      ],
    }}>
      {children}
    </Animated.View>
  );
}
