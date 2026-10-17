import { useEffect, useState } from 'react';
import { divIcon, latLngBounds } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import type { Category, Locale, Resource } from './resources';
import { resourceStatus } from './resources';
import 'leaflet/dist/leaflet.css';

const pinColors: Record<Category, [string, string]> = { food: ['#9bd84a', '#5f9f1d'], sleep: ['#6db6f5', '#1f6fc4'], shower: ['#ffbe5c', '#e67a00'] };

function pinSvg(category: Category) {
  const [light, dark] = pinColors[category];
  return `<svg viewBox="0 0 26 34" aria-hidden="true"><defs><linearGradient id="pin-${category}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs><path class="pin-body" fill="url(#pin-${category})" d="M13 32.5C13 32.5 2 20.6 2 12.5a11 11 0 0 1 22 0c0 8.100-11 20-11 20Z"/><circle class="pin-dot" cx="13" cy="12.5" r="4.4"/></svg>`;
}

function FitResources({ items }: { items: Resource[] }) {
  const map = useMap();
  const signature = items.map(resource => resource.id).join(',');
  useEffect(() => {
    const points = items.flatMap(resource => resource.coordinates ? [resource.coordinates] : []);
    const fit = () => { if (points.length) map.fitBounds(latLngBounds(points), { padding: [44, 80], maxZoom: 14 }); };
    fit();
    map.on('resize', fit);
    return () => { map.off('resize', fit); };
  }, [map, signature]);
  return null;
}

function PanToSelected({ items, selectedId }: { items: Resource[]; selectedId: string | null }) {
  const map = useMap();
  useEffect(() => {
    const coordinates = items.find(resource => resource.id === selectedId)?.coordinates;
    if (coordinates) map.panTo(coordinates);
  }, [map, selectedId]);
  return null;
}

export default function ResourceMap({ items, selectedId, onSelect, locale }: {
  items: Resource[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locale: Locale;
}) {
  const [tileError, setTileError] = useState(false);
  return (
    <>
      <MapContainer center={[41.3851, 2.1734]} zoom={13} className="resource-map" zoomControl={false} aria-label={locale === 'es' ? 'Mapa de recursos en Barcelona' : 'Mapa de recursos a Barcelona'}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setTileError(true) }}
        />
        <FitResources items={items} />
        <PanToSelected items={items} selectedId={selectedId} />
        {items.map(resource => resource.coordinates && (
          <Marker
            key={resource.id}
            position={resource.coordinates}
            title={resource.name}
            alt={resource.name}
            icon={divIcon({
              className: 'marker-wrapper',
              html: `<span class="map-pin ${resourceStatus(resource)} ${resource.id === selectedId ? 'selected' : ''}">${pinSvg(resource.category)}</span>`,
              iconSize: [26, 34],
              iconAnchor: [13, 33],
            })}
            eventHandlers={{ click: () => onSelect(resource.id) }}
          />
        ))}
        <MapZoom locale={locale} />
      </MapContainer>
      {tileError && <p className="map-notice" role="status">{locale === 'es' ? 'No se puede cargar el mapa. Puedes consultar los recursos en Lista.' : 'No es pot carregar el mapa. Pots consultar els recursos a Llista.'}</p>}
    </>
  );
}

function MapZoom({ locale }: { locale: Locale }) {
  const map = useMap();
  return (
    <div className="map-zoom">
      <button type="button" onClick={() => map.zoomIn()} aria-label={locale === 'es' ? 'Acercar mapa' : 'Apropar mapa'} title={locale === 'es' ? 'Acercar mapa' : 'Apropar mapa'}>+</button>
      <button type="button" onClick={() => map.zoomOut()} aria-label={locale === 'es' ? 'Alejar mapa' : 'Allunyar mapa'} title={locale === 'es' ? 'Alejar mapa' : 'Allunyar mapa'}>−</button>
    </div>
  );
}