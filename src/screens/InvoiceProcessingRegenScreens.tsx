// ─────────────────────────────────────────────────────────────────────────────────
// src/screens/InvoiceProcessingRegenScreens.tsx
// ─────────────────────────────────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, DECO_STYLES } from '../constants';

// ─── Composants UI locaux (au cas où Button/InfoBanner ne sont pas dispo) ───────
const btnStyles = StyleSheet.create({
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimary: { backgroundColor: COLORS.gold },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E2DC',
  },
  btnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  btnTextGhost: { color: '#888' },
});

const Btn = ({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      btnStyles.btn,
      variant === 'ghost' ? btnStyles.btnGhost : btnStyles.btnPrimary,
    ]}
  >
    <Text style={[btnStyles.btnText, variant === 'ghost' && btnStyles.btnTextGhost]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────────────────────────────────────────
// INVOICE SCREEN
// ─────────────────────────────────────────────────────────────────────────────────
export const InvoiceScreen = () => {
  const nav = useNavigation<any>();

  // Données de facture simulées — à remplacer par les vraies données Stripe
  const invoice = {
    number: 'EHS-2024-001',
    date: new Date().toLocaleDateString('fr-FR'),
    offer: 'Analyse complète — Bien vide',
    amount: '29,00 €',
    tva: '4,83 €',
    ht: '24,17 €',
    status: 'Payée',
    paymentMethod: 'Carte bancaire',
    client: 'Cécile Dupont',
    email: 'client@example.com',
  };

  return (
    <SafeAreaView style={inv.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête facture */}
        <View style={inv.header}>
          <View style={inv.logoRow}>
            <View style={inv.logoBadge}>
              <Text style={inv.logoText}>E</Text>
            </View>
            <View>
              <Text style={inv.brandName}>Evidence Home Staging</Text>
              <Text style={inv.brandSub}>Home staging par intelligence artificielle</Text>
            </View>
          </View>
          <View style={inv.statusBadge}>
            <Text style={inv.statusText}>✓ {invoice.status}</Text>
          </View>
        </View>

        <View style={inv.body}>
          {/* Numéro & date */}
          <View style={inv.card}>
            <Text style={inv.cardTitle}>Facture n° {invoice.number}</Text>
            <Text style={inv.cardSub}>Émise le {invoice.date}</Text>
          </View>

          {/* Détail client */}
          <View style={inv.section}>
            <Text style={inv.sectionTitle}>CLIENT</Text>
            <Text style={inv.sectionValue}>{invoice.client}</Text>
            <Text style={inv.sectionMuted}>{invoice.email}</Text>
          </View>

          {/* Détail prestation */}
          <View style={inv.section}>
            <Text style={inv.sectionTitle}>PRESTATION</Text>
            <View style={inv.lineRow}>
              <Text style={inv.lineLabel}>{invoice.offer}</Text>
              <Text style={inv.lineValue}>{invoice.ht}</Text>
            </View>
            <View style={inv.divider} />
            <View style={inv.lineRow}>
              <Text style={inv.lineLabel}>TVA (20%)</Text>
              <Text style={inv.lineValue}>{invoice.tva}</Text>
            </View>
            <View style={inv.divider} />
            <View style={[inv.lineRow, inv.totalRow]}>
              <Text style={inv.totalLabel}>TOTAL TTC</Text>
              <Text style={inv.totalValue}>{invoice.amount}</Text>
            </View>
          </View>

          {/* Mode de paiement */}
          <View style={inv.section}>
            <Text style={inv.sectionTitle}>PAIEMENT</Text>
            <View style={inv.payRow}>
              <Text style={inv.payIcon}>💳</Text>
              <Text style={inv.sectionValue}>{invoice.paymentMethod}</Text>
            </View>
          </View>

          {/* Mentions légales */}
          <View style={inv.legalBox}>
            <Text style={inv.legalText}>
              Evidence Home Staging — SIREN : XXX XXX XXX{'\n'}
              TVA intracommunautaire : FR XX XXX XXX XXX{'\n'}
              Cette facture fait foi de paiement.
            </Text>
          </View>

          {/* Actions */}
          <Btn label="Télécharger en PDF →" onPress={() => nav.navigate('PDFReport')} />
          <Btn label="Retour à l'accueil" onPress={() => nav.navigate('Main')} variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const inv = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  header: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  brandName: { fontSize: 12, fontWeight: '600', color: '#fff' },
  brandSub: { fontSize: 9, color: 'rgba(255,255,255,0.5)' },
  statusBadge: {
    backgroundColor: 'rgba(180,150,80,0.2)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: { fontSize: 10, color: COLORS.gold, fontWeight: '600' },
  body: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E2DC',
  },
  cardTitle: { fontSize: 13, fontWeight: '600', color: '#1A1A2E' },
  cardSub: { fontSize: 10, color: '#888', marginTop: 2 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#E5E2DC',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionValue: { fontSize: 12, fontWeight: '500', color: '#1A1A2E' },
  sectionMuted: { fontSize: 10, color: '#888', marginTop: 2 },
  lineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  lineLabel: { fontSize: 11, color: '#444' },
  lineValue: { fontSize: 11, color: '#1A1A2E', fontWeight: '500' },
  divider: { height: 0.5, backgroundColor: '#E5E2DC' },
  totalRow: { marginTop: 4 },
  totalLabel: { fontSize: 13, fontWeight: '700', color: '#1A1A2E' },
  totalValue: { fontSize: 15, fontWeight: '700', color: COLORS.gold },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  payIcon: { fontSize: 16 },
  legalBox: {
    backgroundColor: '#F0EDE8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  legalText: { fontSize: 9, color: '#888', lineHeight: 15 },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimary: { backgroundColor: COLORS.gold },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E2DC',
  },
  btnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  btnTextGhost: { color: '#888' },
});

// ─────────────────────────────────────────────────────────────────────────────────
// REGENERATION SCREEN
// ─────────────────────────────────────────────────────────────────────────────────
const REGEN_OPTIONS = [
  { id: 'same', label: 'Mêmes paramètres — juste régénérer' },
  { id: 'style', label: 'Changer le style de décoration' },
  { id: 'angle', label: "Changer l'angle de vue (multi-vue)" },
  { id: 'photo', label: 'Ajouter ou remplacer une photo' },
];

export const RegenerationScreen = () => {
  const nav = useNavigation<any>();
  const [selectedOption, setSelectedOption] = useState('same');
  const [selectedStyle, setSelectedStyle] = useState('scandinave');

  return (
    <SafeAreaView style={rs.safe} edges={['top']}>
      <View style={rs.header}>
        <Text style={rs.headerTitle}>Régénérer le résultat</Text>
        <Text style={rs.headerSub}>Gratuit · Illimité · Aucun frais supplémentaire</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={rs.content}>
          <View style={rs.optionCard}>
            <Text style={rs.optionCardTitle}>Que souhaitez-vous ajuster ?</Text>
            {REGEN_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={rs.optionRow}
                onPress={() => setSelectedOption(opt.id)}
              >
                <View style={[rs.radio, selectedOption === opt.id && rs.radioActive]}>
                  {selectedOption === opt.id && (
                    <Text style={{ fontSize: 8, color: '#fff', fontWeight: '700' }}>✓</Text>
                  )}
                </View>
                <Text style={rs.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {selectedOption === 'style' && (
            <>
              <Text style={rs.sectionLabel}>Changer le style (optionnel)</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 14 }}
              >
                {DECO_STYLES.slice(0, 5).map((style: any) => (
                  <TouchableOpacity
                    key={style.id}
                    style={[rs.styleCard, selectedStyle === style.id && rs.styleCardActive]}
                    onPress={() => setSelectedStyle(style.id)}
                  >
                    <View style={[rs.styleSwatch, { backgroundColor: style.swatchColor }]}>
                      <Text style={{ fontSize: 15 }}>{style.icon}</Text>
                    </View>
                    <Text style={[rs.styleName, selectedStyle === style.id && rs.styleNameActive]}>
                      {style.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={rs.infoBanner}>
            <Text style={rs.infoBannerText}>
              ♾️ Régénération 100% gratuite. Relancez autant de fois que nécessaire jusqu'à satisfaction complète.
            </Text>
          </View>

          <Btn label="Lancer la régénération →" onPress={() => nav.navigate('Processing')} />
          <Btn label="Retour au résultat actuel" onPress={() => nav.goBack()} variant="ghost" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const rs = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F4' },
  header: { backgroundColor: '#1A1A2E', padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  content: { padding: 16 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: '#E5E2DC',
    padding: 13,
    marginBottom: 14,
  },
  optionCardTitle: { fontSize: 11, fontWeight: '500', color: '#1A1A2E', marginBottom: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  radio: {
    width: 17,
    height: 17,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#E5E2DC',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  optionLabel: { fontSize: 10, color: '#1A1A2E' },
  styleCard: {
    width: 72,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#E5E2DC',
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginRight: 7,
    alignItems: 'center',
  },
  styleCardActive: { borderColor: COLORS.gold },
  styleSwatch: { height: 42, width: '100%', alignItems: 'center', justifyContent: 'center' },
  styleName: { fontSize: 8, padding: 4, color: '#666', textAlign: 'center' },
  styleNameActive: { color: COLORS.gold, fontWeight: '500' },
  infoBanner: {
    backgroundColor: 'rgba(180,150,80,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(180,150,80,0.2)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  infoBannerText: { fontSize: 10, color: '#666', lineHeight: 15 },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnPrimary: { backgroundColor: COLORS.gold },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#E5E2DC' },
  btnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  btnTextGhost: { color: '#888' },
});