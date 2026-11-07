// Veibeskrivelse-kart for web

export default function DirectionsMap({ from, to, style = {} }) {
  const url = from
    ? `https://maps.google.com/maps?saddr=${from.latitude},${from.longitude}&daddr=${to.latitude},${to.longitude}&dirflg=w&output=embed`
    : `https://maps.google.com/maps?q=${to.latitude},${to.longitude}&z=16&output=embed`;

  return (
    <div style={{ overflow: "hidden", width: "100%", height: "100%", ...style }}>
      <iframe
        title="Veibeskrivelse"
        src={url}
        style={{
          border: 0,
          width: "150%",
          height: "150%",
          transform: "scale(0.667)",
          transformOrigin: "0 0",
        }}
      />
    </div>
  );
}