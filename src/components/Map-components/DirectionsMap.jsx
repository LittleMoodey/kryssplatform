// Veibeskrivelse-kart for mobil

import { WebView } from "react-native-webview";

export default function DirectionsMap({ from, to, style = {} }) {
  const url = from
    ? `https://maps.google.com/maps?saddr=${from.latitude},${from.longitude}&daddr=${to.latitude},${to.longitude}&dirflg=w&output=embed`
    : `https://maps.google.com/maps?q=${to.latitude},${to.longitude}&z=16&output=embed`;

  // Kartet lages 1,5x større og krympes ned igjen, så hele ruten får plass
  const html = `
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="margin:0; overflow:hidden">
        <iframe
          src="${url}"
          style="border:0; width:150%; height:150vh; transform:scale(0.667); transform-origin:0 0"
        ></iframe>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html, baseUrl: "https://localhost" }}
      style={style}
      scrollEnabled={false}
    />
  );
}