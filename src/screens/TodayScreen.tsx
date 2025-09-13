import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../hooks/useTheme';
import { useTranslation } from '../i18n';
import { Button, Card, Typography } from '../components/ui';
import { CalendarAdapter, AssistantAdapter } from '../adapters';
import { CalendarEvent, ChatMessage, Task } from '../types';

const TodayScreen: React.FC = () => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([]);
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      paddingBottom: 100, // Space for FAB
    },
    header: {
      marginBottom: 20,
      paddingHorizontal: 0,
      alignItems: 'center',
    },
    greeting: {
      marginBottom: 8,
      textAlign: 'center',
    },
    centeredText: {
      textAlign: 'center',
    },
    section: {
      marginBottom: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 4,
    },
    eventItem: {
      marginBottom: 12,
      marginHorizontal: 2,
      padding: 16,
    },
    eventHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    eventTime: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    eventTimeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: '600',
    },
    eventDetails: {
      marginTop: 8,
    },
    messageItem: {
      marginBottom: 8,
      marginHorizontal: 2,
      padding: 12,
    },
    messageHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    messageType: {
      fontSize: 12,
      color: colors.muted,
      textTransform: 'uppercase',
    },
    emptyState: {
      padding: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 4,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      color: colors.muted,
    },
    quickActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingHorizontal: 0,
    },
    quickActionButton: {
      flex: 1,
      marginHorizontal: 4,
      padding: 12,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    taskItem: {
      marginBottom: 12,
      marginHorizontal: 2,
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
    },
    taskHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    taskCheckbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      marginEnd: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      marginBottom: 4,
    },
    taskPriority: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    completedTask: {
      opacity: 0.6,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingHorizontal: 0,
    },
    statCard: {
      flex: 1,
      padding: 16,
      marginHorizontal: 4,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      borderWidth: 1,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      fontWeight: '500',
    },
    progressBar: {
      height: 6,
      borderRadius: 3,
      marginTop: 8,
    },
    progressFill: {
      height: '100%',
      borderRadius: 3,
    },
  });

  const loadTodayData = async () => {
    try {
      setLoading(true);
      
      // Get today's events
      const today = new Date();
      const eventsResponse = await CalendarAdapter.getEventsByRange(
        today.toISOString().split('T')[0],
        new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      );
      
      if (eventsResponse.success) {
        setTodayEvents(eventsResponse.data);
      }

      // Get recent assistant messages
      const messagesResponse = await AssistantAdapter.getMessages();
      if (messagesResponse.success) {
        setRecentMessages(messagesResponse.data.slice(-3)); // Last 3 messages
      }

      // Load today's tasks (mock data for now)
      setTodayTasks([
        {
          id: '1',
          title: 'مراجعة المحاضرة',
          description: 'مراجعة محاضرة الرياضيات',
          type: 'study',
          isCompleted: false,
          priority: 'high',
          dueDate: new Date(),
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'حل الواجب',
          description: 'حل واجب الفيزياء',
          type: 'assignment',
          isCompleted: true,
          priority: 'medium',
          dueDate: new Date(),
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'قراءة الكتاب',
          description: 'قراءة الفصل الثالث',
          type: 'study',
          isCompleted: false,
          priority: 'low',
          dueDate: new Date(),
          userId: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error loading today data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodayData();
    setRefreshing(false);
  };

  const formatEventTime = (startTime: Date, endTime: Date) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'lecture':
        return colors.primary;
      case 'exam':
        return colors.error;
      case 'assignment':
        return colors.warning;
      case 'personal':
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const handleQuickAddEvent = () => {
    Alert.alert(
      'إضافة حدث جديد',
      'اختر نوع الحدث',
      [
        { text: 'محاضرة', onPress: () => console.log('Add lecture') },
        { text: 'امتحان', onPress: () => console.log('Add exam') },
        { text: 'واجب', onPress: () => console.log('Add assignment') },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };

  const handleQuickAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: 'مهمة جديدة',
      description: 'مهمة سريعة',
      type: 'personal',
      priority: 'medium',
      dueDate: new Date(),
      isCompleted: false,
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTodayTasks(prev => [newTask, ...prev]);
  };

  const handleAskAssistant = () => {
    // Navigate to assistant screen
    console.log('Navigate to assistant');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTodayTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, isCompleted: !task.isCompleted, updatedAt: new Date() }
          : task
      )
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.muted;
    }
  };

  const getTaskStats = () => {
    const totalTasks = todayTasks.length;
    const completedTasks = todayTasks.filter(task => task.isCompleted).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionRate: Math.round(completionRate)
    };
  };

  useEffect(() => {
    loadTodayData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('today.goodMorning');
    if (hour < 17) return t('today.goodAfternoon');
    return t('today.goodEvening');
  };

  const renderEventItem = (event: CalendarEvent) => (
    <Card key={event.id} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <View style={{ flex: 1 }}>
          <Typography variant="h3" style={{ marginBottom: 4 }}>
            {event.title}
          </Typography>
          <Typography variant="body" color="muted">
            {event.subject}
          </Typography>
        </View>
        <View style={[styles.eventTime, { backgroundColor: getEventTypeColor(event.type) }]}>
          <Typography style={styles.eventTimeText}>
            {formatEventTime(event.startTime, event.endTime)}
          </Typography>
        </View>
      </View>
      {event.location && (
        <View style={styles.eventDetails}>
          <Typography variant="caption" color="muted">
            📍 {event.location}
          </Typography>
        </View>
      )}
      {event.description && (
        <View style={styles.eventDetails}>
          <Typography variant="caption">
            {event.description}
          </Typography>
        </View>
      )}
    </Card>
  );

  const renderMessageItem = (message: ChatMessage) => (
    <Card key={message.id} style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <Typography style={styles.messageType}>
          {message.type === 'user' ? t('assistant.you') : t('assistant.assistant')}
        </Typography>
        <Typography variant="caption" color="muted">
          {new Date(message.timestamp).toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
      </View>
      <Typography variant="body">
        {message.content}
      </Typography>
    </Card>
  );

  const renderTaskItem = (task: Task) => (
    <TouchableOpacity
      key={task.id}
      style={[styles.taskItem, task.isCompleted && styles.completedTask]}
      onPress={() => toggleTaskCompletion(task.id)}
    >
      <View style={styles.taskHeader}>
        <View
          style={[
            styles.taskCheckbox,
            {
              borderColor: task.isCompleted ? colors.primary : colors.border,
              backgroundColor: task.isCompleted ? colors.primary : 'transparent',
            },
          ]}
        >
          {task.isCompleted && (
            <Typography style={{ color: 'white', fontSize: 12 }}>✓</Typography>
          )}
        </View>
        <View style={styles.taskContent}>
          <Typography
            variant="h3"
            style={{
              ...styles.taskTitle,
              ...(task.isCompleted && { textDecorationLine: 'line-through' }),
            }}
          >
            {task.title}
          </Typography>
          {task.description && (
            <Typography variant="caption" color="muted">
              {task.description}
            </Typography>
          )}
          <View style={[styles.taskPriority, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Typography style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
              {task.priority === 'high' ? 'عالية' : task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h1" style={styles.greeting}>
            {getGreeting()}
          </Typography>
          <Typography variant="body" color="muted" style={styles.centeredText}>
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Typography>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickActionButton, { 
              backgroundColor: colors.primary,
              borderWidth: 1,
              borderColor: colors.primary + '30'
            }]}
            onPress={handleQuickAddEvent}
          >
            <Typography variant="body" color="white" style={{ fontWeight: '600' }}>
               📅 حدث جديد
             </Typography>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.quickActionButton, { 
               backgroundColor: colors.success,
               borderWidth: 1,
               borderColor: colors.success + '30'
             }]}
             onPress={handleQuickAddTask}
           >
             <Typography variant="body" color="white" style={{ fontWeight: '600' }}>
               ✅ مهمة جديدة
             </Typography>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.quickActionButton, { 
               backgroundColor: colors.warning,
               borderWidth: 1,
               borderColor: colors.warning + '30'
             }]}
             onPress={handleAskAssistant}
           >
             <Typography variant="body" color="white" style={{ fontWeight: '600' }}>
               🤖 مساعد ذكي
             </Typography>
          </TouchableOpacity>
        </View>

        {/* Today's Tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2">
              مهام اليوم
            </Typography>
            <TouchableOpacity onPress={() => console.log('View all tasks')}>
              <Typography variant="caption" color="primary">
                {t('common.viewAll')}
              </Typography>
            </TouchableOpacity>
          </View>
          
          {/* Task Statistics */}
           {todayTasks.length > 0 && (
             <View style={styles.statsContainer}>
               <Card style={{...styles.statCard, backgroundColor: colors.primary + '15', borderColor: colors.primary + '30'}}>
                  <Typography style={{...styles.statNumber, color: colors.primary}}>
                    {getTaskStats().total}
                  </Typography>
                  <Typography style={{...styles.statLabel, color: colors.primary}}>
                    إجمالي المهام
                  </Typography>
                </Card>
                <Card style={{...styles.statCard, backgroundColor: colors.success + '15', borderColor: colors.success + '30'}}>
                  <Typography style={{...styles.statNumber, color: colors.success}}>
                    {getTaskStats().completed}
                  </Typography>
                  <Typography style={{...styles.statLabel, color: colors.success}}>
                    مكتملة
                  </Typography>
                </Card>
                <Card style={{...styles.statCard, backgroundColor: colors.warning + '15', borderColor: colors.warning + '30'}}>
                  <Typography style={{...styles.statNumber, color: colors.warning}}>
                    {getTaskStats().pending}
                  </Typography>
                  <Typography style={{...styles.statLabel, color: colors.warning}}>
                    معلقة
                  </Typography>
                </Card>
                <Card style={{...styles.statCard, backgroundColor: colors.primary + '10', borderColor: colors.primary + '20'}}>
                  <Typography style={{...styles.statNumber, color: colors.primary}}>
                    {getTaskStats().completionRate}%
                  </Typography>
                  <Typography style={{...styles.statLabel, color: colors.primary}}>
                    نسبة الإنجاز
                  </Typography>
                  <View style={{...styles.progressBar, backgroundColor: colors.border}}>
                    <View 
                      style={{
                        ...styles.progressFill, 
                        backgroundColor: colors.primary,
                        width: `${getTaskStats().completionRate}%`
                      }} 
                    />
                  </View>
                </Card>
             </View>
           )}
          
          {loading ? (
            <Card style={styles.emptyState}>
              <Typography variant="body" color="muted">
                {t('common.loading')}
              </Typography>
            </Card>
          ) : todayTasks.length > 0 ? (
            todayTasks.map(renderTaskItem)
          ) : (
            <Card style={styles.emptyState}>
              <Typography style={styles.emptyIcon}>📝</Typography>
              <Typography variant="body" color="muted">
                لا توجد مهام لليوم
              </Typography>
            </Card>
          )}
        </View>

        {/* Today's Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2">
              {t('today.todayEvents')}
            </Typography>
            <TouchableOpacity onPress={() => console.log('View all events')}>
              <Typography variant="caption" color="primary">
                {t('common.viewAll')}
              </Typography>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Card style={styles.emptyState}>
              <Typography variant="body" color="muted">
                {t('common.loading')}
              </Typography>
            </Card>
          ) : todayEvents.length > 0 ? (
            todayEvents.map(renderEventItem)
          ) : (
            <Card style={styles.emptyState}>
              <Typography style={styles.emptyIcon}>📅</Typography>
              <Typography variant="body" color="muted">
                {t('today.noEventsToday')}
              </Typography>
            </Card>
          )}
        </View>

        {/* Recent Assistant Messages */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Typography variant="h2">
              {t('assistant.recentMessages')}
            </Typography>
            <TouchableOpacity onPress={() => console.log('Open assistant')}>
              <Typography variant="caption" color="primary">
                {t('common.viewAll')}
              </Typography>
            </TouchableOpacity>
          </View>
          
          {recentMessages.length > 0 ? (
            recentMessages.map(renderMessageItem)
          ) : (
            <Card style={styles.emptyState}>
              <Typography style={styles.emptyIcon}>💬</Typography>
              <Typography variant="body" color="muted">
                {t('assistant.noRecentMessages')}
              </Typography>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TodayScreen;