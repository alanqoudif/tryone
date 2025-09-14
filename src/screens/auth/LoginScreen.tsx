import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, I18nManager, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, Input } from '../../components/ui';
import { theme } from '../../constants/design';

// Firebase
import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// تفعيل دعم اللغة العربية واتجاه RTL
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
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من حالة المصادقة عند تحميل الشاشة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('المستخدم مسجل الدخول بالفعل:', user.uid);
      } else {
        console.log('لا يوجد مستخدم مسجل الدخول');
      }
    });
    return () => unsubscribe();
  }, []);

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
      setIsLoading(true);

      try {
        if (isLogin) {
          // تسجيل الدخول
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log('تم تسجيل الدخول بنجاح:', userCredential.user.uid);

          // تحديث آخر تسجيل دخول في Firestore
          await setDoc(doc(firestore, 'users', userCredential.user.uid), {
            lastLogin: new Date(),
          }, { merge: true });

          Alert.alert('نجاح', 'تم تسجيل الدخول بنجاح!', [
            { text: 'موافق', onPress: () => onDone && onDone() }
          ]);
        } else {
          // إنشاء حساب جديد
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const uid = userCredential.user.uid;
          console.log('تم إنشاء الحساب بنجاح:', uid);

          // إضافة المستخدم إلى Firestore
          await setDoc(doc(firestore, 'users', uid), {
            email,
            displayName: email.split('@')[0],
            createdAt: new Date(),
            lastLogin: new Date(),
            isNewUser: true,
          });

          Alert.alert('نجاح', 'تم إنشاء الحساب وحفظ البيانات بنجاح!', [
            { text: 'موافق', onPress: () => onDone && onDone() }
          ]);
        }
      } catch (error: any) {
        console.error('خطأ في المصادقة:', error);
        let errorMessage = 'حدث خطأ أثناء العملية';

        if (error.code === 'auth/email-already-in-use') errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
        else if (error.code === 'auth/invalid-email') errorMessage = 'البريد الإلكتروني غير صالح';
        else if (error.code === 'auth/user-not-found') errorMessage = 'لم يتم العثور على المستخدم';
        else if (error.code === 'auth/wrong-password') errorMessage = 'كلمة المرور غير صحيحة';
        else if (error.code === 'auth/network-request-failed') errorMessage = 'فشل الاتصال بالشبكة';

        Alert.alert('خطأ', errorMessage);
      } finally {
        setIsLoading(false);
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

  const navigateToWelcome = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onNavigateToWelcome && onNavigateToWelcome();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>جاري المعالجة...</Text>
          </View>
        ) : (
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
              disabled={isLoading}
              loading={isLoading}
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
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Arial Hebrew' : 'Droid Arabic Naskh',
    textAlign: 'center',
  },
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
  toggleText: { color: theme.colors.primary, fontSize: 16, textAlign: 'center', textDecorationLine: 'underline' },
  skipContainer: { padding: 10 },
  skipText: { color: theme.colors.textMuted, fontSize: 14, textAlign: 'center' },
});
