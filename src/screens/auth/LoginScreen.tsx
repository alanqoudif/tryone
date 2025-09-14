import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, I18nManager, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, Input } from '../../components/ui';
import { theme } from '../../constants/design';

// Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'; // تأكد من مسار ملف تهيئة Firebase

// تأكد من تفعيل دعم اللغة العربية (RTL)
I18nManager.forceRTL(true);

interface LoginScreenProps {
  onDone?: () => void;
  onNavigateToWelcome?: () => void;
}

export default function LoginScreen({ onDone, onNavigateToWelcome }: LoginScreenProps) {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const auth = getAuth(app);
  const firestore = getFirestore(app);

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

  const handleSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isEmailValid && isPasswordValid && (isLogin || isConfirmPasswordValid)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        if (isLogin) {
          // تسجيل الدخول
          await signInWithEmailAndPassword(auth, email, password);
          Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح!');
        } else {
          // إنشاء حساب جديد
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const uid = userCredential.user.uid;

          // إضافة المستخدم إلى Firestore
          await setDoc(doc(firestore, 'users', uid), {
            email,
            createdAt: new Date(),
          });

          Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح!');
        }

        onDone && onDone();
      } catch (error: any) {
        console.error(error);
        Alert.alert('خطأ', error.message || 'حدث خطأ أثناء العملية');
      }
    }
  };

  const toggleAuthMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

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
          <View style={styles.headerSection}>
            <Text style={[styles.headerTitle, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
              {isLogin ? t('auth.login') : t('auth.signup')}
            </Text>
            <Text style={[styles.headerSubtitle, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
              {isLogin ? t('auth.loginWelcome') : t('auth.signupWelcome')}
            </Text>
          </View>

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
              />
            )}
          </View>

          <View style={styles.actionsSection}>
            <PrimaryButton
              title={isLogin ? t('auth.login') : t('auth.signup')}
              onPress={handleSubmit}
              style={styles.submitButton}
              fullWidth
            />

            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleContainer}>
              <Text style={[styles.toggleText, { fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh' }]}>
                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  keyboardContainer: { flex: 1 },
  content: { flex: 1, padding: 20, justifyContent: 'center', direction: 'rtl' },
  headerSection: { marginBottom: 30, alignItems: 'center' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: theme.colors.textLight, marginBottom: 10, textAlign: 'center' },
  headerSubtitle: { fontSize: 16, color: theme.colors.textMuted, textAlign: 'center' },
  formSection: { marginBottom: 30 },
  inputContainer: { marginBottom: 16, textAlign: 'right' },
  actionsSection: { alignItems: 'center' },
  submitButton: { marginBottom: 20 },
  toggleContainer: { marginBottom: 20, padding: 10 },
  toggleText: { color: theme.colors.primary, fontSize: 16, textAlign: 'center' },
  skipContainer: { padding: 10 },
  skipText: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center' },
});
