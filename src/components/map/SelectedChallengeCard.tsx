import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_LABELS, STATUS_COLORS } from "../../constants/challengeStatus";
import { Challenge, ChallengeStatus } from "../../types/challenge";
import { formatDistance } from "../../utils/location";
import { StatusBadge } from "../challenge/StatusBadge";

type Props = {
  challenge: Challenge;
  status: ChallengeStatus;
  distanceMeters?: number; // mangler hvis vi ikke vet hvor brukeren er
  onPress: () => void;
};

// Kortet nederst på kartet som vises når brukeren trykker på en markør.
// Trykk på kortet åpner utfordringen.
export function SelectedChallengeCard({ challenge, status, distanceMeters, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Open challenge ${challenge.title}`}
    >
      {/* Farget stripe til venstre som matcher markørens farge */}
      <View style={[styles.stripe, { backgroundColor: STATUS_COLORS[status].main }]} />

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {challenge.title}
        </Text>
        <Text style={styles.meta}>
          {CATEGORY_LABELS[challenge.category]} · {challenge.points} points
          {distanceMeters !== undefined ? ` · ${formatDistance(distanceMeters)} away` : ""}
        </Text>
        <StatusBadge status={status} />
      </View>

      <Ionicons name="chevron-forward" size={22} color="#999" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    paddingRight: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  pressed: { opacity: 0.85 },
  stripe: { width: 6, alignSelf: "stretch" },
  body: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, gap: 4 },
  title: { fontSize: 16, fontWeight: "700", color: "#222" },
  meta: { fontSize: 13, color: "#666" },
});