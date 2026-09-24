export type MassekoRole = 'citizen' | 'fisherman' | 'school' | 'association' | 'collector' | 'admin' | 'recycler';
export type KobaRole = MassekoRole;

export type WasteType = 'plastic_bottle' | 'plastic_bag' | 'fishing_net' | 'fishing_gear' | 'mixed_plastic' | 'other';

export type WasteVolume = 'small' | 'medium' | 'large' | 'very_large';

export type PriorityLevel = 'CRITIQUE' | 'HAUTE' | 'MOYENNE' | 'BASSE';

export type ReportStatus = 
  | 'reported'
  | 'pending_validation'
  | 'validated'
  | 'assigned'
  | 'in_collection'
  | 'collected'
  | 'transported'
  | 'received'
  | 'valorized'
  | 'rejected';

export type SyncState = 'pending' | 'syncing' | 'synced' | 'error';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: MassekoRole;
  neighborhood: string; // e.g. "Côte Sauvage", "Tié-Tié", "Loandjili", "Mpita"
  points: number;
  levelName: string; // e.g. "Sentinelle", "Gardien du Littoral"
  avatarUrl?: string;
  schoolName?: string;
}

export interface WasteReport {
  id: string;
  authorId?: string;
  guestIdentifier?: string;
  latitude: number;
  longitude: number;
  locationName: string; // e.g. "Plage de la Côte Sauvage - Secteur 2"
  wasteType: WasteType;
  estimatedVolume: WasteVolume;
  estimatedWeightKg: number;
  actualWeightKg?: number;
  photoUrl: string;
  description: string;
  status: ReportStatus;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  turtleDangerLevel?: 'EXTRÊME (INGESTION/ÉTOUFFEMENT)' | 'HAUT (ENCHEVÊTREMENT)' | 'SÉCURISÉ';
  isNestingZone?: boolean; // Zone de ponte des tortues Luth & Olivier
  duplicateOfId?: string;
  syncState: SyncState;
  createdAt: string;
  validatedAt?: string;
  collectedAt?: string;
}

export interface CollectionTour {
  id: string;
  collectorId: string;
  collectorName: string;
  status: 'planned' | 'in_progress' | 'completed';
  reportIds: string[];
  totalEstimatedWeightKg: number;
  totalActualWeightKg: number;
  optimizedDistanceKm: number;
  createdAt: string;
  completedAt?: string;
}

export interface WasteLot {
  id: string; // e.g. "MASSEKO-2026-000127"
  tourId: string;
  collectorId: string;
  collectorName: string;
  recyclerId?: string;
  recyclerName?: string;
  actualWeightKg: number;
  wasteType: WasteType;
  originDescription: string;
  status: 'created' | 'transported' | 'received' | 'valorized';
  valorizationType?: 'mechanical_recycling' | 'reuse' | 'transformation' | 'other';
  qrCodeUrl: string;
  createdAt: string;
  receivedAt?: string;
  valorizedAt?: string;
}

export interface TraceabilityEvent {
  id: string;
  lotId: string;
  eventType: 'reported' | 'validated' | 'assigned' | 'collected' | 'weighed' | 'transported' | 'received' | 'valorized';
  actorName: string;
  actorRole: MassekoRole;
  timestamp: string;
  latitude: number;
  longitude: number;
  details: string;
  photoUrl?: string;
}

export interface RecyclerPartner {
  id: string;
  name: string;
  locationName: string;
  latitude: number;
  longitude: number;
  capacityTonPerMonth: number;
  valorizationTypes: string[];
  contactPhone: string;
}

export interface MassekoKPIs {
  totalKgCollected: number;
  cleanedZonesCount: number;
  totalReportsCount: number;
  valorizedLotsCount: number;
  activeCollectorsCount: number;
  partnerRecyclersCount: number;
  co2AvoidedKg: number;
  avgTimeToCleanDays: number;
  valorizationRatePercent: number;
  protectedTurtleNestsCount: number; // Nids de tortues sauvés / sécurisés
  estimatedTurtlesSaved: number; // Tortues marines préservées du plastique
}
export type KobaKPIs = MassekoKPIs;
