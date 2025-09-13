import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { HelpAdapter } from '../adapters/HelpAdapter';

type Priority = 'low' | 'medium' | 'high';
type ContactMethod = 'email' | 'whatsapp' | 'phone';

const ContactSupportScreen: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium' as Priority,
  });
  const [selectedMethod, setSelectedMethod] = useState<ContactMethod>('email');
  const [loading, setLoading] = useState(false);

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: t('contactSupport.lowPriority'), color: '#34C759' },
    { value: 'medium', label: t('contactSupport.mediumPriority'), color: '#FF9500' },
    { value: 'high', label: t('contactSupport.highPriority'), color: '#FF3B30' },
  ];

  const contactMethods: { value: ContactMethod; label: string; icon: string; description: string }[] = [
    {
      value: 'email',
      label: t('contactSupport.email'),
      icon: 'mail-outline',
      description: t('contactSupport.emailDesc'),
    },
    {
      value: 'whatsapp',
      label: t('contactSupport.whatsapp'),
      icon: 'logo-whatsapp',
      description: t('contactSupport.whatsappDesc'),
    },
    {
      value: 'phone',
      label: t('contactSupport.phone'),
      icon: 'call-outline',
      description: t('contactSupport.phoneDesc'),
    },
  ];

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      Alert.alert(t('common.error'), t('contactSupport.nameRequired'));
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert(t('common.error'), t('contactSupport.emailRequired'));
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert(t('common.error'), t('contactSupport.emailInvalid'));
      return false;
    }
    if (!formData.subject.trim()) {
      Alert.alert(t('common.error'), t('contactSupport.subjectRequired'));
      return false;
    }
    if (!formData.message.trim()) {
      Alert.alert(t('common.error'), t('contactSupport.messageRequired'));
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await HelpAdapter.submitContactRequest({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
      });

      Alert.alert(
        t('contactSupport.success'),
        t('contactSupport.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('contactSupport.submitError'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickContact = (method: ContactMethod) => {
    switch (method) {
      case 'email':
        Alert.alert(t('contactSupport.email'), 'support@tryone.com');
        break;
      case 'whatsapp':
        Alert.alert(t('contactSupport.whatsapp'), '+966 50 123 4567');
        break;
      case 'phone':
        Alert.alert(t('contactSupport.phone'), '+966 11 123 4567');
        break;
    }
  };

  const renderContactMethods = () => (
    <View style={styles.contactMethodsContainer}>
      <Text style={styles.sectionTitle}>{t('contactSupport.quickContact')}</Text>
      {contactMethods.map((method) => (
        <TouchableOpacity
          key={method.value}
          style={[
            styles.contactMethodItem,
            selectedMethod === method.value && styles.selectedContactMethod,
          ]}
          onPress={() => handleQuickContact(method.value)}
        >
          <View style={styles.contactMethodIcon}>
            <Ionicons name={method.icon as any} size={24} color="#007AFF" />
          </View>
          <View style={styles.contactMethodInfo}>
            <Text style={styles.contactMethodLabel}>{method.label}</Text>
            <Text style={styles.contactMethodDescription}>{method.description}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContactForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.sectionTitle}>{t('contactSupport.sendMessage')}</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('contactSupport.name')}</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder={t('contactSupport.namePlaceholder')}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('contactSupport.email')}</Text>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder={t('contactSupport.emailPlaceholder')}
          placeholderTextColor="#666"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('contactSupport.subject')}</Text>
        <TextInput
          style={styles.textInput}
          value={formData.subject}
          onChangeText={(text) => setFormData({ ...formData, subject: text })}
          placeholder={t('contactSupport.subjectPlaceholder')}
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('contactSupport.priority')}</Text>
        <View style={styles.priorityContainer}>
          {priorityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.priorityOption,
                formData.priority === option.value && {
                  backgroundColor: option.color,
                  borderColor: option.color,
                },
              ]}
              onPress={() => setFormData({ ...formData, priority: option.value })}
            >
              <Text
                style={[
                  styles.priorityText,
                  formData.priority === option.value && styles.priorityTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{t('contactSupport.message')}</Text>
        <TextInput
          style={[styles.textInput, styles.messageInput]}
          value={formData.message}
          onChangeText={(text) => setFormData({ ...formData, message: text })}
          placeholder={t('contactSupport.messagePlaceholder')}
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? t('common.loading') : t('contactSupport.submit')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('contactSupport.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderContactMethods()}
          {renderContactForm()}
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contactMethodsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  contactMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedContactMethod: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  contactMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 12,
  },
  contactMethodInfo: {
    flex: 1,
  },
  contactMethodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  contactMethodDescription: {
    fontSize: 14,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  messageInput: {
    height: 100,
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  priorityTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ContactSupportScreen;