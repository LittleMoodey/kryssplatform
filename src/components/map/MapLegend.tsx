import { StyleSheet, Text, View } from "react-native";
import { STATUS_COLORS, STATUS_LABELS, USER_LOCATION_COLOR } from "../../constants/challengeStatus";
import { ChallengeStatus } from "../../types/challenge";

const STATUSES: ChallengeStatus[] = ["not_started", "in_progress", "completed"];

// Forklaringen øverst til venstre på kartet: hva betyr hver farge?
export function MapLegend() {
  return (
    // pointerEvents="none": trykk går rett gjennom forklaringen og ned til kartet
    <View style={styles.legend} pointerEvents="none">
      {STATUSES.map((status) => (
        <LegendRow key={status} color={STATUS_COLORS[status].main} label={STATUS_LABELS[status]} />
      ))}
      <LegendRow color={USER_LOCATION_COLOR} label="Your location" />
    </View>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 13, color: "#222" },
});
