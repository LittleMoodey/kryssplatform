import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import ThemedText from "./ThemedText";
import { useAppColors } from "../hooks/useAppColors";

const AppInput = ({
  label,
  error,
  style,
  containerStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const theme = useAppColors();
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? theme.error
    : focused
      ? theme.inputFocused
      : theme.inputBorder;

  return (
    <View style={containerStyle}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <TextInput
        {...props}
        placeholderTextColor={theme.placeholder}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackground,
            color: theme.text,
            borderColor,
          },
          style,
        ]}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
      />

      {error && (
        <ThemedText style={[styles.error, { color: theme.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    minHeight: 48,
  },
  error: {
    fontSize: 12,
    marginTop: 6,
  },
});

export default AppInput;
