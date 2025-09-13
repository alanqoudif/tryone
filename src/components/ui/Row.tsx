import React from 'react';
import { I18nManager, View, ViewProps } from 'react-native';

const Row: React.FC<ViewProps> = ({ style, ...props }) => (
  <View {...props} style={[{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: 'center' }, style]} />
);

export default Row;

