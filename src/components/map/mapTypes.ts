import type { Ref } from "react";
import type { Coordinates } from "../../utils/location";

// Felles typer for kartkomponenten. Det finnes to versjoner av kartet:
//   ChallengeMap.native.tsx  → iOS/Android (react-native-maps)
//   ChallengeMap.tsx         → web (Leaflet)
// Begge tar imot nøyaktig de samme props, så skjermene trenger ikke vite hvilken som brukes.

// Én markør på kartet, f.eks. en utfordring
export interface MapMarker {
  id: string;
  title: string;
  location: Coordinates;
  radiusMeters?: number; // hvis satt: tegn en sirkel rundt markøren (gyldig radius)
  color: string;
}

// Funksjoner skjermen kan kalle på kartet via en ref, f.eks. "flytt deg hit"
export interface ChallengeMapHandle {
  centerOn(point: Coordinates, zoom?: number): void;
}

export interface ChallengeMapProps {
  ref?: Ref<ChallengeMapHandle>;
  markers: MapMarker[];
  userLocation?: Coordinates | null; // brukerens posisjon, vises som blå prikk
  center: Coordinates; // midtpunkt når kartet åpnes
  zoom?: number; // zoom-nivå: høyere tall = mer zoom (13 ≈ en bydel)
  height?: number | `${number}%`;
  onMarkerPress?: (markerId: string) => void;
  onMapPress?: (point: Coordinates) => void; // trykk på et tomt sted i kartet
}

// react-native-maps bruker "delta" (hvor mange grader kartet viser) i stedet for zoom-nivå.
// Hvert zoom-nivå halverer området, derfor 2 opphøyd i zoom.
export function zoomToDelta(zoom: number): number {
  return 360 / 2 ** zoom;
}