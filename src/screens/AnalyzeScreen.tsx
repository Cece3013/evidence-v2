import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../components/Icon";
import { COLORS } from "../constants";
import { useAppStore } from "../store";

const SITUATIONS = [
  {
    id: "vide" as const,
    icon: "Home",
    title: "Particulier — Bien vide",
    sub: "Projection · Résultat sous 2 à 12h",
  },
  {
    id: "habite" as const,
    icon: "Sofa",
    title: "Particulier — Bien habité",
    sub: "Expertise humaine · Résultat sous 48 à 72h",
  },
  {
    id: "pro" as const,
    icon: "Building2",
    title: "Professionnel",
    sub: "Offres PRO · Abonnements mensuels",
  },
];

export const AnalyzeScreen = () => {
  const navigation = useNavigation<any>();
  const { setOrderConfig } = useAppStore();

  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [situationType, setSituationType] = useState<"vide" | "habite" | null>(null);

  const FORMULAS_VIDE = [
    { id: "decouverte", name: "Découverte", price: "39€", priceNum: 39, maxPhotos: 2, desc: "2 photos · Avant/Après" },
    { id: "essentielle", name: "Essentielle", price: "89€", priceNum: 89, maxPhotos: 5, desc: "5 photos · Avant/Après" },
    { id: "performance", name: "Performance", price: "139€", priceNum: 139, maxPhotos: 8, popular: true, desc: "8 photos · Max impact annonce" },
  ];

  const FORMULAS_HABITE = [
    { id: "essentiel_habite", name: "Essentiel", price: "79€", priceNum: 79, maxPhotos: 2, desc: "Jusqu'à 2 pièces · 48 à 72h" },
    { id: "premium_habite", name: "Premium", price: "159€", priceNum: 159, maxPhotos: 5, popular: true, desc: "Jusqu'à 5 pièces · sous 72h" },
  ];

  const handleSituationSelect = (type: "vide" | "habite" | "pro") => {
    if (type === "pro") {
      navigation.navigate("ProOffers");
      return;
    }
    setSituationType(type);
    setShowFormulaModal(true);
  };

  const handleFormulaSelect = (
    formulaId: string, priceNum: number, maxPhotos: number,
    formulaName: string, formulaPrice: string
  ) => {
    setOrderConfig({
      formulaId,
      formulaPrice: priceNum,
      formulaLabel: `${formulaName} — ${formulaPrice}`,
      isHabite: situationType === "habite",
    });
    setShowFormulaModal(false);
    navigation.navigate("Upload");
  };

  const formulas = situationType === "vide" ? FORMULAS_VIDE : FORMULAS_HABITE;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={styles.hero}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.heroTitle}>Expertise réelle.{"\n"}Résultats concrets.</Text>
                        <Image source={require("../../assets/logo.png")} style={{ width: 116, height: 72 }} resizeMode="contain" />
          </View>
          <Text style={styles.heroSub}>
            Résultat sous 2 à 12h ou sous 72h selon la formule choisie.
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionLabel}>Votre situation</Text>

          {SITUATIONS.map((s) => {
            const isPro = s.id === "pro";
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.situationCard, isPro && styles.situationCardPro]}
                onPress={() => handleSituationSelect(s.id)}
                activeOpacity={0.7}
              >
                               <View style={[styles.situationIconWrap, isPro && styles.situationIconWrapPro]}>
                  <Icon name={s.icon} size={22} color={isPro ? COLORS.gold : COLORS.goldDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.situationTitle, isPro && { color: "#fff" }]}>{s.title}</Text>
                  <Text style={[styles.situationSub, isPro && { color: "rgba(255,255,255,0.6)" }]}>{s.sub}</Text>
                </View>
                <Icon name="ArrowRight" size={19} color={COLORS.gold} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sélection de formule */}
      {showFormulaModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {situationType === "vide" ? "Bien vide" : "Bien habité"}
            </Text>
            <Text style={styles.modalSub}>
              {situationType === "vide"
                ? "Projection virtuelle · Résultat sous 2 à 12h"
                : "Expertise humaine · Résultat sous 48 à 72h"}
            </Text>

            {formulas.map((f: any) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.formulaCard, f.popular && styles.formulaCardFeatured]}
                onPress={() => handleFormulaSelect(f.id, f.priceNum, f.maxPhotos, f.name, f.price)}
                activeOpacity={0.75}
              >
                <View style={styles.formulaRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.formulaNameRow}>
                      <Text style={styles.formulaName}>{f.name}</Text>
                      {f.popular && (
                        <View style={styles.formulaBadge}>
                          <Text style={styles.formulaBadgeText}>Populaire</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.formulaDesc}>{f.desc}</Text>
                  </View>
                  <Text style={styles.formulaPrice}>{f.price}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowFormulaModal(false)}>
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
   hero: {
    backgroundColor: COLORS.offWhite, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 24,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  heroTitle: { fontSize: 24, fontWeight: "600", color: COLORS.dark, lineHeight: 33, flex: 1 },
  heroSub: { fontSize: 12.5, color: COLORS.gray, lineHeight: 19, marginTop: 10 },
  content: { padding: 16 },

  sectionLabel: {
    fontSize: 11, fontWeight: "600", color: COLORS.gray,
    letterSpacing: 1, textTransform: "uppercase",
    marginBottom: 16, marginTop: 6,
  },

  situationCard: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 18, marginBottom: 12,
    flexDirection: "row", alignItems: "center", gap: 15,
    borderWidth: 1, borderColor: COLORS.border,
  },
    situationCardPro: { backgroundColor: COLORS.khaki, borderColor: COLORS.khaki },
  situationIconWrap: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.goldLight,
    alignItems: "center", justifyContent: "center",
  },
    situationIconWrapPro: { backgroundColor: "rgba(255,255,255,0.12)" },
  situationTitle: { fontSize: 15, fontWeight: "600", color: COLORS.dark, marginBottom: 4 },
  situationSub: { fontSize: 11.5, color: COLORS.gray, lineHeight: 16 },

  modalOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.beige,
    alignSelf: "center", marginBottom: 18,
  },
  modalTitle: { fontSize: 19, fontWeight: "700", color: COLORS.dark, marginBottom: 5 },
  modalSub: { fontSize: 12, color: COLORS.gray, marginBottom: 20 },

  formulaCard: {
    backgroundColor: COLORS.offWhite, borderRadius: 15,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 16, marginBottom: 10,
  },
  formulaCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  formulaRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  formulaNameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  formulaName: { fontSize: 15, fontWeight: "600", color: COLORS.dark },
  formulaBadge: { backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  formulaBadgeText: { fontSize: 9, fontWeight: "700", color: "#fff" },
  formulaDesc: { fontSize: 11.5, color: COLORS.gray, lineHeight: 16 },
  formulaPrice: { fontSize: 22, fontWeight: "600", color: COLORS.goldDark },

  modalCancel: { alignItems: "center", paddingVertical: 14, marginTop: 4 },
  modalCancelText: { fontSize: 13, color: COLORS.gray },
});