import React, { useState } from 'react';
import { 
  mockReports, 
  mockLots, 
  mockRecyclers, 
  POINTE_NOIRE_COASTAL_SITES, 
  REAL_TURTLE_THREATS, 
  REAL_COLLECTION_ROUTES, 
  REAL_IMPACT_CAMPAIGNS 
} from '../data/mockPointeNoireData';
import { WasteReport, SyncState, WasteType, WasteVolume } from '../types/koba';
import { SplashScreen } from './SplashScreen';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Sun, 
  Moon, 
  Leaf, 
  Map, 
  Camera, 
  ScanLine, 
  Truck, 
  QrCode, 
  BarChart3, 
  RotateCcw 
} from 'lucide-react';
import { TurtleIcon } from './demo/TurtleIcon';
import { MobileTopBar } from './demo/MobileTopBar';
import { MobileBottomNav, DemoScreen } from './demo/MobileBottomNav';
import { DonorExportModal } from './demo/DonorExportModal';
import { DesktopCompanion } from './demo/DesktopCompanion';
import { OnboardingScreen } from './demo/screens/OnboardingScreen';
import { HomeScreen } from './demo/screens/HomeScreen';
import { MapScreen } from './demo/screens/MapScreen';
import { ReportScreen } from './demo/screens/ReportScreen';
import { ScanScreen } from './demo/screens/ScanScreen';
import { TourScreen } from './demo/screens/TourScreen';
import { LotScreen } from './demo/screens/LotScreen';
import { ImpactScreen } from './demo/screens/ImpactScreen';
import { AuthScreen } from './demo/screens/AuthScreen';
import { EducationScreen } from './demo/screens/EducationScreen';
import { ProfileModal } from './demo/ProfileModal';
import { UserProfile } from '../types/koba';
import { MOCK_USERS } from '../data/mockPointeNoireData';

interface InteractiveDemoViewProps {
  replayTrigger?: number;
}

