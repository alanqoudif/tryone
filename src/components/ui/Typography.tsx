import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';
import { TYPOGRAPHY } from '../../constants';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'small';
type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariant;
  color?: TextColor | string;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
}

const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  color = 'primary',
  style,
  numberOfLines,
  onPress,
}) => {
  const colors = useThemeColors();

  const getVariantStyles = (): TextStyle => {
    const variantStyles = {
      h1: {
        fontSize: TYPOGRAPHY.h1.fontSize,
        lineHeight: TYPOGRAPHY.h1.lineHeight,
        fontWeight: TYPOGRAPHY.h1.fontWeight as TextStyle['fontWeight'],
      },
      h2: {
        fontSize: TYPOGRAPHY.h2.fontSize,
        lineHeight: TYPOGRAPHY.h2.lineHeight,
        fontWeight: TYPOGRAPHY.h2.fontWeight as TextStyle['fontWeight'],
      },
      h3: {
        fontSize: 20,
        lineHeight: 26,
        fontWeight: '600' as TextStyle['fontWeight'],
      },
      body: {
        fontSize: TYPOGRAPHY.body.fontSize,
        lineHeight: TYPOGRAPHY.body.lineHeight,
        fontWeight: TYPOGRAPHY.body.fontWeight as TextStyle['fontWeight'],
      },
      caption: {
        fontSize: TYPOGRAPHY.caption.fontSize,
        lineHeight: TYPOGRAPHY.caption.lineHeight,
        fontWeight: TYPOGRAPHY.caption.fontWeight as TextStyle['fontWeight'],
      },
      small: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400' as TextStyle['fontWeight'],
      },
    };
    return variantStyles[variant];
  };

  const getTextColor = (): string => {
    const colorMap = {
      primary: colors.text,
      secondary: colors.text,
      muted: colors.muted,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
    };

    return colorMap[color as keyof typeof colorMap] || color;
  };

  const textStyles: TextStyle = {
    ...getVariantStyles(),
    color: getTextColor(),
  };

  return (
    <RNText
      style={[textStyles, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};

export default Typography;

// Convenience components
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h1" />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h2" />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="h3" />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="body" />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="caption" />
);

export const Small: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography {...props} variant="small" />
);