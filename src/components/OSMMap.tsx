import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SthanDarshanPlace } from '../types';
import { Layers } from 'lucide-react';

// Safety patch for Leaflet animation frames on removed/unmounted DOM elements
const originalSetPosition = L.DomUtil.setPosition;
L.DomUtil.setPosition = function (el: HTMLElement, point: L.Point) {
  if (!el) return;
  return originalSetPosition.call(this, el, point);
};

// Fix Leaflet's default marker asset paths in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type TileLayerType = 'osm' | 'hot' | 'topo' | 'satellite';

interface OSMMapProps {
  places: SthanDarshanPlace[];
  selectedPlace?: SthanDarshanPlace | null;
  onSelectPlace?: (place: SthanDarshanPlace | null) => void;
  userLocation?: [number, number] | null;
  lang?: 'mr' | 'hi' | 'en';
  height?: string;
  showRoutePolyline?: boolean;
}

const TILE_LAYERS: Record<TileLayerType, { url: string; attribution: string; name: { mr: string; hi: string; en: string } }> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    name: { mr: 'मानक व्ह्यू (Standard)', hi: 'मानक व्यू (Standard)', en: 'Standard View' }
  },
  hot: {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>',
    name: { mr: 'मानवतावादी (HOT)', hi: 'मानवतावादी (HOT)', en: 'Humanitarian (HOT)' }
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    name: { mr: 'टोपोग्राफी / प्राकृतिक', hi: 'टोपोग्राफी / प्राकृतिक', en: 'Topographic' }
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    name: { mr: 'उपग्रह छायाचित्र (Satellite)', hi: 'सैटेलाइट (Satellite)', en: 'Satellite Imagery' }
  }
};

