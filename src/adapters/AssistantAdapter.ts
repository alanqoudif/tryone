import { ChatMessage, AssistantSuggestion, ApiResponse } from '../types';

class AssistantAdapter {
  private messages: ChatMessage[] = [];
  private suggestions: AssistantSuggestion[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with some mock suggestions
    this.suggestions = [
      {
        id: 'suggestion_1',
        title: 'خطة مذاكرة ساعتين',
        description: 'خطة مذاكرة مركزة لمدة ساعتين مع فترات راحة',
        type: 'study_plan',
      },
      {
        id: 'suggestion_2',
        title: 'ملخص محاضرة اليوم',
        description: 'ملخص سريع لمحاضرة الرياضيات',
        type: 'summary',
      },
      {
        id: 'suggestion_3',
        title: 'تحضير للامتحان',
        description: 'خطة تحضير للامتحان النهائي',
        type: 'reminder',
      },
      {
        id: 'suggestion_4',
        title: 'تنظيم الوقت',
        description: 'نصائح لتنظيم وقتك بشكل أفضل',
        type: 'tip',
      },
    ];

    // Initialize with a welcome message
    this.messages = [
      {
        id: 'msg_welcome',
        content: 'مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
        type: 'assistant',
        timestamp: new Date(),
      },
    ];
  }

  // Get chat messages
  async getMessages(): Promise<ApiResponse<ChatMessage[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: this.messages,
          message: 'Messages fetched successfully'
        });
      }, 300);
    });
  }

  // Send a message and get AI response
  async sendMessage(content: string): Promise<ApiResponse<ChatMessage>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Add user message
        const userMessage: ChatMessage = {
          id: `msg_user_${Date.now()}`,
          content,
          type: 'user',
          timestamp: new Date(),
        };
        this.messages.push(userMessage);

        // Generate AI response
        const aiResponse = this.generateAIResponse(content);
        const assistantMessage: ChatMessage = {
          id: `msg_assistant_${Date.now()}`,
          content: aiResponse,
          type: 'assistant',
          timestamp: new Date(),
        };
        this.messages.push(assistantMessage);

        resolve({
          success: true,
          data: assistantMessage,
          message: 'Message sent successfully'
        });
      }, 800);
    });
  }

  // Get AI suggestions
  async getSuggestions(): Promise<ApiResponse<AssistantSuggestion[]>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: this.suggestions,
          message: 'Suggestions fetched successfully'
        });
      }, 400);
    });
  }

  // Apply a suggestion
  async applySuggestion(suggestionId: string): Promise<ApiResponse<ChatMessage>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const suggestion = this.suggestions.find(s => s.id === suggestionId);
        if (!suggestion) {
          resolve({
            success: false,
            data: {} as ChatMessage,
            message: 'Suggestion not found'
          });
          return;
        }

        const response = this.generateSuggestionResponse(suggestion);
        const assistantMessage: ChatMessage = {
          id: `msg_suggestion_${Date.now()}`,
          content: response,
          type: 'assistant',
          timestamp: new Date(),
        };
        this.messages.push(assistantMessage);

        resolve({
          success: true,
          data: assistantMessage,
          message: 'Suggestion applied successfully'
        });
      }, 600);
    });
  }

  // Convert message to task
  async convertToTask(messageId: string, taskTitle: string): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a task in the task management system
        resolve({
          success: true,
          data: true,
          message: 'Message converted to task successfully'
        });
      }, 500);
    });
  }

  // Clear chat history
  async clearMessages(): Promise<ApiResponse<boolean>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.messages = [
          {
            id: 'msg_welcome_new',
            content: 'تم مسح المحادثة. كيف يمكنني مساعدتك؟',
            type: 'assistant',
            timestamp: new Date(),
          },
        ];
        resolve({
          success: true,
          data: true,
          message: 'Messages cleared successfully'
        });
      }, 300);
    });
  }

  // Generate AI response based on user input
  private generateAIResponse(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('مذاكرة') || input.includes('دراسة')) {
      return 'يمكنني مساعدتك في إنشاء خطة مذاكرة مخصصة. ما هي المواد التي تريد التركيز عليها؟';
    }
    
    if (input.includes('امتحان') || input.includes('اختبار')) {
      return 'سأساعدك في التحضير للامتحان. متى موعد الامتحان وما هي المواضيع المطلوبة؟';
    }
    
    if (input.includes('وقت') || input.includes('جدول')) {
      return 'تنظيم الوقت مهم جداً للنجاح الأكاديمي. هل تريد مني إنشاء جدول يومي لك؟';
    }
    
    if (input.includes('واجب') || input.includes('مشروع')) {
      return 'يمكنني مساعدتك في تنظيم مهام الواجبات والمشاريع. ما هي التفاصيل؟';
    }
    
    if (input.includes('شكر') || input.includes('thanks')) {
      return 'العفو! أنا هنا لمساعدتك دائماً. هل تحتاج أي شيء آخر؟';
    }
    
    // Default responses
    const defaultResponses = [
      'فهمت طلبك. دعني أفكر في أفضل طريقة لمساعدتك.',
      'هذا سؤال جيد! يمكنني تقديم بعض الاقتراحات المفيدة.',
      'سأحتاج لمزيد من التفاصيل لأقدم لك المساعدة الأمثل.',
      'دعني أساعدك في هذا الأمر. هل يمكنك توضيح أكثر؟'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  // Generate response for applied suggestions
  private generateSuggestionResponse(suggestion: AssistantSuggestion): string {
    switch (suggestion.type) {
      case 'study_plan':
        return `إليك خطة مذاكرة:\n\n1. ابدأ بمراجعة سريعة (15 دقيقة)\n2. ادرس المفاهيم الجديدة (45 دقيقة)\n3. استراحة (10 دقائق)\n4. حل التمارين (40 دقيقة)\n5. مراجعة نهائية (10 دقائق)`;
      
      case 'summary':
        return 'ملخص المحاضرة:\n\n• النقاط الرئيسية\n• المفاهيم المهمة\n• الأمثلة العملية\n• النصائح للامتحان';
      
      case 'reminder':
        return `خطة التحضير للامتحان:\n\n📚 الأسبوع الأول: مراجعة شاملة\n📝 الأسبوع الثاني: حل نماذج امتحانات\n🎯 الأسبوع الثالث: التركيز على النقاط الضعيفة\n✅ اليوم الأخير: مراجعة سريعة واسترخاء`;
      
      case 'tip':
        return 'نصائح تنظيم الوقت:\n\n⏰ استخدم تقنية البومودورو\n📅 خطط ليومك مسبقاً\n🎯 حدد أولوياتك\n📱 قلل من المشتتات\n💪 خذ فترات راحة منتظمة';
      
      default:
        return 'تم تطبيق الاقتراح بنجاح!';
    }
  }
}

export default new AssistantAdapter();