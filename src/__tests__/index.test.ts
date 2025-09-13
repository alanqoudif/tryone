/**
 * Main Test Runner
 * Runs all component and utility tests
 */

// Import all test modules
import { buttonTests } from '../components/ui/__tests__/Button.test';
import { inputTests } from '../components/ui/__tests__/Input.test';
import { utilsTests } from '../utils/__tests__/index.test';
import { themeTests } from '../hooks/__tests__/useTheme.test';

// Test runner function
const runAllTests = () => {
  console.log('🧪 Starting Test Suite...');
  console.log('=' .repeat(50));

  // Component Tests
  console.log('\n📱 Component Tests:');
  console.log('-'.repeat(30));
  
  console.log('\n🔘 Button Component:');
  console.log('  - Component exists:', buttonTests.componentExists ? '✅' : '❌');
  console.log('  - Props valid:', buttonTests.propsValid ? '✅' : '❌');
  console.log('  - Variants count:', buttonTests.variantsCount === 4 ? '✅' : '❌');
  console.log('  - Sizes count:', buttonTests.sizesCount === 3 ? '✅' : '❌');
  console.log('  - Required props:', buttonTests.requiredPropsValid ? '✅' : '❌');

  console.log('\n📝 Input Component:');
  console.log('  - Component exists:', inputTests.componentExists ? '✅' : '❌');
  console.log('  - Props valid:', inputTests.propsValid ? '✅' : '❌');
  console.log('  - Variants count:', inputTests.variantsCount === 3 ? '✅' : '❌');
  console.log('  - Sizes count:', inputTests.sizesCount === 3 ? '✅' : '❌');
  console.log('  - Event handler:', inputTests.eventHandlerValid ? '✅' : '❌');
  console.log('  - Boolean props:', inputTests.booleanPropsValid ? '✅' : '❌');

  // Utility Tests
  console.log('\n🛠️ Utility Tests:');
  console.log('-'.repeat(30));
  
  console.log('\n📅 Date Utils:');
  console.log('  - formatDate exists:', utilsTests.formatDateExists ? '✅' : '❌');
  console.log('  - formatTime exists:', utilsTests.formatTimeExists ? '✅' : '❌');
  console.log('  - checkIsToday exists:', utilsTests.isTodayExists ? '✅' : '❌');
  console.log('  - checkIsTomorrow exists:', utilsTests.isTomorrowExists ? '✅' : '❌');
  console.log('  - Invalid date handling:', utilsTests.invalidDateHandled ? '✅' : '❌');
  console.log('  - Edge cases handled:', utilsTests.edgeCasesHandled ? '✅' : '❌');

  // Hook Tests
  console.log('\n🎨 Hook Tests:');
  console.log('-'.repeat(30));
  
  console.log('\n🌙 Theme Hooks:');
  console.log('  - useIsDark exists:', themeTests.useIsDarkExists ? '✅' : '❌');
  console.log('  - useThemeColors exists:', themeTests.useThemeColorsExists ? '✅' : '❌');
  console.log('  - Expected properties:', themeTests.expectedPropertiesCount === 9 ? '✅' : '❌');
  console.log('  - Theme consistency:', themeTests.themeConsistencyValid ? '✅' : '❌');
  console.log('  - Hook interfaces:', themeTests.hookInterfacesValid ? '✅' : '❌');
  console.log('  - Theme switching:', themeTests.themeSwitchingValid ? '✅' : '❌');

  // Calculate overall results
  const allTests = [
    // Button tests
    buttonTests.componentExists,
    buttonTests.propsValid,
    buttonTests.variantsCount === 4,
    buttonTests.sizesCount === 3,
    buttonTests.requiredPropsValid,
    
    // Input tests
    inputTests.componentExists,
    inputTests.propsValid,
    inputTests.variantsCount === 3,
    inputTests.sizesCount === 3,
    inputTests.eventHandlerValid,
    inputTests.booleanPropsValid,
    
    // Utils tests
    utilsTests.formatDateExists,
    utilsTests.formatTimeExists,
    utilsTests.isTodayExists,
    utilsTests.isTomorrowExists,
    utilsTests.invalidDateHandled,
    utilsTests.edgeCasesHandled,
    
    // Theme tests
    themeTests.useIsDarkExists,
    themeTests.useThemeColorsExists,
    themeTests.expectedPropertiesCount === 9,
    themeTests.themeConsistencyValid,
    themeTests.hookInterfacesValid,
    themeTests.themeSwitchingValid,
  ];

  const passedTests = allTests.filter(Boolean).length;
  const totalTests = allTests.length;
  const successRate = Math.round((passedTests / totalTests) * 100);

  console.log('\n📊 Test Summary:');
  console.log('=' .repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${successRate}%`);
  
  if (successRate === 100) {
    console.log('🎉 All tests passed!');
  } else if (successRate >= 80) {
    console.log('✅ Most tests passed - Good job!');
  } else {
    console.log('⚠️ Some tests need attention.');
  }

  return {
    total: totalTests,
    passed: passedTests,
    failed: totalTests - passedTests,
    successRate,
  };
};

// Run tests
const testResults = runAllTests();

// Export for external use
export { testResults, runAllTests };
export default runAllTests;