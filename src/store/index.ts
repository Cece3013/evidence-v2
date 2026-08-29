// src/store/index.ts
import { create } from 'zustand';

export interface OrderConfig {
  formulaId: string;
  formulaPrice: number;
  roomType: string;
  roomSubType?: string;
  decoStyle: string;
  multiVue: boolean;
  selectedAngles: string[];
  photos: any[];
  promptGenerated: string;
  propertyType?: string;
  propertySize?: "Studio" | "T1" | "T2" | "T3" | "T4" | "T5" | "Autre";
  exteriorFeatures?: string[];
  roomCount?: string;
  exteriors?: string[];
  profile?: string;
  isHabite?: boolean;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  propertyAddress?: string;
  formulaLabel?: string;
}

export interface PhotoItem {
  uri: string;
  angle?: string;
  roomLabel: string;
}

export interface Conseil {
  priorite: 'urgent' | 'important' | 'optionnel';
  texte: string;
  impact: string;
}

export interface AnalysisResult {
  orderId: string;
  beforeAfterPairs: { angle: string; beforeUri: string | null; afterUri: string | null; afterUri2?: string | null }[];
  score: number;
  scoreDetails: { label: string; value: number }[];
  conseils: Conseil[];
  pdfUrl?: string;
  invoiceUrl?: string;
  regenCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AppState {
  user: User | null;
  orderConfig: Partial<OrderConfig>;
  currentResult: AnalysisResult | null;
  orders: any[];
  freeTrialUsed: boolean;
  freeTrialTimestamp: number | null;

  setUser: (user: User | null) => void;
  setOrderConfig: (config: Partial<OrderConfig>) => void;
  resetOrderConfig: () => void;
  setCurrentResult: (result: AnalysisResult | null) => void;
  addOrder: (order: any) => void;
  setFreeTrialUsed: (timestamp: number) => void;
  canUseFreeTrialToday: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  orderConfig: {},
  currentResult: null,
  orders: [],
  freeTrialUsed: false,
  freeTrialTimestamp: null,

  setUser: (user) => set({ user }),

  setOrderConfig: (config) =>
    set((state) => ({ orderConfig: { ...state.orderConfig, ...config } })),

  resetOrderConfig: () => set({ orderConfig: {} }),

  setCurrentResult: (result) => set({ currentResult: result }),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),

  setFreeTrialUsed: (timestamp) =>
    set({ freeTrialUsed: true, freeTrialTimestamp: timestamp }),

  canUseFreeTrialToday: () => {
    const { freeTrialTimestamp } = get();
    if (!freeTrialTimestamp) return true;
    const hoursSince = (Date.now() - freeTrialTimestamp) / (1000 * 60 * 60);
    return hoursSince >= 24;
  },
}));