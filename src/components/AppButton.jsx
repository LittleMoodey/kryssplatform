import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useAppColors } from "../hooks/useAppColors";

const AppButton = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
}) => {
  const theme = useAppColors();
  const isDisabled = disabled || loading;

  const backgroundColor = isDisabled
    ? theme.buttonDisabled
    : variant === "secondary"
      ? theme.buttonSecondary
      : theme.buttonPrimary;

  const textColor = isDisabled
    ? theme.buttonDisabledText
    : variant === "secondary"
      ? theme.buttonSecondaryText
      : theme.buttonPrimaryText;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        style,
        pressed && !isDisabled && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AppButton;
