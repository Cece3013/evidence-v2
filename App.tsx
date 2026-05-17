// App.tsx — Entry point
import React from 'react';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}


// ─────────────────────────────────────────────────────────────────────────────────
// src/screens/OffersScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────────
import React2, { useState as useState2 } from 'react';
import { View as V2, Text as T2, ScrollView as SC2, TouchableOpacity as TO2, StyleSheet as SS2 } from 'react-native';
import { useNavigation as UN2, useRoute as UR2 } from '@react-navigation/native';
import { SafeAreaView as SAV2 } from 'react-native-safe-area-context';
import { COLORS as C2, FORMULAS } from './src/constants';

export const OffersScreen = () => {
  const nav = UN2<any>();
  const route = UR2<any>();
  const [tab, setTab] = useState2<'vide' | 'habite'>(route.params?.type || 'vide');

  const vide = [FORMULAS.essentials, FORMULAS.essentielsPlus];
  const habite = [FORMULAS.premium, FORMULAS.premiumPlus];
  const formulas = tab === 'vide' ? vide : habite;

  return (
    <SAV2 style={{ flex: 1, backgroundColor: C2.offWhite }} edges={['top']}>
      <V2 style={{ backgroundColor: C2.dark, padding: 14, paddingBottom: 16 }}>
        <T2 style={{ fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 2 }}>Nos offres</T2>
        <T2 style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>
          Régénération illimitée jusqu'à satisfaction
        </T2>
        <V2 style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 9, padding: 3 }}>
          {(['vide', 'habite'] as const).map((t) => (
            <TO2
              key={t}
              style={{
                flex: 1, padding: 7, borderRadius: 7, alignItems: 'center',
                backgroundColor: tab === t ? C2.gold : 'transparent',
              }}
              onPress={() => setTab(t)}
            >
              <T2 style={{ fontSize: 11, fontWeight: tab === t ? '600' : '400', color: tab === t ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                {t === 'vide' ? 'Bien vide — IA' : 'Bien habité — Expert'}
              </T2>
            </TO2>
          ))}
        </V2>
      </V2>
      <SC2 showsVerticalScrollIndicator={false}>
        <V2 style={{ padding: 16 }}>
          {tab === 'vide' && (
            <V2 style={{ backgroundColor: '#fdf8f1', borderWidth: 0.5, borderColor: '#e8d9be', borderRadius: 11, padding: 11, marginBottom: 12, flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <T2 style={{ fontSize: 14 }}>♾️</T2>
              <T2 style={{ fontSize: 9, color: '#8a6020', flex: 1, lineHeight: 14 }}>Régénération illimitée incluse dans les 2 formules. Relancez gratuitement jusqu'à satisfaction.</T2>
            </V2>
          )}
          {formulas.map((f) => (
            <V2 key={f.id} style={{
              backgroundColor: C2.white, borderRadius: 14, padding: 16,
              borderWidth: f.popular ? 1.5 : 0.5,
              borderColor: f.popular ? C2.gold : C2.border,
              marginBottom: 12, position: 'relative',
            }}>
              {f.popular && (
                <V2 style={{ position: 'absolute', top: 10, right: 10, backgroundColor: C2.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <T2 style={{ fontSize: 8, fontWeight: '600', color: '#fff' }}>
                    {tab === 'vide' ? 'Populaire' : 'Recommandé'}
                  </T2>
                </V2>
              )}
              <T2 style={{ fontSize: 14, fontWeight: '500', color: C2.dark }}>{f.name}</T2>
              <T2 style={{ fontSize: 9, color: C2.gray, marginBottom: 8 }}>
                {tab === 'vide'
                  ? `Bien vide · IA immédiate · ${(f as any).maxPhotos} photos max`
                  : `Bien habité · Expert humain · ${(f as any).deliveryTime}`}
              </T2>
              <T2 style={{ fontSize: 24, fontWeight: '500', color: C2.dark, marginBottom: 12 }}>
                {f.price.toFixed(2).replace('.', ',')}€{' '}
                <T2 style={{ fontSize: 12, color: C2.gray, fontWeight: '400' }}>/ analyse</T2>
              </T2>
              {f.features.map((feat) => (
                <T2 key={feat} style={{ fontSize: 10, color: C2.grayDark, lineHeight: 22 }}>
                  ✓ {feat}
                </T2>
              ))}
              <TO2
                style={{
                  marginTop: 12, padding: 12, borderRadius: 12, alignItems: 'center',
                  backgroundColor: f.popular ? C2.gold : 'transparent',
                  borderWidth: f.popular ? 0 : 0.5, borderColor: C2.gold,
                }}
                onPress={() => nav.navigate('Configure', { formulaId: f.id })}
              >
                <T2 style={{ fontSize: 11, fontWeight: '500', color: f.popular ? '#fff' : C2.gold }}>
                  {tab === 'habite' ? 'Commander →' : 'Commencer →'}
                </T2>
              </TO2>
            </V2>
          ))}
        </V2>
      </SC2>
    </SAV2>
  );
};


// ─────────────────────────────────────────────────────────────────────────────────
// src/screens/UploadScreen.tsx (stub — full implementation follows same pattern)
// ─────────────────────────────────────────────────────────────────────────────────
export const UploadScreen = () => {
  const nav = UN2<any>();
  // Full implementation: ImagePicker, multi-photo with angle tags, quota check, upload to Cloudinary
  // Mirrors ConfigureScreen pattern — see FreeTrialScreen for ImagePicker usage
  return (
    <SAV2 style={{ flex: 1, backgroundColor: C2.offWhite }} edges={['top']}>
      <V2 style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <T2 style={{ fontSize: 16, fontWeight: '500', color: C2.dark, marginBottom: 8 }}>
          Ajouter mes photos
        </T2>
        <T2 style={{ fontSize: 11, color: C2.gray, marginBottom: 24, textAlign: 'center' }}>
          Choisissez vos photos depuis la galerie. Chaque photo sera taguée avec le type de pièce et l'angle sélectionnés.
        </T2>
        <TO2
          style={{ backgroundColor: C2.gold, borderRadius: 13, padding: 14, width: '100%', alignItems: 'center' }}
          onPress={() => nav.navigate('Payment')}
        >
          <T2 style={{ color: '#fff', fontSize: 13, fontWeight: '500' }}>Procéder au paiement →</T2>
        </TO2>
      </V2>
    </SAV2>
  );
};

// PDFReportScreen, AboutScreen, AccountScreen — pattern identical to previous screens
export const PDFReportScreen = () => null;
export const AboutScreen = () => null;
export const AccountScreen = () => null;
