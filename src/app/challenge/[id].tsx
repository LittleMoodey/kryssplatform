import { Ionicons } from "@expo/vector-icons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBadge } from "../../components/challenge/StatusBadge";
import { ChallengeMap } from "../../components/map/ChallengeMap";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, STATUS_COLORS } from "../../constants/challengeStatus";
import { getChallengeById, getChallengeStatus } from "../../data/sampleChallenges";
import { useUserLocation } from "../../hooks/useUserLocation";
import { distanceInMeters, formatDistance } from "../../utils/location";

const PRIMARY = "#a85ef7";

// Krav 2 – Detaljer for én utfordring.
// [id] i filnavnet betyr at id-en kommer fra adressen, f.eks. /challenge/opera-roof.
export default function ChallengeDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const challenge = getChallengeById(id);
  const { position } = useUserLocation();

  // Feil id i adressen: vis en melding i stedet for å krasje
  if (!challenge) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={40} color="#999" />
          <Text style={styles.muted}>This challenge does not exist.</Text>
        </View>
      </View>
    );
  }

  const status = getChallengeStatus(challenge.id);
  const distance = position ? distanceInMeters(position, challenge.location) : undefined;
  const isInside = distance !== undefined && distance <= challenge.radiusMeters;
  const isCompleted = status === "completed";

  // Selve løse-flyten (posisjon → bilde → svar) kobles på her når løse-skjermen er lagt inn
  function handleStart() {
    const message = "The resolve screen is not built yet.";
    if (Platform.OS === "web") window.alert(message);
    else Alert.alert("Coming soon", message);
  }

  return (
    <View style={styles.screen}>
      {/* Skjul iOS sin egen topplinje. Vi bruker vår egen ScreenHeader i stedet,
          så innholdet aldri havner bak topplinjen. */}
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader />

      {/* contentInsetAdjustmentBehavior="never": iOS skal ikke flytte innholdet selv */}
      <ScrollView contentContainerStyle={styles.content} contentInsetAdjustmentBehavior="never">
        <Text style={styles.title}>{challenge.title}</Text>
        <View style={styles.chips}>
          <StatusBadge status={status} />
          <Text style={styles.chip}>{CATEGORY_LABELS[challenge.category]}</Text>
          <Text style={styles.chip}>{DIFFICULTY_LABELS[challenge.difficulty]}</Text>
          <Text style={styles.chip}>{challenge.points} points</Text>
        </View>

        <Text style={styles.description}>{challenge.description}</Text>

        {/* Lite kart med målet, radiusen og brukeren */}
        <View style={styles.mapWrapper}>
          <ChallengeMap
            markers={[
              {
                id: challenge.id,
                title: challenge.title,
                location: challenge.location,
                radiusMeters: challenge.radiusMeters,
                color: STATUS_COLORS[status].main,
              },
            ]}
            userLocation={position}
            center={challenge.location}
            zoom={15}
            height={170}
          />
        </View>

        <InfoRow
          icon="location-outline"
          label="Target location"
          value={`${challenge.location.latitude.toFixed(4)}, ${challenge.location.longitude.toFixed(4)}`}
        />
        <InfoRow icon="radio-button-on-outline" label="Completion radius" value={`${challenge.radiusMeters} meters`} />
        <InfoRow
          icon="navigate-outline"
          label="Distance from you"
          value={
            distance === undefined
              ? "Finding your location…"
              : `${formatDistance(distance)}${isInside ? " – you are inside the area!" : ""}`
          }
        />
        <InfoRow icon="help-circle-outline" label="Question" value={challenge.question} />

        {/* Fullførte utfordringer kan ikke startes på nytt */}
        <Pressable
          style={({ pressed }) => [styles.button, isCompleted && styles.buttonDone, pressed && { opacity: 0.85 }]}
          onPress={handleStart}
          disabled={isCompleted}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {isCompleted ? "Completed ✓" : status === "in_progress" ? "Continue challenge" : "Start challenge"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// Én rad med ikon, overskrift og verdi
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color={PRIMARY} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f3f8" },
  content: { padding: 16, paddingBottom: 32, gap: 10, maxWidth: 700, width: "100%", alignSelf: "center" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  title: { fontSize: 24, fontWeight: "800", color: "#222" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" },
  chip: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    backgroundColor: "#ebe7f1",
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
    overflow: "hidden",
  },
  description: { fontSize: 15, lineHeight: 21, color: "#333" },
  mapWrapper: { borderRadius: 12, overflow: "hidden" },
  row: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 13, fontWeight: "700", color: "#222" },
  rowValue: { fontSize: 14, color: "#555" },
  muted: { fontSize: 15, color: "#777" },
  button: { backgroundColor: PRIMARY, borderRadius: 12, padding: 15, alignItems: "center", marginTop: 4 },
  buttonDone: { backgroundColor: "#2e8b3d" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
});

// Egen topplinje med tilbakeknapp. useSafeAreaInsets gir høyden på klokka øverst,
// så linjen havner rett under den og innholdet aldri gjemmer seg bak noe.
function ScreenHeader() {
  const insets = useSafeAreaInsets();

  // Tilbake til forrige fane. Er appen lastet på nytt mens man står her,
  // finnes det ingen forrige skjerm, og da går vi rett til Challenges.
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace("/challenges");
  }

  return (
    <View style={[headerStyles.header, { paddingTop: insets.top + 6 }]}>
      <Pressable
        onPress={goBack}
        style={headerStyles.backButton}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={10}
      >
        <Ionicons name="chevron-back" size={24} color={PRIMARY} />
        <Text style={headerStyles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { flexDirection: "row", alignItems: "center" },
  backText: { color: PRIMARY, fontSize: 17 },
});