import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import AppButton from "../../components/AppButton";
import DirectionsMap from "../../components/Map-components/DirectionsMap";
import { challengesdata } from "../../data/mochdata";
import { useAppColors } from "../../hooks/useAppColors";

export default function ResolveChallenge() {
  const theme = useAppColors();               //lyse og mørke farger automatisk
  const { id } = useLocalSearchParams();
  const challenge = challengesdata.find((c) => c.id === id);

  const [isInside, setIsInside] = useState(false);  // er brukeren på stedet?
  const [myPos, setMyPos] = useState<Location.LocationObjectCoords | null>(null);  // hvor brukeren står

  // Spør om lov og hent posisjonen din
  useEffect(() => {
  (async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Tillatelse avvist", "Appen trenger tilgang til posisjonen din.");
        return;
      }
      const pos = await Location.getCurrentPositionAsync();
      setMyPos(pos.coords);
  
    } catch (error) {
      console.log("Kunne ikke hente posisjon:", error);
    }
  })();
}, []);

  if (!challenge) return null;

  return (
    <ThemedView style={styles.container}>
      {/* Tilbake knapp */}
      <Pressable onPress={() => router.back()}>
        <Ionicons name="close" size={26} color={theme.iconColor} />
      </Pressable>

      {/* Tittel og status */}
      <ThemedText title style={styles.title}>
        {`${challenge.title}`}
      </ThemedText>
      <ThemedText style={styles.text}>
        {isInside ? " Du er på riktig sted!" : ` Gå til ${challenge.address}`}
      </ThemedText>

      {/* Kart med gangrute */}
      <View style={[styles.mapBox, { borderColor: theme.border }]}>
        <DirectionsMap
          from={myPos}
          to={challenge}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Knapper */}
      <AppButton
        style={styles.button}
        title="Use Mock Location"
        variant="secondary"
        onPress={() => setIsInside(true)}
      />
      <AppButton 
        style={styles.button}
        title="Next"
        disabled={!isInside}
        onPress={() => Alert.alert("Neste steg", "Photo-steget kommer her")}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40, 
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  text: {
    fontSize: 16,
  },
  mapBox: {
    flex: 1, 
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  button: {
    marginTop: 10,
  },
});