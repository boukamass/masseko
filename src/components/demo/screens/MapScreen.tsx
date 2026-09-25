import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Layers, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Scale, 
  Camera, 
  AlertTriangle,
  Compass,
  Plus,
  Minus,
  Maximize2,
  Truck,
  Navigation,
  Info
} from 'lucide-react';
import { WasteReport } from '../../../types/koba';
import { POINTE_NOIRE_COASTAL_SITES } from '../../../data/mockPointeNoireData';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect, ModernSelectOption } from '../ModernSelect';

interface MapScreenProps {
  reports: WasteReport[];
  selectedMapPoint: WasteReport | null;
  setSelectedMapPoint: (report: WasteReport | null) => void;
  mapFilter: 'all' | 'critical' | 'turtle_nest' | 'collected';
  setMapFilter: (filter: 'all' | 'critical' | 'turtle_nest' | 'collected') => void;
  mapSectorFilter: string;
  setMapSectorFilter: (sector: string) => void;
  isRangerVerified: boolean;
  setIsRangerVerified: (verified: boolean) => void;
  mapTileMode: 'osm_offline' | 'satellite';
  setMapTileMode: (mode: 'osm_offline' | 'satellite') => void;
  themeMode: 'forest' | 'fixora';
  setMobileScreen: (screen: DemoScreen) => void;
  handleApproveReport: (id: string) => void;
  handleRejectReport: (id: string) => void;
}

// Coastal corridor coordinates of Pointe-Noire (Songolo -> Port de Pêche -> Côte Sauvage -> Ngoyo -> Djeno)
const COASTAL_PATROL_COORDINATES: [number, number][] = [
  [-4.7510, 11.8670], // Mvassa
  [-4.7645, 11.8890], // Djeno Frayère
  [-4.7720, 11.8540], // Songolo Estuaire
  [-4.7870, 11.8380], // Port de Pêche
  [-4.7985, 11.8290], // Côte Sauvage
  [-4.8120, 11.8630], // Ngoyo Littoral Sud
];

// Active patrol vehicle position (Uber-style eco-patrol)
const PATROL_VEHICLE_COORDS: [number, number] = [-4.7885, 11.8335];

// Default balanced overview center & zoom for Pointe-Noire (never over-zoomed)
const POINTE_NOIRE_CENTER: [number, number] = [-4.785, 11.848];
const DEFAULT_BALANCED_ZOOM = 12.3;

