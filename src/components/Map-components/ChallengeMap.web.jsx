
// Kart for Web -- viser et Google Maps iframe med fokus på valgt utfordring eller Oslo som standard.

const OSLO = { latitude: 59.9115, longitude: 10.748 };

export default function ChallengeMap({
  challenges,
  focus,
  userPos,
  onSelect,
  style = {},
}) {
  const center = focus ?? OSLO;
  const zoom = focus ? 16 : 14;

  return (
    <iframe
      title="Kart"
      src={`https://maps.google.com/maps?q=${center.latitude},${center.longitude}&z=${zoom}&output=embed`}
      style={{ border: 0, width: "100%", height: "100%", ...style }}
    />
  );
}