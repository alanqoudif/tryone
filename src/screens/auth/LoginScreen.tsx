import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, GhostButton, GlassCard, Input } from '../../components/ui';
import { theme } from '../../constants/design';
import storage from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

// تأكد من تفعيل دعم اللغة العربية (RTL)
I18nManager.forceRTL(true);

interface LoginScreenProps {
  onDone?: () => void;
  onNavigateToWelcome?: () => void;
}

export default function LoginScreen({ onDone, onNavigateToWelcome }: LoginScreenProps) {
  // استخدام مكتبة الترجمة
  const { t } = useTranslation();
  // حالة تبديل بين تسجيل الدخول وإنشاء حساب
  const [isLogin, setIsLogin] = useState(true);
  // بيانات المستخدم
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // رسائل الخطأ
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // التحقق من صحة البريد الإلكتروني
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError(t('auth.emailRequired'));
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError(t('auth.emailInvalid'));
      return false;
    }
    setEmailError('');
    return true;
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = (password: string) => {
    if (!password.trim()) {
      setPasswordError(t('auth.passwordRequired'));
      return false;
    } else if (password.length < 6) {
      setPasswordError(t('auth.passwordTooShort'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  // التحقق من تطابق كلمة المرور
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!isLogin) {
      if (!confirmPassword.trim()) {
        setConfirmPasswordError(t('auth.confirmPasswordRequired'));
        return false;
      } else if (confirmPassword !== password) {
        setConfirmPasswordError(t('auth.passwordsNotMatch'));
        return false;
      }
      setConfirmPasswordError('');
    }
    return true;
  };

  // معالجة تقديم النموذج
  const handleSubmit = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isEmailValid && isPasswordValid && (isLogin || isConfirmPasswordValid)) {
      // تأثير اهتزاز عند الضغط
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // في الواقع، هنا ستقوم بإرسال طلب إلى الخادم للتسجيل أو تسجيل الدخول
      // لكن في هذا المثال سنقوم بتخزين البيانات محليًا
      try {
        storage.set(
          STORAGE_KEYS.USER,
          JSON.stringify({ email })
        );
        storage.set(
          STORAGE_KEYS.AUTH_TOKEN,
          'dummy_token_' + Date.now()
        );
      } catch {}
      
      onDone && onDone();
    }
  };

  // تبديل بين وضع تسجيل الدخول وإنشاء حساب
  const toggleAuthMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    // إعادة تعيين الأخطاء عند التبديل
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  // الانتقال إلى شاشة الترحيب
  const navigateToWelcome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNavigateToWelcome && onNavigateToWelcome();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* عنوان الصفحة */}
          <View style={styles.headerSection}>
            <Text style={[styles.headerTitle, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
              {isLogin ? t('auth.login') : t('auth.signup')}
            </Text>
            <Text style={[styles.headerSubtitle, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
              {isLogin 
                ? t('auth.loginWelcome') 
                : t('auth.signupWelcome')}
            </Text>
          </View>

          {/* نموذج تسجيل الدخول / إنشاء حساب */}
          <View style={styles.formSection}>
            <Input
              label={t('auth.email')}
              placeholder={t('auth.email')}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={emailError}
              containerStyle={styles.inputContainer}
              textAlign="right"
              textContentType="emailAddress"
            />

            <Input
              label={t('auth.password')}
              placeholder={t('auth.password')}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              containerStyle={styles.inputContainer}
              textAlign="right"
              textContentType="password"
            />

            {!isLogin && (
              <Input
                label={t('auth.confirmPassword')}
                placeholder={t('auth.confirmPassword')}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
                containerStyle={styles.inputContainer}
                textAlign="right"
                textContentType="password"
              />
            )}
          </View>

          {/* أزرار الإجراءات */}
          <View style={styles.actionsSection}>
            <PrimaryButton
              title={isLogin ? t('auth.login') : t('auth.signup')}
              onPress={handleSubmit}
              style={styles.submitButton}
              fullWidth
            />

            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleContainer}>
              <Text style={[styles.toggleText, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
                {isLogin 
                  ? t('auth.noAccount') 
                  : t('auth.haveAccount')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={navigateToWelcome} style={styles.skipContainer}>
              <Text style={[styles.skipText, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
                {t('auth.guestLogin')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// أنماط الصفحة
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    // تعديل الاتجاه ليناسب اللغة العربية
    direction: 'rtl',
  },
  headerSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textLight,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
    // تعديل الاتجاه ليناسب اللغة العربية
    textAlign: 'right',
  },
  actionsSection: {
    alignItems: 'center',
  },
  submitButton: {
    marginBottom: 20,
  },
  toggleContainer: {
    marginBottom: 20,
    padding: 10,
  },
  toggleText: {
    color: theme.colors.primary,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  skipContainer: {
    padding: 10,
  },
  skipText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
});