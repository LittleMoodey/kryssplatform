import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ animation: "fade_from_bottom", headerShown: false}}>
      <Stack.Screen name="login" options={{ title: "authenticate" }} />
    </Stack>
  )
}
