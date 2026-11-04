import { StyleSheet, Text, View } from "react-native";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants/challengeStatus";
import { ChallengeStatus } from "../../types/challenge";

// Liten farget merkelapp som viser status, f.eks. "In progress".
// Brukes både på kartet og på detaljskjermen, så den ligger i en egen komponent.
export function StatusBadge({ status }: { status: ChallengeStatus }) {
  const color = STATUS_COLORS[status];
  return (
    <View style={[styles.badge, { backgroundColor: color.light }]}>
      <Text style={[styles.text, { color: color.main }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: "flex-start", borderRadius: 999, paddingVertical: 3, paddingHorizontal: 10 },
  text: { fontSize: 12, fontWeight: "700" },
});