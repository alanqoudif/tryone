import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { GlassCard, PrimaryButton, GhostButton, ProgressRing, FadeInView, StaggeredList } from '../../components/ui';
import { theme } from '../../constants/design';
// Actions now handled globally from Tab bar

// Quick actions moved to global Tab bar

interface HomeProps {
  navigation?: { navigate: (tab: string) => void };
}

// Mock data for development
const mockTasks = [
  {
    id: '1',
    title: 'واجب الرياضيات',
    category: 'دراسة',
    dueTime: '9:00 م',
    priority: 'high',
    estimatedMinutes: 45,
    completed: false
  },
  {
    id: '2', 
    title: 'ملخص فصل 3',
    category: 'قراءة',
    dueTime: '7:00 م',
    priority: 'medium',
    estimatedMinutes: 30,
    completed: false
  },
  {
    id: '3',
    title: 'تمرين 5 أسئلة',
    category: 'تمارين',
    dueTime: '8:00 م', 
    priority: 'medium',
    estimatedMinutes: 25,
    completed: false
  }
];

export default function HomeScreen({ navigation }: HomeProps) {
  const [showActions, setShowActions] = React.useState(false);
  const [userName, setUserName] = React.useState('فيصل');
  const [dailyGoalMinutes] = React.useState(60);
  const [completedMinutesToday] = React.useState(25);
  const [focusStreak] = React.useState(3);
  const [tasks] = React.useState(mockTasks);
  
  React.useEffect(() => {
    try {
      const storage = require('../../utils/storage').default;
      const { STORAGE_KEYS } = require('../../constants');
      const raw = storage.getString(STORAGE_KEYS.USER);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.name) setUserName(parsed.name);
      }
    } catch {}
  }, []);

  const handleQuickAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowActions(true);
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `صباح الخير يا ${userName} 🌅`;
    if (hour < 17) return `مساء الخير يا ${userName} ☀️`;
    return `مساء الخير يا ${userName} 🌙`;
  };

  const getNextBestTask = () => {
    const incompleteTasks = tasks.filter(task => !task.completed);
    if (incompleteTasks.length === 0) return null;
    
    // Sort by priority and due time
    return incompleteTasks.sort((a, b) => {
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      return a.dueTime.localeCompare(b.dueTime);
    })[0];
  };

  const handleStartPomodoro = (task?: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Navigate to pomodoro with task context
    navigation?.navigate('Pomodoro');
  };

  const nextTask = getNextBestTask();
  const progressPercentage = Math.min((completedMinutesToday / dailyGoalMinutes) * 100, 100);

  const { width } = Dimensions.get('window');
  const H_PADDING = theme.spacing(2);
  const GAP = theme.spacing(2);
  const cardW = (width - (H_PADDING * 2) - GAP) / 2;

  return (
    <SafeAreaView style={styles.container}>
      {/* Smart Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitial}>ف</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.greeting}>{getTimeBasedGreeting()}</Text>
            <Text style={styles.subGreeting}>نبدأ بجلسة 25 دقيقة؟</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.quickAddButton}
            onPress={handleQuickAdd}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Progress Cards */}
        <FadeInView delay={200} style={[styles.statsContainer, { paddingStart: H_PADDING, paddingEnd: H_PADDING }]}>
          <StaggeredList delay={300} direction="up">
            <View style={[styles.statsRow, { columnGap: GAP, rowGap: GAP }]}>
              {/* Daily Goal Progress */}
              <GlassCard style={[styles.statCard, { width: cardW }]}>
                <View style={styles.progressRingContainer}>
                  <ProgressRing 
                    size={60} 
                    strokeWidth={4} 
                    progress={progressPercentage}
                    showPercentage={false}
                    animated={true}
                  >
                    <View style={styles.progressText}>
                      <Text style={styles.progressNumber}>{dailyGoalMinutes}</Text>
                      <Text style={styles.progressUnit}>د</Text>
                    </View>
                  </ProgressRing>
                </View>
                <Text style={styles.statTitle}>هدف اليوم</Text>
                <Text style={styles.statSubtitle}>باقي {dailyGoalMinutes - completedMinutesToday} دقيقة</Text>
              </GlassCard>

              {/* Today's Focus Time */}
              <GlassCard style={[styles.statCard, { width: cardW }]}>
                <View style={styles.statIcon}>
                  <Text style={styles.focusTimeNumber}>{completedMinutesToday}</Text>
                </View>
                <Text style={styles.statTitle}>وقت التركيز اليوم</Text>
                <Text style={styles.statSubtitle}>دقيقة</Text>
              </GlassCard>
            </View>
          </StaggeredList>
        </FadeInView>

        {/* Next Best Task */}
        {nextTask && (
          <FadeInView delay={400} style={[styles.nextTaskContainer, { paddingStart: H_PADDING, paddingEnd: H_PADDING }]}>
            <GlassCard style={styles.nextTaskCard}>
              <View style={styles.nextTaskHeader}>
                <Text style={styles.nextTaskTitle}>{nextTask.title}</Text>
                <Text style={styles.nextTaskReason}>📌 أقرب موعد تسليم اليوم {nextTask.dueTime}</Text>
              </View>
              <PrimaryButton
                title="ابدأ ⏱️ 25:00"
                onPress={() => handleStartPomodoro(nextTask)}
                icon={<Ionicons name="play" size={20} color="#FFFFFF" />}
                style={styles.startButton}
              />
            </GlassCard>
          </FadeInView>
        )}

        {/* Today's Top 3 Tasks */}
        <FadeInView delay={500} style={[styles.todayTasksContainer, { paddingStart: H_PADDING, paddingEnd: H_PADDING }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>مهامي اليوم</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Tasks')}>
              <Text style={styles.viewAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <StaggeredList delay={600} direction="up">
            {tasks.slice(0, 3).map((task, index) => (
              <GlassCard key={task.id} style={styles.taskItem}>
                <TouchableOpacity style={styles.taskCheckbox}>
                  <Ionicons name="ellipse-outline" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>⏰ {task.dueTime}</Text>
                </View>
              </GlassCard>
            ))}
          </StaggeredList>
        </FadeInView>

        {/* Motivation Streak */}
        <FadeInView delay={700} style={[styles.motivationContainer, { paddingStart: H_PADDING, paddingEnd: H_PADDING }]}>
          <GlassCard style={styles.motivationCard}>
            <Text style={styles.motivationText}>🔥 سلسلة تركيز: {focusStreak} أيام — استمر!</Text>
          </GlassCard>
        </FadeInView>

        {/* Quick Note Section */}
        <FadeInView delay={800} style={[styles.quickNoteContainer, { paddingStart: H_PADDING, paddingEnd: H_PADDING }]}>
          <TouchableOpacity 
            style={styles.quickNoteCard}
            onPress={() => navigation?.navigate('AddNote')}
          >
            <GlassCard style={styles.quickNoteCardInner}>
              <Ionicons name="create-outline" size={20} color={theme.colors.textMuted} style={{ marginEnd: 12 }} />
              <Text style={styles.quickNoteText}>+ ملاحظة سريعة</Text>
            </GlassCard>
          </TouchableOpacity>
        </FadeInView>

      </ScrollView>

      {/* Quick Actions Bottom Sheet */}
      <Modal
        visible={showActions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowActions(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowActions(false)}
        >
          <GlassCard style={styles.bottomSheetContent}>
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>إضافة سريعة</Text>
            </View>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => {
                  setShowActions(false);
                  navigation?.navigate('AddTask');
                }}
              >
                <GlassCard style={styles.actionItemInner}>
                  <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
                    <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionTitle}>إضافة مهمة</Text>
                </GlassCard>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionItem}
                onPress={() => {
                  setShowActions(false);
                  navigation?.navigate('Pomodoro');
                }}
              >
                <GlassCard style={styles.actionItemInner}>
                  <View style={[styles.actionIcon, { backgroundColor: '#EF4444' }]}>
                    <Ionicons name="timer" size={22} color="#FFFFFF" />
                  </View>
                  <Text style={styles.actionTitle}>بدء جلسة طماطم</Text>
                </GlassCard>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  header: {
    paddingStart: theme.spacing(2),
    paddingEnd: theme.spacing(2),
    paddingTop: theme.spacing(2.5),
    paddingBottom: theme.spacing(3),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginEnd: theme.spacing(2),
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  profileInitial: {
    color: theme.colors.textLight,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    end: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: theme.colors.textLight,
    shadowColor: theme.colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 4,
    letterSpacing: theme.typography.letterSpacing.wide,
    textAlign: 'left',
  },
  subGreeting: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
    textAlign: 'left',
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    marginBottom: theme.spacing(4),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
  },
  statCard: {
    padding: theme.spacing(3),
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    marginBottom: theme.spacing(2),
  },
  statTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: theme.typography.letterSpacing.normal,
  },
  statSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContent: {
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing(3.5),
  },
  bottomSheetTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  actionsGrid: {
    gap: theme.spacing(2),
  },
  actionItem: {
    marginBottom: theme.spacing(2),
  },
  actionItemInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2.5),
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: theme.spacing(2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    letterSpacing: theme.typography.letterSpacing.normal,
  },
  quickAddButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    ...theme.shadow.button,
  },
  progressRingContainer: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  progressUnit: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: -2,
  },
  focusTimeNumber: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing(1),
  },
  nextTaskContainer: {
    marginBottom: theme.spacing(3),
  },
  nextTaskCard: {
    padding: theme.spacing(2.5),
  },
  nextTaskHeader: {
    marginBottom: theme.spacing(2),
  },
  nextTaskTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 4,
    textAlign: 'left',
  },
  nextTaskReason: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textDim,
    textAlign: 'left',
  },
  startButton: {
    alignSelf: 'stretch',
  },
  todayTasksContainer: {
    marginBottom: theme.spacing(3),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  taskCheckbox: {
    marginEnd: theme.spacing(1.5),
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    marginBottom: 2,
    textAlign: 'left',
  },
  taskTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    textAlign: 'left',
  },
  motivationContainer: {
    marginBottom: theme.spacing(3),
  },
  motivationCard: {
    padding: theme.spacing(2),
    alignItems: 'center',
  },
  motivationText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
    textAlign: 'center',
  },
  quickNoteContainer: {
    marginBottom: theme.spacing(4),
  },
  quickNoteCard: {
    // Container for TouchableOpacity
  },
  quickNoteCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  quickNoteText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textMuted,
  },
});
