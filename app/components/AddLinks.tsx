"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { useCallback, useEffect, useMemo, useState } from "react"
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
} from "react-native"
import PlatformModal from "./PlatformModal"

const { width, height } = Dimensions.get("window")

interface Platform {
  id: string
  name: string
  icon: string
  category: "essential" | "social" | "professional" | "creative"
  color: string
  placeholder?: string
}

interface PlatformData {
  id: string
  name: string
  value: string
}

const platforms: Platform[] = [
  {
    id: "website",
    name: "Website",
    icon: "globe-outline",
    category: "essential",
    color: "#F59E0B",
    placeholder: "https://yourwebsite.com",
  },
  {
    id: "email",
    name: "Email",
    icon: "mail-outline",
    category: "essential",
    color: "#FBBF24",
    placeholder: "your@email.com",
  },
  {
    id: "phone",
    name: "Phone",
    icon: "call-outline",
    category: "essential",
    color: "#F59E0B",
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: "logo-whatsapp",
    category: "essential",
    color: "#25D366",
    placeholder: "+1 (555) 123-4567",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "logo-instagram",
    category: "social",
    color: "#E4405F",
    placeholder: "@username",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "logo-twitter",
    category: "social",
    color: "#1DA1F2",
    placeholder: "@username",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "logo-linkedin",
    category: "professional",
    color: "#0077B5",
    placeholder: "linkedin.com/in/username",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "logo-facebook",
    category: "social",
    color: "#1877F2",
    placeholder: "facebook.com/username",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "logo-youtube",
    category: "creative",
    color: "#FF0000",
    placeholder: "youtube.com/@channel",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "musical-notes-outline",
    category: "social",
    color: "#000000",
    placeholder: "@username",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "logo-github",
    category: "professional",
    color: "#333333",
    placeholder: "github.com/username",
  },
  {
    id: "discord",
    name: "Discord",
    icon: "logo-discord",
    category: "social",
    color: "#5865F2",
    placeholder: "discord.gg/invite",
  },
]

