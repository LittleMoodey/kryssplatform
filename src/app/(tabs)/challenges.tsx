import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChallengeListItem } from "../../components/challenge/ChallengeListItem";
import { STATUS_COLORS, STATUS_LABELS } from "../../constants/challengeStatus";
import { getAllChallenges, getChallengeStatus } from "../../data/sampleChallenges";
import { useUserLocation } from "../../hooks/useUserLocation";
import { ChallengeStatus } from "../../types/challenge";
import { distanceInMeters } from "../../utils/location";

const PRIMARY = "#a85ef7";

// "all" = vis alle, ellers bare utfordringer med den statusen
type Filter = "all" | ChallengeStatus;
const FILTERS: Filter[] = ["all", "not_started", "in_progress", "completed"];
const FILTER_LABELS: Record<Filter, string> = { all: "All", ...STATUS_LABELS };

// Krav 1 – Oversikt over utfordringer med brukerens egen status.
// Trykk på en utfordring åpner detaljene. Pluss-knappen lager en ny utfordring.
export default function Challenges() {
  const insets = useSafeAreaInsets();
  const { position } = useUserLocation();
  const [filter, setFilter] = useState<Filter>("all");

  const challenges = getAllChallenges();

  // Antall per status, til oppsummeringen øverst
  const counts: Record<ChallengeStatus, number> = { not_started: 0, in_progress: 0, completed: 0 };
  for (const challenge of challenges) counts[getChallengeStatus(challenge.id)]++;

  // Filtrer på valgt status. Vet vi hvor brukeren er, sorteres nærmeste først.
  const visible = challenges
    .filter((challenge) => filter === "all" || getChallengeStatus(challenge.id) === filter)
    .map((challenge) => ({
      challenge,
      distance: position ? distanceInMeters(position, challenge.location) : undefined,
    }))
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  function openChallenge(id: string) {
    router.push({ pathname: "/challenge/[id]", params: { id } });
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.challenge.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Challenges</Text>

            {/* Oppsummering: hvor mange utfordringer i hver status */}
            <View style={styles.summary}>
              {(["not_started", "in_progress", "completed"] as ChallengeStatus[]).map((status) => (
                <View key={status} style={[styles.summaryBox, { backgroundColor: STATUS_COLORS[status].light }]}>
                  <Text style={[styles.summaryCount, { color: STATUS_COLORS[status].main }]}>{counts[status]}</Text>
                  <Text style={[styles.summaryLabel, { color: STATUS_COLORS[status].main }]}>
                    {STATUS_LABELS[status]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Filterknapper: All / Not started / In progress / Completed */}
            <View style={styles.filters}>
              {FILTERS.map((option) => {
                const active = option === filter;
                return (
                  <Pressable
                    key={option}
                    style={[styles.filterChip, active && styles.filterChipActive]}
                    onPress={() => setFilter(option)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {FILTER_LABELS[option]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="flag-outline" size={36} color="#bbb" />
            <Text style={styles.emptyText}>No challenges with this status.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ChallengeListItem
            challenge={item.challenge}
            status={getChallengeStatus(item.challenge.id)}
            distanceMeters={item.distance}
            onPress={openChallenge}
          />
        )}
      />

      {/* Flytende pluss-knapp: lag ny utfordring (Create-fanen) */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/create")}
        accessibilityRole="button"
        accessibilityLabel="Create a new challenge"
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f3f8" },
  list: { padding: 16, paddingBottom: 100, maxWidth: 760, width: "100%", alignSelf: "center" },
  header: { gap: 14, marginBottom: 14 },
  heading: { fontSize: 28, fontWeight: "800", color: "#222" },
  summary: { flexDirection: "row", gap: 8 },
  summaryBox: { flex: 1, borderRadius: 12, paddingVertical: 10, alignItems: "center" },
  summaryCount: { fontSize: 22, fontWeight: "800" },
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e3dcef",
  },
  filterChipActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  filterText: { fontSize: 13, fontWeight: "600", color: "#555" },
  filterTextActive: { color: "white" },
  empty: { alignItems: "center", gap: 8, paddingTop: 40 },
  emptyText: { fontSize: 15, color: "#888" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});