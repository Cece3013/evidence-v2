// src/screens/FreeTrialScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { EvidenceLogoIcon } from '../components/EvidenceLogo';
import { Button, InfoBanner, SectionLabel } from '../components/UI';
import { COLORS, ROOM_TYPES, DECO_STYLES, FREE_TRIAL_COOLDOWN_HOURS } from '../constants';
import { useAppStore } from '../store';

export const FreeTrialScreen = () => {
  const navigation = useNavigation<any>();
  const { canUseFreeTrialToday, setFreeTrialUsed } = useAppStore();

  const [selectedRoom, setSelectedRoom] = useState('salon');
  const [selectedStyle, setSelectedStyle] = useState('scandinave');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const freeRooms = ROOM_TYPES.slice(0, 6);
  const freeStyles = DECO_STYLES.slice(0, 4);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Autorisez l\'accès à vos photos dans les paramètres.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleGenerate = async () => {
    if (!photo) {
      Alert.alert('Photo manquante', 'Veuillez sélectionner une photo.');
      return;
    }
    if (!canUseFreeTrialToday()) {
      Alert.alert(
        'Essai déjà utilisé',
        `Vous pouvez réutiliser l'essai gratuit dans ${FREE_TRIAL_COOLDOWN_HOURS}h. Découvrez nos formules payantes pour des résultats illimités.`,
        [
          { text: 'Voir les formules', onPress: () => navigation.navigate('Offers') },
          { text: 'OK' },
        ],
      );
      return;
    }
    setLoading(true);
    setFreeTrialUsed(Date.now());
    // Navigate to Processing with free trial mode
    navigation.navigate('Processing', {
      isFreeTrialMode: true,
      roomTypeId: selectedRoom,
      decoStyleId: selectedStyle,
      photoUri: photo,
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <EvidenceLogoIcon size={22} />
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Essai gratuit</Text>
          </View>
          <Text style={styles.headerMeta}>Sans inscription · Sans CB</Text>
        </View>
        <Text style={styles.headerTitle}>Testez notre IA gratuitement</Text>
        <Text style={styles.headerSub}>
          1 photo · 1 transformation · Résultat immédiat.{'\n'}Aucune carte bancaire requise.
        </Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionLabel text="Type de pièce" />
          <View style={styles.roomGrid}>
            {freeRooms.map((room) => (
              <TouchableOpacity
                key={room.id}
                style={[styles.roomCard, selectedRoom === room.id && styles.roomCardActive]}
                onPress={() => setSelectedRoom(room.id)}
              >
                <Text style={styles.roomIcon}>{room.icon}</Text>
                <Text style={[styles.roomLabel, selectedRoom === room.id && styles.roomLabelActive]}>
                  {room.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <SectionLabel text="Style de décoration" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleRow}>
            {freeStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[styles.styleCard, selectedStyle === style.id && styles.styleCardActive]}
                onPress={() => setSelectedStyle(style.id)}
              >
                <View style={[styles.styleSwatch, { backgroundColor: style.swatchColor }]}>
                  <Text style={{ fontSize: 16 }}>{style.icon}</Text>
                </View>
                <Text style={[styles.styleName, selectedStyle === style.id && styles.styleNameActive]}>
                  {style.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Upload zone */}
          <TouchableOpacity style={styles.uploadZone} onPress={pickPhoto} activeOpacity={0.8}>
            {photo ? (
              <View style={styles.photoPreview}>
                <Text style={{ fontSize: 32 }}>✅</Text>
                <Text style={styles.photoLabel}>Photo sélectionnée</Text>
                <Text style={styles.photoChange}>Appuyer pour changer</Text>
              </View>
            ) : (
              <>
                <Text style={{ fontSize: 24, marginBottom: 8 }}>📸</Text>
                <Text style={styles.uploadTitle}>Uploader votre photo</Text>
                <Text style={styles.uploadSub}>1 photo · JPG ou PNG · min. 1200px</Text>
                <View style={styles.uploadBtn}>
                  <Text style={styles.uploadBtnText}>Choisir une photo</Text>
                </View>
              </>
            )}
          </TouchableOpacity>

          <InfoBanner
            icon="ℹ️"
            text="L'essai gratuit génère 1 transformation en basse résolution avec filigrane. Pour télécharger en HD sans filigrane, choisissez une formule payante."
            variant="info"
          />

          <Button label="Lancer la transformation gratuite →" onPress={handleGenerate} loading={loading} />

          <TouchableOpacity style={styles.upsellLink} onPress={() => navigation.navigate('Offers')}>
            <Text style={styles.upsellText}>Satisfait ? Découvrir nos formules →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 16, paddingBottom: 18 },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  freeBadge: {
    backgroundColor: COLORS.dark, borderWidth: 0.5, borderColor: 'rgba(200,169,110,0.4)',
    borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2,
  },
  freeBadgeText: { fontSize: 8, fontWeight: '600', color: COLORS.gold },
  headerMeta: { fontSize: 9, color: 'rgba(255,255,255,0.4)' },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 16 },
  scroll: { flex: 1 },
  content: { padding: 16 },

  roomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 14 },
  roomCard: {
    width: '30.5%', borderRadius: 11, padding: 9,
    borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: 'center',
  },
  roomCardActive: { borderColor: COLORS.gold, backgroundColor: '#fdf8f1' },
  roomIcon: { fontSize: 18, marginBottom: 3 },
  roomLabel: { fontSize: 8, color: COLORS.grayDark, lineHeight: 12 },
  roomLabelActive: { color: COLORS.goldDark, fontWeight: '600' },

  styleRow: { marginBottom: 14 },
  styleCard: {
    width: 72, borderRadius: 11, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: COLORS.white,
    overflow: 'hidden', marginRight: 7, alignItems: 'center',
  },
  styleCardActive: { borderColor: COLORS.gold },
  styleSwatch: { height: 42, width: '100%', alignItems: 'center', justifyContent: 'center' },
  styleName: { fontSize: 8, padding: 4, color: COLORS.grayDark, textAlign: 'center' },
  styleNameActive: { color: COLORS.goldDark, fontWeight: '500' },

  uploadZone: {
    borderWidth: 1.5, borderStyle: 'dashed', borderColor: COLORS.beigeMid,
    borderRadius: 12, padding: 20, alignItems: 'center',
    backgroundColor: COLORS.white, marginBottom: 12,
  },
  photoPreview: { alignItems: 'center', gap: 6 },
  photoLabel: { fontSize: 12, fontWeight: '500', color: COLORS.dark },
  photoChange: { fontSize: 10, color: COLORS.gray },
  uploadTitle: { fontSize: 12, fontWeight: '500', color: COLORS.dark, marginBottom: 3 },
  uploadSub: { fontSize: 9, color: COLORS.gray, marginBottom: 12 },
  uploadBtn: {
    backgroundColor: COLORS.dark, borderRadius: 9, paddingVertical: 9, paddingHorizontal: 20,
  },
  uploadBtnText: { color: '#fff', fontSize: 11, fontWeight: '500' },

  upsellLink: { alignItems: 'center', marginBottom: 16, marginTop: 4 },
  upsellText: { fontSize: 10, color: COLORS.gold },
});
