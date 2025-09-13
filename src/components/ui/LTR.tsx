import React from 'react';
import { Text, TextProps } from 'react-native';

export interface LTRProps extends TextProps {
  children: React.ReactNode;
}

/**
 * A component to display LTR text (like emails, phone numbers, dates) 
 * within RTL context while maintaining proper left-to-right reading direction
 */
export const LTR: React.FC<LTRProps> = ({ children, style, ...props }) => {
  return (
    <Text
      {...props}
      style={[
        {
          writingDirection: 'ltr',
          textAlign: 'left',
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default LTR;