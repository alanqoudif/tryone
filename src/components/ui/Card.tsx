import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  shadow = true,
}) => {
  const colors = useThemeColors();

  const getPaddingStyles = () => {
    const paddingStyles = {
      none: {},
      sm: { padding: 12 },
      md: { padding: 16 },
      lg: { padding: 20 },
    };
    return paddingStyles[padding];
  };

  const getShadowStyles = () => {
    if (!shadow) return {};
    
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    };
  };

  const cardStyles: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...getPaddingStyles(),
    ...getShadowStyles(),
  };

  return (
    <View style={[cardStyles, style]}>
      {children}
    </View>
  );
};

export default Card;