export const InteractiveDemoView: React.FC<InteractiveDemoViewProps> = ({ replayTrigger }) => {
  // Mode d'affichage : 'pure_mobile' (Application mobile Android 100% plein écran) ou 'web_demo' (Vue cadre téléphone + console)
  const [displayMode, setDisplayMode] = useState<'pure_mobile' | 'web_demo'>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024 ? 'pure_mobile' : 'web_demo';
    }
    return 'web_demo';
  });

  // Mobile App screen state inside the phone simulator
  const [showMobileSplash, setShowMobileSplash] = useState<boolean>(true);
  const [mobileScreen, setMobileScreen] = useState<DemoScreen>('home');
  const [themeMode, setThemeMode] = useState<'forest' | 'fixora'>('fixora'); // 'fixora' or 'forest'
  
  // Ecocitizen User Session State (Offline / Local sync)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_USERS[0]);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  React.useEffect(() => {
    if (replayTrigger && replayTrigger > 0) {
      setShowMobileSplash(true);
    }
  }, [replayTrigger]);

  // 5-Step Report Wizard State
  const [reportStep, setReportStep] = useState<number>(1);
  const [locationName, setLocationName] = useState(POINTE_NOIRE_COASTAL_SITES[0].name);
  const [wasteType, setWasteType] = useState<WasteType>('plastic_bag');
  const [estimatedVolume, setEstimatedVolume] = useState<WasteVolume>('large');
  const [isNestingZone, setIsNestingZone] = useState<boolean>(true);
  const [turtleDangerLevelText, setTurtleDangerLevelText] = useState<string>(REAL_TURTLE_THREATS[0].label);
  const [description, setDescription] = useState(
    'Accumulation importante de sacs plastiques transparents dérivant vers la frayère'
  );

  // Map Filter and Hotspot selection
  const [mapFilter, setMapFilter] = useState<'all' | 'critical' | 'turtle_nest' | 'collected'>('all');
  const [mapSectorFilter, setMapSectorFilter] = useState<string>('all');
  const [selectedMapPoint, setSelectedMapPoint] = useState<WasteReport | null>(mockReports[0]);
  const [isRangerVerified, setIsRangerVerified] = useState<boolean>(false);
  const [mapTileMode, setMapTileMode] = useState<'osm_offline' | 'satellite'>('osm_offline');

  // Audio / Speech guide state
  const [speechLanguage, setSpeechLanguage] = useState<'french' | 'lingala' | 'kituba'>('french');
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  // Donor Export Modal State
  const [showDonorExportModal, setShowDonorExportModal] = useState<boolean>(false);
  const [selectedDonorTemplate, setSelectedDonorTemplate] = useState<string>('ffem');

  // Network simulation state
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [reports, setReports] = useState<WasteReport[]>(mockReports);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Collector Tour state
  const [selectedTourId, setSelectedTourId] = useState<string>('route-pn-101');
  const [selectedReportToCollect, setSelectedReportToCollect] = useState<WasteReport | null>(mockReports[2]);
  const [isRouteOptimized, setIsRouteOptimized] = useState<boolean>(true);
  const [weighInput, setWeighInput] = useState<number>(48.5);
  const [weighSuccess, setWeighSuccess] = useState<boolean>(false);

  // Scan & Lot state
  const [scanScreenMode, setScanScreenMode] = useState<'qr_scanner' | 'type_recognition'>('qr_scanner');
  const [scannedLotId, setScannedLotId] = useState<string>('MASSEKO-2026-000127');
  const [selectedRecyclerId, setSelectedRecyclerId] = useState<string>('rec-01');

  // Impact Campaign state
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('camp-2026-ponte');

  // Audio helper
  const triggerAudioGuidance = (frenchMsg: string, lingalaMsg: string, kitubaMsg: string) => {
    let msg = frenchMsg;
    if (speechLanguage === 'lingala') msg = lingalaMsg;
    if (speechLanguage === 'kituba') msg = kitubaMsg;

    setActiveSpeechText(msg);
    setTimeout(() => {
      setActiveSpeechText(null);
    }, 4500);
  };

  // Human Moderation Handlers
  const handleApproveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'validated' as const, validatedAt: new Date().toISOString() }
          : r
      )
    );
    setReportSuccess('Signalement validé par le modérateur ONG Renatura.');
    setTimeout(() => setReportSuccess(null), 3000);
  };

  const handleRejectReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: 'rejected' as const } : r))
    );
    setReportSuccess('Signalement rejeté (doublon ou non conforme).');
    setTimeout(() => setReportSuccess(null), 3000);
  };

  // CSV Export for Donors
  const handleDownloadDonorCSV = () => {
    const headers =
      'ID,Site,Latitude,Longitude,TypeDechets,GabaritVisuelCitoyen,PoidsReelCertifieKg,StatutPesee,ZoneDePonte,DangerTortue,Co2EviteKg,DateCreation\n';
    const rows = reports
      .map(
        (r) =>
          `"${r.id}","${r.locationName}",${r.latitude},${r.longitude},"${r.wasteType}","${r.estimatedVolume}",${
            r.actualWeightKg || 0
          },"${r.actualWeightKg ? 'CERTIFIÉ_BALANCE' : 'EN_ATTENTE_COLLECTE'}","${
            r.isNestingZone ? 'OUI' : 'NON'
          }","${r.turtleDangerLevel || 'SÉCURISÉ'}",${((r.actualWeightKg || 0) * 2.5).toFixed(1)},"${
            r.createdAt
          }"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `MASSEKO_Rapport_Impact_Bailleurs_Renatura_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleValidateCollection = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'collected' as const,
            actualWeightKg: weighInput,
            collectedAt: new Date().toISOString(),
            syncState: isOnline ? ('synced' as const) : ('pending' as const),
          };
        }
        return r;
      })
    );

    setWeighSuccess(true);
    setTimeout(() => {
      setWeighSuccess(false);
      setMobileScreen('lot');
    }, 1500);
  };

  const calculateDynamicScore = () => {
    let score = 30;
    if (estimatedVolume === 'very_large') score += 35;
    else if (estimatedVolume === 'large') score += 25;
    else if (estimatedVolume === 'medium') score += 15;
    else score += 5;

    if (isNestingZone) score += 25;
    if (wasteType === 'fishing_net') score += 15;
    if (wasteType === 'plastic_bag') score += 15;

    return Math.min(100, score);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const finalScore = calculateDynamicScore();

    const backendIndicativeKg =
      estimatedVolume === 'very_large'
        ? 120
        : estimatedVolume === 'large'
        ? 60
        : estimatedVolume === 'medium'
        ? 20
        : 3;

    const newReport: WasteReport = {
      id: `rep-pn-00${reports.length + 1}`,
      authorId: 'guest-pn-demo',
      locationName,
      latitude: -4.792,
      longitude: 11.831,
      wasteType,
      estimatedVolume,
      estimatedWeightKg: backendIndicativeKg,
      photoUrl:
        'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=800&q=80',
      description,
      status: 'reported',
      priorityScore: finalScore,
      priorityLevel: finalScore >= 80 ? 'CRITIQUE' : finalScore >= 50 ? 'HAUTE' : 'MOYENNE',
      turtleDangerLevel: isNestingZone
        ? (turtleDangerLevelText as WasteReport['turtleDangerLevel'])
        : undefined,
      syncState: isOnline ? 'synced' : 'pending',
      createdAt: new Date().toISOString(),
    };

    setReports([newReport, ...reports]);
    setSelectedMapPoint(newReport);
    setReportSuccess(
      isOnline
        ? 'Signalement synchronisé avec succès !'
        : 'Signalement enregistré sur le téléphone (Mode Hors-Ligne) !'
    );
    setTimeout(() => {
      setReportSuccess(null);
      setReportStep(1);
      setMobileScreen('map');
    }, 1800);
  };

  const syncPendingReports = () => {
    setIsOnline(true);
    setReports((prev) => prev.map((r) => ({ ...r, syncState: 'synced' as SyncState })));
  };

  const pendingCount = reports.filter((r) => r.syncState === 'pending').length;

  const citizenScreens = [
    { id: 'onboarding' as DemoScreen, label: 'Intro & Slides' },
    { id: 'home' as DemoScreen, label: 'Accueil Citoyen' },
    { id: 'education' as DemoScreen, label: 'Académie & Savoirs' },
    { id: 'map' as DemoScreen, label: 'Carte & Nids' },
    { id: 'report' as DemoScreen, label: 'Signaler (5 Étapes)' },
    { id: 'scan' as DemoScreen, label: 'Scanner & Diagnostic' },
  ];

  const operationsScreens = [
    { id: 'tour' as DemoScreen, label: 'Tournée & Pesée' },
    { id: 'lot' as DemoScreen, label: 'Passeport Lot QR' },
    { id: 'impact' as DemoScreen, label: 'Impact & Bailleurs' },
  ];

  return (
    <div className="space-y-4">
      {/* Mode Selector & Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Display Mode Toggle (Pure Mobile vs Web Presentation) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setDisplayMode('pure_mobile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'pure_mobile'
                ? 'bg-[#0A3D62] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>📱 App Mobile Native (Plein Écran)</span>
          </button>
          <button
            type="button"
            onClick={() => setDisplayMode('web_demo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'web_demo'
                ? 'bg-[#0A3D62] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>💻 Vue Démo Web & Console</span>
          </button>
        </div>

        {/* Quick Screen Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider whitespace-nowrap shrink-0 mr-1">
            Écran :
          </span>
          {[
            { id: 'home' as DemoScreen, label: 'Accueil' },
            { id: 'map' as DemoScreen, label: 'Carte' },
            { id: 'report' as DemoScreen, label: 'Signaler' },
            { id: 'education' as DemoScreen, label: 'Académie' },
            { id: 'tour' as DemoScreen, label: 'Tournée' },
            { id: 'scan' as DemoScreen, label: 'Scan QR' },
            { id: 'impact' as DemoScreen, label: 'Impact' },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setShowMobileSplash(false);
                setMobileScreen(s.id);
              }}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                !showMobileSplash && mobileScreen === s.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Offline / Online Switcher */}
          <button
            onClick={() => {
              if (!isOnline) syncPendingReports();
              else setIsOnline(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              isOnline
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
            }`}
            title="Tester le basculement hors-ligne / en ligne"
          >
            {isOnline ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>En Ligne (4G)</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Hors-Ligne (Terrain)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* RENDER MODE 1: PURE MOBILE NATIVE FULL-SCREEN APP MODE */}
      {displayMode === 'pure_mobile' ? (
        <div className="flex flex-col items-center justify-center min-h-[82vh] w-full py-2">
          {/* Mobile Screen Container spanning full mobile width */}
          <div className="w-full max-w-md min-h-[820px] bg-slate-900 rounded-3xl sm:border-2 sm:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden relative isolate">
            {/* Inner Phone Screen Content */}
            <div
              className={`relative w-full h-full min-h-[820px] flex flex-col justify-between transition-colors ${
                themeMode === 'fixora' ? 'bg-[#F8FAFC]' : 'bg-[#0B131F]'
              }`}
            >
              {/* Splash Screen Overlay inside phone */}
              {showMobileSplash ? (
                <SplashScreen onFinish={() => setShowMobileSplash(false)} />
              ) : (
                <>
                  {/* Top Bar (Status bar, network, theme toggle, user profile) */}
                  <MobileTopBar
                    isOnline={isOnline}
                    setIsOnline={setIsOnline}
                    syncPendingReports={syncPendingReports}
                    themeMode={themeMode}
                    setThemeMode={setThemeMode}
                    pendingSyncCount={pendingCount}
                    currentUser={currentUser}
                    onOpenProfile={() => setShowProfileModal(true)}
                    onOpenAuth={() => setMobileScreen('auth')}
                    onOpenEducation={() => setMobileScreen('education')}
                  />

                  {/* Scrollable Main Viewport */}
                  <div className="flex-1 overflow-y-auto px-3.5 py-2.5 scrollbar-thin">
                    {mobileScreen === 'onboarding' && (
                      <OnboardingScreen
                        setMobileScreen={setMobileScreen}
                        themeMode={themeMode}
                      />
                    )}

                    {mobileScreen === 'auth' && (
                      <AuthScreen
                        currentUser={currentUser}
                        onLogin={(u) => {
                          setCurrentUser(u);
                        }}
                        onRegister={(newUser) => {
                          setCurrentUser(newUser);
                        }}
                        setMobileScreen={setMobileScreen}
                        themeMode={themeMode}
                      />
                    )}

                    {mobileScreen === 'education' && (
                      <EducationScreen
                        setMobileScreen={setMobileScreen}
                        themeMode={themeMode}
                        currentUser={currentUser}
                        onAwardPoints={(points) => {
                          if (currentUser) {
                            setCurrentUser((prev) =>
                              prev ? { ...prev, points: prev.points + points } : null
                            );
                          }
                        }}
                        triggerAudioGuidance={triggerAudioGuidance}
                      />
                    )}

                    {mobileScreen === 'home' && (
                      <HomeScreen
                        reports={reports}
                        setMobileScreen={setMobileScreen}
                        setSelectedMapPoint={setSelectedMapPoint}
                        themeMode={themeMode}
                        isOnline={isOnline}
                        currentUser={currentUser}
                        onOpenProfile={() => setShowProfileModal(true)}
                      />
                    )}

                    {mobileScreen === 'map' && (
                      <MapScreen
                        reports={reports}
                        selectedMapPoint={selectedMapPoint}
                        setSelectedMapPoint={setSelectedMapPoint}
                        mapFilter={mapFilter}
                        setMapFilter={setMapFilter}
                        mapSectorFilter={mapSectorFilter}
                        setMapSectorFilter={setMapSectorFilter}
                        isRangerVerified={isRangerVerified}
                        setIsRangerVerified={setIsRangerVerified}
                        mapTileMode={mapTileMode}
                        setMapTileMode={setMapTileMode}
                        themeMode={themeMode}
                        setMobileScreen={setMobileScreen}
                        handleApproveReport={handleApproveReport}
                        handleRejectReport={handleRejectReport}
                      />
                    )}

                    {mobileScreen === 'report' && (
                      <ReportScreen
                        reportStep={reportStep}
                        setReportStep={setReportStep}
                        locationName={locationName}
                        setLocationName={setLocationName}
                        wasteType={wasteType}
                        setWasteType={setWasteType}
                        estimatedVolume={estimatedVolume}
                        setEstimatedVolume={setEstimatedVolume}
                        isNestingZone={isNestingZone}
                        setIsNestingZone={setIsNestingZone}
                        turtleDangerLevelText={turtleDangerLevelText}
                        setTurtleDangerLevelText={setTurtleDangerLevelText}
                        description={description}
                        setDescription={setDescription}
                        handleCreateReport={handleCreateReport}
                        calculateDynamicScore={calculateDynamicScore}
                        themeMode={themeMode}
                        speechLanguage={speechLanguage}
                        setSpeechLanguage={setSpeechLanguage}
                        triggerAudioGuidance={triggerAudioGuidance}
                        activeSpeechText={activeSpeechText}
                        reportSuccess={reportSuccess}
                        setMobileScreen={setMobileScreen}
                      />
                    )}

                    {mobileScreen === 'scan' && (
                      <ScanScreen
                        scanScreenMode={scanScreenMode}
                        setScanScreenMode={setScanScreenMode}
                        setMobileScreen={setMobileScreen}
                        setScannedLotId={setScannedLotId}
                        themeMode={themeMode}
                      />
                    )}

                    {mobileScreen === 'tour' && (
                      <TourScreen
                        selectedTourId={selectedTourId}
                        setSelectedTourId={setSelectedTourId}
                        reports={reports}
                        selectedReportToCollect={selectedReportToCollect}
                        setSelectedReportToCollect={setSelectedReportToCollect}
                        weighInput={weighInput}
                        setWeighInput={setWeighInput}
                        handleValidateCollection={handleValidateCollection}
                        weighSuccess={weighSuccess}
                        isRouteOptimized={isRouteOptimized}
                        setIsRouteOptimized={setIsRouteOptimized}
                        themeMode={themeMode}
                        setMobileScreen={setMobileScreen}
                      />
                    )}

                    {mobileScreen === 'lot' && (
                      <LotScreen
                        scannedLotId={scannedLotId}
                        selectedRecyclerId={selectedRecyclerId}
                        setSelectedRecyclerId={setSelectedRecyclerId}
                        themeMode={themeMode}
                        setMobileScreen={setMobileScreen}
                      />
                    )}

                    {mobileScreen === 'impact' && (
                      <ImpactScreen
                        selectedCampaignId={selectedCampaignId}
                        setSelectedCampaignId={setSelectedCampaignId}
                        reports={reports}
                        themeMode={themeMode}
                        setShowDonorExportModal={setShowDonorExportModal}
                        handleDownloadDonorCSV={handleDownloadDonorCSV}
                        setMobileScreen={setMobileScreen}
                      />
                    )}
                  </div>

                  {/* Standard 5-Tab Navigation Bar */}
                  <MobileBottomNav
                    mobileScreen={mobileScreen}
                    setMobileScreen={setMobileScreen}
                    themeMode={themeMode}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RENDER MODE 2: WEB PRESENTATION DEMO MODE (Phone frame mockup + Supervision Console) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT: PHONE SIMULATOR ================= */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <div className="relative w-[370px] sm:w-[395px] h-[800px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/80 flex flex-col justify-between overflow-hidden">
              {/* Top Speaker / Dynamic Island Bezel */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-40 flex items-center justify-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></div>
                <div className="w-10 h-1 rounded-full bg-slate-800"></div>
              </div>

              {/* Inner Phone Screen Content */}
              <div
                className={`relative w-full h-full rounded-[40px] overflow-hidden flex flex-col justify-between transition-colors ${
                  themeMode === 'fixora' ? 'bg-[#F8FAFC]' : 'bg-[#0B131F]'
                }`}
              >
                {/* Splash Screen Overlay inside phone */}
                {showMobileSplash ? (
                  <SplashScreen onFinish={() => setShowMobileSplash(false)} />
                ) : (
                  <>
                    {/* Top Bar (Status bar, network, theme toggle, user profile) */}
                    <MobileTopBar
                      isOnline={isOnline}
                      setIsOnline={setIsOnline}
                      syncPendingReports={syncPendingReports}
                      themeMode={themeMode}
                      setThemeMode={setThemeMode}
                      pendingSyncCount={pendingCount}
                      currentUser={currentUser}
                      onOpenProfile={() => setShowProfileModal(true)}
                      onOpenAuth={() => setMobileScreen('auth')}
                      onOpenEducation={() => setMobileScreen('education')}
                    />

                    {/* Scrollable Main Viewport */}
                    <div className="flex-1 overflow-y-auto px-3.5 py-2.5 scrollbar-thin">
                      {mobileScreen === 'onboarding' && (
                        <OnboardingScreen
                          setMobileScreen={setMobileScreen}
                          themeMode={themeMode}
                        />
                      )}

                      {mobileScreen === 'auth' && (
                        <AuthScreen
                          currentUser={currentUser}
                          onLogin={(u) => {
                            setCurrentUser(u);
                          }}
                          onRegister={(newUser) => {
                            setCurrentUser(newUser);
                          }}
                          setMobileScreen={setMobileScreen}
                          themeMode={themeMode}
                        />
                      )}

                      {mobileScreen === 'education' && (
                        <EducationScreen
                          setMobileScreen={setMobileScreen}
                          themeMode={themeMode}
                          currentUser={currentUser}
                          onAwardPoints={(points) => {
                            if (currentUser) {
                              setCurrentUser((prev) =>
                                prev ? { ...prev, points: prev.points + points } : null
                              );
                            }
                          }}
                          triggerAudioGuidance={triggerAudioGuidance}
                        />
                      )}

                      {mobileScreen === 'home' && (
                        <HomeScreen
                          reports={reports}
                          setMobileScreen={setMobileScreen}
                          setSelectedMapPoint={setSelectedMapPoint}
                          themeMode={themeMode}
                          isOnline={isOnline}
                          currentUser={currentUser}
                          onOpenProfile={() => setShowProfileModal(true)}
                        />
                      )}

                      {mobileScreen === 'map' && (
                        <MapScreen
                          reports={reports}
                          selectedMapPoint={selectedMapPoint}
                          setSelectedMapPoint={setSelectedMapPoint}
                          mapFilter={mapFilter}
                          setMapFilter={setMapFilter}
                          mapSectorFilter={mapSectorFilter}
                          setMapSectorFilter={setMapSectorFilter}
                          isRangerVerified={isRangerVerified}
                          setIsRangerVerified={setIsRangerVerified}
                          mapTileMode={mapTileMode}
                          setMapTileMode={setMapTileMode}
                          themeMode={themeMode}
                          setMobileScreen={setMobileScreen}
                          handleApproveReport={handleApproveReport}
                          handleRejectReport={handleRejectReport}
                        />
                      )}

                      {mobileScreen === 'report' && (
                        <ReportScreen
                          reportStep={reportStep}
                          setReportStep={setReportStep}
                          locationName={locationName}
                          setLocationName={setLocationName}
                          wasteType={wasteType}
                          setWasteType={setWasteType}
                          estimatedVolume={estimatedVolume}
                          setEstimatedVolume={setEstimatedVolume}
                          isNestingZone={isNestingZone}
                          setIsNestingZone={setIsNestingZone}
                          turtleDangerLevelText={turtleDangerLevelText}
                          setTurtleDangerLevelText={setTurtleDangerLevelText}
                          description={description}
                          setDescription={setDescription}
                          handleCreateReport={handleCreateReport}
                          calculateDynamicScore={calculateDynamicScore}
                          themeMode={themeMode}
                          speechLanguage={speechLanguage}
                          setSpeechLanguage={setSpeechLanguage}
                          triggerAudioGuidance={triggerAudioGuidance}
                          activeSpeechText={activeSpeechText}
                          reportSuccess={reportSuccess}
                          setMobileScreen={setMobileScreen}
                        />
                      )}

                      {mobileScreen === 'scan' && (
                        <ScanScreen
                          scanScreenMode={scanScreenMode}
                          setScanScreenMode={setScanScreenMode}
                          setMobileScreen={setMobileScreen}
                          setScannedLotId={setScannedLotId}
                          themeMode={themeMode}
                        />
                      )}

                      {mobileScreen === 'tour' && (
                        <TourScreen
                          selectedTourId={selectedTourId}
                          setSelectedTourId={setSelectedTourId}
                          reports={reports}
                          selectedReportToCollect={selectedReportToCollect}
                          setSelectedReportToCollect={setSelectedReportToCollect}
                          weighInput={weighInput}
                          setWeighInput={setWeighInput}
                          handleValidateCollection={handleValidateCollection}
                          weighSuccess={weighSuccess}
                          isRouteOptimized={isRouteOptimized}
                          setIsRouteOptimized={setIsRouteOptimized}
                          themeMode={themeMode}
                          setMobileScreen={setMobileScreen}
                        />
                      )}

                      {mobileScreen === 'lot' && (
                        <LotScreen
                          scannedLotId={scannedLotId}
                          selectedRecyclerId={selectedRecyclerId}
                          setSelectedRecyclerId={setSelectedRecyclerId}
                          themeMode={themeMode}
                          setMobileScreen={setMobileScreen}
                        />
                      )}

                      {mobileScreen === 'impact' && (
                        <ImpactScreen
                          selectedCampaignId={selectedCampaignId}
                          setSelectedCampaignId={setSelectedCampaignId}
                          reports={reports}
                          themeMode={themeMode}
                          setShowDonorExportModal={setShowDonorExportModal}
                          handleDownloadDonorCSV={handleDownloadDonorCSV}
                          setMobileScreen={setMobileScreen}
                        />
                      )}
                    </div>

                    {/* Standard 5-Tab Navigation Bar */}
                    <MobileBottomNav
                      mobileScreen={mobileScreen}
                      setMobileScreen={setMobileScreen}
                      themeMode={themeMode}
                    />

                    {/* Home Indicator Bar */}
                    <div className="py-1 flex justify-center bg-transparent">
                      <div className="w-28 h-1 rounded-full bg-slate-400/40"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: DESKTOP SUPERVISION & TELEMETRY PANEL ================= */}
          <div className="lg:col-span-6 xl:col-span-7">
            <DesktopCompanion
              reports={reports}
              selectedMapPoint={selectedMapPoint}
              setSelectedMapPoint={setSelectedMapPoint}
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              syncPendingReports={syncPendingReports}
              mobileScreen={mobileScreen}
              setMobileScreen={setMobileScreen}
              handleApproveReport={handleApproveReport}
              handleRejectReport={handleRejectReport}
              setShowDonorExportModal={setShowDonorExportModal}
              handleDownloadDonorCSV={handleDownloadDonorCSV}
              isRangerVerified={isRangerVerified}
              setIsRangerVerified={setIsRangerVerified}
            />
          </div>
        </div>
      )}

      {/* Official Donor Export Modal */}
      <DonorExportModal
        isOpen={showDonorExportModal}
        onClose={() => setShowDonorExportModal(false)}
        reports={reports}
        selectedDonorTemplate={selectedDonorTemplate}
        setSelectedDonorTemplate={setSelectedDonorTemplate}
        handleDownloadDonorCSV={handleDownloadDonorCSV}
      />

      {/* Ecocitizen Profile & Account Management Modal */}
      <ProfileModal
        currentUser={currentUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={() => setCurrentUser(null)}
        onSwitchUser={(newUser) => setCurrentUser(newUser)}
        setMobileScreen={setMobileScreen}
        themeMode={themeMode}
      />
    </div>
  );
};
