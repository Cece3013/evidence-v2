import React, { useState, useRef, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Dimensions, Image, Animated, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, SectionLabel, CriteriaBar } from "../components/UI";
import { COLORS } from "../constants";
import { useAppStore } from "../store";

const { width } = Dimensions.get("window");

const PRIORITE_CONFIG = {
  urgent:    { emoji: "⚡", label: "Urgent",    bg: "#fff5f5", border: "#fcc",     color: "#c0392b" },
  important: { emoji: "📌", label: "Important", bg: "#fffbf0", border: "#f0d9b5", color: "#b8892e" },
  optionnel: { emoji: "💡", label: "Conseil",   bg: "#f0faf0", border: "#c0e0c0", color: "#2d6a32" },
};

export const ResultScreen = () => {
  const navigation = useNavigation<any>();
  const { currentResult, orderConfig } = useAppStore();

  const isHabite =
    orderConfig?.formulaId === "premium" ||
    orderConfig?.formulaId === "premium_plus";

  const [activeProposal, setActiveProposal] = useState(0);
  const [activeView, setActiveView] = useState<"before" | "after">("before");
  const [activeAngle, setActiveAngle] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  const pairs = currentResult?.beforeAfterPairs || [
    { angle: "salon", beforeUri: null, afterUri: null, afterUri2: null },
  ];

  const conseils = (currentResult as any)?.conseils || [
    { priorite: "urgent", texte: "Nettoyez soigneusement chaque surface avant les visites.", impact: "L'acheteur perçoit immédiatement le soin apporté au bien." },
    { priorite: "important", texte: "Ouvrez tous les volets pour maximiser la lumière naturelle.", impact: "La lumière est le premier critère émotionnel d'un acheteur." },
    { priorite: "optionnel", texte: "Dégagez les surfaces pour que l'acheteur visualise l'espace.", impact: "Un espace épuré paraît plus grand et plus valorisant." },
  ];

  const score = currentResult?.score ?? 73;
  const scoreDetails = currentResult?.scoreDetails ?? [
    { label: "Luminosité", value: 85 },
    { label: "Agencement", value: 70 },
    { label: "Neutralité déco", value: 68 },
    { label: "État général", value: 72 },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
    if (!isHabite) {
      setTimeout(() => setActiveView("after"), 1500);
    }
  }, []);

  // Récupère l'image selon la proposition active
  const getActiveImage = () => {
    const pair = pairs[activeAngle];
    if (activeView === "before") return pair?.beforeUri || null;
    if (activeProposal === 0) return pair?.afterUri || null;
    return pair?.afterUri2 || pair?.afterUri || null;
  };

  // ── BIEN HABITÉ ─────────────────────────────────────────
  if (isHabite) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.scoreHero}>
            <Text style={styles.scoreHeroTitle}>Score{"\n"}d'attractivité</Text>
            <View style={styles.scoreRingWrap}>
              <View style={styles.scoreRingOuter}>
                <View style={styles.scoreRingInner}>
                  <Text style={styles.scoreNum}>{(score / 10).toFixed(1)}</Text>
                  <Text style={styles.scoreDenom}>/10</Text>
                </View>
              </View>
              <Text style={styles.scorePotentiel}>
                Potentiel : {score >= 80 ? "Excellent" : score >= 65 ? "Élevé" : score >= 50 ? "Moyen" : "À améliorer"}
              </Text>
            </View>
          </View>
          <View style={styles.content}>
            <SectionLabel text="Analyse détaillée" />
            {scoreDetails.map((d: any) => (
              <CriteriaBar key={d.label} label={d.label} value={d.value} />
            ))}
            <Button
              label="Transmettre ma photo →"
              onPress={() => Alert.alert("Transmission", "Vos photos sont transmises à notre équipe. Vous recevrez votre rapport sous 24-72h.", [{ text: "OK" }])}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── BIEN VIDE ────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.videHeader}>
          <Text style={styles.videHeaderTitle}>Votre projection visuelle</Text>
          <Text style={styles.videHeaderSub}>
            {orderConfig?.roomType || "Salon"} · {pairs.length} photo(s)
          </Text>
        </View>

        {/* Sélecteur angles multi-vue — seulement si plusieurs photos */}
        {pairs.length > 1 && (
          <View style={styles.angleSelector}>
            {pairs.map((pair: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={[styles.angleBtn, activeAngle === i && styles.angleBtnActive]}
                onPress={() => { setActiveAngle(i); setActiveView("after"); }}
              >
                <Text style={[styles.angleBtnText, activeAngle === i && styles.angleBtnTextActive]}>
                  Photo {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 2 propositions d'aménagement */}
        <View style={styles.proposalSelector}>
          {[0, 1].map((i) => (
            <TouchableOpacity
              key={i}
              style={[styles.proposalBtn, activeProposal === i && styles.proposalBtnActive]}
              onPress={() => { setActiveProposal(i); setActiveView("after"); }}
            >
              <Text style={[styles.proposalBtnText, activeProposal === i && styles.proposalBtnTextActive]}>
                Proposition {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Image principale */}
        <Animated.View style={[styles.mainVisual, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

          {/* Toggle avant/après */}
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.viewToggleBtn, activeView === "before" && styles.viewToggleBtnActive]}
              onPress={() => setActiveView("before")}
            >
              <Text style={[styles.viewToggleText, activeView === "before" && styles.viewToggleTextActive]}>
                Avant
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.viewToggleBtn, activeView === "after" && styles.viewToggleBtnActive]}
              onPress={() => setActiveView("after")}
            >
              <Text style={[styles.viewToggleText, activeView === "after" && styles.viewToggleTextActive]}>
                Projection
              </Text>
            </TouchableOpacity>
          </View>

          {/* Image */}
          <View style={styles.imageContainer}>
            {getActiveImage() ? (
              <Image
                source={{ uri: getActiveImage()! }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={{ fontSize: 48, marginBottom: 8 }}>
                  {activeView === "after" ? "🛋️" : "🏠"}
                </Text>
                <Text style={styles.placeholderLabel}>
                  {activeView === "after" ? "Projection home staging" : "Photo originale"}
                </Text>
              </View>
            )}

            {/* Badge */}
            <View style={[styles.imageBadge, activeView === "after" ? styles.imageBadgeAfter : styles.imageBadgeBefore]}>
              <Text style={styles.imageBadgeText}>
                {activeView === "after" ? `✨ Proposition ${activeProposal + 1}` : "📷 Avant"}
              </Text>
            </View>

            {activeView === "after" && (
              <View style={styles.attractifBadge}>
                <Text style={styles.attractifText}>+ attractif pour les acheteurs</Text>
              </View>
            )}
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Téléchargement", "Image sauvegardée dans votre galerie.")}>
              <Text style={styles.actionBtnIcon}>💾</Text>
              <Text style={styles.actionBtnText}>Sauvegarder{"\n"}l'image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGold]} onPress={() => navigation.navigate("PDF")}>
              <Text style={styles.actionBtnIcon}>📄</Text>
              <Text style={[styles.actionBtnText, { color: "#fff" }]}>Rapport{"\n"}PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
              <Text style={styles.actionBtnIcon}>📤</Text>
              <Text style={styles.actionBtnText}>Partager{"\n"}l'image</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.content}>
          {/* Conseils de visite */}
          <SectionLabel text="💡 Conseils pour vos visites" />
          <View style={styles.conseilsIntro}>
            <Text style={styles.conseilsIntroText}>
              Préparez vos visites physiques pour maximiser l'impact de vos projections visuelles.
            </Text>
          </View>
          {conseils.slice(0, 3).map((conseil: any, i: number) => {
            const config = PRIORITE_CONFIG[conseil.priorite as keyof typeof PRIORITE_CONFIG] ?? PRIORITE_CONFIG.optionnel;
            return (
              <View key={i} style={[styles.conseilCard, { backgroundColor: config.bg, borderColor: config.border }]}>
                <View style={styles.conseilHeader}>
                  <Text style={styles.conseilEmoji}>{config.emoji}</Text>
                  <View style={[styles.conseilBadge, { backgroundColor: config.border }]}>
                    <Text style={[styles.conseilBadgeText, { color: config.color }]}>{config.label}</Text>
                  </View>
                </View>
                <Text style={styles.conseilTexte}>{conseil.texte}</Text>
                <Text style={styles.conseilImpact}>→ {conseil.impact}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  scoreHero: { backgroundColor: COLORS.dark, padding: 32, alignItems: "center" },
  scoreHeroTitle: { fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "center", marginBottom: 20, lineHeight: 28 },
  scoreRingWrap: { alignItems: "center", marginBottom: 12 },
  scoreRingOuter: { width: 130, height: 130, borderRadius: 65, borderWidth: 6, borderColor: COLORS.gold, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  scoreRingInner: { alignItems: "center" },
  scoreNum: { fontSize: 42, fontWeight: "700", color: COLORS.dark, lineHeight: 48 },
  scoreDenom: { fontSize: 16, color: COLORS.gray },
  scorePotentiel: { fontSize: 14, fontWeight: "600", color: COLORS.gold },
  videHeader: { backgroundColor: COLORS.dark, padding: 16, paddingBottom: 14 },
  videHeaderTitle: { fontSize: 18, fontWeight: "600", color: "#fff", marginBottom: 3 },
  videHeaderSub: { fontSize: 10, color: "rgba(255,255,255,0.4)" },
  angleSelector: { backgroundColor: COLORS.dark, flexDirection: "row", paddingHorizontal: 16, paddingBottom: 14, gap: 8 },
  angleBtn: { flex: 1, paddingVertical: 7, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center" },
  angleBtnActive: { backgroundColor: COLORS.gold },
  angleBtnText: { fontSize: 9, color: "rgba(255,255,255,0.5)" },
  angleBtnTextActive: { color: "#fff", fontWeight: "500" },
  proposalSelector: { backgroundColor: COLORS.dark, flexDirection: "row", paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  proposalBtn: { flex: 1, paddingVertical: 9, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", borderWidth: 0.5, borderColor: "rgba(255,255,255,0.1)" },
  proposalBtnActive: { backgroundColor: "rgba(200,169,110,0.2)", borderColor: COLORS.gold },
  proposalBtnText: { fontSize: 11, color: "rgba(255,255,255,0.4)" },
  proposalBtnTextActive: { color: COLORS.gold, fontWeight: "600" },
  mainVisual: { backgroundColor: COLORS.dark, paddingBottom: 16 },
  viewToggle: { flexDirection: "row", marginHorizontal: 16, marginBottom: 12, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 10, padding: 3 },
  viewToggleBtn: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 8 },
  viewToggleBtnActive: { backgroundColor: COLORS.gold },
  viewToggleText: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  viewToggleTextActive: { color: "#fff", fontWeight: "500" },
  imageContainer: { marginHorizontal: 16, borderRadius: 14, overflow: "hidden", height: 240, position: "relative", marginBottom: 14 },
  mainImage: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, backgroundColor: "#2a2a2a", alignItems: "center", justifyContent: "center" },
  placeholderLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  imageBadge: { position: "absolute", bottom: 10, right: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  imageBadgeAfter: { backgroundColor: COLORS.gold },
  imageBadgeBefore: { backgroundColor: "rgba(0,0,0,0.5)" },
  imageBadgeText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  attractifBadge: { position: "absolute", top: 10, left: 10, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: COLORS.gold },
  attractifText: { fontSize: 9, color: COLORS.gold, fontStyle: "italic" },
  actionRow: { flexDirection: "row", marginHorizontal: 16, gap: 8 },
  actionBtn: { flex: 1, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 10, alignItems: "center", gap: 4 },
  actionBtnGold: { backgroundColor: COLORS.gold },
  actionBtnIcon: { fontSize: 18 },
  actionBtnText: { fontSize: 9, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 13 },
  content: { padding: 16 },
  conseilsIntro: { backgroundColor: COLORS.goldLight, borderRadius: 10, padding: 11, marginBottom: 10, borderWidth: 0.5, borderColor: COLORS.goldMid },
  conseilsIntroText: { fontSize: 10, color: COLORS.goldDark, lineHeight: 15 },
  conseilCard: { borderRadius: 12, borderWidth: 0.5, padding: 13, marginBottom: 8 },
  conseilHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 7 },
  conseilEmoji: { fontSize: 16 },
  conseilBadge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  conseilBadgeText: { fontSize: 9, fontWeight: "600" },
  conseilTexte: { fontSize: 11, color: COLORS.dark, lineHeight: 17, marginBottom: 6 },
  conseilImpact: { fontSize: 10, color: COLORS.gray, lineHeight: 15, fontStyle: "italic" },
});