const createCustomPinIcon = (num: number, isSelected: boolean) => {
  const bg = isSelected ? '#ea580c' : '#f59e0b';
  const border = isSelected ? '#ffffff' : '#b45309';
  
  const svgHtml = `
    <div style="position: relative; width: 32px; height: 42px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.3)); cursor: pointer;">
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 26.5 16 42 16 42C16 42 32 26.5 32 16C32 7.163 24.837 0 16 0Z" fill="${bg}" stroke="${border}" stroke-width="2"/>
        <circle cx="16" cy="15" r="10" fill="#ffffff"/>
      </svg>
      <span style="position: absolute; top: 5px; width: 100%; text-align: center; font-size: 12px; line-height: 1;">🛕</span>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-osm-marker',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -38]
  });
};

const createUserPinIcon = () => {
  const svgHtml = `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 28px; height: 28px; background-color: rgba(59, 130, 246, 0.3); border-radius: 50%; opacity: 0.8;"></div>
      <div style="width: 18px; height: 18px; background-color: #2563eb; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-user-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export const OSMMap: React.FC<OSMMapProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
  userLocation,
  lang = 'mr',
  height = '100%',
  showRoutePolyline = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());
  const prevSelectedIdRef = useRef<string | null>(null);

  const [activeLayer, setActiveLayer] = useState<TileLayerType>('osm');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Initialize Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if ((mapContainerRef.current as any)._leaflet_id) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    if (mapInstanceRef.current) return;

    // Default center Maharashtra
    const map = L.map(mapContainerRef.current, {
      center: [19.8762, 75.3433],
      zoom: 7,
      zoomControl: true,
      attributionControl: true
    });

    const initialLayerInfo = TILE_LAYERS[activeLayer];
    const tileLayer = L.tileLayer(initialLayerInfo.url, {
      attribution: initialLayerInfo.attribution,
      maxZoom: 19
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (polylineRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
      if (markersGroupRef.current) {
        markersGroupRef.current.clearLayers();
        markersGroupRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.stop();
        mapInstanceRef.current.off();
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      markersMapRef.current.clear();
    };
  }, []);

  // Update Tile Layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const layerInfo = TILE_LAYERS[activeLayer];
    tileLayerRef.current.setUrl(layerInfo.url);
  }, [activeLayer]);

  // Sync Markers and Polyline when places, userLocation or showRoutePolyline change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    map.stop();
    markersGroup.clearLayers();
    markersMapRef.current.clear();

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const latLngs: [number, number][] = [];

    // Render Sthan Markers
    places.forEach((p) => {
      if (p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)) {
        latLngs.push([p.latitude, p.longitude]);
        const isSelected = selectedPlace?.id === p.id;
        const icon = createCustomPinIcon(p.number || 0, isSelected);

        const marker = L.marker([p.latitude, p.longitude], { icon, title: p.title });

        // Popup HTML
        const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 2px; text-align: left; max-width: 220px;">
            <div style="font-weight: 800; font-size: 13px; color: #c2410c; margin-bottom: 4px;">
              ${p.title}
            </div>
            <div style="font-size: 11px; color: #4b5563; margin-bottom: 8px;">
              ${p.village ? `<strong>गाव:</strong> ${p.village}<br/>` : ''}
              ${p.district ? `<strong>जिल्हा:</strong> ${p.district}` : ''}
            </div>
            <div style="display: flex; gap: 4px;">
              <a href="${navUrl}" target="_blank" rel="noopener noreferrer" style="
                display: inline-flex; align-items: center; justify-content: center; gap: 4px;
                background-color: #ea580c; color: white; text-decoration: none;
                font-size: 11px; font-weight: 700; padding: 5px 10px; border-radius: 8px; flex: 1;
              ">
                🧭 नेव्हिगेट
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectPlace) {
            onSelectPlace(p);
          }
        });

        markersGroup.addLayer(marker);
        markersMapRef.current.set(p.id, marker);
      }
    });

    // Render Polyline if requested (e.g. My Yatra route)
    if (showRoutePolyline && latLngs.length > 1) {
      polylineRef.current = L.polyline(latLngs, {
        color: '#ea580c',
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(map);
    }

    // Render User Location
    if (userLocation && userLocation[0] && userLocation[1]) {
      const userMarker = L.marker([userLocation[0], userLocation[1]], {
        icon: createUserPinIcon(),
        title: lang === 'mr' ? 'माझे स्थान' : 'My Location'
      });
      userMarker.bindPopup(`<div style="font-size: 12px; font-weight: bold; color: #2563eb;">📍 ${lang === 'mr' ? 'माझे सध्याचे स्थान' : 'My Current Location'}</div>`);
      markersGroup.addLayer(userMarker);
    }

    // Fit bounds on initial load or when places update
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      if (userLocation) {
        bounds.extend(userLocation);
      }
      // If no place selected, fit all places on the map
      if (!selectedPlace) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }
  }, [places, userLocation, showRoutePolyline]);

  // Fit all places on map helper
  const handleFitAllPlaces = () => {
    const map = mapInstanceRef.current;
    if (!map || places.length === 0) return;
    const latLngs: [number, number][] = places
      .filter(p => p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude))
      .map(p => [p.latitude, p.longitude]);
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.stop();
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  };

  // Handle selected place camera pan and marker highlighting
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const prevId = prevSelectedIdRef.current;
    const currentId = selectedPlace?.id || null;

    // Reset previous selected marker icon
    if (prevId && prevId !== currentId) {
      const prevMarker = markersMapRef.current.get(prevId);
      const prevPlace = places.find(p => p.id === prevId);
      if (prevMarker && prevPlace) {
        prevMarker.setIcon(createCustomPinIcon(prevPlace.number || 0, false));
      }
    }

    // Highlight current selected marker icon & pan
    if (selectedPlace) {
      const currentMarker = markersMapRef.current.get(selectedPlace.id);
      if (currentMarker) {
        currentMarker.setIcon(createCustomPinIcon(selectedPlace.number || 0, true));
        currentMarker.openPopup();
      }

      if (selectedPlace.latitude && selectedPlace.longitude && prevId !== currentId) {
        map.stop();
        map.setView([selectedPlace.latitude, selectedPlace.longitude], 14, {
          animate: true
        });
      }
    }

    prevSelectedIdRef.current = currentId;
  }, [selectedPlace, places]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100" style={{ height }}>
      
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Show All Places Quick Button Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-wrap items-center gap-2">
        {userLocation && (
          <button
            type="button"
            onClick={() => {
              if (userLocation && mapInstanceRef.current) {
                mapInstanceRef.current.setView(userLocation, 14, { animate: true });
              }
            }}
            className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-saffron-200 shadow-md text-gray-700 hover:text-saffron-700 hover:bg-white transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <span>📍 {lang === 'mr' ? 'माझे स्थान' : lang === 'hi' ? 'मेरा स्थान' : 'My Location'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleFitAllPlaces}
          className="bg-saffron-600 hover:bg-saffron-700 text-white backdrop-blur-md px-3 py-2 rounded-xl border border-saffron-500 shadow-md transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 font-devanagari"
          title={lang === 'mr' ? 'नकाशावर सर्व स्थाने पाहा' : 'नक्शे पर सभी स्थान देखें'}
        >
          <span>🌐 {lang === 'mr' ? `सर्व स्थाने दाखवा (${places.length})` : lang === 'hi' ? `सभी स्थान दिखाएं (${places.length})` : `Show All (${places.length})`}</span>
        </button>
      </div>

      {/* Map Layer Switcher Floating Button */}
      <div className="absolute top-3 right-3 z-[1000]">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="p-2.5 bg-white hover:bg-saffron-50 text-gray-700 hover:text-saffron-700 rounded-xl shadow-md border border-saffron-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title={lang === 'mr' ? 'नकाशा प्रकार बदला' : 'Change Map Layer'}
          >
            <Layers className="w-4 h-4 text-saffron-600" />
            <span className="hidden sm:inline font-devanagari">{lang === 'mr' ? 'महानुभाव मॅप' : lang === 'hi' ? 'महानुभाव नक्शा' : 'Mahanubhav Map'}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-saffron-100 p-2 text-left text-xs z-50">
              <div className="px-2 py-1 text-[10px] font-bold text-gray-400 font-devanagari border-b border-gray-100 mb-1">
                {lang === 'mr' ? 'नकाशा प्रकार (Map Tiles)' : 'Map Tile Provider'}
              </div>
              {(Object.keys(TILE_LAYERS) as TileLayerType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveLayer(key);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between font-devanagari ${
                    activeLayer === key
                      ? 'bg-saffron-100 text-saffron-800 font-bold'
                      : 'hover:bg-saffron-50 text-gray-700'
                  }`}
                >
                  <span>{TILE_LAYERS[key].name[lang] || TILE_LAYERS[key].name.mr}</span>
                  {activeLayer === key && <span className="w-2 h-2 rounded-full bg-saffron-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Attribution Badge */}
      <div className="absolute bottom-1 right-1 z-[1000] bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] text-gray-600 border border-gray-200 font-devanagari">
        🗺️ <strong>महानुभाव मॅप</strong> (Powered by OpenStreetMap)
      </div>
    </div>
  );
};

export default OSMMap;

