import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "./ThemedText";
import { useAppColors } from "../hooks/useAppColors";

const ChallengeCard = ({ challenge, status = "not-started", onPress }) => {
  const theme = useAppColors();

  const statusKey = String(status)
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

  const statuses = {
    "not-started": {
      label: "Not started",
      background: theme.uiBackground,
      color: theme.mutedText,
    },
    "in-progress": {
      label: "In progress",
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
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      {/* VENSTRE: bilde */}
      {challenge.imageUrl && (
        <Image
          source={{ uri: challenge.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* HØYRE: tekst */}
      <View style={styles.info}>
        <ThemedText title numberOfLines={2} style={styles.title}>
          {challenge.title}
        </ThemedText>

        {/* Beskrivelse */}
        <ThemedText muted numberOfLines={1} style={styles.small}>
          {challenge.description}
        </ThemedText>

        {/* Nederste rad: avstand til venstre, status til høyre */}
        <View style={styles.bottomRow}>
          {typeof challenge.distance === "number" ? (
            <View style={styles.row}>
              <Ionicons name="location-outline" size={14} color={theme.mutedText} />
              <ThemedText style={styles.small}>{challenge.distance} km</ThemedText>
            </View>
          ) : (
            <View />
          )}

          <View style={[styles.badge, { backgroundColor: currentStatus.background }]}>
            <ThemedText style={[styles.badgeText, { color: currentStatus.color }]}>
              {currentStatus.label}
            </ThemedText>
          </View>

        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", 
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  info: {
    flex: 1, 
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  small: {
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});

export default ChallengeCard;