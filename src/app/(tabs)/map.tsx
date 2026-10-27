import { useState } from "react";
import MapView from "react-native-maps";

export default function Map() {
  const [region, setRegion] = useState({ //registerer hvor kartet blir dratt. Oppdateres når brukeren flytter kartet.
    latitude: 59.9139,
    longitude: 10.7522,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={region}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
    />
    
  );
}