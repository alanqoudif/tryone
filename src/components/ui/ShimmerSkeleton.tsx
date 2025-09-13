import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface ShimmerSkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: ViewStyle | ViewStyle[] | any;
}

// Lightweight shimmer without external gradient dependency
const ShimmerSkeleton: React.FC<ShimmerSkeletonProps> = ({ width = '100%', height = 16, radius = 8, style }) => {
  const translate = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const loop = () => {
      translate.setValue(-100);
      Animated.timing(translate, { toValue: 100, duration: 1200, useNativeDriver: true }).start(() => loop());
    };
    loop();
    return () => translate.stopAnimation();
  }, []);

  return (
    <Animated.View style={[{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.08)' }, style]}>
      <Animated.View
        style={{
          position: 'absolute',
          start: 0,
          top: 0,
          bottom: 0,
          width: '40%',
          transform: [{ translateX: translate }],
          backgroundColor: 'rgba(255,255,255,0.15)',
          opacity: 0.6,
        }}
      />
    </Animated.View>
  );
};

export default ShimmerSkeleton;

