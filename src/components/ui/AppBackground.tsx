import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/design';

interface AppBackgroundProps {
  children: React.ReactNode;
  style?: any;
}

export function AppBackground({ children, style }: AppBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      {/* التدرج الليلي الأساسي */}
      <LinearGradient
        colors={[theme.colors.bgTop, theme.colors.bgBottom]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* طبقة الضجيج لمنع banding */}
      <View style={styles.noiseOverlay} />
      
      {/* المحتوى */}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgBottom, // لون احتياطي
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.noise,
    // محاكاة الضجيج باستخدام نمط CSS
    // في التطبيق الحقيقي، يمكن استخدام صورة PNG للضجيج
  },
});
