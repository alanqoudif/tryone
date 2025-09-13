import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { MMKV } from 'react-native-mmkv';

interface LanguageSettingsScreenProps {
  navigation: any;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LanguageSettingsScreen: React.FC<LanguageSettingsScreenProps> = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const languages: Language[] = [
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
    },
  ];

  const changeLanguage = async (languageCode: string) => {
    try {
      const storage = new MMKV();
      await i18n.changeLanguage(languageCode);
      storage.set('userLanguage', languageCode);
      setCurrentLanguage(languageCode);
      
      Alert.alert(
        t('languageSettings.success'),
        t('languageSettings.languageChanged'),
        [
          {
            text: t('common.ok'),
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('languageSettings.changeError'));
    }
  };

  const renderLanguageOption = (language: Language) => {
    const isSelected = currentLanguage === language.code;

    return (
      <TouchableOpacity
        key={language.code}
        style={[styles.languageOption, isSelected && styles.selectedOption]}
        onPress={() => changeLanguage(language.code)}
      >
        <View style={styles.languageInfo}>
          <Text style={styles.flag}>{language.flag}</Text>
          <View style={styles.languageText}>
            <Text style={[styles.languageName, isSelected && styles.selectedText]}>
              {language.nativeName}
            </Text>
            <Text style={[styles.languageSubname, isSelected && styles.selectedSubtext]}>
              {language.name}
            </Text>
          </View>
        </View>
        
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('languageSettings.title')}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>{t('languageSettings.subtitle')}</Text>
        
        <View style={styles.languagesList}>
          {languages.map(renderLanguageOption)}
        </View>
        
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{t('languageSettings.restartInfo')}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginEnd: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  languagesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 24,
    marginEnd: 12,
  },
  languageText: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  languageSubname: {
    fontSize: 14,
    color: '#666',
  },
  selectedSubtext: {
    color: '#007AFF',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginStart: 8,
    flex: 1,
    lineHeight: 20,
  },
});

export default LanguageSettingsScreen;