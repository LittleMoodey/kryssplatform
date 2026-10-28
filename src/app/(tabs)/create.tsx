import { useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, LatLng } from "react-native-maps";

export default function Create() {
  const [region, setRegion] = useState({
    latitude: 59.9139,
    longitude: 10.7522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [selected, setSelected] = useState<LatLng | null>(null);

  return (
    <MapView
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      onPress={(event) => setSelected(event.nativeEvent.coordinate)}
    >
      {selected && <Marker coordinate={selected} />}
    </MapView>
  );
}
const styles = StyleSheet.create({
  map: {
    flex: 1,
  }
});


//testing something