import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { USER_LOCATION_COLOR } from "../../constants/challengeStatus";
import type { ChallengeMapProps } from "./mapTypes";

// Kart for WEB med Leaflet og OpenStreetMap.
//
// react-native-maps virker ikke i nettleseren, så på web laster vi Leaflet
// fra CDN første gang kartet vises. Ingen API-nøkkel trengs.
// Metro bruker ChallengeMap.native.tsx på mobil og denne filen på web.
//
// Kilde: Leaflet 1.9.4, https://leafletjs.com (BSD-2-lisens). Kartdata: © OpenStreetMap-bidragsytere.
// Innlastingen av Leaflet er basert på eksempelprosjektet fra forelesning.

const LEAFLET_VERSION = "1.9.4";

// Minimale typer for de delene av Leaflet vi bruker (biblioteket lastes som global "L")
type LeafletLatLng = { lat: number; lng: number };
interface LeafletLayer {
  addTo(target: unknown): LeafletLayer;
  on(event: string, handler: () => void): LeafletLayer;
}
interface LeafletMap {
  setView(center: [number, number], zoom: number, options?: object): LeafletMap;
  on(event: "click", handler: (e: { latlng: LeafletLatLng }) => void): void;
  remove(): void;
  invalidateSize(): void;
}
interface LeafletGlobal {
  map(element: HTMLElement, options?: object): LeafletMap;
  control: { zoom(options: object): LeafletLayer };
  tileLayer(url: string, options: object): LeafletLayer;
  layerGroup(): LeafletLayer & { clearLayers(): void };
  circleMarker(latlng: [number, number], options: object): LeafletLayer;
  circle(latlng: [number, number], options: object): LeafletLayer;
}

let leafletPromise: Promise<LeafletGlobal> | null = null;

// Laster Leaflet sin CSS og JavaScript fra CDN én gang, og deler resultatet mellom alle kart
function loadLeaflet(): Promise<LeafletGlobal> {
  const existing = (window as unknown as { L?: LeafletGlobal }).L;
  if (existing) return Promise.resolve(existing);
  if (leafletPromise) return leafletPromise;

  leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
    script.onload = () => resolve((window as unknown as { L: LeafletGlobal }).L);
    script.onerror = () => {
      leafletPromise = null;
      reject(new Error("Could not load the map library. Check your internet connection."));
    };
    document.body.appendChild(script);
  });
  return leafletPromise;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const layerRef = useRef<(LeafletLayer & { clearLayers(): void }) | null>(null);
  const leafletRef = useRef<LeafletGlobal | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Callbackene lagres i en ref, så kartets lyttere alltid kaller nyeste versjon
  // uten at vi må lage hele kartet på nytt
  const handlersRef = useRef({ onMarkerPress, onMapPress });
  useEffect(() => {
    handlersRef.current = { onMarkerPress, onMapPress };
  });

  useImperativeHandle(ref, () => ({
    centerOn(point, zoomLevel = 15) {
      mapRef.current?.setView([point.latitude, point.longitude], zoomLevel, { animate: true });
    },
  }));

  // 1) Opprett kartet én gang
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        leafletRef.current = L;
        // Zoomknappene flyttes til høyre, så de ikke havner bak forklaringen øverst til venstre
        const map = L.map(containerRef.current, { zoomControl: false }).setView(
          [center.latitude, center.longitude],
          zoom,
        );
        L.control.zoom({ position: "topright" }).addTo(map);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);
        layerRef.current = L.layerGroup();
        layerRef.current.addTo(map);
        map.on("click", (e) =>
          handlersRef.current.onMapPress?.({ latitude: e.latlng.lat, longitude: e.latlng.lng }),
        );
        mapRef.current = map;
        // Leaflet må måle størrelsen på nytt etter at layouten er ferdig
        setTimeout(() => map.invalidateSize(), 100);
        setReady(true);
      })
      .catch((e: Error) => setError(e.message));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Kartet skal bare lages én gang. center og zoom brukes kun som startpunkt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Tegn markørene på nytt når dataene endres
  useEffect(() => {
    const L = leafletRef.current;
    const layer = layerRef.current;
    if (!ready || !L || !layer) return;
    layer.clearLayers();

    for (const marker of markers) {
      const latlng: [number, number] = [marker.location.latitude, marker.location.longitude];
      if (marker.radiusMeters) {
        L.circle(latlng, {
          radius: marker.radiusMeters,
          color: marker.color,
          weight: 1,
          fillOpacity: 0.12,
          interactive: false, // sirkelen skal ikke fange trykk
        }).addTo(layer);
      }
      L.circleMarker(latlng, {
        radius: 9,
        color: "#fff",
        weight: 3,
        fillColor: marker.color,
        fillOpacity: 1,
        bubblingMouseEvents: false, // ellers utløser et trykk på markøren også et trykk på kartet
      })
        .on("click", () => handlersRef.current.onMarkerPress?.(marker.id))
        .addTo(layer);
    }

    if (userLocation) {
      L.circleMarker([userLocation.latitude, userLocation.longitude], {
        radius: 8,
        color: "#fff",
        weight: 3,
        fillColor: USER_LOCATION_COLOR,
        fillOpacity: 1,
        interactive: false,
      }).addTo(layer);
    }
  }, [markers, userLocation, ready]);

  if (error) {
    return (
      <View style={[styles.container, styles.center, { height }]}>
        <Text style={styles.error}>The map could not be loaded: {error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", overflow: "hidden", backgroundColor: "#e5e5e5" },
  center: { alignItems: "center", justifyContent: "center", padding: 16 },
  error: { color: "#b42318", textAlign: "center" },
});