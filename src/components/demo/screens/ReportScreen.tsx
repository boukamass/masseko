import React from 'react';
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
  ShieldAlert
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
            <span className="w-5 h-5 rounded-full bg-[#0A3D62] dark:bg-sky-500 text-white font-black text-[11px] flex items-center justify-center">
              {reportStep}
            </span>
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              {stepTitles[reportStep - 1]}
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
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
              className="p-1 rounded-lg text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Écouter le guide vocal"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Language Switch */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[9px] font-bold">
              {(['french', 'lingala', 'kituba'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSpeechLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded-md uppercase transition-all ${
                    speechLanguage === lang
                      ? 'bg-[#0A3D62] dark:bg-sky-600 text-white font-black'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {lang === 'french' ? 'FR' : lang === 'lingala' ? 'LN' : 'KT'}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-bold text-slate-400 pl-1">
              {reportStep}/5
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(reportStep / 5) * 100}%` }}
          />
        </div>

        {/* Spoken feedback banner if any */}
        {activeSpeechText && (
          <div className="p-2 rounded-xl bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1.5 animate-in fade-in">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">"{activeSpeechText}"</span>
          </div>
        )}

        {reportSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{reportSuccess}</span>
          </div>
        )}
      </div>

      {/* 2. Step Form */}
      <form onSubmit={handleCreateReport} className="space-y-3">
        {/* ================= STEP 1: PHOTO & LOCATION ================= */}
        {reportStep === 1 && (
          <div className="space-y-3 animate-in fade-in">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-900 border border-emerald-500/30 flex items-center justify-center text-white">
              <img
                src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80"
                alt="Captured Waste"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />
              <div className="relative z-10 bg-slate-950/75 px-3 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1.5 backdrop-blur-xs">
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photo capturée • GPS synchronisé</span>
              </div>
            </div>

            <ModernSelect
              label="Secteur Littoral :"
              value={locationName}
              onChange={(val) => setLocationName(val)}
              themeMode={themeMode}
              searchable={true}
              icon={<MapPin className="w-4 h-4 text-emerald-500" />}
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
              className="w-full h-10 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-black text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <span className="whitespace-nowrap">Suivant : Type de Déchet</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          </div>
        )}

        {/* ================= STEP 2: WASTE TYPE ================= */}
        {reportStep === 2 && (
          <div className="space-y-3 animate-in fade-in">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
              Matière Dominante
            </span>

            <div className="grid grid-cols-2 gap-2">
              {wasteTypesList.map((item) => {
                const Icon = item.icon;
                const isSelected = wasteType === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setWasteType(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[90px] cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-slate-800 border-[#0284C7] ring-2 ring-sky-500/20'
                        : isFixora
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#0284C7] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0284C7] dark:text-sky-400 shrink-0" />}
                    </div>

                    <div className="mt-1.5 min-w-0">
                      <span className="font-extrabold text-xs block leading-tight truncate">
                        {item.label}
                      </span>
                      <span className="text-[9.5px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
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
                className="w-1/3 h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(3)}
                className="w-2/3 h-10 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
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
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block truncate">
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
                    className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-slate-800 border-[#0284C7] ring-2 ring-sky-500/20'
                        : isFixora
                        ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {vol.label}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0">
                          {vol.range}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate">
                        {vol.desc}
                      </span>
                    </div>

                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0284C7] dark:text-sky-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(2)}
                className="w-1/3 h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-2/3 h-10 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Suivant : Menace Nids</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: TURTLE DANGER ================= */}
        {reportStep === 4 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Nesting Toggle */}
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                isNestingZone
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500'
                  : isFixora
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
              onClick={() => setIsNestingZone(!isNestingZone)}
            >
              <div className="flex items-center gap-2">
                <TurtleIcon className={`w-5 h-5 shrink-0 ${isNestingZone ? 'text-amber-500' : 'text-slate-400'}`} />
                <div>
                  <span className="font-extrabold text-xs block">
                    Proximité de Nids de Tortues
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Zone de ponte active ou ponte observée
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isNestingZone}
                onChange={(e) => setIsNestingZone(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer pointer-events-none"
              />
            </div>

            {/* If Nesting Zone is active: Sleek Threat Selector */}
            {isNestingZone && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-[10.5px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Type de Menace Côtière Identifiée
                </span>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
                  {REAL_TURTLE_THREATS.map((t) => {
                    const isSelected = turtleDangerLevelText === t.label;

                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTurtleDangerLevelText(t.label)}
                        className={`w-full p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 dark:bg-red-950/60 border-red-500 ring-1 ring-red-400'
                            : isFixora
                            ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-xs truncate block">
                            {t.shortLabel || t.label}
                          </span>
                          <span className="text-[9.5px] text-slate-400 dark:text-slate-400 truncate block">
                            {t.speciesConcerned}
                          </span>
                        </div>

                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${
                            t.dangerLevel === 'EXTRÊME'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
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
                className="w-1/3 h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => setReportStep(5)}
                className="w-2/3 h-10 px-3 rounded-xl bg-[#0A3D62] dark:bg-sky-600 hover:bg-[#082F4D] text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="whitespace-nowrap">Calculer Score Priorité</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: PRIORITY SCORE & SUBMIT ================= */}
        {reportStep === 5 && (
          <div className="space-y-3 animate-in fade-in">
            {/* Score Pill Card */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A3D62] to-[#0F2338] text-white space-y-2 shadow-sm border border-cyan-500/25">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-200 truncate">
                  Score de Priorité d'Intervention
                </span>
                <span className="bg-white text-[#0A3D62] text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs whitespace-nowrap shrink-0">
                  {calculateDynamicScore()} / 100 PTS
                </span>
              </div>

              <div className="text-[10.5px] text-cyan-100 space-y-1 pt-1 border-t border-cyan-700/50">
                <div className="flex justify-between">
                  <span>Gabarit estimé :</span>
                  <span className="font-bold">+{estimatedVolume === 'very_large' ? 35 : estimatedVolume === 'large' ? 25 : 15} pts</span>
                </div>
                <div className="flex justify-between">
                  <span>Protection nids :</span>
                  <span className="font-bold">+{isNestingZone ? 25 : 0} pts</span>
                </div>
              </div>
            </div>

            {/* Optional Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                Repère de terrain (Optionnel) :
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Près du grand palmier à 30m de la piste..."
                className={`w-full h-9 px-3 rounded-xl border text-xs ${
                  isFixora
                    ? 'bg-white border-slate-300 text-slate-800'
                    : 'bg-slate-900 border-slate-800 text-white'
                }`}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setReportStep(4)}
                className="w-1/3 h-10 px-2 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                Retour
              </button>
              <button
                type="submit"
                className="w-2/3 h-10 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">Enregistrer Signalement</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
