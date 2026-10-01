export const COLORS = {
  gold: '#c8a96e',
  goldLight: '#fdf6ec',
  goldMid: '#f0d9b5',
  goldDark: '#a07c3e',
  dark: '#1a1a1a',
  dark2: '#2a2a2a',
  white: '#ffffff',
  offWhite: '#f8f7f4',
  beige: '#e8e4de',
  beigeMid: '#d4cdc4',
  gray: '#888888',
  grayLight: '#f0ece8',
  grayDark: '#555555',
  success: '#22c55e',
  successBg: '#f0faf0',
  successBorder: '#c0e0c0',
  successText: '#2d6a32',
  warning: '#f0d9b5',
  warningBg: '#fff8f0',
  warningText: '#8a6020',
  stripePurple: '#635bff',
  border: '#e8e4de',
};

export const FORMULAS: any = {
  decouverte: { id: 'decouverte', name: 'Découverte', price: 39.00 },
  essentielle: { id: 'essentielle', name: 'Essentielle', price: 89.00 },
  performance: { id: 'performance', name: 'Performance', price: 139.00, popular: true },
  essentiel_habite: { id: 'essentiel_habite', name: 'Essentiel', price: 79.00 },
  premium_habite: { id: 'premium_habite', name: 'Premium', price: 159.00, popular: true },
  pro_starter: { id: 'pro_starter', name: 'PRO Starter', price: 49.00 },
  pro_business: { id: 'pro_business', name: 'PRO Business', price: 99.00, popular: true },
  pro_agency: { id: 'pro_agency', name: 'PRO Agency', price: 199.00 },
};

export const ROOM_TYPES = [
  { id: 'salon', label: 'Salon', icon: '🛋️', multiVue: true },
  { id: 'chambre', label: 'Chambre', icon: '🛏️', multiVue: true, hasSubTypes: true },
  { id: 'cuisine', label: 'Cuisine', icon: '🍳', multiVue: false },
  { id: 'salle_manger', label: 'Salle à manger', icon: '🪑', multiVue: false },
  { id: 'bureau', label: 'Bureau', icon: '💼', multiVue: false },
  { id: 'entree', label: 'Entrée', icon: '🚪', multiVue: false },
  { id: 'salle_bain', label: 'Salle de bain', icon: '🚿', multiVue: false },
  { id: 'suite_parentale', label: 'Suite parentale', icon: '🌙', multiVue: false },
  { id: 'terrasse', label: 'Terrasse', icon: '🌿', multiVue: false },
];

export const CHAMBRE_SUBTYPES = [
  { id: 'bebe', label: 'Bébé', icon: '🍼', ageRange: '0–2 ans' },
  { id: 'enfant', label: 'Enfant', icon: '🧸', ageRange: '3–10 ans' },
  { id: 'ado', label: 'Ado', icon: '🎧', ageRange: '11–17 ans' },
  { id: 'adulte', label: 'Adulte', icon: '🌿', ageRange: '18+ ans' },
];

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.evidence-homestaging.fr';

// Adresses réelles utilisées par l'application (alignement V1, 01/10/2026)
export const API_URL = 'https://poetic-youthfulness-production-fecb.up.railway.app';
export const SITE_URL = 'https://evidence-platform-pied.vercel.app';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_KEY || 'pk_live_XXXX';
export const FREE_TRIAL_COOLDOWN_HOURS = 24;