export default function AddLinksScreen() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null)

  // Animations
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  const [progressAnim] = useState(new Animated.Value(0))

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
    ]).start()
  }, [])

  const handleGoBack = () => {
    router.back()
  }

  const navigateToNextStep = useCallback(() => {
    try {
      router.push("/components/ProfilePage")
    } catch (error) {
      console.log("Navigation error:", error)
      Alert.alert("Navigation Error", "Unable to proceed to the next step.", [{ text: "OK" }])
    }
  }, [])

  const handleSkip = () => {
    Alert.alert("Skip This Step?", "You can always add links later in your profile settings.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Skip",
        style: "default",
        onPress: navigateToNextStep,
      },
    ])
  }

  const handleContinue = async () => {
    if (selectedPlatforms.length === 0) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Selected platforms:", selectedPlatforms)
      navigateToNextStep()
    } catch (error) {
      console.error("Error saving platforms:", error)
      Alert.alert("Error", "Failed to save your preferences. Please try again.", [{ text: "OK" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlatformPress = useCallback(
    (platform: Platform) => {
      const isSelected = selectedPlatforms.some((p) => p.id === platform.id)

      if (isSelected) {
        // Remove platform
        setSelectedPlatforms((prev) => prev.filter((p) => p.id !== platform.id))
      } else {
        // Open modal to add platform details
        setSelectedPlatform(platform)
        setModalVisible(true)
      }
    },
    [selectedPlatforms],
  )

  const handleModalSave = useCallback((platformId: string, data: { name: string; value: string }) => {
    setSelectedPlatforms((prev) => [
      ...prev.filter((p) => p.id !== platformId),
      {
        id: platformId,
        name: data.name,
        value: data.value,
      },
    ])
    setModalVisible(false)
    setSelectedPlatform(null)
  }, [])

  const handleModalClose = useCallback(() => {
    setModalVisible(false)
    setSelectedPlatform(null)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])

  const filteredPlatforms = useMemo(
    () => platforms.filter((platform) => platform.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  )

  const platformsByCategory = useMemo(() => {
    const grouped = filteredPlatforms.reduce(
      (acc, platform) => {
        if (!acc[platform.category]) {
          acc[platform.category] = []
        }
        acc[platform.category].push(platform)
        return acc
      },
      {} as Record<string, Platform[]>,
    )
    return grouped
  }, [filteredPlatforms])

  const categoryOrder = ["essential", "social", "professional", "creative"]
  const categoryLabels = {
    essential: "Essential",
    social: "Social Media",
    professional: "Professional",
    creative: "Creative & Content",
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 3],
    outputRange: ["0%", "66.66%"],
  })

  const renderPlatformItem = ({ item }: { item: Platform }) => {
    const isSelected = selectedPlatforms.some((p) => p.id === item.id)
    const selectedData = selectedPlatforms.find((p) => p.id === item.id)

    return (
      <TouchableOpacity
        style={[styles.platformItem, isSelected && styles.platformItemSelected]}
        onPress={() => handlePlatformPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.platformContent}>
          <View style={[styles.platformIcon, { backgroundColor: `${item.color}15` }]}>
            <Ionicons name={item.icon as any} size={24} color={item.color} />
          </View>
          <View style={styles.platformInfo}>
            <Text style={styles.platformName}>{isSelected && selectedData ? selectedData.name : item.name}</Text>
            {isSelected && selectedData ? (
              <Text style={styles.platformValue}>{selectedData.value}</Text>
            ) : (
              item.placeholder && <Text style={styles.platformPlaceholder}>{item.placeholder}</Text>
            )}
          </View>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected ? (
            <Ionicons name="checkmark" size={16} color="#0F172A" />
          ) : (
            <Ionicons name="add" size={16} color="rgba(255, 255, 255, 0.5)" />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  const renderCategorySection = (category: string) => {
    const categoryPlatforms = platformsByCategory[category]
    if (!categoryPlatforms || categoryPlatforms.length === 0) return null

    return (
      <View key={category} style={styles.section}>
        <Text style={styles.sectionTitle}>{categoryLabels[category as keyof typeof categoryLabels]}</Text>
        <FlatList
          data={categoryPlatforms}
          renderItem={renderPlatformItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
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
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Add Your Links</Text>
              <Text style={styles.headerSubtitle}>Choose platforms to connect</Text>
            </View>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Step 2 of 3</Text>
              <Text style={styles.selectedCount}>
                {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""} added
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground} />
              <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search platforms..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#64748B"
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Ionicons name="close-circle" size={20} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Platforms List */}
          <ScrollView
            style={styles.platformsContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.platformsContent}
          >
            {filteredPlatforms.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Ionicons name="search" size={48} color="#64748B" />
                <Text style={styles.noResultsTitle}>No platforms found</Text>
                <Text style={styles.noResultsSubtitle}>Try searching with different keywords</Text>
              </View>
            ) : (
              categoryOrder.map((category) => renderCategorySection(category))
            )}
          </ScrollView>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, selectedPlatforms.length === 0 && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={selectedPlatforms.length === 0 || isLoading}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={selectedPlatforms.length > 0 && !isLoading ? ["#F59E0B", "#FBBF24"] : ["#64748B", "#64748B"]}
                style={styles.continueGradient}
              >
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <Text style={styles.continueButtonText}>Saving...</Text>
                  </View>
                ) : (
                  <Text style={styles.continueButtonText}>
                    Continue with {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? "s" : ""}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {selectedPlatforms.length === 0 && (
              <Text style={styles.helperText}>Add at least one platform to continue</Text>
            )}
          </View>
        </Animated.View>

        {/* Platform Modal */}
        <PlatformModal
          visible={modalVisible}
          platform={selectedPlatform}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
  skipButton: {
    padding: 8,
    marginRight: -8,
  },
  skipText: {
    fontSize: 16,
    color: "#F59E0B",
    fontWeight: "500",
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  selectedCount: {
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "500",
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    position: "relative",
    overflow: "hidden",
  },
  progressBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 2,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
  },
  clearButton: {
    padding: 4,
  },
  platformsContainer: {
    flex: 1,
  },
  platformsContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  platformItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  platformItemSelected: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
  },
  platformContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  platformIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  platformPlaceholder: {
    fontSize: 12,
    color: "#64748B",
  },
  platformValue: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "500",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
  buttonContainer: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  continueButton: {
    borderRadius: 12,
    shadowColor: "#F59E0B",
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
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  continueButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  helperText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
  },
})
