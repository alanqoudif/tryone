import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../constants/design';

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0-100
  showPercentage?: boolean;
  children?: React.ReactNode;
  animated?: boolean;
  duration?: number;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function ProgressRing({ 
  size = 180, 
  strokeWidth = 12, 
  progress, 
  showPercentage = true,
  children,
  animated = true,
  duration = 1000
}: ProgressRingProps) {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const animatedPercentage = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(animatedProgress, {
          toValue: progress,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(animatedPercentage, {
          toValue: progress,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        })
      ]).start();
    } else {
      animatedProgress.setValue(progress);
      animatedPercentage.setValue(progress);
    }
  }, [progress, animated, duration]);

  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * 2 * radius;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          {/* تدرج البنفسجي للحلقة */}
          <SvgLinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={theme.colors.primary} />
            <Stop offset="100%" stopColor={theme.colors.primary2} />
          </SvgLinearGradient>
        </Defs>
        
        {/* الخلفية الخلفية للحلقة */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* حلقة التقدم */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={animatedProgress.interpolate({
            inputRange: [0, 100],
            outputRange: [`0, ${circumference}`, `${circumference}, ${circumference}`],
          })}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      
      {/* النسبة المئوية أو المحتوى المخصص */}
      <View style={styles.content}>
        {showPercentage ? (
          <Animated.Text style={[styles.percentage, { fontSize: size * 0.12 }]}>
            {animatedPercentage.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 100],
              extrapolate: 'clamp',
            }).interpolate((val) => `${Math.round(val)}%`)}
          </Animated.Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  content: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  percentage: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
});
