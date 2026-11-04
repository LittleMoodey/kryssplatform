import * as Location from "expo-location";

// Et punkt på kartet: breddegrad (nord/sør) og lengdegrad (øst/vest)
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// En GPS-posisjon med nøyaktighet. accuracy er hvor mange meter posisjonen kan bomme med
// (f.eks. 8 betyr "du er et sted innenfor 8 meter herfra"). Kan være null hvis enheten ikke vet.
export interface UserPosition extends Coordinates {
  accuracy: number | null;
}

// Egen feiltype, slik at skjermen kan skille "tillatelse avslått" fra andre feil
export class LocationPermissionDeniedError extends Error {
  constructor() {
    super("Location permission denied. Enable it in your device settings.");
    this.name = "LocationPermissionDeniedError";
  }
}

// Ber om tillatelse til å bruke posisjon mens appen er åpen.
// Systemdialogen vises bare første gang. Har brukeren sagt nei før, svarer iOS "denied" med en gang.
// Ligger i egen funksjon så både getCurrentLocation og watchUserLocation kan bruke den.
export async function ensureLocationPermission(): Promise<void> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new LocationPermissionDeniedError();
  }
}

// Leser enhetens nåværende GPS-posisjon én gang
export async function getCurrentLocation(): Promise<Coordinates> {
  // 1. Be om tillatelse
  await ensureLocationPermission();

  // 2. Les posisjonen. "Balanced" er en god balanse mellom nøyaktighet og batteribruk
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  // 3. Returner bare det vi trenger (coords inneholder også høyde, fart osv.)
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

// Følger posisjonen kontinuerlig: onChange kalles hver gang brukeren flytter seg.
// Returnerer en funksjon som stopper sporingen. Den MÅ kalles når skjermen lukkes,
// ellers fortsetter GPS-en å kjøre i bakgrunnen og bruker batteri.
export async function watchUserLocation(
  onChange: (position: UserPosition) => void,
): Promise<() => void> {
  await ensureLocationPermission();

  const subscription = await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High, // høy nøyaktighet for å vise den eksakte posisjonen
      distanceInterval: 5, // gi beskjed først når brukeren har flyttet seg minst 5 meter
    },
    (position) => {
      onChange({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
  );

  return () => subscription.remove();
}


// Avstanden i meter mellom to punkter, beregnet med Haversine-formelen.
// Jorden er rund, så vi kan ikke bare bruke Pytagoras på breddegrad og lengdegrad.
// Brukes til å vise "1.2 km unna" og senere til å sjekke om brukeren er innenfor radiusen.
export function distanceInMeters(from: Coordinates, to: Coordinates): number {
  const EARTH_RADIUS = 6371000; // meter
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) * Math.cos(toRadians(to.latitude)) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

// Gjør meter om til lesbar tekst: 850 → "850 m", 1234 → "1.2 km"
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Mock-lokasjon: koordinater skrevet inn for hånd. Trenger verken GPS eller tillatelse.
// Nyttig for testing på simulator, og brukes av sensor for å teste appen.
export function getMockLocation(latitude: number, longitude: number): Coordinates {

  // Sjekk at tallene er gyldige: breddegrad -90 til 90, lengdegrad -180 til 180
  if (
    Number.isNaN(latitude) || Number.isNaN(longitude) ||
    latitude < -90 || latitude > 90 ||
    longitude < -180 || longitude > 180
  ) {
    throw new Error("Enter a valid latitude (-90 to 90) and longitude (-180 to 180).");
  }
  return { latitude, longitude };
}