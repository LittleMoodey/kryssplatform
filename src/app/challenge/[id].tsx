import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import AppButton from "../../components/AppButton";
import { challengesdata } from "../../data/mochdata";
import { useAppColors } from "../../hooks/useAppColors";

export default function ChallengeDetail() {
  const theme = useAppColors();               // lyse eller mørke farger automatisk
  const { id } = useLocalSearchParams();
  const challenge = challengesdata.find((c) => c.id === id);

  if (!challenge) return null;

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Tilbakepil */}
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.iconColor} />
        </Pressable>

        {/* Bilde */}
        <Image source={{ uri: challenge.imageUrl }} style={styles.image} />

        {/* Tittel */}
        <ThemedText title style={styles.title}>
          {challenge.title}
        </ThemedText>

        {/* Avstand */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={theme.mutedText} />
          <ThemedText style={{ color: theme.mutedText }}>{challenge.distance} km</ThemedText>
        </View>

        {/* Beskrivelse */}
        <ThemedText style={{ color: theme.mutedText }}>{challenge.description}</ThemedText>

        {/* Infoboks */}
        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.cardBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText style={styles.label}>Location</ThemedText>
          <ThemedText style={{ color: theme.mutedText }}>{challenge.address}</ThemedText>
        </View>
      </ScrollView>

      {/* Knapp i bunnen */}
      <View style={styles.footer}>
        <AppButton
          style={styles.button}
          title="Start Challenge"
          onPress={() => router.push(`/resolve/${challenge.id}`)}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60,
    gap: 12,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
  },
  label: {
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
  },
  button: {
    marginTop: 10,
  }
});