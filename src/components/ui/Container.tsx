import React from 'react';
import { View, ViewProps } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const H_PADDING = 16;

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        {...rest}
        style={[{ flex: 1, paddingHorizontal: H_PADDING, paddingBottom: Math.max(insets.bottom, 8) }, style]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};

export default Container;

