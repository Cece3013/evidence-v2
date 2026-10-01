// src/store/index.ts
import { create } from 'zustand';

export interface OrderConfig {
  formulaId: string;
  formulaPrice: number;
  roomType: string;
  decoStyle: string;
  photos: any[];
  promptGenerated: string;
  propertyType?: string;
  propertySize?: "Studio" | "T1" | "T2" | "T3" | "T4" | "T5" | "Autre";
  exteriorFeatures?: string[];
  isHabite?: boolean;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  propertyAddress?: string;
  formulaLabel?: string;
}

export interface PhotoItem {
  uri: string;
  roomLabel: string;
  roomTypeId?: string;
  roomSize?: string;
}

export interface Conseil {
  priorite: 'urgent' | 'important' | 'optionnel';
  texte: string;
  impact: string;
}

export interface AnalysisResult {
  orderId: string;
  beforeAfterPairs: { piece: string; avant: string | null; apres: string | null }[];
  conseils: Conseil[];
  pdfUrl?: string;
  invoiceUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  token?: string; // jeton de connexion client (reçu après le code e-mail)
}

interface AppState {
  user: User | null;
  orderConfig: Partial<OrderConfig>;
  currentResult: AnalysisResult | null;
  orders: any[];

  setUser: (user: User | null) => void;
  setOrderConfig: (config: Partial<OrderConfig>) => void;
  resetOrderConfig: () => void;
  setCurrentResult: (result: AnalysisResult | null) => void;
  addOrder: (order: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  orderConfig: {},
  currentResult: null,
  orders: [],

  setUser: (user) => set({ user }),

  setOrderConfig: (config) =>
    set((state) => ({ orderConfig: { ...state.orderConfig, ...config } })),

  resetOrderConfig: () => set({ orderConfig: {} }),

  setCurrentResult: (result) => set({ currentResult: result }),

  addOrder: (order) =>
    set((state) => ({ orders: [order, ...state.orders] })),
}));