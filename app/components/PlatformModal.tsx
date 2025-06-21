"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

interface Platform {
  id: string
  name: string
  icon: string
  color: string
  placeholder?: string
}

interface PlatformModalProps {
  visible: boolean
  platform: Platform | null
  onClose: () => void
  onSave: (platformId: string, data: { name: string; value: string }) => void
}

const PlatformModal: React.FC<PlatformModalProps> = ({ visible, platform, onClose, onSave }) => {
  const [name, setName] = useState("")
  const [value, setValue] = useState("")
  const [isValid, setIsValid] = useState(false)

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible && platform) {
      // Reset form when modal opens
      setName(platform.name)
      setValue("")

      // Animate modal in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Animate modal out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, platform])

  useEffect(() => {
    // Validate form
    const trimmedName = name.trim()
    const trimmedValue = value.trim()

    if (platform?.id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      setIsValid(trimmedName.length > 0 && emailRegex.test(trimmedValue))
    } else if (platform?.id === "phone" || platform?.id === "whatsapp") {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
      setIsValid(trimmedName.length > 0 && phoneRegex.test(trimmedValue.replace(/\s/g, "")))
    } else if (platform?.id === "website") {
      const urlRegex = /^https?:\/\/.+/
      setIsValid(trimmedName.length > 0 && urlRegex.test(trimmedValue))
    } else {
      setIsValid(trimmedName.length > 0 && trimmedValue.length > 0)
    }
  }, [name, value, platform])

  const handleClose = () => {
    onClose()
  }

  const handleSave = () => {
    if (platform && isValid) {
      onSave(platform.id, { name: name.trim(), value: value.trim() })
      handleClose()
    }
  }

  const handleClearName = () => {
    setName("")
  }

  const handleClearValue = () => {
    setValue("")
  }

  const getPlaceholderText = () => {
    if (!platform) return ""

    switch (platform.id) {
      case "email":
        return "Enter/paste your email address"
      case "phone":
      case "whatsapp":
        return "Enter your phone number"
      case "website":
        return "Enter your website URL"
      case "instagram":
        return "Enter your Instagram username"
      case "twitter":
        return "Enter your Twitter handle"
      case "linkedin":
        return "Enter your LinkedIn profile URL"
      case "facebook":
        return "Enter your Facebook profile URL"
      case "youtube":
        return "Enter your YouTube channel URL"
      case "tiktok":
        return "Enter your TikTok username"
      case "github":
        return "Enter your GitHub profile URL"
      case "discord":
        return "Enter your Discord invite link"
      default:
        return platform.placeholder || "Enter your information"
    }
  }

  const getCharacterCount = () => {
    const maxLength = platform?.id === "email" ? 32 : 50
    return `${value.length}/${maxLength}`
  }

  if (!platform) return null

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.backdropTouchable} activeOpacity={1} onPress={handleClose} />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient colors={["#0F172A", "#1E293B", "#334155"]} style={styles.modalGradient}>
            <SafeAreaView style={styles.safeArea}>
              {/* Handle Bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose} activeOpacity={0.7}>
                  <Ionicons name="close" size={24} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                {/* Platform Icon */}
                <View style={styles.iconContainer}>
                  <View style={[styles.iconWrapper, { backgroundColor: `${platform.color}15` }]}>
                    <Ionicons name={platform.icon as any} size={40} color={platform.color} />
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Add {platform.name}</Text>

                {/* Name Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Display Name</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter display name"
                      placeholderTextColor="#64748B"
                      maxLength={20}
                    />
                    {name.length > 0 && (
                      <TouchableOpacity style={styles.clearButton} onPress={handleClearName}>
                        <Ionicons name="close" size={16} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.characterCount}>{name.length}/20</Text>
                </View>

                {/* Value Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>{platform.name}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={value}
                      onChangeText={setValue}
                      placeholder={getPlaceholderText()}
                      placeholderTextColor="#64748B"
                      keyboardType={
                        platform.id === "email"
                          ? "email-address"
                          : platform.id === "phone" || platform.id === "whatsapp"
                            ? "phone-pad"
                            : platform.id === "website"
                              ? "url"
                              : "default"
                      }
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={platform.id === "email" ? 32 : 50}
                    />
                    {value.length > 0 && (
                      <TouchableOpacity style={styles.clearButton} onPress={handleClearValue}>
                        <Ionicons name="close" size={16} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={styles.characterCount}>{getCharacterCount()}</Text>
                </View>
              </View>

              {/* Save Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
                  onPress={handleSave}
                  disabled={!isValid}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={isValid ? ["#F59E0B", "#FBBF24"] : ["#64748B", "#64748B"]}
                    style={styles.saveGradient}
                  >
                    <Text style={[styles.saveButtonText, !isValid && styles.saveButtonTextDisabled]}>Add Link</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalGradient: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  safeArea: {
    flex: 1,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#64748B",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    paddingRight: 10,
  },
  clearButton: {
    padding: 4,
  },
  characterCount: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "right",
    marginTop: 4,
    marginRight: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 12,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  saveButtonTextDisabled: {
    color: "#94A3B8",
  },
})

export default PlatformModal
