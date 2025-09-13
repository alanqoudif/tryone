import React from 'react';
import { I18nManager, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ChevronProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

const Chevron: React.FC<ChevronProps> = ({ color = '#6B7280', size = 20, style }) => {
  // Use a single icon and flip based on RTL to avoid confusion
  const icon = 'chevron-forward';
  const transformStyle: ViewStyle = { transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }] };
  return <Ionicons name={icon as any} color={color} size={size} style={[transformStyle, style]} />;
};

export default Chevron;

