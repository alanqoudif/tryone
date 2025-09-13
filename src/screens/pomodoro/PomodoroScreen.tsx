import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../hooks/useTheme';
import { DESIGN_TOKENS, createShadow, createTypography } from '../../constants';
import { Button } from '../../components/ui';

const CIRCLE_SIZE = 280;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2 - 20;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function PomodoroScreen() {
  const colors = useThemeColors();
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (totalTime - timeLeft) / totalTime;
  const strokeDashoffset = CIRCUMFERENCE - (progress * CIRCUMFERENCE);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsRunning(true);
  };

  const handlePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, I18nManager.isRTL ? styles.headerRTL : undefined]}>
        <TouchableOpacity accessible accessibilityRole="button" accessibilityLabel="رجوع">
          <Ionicons name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>تقنية الطماطم</Text>
        <TouchableOpacity>
          <Ionicons name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'} size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Timer Circle */}
      <View style={styles.timerContainer}>
        <View style={styles.circleContainer}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE} style={styles.svg}>
            {/* Background Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke={colors.border}
              strokeWidth={8}
              fill="transparent"
            />
            {/* Progress Circle */}
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={CIRCLE_RADIUS}
              stroke="#8B7CF6"
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>
          
          {/* Timer Text */}
          <View style={styles.timerTextContainer}>
            <Text style={[styles.timerText, { color: colors.text }]}>
              {formatTime(timeLeft)}
            </Text>
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.resetButton,
            { borderColor: colors.border }
          ]}
          onPress={handleReset}
        >
          <Text style={[styles.controlButtonText, { color: colors.text }]}>إعادة تعيين</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.startButton,
            { backgroundColor: '#8B7CF6' }
          ]}
          onPress={isRunning ? handlePause : handleStart}
        >
          <Text style={[styles.controlButtonText, { color: '#FFFFFF' }]}>
            {isRunning ? 'إيقاف' : 'بدء'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  circleContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B7CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  timerTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 52,
    fontWeight: '800',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 48,
    gap: 20,
    marginTop: 20,
  },
  controlButton: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    minWidth: 120,
  },
  resetButton: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  startButton: {
    borderWidth: 0,
  },
  controlButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
