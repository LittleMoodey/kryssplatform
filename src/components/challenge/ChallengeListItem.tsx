import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_COLORS } from "../../constants/challengeStatus";
import { Challenge, ChallengeStatus } from "../../types/challenge";
import { formatDistance } from "../../utils/location";
import { StatusBadge } from "./StatusBadge";

type Props = {
  challenge: Challenge;
  status: ChallengeStatus;
  distanceMeters?: number; // mangler hvis vi ikke vet hvor brukeren er ennå
  onPress: (id: string) => void;
};

// Ett kort i utfordringslisten. Trykk på kortet åpner utfordringen.
export function ChallengeListItem({ challenge, status, distanceMeters, onPress }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onPress(challenge.id)}
      accessibilityRole="button"
      accessibilityLabel={`Open challenge ${challenge.title}`}
    >
      {/* Farget ikon til venstre, i samme farge som markøren på kartet */}
      <View style={[styles.icon, { backgroundColor: STATUS_COLORS[status].light }]}>
        <Ionicons name="flag" size={22} color={STATUS_COLORS[status].main} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {challenge.title}
        </Text>
        <Text style={styles.meta}>
          {CATEGORY_LABELS[challenge.category]} · {DIFFICULTY_LABELS[challenge.difficulty]} · {challenge.points} p
        </Text>

        <View style={styles.footer}>
          <View style={styles.distance}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.meta}>
              {distanceMeters !== undefined ? formatDistance(distanceMeters) : "–"}
            </Text>
          </View>
          <StatusBadge status={status} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: { opacity: 0.8 },
  icon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 4 },
  title: { fontSize: 16, fontWeight: "700", color: "#222" },
  meta: { fontSize: 13, color: "#666" },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  distance: { flexDirection: "row", alignItems: "center", gap: 4 },
});