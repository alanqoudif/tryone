import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { HelpAdapter } from '../adapters/HelpAdapter';
import { HelpArticle, HelpCategory } from '../types/help';

const HelpCenterScreen: React.FC = () => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadHelpData();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, articles]);

  const loadHelpData = async () => {
    try {
      setLoading(true);
      const [categoriesData, articlesData] = await Promise.all([
        HelpAdapter.getCategories(),
        HelpAdapter.getArticles(),
      ]);
      setCategories(categoriesData);
      setArticles(articlesData);
    } catch (error) {
      Alert.alert(t('common.error'), t('helpCenter.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredArticles(filtered);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const openArticle = (article: HelpArticle) => {
    // Navigate to article detail screen
    // navigation.navigate('ArticleDetail', { article });
    Alert.alert(article.title, article.content);
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={t('helpCenter.searchPlaceholder')}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearchQuery('')}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={20} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>{t('helpCenter.quickActions')}</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => router.push('/contact-support')}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
          <Text style={styles.quickActionText}>{t('helpCenter.contactSupport')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => Alert.alert(t('helpCenter.reportBug'), t('helpCenter.reportBugDesc'))}
        >
          <Ionicons name="bug-outline" size={24} color="#FF3B30" />
          <Text style={styles.quickActionText}>{t('helpCenter.reportBug')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => Alert.alert(t('helpCenter.feedback'), t('helpCenter.feedbackDesc'))}
        >
          <Ionicons name="star-outline" size={24} color="#FF9500" />
          <Text style={styles.quickActionText}>{t('helpCenter.feedback')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.quickActionItem}
          onPress={() => Alert.alert(t('helpCenter.tutorials'), t('helpCenter.tutorialsDesc'))}
        >
          <Ionicons name="play-circle-outline" size={24} color="#34C759" />
          <Text style={styles.quickActionText}>{t('helpCenter.tutorials')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>{t('helpCenter.categories')}</Text>
      {categories.map((category) => {
        const categoryArticles = filteredArticles.filter(
          (article) => article.categoryId === category.id
        );
        const isExpanded = expandedCategory === category.id;

        return (
          <View key={category.id} style={styles.categoryItem}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
            >
              <View style={styles.categoryInfo}>
                <Ionicons name={category.icon as any} size={20} color="#007AFF" />
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <Text style={styles.categoryCount}>({categoryArticles.length})</Text>
              </View>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {isExpanded && (
              <View style={styles.categoryArticles}>
                {categoryArticles.map((article) => (
                  <TouchableOpacity
                    key={article.id}
                    style={styles.articleItem}
                    onPress={() => openArticle(article)}
                  >
                    <Text style={styles.articleTitle}>{article.title}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
                {categoryArticles.length === 0 && (
                  <Text style={styles.noArticlesText}>{t('helpCenter.noArticles')}</Text>
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('helpCenter.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderSearchBar()}
        {renderQuickActions()}
        {renderCategories()}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  searchIcon: {
    marginEnd: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginStart: 12,
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#666',
    marginStart: 8,
  },
  categoryArticles: {
    paddingStart: 32,
    paddingTop: 8,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  noArticlesText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default HelpCenterScreen;