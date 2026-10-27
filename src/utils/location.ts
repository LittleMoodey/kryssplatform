import * as Location from "expo-location";

// Et punkt på kartet: breddegrad (nord/sør) og lengdegrad (øst/vest)
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Egen feiltype, slik at skjermen kan skille "tillatelse avslått" fra andre feil
export class LocationPermissionDeniedError extends Error {
  constructor() {
    super("Location permission denied. Enable it in your device settings.");
    this.name = "LocationPermissionDeniedError";
  }
}

// Ber om tillatelse og leser enhetens nåværende GPS-posisjon
export async function getCurrentLocation(): Promise<Coordinates> {

  // 1. Be om tillatelse (systemdialogen vises bare første gang)
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new LocationPermissionDeniedError();
  }

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