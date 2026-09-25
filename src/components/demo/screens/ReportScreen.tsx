import React, { useState, useRef } from 'react';
import { 
  Camera, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Volume2, 
  Boxes, 
  ShoppingBag, 
  Package, 
  Layers,
  ShieldAlert,
  Navigation,
  Upload,
  RefreshCw
} from 'lucide-react';
import { 
  POINTE_NOIRE_COASTAL_SITES, 
  REAL_TURTLE_THREATS 
} from '../../../data/mockPointeNoireData';
import { WasteType, WasteVolume } from '../../../types/koba';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';
import { ModernSelect, ModernSelectOption } from '../ModernSelect';

interface ReportScreenProps {
  reportStep: number;
  setReportStep: (step: number) => void;
  locationName: string;
  setLocationName: (loc: string) => void;
  wasteType: WasteType;
  setWasteType: (type: WasteType) => void;
  estimatedVolume: WasteVolume;
  setEstimatedVolume: (vol: WasteVolume) => void;
  isNestingZone: boolean;
  setIsNestingZone: (nesting: boolean) => void;
  turtleDangerLevelText: string;
  setTurtleDangerLevelText: (level: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  handleCreateReport: (e: React.FormEvent) => void;
  calculateDynamicScore: () => number;
  themeMode: 'forest' | 'fixora';
  speechLanguage: 'french' | 'lingala' | 'kituba';
  setSpeechLanguage: (lang: 'french' | 'lingala' | 'kituba') => void;
  triggerAudioGuidance: (fr: string, ling: string, kit: string) => void;
  activeSpeechText: string | null;
  reportSuccess: string | null;
  setMobileScreen: (screen: DemoScreen) => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  reportStep,
  setReportStep,
  locationName,
  setLocationName,
  wasteType,
  setWasteType,
  estimatedVolume,
  setEstimatedVolume,
  isNestingZone,
  setIsNestingZone,
  turtleDangerLevelText,
  setTurtleDangerLevelText,
  description,
  setDescription,
  handleCreateReport,
  calculateDynamicScore,
  themeMode,
  speechLanguage,
  setSpeechLanguage,
  triggerAudioGuidance,
  activeSpeechText,
  reportSuccess,
  setMobileScreen,
}) => {
  const isFixora = themeMode === 'fixora';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Real Camera & Real GPS state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [realGpsCoords, setRealGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetRealGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatusMessage("Géolocalisation non supportée par ce navigateur.");
      return;
    }

    setIsLocatingGPS(true);
    setGpsStatusMessage("Recherche du signal GPS en cours...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocatingGPS(false);
        const { latitude, longitude } = position.coords;
        setRealGpsCoords({ lat: latitude, lng: longitude });
        setGpsStatusMessage(`GPS Fixé : ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      },
      (error) => {
        setIsLocatingGPS(false);
        setGpsStatusMessage("Signal GPS approximatif (Côte Pointe-Noire activée).");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const stepTitles = [
    'Photo & Secteur',
    'Type de Déchet',
    'Gabarit Estimé',
    'Menace Nids',
    'Score & Envoi',
  ];

  const wasteTypesList: { id: WasteType; label: string; desc: string; icon: any }[] = [
    { id: 'plastic_bag', label: 'Sacs Plastiques', desc: 'Confusion létale avec les méduses', icon: ShoppingBag },
    { id: 'plastic_bottle', label: 'Bouteilles PET', desc: 'Bouteilles de boissons recyclables', icon: Package },
    { id: 'fishing_net', label: 'Filets Fantômes', desc: 'Risque d’étranglement des tortues', icon: Layers },
    { id: 'mixed_plastic', label: 'Plastiques Mixtes', desc: 'Bidons et contenants divers', icon: Boxes },
  ];

  const volumeList: { id: WasteVolume; label: string; range: string; desc: string }[] = [
    { id: 'small', label: 'Petit', range: '~1-5 kg', desc: 'Tient dans un sac poubelle' },
    { id: 'medium', label: 'Moyen', range: '~15-30 kg', desc: 'Brouette ou plusieurs sacs' },
    { id: 'large', label: 'Grand', range: '~50-100 kg', desc: 'Étalé sur le sable' },
    { id: 'very_large', label: 'Très Grand', range: '>100 kg', desc: 'Amas important (Camion requis)' },
  ];

  return (
    <div className="space-y-3 pb-3">
      {/* 1. Header with Compact Stepper & Audio Shortcut */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#0052CC] dark:bg-sky-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {reportStep}
            </span>
            <h3 className="font-black text-base text-slate-950 dark:text-white">
              {stepTitles[reportStep - 1]}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Minimalist Audio Guide */}
            <button
              type="button"
              onClick={() =>
                triggerAudioGuidance(
                  "Prenez une photo claire du déchet et confirmez votre secteur de plage.",
                  "Zua foti ya pamba mpe tindá esika ozali na libongo.",
                  "Bika foto ya mbote mpe tubila bisika nge kele na masa."
                )
              }
              className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-slate-800 text-sky-800 dark:text-sky-300 hover:bg-sky-200 transition-colors cursor-pointer flex items-center justify-center border border-sky-300 dark:border-slate-700"
              title="Écouter le guide vocal"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-xl p-1 text-[10px] font-black border border-slate-300 dark:border-slate-700">
              {(['french', 'lingala', 'kituba'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSpeechLanguage(lang)}
                  className={`px-2 py-1 rounded-lg uppercase transition-all ${
                    speechLanguage === lang
                      ? 'bg-[#0052CC] text-white font-black shadow-xs'
                      : 'text-slate-900 hover:text-black dark:text-slate-200 dark:hover:text-white font-black'
                  }`}
                >
                  {lang === 'french' ? 'FR' : lang === 'lingala' ? 'LN' : 'KT'}
                </button>
              ))}
            </div>

            <span className="text-xs font-black text-slate-950 dark:text-white pl-1">
              {reportStep}/5
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-300 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 dark:bg-emerald-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(reportStep / 5) * 100}%` }}
          />
        </div>

        {/* Spoken feedback banner if any */}
        {activeSpeechText && (
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="truncate">"{activeSpeechText}"</span>
          </div>
        )}

        {reportSuccess && (
          <div className="p-3 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-black flex items-center gap-2 animate-in fade-in shadow-md">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{reportSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. Step Form */}
      <form onSubmit={handleCreateReport} className="space-y-3">
        {/* ================= STEP 1: PHOTO & LOCATION ================= */}
        {reportStep === 1 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Real Camera Capture / Photo Area */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />

            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500/40 flex items-center justify-center text-white group shadow-sm">
              <img
                src={
                  capturedPhotoUrl ||
                  "https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                }
                alt="Captured Waste"
                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 gap-2">
                <div className="flex items-center justify-between">
                  <div className="bg-black/85 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 backdrop-blur-xs text-white border border-white/20">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>{capturedPhotoUrl ? 'Photo Réelle Capturée' : 'Aperçu Déchet Littoral'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 shrink-0" />
                    <span>Ouvrir Caméra</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live GPS Locator Button */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#161618] border border-slate-300 dark:border-slate-700 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Navigation className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                  <span className="font-black text-xs sm:text-sm text-slate-950 dark:text-white">
                    Position GPS Réelle
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGetRealGPS}
                  disabled={isLocatingGPS}
                  className="h-9 px-3 rounded-xl bg-[#0052CC] text-white font-black text-xs hover:bg-[#00388A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocatingGPS ? 'animate-spin' : ''}`} />
                  <span>Actualiser GPS</span>
                </button>
              </div>

              {gpsStatusMessage && (
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                  {gpsStatusMessage}
                </p>
              )}
            </div>

            <ModernSelect
              label="Secteur Littoral Sélectionné :"
              value={locationName}
              onChange={(val) => setLocationName(val)}
              themeMode={themeMode}
              searchable={true}
              icon={<MapPin className="w-4 h-4 text-emerald-600" />}
              options={POINTE_NOIRE_COASTAL_SITES.map((site) => ({
                value: site.name,
                label: site.name,
                subtitle: `${site.sector} • ${site.turtleSpecies}`,
                badge: site.threatLevel,
                badgeColor: (site.threatLevel === 'CRITIQUE'
                  ? 'red'
                  : site.threatLevel === 'HAUTE'
                  ? 'amber'
                  : 'emerald') as ModernSelectOption['badgeColor'],
              }))}
            />

            <button
              type="button"
              onClick={() => setReportStep(2)}
              className="w-full h-12 px-4 rounded-xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Suivant : Type de Déchet</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: WASTE TYPE ================= */}
        {reportStep === 2 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider block truncate">
              Matière Dominante
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              {wasteTypesList.map((item) => {
                const Icon = item.icon;
                const isSelected = wasteType === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWasteType(item.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[96px] cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                        : isFixora
                        ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                        : 'bg-[#161618] hover:bg-slate-800 border-slate-700 text-white shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white'
                      }`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400 shrink-0 font-black" />}
                    </div>

                    <div className="mt-2 min-w-0">
                      <span className="font-black text-xs sm:text-sm text-slate-950 dark:text-white block leading-tight truncate">
                        {item.label}
                      </span>
                      <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold block mt-0.5 truncate">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(1)}
                className="w-1/3 h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-[#161618] hover:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(3)}
                className="w-2/3 h-12 px-4 rounded-xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Suivant : Gabarit</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: VOLUME ESTIMATION ================= */}
        {reportStep === 3 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wider block truncate">
              Gabarit Visuel Estimé
            </span>

            <div className="space-y-2">
              {volumeList.map((vol) => {
                const isSelected = estimatedVolume === vol.id;

                return (
                  <button
                    key={vol.id}
                    type="button"
                    onClick={() => setEstimatedVolume(vol.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-600 ring-2 ring-blue-500/30 text-slate-950 dark:text-white shadow-xs'
                        : isFixora
                        ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                        : 'bg-[#161618] hover:bg-slate-800 border-slate-700 text-white shadow-xs'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs sm:text-sm text-slate-950 dark:text-white truncate">
                          {vol.label}
                        </span>
                        <span className="bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white text-xs font-black px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 border border-slate-300 dark:border-slate-700">
                          {vol.range}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold block mt-0.5 truncate">
                        {vol.desc}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 font-black" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(2)}
                className="w-1/3 h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-[#161618] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-2/3 h-12 px-4 rounded-xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Suivant : Menace Nids</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TURTLE DANGER ================= */}
        {reportStep === 4 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Nesting Toggle */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                isNestingZone
                  ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-500 shadow-xs ring-2 ring-amber-400/40'
                  : isFixora
                  ? 'bg-white border-slate-300 text-slate-950 shadow-xs'
                  : 'bg-[#161618] border-slate-700 text-white shadow-xs'
              }`}
              onClick={() => setIsNestingZone(!isNestingZone)}
            >
              <div className="flex items-center gap-3">
                <TurtleIcon className={`w-6 h-6 shrink-0 ${isNestingZone ? 'text-amber-700 dark:text-amber-300' : 'text-slate-700 dark:text-slate-300'}`} />
                <div>
                  <span className="font-black text-xs sm:text-sm block text-slate-950 dark:text-white">
                    Proximité de Nids de Tortues
                  </span>
                  <span className="text-xs text-slate-800 dark:text-slate-200 font-bold block mt-0.5">
                    Zone de ponte active ou ponte observée
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isNestingZone}
                onChange={(e) => setIsNestingZone(e.target.checked)}
                className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer pointer-events-none"
              />
            </div>

            {/* If Nesting Zone is active: Threat Selector */}
            {isNestingZone && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  Type de Menace Côtière Identifiée
                </span>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 scrollbar-thin">
                  {REAL_TURTLE_THREATS.map((t) => {
                    const isSelected = turtleDangerLevelText === t.label;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTurtleDangerLevelText(t.label)}
                        className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 dark:bg-rose-950 border-rose-600 ring-2 ring-rose-500/30 shadow-xs'
                            : isFixora
                            ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-2xs'
                            : 'bg-[#161618] hover:bg-slate-800 border-slate-700 text-white shadow-2xs'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-black text-xs sm:text-sm truncate block text-slate-950 dark:text-white">
                            {t.shortLabel || t.label}
                          </span>
                          <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold truncate block mt-0.5">
                            {t.speciesConcerned}
                          </span>
                        </div>

                        <span
                          className={`text-[10px] font-black px-2.5 py-1 rounded-md shrink-0 shadow-2xs ${
                            t.dangerLevel === 'EXTRÊME'
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-400 text-slate-950 border border-amber-500 font-black'
                          }`}
                        >
                          {t.dangerLevel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(3)}
                className="w-1/3 h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-[#161618] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(5)}
                className="w-2/3 h-12 px-4 rounded-xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Calculer Score Priorité</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PRIORITY SCORE & SUBMIT ================= */}
        {reportStep === 5 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Score Pill Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00388A] to-[#0A2540] text-white space-y-2.5 shadow-md border border-cyan-400/40">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-200 truncate">
                  Score de Priorité d'Intervention
                </span>
                <span className="bg-white text-[#00388A] text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-xs whitespace-nowrap shrink-0">
                  {calculateDynamicScore()} / 100 PTS
                </span>
              </div>

              <div className="text-xs text-white space-y-1 pt-2 border-t border-cyan-500/40">
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-100">Gabarit estimé :</span>
                  <span className="font-black text-white">+{estimatedVolume === 'very_large' ? 35 : estimatedVolume === 'large' ? 25 : 15} pts</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-cyan-100">Protection nids :</span>
                  <span className="font-black text-white">+{isNestingZone ? 25 : 0} pts</span>
                </div>
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-xs font-black text-slate-950 dark:text-white mb-1.5">
                Repère de terrain (Optionnel) :
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Près du grand palmier à 30m de la piste..."
                className={`w-full h-12 px-3.5 rounded-xl border text-xs sm:text-sm font-bold shadow-xs ${
                  isFixora
                    ? 'bg-white border-slate-300 text-slate-950 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500'
                    : 'bg-[#161618] border-slate-700 text-white placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-1/3 h-12 px-3 rounded-xl border border-slate-300 dark:border-slate-700 font-black text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-[#161618] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center shadow-xs"
              >
                Retour
              </button>
              <button
                type="submit"
                className="w-2/3 h-12 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
                <span className="whitespace-nowrap">Enregistrer Signalement</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
