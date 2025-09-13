import React, { useMemo } from 'react';
import { View, ViewProps } from 'react-native';

// Dynamic optional import for expo-linear-gradient
let LinearGradientComp: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradientComp = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradientComp = null;
}

interface GradientBackgroundProps extends ViewProps {
  colors?: string[];
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({ colors, style, children, ...rest }) => {
  const defaultColors = useMemo(() => colors || ['#0B0F14', '#0F1620'], [colors]);
  if (LinearGradientComp) {
    return (
      <LinearGradientComp colors={defaultColors} style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </LinearGradientComp>
    );
  }
  return (
    <View style={[{ flex: 1, backgroundColor: defaultColors[0] }, style]} {...rest}>
      {children}
    </View>
  );
};

export default GradientBackground;

