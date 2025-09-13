import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/design';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({ 
  title, 
  onPress, 
  style, 
  textStyle,
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false
}: PrimaryButtonProps) {
  const handlePress = async () => {
    if (disabled || loading) return;
    
    // تأثير الاهتزاز الخفيف
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const buttonHeight = theme.components.button.height[size];
  const paddingHorizontal = theme.components.button.padding.horizontal;

  return (
    <Pressable 
      onPress={handlePress} 
      style={({ pressed }) => [
        styles.container,
        fullWidth && styles.fullWidth,
        { opacity: disabled ? 0.6 : pressed ? 0.9 : 1 },
        style
      ]}
      disabled={disabled}
    >
      {({ pressed }) => (
        <View style={[styles.wrapper, { borderRadius: theme.radius.xl }]}>
          {/* التوهج الخلفي */}
          <View style={[styles.glow, { opacity: pressed ? 0.8 : 1 }]} />
          
          {/* التدرج البنفسجي */}
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.gradient,
              {
                height: buttonHeight,
                paddingHorizontal,
                borderRadius: theme.radius.xl,
              }
            ]}
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
          </LinearGradient>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -8,
    start: -8,
    end: -8,
    bottom: -8,
    borderRadius: theme.radius.xl + 8,
    backgroundColor: theme.colors.primaryGlow,
    opacity: 0.3,
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
});
