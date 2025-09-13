import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, I18nManager, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import * as Haptics from 'expo-haptics';
import { GlassCard, PrimaryButton, GhostButton, FadeInView, StaggeredList } from '../../components/ui';
import { theme } from '../../constants/design';

interface Task {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  completed: boolean;
  duration: number; // in minutes
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task',
    category: 'Category',
    date: '29/02/24',
    time: '09:54',
    completed: false,
    duration: 0
  }
];

const weekDays = ['أحد', 'اثن', 'ثل', 'أرب', 'خم', 'جم', 'سب'];
const currentDayIndex = dayjs().day();

export default function TasksScreen({ navigation }: { navigation?: any }) {
  const colors = theme.colors;
  const [selectedView, setSelectedView] = useState('week');
  const [tasks, setTasks] = useState(mockTasks);
  const [picker, setPicker] = useState<{ visible: boolean; mode: 'date' | 'time'; taskId?: string; tempDate?: Date; baseDate?: Date }>({ visible: false, mode: 'date' });

  const toggleTask = (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to AddTaskScreen when navigation is available
    if (navigation) {
      navigation.navigate('AddTask');
    } else {
      // If no navigation, add a simple task for testing
      const newTask: Task = {
        id: Date.now().toString(),
        title: 'مهمة جديدة',
        category: 'عام',
        date: dayjs().format('DD/MM/YY'),
        time: dayjs().format('HH:mm'),
        completed: false,
        duration: 30
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleTaskLongPress = (task: Task) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'خيارات المهمة',
      `ماذا تريد أن تفعل مع "${task.title}"؟`,
      [
        {
          text: 'تعديل',
          onPress: () => {
            // TODO: Navigate to edit task screen
            console.log('Edit task:', task.id);
          },
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => handleDeleteTask(task.id),
        },
        {
          text: 'إلغاء',
          style: 'cancel',
        },
      ]
    );
  };

  // Date/Time precise picker for task end time
  const openDateTimePicker = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    // Try to parse existing strings; fallback to now
    let baseDate = new Date();
    try {
      baseDate = dayjs(`${task?.date} ${task?.time}`, 'DD/MM/YY HH:mm').toDate();
    } catch {}
    setPicker({ visible: true, mode: 'date', taskId, baseDate });
  };

  const onChangePicker = (event: any, selected?: Date) => {
    if (event.type === 'dismissed') {
      setPicker({ visible: false, mode: 'date' });
      return;
    }
    if (picker.mode === 'date') {
      const chosen = selected || picker.baseDate || new Date();
      setPicker(prev => ({ ...prev, mode: 'time', tempDate: chosen }));
    } else {
      const timeSel = selected || new Date();
      const date = picker.tempDate || new Date();
      date.setHours(timeSel.getHours(), timeSel.getMinutes(), 0, 0);
      if (picker.taskId) {
        setTasks(prev => prev.map(t => (
          t.id === picker.taskId
            ? { ...t, date: dayjs(date).format('DD/MM/YY'), time: dayjs(date).format('HH:mm') }
            : t
        )));
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPicker({ visible: false, mode: 'date' });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>مهامي</Text>
            <Text style={styles.headerDate}>
              {dayjs().locale('ar').format('D MMMM')}
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        {/* Day Selector */}
        <View style={styles.daySelector}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayScrollContent}
          >
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCard,
                  index === currentDayIndex && styles.selectedDayCard
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedView(day);
                }}
              >
                <Text style={[
                  styles.dayName,
                  index === currentDayIndex && styles.selectedDayName
                ]}>
                  {day}
                </Text>
                <Text style={[
                  styles.dayNumber,
                  index === currentDayIndex && styles.selectedDayNumber
                ]}>
                  {dayjs().startOf('week').add(index, 'day').format('D')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>مكتملة</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color={theme.colors.warning} />
            </View>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>معلقة</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
            </View>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>إنجاز</Text>
          </View>
        </View>

        {/* Tasks Section */}
        <View style={styles.tasksSection}>
          <View style={styles.tasksHeader}>
            <Text style={styles.tasksTitle}>مهامي اليوم</Text>
            <TouchableOpacity onPress={handleAddTask}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="clipboard-outline" size={48} color={theme.colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>لا توجد مهام بعد</Text>
              <Text style={styles.emptySubtitle}>اضغط على الزر أدناه لإضافة مهمة جديدة</Text>
            </View>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => toggleTask(task.id)}
                onLongPress={() => handleTaskLongPress(task)}
                delayLongPress={500}
              >
                <View style={styles.taskLeft}>
                  <View style={[
                    styles.taskPriority,
                    { backgroundColor: task.completed ? theme.colors.success : theme.colors.primary }
                  ]} />
                  <View style={styles.taskContent}>
                    <Text style={[
                      styles.taskTitle,
                      task.completed && styles.completedTaskTitle
                    ]}>
                      {task.title}
                    </Text>
                    <Text style={styles.taskCategory}>{task.category}</Text>
                    <View style={styles.taskMeta}>
                      <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
                      <Text style={styles.taskTime}>{task.time}</Text>
                      <Ionicons name="calendar-outline" size={14} color={theme.colors.textMuted} />
                      <Text style={styles.taskDate}>{task.date}</Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.taskCheckbox}>
                  <Ionicons 
                    name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
                    size={24} 
                    color={task.completed ? theme.colors.success : theme.colors.textMuted} 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddTask}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.wide,
    textAlign: 'center',
  },
  headerDate: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
  daySelector: {
    marginTop: 16,
  },
  dayScrollContent: {
    paddingHorizontal: 8,
  },
  dayCard: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginHorizontal: 8,
    borderRadius: 16,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    minWidth: 60,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDayCard: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  dayName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  selectedDayName: {
    color: theme.colors.textLight,
  },
  dayNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  selectedDayNumber: {
    color: theme.colors.textLight,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  tasksSection: {
    marginBottom: 32,
  },
  tasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  tasksTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyState: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskPriority: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginEnd: 24,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  taskCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  taskTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  taskDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  taskCheckbox: {
    padding: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    end: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  durationBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
});
