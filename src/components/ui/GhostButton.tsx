import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/design';

interface GhostButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'outline' | 'minimal';
}

export function GhostButton({ 
  title, 
  onPress, 
  style, 
  textStyle,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  variant = 'default'
}: GhostButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;
    
    // تأثير الاهتزاز الخفيف
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const buttonHeight = theme.components.button.height[size];
  const paddingHorizontal = theme.components.button.padding.horizontal;

  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primaryGlow,
          borderWidth: 1,
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: '#FFFFFF',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        };
    }
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [
        styles.container,
        fullWidth && styles.fullWidth,
        {
          height: buttonHeight,
          paddingHorizontal,
          borderRadius: theme.radius.xl,
          opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
          ...getVariantStyles(),
        },
        style
      ]}
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={[
          styles.text,
          { fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16 },
          textStyle
        ]}>
          {loading ? 'جاري التحميل...' : title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginEnd: 8,
  },
  text: {
    color: theme.colors.text,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
});
