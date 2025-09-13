import { HelpCategory, HelpArticle, ContactRequest, FAQ } from '../types/help';

class HelpAdapterClass {
  private categories: HelpCategory[] = [
    {
      id: '1',
      name: 'Getting Started',
      icon: 'rocket-outline',
      description: 'Learn the basics of using the app',
      order: 1,
    },
    {
      id: '2',
      name: 'Missions & Tasks',
      icon: 'checkmark-circle-outline',
      description: 'Everything about missions and tasks',
      order: 2,
    },
    {
      id: '3',
      name: 'Earnings & Payments',
      icon: 'card-outline',
      description: 'How to earn and receive payments',
      order: 3,
    },
    {
      id: '4',
      name: 'Account & Profile',
      icon: 'person-outline',
      description: 'Manage your account and profile',
      order: 4,
    },
    {
      id: '5',
      name: 'Technical Support',
      icon: 'settings-outline',
      description: 'Technical issues and troubleshooting',
      order: 5,
    },
  ];

  private articles: HelpArticle[] = [
    {
      id: '1',
      categoryId: '1',
      title: 'How to create your first mission',
      content: 'To create your first mission, navigate to the missions tab and tap the plus button. Fill in the required details and submit.',
      tags: ['mission', 'create', 'getting started'],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15'),
      isPopular: true,
      viewCount: 1250,
    },
    {
      id: '2',
      categoryId: '1',
      title: 'Setting up your profile',
      content: 'Complete your profile by adding a photo, bio, and contact information. This helps build trust with other users.',
      tags: ['profile', 'setup', 'getting started'],
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-10'),
      isPopular: true,
      viewCount: 980,
    },
    {
      id: '3',
      categoryId: '2',
      title: 'Understanding mission types',
      content: 'There are different types of missions: delivery, pickup, survey, and custom tasks. Each has specific requirements.',
      tags: ['mission', 'types', 'delivery', 'pickup'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-12'),
      isPopular: false,
      viewCount: 750,
    },
    {
      id: '4',
      categoryId: '2',
      title: 'How to complete a mission',
      content: 'Follow the mission instructions, upload required photos or documents, and mark as complete when finished.',
      tags: ['mission', 'complete', 'instructions'],
      createdAt: new Date('2024-01-04'),
      updatedAt: new Date('2024-01-14'),
      isPopular: true,
      viewCount: 1100,
    },
    {
      id: '5',
      categoryId: '3',
      title: 'Payment methods and schedules',
      content: 'Payments are processed weekly on Fridays. You can receive payments via bank transfer or mobile wallet.',
      tags: ['payment', 'schedule', 'bank', 'wallet'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-16'),
      isPopular: true,
      viewCount: 1350,
    },
    {
      id: '6',
      categoryId: '3',
      title: 'Understanding earnings calculation',
      content: 'Earnings are calculated based on mission complexity, distance, and completion time. Bonuses may apply.',
      tags: ['earnings', 'calculation', 'bonus'],
      createdAt: new Date('2024-01-06'),
      updatedAt: new Date('2024-01-18'),
      isPopular: false,
      viewCount: 650,
    },
    {
      id: '7',
      categoryId: '4',
      title: 'Updating your personal information',
      content: 'You can update your personal information in the profile settings. Some changes may require verification.',
      tags: ['profile', 'update', 'verification'],
      createdAt: new Date('2024-01-07'),
      updatedAt: new Date('2024-01-20'),
      isPopular: false,
      viewCount: 450,
    },
    {
      id: '8',
      categoryId: '5',
      title: 'Troubleshooting app crashes',
      content: 'If the app crashes frequently, try restarting your device, clearing app cache, or reinstalling the app.',
      tags: ['crash', 'troubleshooting', 'technical'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-22'),
      isPopular: false,
      viewCount: 320,
    },
  ];

  private faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'Go to login screen and tap "Forgot Password". Enter your email and follow the instructions.',
      categoryId: '4',
      isPopular: true,
      order: 1,
    },
    {
      id: '2',
      question: 'When do I get paid?',
      answer: 'Payments are processed every Friday for the previous week\'s completed missions.',
      categoryId: '3',
      isPopular: true,
      order: 2,
    },
    {
      id: '3',
      question: 'Can I cancel a mission?',
      answer: 'Yes, you can cancel a mission before accepting it or within 5 minutes of acceptance.',
      categoryId: '2',
      isPopular: true,
      order: 3,
    },
  ];

  async getCategories(): Promise<HelpCategory[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.categories.sort((a, b) => a.order - b.order);
  }

  async getArticles(categoryId?: string): Promise<HelpArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (categoryId) {
      return this.articles.filter(article => article.categoryId === categoryId);
    }
    
    return this.articles;
  }

  async getArticleById(id: string): Promise<HelpArticle | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const article = this.articles.find(article => article.id === id);
    if (article) {
      // Increment view count
      article.viewCount += 1;
    }
    return article || null;
  }

  async searchArticles(query: string): Promise<HelpArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const lowercaseQuery = query.toLowerCase();
    return this.articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getFAQs(categoryId?: string): Promise<FAQ[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (categoryId) {
      return this.faqs.filter(faq => faq.categoryId === categoryId)
                     .sort((a, b) => a.order - b.order);
    }
    
    return this.faqs.sort((a, b) => a.order - b.order);
  }

  async getPopularArticles(limit: number = 5): Promise<HelpArticle[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.articles
      .filter(article => article.isPopular)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
  }

  async submitContactRequest(request: Omit<ContactRequest, 'id' | 'createdAt' | 'status'>): Promise<ContactRequest> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newRequest: ContactRequest = {
      ...request,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    };
    
    return newRequest;
  }
}

export const HelpAdapter = new HelpAdapterClass();