export const MapScreen: React.FC<MapScreenProps> = ({
  reports,
  selectedMapPoint,
  setSelectedMapPoint,
  mapFilter,
  setMapFilter,
  mapSectorFilter,
  setMapSectorFilter,
  isRangerVerified,
  setIsRangerVerified,
  mapTileMode,
  setMapTileMode,
  themeMode,
  setMobileScreen,
  handleApproveReport,
  handleRejectReport,
}) => {
  const isFixora = themeMode === 'fixora';

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);

  const [currentZoom, setCurrentZoom] = useState<number>(DEFAULT_BALANCED_ZOOM);
  const [showVehicleInfo, setShowVehicleInfo] = useState<boolean>(false);

  // Filtered reports list
  const filteredReports = reports.filter((r) => {
    if (mapFilter === 'critical' && r.priorityLevel !== 'CRITIQUE') return false;
    if (mapFilter === 'turtle_nest' && !r.isNestingZone) return false;
    if (mapFilter === 'collected' && r.status !== 'collected' && r.status !== 'validated') return false;
    if (mapSectorFilter !== 'all' && !r.locationName.toLowerCase().includes(mapSectorFilter.toLowerCase())) return false;
    return true;
  });

  // Determine active tile URL based on mode (100% Free & Open - No API Key Required)
  const getTileConfig = useCallback(() => {
    if (mapTileMode === 'satellite') {
      return {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        options: {
          maxZoom: 18,
          subdomains: ['server', 'services'],
          attribution: '&copy; Esri &mdash; Satellite HD Pointe-Noire',
          crossOrigin: true,
        },
      };
    }

    // Official OpenStreetMap Standard Tiles - 100% Free, Reliable, No API Key Required
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      options: {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributeurs',
        crossOrigin: true,
      },
    };
  }, [mapTileMode]);

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: POINTE_NOIRE_CENTER,
      zoom: DEFAULT_BALANCED_ZOOM,
      minZoom: 10,
      maxZoom: 18,
      zoomControl: false, // We provide sleek Uber-style floating controls
      attributionControl: false,
    });

    const tileConfig = getTileConfig();
    const tileLayer = L.tileLayer(tileConfig.url, tileConfig.options).addTo(map);
    tileLayerRef.current = tileLayer;

    const routeLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = routeLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;

    mapInstanceRef.current = map;

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    // Invalidate size on load and on container resize to ensure crisp complete tile rendering
    const triggerInvalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };

    const t1 = setTimeout(triggerInvalidate, 60);
    const t2 = setTimeout(triggerInvalidate, 200);
    const t3 = setTimeout(triggerInvalidate, 500);

    let resizeObserver: ResizeObserver | null = null;
    if (mapContainerRef.current && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        triggerInvalidate();
      });
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // 2. Update Tile Layer when tile mode or theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const tileConfig = getTileConfig();

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(tileConfig.url, tileConfig.options).addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [mapTileMode, isFixora, getTileConfig]);

  // 3. Draw Coastal Itinerary & Uber-style Active Patrol Vehicle
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    // Coastal corridor dashed route
    const patrolRoute = L.polyline(COASTAL_PATROL_COORDINATES, {
      color: '#10b981',
      weight: 3.5,
      dashArray: '8, 8',
      opacity: 0.75,
      lineCap: 'round',
    });
    routeLayerRef.current.addLayer(patrolRoute);

    // Active Eco-Patrol Vehicle Marker (Uber-style)
    const vehicleIcon = L.divIcon({
      className: 'uber-vehicle-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <span class="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping"></span>
          <div class="w-8 h-8 rounded-2xl bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white transition-transform group-hover:scale-110">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div class="absolute -bottom-4 bg-slate-900/90 text-[8px] font-black text-emerald-300 px-1.5 py-0.2 rounded-full shadow-md whitespace-nowrap border border-emerald-500/40">
            Patrouille #1
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const vehicleMarker = L.marker(PATROL_VEHICLE_COORDS, { icon: vehicleIcon });
    vehicleMarker.on('click', () => {
      setShowVehicleInfo((prev) => !prev);
    });
    routeLayerRef.current.addLayer(vehicleMarker);
  }, []);

  // 4. Update Hotspots Markers (Uber-style)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    filteredReports.forEach((report) => {
      const isSelected = selectedMapPoint?.id === report.id;
      const isCritical = report.priorityLevel === 'CRITIQUE';
      const isCollected = report.status === 'collected' || report.status === 'validated';
      const isNesting = report.isNestingZone;

      // Coordinate obfuscation for public safety (Anti-poaching protection: ~800m offset if not verified)
      let lat = report.latitude;
      let lng = report.longitude;
      if (!isRangerVerified && isNesting) {
        // Deterministic tiny offset to prevent exact nest coordinates exposure
        const hash = (report.id.charCodeAt(report.id.length - 1) % 5) - 2;
        lat += hash * 0.0035;
        lng += hash * 0.0035;
      }

      // Build Uber-style HTML pin
      let bgClass = 'bg-amber-500 text-white border-white';
      let badgeLabel = report.locationName.split(' ')[0] || 'Point';
      let iconSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`;

      if (isNesting) {
        bgClass = 'bg-emerald-600 text-white border-emerald-200';
        badgeLabel = 'Nid';
        iconSvg = `<svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" /><path d="M12 2a3 3 0 00-3 3v1h6V5a3 3 0 00-3-3zM4 9a2 2 0 00-2 2v2a2 2 0 002 2h2V9H4zm16 0h-2v6h2a2 2 0 002-2v-2a2 2 0 00-2-2zM6 17l-2 3a2 2 0 001.7 3H7a2 2 0 001.6-.8L10 20H6zm12 0h-4l1.4 2.2a2 2 0 001.6.8h1.3a2 2 0 001.7-3l-2-3z" /></svg>`;
      } else if (isCollected) {
        bgClass = 'bg-blue-600 text-white border-blue-200';
        badgeLabel = 'Collecté';
        iconSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>`;
      } else if (isCritical) {
        bgClass = 'bg-red-600 text-white border-red-200';
        badgeLabel = 'Critique';
        iconSvg = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
      }

      const isSelectedClass = isSelected
        ? 'ring-4 ring-white/90 scale-125 z-30 shadow-2xl'
        : 'hover:scale-115 z-10';

      const pingAnimation = isCritical && !isCollected
        ? '<span class="absolute -inset-2 rounded-full bg-red-500/60 animate-ping"></span>'
        : '';

      const markerHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${isSelectedClass}">
          ${pingAnimation}
          <div class="w-7 h-7 rounded-full ${bgClass} border-2 shadow-lg flex items-center justify-center shrink-0">
            ${iconSvg}
          </div>
          <span class="text-[8.5px] font-black bg-slate-950/90 text-white px-1.5 py-0.2 rounded-md mt-0.5 max-w-[85px] truncate shadow-md border border-white/20 whitespace-nowrap">
            ${badgeLabel}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'uber-hotspot-marker',
        html: markerHtml,
        iconSize: [30, 42],
        iconAnchor: [15, 21],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedMapPoint(report);
        // Pan smoothly to the point without zooming in too much (Uber-style balanced overview)
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([lat, lng], { animate: true, duration: 0.5 });
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [filteredReports, selectedMapPoint, isRangerVerified, setSelectedMapPoint]);

  // Recenter / Reset to balanced overview (Uber-style)
  const handleResetOverview = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(POINTE_NOIRE_CENTER, DEFAULT_BALANCED_ZOOM, {
      animate: true,
      duration: 0.6,
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className="space-y-3 pb-2">
      {/* Top Map Filter & Layer Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Security Ranger Toggle */}
          <button
            type="button"
            onClick={() => setIsRangerVerified(!isRangerVerified)}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs ${
              isRangerVerified
                ? 'bg-[#0A3D62] dark:bg-sky-600 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700'
            }`}
            title="Activer la vue précise Éco-Garde Renatura"
          >
            {isRangerVerified ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                <span className="whitespace-nowrap">Ranger Renatura (GPS Précis)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">Vue Publique (Floutage 800m)</span>
              </>
            )}
          </button>

          {/* Map Layer Mode Toggle (Street Uber vs Satellite) */}
          <button
            type="button"
            onClick={() => setMapTileMode(mapTileMode === 'osm_offline' ? 'satellite' : 'osm_offline')}
            className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 text-[10.5px] font-black flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5 shrink-0 text-slate-700 dark:text-slate-300" />
            <span className="whitespace-nowrap">
              {mapTileMode === 'osm_offline' ? 'Vue Rue' : 'Vue Satellite'}
            </span>
          </button>
        </div>

        {/* Coastal Sector Dropdown */}
        <div className="w-full">
          <ModernSelect
            value={mapSectorFilter}
            onChange={(val) => setMapSectorFilter(val)}
            themeMode={themeMode}
            searchable={true}
            size="sm"
            icon={<MapPin className="w-3.5 h-3.5 text-sky-500" />}
            options={[
              {
                value: 'all',
                label: 'Tous les secteurs littoraux',
                subtitle: 'Littoral complet de Pointe-Noire',
                badge: `${reports.length} points`,
                badgeColor: 'blue',
              },
              ...POINTE_NOIRE_COASTAL_SITES.map((site) => ({
                value: site.name,
                label: site.name,
                subtitle: `${site.sector} • ${site.turtleSpecies}`,
                badge: site.threatLevel,
                badgeColor: (site.threatLevel === 'CRITIQUE'
                  ? 'red'
                  : site.threatLevel === 'HAUTE'
                  ? 'amber'
                  : 'emerald') as ModernSelectOption['badgeColor'],
              })),
            ]}
          />
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[10.5px] font-black">
          <button
            type="button"
            onClick={() => setMapFilter('all')}
            className={`px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'all'
                ? 'bg-[#0A3D62] text-white shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
            }`}
          >
            <span className="whitespace-nowrap">Tous ({reports.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('critical')}
            className={`px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'critical'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-100 dark:bg-red-950/70 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800'
            }`}
          >
            <span className="whitespace-nowrap">
              Critiques ({reports.filter((r) => r.priorityLevel === 'CRITIQUE').length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('turtle_nest')}
            className={`px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
              mapFilter === 'turtle_nest'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 font-bold'
            }`}
          >
            <TurtleIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">
              Nids ({reports.filter((r) => r.isNestingZone).length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMapFilter('collected')}
            className={`px-3 py-1 rounded-full whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs ${
              mapFilter === 'collected'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
            }`}
          >
            <span className="whitespace-nowrap">
              Collectés ({reports.filter((r) => r.status === 'collected' || r.status === 'validated').length})
            </span>
          </button>
        </div>
      </div>

      {/* LEAFLET UBER-STYLE INTERACTIVE MAP CONTAINER */}
      <div className="relative w-full h-[320px] rounded-3xl overflow-hidden border-2 border-slate-700 shadow-md bg-slate-900 isolate">
        {/* The DOM element Leaflet attaches to */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Top Uber Badges */}
        <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1.5 pointer-events-none">
          {/* Anti-poaching status badge */}
          {!isRangerVerified ? (
            <div className="pointer-events-auto px-2 py-0.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-[8.5px] font-black flex items-center gap-1 backdrop-blur-xs shadow-md whitespace-nowrap">
              <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0" />
              <span>Brouillage Nids 800m Actif</span>
            </div>
          ) : (
            <div className="pointer-events-auto px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[8.5px] font-black flex items-center gap-1 backdrop-blur-xs shadow-md whitespace-nowrap">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
              <span>GPS Sentinelle Certifié</span>
            </div>
          )}

          {/* Active fleet indicator (Uber style) */}
          <div className="pointer-events-auto px-2 py-0.5 rounded-full bg-slate-900/85 border border-slate-700 text-slate-200 text-[8.5px] font-black flex items-center gap-1.5 backdrop-blur-xs shadow-md whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Éco-Patrouille En Direct</span>
          </div>
        </div>

        {/* Floating Top-Right Mini Info Pill */}
        <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none">
          <div className="px-2 py-1 rounded-xl bg-slate-950/85 border border-slate-700/60 text-slate-300 text-[9px] font-bold backdrop-blur-xs shadow-md flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-400" />
            <span>Pointe-Noire</span>
          </div>
        </div>

        {/* Floating Bottom-Right Uber Control Actions */}
        <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col items-center gap-1.5">
          {/* Recenter to Balanced Overview Button (Uber Target Crosshair) */}
          <button
            type="button"
            onClick={handleResetOverview}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Vue d'ensemble côtière (Recentrer sans zoomer trop)"
          >
            <Navigation className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Zoomer"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            title="Dézoomer"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Bottom-Left Summary Banner */}
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
          <div className="px-2.5 py-1 rounded-xl bg-slate-950/85 border border-slate-700/70 text-[9px] text-slate-300 backdrop-blur-xs shadow-md flex items-center gap-2">
            <span className="font-extrabold text-white">
              {filteredReports.length} Dépôts
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-mono text-[8.5px]">
              Vue Éco-Littorale
            </span>
          </div>
        </div>

        {/* Vehicle Info Floating Popup */}
        {showVehicleInfo && (
          <div className="absolute top-12 left-2.5 right-12 z-30 p-2.5 rounded-2xl bg-slate-950/95 border border-sky-500/50 text-white shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="font-black text-[11px] text-white leading-tight">
                    Éco-Patrouille Renatura #1
                  </h5>
                  <span className="text-[9px] text-sky-300">En intervention • Côte Sauvage</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowVehicleInfo(false)}
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9.5px] text-slate-300 mt-1 leading-relaxed">
              Camion benne 3.5T en tournée de ramassage sur l'axe littoral. Vitesse : 22 km/h. 5 nids sécurisés aujourd'hui.
            </p>
          </div>
        )}
      </div>

      {/* Selected Hotspot Detailed Card */}
      {selectedMapPoint && (
        <div
          className={`p-3.5 rounded-2xl border transition-all space-y-2.5 text-xs ${
            isFixora
              ? 'bg-white border-slate-300 text-slate-900 shadow-md'
              : 'bg-slate-900 border-slate-700 text-white shadow-md'
          }`}
        >
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-black text-xs text-slate-950 dark:text-white truncate">
                  {selectedMapPoint.locationName}
                </h4>
              </div>
              <p className="text-[10px] text-slate-700 dark:text-slate-300 mt-0.5 font-mono font-bold truncate">
                {isRangerVerified
                  ? `GPS: ${selectedMapPoint.latitude.toFixed(4)}, ${selectedMapPoint.longitude.toFixed(4)}`
                  : `Zone approximative (Rayon sécurisé 800m)`}
              </p>
            </div>

            <span
              className={`text-[9.5px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 shadow-2xs ${
                selectedMapPoint.priorityLevel === 'CRITIQUE'
                  ? 'bg-red-600 text-white'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              Priorité : {selectedMapPoint.priorityScore} pts
            </span>
          </div>

          {/* Turtle Threat Alert Box */}
          {selectedMapPoint.turtleDangerLevel && (
            <div className="bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-700 p-2.5 rounded-xl flex items-center gap-2 text-[10.5px] text-red-950 dark:text-red-100 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-black block whitespace-nowrap">Danger Tortue Marine :</span>
                <span className="truncate block font-semibold">{selectedMapPoint.turtleDangerLevel}</span>
              </div>
            </div>
          )}

          {/* Characteristics Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl min-w-0 border border-slate-200 dark:border-slate-700">
              <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 block uppercase whitespace-nowrap">Type de Déchet</span>
              <span className="font-black capitalize text-slate-950 dark:text-white truncate block whitespace-nowrap">
                {selectedMapPoint.wasteType.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl min-w-0 border border-slate-200 dark:border-slate-700">
              <span className="text-[9.5px] font-black text-slate-700 dark:text-slate-300 block uppercase whitespace-nowrap">Gabarit Visuel</span>
              <span className="font-black capitalize text-slate-950 dark:text-white truncate block whitespace-nowrap">
                {selectedMapPoint.estimatedVolume}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
            {isRangerVerified && selectedMapPoint.status === 'reported' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleRejectReport(selectedMapPoint.id)}
                  className="flex-1 py-2 rounded-xl border border-red-400 text-red-800 dark:text-red-200 bg-red-50 dark:bg-red-950/40 font-black text-[11px] hover:bg-red-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span className="whitespace-nowrap">Rejeter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveReport(selectedMapPoint.id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] shadow-xs flex items-center justify-center gap-1 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span className="whitespace-nowrap">Valider Hotspot</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setMobileScreen('tour')}
                className="w-full py-2.5 rounded-xl bg-[#0A3D62] hover:bg-[#072B46] text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span className="whitespace-nowrap">Programmer la Collecte & Pesée</span>
                <ArrowRight className="w-4 h-4 text-cyan-300 shrink-0" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
