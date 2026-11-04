import { useEffect, useState } from "react";
import {
    LocationPermissionDeniedError,
    UserPosition,
    watchUserLocation,
} from "../utils/location";

// Egen hook som gir skjermene brukerens posisjon, oppdatert i sanntid.
// Skjermen trenger ikke vite noe om expo-location, tillatelser eller opprydding:
// den kaller bare useUserLocation() og får tilbake posisjon, lasting og feil.
// Hooken kan gjenbrukes senere, f.eks. når utfordringslisten skal vise avstand.
export function useUserLocation() {
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Økes av retry(). Fordi den står i avhengighetslisten til useEffect,
  // starter sporingen på nytt hver gang den endres.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let stopWatching: (() => void) | null = null;

    // Hvis skjermen lukkes før watchUserLocation er ferdig med å starte,
    // må vi ikke oppdatere state etterpå, og vi må stoppe sporingen med en gang.
    let unmounted = false;

    watchUserLocation((newPosition) => {
      if (!unmounted) {
        setPosition(newPosition);
        setError(null);
      }
    })
      .then((stop) => {
        if (unmounted) stop();
        else stopWatching = stop;
      })
      .catch((e: unknown) => {
        if (unmounted) return;
        setPermissionDenied(e instanceof LocationPermissionDeniedError);
        setError(e instanceof Error ? e.message : "Could not get your location.");
      });

    // Opprydding: kjøres når skjermen lukkes, eller før sporingen startes på nytt
    return () => {
      unmounted = true;
      stopWatching?.();
    };
  }, [attempt]);

  // Prøv igjen, f.eks. etter at brukeren har slått på posisjon i innstillingene
  function retry() {
    setError(null);
    setPermissionDenied(false);
    setAttempt((current) => current + 1);
  }

  return {
    position,
    error,
    permissionDenied,
    loading: position === null && error === null,
    retry,
  };
}