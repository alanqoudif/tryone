import React from 'react';
import { View, StyleSheet, Platform, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../constants/design';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  borderRadius?: number;
  blurIntensity?: number;
  variant?: 'default' | 'solid' | 'minimal';
}

export function GlassCard({ 
  children, 
  style, 
  padding = theme.spacing(2),
  borderRadius = theme.radius.lg,
  blurIntensity = 20,
  variant = 'default'
}: GlassCardProps) {
  const cardStyle = [
    styles.card,
    {
      padding,
      borderRadius,
      ...theme.shadow.card,
    },
    style,
  ];

  // iOS: استخدام BlurView الحقيقي
  if (Platform.OS === 'ios' && variant === 'default') {
    return (
      <BlurView 
        intensity={blurIntensity} 
        tint="dark" 
        // Important: apply layout-related styles (like width) to the outer BlurView,
        // so the card stretches to the full available width on iOS as well.
        style={[styles.blurContainer, { borderRadius }, style]}
      >
        <View style={[cardStyle, { backgroundColor: 'transparent' }]}>
          {children}
        </View>
      </BlurView>
    );
  }

  // Android أو variant solid: استخدام لون شبه شفاف
  const backgroundColor = variant === 'solid' 
    ? '#FFFFFF' 
    : '#FFFFFF';

  return (
    <View style={[cardStyle, { backgroundColor }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  blurContainer: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
