export default function DestinationMap({ lat, long, name }) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  const delta = 6;
  const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  return (
    <iframe
      title={`Carte de ${name}`}
      src={src}
      className="destination-map"
      loading="lazy"
    />
  );
}
