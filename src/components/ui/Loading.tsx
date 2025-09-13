import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useIsDark } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color,
  text,
  overlay = false,
  style,
  textStyle,
}) => {
  const isDark = useIsDark();
  const { t } = useTranslation();

  const colors = {
    primary: '#007AFF',
    text: isDark ? '#ffffff' : '#000000',
    overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
  };

  const loadingColor = color || colors.primary;
  const loadingText = text || t('common.loading');

  const containerStyle: ViewStyle = {
    ...styles.container,
    ...(overlay && {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
      zIndex: 1000,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      <ActivityIndicator
        size={size}
        color={loadingColor}
        style={styles.indicator}
      />
      {text !== null && (
        <Text style={[styles.text, { color: colors.text }, textStyle]}>
          {loadingText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  indicator: {
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Loading;