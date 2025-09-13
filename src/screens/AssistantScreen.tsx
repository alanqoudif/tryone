import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsDark } from '../hooks/useTheme';
import { AnimatedPressable, FadeSlide, ShimmerSkeleton } from '../components/ui';
import { useTranslation } from 'react-i18next';
import { AssistantAdapter } from '../adapters';
import { ChatMessage, AssistantSuggestion } from '../types';
import { theme } from '../constants/design';

interface AssistantScreenProps {
  navigation: any;
}

interface QuickSuggestion {
  id: string;
  title: string;
  icon: string;
  action: string;
}

interface TaskCardData {
  id: string;
  title: string;
  category: string;
  dueTime?: string;
  completed: boolean;
}

interface PomodoroCardData {
  duration: number;
  remainingTime: number;
  isRunning: boolean;
  taskTitle?: string;
}

interface PlanCardData {
  tasks: Array<{
    id: string;
    title: string;
    priority: 'high' | 'medium' | 'low';
    estimatedTime: number;
  }>;
  totalTime: number;
}

interface ExtendedChatMessage {
  id: string;
  content: string;
  type: 'text' | 'task-card' | 'pomodoro-card' | 'plan-card';
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  data?: any;
  actions?: Array<{ id: string; title: string; action: string }>;
  status?: 'sending' | 'sent' | 'failed';
  taskData?: TaskCardData;
  pomodoroData?: PomodoroCardData;
  planData?: PlanCardData;
}

