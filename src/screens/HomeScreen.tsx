// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EvidenceLogo } from '../components/EvidenceLogo';
import { BeforeAfterSlider } from '../components/UI';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const stats = [
    { value: '31%', label: 'vente rapide' },
    { value: '+8%', label: 'prix obtenu' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <EvidenceLogo size={36} textColor="#fff" subTextColor={COLORS.gold} />

          <Text style={styles.heroTitle}>Vendez votre bien{'\n'}plus vite.</Text>
          <Text style={styles.heroSub}>
            Sans travaux. Résultat immédiat ou sous 48h.
          </Text>

          <TouchableOpacity
            style={styles.freeBtn}
            onPress={() => navigation.navigate('FreeTrial')}
            activeOpacity={0.85}
          >
            <Text style={styles.freeBtnText}>
              Tester gratuitement — 1 photo sans inscription →
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* ── Before/After ── */}
          <Text style={styles.sectionLabel}>TRANSFORMATION PAR IA</Text>
          <BeforeAfterSlider height={120} />

          {/* ── Stats ── */}
          <View style={styles.statsRow}>
            {stats.map((s) => (
              <View key={s.value} style={styles.statCard}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* ── CTA Grid ── */}
          <Text style={styles.sectionLabel}>VOTRE SITUATION</Text>
          <View style={styles.ctaGrid}>
            <TouchableOpacity
              style={[styles.ctaCard, styles.ctaDark]}
              onPress={() => navigation.navigate('Offers', { type: 'vide' })}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaIcon}>🏠</Text>
              <Text style={styles.ctaTitleDark}>Bien vide</Text>
              <Text style={styles.ctaSubDark}>IA immédiate</Text>
              <Text style={styles.ctaLink}>Résultat immédiat →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ctaCard, styles.ctaLight]}
              onPress={() => navigation.navigate('Offers', { type: 'habite' })}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaIcon}>🛋️</Text>
              <Text style={styles.ctaTitleLight}>Bien habité</Text>
              <Text style={styles.ctaSubLight}>Expert humain</Text>
              <Text style={styles.ctaLink}>Rapport 48h →</Text>
            </TouchableOpacity>
          </View>

          {/* ── About link ── */}
          <TouchableOpacity
            style={styles.aboutLink}
            onPress={() => navigation.navigate('About')}
          >
            <Text style={styles.aboutLinkText}>Qui sommes-nous ? →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  scroll: { flex: 1 },
  hero: {
    backgroundColor: COLORS.dark,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
    gap: 0,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#fff',
    lineHeight: 30,
    marginTop: 14,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 17,
    marginBottom: 14,
  },
  freeBtn: {
    backgroundColor: 'rgba(200,169,110,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(200,169,110,0.5)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  freeBtnText: { color: COLORS.gold, fontSize: 11, fontWeight: '500' },

  content: { padding: 16 },

  sectionLabel: {
    fontSize: 9, fontWeight: '600', color: COLORS.gray,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8, marginTop: 4,
  },

  statsRow: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  statCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 11,
    borderWidth: 0.5, borderColor: COLORS.border, padding: 10, alignItems: 'center',
  },
  statValue: { fontSize: 15, fontWeight: '500', color: COLORS.gold },
  statLabel: { fontSize: 8, color: COLORS.gray, marginTop: 2 },

  ctaGrid: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  ctaCard: { flex: 1, borderRadius: 13, padding: 14 },
  ctaDark: { backgroundColor: COLORS.dark },
  ctaLight: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  ctaIcon: { fontSize: 20, marginBottom: 8 },
  ctaTitleDark: { fontSize: 12, fontWeight: '500', color: '#fff', marginBottom: 2 },
  ctaTitleLight: { fontSize: 12, fontWeight: '500', color: COLORS.dark, marginBottom: 2 },
  ctaSubDark: { fontSize: 9, color: 'rgba(255,255,255,0.45)', marginBottom: 6 },
  ctaSubLight: { fontSize: 9, color: COLORS.gray, marginBottom: 6 },
  ctaLink: { fontSize: 9, color: COLORS.gold },

  aboutLink: { alignItems: 'center', marginBottom: 16 },
  aboutLinkText: {
    fontSize: 11, color: COLORS.gold,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(200,169,110,0.4)', paddingBottom: 1,
  },
});
