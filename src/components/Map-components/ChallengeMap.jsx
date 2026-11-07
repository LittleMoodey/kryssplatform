import { useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";

// Kart for iOS

const OSLO = { latitude: 59.9115, longitude: 10.748 };

export default function ChallengeMap({
  challenges,
  focus,
  userPos,
  onSelect,
  style = {},
}) {
  const mapRef = useRef(null);

  // Flytt kartet når en utfordring er valgt
  useEffect(() => {
    if (!focus) return;

    const target = { latitude: focus.latitude, longitude: focus.longitude };

    if (userPos) {
      // Zoom så både du (blå prikk) og utfordringen synes
      mapRef.current?.fitToCoordinates([userPos, target], {
        edgePadding: { top: 100, right: 60, bottom: 280, left: 60 },
        animated: true,
      });
    } else {
      // Vet ikke hvor du er, så zoom bare inn på utfordringen
      mapRef.current?.animateToRegion(
        { ...target, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        800
      );
    }
  }, [focus, userPos]);

  const start = focus ?? OSLO;

  return (
    <MapView
      ref={mapRef}
      style={style}
      showsUserLocation // den blå prikken
      initialRegion={{
        latitude: start.latitude,
        longitude: start.longitude,
        latitudeDelta: focus ? 0.005 : 0.02,
        longitudeDelta: focus ? 0.005 : 0.02,
      }}
    >
      {challenges.map((c) => (
        <Marker
          key={c.id}
          coordinate={{ latitude: c.latitude, longitude: c.longitude }}
          onPress={() => onSelect?.(c.id)}
        />
      ))}
    </MapView>
  );
}