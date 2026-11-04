import { Pressable, StyleSheet, View } from "react-native";
import ThemedText from "./ThemedText";
import { useAppColors } from "../hooks/useAppColors";

const ChallengeCard = ({ challenge, status = "not-started", onPress }) => {
  const theme = useAppColors();

  const statusKey = String(status)
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  const statuses = {
    "not-started": {
      label: "Not Started",
      background: theme.uiBackground,
      color: theme.mutedText,
    },
    "in-progress": {
      label: "In Progress",
      background: theme.warningBackground,
      color: theme.warningText,
    },
    completed: {
      label: "Completed",
      background: theme.successBackground,
      color: theme.success,
    },
  };

  const currentStatus = statuses[statusKey] ?? statuses["not-started"];

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={`${challenge.title}, ${currentStatus.label}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.header}>
        <ThemedText title style={styles.title}>
          {challenge.title}
        </ThemedText>

        <View
          style={[styles.badge, { backgroundColor: currentStatus.background }]}
        >
          <ThemedText
            style={[styles.badgeText, { color: currentStatus.color }]}
          >
            {currentStatus.label}
          </ThemedText>
        </View>
      </View>

      <ThemedText muted numberOfLines={2} style={styles.description}>
        {challenge.description}
      </ThemedText>

      {typeof challenge.completionRadius === "number" && (
        <ThemedText style={styles.location}>
          📍 {challenge.completionRadius} m completion radius
        </ThemedText>
      )}

      <ThemedText style={[styles.link, { color: theme.iconColorFocused }]}>
        View Challenge ›
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  location: {
    fontSize: 12,
  },
  link: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default ChallengeCard;
