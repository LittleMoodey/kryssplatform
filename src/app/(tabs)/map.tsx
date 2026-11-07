import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemedText from "../../components/ThemedText";
import AppButton from "../../components/AppButton";
import ChallengeMap from "../../components/Map-components/ChallengeMap";
import { challengesdata } from "../../data/mochdata";
import { useAppColors } from "../../hooks/useAppColors";
import { getCurrentLocation, type Coordinates } from "../../utils/location";

export default function Map() {
  const theme = useAppColors();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [myPos, setMyPos] = useState<Coordinates | null>(null);

  // Velg utfordringen som ble sendt fra lista
  useEffect(() => {
    if (id) setSelectedId(id);
  }, [id]);

  // Spør om lov og hent posisjonen din
  useEffect(() => {
    getCurrentLocation()
      .then(setMyPos)
      .catch((error) => console.log("Kunne ikke hente posisjon:", error));
  }, []);

  const selected = challengesdata.find((c) => c.id === selectedId);

  return (
    <View style={styles.container}>
      <ChallengeMap
        challenges={challengesdata}
        focus={selected}
        userPos={myPos}
        onSelect={setSelectedId}
        style={StyleSheet.absoluteFill}
      />

      {selected && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.cardBackground, borderColor: theme.border },
          ]}
        >
          <Pressable
            style={styles.row}
            onPress={() => router.push(`/challenge/${selected.id}`)}
          >
            <Image source={{ uri: selected.imageUrl }} style={styles.image} />
            <View style={styles.info}>
              <ThemedText title style={styles.title} numberOfLines={2}>
                {selected.title}
              </ThemedText>
              <ThemedText style={styles.text}>{selected.distance} km</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.iconColor} />
          </Pressable>

          <AppButton
            style={styles.button}
            title="Start Challenge"
            onPress={() => router.push(`/resolve/${selected.id}`)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  row: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12 
  },
  image: { 
    width: 64, 
    height: 64, 
    borderRadius: 10 
  },
  info: { 
    flex: 1, 
    gap: 4 
  },
  title: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  text: { 
    fontSize: 14, 
    color: "#666" 
  },
  button: { 
    marginTop: 8 
  },
});