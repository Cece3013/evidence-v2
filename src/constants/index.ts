export const COLORS = {
  // Doré — identité de marque
  gold: '#bd8a34',
  goldLight: '#faf4ec',
  goldMid: '#e8d3b0',
  goldDark: '#9a6f26',

  // Vert kaki — univers professionnel
  khaki: '#313d00',
  khakiLight: '#4a5a14',

  // Neutres
  dark: '#1a1a1a',
  dark2: '#2a2a2a',
  black: '#000000',
  white: '#ffffff',
  offWhite: '#f7f2ee',
  beige: '#e8e0d8',
  beigeMid: '#d4c9bd',
  gray: '#8a8079',
  grayLight: '#f0ebe6',
  grayDark: '#4a443f',

  // États
  success: '#22c55e',
  successBg: '#f0faf0',
  successBorder: '#c0e0c0',
  successText: '#2d6a32',
  warning: '#e8d3b0',
  warningBg: '#fdf8f0',
  warningText: '#9a6f26',
  stripePurple: '#635bff',
  border: '#e8e0d8',
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

// Identifiants alignés sur les prompts du backend
export const ROOM_TYPES = [
  { id: 'salon', label: 'Salon', icon: 'Sofa' },
  { id: 'salon_salle_a_manger', label: 'Salon / Salle à manger', icon: 'Armchair' },
  { id: 'cuisine', label: 'Cuisine', icon: 'CookingPot' },
  { id: 'coin_repas', label: 'Coin repas', icon: 'UtensilsCrossed' },
  { id: 'salle_bain', label: 'Salle de bain', icon: 'Bath' },
  { id: 'chambre_parentale', label: 'Chambre parentale', icon: 'BedDouble' },
  { id: 'chambre_enfant', label: 'Chambre enfant', icon: 'BedSingle' },
  { id: 'chambre_ado', label: 'Chambre ado', icon: 'Lamp' },
  { id: 'bureau', label: 'Bureau', icon: 'Briefcase' },
  { id: 'balcon_terrasse', label: 'Balcon / Terrasse', icon: 'TreePalm' },
];

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL
  || 'https://poetic-youthfulness-production-fecb.up.railway.app';

// Adresses réelles utilisées par l'application (alignement V1, 01/10/2026)
export const API_URL = 'https://poetic-youthfulness-production-fecb.up.railway.app';
export const SITE_URL = 'https://evidence-platform-pied.vercel.app';
export const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_KEY || '';