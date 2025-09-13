import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, I18nManager, Platform, Modal } from 'react-native';
// Lazily resolve native picker to avoid bundling errors when the package isn't installed on web
let NativeDateTimePicker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NativeDateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (e) {
  NativeDateTimePicker = null;
}
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../../constants/design';
import { Button } from '../../components/ui';
import { minutesFromReminder, scheduleReminderAt } from '../../utils/notifications';

// Note: RTL is configured globally in i18n init; avoid forcing it per-screen to prevent reload errors

interface ReminderOption {
  id: string;
  label: string;
  value: string;
}

const reminderOptions: ReminderOption[] = [
  { id: '1', label: 'قبل 5د', value: '5min' },
  { id: '2', label: 'قبل يوم', value: '1day' },
  { id: '3', label: 'قبل ساعة', value: '1hour' },
  { id: '4', label: 'قبل 30د', value: '30min' },
  { id: '5', label: 'قبل 10د', value: '10min' },
];

export default function AddTaskScreen({ navigation }: { navigation?: any }) {
  const [taskName, setTaskName] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedReminder, setSelectedReminder] = useState('');
  const [category, setCategory] = useState('');
  
  // Date and Time picker states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const canUseNativePicker = Platform.OS !== 'web' && !!NativeDateTimePicker;

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log('Saving task:', { taskName, taskDetails, selectedDate, selectedTime, selectedReminder, category });
    // Schedule local notification if a reminder was chosen and we have date/time
    try {
      if (selectedDate) {
        const when = new Date(selectedDate);
        if (selectedTime) {
          when.setHours(selectedTime.getHours(), selectedTime.getMinutes(), selectedTime.getSeconds(), 0);
        } else {
          // default to 09:00 AM if time not chosen
          when.setHours(9, 0, 0, 0);
        }
        const offsetMin = minutesFromReminder(selectedReminder);
        if (offsetMin > 0) {
          const triggerAt = new Date(when.getTime() - offsetMin * 60 * 1000);
          scheduleReminderAt(triggerAt, taskName || 'تذكير مهمة', 'حان وقت المهمة');
        }
      }
    } catch {}
    navigation?.goBack();
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation?.goBack();
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setEndDate(date.toLocaleDateString('ar-SA'));
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (time: Date | null) => {
    if (time) {
      setSelectedTime(time);
      setEndTime(time.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
    }
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bgBottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>إضافة مهمة</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: theme.colors.textMuted }]}>
              <Ionicons name="person" size={32} color={theme.colors.bgBottom} />
            </View>
          </View>
        </View>

        {/* Task Name */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>اسم المهمة</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.surfaceBorder,
                color: theme.colors.text
              }
            ]}
            placeholder="اسم المهمة"
            placeholderTextColor={theme.colors.textMuted}
            value={taskName}
            onChangeText={setTaskName}
            textAlign="center"
          />
        </View>

        {/* Task Details */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>تفاصيل المهمة (اختياري)</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.surfaceBorder,
                color: theme.colors.text
              }
            ]}
            placeholder="تفاصيل المهمة"
            placeholderTextColor={theme.colors.textMuted}
            value={taskDetails}
            onChangeText={setTaskDetails}
            multiline
            numberOfLines={4}
            textAlign="center"
            textAlignVertical="top"
          />
        </View>

        {/* Date and Time Section */}
        <View style={styles.dateTimeSection}>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Text style={[styles.label, { color: theme.colors.text }]}>تاريخ انتهاء المهمة</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeInput,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.surfaceBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                      justifyContent: 'center'
                  }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (Platform.OS === 'web' || canUseNativePicker) {
                    setShowDatePicker(true);
                  } else {
                    console.warn('DateTimePicker is not installed. Run: npx expo install @react-native-community/datetimepicker');
                  }
                }}
              >
                <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
                <Text style={[{ color: selectedDate ? theme.colors.text : theme.colors.textMuted, fontSize: 14, fontWeight: '500', textAlign: 'center' }]}>
                  {selectedDate ? formatDate(selectedDate) : 'اختر تاريخ انتهاء المهمة'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.dateTimeItem}>
              <Text style={[styles.label, { color: theme.colors.text }]}>الوقت (اختياري)</Text>
              <TouchableOpacity
                style={[
                  styles.dateTimeInput,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.surfaceBorder,
                    flexDirection: 'row',
                    alignItems: 'center',
                      justifyContent: 'center'
                  }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  if (Platform.OS === 'web' || canUseNativePicker) {
                    setShowTimePicker(true);
                  } else {
                    console.warn('DateTimePicker is not installed. Run: npx expo install @react-native-community/datetimepicker');
                  }
                }}
              >
                <Ionicons name="time-outline" size={20} color={theme.colors.textMuted} />
                <Text style={[{ color: selectedTime ? theme.colors.text : theme.colors.textMuted, fontSize: 14, fontWeight: '500', textAlign: 'center' }]}>
                  {selectedTime ? formatTime(selectedTime) : 'اختر وقت انتهاء المهمة'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Reminder Section */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>تذكيري</Text>
          <View style={styles.reminderGrid}>
            {reminderOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.reminderOption,
                  {
                    backgroundColor: selectedReminder === option.id ? '#8B7CF6' : theme.colors.surface,
                    borderColor: theme.colors.surfaceBorder
                  }
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedReminder(selectedReminder === option.id ? '' : option.id);
                }}
              >
                <Text style={[
                  styles.reminderText,
                  { 
                    color: selectedReminder === option.id ? '#FFFFFF' : theme.colors.text 
                  }
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Section */}
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>التصنيف</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.surfaceBorder,
                color: theme.colors.text
              }
            ]}
            placeholder="التصنيف"
            placeholderTextColor={theme.colors.textMuted}
            value={category}
            onChangeText={setCategory}
            textAlign="center"
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

      {/* Date Picker Modal */}
      {showDatePicker && (
        Platform.OS === 'web' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={[styles.pickerButton, { color: theme.colors.textMuted }]}>إلغاء</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>اختر التاريخ</Text>
                  <TouchableOpacity onPress={() => handleDateChange(selectedDate || new Date())}>
                    <Text style={[styles.pickerButton, { color: theme.colors.primary }]}>تأكيد</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.datePickerWeb}>
                  <input
                    type="date"
                    value={(selectedDate || new Date()).toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    style={{
                      width: '100%',
                      padding: 16,
                      fontSize: 16,
                      borderRadius: 12,
                      border: `1px solid ${theme.colors.surfaceBorder}`,
                      backgroundColor: theme.colors.bgBottom,
                      color: theme.colors.text,
                      direction: 'ltr'
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          canUseNativePicker ? (
          <NativeDateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(e, d) => {
              if (e.type === 'dismissed') { setShowDatePicker(false); return; }
              handleDateChange(d || new Date());
            }}
          />
          ) : null
        )
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        Platform.OS === 'web' ? (
          <Modal
            transparent
            animationType="slide"
            visible={showTimePicker}
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.pickerContainer}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                    <Text style={[styles.pickerButton, { color: theme.colors.textMuted }]}>إلغاء</Text>
                  </TouchableOpacity>
                  <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>اختر الوقت</Text>
                  <TouchableOpacity onPress={() => handleTimeChange(selectedTime || new Date())}>
                    <Text style={[styles.pickerButton, { color: theme.colors.primary }]}>تأكيد</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.datePickerWeb}>
                  <input
                    type="time"
                    step="1"
                    value={(selectedTime || new Date()).toTimeString().slice(0, 8)}
                    onChange={(e) => {
                      const [hours, minutes, seconds] = e.target.value.split(':');
                      const newTime = new Date(selectedTime || new Date());
                      newTime.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || '0'));
                      setSelectedTime(newTime);
                    }}
                    style={{
                      width: '100%',
                      padding: 16,
                      fontSize: 16,
                      borderRadius: 12,
                      border: `1px solid ${theme.colors.surfaceBorder}`,
                      backgroundColor: theme.colors.bgBottom,
                      color: theme.colors.text,
                      direction: 'ltr'
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        ) : (
          canUseNativePicker ? (
          <NativeDateTimePicker
            value={selectedTime || new Date()}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, d) => {
              if (e.type === 'dismissed') { setShowTimePicker(false); return; }
              handleTimeChange(d || new Date());
            }}
          />
          ) : null
        )
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // حاوية الشاشة
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(3),
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  headerRight: {
    width: 40,
  },
  // محتوى الشاشة
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing(3),
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    paddingBottom: theme.spacing(6),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing(4),
  },
  profileImageContainer: {
    marginBottom: theme.spacing(2),
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.card,
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing(1.5),
    textAlign: 'left',
    letterSpacing: theme.typography.letterSpacing.normal,
  },
  // حقل/زر ممتد
  input: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: theme.spacing(2.5),
    paddingVertical: theme.spacing(2.25),
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: theme.spacing(2.5),
    paddingVertical: theme.spacing(2.25),
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    minHeight: 120,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateTimeSection: {
    marginBottom: theme.spacing(3),
  },
  // صف التاريخ والوقت
  dateTimeRow: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing(2),
  },
  dateTimeItem: {
    flex: 1,
    alignSelf: 'stretch',
  },
  dateTimeInput: {
    width: '100%',
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.75),
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    ...theme.shadow.card,
  },
  // صف التذكيرات
  reminderGrid: {
    width: '100%',
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(1.5),
    justifyContent: 'center',
    rowGap: theme.spacing(1.5),
    columnGap: theme.spacing(1.5),
  },
  reminderOption: {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1),
    minWidth: '18%',
    alignItems: 'center',
    ...theme.shadow.card,
  },
  reminderText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing(3),
    paddingBottom: theme.spacing(4),
    paddingTop: theme.spacing(2),
  },
  // زر ممتد
  addButton: {
    width: '100%',
    alignSelf: 'stretch',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing(2.5),
    backgroundColor: theme.colors.primary,
    ...theme.shadow.button,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingBottom: theme.spacing(4.25),
    backgroundColor: theme.colors.surface,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing(2.5),
    paddingVertical: theme.spacing(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  pickerButton: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  pickerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  datePickerWeb: {
    padding: theme.spacing(2.5),
  },
});
