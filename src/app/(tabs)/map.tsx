import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChallengeMap } from "../../components/map/ChallengeMap";
import { MapLegend } from "../../components/map/MapLegend";
import type { ChallengeMapHandle, MapMarker } from "../../components/map/mapTypes";
import { SelectedChallengeCard } from "../../components/map/SelectedChallengeCard";
import { STATUS_COLORS } from "../../constants/challengeStatus";
import { getAllChallenges, getChallengeById, getChallengeStatus } from "../../data/sampleChallenges";
import { useUserLocation } from "../../hooks/useUserLocation";
import { distanceInMeters } from "../../utils/location";

const PRIMARY = "#a85ef7";

// Midtpunktet kartet åpner på: Oslo sentrum, der testutfordringene ligger
const OSLO_CENTER = { latitude: 59.9139, longitude: 10.7522 };

// Kartfanen: viser alle utfordringer (farget etter status) og brukerens posisjon.
// Trykk på en utfordring viser et kort nederst. Trykk på kortet åpner utfordringen.
export default function MapScreen() {
  const insets = useSafeAreaInsets(); // avstand til hakket øverst på iPhone
  const mapRef = useRef<ChallengeMapHandle>(null);
  const { position, error, permissionDenied, loading, retry } = useUserLocation();

  // Hvilken utfordring brukeren har trykket på (null = ingen)
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Gjør utfordringene om til markører kartet forstår. Fargen avhenger av brukerens status.
  const markers: MapMarker[] = getAllChallenges().map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    location: challenge.location,
    radiusMeters: challenge.radiusMeters,
    color: STATUS_COLORS[getChallengeStatus(challenge.id)].main,
  }));

  const selected = selectedId ? getChallengeById(selectedId) : undefined;

  function openChallenge(id: string) {
        router.push({ pathname: "/challenge/[id]", params: { id } });
  }

  function centerOnUser() {
    if (position) mapRef.current?.centerOn(position);
  }

  return (
    <View style={styles.screen}>
      <ChallengeMap
        ref={mapRef}
        markers={markers}
        userLocation={position}
        center={OSLO_CENTER}
        zoom={13}
        height="100%"
        onMarkerPress={setSelectedId}
        onMapPress={() => setSelectedId(null)} // trykk på tomt kart lukker kortet
      />

      {/* Alt øverst: statusmelding og forklaring. box-none = trykk går gjennom til kartet. */}
      <View style={[styles.top, { top: insets.top + 8 }]} pointerEvents="box-none">
        {loading && (
          <View style={styles.banner}>
            <ActivityIndicator color={PRIMARY} />
            <Text style={styles.bannerText}>Finding your location…</Text>
          </View>
        )}

        {error && (
          <View style={[styles.banner, styles.errorBanner]}>
            <Ionicons name="warning-outline" size={20} color="#b42318" />
            <Text style={[styles.bannerText, styles.errorText]}>{error}</Text>
            {/* Innstillinger kan bare åpnes fra appen på mobil, ikke i nettleseren */}
            {permissionDenied && Platform.OS !== "web" && (
              <Pressable onPress={() => Linking.openSettings()} accessibilityRole="button">
                <Text style={styles.link}>Settings</Text>
              </Pressable>
            )}
            <Pressable onPress={retry} accessibilityRole="button">
              <Text style={styles.link}>Try again</Text>
            </Pressable>
          </View>
        )}

        <MapLegend />
      </View>

      {/* Nederst: kortet for valgt utfordring og knappen som finner brukeren */}
      <View style={styles.bottom} pointerEvents="box-none">
        <Pressable
          style={[styles.centerButton, !position && styles.disabled]}
          onPress={centerOnUser}
          disabled={!position}
          accessibilityRole="button"
          accessibilityLabel="Center map on my location"
        >
          <Ionicons name="locate" size={26} color={PRIMARY} />
        </Pressable>

        {selected && (
          <SelectedChallengeCard
            challenge={selected}
            status={getChallengeStatus(selected.id)}
            distanceMeters={position ? distanceInMeters(position, selected.location) : undefined}
            onPress={() => openChallenge(selected.id)}
          />
        )}
      </View>
    </View>
  );
}

const shadow = {
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 2 },
  elevation: 4,
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  top: { position: "absolute", left: 16, right: 16, gap: 8, zIndex: 1000 }, // zIndex: over Leaflet på web
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    ...shadow,
  },
  bannerText: { flex: 1, fontSize: 14, color: "#333" },
  errorBanner: { backgroundColor: "#fef3f2" },
  errorText: { color: "#b42318" },
  link: { color: PRIMARY, fontWeight: "700", fontSize: 14 },
  bottom: { position: "absolute", left: 16, right: 16, bottom: 16, gap: 12, zIndex: 1000 },
  centerButton: {
    alignSelf: "flex-end",
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    ...shadow,
  },
  disabled: { opacity: 0.4 },
});