const AssistantScreen: React.FC<AssistantScreenProps> = ({ navigation }) => {
  const isDark = useIsDark();
  const insets = useSafeAreaInsets();
  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    card: isDark ? '#1c1c1e' : '#f2f2f7',
    border: isDark ? '#38383a' : '#c6c6c8',
    text: isDark ? '#ffffff' : '#000000',
    primary: '#007AFF',
    secondary: '#5856D6',
    muted: isDark ? '#8e8e93' : '#6d6d70',
    success: '#34C759',
    error: '#FF3B30',
    userMessage: isDark ? '#007AFF' : '#007AFF',
    assistantMessage: isDark ? '#2B2F36' : '#e5e5ea',
    shadow: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    online: '#34C759',
    offline: '#FF3B30',
  };
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [showActionCard, setShowActionCard] = useState<string | null>(null);
  const [actionCardData, setActionCardData] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<AssistantSuggestion[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showDailySummary, setShowDailySummary] = useState(false);
  const [hasContextualSuggestions, setHasContextualSuggestions] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const statusScale = useRef(new Animated.Value(1)).current;
  
  const quickSuggestions: QuickSuggestion[] = [
    { id: '1', title: 'أضف مهمة إلى الخطة', icon: '+', action: 'add_task' },
    { id: '2', title: 'ابدأ 25:00', icon: '○', action: 'start_pomodoro' },
    { id: '3', title: 'خطط يومي', icon: '◐', action: 'plan_day' },
    { id: '4', title: 'ملاحظة سريعة', icon: '✎', action: 'quick_note' },
    { id: '5', title: 'شرح درس', icon: '◉', action: 'explain_lesson' },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // breathing animation for online status dot
    const loop = () => {
      Animated.sequence([
        Animated.timing(statusScale, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(statusScale, { toValue: 1.0, duration: 700, useNativeDriver: true }),
      ]).start(() => loop());
    };
    loop();
    return () => statusScale.stopAnimation();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load chat history
      const messagesResponse = await AssistantAdapter.getMessages();
      if (messagesResponse.success && messagesResponse.data) {
        const extendedMessages: ExtendedChatMessage[] = messagesResponse.data.map(msg => ({
          ...msg,
          type: 'text' as const,
          role: msg.type as 'user' | 'assistant' | 'system'
        }));
        setMessages(extendedMessages);
      }

      // Load suggestions
      const suggestionsResponse = await AssistantAdapter.getSuggestions();
      if (suggestionsResponse.success && suggestionsResponse.data) {
        setSuggestions(suggestionsResponse.data);
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('assistant.loadError'));
    }
  };

  const classifyIntent = (message: string): { intent: string; entities: any } => {
    const lowerMessage = message.toLowerCase();
    
    // إضافة مهمة
    if (lowerMessage.includes('أضف') || lowerMessage.includes('ذكرني') || lowerMessage.includes('مهمة') || lowerMessage.includes('واجب')) {
      return { intent: 'add_task', entities: { text: message } };
    }
    
    // بدء طماطم
    if (lowerMessage.includes('ابدأ') || lowerMessage.includes('شغل') || lowerMessage.includes('25') || lowerMessage.includes('دقيقة') || lowerMessage.includes('تركيز')) {
      return { intent: 'start_pomodoro', entities: { duration: 25 } };
    }
    
    // تخطيط اليوم
    if (lowerMessage.includes('خطط') || lowerMessage.includes('يومي') || lowerMessage.includes('وش أسوي') || lowerMessage.includes('ماذا أفعل')) {
      return { intent: 'plan_day', entities: {} };
    }
    
    // سؤال معرفي
    return { intent: 'general_question', entities: { question: message } };
  };

  const handleIntent = async (intent: string, entities: any, userMessage: string): Promise<ExtendedChatMessage> => {
    switch (intent) {
      case 'add_task':
        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'تمت إضافة المهمة بنجاح! ✅',
          timestamp: new Date(),
          type: 'task-card',
          status: 'sent',
          taskData: {
            id: Date.now().toString(),
            title: entities.text.replace(/أضف|ذكرني|مهمة|واجب/gi, '').trim() || 'مهمة جديدة',
            category: 'عام',
            dueTime: 'اليوم',
            completed: false
          }
        };
        
      case 'start_pomodoro':
        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'جلسة تركيز جاهزة! ⏱️',
          timestamp: new Date(),
          type: 'pomodoro-card',
          status: 'sent',
          pomodoroData: {
            duration: entities.duration * 60,
            remainingTime: entities.duration * 60,
            isRunning: false,
            taskTitle: 'جلسة تركيز'
          }
        };
        
      case 'plan_day':
        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'إليك خطة مقترحة لليوم:',
          timestamp: new Date(),
          type: 'plan-card',
          status: 'sent',
          planData: {
            tasks: [
              { id: '1', title: 'مراجعة الرياضيات', priority: 'high', estimatedTime: 45 },
              { id: '2', title: 'قراءة الفيزياء', priority: 'medium', estimatedTime: 30 },
              { id: '3', title: 'حل واجب الكيمياء', priority: 'high', estimatedTime: 60 }
            ],
            totalTime: 135
          }
        };
        
      default:
        return {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `شكرًا لك على سؤالك: "${userMessage}". هذا رد تجريبي من المساعد الذكي.`,
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Add user message immediately
    const newUserMessage: ExtendedChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Classify intent and handle
      const { intent, entities } = classifyIntent(userMessage);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const assistantMessage = await handleIntent(intent, entities, userMessage);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      Alert.alert(t('common.error'), t('assistant.sendError'));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleSuggestionPress = async (suggestion: AssistantSuggestion) => {
    setInputText(suggestion.title);
    await sendMessage();
  };

  const formatMessageTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('ar-SA', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString('ar-SA', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const renderTaskCard = (taskData: TaskCardData) => (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{taskData.title}</Text>
        <Text style={[styles.cardCategory, { color: colors.muted }]}>{taskData.category}</Text>
      </View>
      {taskData.dueTime && (
        <Text style={[styles.cardTime, { color: colors.muted }]}>⏰ {taskData.dueTime}</Text>
      )}
      <View style={styles.cardActions}>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.cardButtonText}>✓ إكمال</Text>
        </Pressable>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.secondary }]}>
          <Text style={styles.cardButtonText}>✏️ تحرير</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderPomodoroCard = (pomodoroData: PomodoroCardData) => (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>جلسة تركيز</Text>
        {pomodoroData.taskTitle && (
          <Text style={[styles.cardCategory, { color: colors.muted }]}>{pomodoroData.taskTitle}</Text>
        )}
      </View>
      <View style={styles.pomodoroTimer}>
        <Text style={[styles.timerText, { color: colors.primary }]}>
          {Math.floor(pomodoroData.remainingTime / 60)}:{(pomodoroData.remainingTime % 60).toString().padStart(2, '0')}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable style={[styles.cardButton, { backgroundColor: pomodoroData.isRunning ? colors.error : colors.success }]}>
          <Text style={styles.cardButtonText}>{pomodoroData.isRunning ? '⏸️ إيقاف' : '▶️ ابدأ'}</Text>
        </Pressable>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.muted }]}>
          <Text style={styles.cardButtonText}>⏹️ إنهاء</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderPlanCard = (planData: PlanCardData) => (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>خطة اليوم</Text>
        <Text style={[styles.cardCategory, { color: colors.muted }]}>{planData.totalTime} دقيقة</Text>
      </View>
      {planData.tasks.map((task, index) => (
        <View key={task.id} style={styles.planTaskItem}>
          <Text style={[styles.planTaskNumber, { color: colors.primary }]}>{index + 1}</Text>
          <Text style={[styles.planTaskTitle, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.planTaskTime, { color: colors.muted }]}>{task.estimatedTime}د</Text>
        </View>
      ))}
      <View style={styles.cardActions}>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.cardButtonText}>✓ اعتمد الخطة</Text>
        </Pressable>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.secondary }]}>
          <Text style={styles.cardButtonText}>🔄 بدّل الترتيب</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDailySummary = () => (
    <View style={[styles.cardContainer, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>📊 ملخص اليوم</Text>
      </View>
      <View style={styles.summaryContent}>
        <Text style={[styles.summaryText, { color: colors.text }]}>ركزت 45 دقيقة وأنجزت 3 مهام</Text>
        <Text style={[styles.summarySubtext, { color: colors.muted }]}>أداء ممتاز! 🎉</Text>
      </View>
      <View style={styles.cardActions}>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.cardButtonText}>جدولة الغد</Text>
        </Pressable>
        <Pressable style={[styles.cardButton, { backgroundColor: colors.secondary }]}>
          <Text style={styles.cardButtonText}>مراجعة الأهداف</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderMessage = (message: ExtendedChatMessage, index: number) => {
    const isUser = message.role === 'user';
    
    if (message.type === 'text') {
      return (
        <FadeSlide key={message.id} distance={10} style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.assistantMessageContainer
        ]}>
          <Pressable
            onLongPress={() => {
              // TODO: Show context menu for copy/delete/pin
            }}
            style={[
              styles.messageBubble,
              {
                backgroundColor: isUser ? colors.userMessage : colors.assistantMessage,
                alignSelf: isUser ? 'flex-end' : 'flex-start',
              }
            ]}
          >
            <Text style={[
              styles.messageText,
              { color: isUser ? '#ffffff' : colors.text }
            ]}>
              {message.content}
            </Text>
            <Text style={[
              styles.messageTime,
              { 
                color: isUser ? 'rgba(255,255,255,0.7)' : colors.muted,
                textAlign: isUser ? 'right' : 'left'
              }
            ]}>
              {formatMessageTime(message.timestamp)}
            </Text>
          </Pressable>
          
          {/* Suggested replies for assistant messages */}
          {message.role === 'assistant' && (
            <View style={styles.suggestedRepliesContainer}>
              {getSuggestedReplies(message.content).map((reply, index) => (
                <AnimatedPressable
                  key={index}
                  style={[styles.suggestedReply, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setInputText(reply)}
                >
                  <Text style={[styles.suggestedReplyText, { color: colors.primary }]}>{reply}</Text>
                </AnimatedPressable>
              ))}
            </View>
          )}
        </FadeSlide>
      );
    } else if (message.type === 'task-card' && message.taskData) {
      return renderTaskCard(message.taskData);
    } else if (message.type === 'pomodoro-card' && message.pomodoroData) {
      return renderPomodoroCard(message.pomodoroData);
    } else if (message.type === 'plan-card' && message.planData) {
      return renderPlanCard(message.planData);
    }
    
    return null;
  };

  const renderSuggestion = (suggestion: AssistantSuggestion, index: number) => {
    return (
      <TouchableOpacity
        key={suggestion.id}
        style={[styles.suggestionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => handleSuggestionPress(suggestion)}
      >
        <Text style={[styles.suggestionTitle, { color: colors.text }]}>
          {suggestion.title}
        </Text>
        <Text style={[styles.suggestionDescription, { color: colors.muted }]}>
          {suggestion.description}
        </Text>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      width: 40,
      alignItems: 'center',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
    },
    headerRight: {
      width: 40,
      alignItems: 'flex-end',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginEnd: 6,
    },
    statusText: {
      fontSize: 11,
    },
    settingsButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      fontSize: 16,
    },
    searchButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchIcon: {
      fontSize: 16,
    },
    contextBadge: {
      marginTop: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: colors.background,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    contextText: {
      fontSize: 11,
    },
    content: {
      flex: 1,
    },
    messagesContainer: {
      flex: 1,
      padding: 16,
    },
    messageContainer: {
      marginBottom: 20,
    },
    userMessageContainer: {
      alignItems: 'flex-end',
    },
    assistantMessageContainer: {
      alignItems: 'center',
    },
    messageBubble: {
      maxWidth: '80%',
      padding: 16,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    messageText: {
      fontSize: 15,
      lineHeight: 21,
    },
    messageTime: {
      fontSize: 11,
      marginTop: 6,
      color: colors.muted,
      opacity: 0.5,
    },
    quickSuggestionsContainer: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    quickSuggestionsContent: {
      paddingHorizontal: 16,
    },
    quickSuggestionChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      marginEnd: 12,
      backgroundColor: colors.card,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    suggestionIcon: {
      fontSize: 16,
      marginEnd: 6,
    },
    suggestionChipText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1F2937',
    },
    suggestionsSection: {
      padding: 16,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    suggestionsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: 12,
    },
    suggestionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    suggestionCard: {
      width: '48%',
      margin: 6,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    suggestionTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    suggestionDescription: {
      fontSize: 12,
      lineHeight: 16,
    },
    inputContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: -1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
    },
    attachButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    attachIcon: {
      fontSize: 18,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      maxHeight: 100,
      minHeight: 44,
      backgroundColor: colors.background,
      color: colors.text,
      fontSize: 15,
    },
    micButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    micIcon: {
      fontSize: 18,
    },
    sendButton: {
      backgroundColor: colors.primary,
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: colors.muted,
    },
    sendButtonText: {
      color: '#ffffff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
    },
    emptyStateIcon: {
      fontSize: 48,
      marginBottom: 16,
      color: colors.muted,
    },
    emptyStateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyStateDescription: {
      fontSize: 14,
      color: colors.muted,
      textAlign: 'center',
      lineHeight: 20,
    },
    typingIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    typingDots: {
      flexDirection: 'row',
      marginStart: 8,
    },
    typingDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      marginHorizontal: 1,
    },
    cardContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    cardHeader: {
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    cardCategory: {
      fontSize: 14,
      opacity: 0.7,
    },
    cardTime: {
      fontSize: 14,
      marginBottom: 12,
    },
    cardActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
    },
    cardButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cardButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '500',
    },
    pomodoroTimer: {
      alignItems: 'center',
      marginVertical: 16,
    },
    timerText: {
      fontSize: 32,
      fontWeight: 'bold',
      fontFamily: 'monospace',
    },
    planTaskItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    planTaskNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary + '20',
      textAlign: 'center',
      lineHeight: 24,
      fontSize: 12,
      fontWeight: 'bold',
      marginEnd: 12,
    },
    planTaskTitle: {
      flex: 1,
      fontSize: 14,
    },
    planTaskTime: {
      fontSize: 12,
      opacity: 0.7,
    },
    summaryContent: {
      marginVertical: 12,
    },
    summaryText: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    summarySubtext: {
      fontSize: 14,
      opacity: 0.8,
    },
    examplesContainer: {
      marginTop: 24,
      width: '100%',
    },
    examplesTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
    },
    exampleBubble: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
    },
    exampleText: {
      fontSize: 14,
      marginStart: 8,
    },
    suggestedRepliesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 12,
      marginHorizontal: 16,
      gap: 8,
    },
    suggestedReply: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
    },
    suggestedReplyText: {
      fontSize: 13,
      fontWeight: '500',
    },
    actionCard: {
      position: 'absolute',
      top: 100,
      start: 16,
      end: 16,
      borderRadius: 12,
      borderWidth: 1,
      padding: 16,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 1000,
    },
    actionCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    actionCardTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
    actionCardClose: {
      width: 24,
      height: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionCardCloseText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    actionCardContent: {
      gap: 16,
    },
    actionCardInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
    },
    actionCardTimer: {
      fontSize: 32,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'monospace',
    },
    actionCardSubtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 8,
    },
    actionCardButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    actionCardButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
    },
    actionCardButtonPrimary: {
      borderWidth: 0,
    },
    actionCardButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={[styles.searchIcon, { color: colors.muted }]}>🔍</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>المساعد</Text>
            <View style={styles.connectionStatus}>
            <Animated.View style={[styles.statusDot, { backgroundColor: isOnline ? colors.online : colors.offline, transform: [{ scale: statusScale }] }]} />
            <Text style={[styles.statusText, { color: colors.muted }]}>
              {isOnline ? 'متصل • يستند إلى مهامي اليوم' : 'غير متصل'}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={[styles.settingsIcon, { color: colors.muted }]}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderActionCard = () => {
    if (!showActionCard || !actionCardData) return null;

    return (
      <View style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.actionCardHeader}>
          <Text style={[styles.actionCardTitle, { color: colors.text }]}>
            {actionCardData.title}
          </Text>
          <TouchableOpacity 
            onPress={() => setShowActionCard(null)}
            style={styles.actionCardClose}
          >
            <Text style={[styles.actionCardCloseText, { color: colors.muted }]}>×</Text>
          </TouchableOpacity>
        </View>
        
        {showActionCard === 'add_task' && (
          <View style={styles.actionCardContent}>
            <TextInput
              style={[styles.actionCardInput, { backgroundColor: colors.background, borderColor: colors.border, color: colors.text }]}
              placeholder="اسم المهمة"
              placeholderTextColor={colors.muted}
              value={actionCardData.taskName || ''}
              onChangeText={(text) => setActionCardData({...actionCardData, taskName: text})}
            />
            <View style={styles.actionCardButtons}>
              <TouchableOpacity 
                style={[styles.actionCardButton, styles.actionCardButtonPrimary, { backgroundColor: colors.primary }]}
                onPress={() => {
                    // Handle save task
                    const taskMessage = `تمت إضافة المهمة: ${actionCardData.taskName}`;
                    setInputText(taskMessage);
                    setShowActionCard(null);
                    setTimeout(() => sendMessage(), 100);
                  }}
              >
                <Text style={[styles.actionCardButtonText, { color: colors.background }]}>حفظ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionCardButton, { borderColor: colors.border }]}
                onPress={() => setShowActionCard(null)}
              >
                <Text style={[styles.actionCardButtonText, { color: colors.text }]}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {showActionCard === 'start_pomodoro' && (
          <View style={styles.actionCardContent}>
            <Text style={[styles.actionCardTimer, { color: colors.text }]}>25:00</Text>
            <Text style={[styles.actionCardSubtitle, { color: colors.muted }]}>جلسة تركيز</Text>
            <View style={styles.actionCardButtons}>
              <TouchableOpacity 
                style={[styles.actionCardButton, styles.actionCardButtonPrimary, { backgroundColor: colors.primary }]}
                onPress={() => {
                    // Handle start pomodoro
                    const pomodoroMessage = 'بدأت جلسة تركيز 25:00 ⏱️';
                    setInputText(pomodoroMessage);
                    setShowActionCard(null);
                    setTimeout(() => sendMessage(), 100);
                  }}
              >
                <Text style={[styles.actionCardButtonText, { color: colors.background }]}>ابدأ</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionCardButton, { borderColor: colors.border }]}
                onPress={() => setShowActionCard(null)}
              >
                <Text style={[styles.actionCardButtonText, { color: colors.text }]}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderQuickSuggestions = () => (
    <View style={[styles.quickSuggestionsContainer, { paddingBottom: insets.bottom + 8 }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.quickSuggestionsContent}
      >
        {quickSuggestions.map((suggestion) => (
          <AnimatedPressable
            key={suggestion.id}
            style={[styles.quickSuggestionChip, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickSuggestion(suggestion)}
          >
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={[styles.suggestionChipText, { color: colors.text }]}>{suggestion.title}</Text>
          </AnimatedPressable>
        ))}
      </ScrollView>
    </View>
  );

  const handleQuickSuggestion = (suggestion: QuickSuggestion) => {
    switch (suggestion.action) {
      case 'add_task':
        setShowActionCard('add_task');
        setActionCardData({ title: 'إضافة مهمة جديدة', taskName: '' });
        break;
      case 'start_pomodoro':
        setShowActionCard('start_pomodoro');
        setActionCardData({ title: 'بدء جلسة تركيز' });
        break;
      case 'plan_day':
        setInputText('اعرض خطة اليوم');
        break;
      case 'quick_note':
        setInputText('أضف ملاحظة سريعة');
        break;
      case 'explain_lesson':
        setInputText('اشرح لي درس');
        break;
      default:
        setInputText(suggestion.title);
        break;
    }
  };

  const handleLongPress = (message: ExtendedChatMessage) => {
    // TODO: Show context menu for copy/delete/pin
    Alert.alert(
      'خيارات الرسالة',
      'اختر إجراءً',
      [
        { text: 'نسخ', onPress: () => console.log('Copy message') },
        { text: 'حذف', onPress: () => console.log('Delete message'), style: 'destructive' },
        { text: 'إلغاء', style: 'cancel' }
      ]
    );
  };

  const getSuggestedReplies = (messageContent: string): string[] => {
    const lowerContent = messageContent.toLowerCase();
    let replies: string[] = [];
    
    if (lowerContent.includes('مهمة') || lowerContent.includes('تمت إضافة')) {
      replies = ['شكرًا لك', 'أضف مهمة أخرى', 'ذكرني بها لاحقًا'];
    } else if (lowerContent.includes('تركيز') || lowerContent.includes('جلسة')) {
      replies = ['ابدأ الآن', 'غيّر المدة', 'أضف استراحة'];
    } else if (lowerContent.includes('خطة') || lowerContent.includes('يوم')) {
      replies = ['موافق على الخطة', 'عدّل الخطة', 'أضف مهمة إلى الخطة'];
    } else {
      replies = ['شكرًا لك', 'أخبرني المزيد', 'ماذا التالي؟'];
    }
    
    return replies;
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🤖</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              مرحبًا! أنا مساعدك الذكي 🤖
            </Text>
            <Text style={[styles.emptyStateDescription, { color: colors.muted }]}>
              يمكنني مساعدتك في تنظيم مهامك وإدارة وقتك
            </Text>
            
            {/* Show examples only when input is empty and no contextual suggestions */}
            {inputText.length === 0 && !hasContextualSuggestions && (
              <View style={styles.examplesContainer}>
                <Text style={[styles.examplesTitle, { color: colors.text }]}>جرب هذه الأمثلة:</Text>
                
                <Pressable 
                  style={[styles.exampleBubble, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setInputText('أضف واجب الرياضيات اليوم 8 م')}
                >
                  <Text style={[styles.exampleText, { color: colors.primary }]}>📝</Text>
                  <Text style={[styles.exampleText, { color: colors.text }]}>"أضف واجب الرياضيات اليوم 8 م"</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.exampleBubble, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setInputText('ابدأ جلسة 25 دقيقة لمذكرة الكيمياء')}
                >
                  <Text style={[styles.exampleText, { color: colors.primary }]}>⏱️</Text>
                  <Text style={[styles.exampleText, { color: colors.text }]}>"ابدأ جلسة 25 دقيقة لمذكرة الكيمياء"</Text>
                </Pressable>
                
                <Pressable 
                  style={[styles.exampleBubble, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => setInputText('خطط يومي')}
                >
                  <Text style={[styles.exampleText, { color: colors.primary }]}>📅</Text>
                  <Text style={[styles.exampleText, { color: colors.text }]}>"خطط يومي"</Text>
                </Pressable>
              </View>
            )}
          </View>
        ) : (
          <FlatList 
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => renderMessage(item, index)}
            keyExtractor={(item) => item.id}
            style={styles.messagesContainer}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isTyping ? (
              <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
                <View style={[styles.messageBubble, { backgroundColor: colors.assistantMessage, width: '72%' }]}>
                  <ShimmerSkeleton width={'60%'} height={14} style={{ marginBottom: 8 }} />
                  <ShimmerSkeleton width={'40%'} height={14} />
                </View>
              </View>
            ) : null}
          />
        )}

        {suggestions.length > 0 && messages.length === 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>
              {t('assistant.suggestions')}
            </Text>
            <View style={styles.suggestionsGrid}>
              {suggestions.map((suggestion, index) => renderSuggestion(suggestion, index))}
            </View>
          </View>
        )}

        {renderActionCard()}
        
        {inputText.length === 0 && !hasContextualSuggestions && renderQuickSuggestions()}
        
        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 8 }]}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Text style={[styles.attachIcon, { color: colors.muted }]}>📎</Text>
            </TouchableOpacity>
            <TextInput
              ref={inputRef}
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="اكتب رسالتك هنا…"
              placeholderTextColor={colors.muted}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.micButton}>
              <Text style={[styles.micIcon, { color: colors.muted }]}>🎤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>✈</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AssistantScreen;
