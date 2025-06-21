import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0F172A" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="components/SignIn" />
        <Stack.Screen name="components/SignUp" />
        <Stack.Screen name="components/ProfilePage" />
        <Stack.Screen name="components/AddLinks" />
      </Stack>
    </>
  )
}
