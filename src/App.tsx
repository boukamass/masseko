import React, { useState, useEffect } from 'react';
import { 
  mockReports, 
  mockLots, 
  mockRecyclers, 
  POINTE_NOIRE_COASTAL_SITES, 
  REAL_TURTLE_THREATS, 
  REAL_COLLECTION_ROUTES, 
  REAL_IMPACT_CAMPAIGNS,
  MOCK_USERS
} from './data/mockPointeNoireData';
import { WasteReport, SyncState, WasteType, WasteVolume, UserProfile } from './types/koba';
import { SplashScreen } from './components/SplashScreen';
import { MobileTopBar } from './components/demo/MobileTopBar';
import { MobileBottomNav, DemoScreen } from './components/demo/MobileBottomNav';
import { DonorExportModal } from './components/demo/DonorExportModal';
import { ProfileModal } from './components/demo/ProfileModal';

// Mobile Screens
import { OnboardingScreen } from './components/demo/screens/OnboardingScreen';
import { HomeScreen } from './components/demo/screens/HomeScreen';
import { MapScreen } from './components/demo/screens/MapScreen';
import { ReportScreen } from './components/demo/screens/ReportScreen';
import { ScanScreen } from './components/demo/screens/ScanScreen';
import { TourScreen } from './components/demo/screens/TourScreen';
import { LotScreen } from './components/demo/screens/LotScreen';
import { ImpactScreen } from './components/demo/screens/ImpactScreen';
import { AuthScreen } from './components/demo/screens/AuthScreen';
import { EducationScreen } from './components/demo/screens/EducationScreen';

export default function App() {
  // Mobile Splash & Screen State
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [mobileScreen, setMobileScreen] = useState<DemoScreen>('home');
  const [themeMode, setThemeMode] = useState<'forest' | 'fixora'>('fixora');
  
  // User Session & Modals State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(MOCK_USERS[0]);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showDonorExportModal, setShowDonorExportModal] = useState<boolean>(false);
  const [selectedDonorTemplate, setSelectedDonorTemplate] = useState<string>('ffem');

  // Reports & Network Real-time Detection State
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [reports, setReports] = useState<WasteReport[]>(mockReports);
  const [reportSuccess, setReportSuccess] = useState<string | null>(null);

  // Automatic Network Detection & Auto-Sync Hook
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Automatically sync any pending reports when network reconnects
      setReports((prev) =>
        prev.map((r) => (r.syncState === 'pending' ? { ...r, syncState: 'synced' as SyncState } : r))
      );
      setReportSuccess('Connexion Internet rétablie : synchronisation automatique effectuée.');
      setTimeout(() => setReportSuccess(null), 3500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

  // Collector Tour & Weighing State
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

  // Moderation
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

  // Validation of collection tour
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
      authorId: currentUser?.id || 'guest-pn-demo',
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

  const handleDownloadDonorCSV = () => {
    const headers = ['ID', 'Secteur', 'Type_Dechet', 'Volume', 'Poids_Kg_Reel', 'Statut', 'Date'];
    const rows = reports.map((r) => [
      r.id,
      r.locationName,
      r.wasteType,
      r.estimatedVolume,
      r.actualWeightKg || 0,
      r.status,
      r.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rapport_Masseko_PointeNoire_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pendingCount = reports.filter((r) => r.syncState === 'pending').length;

  // Render Splash Screen directly at root level so it is 100% full-screen without any frame or rounded border
  if (showSplashScreen) {
    return <SplashScreen onFinish={() => setShowSplashScreen(false)} />;
  }

  return (
    <div className={`min-h-screen flex justify-center text-slate-950 font-sans selection:bg-blue-600 selection:text-white transition-colors ${
      themeMode === 'fixora' ? 'bg-[#E5E5EA]' : 'bg-[#000000]'
    }`}>
      {/* Mobile App Standalone Frame (100% full screen on mobile, max-w-md on desktop) */}
      <div
        className={`w-full min-h-screen sm:max-w-md flex flex-col justify-between overflow-hidden relative isolate sm:shadow-2xl transition-colors sm:border-x ${
          themeMode === 'fixora'
            ? 'bg-[#F2F2F7] sm:border-slate-300 text-slate-950'
            : 'bg-[#000000] sm:border-slate-800 text-white'
        }`}
      >
        {/* Top Bar (Status bar, network, theme toggle, user profile, PWA install) */}
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

            {/* Scrollable Main Viewport for Active Screen */}
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

            {/* Standard 5-Tab Mobile Navigation Bar */}
            <MobileBottomNav
              mobileScreen={mobileScreen}
              setMobileScreen={setMobileScreen}
              themeMode={themeMode}
            />
      </div>

      {/* User Profile & Persona Switcher Modal */}
      <ProfileModal
        currentUser={currentUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={() => setCurrentUser(null)}
        onSwitchUser={(newUser) => setCurrentUser(newUser)}
        setMobileScreen={setMobileScreen}
        themeMode={themeMode}
      />

      {/* Official Donor Export Modal */}
      <DonorExportModal
        isOpen={showDonorExportModal}
        onClose={() => setShowDonorExportModal(false)}
        reports={reports}
        selectedDonorTemplate={selectedDonorTemplate}
        setSelectedDonorTemplate={setSelectedDonorTemplate}
        handleDownloadDonorCSV={handleDownloadDonorCSV}
      />
    </div>
  );
}
