import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Platform {
  id: string;
  name: string;
  icon: string;
  category: 'essential' | 'social' | 'professional' | 'creative';
  color: string;
  placeholder?: string;
}

const platforms: Platform[] = [
  { 
    id: 'website', 
    name: 'Website', 
    icon: 'globe-outline', 
    category: 'essential', 
    color: '#4F46E5',
    placeholder: 'https://yourwebsite.com'
  },
  { 
    id: 'email', 
    name: 'Email', 
    icon: 'mail-outline', 
    category: 'essential', 
    color: '#3B82F6',
    placeholder: 'your@email.com'
  },
  { 
    id: 'phone', 
    name: 'Phone', 
    icon: 'call-outline', 
    category: 'essential', 
    color: '#10B981',
    placeholder: '+1 (555) 123-4567'
  },
  { 
    id: 'whatsapp', 
    name: 'WhatsApp', 
    icon: 'logo-whatsapp', 
    category: 'essential', 
    color: '#25D366',
    placeholder: '+1 (555) 123-4567'
  },
  { 
    id: 'instagram', 
    name: 'Instagram', 
    icon: 'logo-instagram', 
    category: 'social', 
    color: '#E4405F',
    placeholder: '@username'
  },
  { 
    id: 'twitter', 
    name: 'Twitter', 
    icon: 'logo-twitter', 
    category: 'social', 
    color: '#1DA1F2',
    placeholder: '@username'
  },
  { 
    id: 'linkedin', 
    name: 'LinkedIn', 
    icon: 'logo-linkedin', 
    category: 'professional', 
    color: '#0077B5',
    placeholder: 'linkedin.com/in/username'
  },
  { 
    id: 'facebook', 
    name: 'Facebook', 
    icon: 'logo-facebook', 
    category: 'social', 
    color: '#1877F2',
    placeholder: 'facebook.com/username'
  },
  { 
    id: 'youtube', 
    name: 'YouTube', 
    icon: 'logo-youtube', 
    category: 'creative', 
    color: '#FF0000',
    placeholder: 'youtube.com/@channel'
  },
  { 
    id: 'tiktok', 
    name: 'TikTok', 
    icon: 'musical-notes-outline', 
    category: 'social', 
    color: '#000000',
    placeholder: '@username'
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: 'logo-github', 
    category: 'professional', 
    color: '#333333',
    placeholder: 'github.com/username'
  },
  { 
    id: 'discord', 
    name: 'Discord', 
    icon: 'logo-discord', 
    category: 'social', 
    color: '#5865F2',
    placeholder: 'discord.gg/invite'
  },
];

