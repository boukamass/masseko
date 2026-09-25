import React, { useState } from 'react';
import { 
  Lock, 
  Phone, 
  Mail, 
  User, 
  MapPin, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  GraduationCap, 
  Truck, 
  Fish, 
  Eye, 
  EyeOff, 
  WifiOff, 
  KeyRound,
  Compass
} from 'lucide-react';
import { UserProfile, MassekoRole } from '../../../types/koba';
import { MOCK_USERS, POINTE_NOIRE_NEIGHBORHOODS } from '../../../data/mockPointeNoireData';
import { TurtleIcon } from '../TurtleIcon';
import { DemoScreen } from '../MobileBottomNav';

interface AuthScreenProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onRegister: (newUser: UserProfile) => void;
  setMobileScreen: (screen: DemoScreen) => void;
  themeMode: 'forest' | 'fixora';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLogin,
  onRegister,
  setMobileScreen,
  themeMode,
}) => {
  const isFixora = themeMode === 'fixora';
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginPhoneOrEmail, setLoginPhoneOrEmail] = useState<string>('+242 06 812 34 56');
  const [loginPin, setLoginPin] = useState<string>('1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Register Form States
  const [regFullName, setRegFullName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('+242 06 ');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regNeighborhood, setRegNeighborhood] = useState<string>(POINTE_NOIRE_NEIGHBORHOODS[0]);
  const [regRole, setRegRole] = useState<MassekoRole>('citizen');
  const [regSchoolName, setRegSchoolName] = useState<string>('');
  const [regPin, setRegPin] = useState<string>('2026');
  const [regAcceptedCharter, setRegAcceptedCharter] = useState<boolean>(true);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Quick Demo Login Handler
  const handleQuickDemoSelect = (user: UserProfile) => {
    setLoginPhoneOrEmail(user.phone || user.email);
    setLoginPin('1234');
    onLogin(user);
    setAuthSuccess(`Bienvenue, ${user.fullName} (${user.levelName}) !`);
    setTimeout(() => {
      setAuthSuccess(null);
      setMobileScreen('home');
    }, 900);
  };

  // Submit Login
  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInput = loginPhoneOrEmail.trim().toLowerCase();
    
    // Find matching mock user
    const matchedUser = MOCK_USERS.find(
      u => (u.phone && u.phone.toLowerCase().replace(/\s/g, '').includes(cleanInput.replace(/\s/g, ''))) ||
           (u.email && u.email.toLowerCase() === cleanInput)
    );

    if (matchedUser) {
      onLogin(matchedUser);
      setAuthSuccess(`Connexion réussie ! Heureux de vous revoir, ${matchedUser.fullName}.`);
      setTimeout(() => {
        setAuthSuccess(null);
        setMobileScreen('home');
      }, 800);
    } else {
      // Allow seamless login as custom user
      const customUser: UserProfile = {
        id: `user-${Date.now().toString().slice(-4)}`,
        fullName: loginPhoneOrEmail.includes('@') ? loginPhoneOrEmail.split('@')[0] : 'Sentinelle Littorale',
        email: loginPhoneOrEmail.includes('@') ? loginPhoneOrEmail : `${loginPhoneOrEmail.replace(/[^0-9]/g, '')}@masseko.cg`,
        phone: loginPhoneOrEmail.includes('@') ? '+242 06 000 00 00' : loginPhoneOrEmail,
        role: 'citizen',
        neighborhood: 'Côte Sauvage (Sanctuaire)',
        points: 150,
        levelName: 'Sentinelle Active',
      };
      onLogin(customUser);
      setAuthSuccess(`Connexion établie en mode sécurisé hors-ligne.`);
      setTimeout(() => {
        setAuthSuccess(null);
        setMobileScreen('home');
      }, 800);
    }
  };

  // Submit Registration
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!regFullName.trim()) {
      setRegisterError('Veuillez indiquer votre nom complet ou pseudonyme.');
      return;
    }
    if (!regAcceptedCharter) {
      setRegisterError('Veuillez accepter la charte d’engagement écocitoyen MASSEKO.');
      return;
    }

    const roleLevels: Record<MassekoRole, string> = {
      citizen: 'Sentinelle Littorale Débutante',
      fisherman: 'Éco-Gardien des Mers & Filets',
      school: 'Ambassadeur Scolaire Jeunesse',
      collector: 'Collecteur Terrestre Homologué',
      association: 'Partenaire ONG Littorale',
      admin: 'Modérateur Terrestre',
      recycler: 'Partenaire Filière Valorisation',
    };

    const newUser: UserProfile = {
      id: `user-${Date.now().toString().slice(-4)}`,
      fullName: regFullName.trim(),
      email: regEmail.trim() || `${regPhone.replace(/[^0-9]/g, '') || 'citoyen'}@masseko.cg`,
      phone: regPhone.trim(),
      role: regRole,
      neighborhood: regNeighborhood,
      schoolName: regRole === 'school' ? (regSchoolName.trim() || 'Lycée Victor Augagneur') : undefined,
      points: 50, // Welcome bonus
      levelName: roleLevels[regRole] || 'Sentinelle Engagée',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    };

    onRegister(newUser);
    setAuthSuccess(`Compte créé avec succès ! +50 Éco-Points de bienvenue attribués.`);
    setTimeout(() => {
      setAuthSuccess(null);
      setMobileScreen('home');
    }, 1000);
  };

  return (
    <div className="space-y-3.5 pb-3">
      {/* Brand Header */}
      <div className="text-center pt-1 space-y-1.5">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md border border-blue-500">
          <TurtleIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-base font-black text-slate-950 dark:text-white flex items-center justify-center gap-1.5">
            Masseko Pointe-Noire
            <span className="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-950 border border-blue-300 shadow-2xs">
              Pass Écocitoyen
            </span>
          </h2>
          <p className="text-xs text-slate-800 dark:text-slate-200 font-bold">
            Protection des tortues marines & traçabilité des plastiques côtiers
          </p>
        </div>
      </div>

      {/* Auth Mode Tabs (Connexion / Inscription) */}
      <div className="flex rounded-2xl p-1 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setLoginError(null);
            setRegisterError(null);
          }}
          className={`w-1/2 py-2 rounded-xl font-black text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            authMode === 'login'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold'
          }`}
        >
          <span className="whitespace-nowrap">Se Connecter</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('register');
            setLoginError(null);
            setRegisterError(null);
          }}
          className={`w-1/2 py-2 rounded-xl font-black text-xs transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            authMode === 'register'
              ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-white shadow-xs'
              : 'text-slate-800 dark:text-slate-200 hover:text-slate-950 font-bold'
          }`}
        >
          <span className="whitespace-nowrap">Créer un Compte</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {authSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{authSuccess}</span>
        </div>
      )}

      {/* ================= LOGIN FORM ================= */}
      {authMode === 'login' && (
        <form onSubmit={handleSubmitLogin} className="space-y-3 animate-in fade-in">
          {loginError && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isFixora
                ? 'bg-white border-slate-300 text-slate-950 shadow-xs'
                : 'bg-[#1C1C1E] border-slate-800 text-white shadow-xs'
            }`}
          >
            {/* Phone or Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                Téléphone (Congo +242) ou Email :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginPhoneOrEmail}
                  onChange={(e) => setLoginPhoneOrEmail(e.target.value)}
                  placeholder="+242 06 123 45 67"
                  className={`w-full h-10 pl-9 pr-3 rounded-xl text-xs font-bold border outline-hidden transition-colors ${
                    isFixora
                      ? 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-950 placeholder:text-slate-600'
                      : 'bg-slate-900 border-slate-700 focus:border-blue-400 focus:bg-black text-white placeholder:text-slate-400'
                  }`}
                />
                <Phone className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* PIN Code / Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                  Code PIN Terrestre ou Mot de Passe :
                </label>
                <span className="text-[10px] text-blue-700 dark:text-blue-300 font-black">
                  (Défaut: 1234)
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPin}
                  onChange={(e) => setLoginPin(e.target.value)}
                  placeholder="Code PIN à 4 chiffres"
                  className={`w-full h-10 pl-9 pr-10 rounded-xl text-xs font-bold border outline-hidden transition-colors ${
                    isFixora
                      ? 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-950 placeholder:text-slate-600'
                      : 'bg-slate-900 border-slate-700 focus:border-blue-400 focus:bg-black text-white placeholder:text-slate-400'
                  }`}
                />
                <KeyRound className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Offline Token Info Badge */}
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center gap-2 text-[10.5px] text-slate-800 dark:text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Authentification locale hors-ligne active (SQLite / PowerSync).</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Lock className="w-4 h-4 text-cyan-300 shrink-0" />
            <span className="whitespace-nowrap">Se Connecter & Accéder au Pass</span>
          </button>

          {/* Quick Demo Personas Selector */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Connexion Rapide (Personas Pointe-Noire)
              </span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {MOCK_USERS.slice(0, 4).map((u) => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickDemoSelect(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 ring-2 ring-blue-500/40 text-blue-950 dark:text-white'
                        : isFixora
                        ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-950 shadow-xs'
                        : 'bg-[#1C1C1E] hover:bg-slate-800 border-slate-700 text-white shadow-xs'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {u.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-black text-xs block truncate text-slate-950 dark:text-white">{u.fullName}</span>
                      <span className="text-[10px] text-slate-800 dark:text-slate-200 font-bold truncate block">
                        {u.role === 'citizen' ? 'Sentinelle' : u.role === 'collector' ? 'Collecteur' : u.role === 'fisherman' ? 'Pêcheur' : 'Lycée'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      )}

      {/* ================= REGISTER FORM ================= */}
      {authMode === 'register' && (
        <form onSubmit={handleSubmitRegister} className="space-y-3 animate-in fade-in">
          {registerError && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-bold">{registerError}</span>
            </div>
          )}

          <div
            className={`p-3.5 rounded-2xl border space-y-3 ${
              isFixora
                ? 'bg-white border-slate-300 text-slate-950 shadow-xs'
                : 'bg-[#1C1C1E] border-slate-800 text-white shadow-xs'
            }`}
          >
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                Nom Complet ou Pseudonyme Écocitoyen :
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Ex: Jean-Marc Mabiala"
                  className={`w-full h-11 pl-9 pr-3 rounded-xl text-xs sm:text-sm font-bold border outline-hidden transition-colors ${
                    isFixora
                      ? 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-950 placeholder:text-slate-600'
                      : 'bg-slate-900 border-slate-700 focus:border-blue-400 focus:bg-black text-white placeholder:text-slate-400'
                  }`}
                />
                <User className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                  Téléphone (+242) :
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+242 06 123 45 67"
                    className={`w-full h-11 pl-8 pr-2 rounded-xl text-xs sm:text-sm font-bold border outline-hidden transition-colors ${
                      isFixora
                        ? 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-950 placeholder:text-slate-600'
                        : 'bg-slate-900 border-slate-700 focus:border-blue-400 focus:bg-black text-white placeholder:text-slate-400'
                    }`}
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 absolute left-2.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                  Email (Optionnel) :
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contact@exemple.cg"
                    className={`w-full h-11 pl-8 pr-2 rounded-xl text-xs sm:text-sm font-bold border outline-hidden transition-colors ${
                      isFixora
                        ? 'bg-slate-50 border-slate-300 focus:border-blue-600 focus:bg-white text-slate-950 placeholder:text-slate-600'
                        : 'bg-slate-900 border-slate-700 focus:border-blue-400 focus:bg-black text-white placeholder:text-slate-400'
                    }`}
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300 absolute left-2.5 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Neighborhood Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                Quartier / Secteur Littoral de Pointe-Noire :
              </label>
              <div className="relative">
                <select
                  value={regNeighborhood}
                  onChange={(e) => setRegNeighborhood(e.target.value)}
                  className={`w-full h-11 pl-9 pr-3 rounded-xl text-xs sm:text-sm font-bold border outline-hidden transition-colors appearance-none cursor-pointer ${
                    isFixora
                      ? 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-950'
                      : 'bg-slate-900 border-slate-700 focus:border-blue-400 text-white'
                  }`}
                >
                  {POINTE_NOIRE_NEIGHBORHOODS.map((n) => (
                    <option key={n} value={n} className="text-slate-950">
                      {n}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Role / Engagement Type */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                Rôle & Statut dans la Communauté Masseko :
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'citizen' as MassekoRole, label: 'Citoyen Sentinelle', icon: TurtleIcon, desc: 'Signalement & suivi' },
                  { id: 'fisherman' as MassekoRole, label: 'Pêcheur / Gardien', icon: Fish, desc: 'Filets fantômes' },
                  { id: 'school' as MassekoRole, label: 'Établissement / École', icon: GraduationCap, desc: 'Challenge inter-écoles' },
                  { id: 'collector' as MassekoRole, label: 'Collecteur Agréé', icon: Truck, desc: 'Tournées & pesées' },
                ].map((roleItem) => {
                  const Icon = roleItem.icon;
                  const isRoleActive = regRole === roleItem.id;
                  return (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => setRegRole(roleItem.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-0.5 ${
                        isRoleActive
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/80 ring-2 ring-blue-500/30 text-blue-950 dark:text-blue-100 font-black'
                          : isFixora
                          ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-950 font-bold'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="font-black text-[11px] truncate">{roleItem.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-800 dark:text-slate-200 font-bold truncate">{roleItem.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* If school selected, ask school name */}
            {regRole === 'school' && (
              <div className="space-y-1 animate-in fade-in">
                <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                  Nom de l'Établissement Scolaire :
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    placeholder="Ex: Lycée Victor Augagneur, CEG Anselme Pembellot"
                    className={`w-full h-11 pl-9 pr-3 rounded-xl text-xs sm:text-sm font-bold border outline-hidden transition-colors ${
                      isFixora
                        ? 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-950'
                        : 'bg-slate-900 border-slate-700 focus:border-blue-400 text-white'
                    }`}
                  />
                  <GraduationCap className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            )}

            {/* PIN Code Creation */}
            <div className="space-y-1">
              <label className="text-[11px] font-black text-slate-900 dark:text-slate-100 block">
                Créer un Code PIN Rapide (4 Chiffres) :
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={regPin}
                  onChange={(e) => setRegPin(e.target.value)}
                  placeholder="2026"
                  className={`w-full h-11 pl-9 pr-3 rounded-xl text-xs sm:text-sm font-bold font-mono tracking-widest border outline-hidden transition-colors ${
                    isFixora
                      ? 'bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-950'
                      : 'bg-slate-900 border-slate-700 focus:border-blue-400 text-white'
                  }`}
                />
                <KeyRound className="w-4 h-4 text-slate-600 dark:text-slate-300 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Charter Agreement */}
            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={regAcceptedCharter}
                onChange={(e) => setRegAcceptedCharter(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-800 dark:text-slate-200 font-bold leading-tight">
                J’accepte la charte écocitoyenne de Pointe-Noire (non-divulgation des nids sensibles aux braconniers & tri certifié).
              </span>
            </label>
          </div>

          {/* Submit Registration Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#0052CC] hover:bg-[#00388A] text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Award className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap">Créer mon Compte (+50 Pts Offerts)</span>
            <ArrowRight className="w-4 h-4 text-white shrink-0" />
          </button>
        </form>
      )}

      {/* Guest Mode Direct Access */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={() => setMobileScreen('home')}
          className="text-xs text-slate-950 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 font-black py-1.5 transition-colors inline-flex items-center gap-1.5 cursor-pointer underline underline-offset-2"
        >
          <span>Continuer en Mode Invité (Sans Compte)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
