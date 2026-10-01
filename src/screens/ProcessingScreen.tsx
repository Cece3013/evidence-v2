import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, StyleSheet, Animated, Easing,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system/legacy";
import { Button } from "../components/UI";
import { COLORS } from "../constants";
import { useAppStore, Conseil } from "../store";

const TIMELINE = [
  { delay: 0,    duration: 1000, label: "Paiement confirmé",           icon: "✅" },
  { delay: 1000, duration: 2000, label: "Envoi de vos photos…",        icon: "📤" },
  { delay: 3000, duration: 2000, label: "Traitement en cours…",        icon: "⚡" },
  { delay: 5000, duration: 2000, label: "Confirmation de réception…",  icon: "📋" },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL
  || "https://poetic-youthfulness-production-fecb.up.railway.app";

export const ProcessingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderConfig, setCurrentResult } = useAppStore();
  const { orderId, paymentIntentId } = route.params || {};
  const isHabite = orderConfig?.isHabite || false;

  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showWow, setShowWow] = useState(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const wowFade = useRef(new Animated.Value(0)).current;
  const wowScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    TIMELINE.forEach((step, i) => {
      setTimeout(() => setCurrentStep(i), step.delay);
    });
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 7000,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
    processPhotos();
  }, []);

  const animateWow = () => {
    setShowWow(true);
    Animated.parallel([
      Animated.timing(wowFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(wowScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();
  };

  const processPhotos = async () => {
    try {
      const photos = orderConfig?.photos || [];
      const minDelay = new Promise(r => setTimeout(r, 8000));

      // 1. Confirmer le paiement et générer la facture
      if (paymentIntentId) {
        try {
          const confirmRes = await fetch(`${API_URL}/api/payments/confirm`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, paymentIntentId }),
          });
          if (confirmRes.ok) {
            const confirmData = await confirmRes.json();
            console.log('[Processing] Facture générée:', confirmData.invoice?.invoiceNumber);
          } else {
            console.error('[Processing] Confirmation paiement échouée');
          }
        } catch (err) {
          console.error('[Processing] Erreur confirmation:', err);
        }
      }

      // 2. Envoyer les photos au backend
      if (photos.length > 0) {
        const photosPayload = await Promise.all(
          photos.map(async (photo: any) => {
            const base64 = await FileSystem.readAsStringAsync(photo.uri, {
              encoding: 'base64' as any,
            });
            return {
              imageBase64: base64,
              roomTypeId: photo.roomTypeId || 'salon',
              roomSize: photo.roomSize || 'medium',
            };
          })
        );

        const submitRes = await fetch(`${API_URL}/api/staging/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            photos: photosPayload,
            clientName: orderConfig?.clientName || null,
            clientEmail: orderConfig?.clientEmail || null,
            clientPhone: orderConfig?.clientPhone || null,
            propertyAddress: orderConfig?.propertyAddress || null,
            propertyType: orderConfig?.propertyType || null,
            propertySize: orderConfig?.propertySize || null,
            exteriorFeatures: orderConfig?.exteriorFeatures || [],
            isHabite: orderConfig?.isHabite || false,
            orderId: orderId || `ORD-${Date.now()}`,
            formulaId: orderConfig?.formulaId,
            formulaLabel: orderConfig?.formulaLabel || orderConfig?.formulaId || '—',
          }),
        });

        if (!submitRes.ok) {
          console.error('[Processing] Envoi des photos échoué');
          setHasError(true);
        }
      }

      await minDelay;

      setCurrentResult({
        orderId: orderId || 'order-' + Date.now(),
        beforeAfterPairs: [],
        score: 0,
        scoreDetails: [],
        conseils: getDefaultConseils(),
        regenCount: 0,
      });

      animateWow();
      setTimeout(() => setDone(true), 2000);

    } catch (err: any) {
      console.error('[Processing error]', err.message);
      setHasError(true);
      animateWow();
      setTimeout(() => setDone(true), 2000);
    }
  };

  const getDefaultConseils = (): Conseil[] => [
    { priorite: "urgent", texte: "Nettoyez soigneusement chaque surface avant les visites.", impact: "L'acheteur perçoit immédiatement le soin apporté au bien." },
    { priorite: "important", texte: "Ouvrez tous les volets pour maximiser la lumière naturelle.", impact: "La lumière est le premier critère émotionnel d'un acheteur." },
    { priorite: "optionnel", texte: "Ajoutez quelques plantes vertes dans les angles.", impact: "La végétation crée une atmosphère positive sans encombrer." },
  ];

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  if (isHabite) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.habiteContainer}>
          <View style={styles.habiteIconWrap}>
            <Text style={{ fontSize: 48 }}>📋</Text>
          </View>
          <Text style={styles.habiteTitle}>Analyse en cours</Text>
          <Text style={styles.habiteSub}>Notre équipe d'experts traite votre dossier</Text>
          <View style={styles.habiteDelayCard}>
            <Text style={styles.habiteDelayIcon}>⏱️</Text>
            <View>
              <Text style={styles.habiteDelayTitle}>Délai estimé</Text>
              <Text style={styles.habiteDelayVal}>
                {orderConfig?.formulaId === "essentiel_habite" ? "48 à 72h" : "Sous 72h"}
              </Text>
            </View>
          </View>
          <View style={styles.habiteValueCard}>
            <Text style={styles.habiteValueTitle}>Rappel de votre formule</Text>
            <Text style={styles.habiteValueName}>
              {orderConfig?.formulaLabel || orderConfig?.formulaId || "—"}
            </Text>
            <Text style={styles.habiteValueDesc}>
              {orderConfig?.formulaId === "essentiel_habite"
                ? "Jusqu'à 2 pièces · Rapport PDF personnalisé"
                : "Jusqu'à 5 pièces · Rapport PDF complet"}
            </Text>
          </View>
          <View style={styles.habiteDeliveryCard}>
            <Text style={styles.habiteDeliveryTitle}>📦 Vous recevrez</Text>
            <View style={styles.habiteDeliveryRow}>
              <Text style={styles.habiteDeliveryIcon}>📱</Text>
              <Text style={styles.habiteDeliveryText}>Dans l'app : PDF consultable + téléchargement</Text>
            </View>
            <View style={styles.habiteDeliveryRow}>
              <Text style={styles.habiteDeliveryIcon}>📧</Text>
              <Text style={styles.habiteDeliveryText}>Par email : lien + pièce jointe</Text>
            </View>
          </View>
          {done && (
            <Button label="Voir dans mon espace →" onPress={() => navigation.navigate("Main")} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeVide} edges={["top"]}>
      {showWow && (
        <Animated.View style={[styles.wowOverlay, { opacity: wowFade }]}>
          <Animated.View style={[styles.wowCard, { transform: [{ scale: wowScale }] }]}>
            <Text style={styles.wowEmoji}>✨</Text>
            <Text style={styles.wowTitle}>Vos photos ont été{"\n"}bien reçues ✨</Text>
            <Text style={styles.wowSub}>Chaque visuel est contrôlé et optimisé avant livraison</Text>
            {done && (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: COLORS.gold, fontSize: 14, marginBottom: 24 }}>
                  ⏱️ Livraison sous 2h à 12h
                </Text>
                <Button
                  label="Retour à l'accueil →"
                  onPress={() => navigation.navigate('Main')}
                />
              </View>
            )}
          </Animated.View>
        </Animated.View>
      )}

      {!showWow && (
        <View style={styles.videContainer}>
          <View style={styles.videHeader}>
            <Text style={styles.videHeaderText}>Evidence Home Staging</Text>
          </View>
          <View style={styles.videContent}>
            <Text style={styles.videRobot}>🤖</Text>
            <Text style={styles.videMainText}>Création de votre projection…</Text>
            <View style={styles.stepsWrap}>
              {TIMELINE.map((step, i) => {
                const isDone = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <View key={i} style={styles.stepRow}>
                    <View style={[styles.stepIconWrap, isDone && styles.stepIconDone, isActive && styles.stepIconActive]}>
                      <Text style={{ fontSize: 12 }}>{isDone ? "✔" : isActive ? "⏳" : "○"}</Text>
                    </View>
                    <Text style={[styles.stepLabel, isDone && styles.stepLabelDone, isActive && styles.stepLabelActive]}>
                      {step.label}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.videNote}>⏱️ proposition en cours de génération…</Text>
            {hasError && (
              <Text style={styles.errorNote}>Un problème est survenu lors de l'envoi. Contactez-nous si vous ne recevez rien.</Text>
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  safeVide: { flex: 1, backgroundColor: "#f8f7f4" },
  habiteContainer: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  habiteIconWrap: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.goldLight, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  habiteTitle: { fontSize: 22, fontWeight: "700", color: COLORS.dark, marginBottom: 8 },
  habiteSub: { fontSize: 13, color: COLORS.gray, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  habiteDelayCard: { backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, padding: 16, flexDirection: "row", alignItems: "center", gap: 14, width: "100%", marginBottom: 12 },
  habiteDelayIcon: { fontSize: 28 },
  habiteDelayTitle: { fontSize: 11, color: COLORS.gray, marginBottom: 2 },
  habiteDelayVal: { fontSize: 18, fontWeight: "600", color: COLORS.gold },
  habiteValueCard: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 16, width: "100%", marginBottom: 12 },
  habiteValueTitle: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  habiteValueName: { fontSize: 16, fontWeight: "600", color: COLORS.gold, marginBottom: 4 },
  habiteValueDesc: { fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 16 },
  habiteDeliveryCard: { backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, padding: 16, width: "100%", marginBottom: 24 },
  habiteDeliveryTitle: { fontSize: 12, fontWeight: "600", color: COLORS.dark, marginBottom: 10 },
  habiteDeliveryRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 8 },
  habiteDeliveryIcon: { fontSize: 16 },
  habiteDeliveryText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },
  wowOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: COLORS.dark, alignItems: "center", justifyContent: "center", zIndex: 10, padding: 32 },
  wowCard: { alignItems: "center" },
  wowEmoji: { fontSize: 56, marginBottom: 20 },
  wowTitle: { fontSize: 28, fontWeight: "700", color: "#fff", textAlign: "center", lineHeight: 36, marginBottom: 12 },
  wowSub: { fontSize: 16, color: COLORS.gold, fontStyle: "italic", marginBottom: 32 },
  videContainer: { flex: 1 },
  videHeader: { backgroundColor: COLORS.dark, padding: 16, alignItems: "center" },
  videHeaderText: { fontSize: 14, fontWeight: "600", color: "#fff", letterSpacing: 1 },
  videContent: { flex: 1, padding: 24, alignItems: "center", justifyContent: "center" },
  videRobot: { fontSize: 52, marginBottom: 16 },
  videMainText: { fontSize: 16, fontWeight: "500", color: COLORS.dark, marginBottom: 28, textAlign: "center" },
  stepsWrap: { width: "100%", marginBottom: 24 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  stepIconWrap: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.beige, alignItems: "center", justifyContent: "center" },
  stepIconDone: { backgroundColor: "#c8f0c8" },
  stepIconActive: { backgroundColor: COLORS.goldLight },
  stepLabel: { fontSize: 13, color: COLORS.gray },
  stepLabelDone: { color: "#2d6a32", fontWeight: "500" },
  stepLabelActive: { color: COLORS.goldDark, fontWeight: "600" },
  progressTrack: { width: "100%", height: 4, backgroundColor: COLORS.beige, borderRadius: 2, overflow: "hidden", marginBottom: 12 },
  progressBar: { height: "100%", backgroundColor: COLORS.gold, borderRadius: 2 },
  videNote: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
  errorNote: { fontSize: 10, color: "#c0392b", textAlign: "center", marginTop: 12 },
});