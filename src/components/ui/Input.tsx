import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useIsDark } from '../../hooks/useTheme';

interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  hintStyle?: TextStyle;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  hintStyle,
  variant = 'default',
  size = 'medium',
  secureTextEntry,
  ...textInputProps
}) => {
  const isDark = useIsDark();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const colors = {
    background: isDark ? '#1c1c1e' : '#ffffff',
    filled: isDark ? '#2c2c2e' : '#f2f2f7',
    border: isDark ? '#38383a' : '#c6c6c8',
    borderFocused: '#007AFF',
    borderError: '#FF3B30',
    text: isDark ? '#ffffff' : '#000000',
    placeholder: isDark ? '#8e8e93' : '#6d6d70',
    label: isDark ? '#ffffff' : '#000000',
    error: '#FF3B30',
    hint: isDark ? '#8e8e93' : '#6d6d70',
  };

  const sizes = {
    small: {
      height: 36,
      fontSize: 14,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    medium: {
      height: 44,
      fontSize: 16,
      paddingHorizontal: 16,
      borderRadius: 10,
    },
    large: {
      height: 52,
      fontSize: 18,
      paddingHorizontal: 20,
      borderRadius: 12,
    },
  };

  const getInputContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      height: sizes[size].height,
      borderRadius: sizes[size].borderRadius,
      paddingHorizontal: sizes[size].paddingHorizontal,
    };

    switch (variant) {
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: colors.filled,
          borderWidth: 0,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: error
            ? colors.borderError
            : isFocused
            ? colors.borderFocused
            : colors.border,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: colors.background,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: error
            ? colors.borderError
            : isFocused
            ? colors.borderFocused
            : colors.border,
        };
    }
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: sizes[size].fontSize,
      color: colors.text,
      paddingVertical: 0,
      marginStart: leftIcon ? 8 : 0,
        marginEnd: rightIcon ? 8 : 0,
    };
  };

  const handleToggleSecure = () => {
    setIsSecure(!isSecure);
  };

  const renderRightIcon = () => {
    if (secureTextEntry) {
      return (
        <TouchableOpacity onPress={handleToggleSecure}>
          <Text style={{ fontSize: 16 }}>
            {isSecure ? '👁️' : '🙈'}
          </Text>
        </TouchableOpacity>
      );
    }
    
    if (rightIcon && onRightIconPress) {
      return (
        <TouchableOpacity onPress={onRightIconPress}>
          {rightIcon}
        </TouchableOpacity>
      );
    }
    
    return rightIcon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.label }, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getInputContainerStyle()}>
        {leftIcon}
        <TextInput
          {...textInputProps}
          style={[getInputStyle(), inputStyle]}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isSecure}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
        />
        {renderRightIcon()}
      </View>
      
      {error && (
        <Text style={[styles.error, { color: colors.error }, errorStyle]}>
          {error}
        </Text>
      )}
      
      {hint && !error && (
        <Text style={[styles.hint, { color: colors.hint }, hintStyle]}>
          {hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;