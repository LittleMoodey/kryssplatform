import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChallengeMap } from "../../components/map/ChallengeMap";
import type { Coordinates } from "../../utils/location";

const PRIMARY = "#a85ef7";
const OSLO_CENTER = { latitude: 59.9139, longitude: 10.7522 };

// Velg en posisjon for en ny utfordring ved å trykke på kartet.
// Bruker samme ChallengeMap som kartfanen, så skjermen virker både på mobil og web.
// Skjemaet (tittel, beskrivelse, spørsmål, radius) kommer senere.
export default function Create() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Coordinates | null>(null);

  return (
    <View style={styles.screen}>
      <ChallengeMap
        markers={selected ? [{ id: "new", title: "Selected location", location: selected, color: PRIMARY }] : []}
        center={OSLO_CENTER}
        zoom={13}
        height="100%"
        onMapPress={setSelected}
      />

      <View style={[styles.hint, { top: insets.top + 8 }]} pointerEvents="none">
        <Text style={styles.hintText}>
          {selected
            ? `Selected: ${selected.latitude.toFixed(5)}, ${selected.longitude.toFixed(5)}`
            : "Tap the map to choose the challenge location"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  hint: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 1000,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  hintText: { fontSize: 14, color: "#333", textAlign: "center" },
});