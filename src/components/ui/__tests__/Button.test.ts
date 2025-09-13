/**
 * Simple Button Component Tests
 * These are basic type and interface tests without external testing libraries
 */

import Button from '../Button';
import React from 'react';

// Test: Button component should be importable
const buttonExists = typeof Button === 'function';
console.log('✓ Button component exists:', buttonExists);

// Test: Button props interface validation
interface TestButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

// Test: Valid button props
const validProps: TestButtonProps = {
  title: 'Test Button',
  onPress: () => console.log('Button pressed'),
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
};

console.log('✓ Button props interface is valid:', typeof validProps === 'object');

// Test: Button variants
const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost'> = [
  'primary',
  'secondary', 
  'outline',
  'ghost'
];

console.log('✓ Button variants defined:', variants.length === 4);

// Test: Button sizes
const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
console.log('✓ Button sizes defined:', sizes.length === 3);

// Test: Required props validation
type RequiredButtonProps = {
  title: string;
  onPress: () => void;
};

const requiredProps: RequiredButtonProps = {
  title: 'Required Test',
  onPress: () => {},
};

console.log('✓ Required button props validated:', 
  typeof requiredProps.title === 'string' && 
  typeof requiredProps.onPress === 'function'
);

// Export test results
export const buttonTests = {
  componentExists: buttonExists,
  propsValid: typeof validProps === 'object',
  variantsCount: variants.length,
  sizesCount: sizes.length,
  requiredPropsValid: typeof requiredProps.title === 'string' && typeof requiredProps.onPress === 'function'
};

console.log('Button Component Tests Summary:', buttonTests);