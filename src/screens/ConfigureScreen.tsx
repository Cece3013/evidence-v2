// src/screens/ConfigureScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, StepIndicator, SectionLabel, InfoBanner } from '../components/UI';
import {
  COLORS, ROOM_TYPES, CHAMBRE_SUBTYPES, MULTI_VUE_ANGLES, FORMULAS,
} from '../constants';
import { useAppStore } from '../store';

const STEPS = ['Formule', 'Config.', 'Photos', 'Paiement'];

export const ConfigureScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { setOrderConfig } = useAppStore();

  const formulaId = route.params?.formulaId || 'essentiel_plus';
  const formula = Object.values(FORMULAS).find((f) => f.id === formulaId) || FORMULAS.essentielsPlus;

  const [roomTypeId, setRoomTypeId] = useState('salon');
  const [roomSubTypeId, setRoomSubTypeId] = useState<string | undefined>(undefined);
  const [selectedAngles, setSelectedAngles] = useState<string[]>(['entree']);

  const showChambreSubTypes = roomTypeId === 'chambre';
  const showMultiVue = roomTypeId === 'salon' || roomTypeId === 'chambre';

  const toggleAngle = (angleId: string) => {
    setSelectedAngles((prev) =>
      prev.includes(angleId) ? prev.filter((a) => a !== angleId) : [...prev, angleId],
    );
  };

  const handleContinue = () => {
    setOrderConfig({
      formulaId,
      formulaPrice: formula.price,
      roomType: roomTypeId,
      roomSubType: roomSubTypeId,
      decoStyle: 'neutral',
      multiVue: showMultiVue && selectedAngles.length > 1,
      selectedAngles,
      promptGenerated: '',
    });
    navigation.navigate('Upload');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Configurer ma mise en scène</Text>
        <Text style={styles.headerSub}>
          {formula.name} — {formula.price.toFixed(2).replace('.', ',')}€
        </Text>
      </View>
      <StepIndicator steps={STEPS} currentStep={1} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* ── Room Types ── */}
          <SectionLabel text="Type de pièce" />
          <Text style={styles.sectionHint}>
            Sélectionnez le type de pièce que vous souhaitez valoriser.
          </Text>
          <View style={styles.roomGrid}>
            {ROOM_TYPES.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={[styles.roomCard, roomTypeId === room.id && styles.roomCardActive]}
                onPress={() => {
                  setRoomTypeId(room.id);
                  setRoomSubTypeId(undefined);
                  setSelectedAngles(['entree']);
                }}
              >
                <Text style={styles.roomIcon}>{room.icon}</Text>
                <Text style={[styles.roomLabel, roomTypeId === room.id && styles.roomLabelActive]}>
                  {room.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Chambre SubTypes ── */}
          {showChambreSubTypes && (
            <View style={styles.subPanel}>
              <Text style={styles.subPanelTitle}>Préciser le type de chambre</Text>
              <View style={styles.subGrid}>
                {CHAMBRE_SUBTYPES.map((sub) => (
                  <TouchableOpacity
                    key={sub.id}
                    style={[styles.subCard, roomSubTypeId === sub.id && styles.subCardActive]}
                    onPress={() => setRoomSubTypeId(sub.id)}
                  >
                    <Text style={styles.roomIcon}>{sub.icon}</Text>
                    <Text style={[styles.subLabel, roomSubTypeId === sub.id && styles.subLabelActive]}>
                      {sub.label}
                    </Text>
                    <Text style={styles.subAge}>{sub.ageRange}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* ── Multi-vue ── */}
          {showMultiVue && (
            <View style={styles.multiVueCard}>
              <View style={styles.multiVueHeader}>
                <Text style={styles.multiVueTitle}>Angles de vue</Text>
                <View style={styles.multiVueBadge}>
                  <Text style={styles.multiVueBadgeText}>Optionnel</Text>
                </View>
              </View>
              <Text style={styles.multiVueSub}>
                Vous pouvez photographier la même pièce sous plusieurs angles. Chaque angle nécessite une photo distincte prise depuis cet angle.
              </Text>
              <View style={styles.angleGrid}>
                {MULTI_VUE_ANGLES.map((angle) => {
                  const isSelected = selectedAngles.includes(angle.id);
                  return (
                    <TouchableOpacity
                      key={angle.id}
                      style={[styles.angleCard, isSelected && styles.angleCardActive]}
                      onPress={() => toggleAngle(angle.id)}
                    >
                      <Text style={styles.angleIcon}>{angle.icon}</Text>
                      {isSelected && (
                        <View style={styles.angleCheck}>
                          <Text style={{ fontSize: 7, color: '#fff', fontWeight: '700' }}>✓</Text>
                        </View>
                      )}
                      <Text style={[styles.angleLabel, isSelected && styles.angleLabelActive]}>
                        {angle.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Info home staging ── */}
          <InfoBanner
            icon="✨"
            text="Notre IA applique les règles professionnelles du home staging : mobilier neutre, palette claire, décoration épurée adaptée au plus grand nombre d'acheteurs."
            variant="info"
          />

          <InfoBanner
            icon="⚠️"
            text="L'IA ne modifie jamais la structure du bien : murs, fenêtres, portes, radiateurs et sols sont strictement préservés."
            variant="warning"
          />

          <Button label="Continuer — Ajouter mes photos →" onPress={handleContinue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  content: { padding: 16 },
  sectionHint: { fontSize: 10, color: COLORS.gray, marginBottom: 10, marginTop: -8 },

  roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  roomCard: {
    width: '30.5%', borderRadius: 11, padding: 9,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center',
  },
  roomCardActive: { borderColor: COLORS.gold, backgroundColor: '#fdf8f1' },
  roomIcon: { fontSize: 18, marginBottom: 3 },
  roomLabel: { fontSize: 8, color: COLORS.grayDark, textAlign: 'center' },
  roomLabelActive: { color: COLORS.goldDark, fontWeight: '600' },

  subPanel: {
    backgroundColor: '#fdf8f1', borderWidth: 1, borderColor: '#e8d9be',
    borderRadius: 12, padding: 11, marginBottom: 12,
  },
  subPanelTitle: { fontSize: 9, fontWeight: '600', color: COLORS.goldDark, marginBottom: 8 },
  subGrid: { flexDirection: 'row', gap: 6 },
  subCard: {
    flex: 1, borderRadius: 10, padding: 9, borderWidth: 1.5,
    borderColor: '#e8d9be', backgroundColor: COLORS.white, alignItems: 'center',
  },
  subCardActive: { borderColor: COLORS.gold, backgroundColor: '#fff8ed' },
  subLabel: { fontSize: 8, color: COLORS.gray, textAlign: 'center' },
  subLabelActive: { color: COLORS.goldDark, fontWeight: '600' },
  subAge: { fontSize: 7, color: '#b8892e', marginTop: 2 },

  multiVueCard: {
    backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 0.5,
    borderColor: COLORS.border, padding: 13, marginBottom: 14,
  },
  multiVueHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  multiVueTitle: { fontSize: 11, fontWeight: '500', color: COLORS.dark },
  multiVueBadge: { backgroundColor: COLORS.goldLight, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  multiVueBadgeText: { fontSize: 8, color: COLORS.goldDark, fontWeight: '500' },
  multiVueSub: { fontSize: 9, color: COLORS.gray, marginBottom: 10, lineHeight: 13 },
  angleGrid: { flexDirection: 'row', gap: 7 },
  angleCard: {
    flex: 1, height: 62, borderRadius: 9, backgroundColor: COLORS.offWhite,
    borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center',
    justifyContent: 'center', position: 'relative',
  },
  angleCardActive: { borderColor: COLORS.gold, backgroundColor: '#fdf8f1' },
  angleIcon: { fontSize: 15, marginBottom: 4 },
  angleCheck: {
    position: 'absolute', top: 3, right: 3, width: 14, height: 14,
    backgroundColor: COLORS.gold, borderRadius: 7, alignItems: 'center', justifyContent: 'center',
  },
  angleLabel: { fontSize: 8, color: COLORS.gray, textAlign: 'center' },
  angleLabelActive: { color: COLORS.goldDark, fontWeight: '500' },
});