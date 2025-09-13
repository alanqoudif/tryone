import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PrimaryButton, GhostButton, GlassCard } from '../../components/ui';
import { theme } from '../../constants/design';
import storage from '../../utils/storage';
import { STORAGE_KEYS } from '../../constants';

interface WelcomeScreenProps {
  onDone?: () => void;
}

export default function WelcomeScreen({ onDone }: WelcomeScreenProps) {
  const [name, setName] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);

  const handleSave = () => {
    if (name.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        storage.set(
          STORAGE_KEYS.USER,
          JSON.stringify({ name: name.trim() })
        );
      } catch {}
      onDone && onDone();
    }
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onDone && onDone();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>
              يا اهلاً وسهلاً نورتنا يا
            </Text>
            <View style={styles.nameContainer}>
              <Text style={styles.welcomeTitle}>فيصل</Text>
              <Text style={styles.waveEmoji}>👋</Text>
            </View>
            <Text style={styles.welcomeSubtitle}>
              عرفنا عليك عشان نناديك باسمك
            </Text>
            <Text style={styles.partyEmoji}>🥳</Text>
          </View>

          {/* Name Input Card */}
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.nameInput}
              placeholder="اكتب اسمك هنا"
              placeholderTextColor={theme.colors.textMuted}
              value={name}
              onChangeText={setName}
              textAlign="center"
              onFocus={() => setShowKeyboard(true)}
              onBlur={() => setShowKeyboard(false)}
            />
          </GlassCard>

          {/* Action Buttons */}
          <View style={styles.buttonsSection}>
            <GhostButton
              title="تخطي"
              onPress={handleSkip}
              style={styles.skipButton}
            />

            <PrimaryButton
              title="حفظ"
              onPress={handleSave}
              style={styles.saveButton}
              disabled={!name.trim()}
            />
          </View>
        </View>

        {/* Keyboard Suggestions */}
        {showKeyboard && (
          <View style={styles.keyboardSuggestions}>
            <View style={styles.suggestionsRow}>
              <GhostButton
                title="فيصلحه"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setName('فيصلحه');
                }}
                size="sm"
                style={styles.suggestionButton}
              />
              <GhostButton
                title="فيصلج"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setName('فيصلج');
                }}
                size="sm"
                style={styles.suggestionButton}
              />
              <GhostButton
                title='"فيصل"'
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setName('"فيصل"');
                }}
                size="sm"
                style={styles.suggestionButton}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing(3.5),
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing(7),
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing(1.5),
  },
  waveEmoji: {
    fontSize: 28,
    marginStart: theme.spacing(1.5),
  },
  welcomeSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textDim,
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1.5),
    lineHeight: 24,
    letterSpacing: theme.typography.letterSpacing.normal,
  },
  partyEmoji: {
    fontSize: 28,
    marginTop: theme.spacing(1.5),
  },
  inputCard: {
    marginBottom: theme.spacing(5),
  },
  nameInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2.5),
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  buttonsSection: {
    flexDirection: 'row',
    gap: theme.spacing(2),
  },
  skipButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
  keyboardSuggestions: {
    paddingHorizontal: theme.spacing(3.5),
    paddingBottom: theme.spacing(3.5),
  },
  suggestionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing(2),
  },
  suggestionButton: {
    flex: 1,
  },
});
