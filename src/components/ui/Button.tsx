import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className,
  style,
  textStyle,
}) => {
  const colors = useThemeColors();

  const getButtonStyles = (): ViewStyle => {
    const sizeStyles = {
      sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
      md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 },
      lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 52 },
    };

    const variantStyles = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
      outline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: 'transparent' },
      ghost: { backgroundColor: 'transparent' },
    };

    return {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 24,
      opacity: disabled ? 0.5 : 1,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextStyles = (): TextStyle => {
    const sizeTextStyles = {
      sm: { fontSize: 14 },
      md: { fontSize: 16 },
      lg: { fontSize: 18 },
    };

    const variantTextStyles = {
      primary: { color: 'white' },
      secondary: { color: colors.text },
      outline: { color: colors.primary },
      ghost: { color: colors.text },
    };

    return {
      fontWeight: '500',
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? 'white' : colors.primary} 
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text 
            style={[getTextStyles(), { marginStart: icon ? 8 : 0 }, textStyle]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;