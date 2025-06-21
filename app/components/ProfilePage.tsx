"use client"

import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import type React from "react"
import { useState, useEffect } from "react"
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  SafeAreaView,
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

const ProfileEditScreen: React.FC = () => {
  const [username, setUsername] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    requestPermissions()
  }, [])

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "We need camera and photo library permissions to let you upload a profile picture.",
          [{ text: "OK" }],
        )
      }
    }
  }

  const handleSaveAndContinue = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username is required")
      return
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/
    if (!usernameRegex.test(username.trim())) {
      Alert.alert("Error", "Username can only contain letters, numbers, underscores, and hyphens")
      return
    }

    try {
      setIsLoading(true)

      const profileData = {
        username: username.trim().toLowerCase(),
        organizationName: organizationName.trim(),
        bio: bio.trim(),
        location: location.trim(),
        profileImage,
        profileUrl: `app.me/${username.trim().toLowerCase()}`,
      }

      console.log("Saving profile data:", profileData)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      router.push("/components/AddLinks")
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery")
    }
  }

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      })

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    }
  }

  const handleImagePicker = () => {
    Alert.alert("Select Profile Picture", "Choose how you want to add your profile picture", [
      {
        text: "Take Photo",
        onPress: takePhoto,
        style: "default",
      },
      {
        text: "Choose from Gallery",
        onPress: pickImageFromGallery,
        style: "default",
      },
      ...(profileImage
        ? [
            {
              text: "Remove Photo",
              onPress: () => setProfileImage(null),
              style: "destructive" as const,
            },
          ]
        : []),
      {
        text: "Cancel",
        style: "cancel" as const,
      },
    ])
  }

  const handleBack = () => {
    router.back()
  }

  const handleUsernameChange = (text: string) => {
    const cleanText = text.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase()
    setUsername(cleanText)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent={false} />
      <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.gradient}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text style={styles.subtitle}>Edit your Profile</Text>

            {/* Profile Image Section */}
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={handleImagePicker} style={styles.imageWrapper}>
                {profileImage ? (
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Ionicons name="person" size={40} color="#F59E0B" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={16} color="#0F172A" />
                </View>
              </TouchableOpacity>
              <Text style={styles.imageHint}>Tap to add profile picture</Text>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Step 1 of 3</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Username Input */}
              <View style={styles.usernameContainer}>
                <Text style={styles.inputLabel}>Your Profile URL</Text>
                <View style={styles.usernameInputWrapper}>
                  <Text style={styles.staticPrefix}>app.me/</Text>
                  <TextInput
                    style={styles.usernameInput}
                    placeholder="username"
                    value={username}
                    onChangeText={handleUsernameChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={30}
                    placeholderTextColor="#64748B"
                  />
                </View>
                {username.length > 0 && (
                  <Text style={styles.urlPreview}>Your profile will be available at: app.me/{username}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Organization Name (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter organization name"
                  value={organizationName}
                  onChangeText={setOrganizationName}
                  maxLength={50}
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  placeholder="Tell people about yourself..."
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={150}
                  placeholderTextColor="#64748B"
                />
                <Text style={styles.characterCount}>{bio.length}/150</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your location"
                  value={location}
                  onChangeText={setLocation}
                  maxLength={50}
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, (!username.trim() || isLoading) && styles.saveButtonDisabled]}
              onPress={handleSaveAndContinue}
              disabled={!username.trim() || isLoading}
            >
              <LinearGradient
                colors={!username.trim() || isLoading ? ["#64748B", "#64748B"] : ["#F59E0B", "#FBBF24"]}
                style={styles.saveGradient}
              >
                <Text style={[styles.saveButtonText, (!username.trim() || isLoading) && styles.saveButtonTextDisabled]}>
                  {isLoading ? "Saving..." : "Save & Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageWrapper: {
    position: "relative",
    marginBottom: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#F59E0B",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F59E0B",
    borderStyle: "dashed",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F59E0B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#0F172A",
  },
  imageHint: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  progressText: {
    fontSize: 14,
    color: "#94A3B8",
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
  },
  progressFill: {
    width: "33.33%",
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 2,
  },
  formContainer: {
    gap: 16,
    marginBottom: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#FFFFFF",
  },
  usernameContainer: {
    gap: 8,
  },
  usernameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  staticPrefix: {
    fontSize: 16,
    color: "#94A3B8",
    fontWeight: "500",
  },
  usernameInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 0,
    padding: 0,
  },
  urlPreview: {
    fontSize: 12,
    color: "#F59E0B",
    marginLeft: 4,
    fontWeight: "500",
  },
  bioInput: {
    height: 80,
    paddingTop: 12,
  },
  characterCount: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "right",
    marginTop: 4,
  },
  saveButton: {
    borderRadius: 12,
    shadowColor: "#F59E0B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  saveGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonTextDisabled: {
    color: "#94A3B8",
  },
})

export default ProfileEditScreen
