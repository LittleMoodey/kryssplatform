import { useImperativeHandle, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import { USER_LOCATION_COLOR } from "../../constants/challengeStatus";
import { type ChallengeMapProps, zoomToDelta } from "./mapTypes";

// Kart for iOS og Android med react-native-maps (Apple Maps på iOS, Google Maps på Android).
// Filendelsen .native.tsx gjør at Metro bruker denne filen på mobil,
// og ChallengeMap.tsx (Leaflet) i nettleseren, fordi react-native-maps ikke virker på web.
// Oppbyggingen er inspirert av eksempelprosjektet fra forelesning.
export function ChallengeMap({
  ref,
  markers,
  userLocation,
  center,
  zoom = 13,
  height = 300,
  onMarkerPress,
  onMapPress,
}: ChallengeMapProps) {
  const mapRef = useRef<MapView>(null);
  const delta = zoomToDelta(zoom);

  // Gir skjermen tilgang til centerOn() via ref, uten å vise hele MapView-objektet
  useImperativeHandle(ref, () => ({
    centerOn(point, zoomLevel = 15) {
      const d = zoomToDelta(zoomLevel);
      mapRef.current?.animateToRegion({ ...point, latitudeDelta: d, longitudeDelta: d }, 600);
    },
  }));

  return (
    <View style={[styles.container, { height }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={{ ...center, latitudeDelta: delta, longitudeDelta: delta }}
                onMapReady={() =>
          mapRef.current?.animateToRegion({ ...center, latitudeDelta: delta, longitudeDelta: delta }, 0)
        }
        onPress={(event) => {
          // Et trykk på en markør utløser også et trykk på kartet. Det ignorerer vi her.
          if (event.nativeEvent.action === "marker-press") return;
          onMapPress?.(event.nativeEvent.coordinate);
        }}
      >
        {/* Sirklene tegnes først, så markørene havner oppå dem */}
        {markers.map((marker) =>
          marker.radiusMeters ? (
            <Circle
              key={`${marker.id}-radius`}
              center={marker.location}
              radius={marker.radiusMeters}
              strokeColor={marker.color}
              strokeWidth={1}
              fillColor={`${marker.color}22`} // "22" på slutten = ca. 13 % gjennomsiktig farge
            />
          ) : null,
        )}

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.location}
            anchor={{ x: 0.5, y: 0.5 }} // midten av prikken står på koordinaten
            tracksViewChanges={false} // prikken endrer seg ikke, så kartet slipper å tegne den på nytt
            onPress={() => onMarkerPress?.(marker.id)}
            accessibilityLabel={marker.title}
          >
            {/* Usynlig, større trykkflate rundt prikken, så den er lett å treffe med fingeren */}
            <View style={styles.touchArea}>
              <View style={[styles.dot, { backgroundColor: marker.color }]} />
            </View>
          </Marker>
        ))}

        {/* Brukerens posisjon. Vi tegner den selv i stedet for showsUserLocation,
            så den samme prikken senere også kan vise en simulert (mock) posisjon. */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
            zIndex={10}
            accessibilityLabel="Your location"
          >
            <View style={styles.userDot} />
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", overflow: "hidden", backgroundColor: "#e5e5e5" },
  touchArea: { width: 34, height: 34, alignItems: "center", justifyContent: "center" },
  dot: { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: "white" },
  userDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: "white",
    backgroundColor: USER_LOCATION_COLOR,
  },
});