import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '../../hooks/useTheme';
import { Button } from '../../components/ui';
import { DESIGN_TOKENS, createShadow, createTypography } from '../../constants';

// Enable RTL layout
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

interface ColorOption {
  id: string;
  color: string;
  name: string;
}

const colorOptions: ColorOption[] = [
  { id: '1', color: '#8B7CF6', name: 'بنفسجي' },
  { id: '2', color: '#F59E0B', name: 'برتقالي' },
  { id: '3', color: '#10B981', name: 'أخضر فاتح' },
  { id: '4', color: '#06B6D4', name: 'أزرق فاتح' },
  { id: '5', color: '#3B82F6', name: 'أزرق' },
];

export default function AddNoteScreen({ navigation }: { navigation?: any }) {
  const colors = useThemeColors();
  const [selectedColor, setSelectedColor] = useState(colorOptions[2].id); // Default to green
  const [category, setCategory] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Saving note:', { selectedColor, category, noteContent });
    navigation?.goBack();
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, I18nManager.isRTL ? styles.headerRTL : undefined]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons 
            name={I18nManager.isRTL ? 'chevron-forward' : 'chevron-back'} 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>إضافة ملاحظة</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Color Selection */}
        <View style={styles.colorSection}>
          <View style={styles.colorRow}>
            {colorOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.colorOption,
                  { backgroundColor: option.color },
                  selectedColor === option.id && styles.selectedColor
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedColor(option.id);
                }}
              />
            ))}
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#8B7CF6' }]}>التصنيف</Text>
          <TextInput
            style={[
              styles.categoryInput,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text
              }
            ]}
            placeholder="التصنيف"
            placeholderTextColor={colors.muted}
            value={category}
            onChangeText={setCategory}
            textAlign="left"
          />
        </View>

        {/* Note Content Section */}
        <View style={styles.section}>
          <TextInput
            style={[
              styles.noteInput,
              { 
                backgroundColor: selectedColor ? colorOptions.find(c => c.id === selectedColor)?.color || colors.card : colors.card,
                borderColor: colors.border,
                color: '#FFFFFF'
              }
            ]}
            placeholder="اكتب الملاحظة"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
            numberOfLines={12}
            textAlign="left"
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="إضافة"
          onPress={handleSave}
          variant="primary"
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  colorSection: {
    marginBottom: 36,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.3,
    color: '#8B7CF6',
  },
  categoryInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 17,
    fontWeight: '500',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'right',
    letterSpacing: 0.2,
  },
  noteInput: {
    borderWidth: 0,
    borderRadius: 15,
    paddingHorizontal: 24,
    paddingVertical: 24,
    fontSize: 16,
    fontWeight: '500',
    minHeight: 220,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  addButton: {
    borderRadius: 15,
    paddingVertical: 20,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