export default function AddLinksScreen() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['website']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animations
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 2,
        duration: 1200,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const navigateToNextStep = useCallback(() => {
    // Try multiple possible routes for the next step (Profile Setup - Step 3)
    const possibleRoutes = [
      '/(tabs)/profile-setup',  // Tab-based structure
      '/profile-setup',         // Direct route
      '/profile',               // Simple profile route
      '/(onboarding)/profile',  // Onboarding flow
      '/setup/profile',         // Setup flow
      '/components/ProfilePage' // Your original route
    ];

    // Try to navigate to the first available route
    try {
      // For now, let's use a more standard route structure
      router.push('/components/ProfilePage');
    } catch (error) {
      console.log('Primary route failed, trying alternatives...');
      
      // If primary fails, try alternatives
      const fallbackRoutes = [
        '/profile',
        '/(tabs)/profile',
        '/components/ProfilePage'
      ];
      
      let navigated = false;
      for (const route of fallbackRoutes) {
        try {
          router.back();
          navigated = true;
          break;
        } catch (err) {
          console.log(`Route ${route} failed:`, err);
        }
      }
      
      if (!navigated) {
        Alert.alert(
          'Navigation Error',
          'Unable to proceed to the next step. Please check your route configuration.',
          [{ text: 'OK' }]
        );
      }
    }
  }, []);

  const handleSkip = () => {
    Alert.alert(
      'Skip This Step?',
      'You can always add links later in your profile settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          style: 'default',
          onPress: navigateToNextStep
        }
      ]
    );
  }; 

  const handleContinue = async () => {
    if (selectedPlatforms.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call to save selected platforms
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Selected platforms:', selectedPlatforms);
      
      // Store selected platforms (you might want to use AsyncStorage or context here)
      // await AsyncStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
      
      // Navigate to next step (Profile Setup - Step 3)
      navigateToNextStep();
      
    } catch (error) {
      console.error('Error saving platforms:', error);
      Alert.alert(
        'Error',
        'Failed to save your preferences. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlatform = useCallback((platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Memoized filtered platforms for performance
  const filteredPlatforms = useMemo(() => 
    platforms.filter(platform =>
      platform.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  );

  // Group platforms by category
  const platformsByCategory = useMemo(() => {
    const grouped = filteredPlatforms.reduce((acc, platform) => {
      if (!acc[platform.category]) {
        acc[platform.category] = [];
      }
      acc[platform.category].push(platform);
      return acc;
    }, {} as Record<string, Platform[]>);

    return grouped;
  }, [filteredPlatforms]);

  const categoryOrder = ['essential', 'social', 'professional', 'creative'];
  const categoryLabels = {
    essential: 'Essential',
    social: 'Social Media',
    professional: 'Professional',
    creative: 'Creative & Content'
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 3],
    outputRange: ['0%', '66.66%'],
  });

  const renderPlatformItem = ({ item }: { item: Platform }) => {
    const isSelected = selectedPlatforms.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.platformItem, 
          isSelected && styles.platformItemSelected
        ]}
        onPress={() => togglePlatform(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.platformContent}>
          <View style={[
            styles.platformIcon, 
            { backgroundColor: `${item.color}15` }
          ]}>
            <Ionicons name={item.icon as any} size={24} color={item.color} />
          </View>
          <View style={styles.platformInfo}>
            <Text style={styles.platformName}>{item.name}</Text>
            {item.placeholder && (
              <Text style={styles.platformPlaceholder}>{item.placeholder}</Text>
            )}
          </View>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="white" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategorySection = (category: string) => {
    const categoryPlatforms = platformsByCategory[category];
    if (!categoryPlatforms || categoryPlatforms.length === 0) return null;

    return (
      <View key={category} style={styles.section}>
        <Text style={styles.sectionTitle}>
          {categoryLabels[category as keyof typeof categoryLabels]}
        </Text>
        <FlatList
          data={categoryPlatforms}
          renderItem={renderPlatformItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FAFAFA" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Add Your Links</Text>
              <Text style={styles.headerSubtitle}>Choose platforms to connect</Text>
            </View>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 2 of 3</Text>
              <Text style={styles.selectedCount}>
                {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''} selected
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressWidth },
                ]}
              />
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search platforms..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Platforms List */}
          <ScrollView 
            style={styles.platformsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.platformsContent}
          >
            {filteredPlatforms.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#9CA3AF" />
                <Text style={styles.noResultsTitle}>No platforms found</Text>
                <Text style={styles.noResultsSubtitle}>
                  Try searching with different keywords
                </Text>
              </View>
            ) : (
              categoryOrder.map(category => renderCategorySection(category))
            )}
            
            {/* Recommended Section */}
            {searchQuery === '' && selectedPlatforms.length > 0 && (
              <View style={styles.recommendedSection}>
                <Text style={styles.recommendedTitle}>💡 Recommended for you</Text>
                <Text style={styles.recommendedText}>
                  Based on your selections, consider adding these platforms to maximize your reach.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                selectedPlatforms.length === 0 && styles.continueButtonDisabled
              ]}
              onPress={handleContinue}
              disabled={selectedPlatforms.length === 0 || isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={
                  selectedPlatforms.length > 0 && !isLoading 
                    ? ['#4F46E5', '#3B82F6'] 
                    : ['#9CA3AF', '#9CA3AF']
                }
                style={styles.continueGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View 
                      style={[
                        styles.loadingSpinner,
                        {
                          transform: [{
                            rotate: progressAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0deg', '360deg'],
                            })
                          }]
                        }
                      ]}
                    >
                      <Ionicons name="refresh" size={20} color="white" />
                    </Animated.View>
                    <Text style={styles.continueButtonText}>Saving...</Text>
                  </View>
                ) : (
                  <Text style={styles.continueButtonText}>
                    Continue with {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            
            {selectedPlatforms.length === 0 && (
              <Text style={styles.helperText}>
                Select at least one platform to continue
              </Text>
            )}
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  skipButton: {
    padding: 8,
    marginRight: -8,
  },
  skipText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedCount: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '500',
  },
  platformsContainer: {
    flex: 1,
  },
  platformsContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  platformItemSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#F8FAFF',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.1,
  },
  platformContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  platformIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  platformPlaceholder: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  recommendedSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  recommendedText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  continueButton: {
    borderRadius: 12,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  continueButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  continueGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    marginRight: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});