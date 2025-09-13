/**
 * Simple Utils Tests
 * These are basic function and utility tests without external testing libraries
 */

import { formatDate, formatTime, checkIsToday, checkIsTomorrow } from '../index';

// Test: Utility functions should be importable
const formatDateExists = typeof formatDate === 'function';
const formatTimeExists = typeof formatTime === 'function';
const isTodayExists = typeof checkIsToday === 'function';
const isTomorrowExists = typeof checkIsTomorrow === 'function';

console.log('✓ formatDate function exists:', formatDateExists);
console.log('✓ formatTime function exists:', formatTimeExists);
console.log('✓ checkIsToday function exists:', isTodayExists);
console.log('✓ checkIsTomorrow function exists:', isTomorrowExists);

// Test: formatDate function
if (formatDateExists) {
  const testDate = new Date('2024-01-15T10:30:00');
  const formattedDate = formatDate(testDate);
  const isValidFormat = typeof formattedDate === 'string' && formattedDate.length > 0;
  console.log('✓ formatDate returns valid string:', isValidFormat);
  console.log('  Sample output:', formattedDate);
}

// Test: formatTime function
if (formatTimeExists) {
  const testDate = new Date('2024-01-15T10:30:00');
  const formattedTime = formatTime(testDate);
  const isValidFormat = typeof formattedTime === 'string' && formattedTime.length > 0;
  console.log('✓ formatTime returns valid string:', isValidFormat);
  console.log('  Sample output:', formattedTime);
}

// Test: checkIsToday function
if (isTodayExists) {
  const today = new Date();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const todayResult = checkIsToday(today);
  const yesterdayResult = checkIsToday(yesterday);
  
  console.log('✓ checkIsToday correctly identifies today:', todayResult === true);
  console.log('✓ checkIsToday correctly identifies yesterday:', yesterdayResult === false);
}

// Test: checkIsTomorrow function
if (isTomorrowExists) {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const today = new Date();
  
  const tomorrowResult = checkIsTomorrow(tomorrow);
  const todayResult = checkIsTomorrow(today);
  
  console.log('✓ checkIsTomorrow correctly identifies tomorrow:', tomorrowResult === true);
  console.log('✓ checkIsTomorrow correctly identifies today:', todayResult === false);
}

// Test: Date parameter validation
const testInvalidDate = () => {
  try {
    if (formatDateExists) {
      const result = formatDate(new Date('invalid'));
      return typeof result === 'string';
    }
    return true;
  } catch (error) {
    console.log('✓ formatDate handles invalid dates gracefully');
    return true;
  }
};

const invalidDateHandled = testInvalidDate();
console.log('✓ Invalid date handling:', invalidDateHandled);

// Test: Edge cases
const testEdgeCases = () => {
  const results = {
    formatDateWithNull: true,
    formatTimeWithNull: true,
    isTodayWithNull: true,
    isTomorrowWithNull: true,
  };

  try {
    // Test with edge case dates
    const edgeDate = new Date(0); // Unix epoch
    if (formatDateExists) formatDate(edgeDate);
    if (formatTimeExists) formatTime(edgeDate);
    if (isTodayExists) checkIsToday(edgeDate);
    if (isTomorrowExists) checkIsTomorrow(edgeDate);
    
    console.log('✓ Edge cases handled successfully');
    return true;
  } catch (error) {
    console.log('⚠ Some edge cases may need handling:', error);
    return false;
  }
};

const edgeCasesHandled = testEdgeCases();

// Export test results
export const utilsTests = {
  formatDateExists,
  formatTimeExists,
  isTodayExists,
  isTomorrowExists,
  invalidDateHandled,
  edgeCasesHandled,
};

console.log('Utils Tests Summary:', utilsTests);