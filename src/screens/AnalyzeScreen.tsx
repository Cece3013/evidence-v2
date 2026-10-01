import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SITE_URL } from "../constants";

export const AnalyzeScreen = () => {
  const navigation = useNavigation<any>();

  // Alignement V1 (01/10/2026) : la commande se fait sur le parcours validé du
  // site, affiché dans l'application (contrôle photo, choix cuisine / salle de
  // bain, paiement sécurisé Stripe, suivi).
  const handleSituationSelect = (type: "vide" | "habite" | "pro") => {
    if (type === "pro") {
      navigation.navigate("ProOffers");
      return;
    }
    navigation.navigate("Site", { url: `${SITE_URL}/commande?type=${type}` });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Hero */}
        <View style={styles.hero}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <Text style={styles.heroTitle}>Expertise réelle.{"\n"}Résultats concrets.</Text>
            <Image source={require("../../assets/logo.png")} style={{ width: 100, height: 70 }} resizeMode="contain" />
          </View>
          <Text style={styles.heroSub}>
            Résultat sous 2 à 12h ou sous 72h suivant la formule.
          </Text>
        </View>

        <View style={styles.content}>

          {/* Votre situation */}
          <Text style={styles.sectionLabel}>VOTRE SITUATION</Text>

          <TouchableOpacity
            style={[styles.situationCard, styles.situationDark]}
            onPress={() => handleSituationSelect("vide")}
          >
            <Text style={styles.situationEmoji}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.situationTitle}>Particulier - Bien vide</Text>

              <Text style={styles.situationSub}>Projection · Résultat sous 2-12h</Text>
            </View>
            <Text style={styles.situationArrow}>→</Text>
          </TouchableOpacity>

         <TouchableOpacity
  style={[styles.situationCard, styles.situationDark]}
  onPress={() => handleSituationSelect("habite")}
>
  <Text style={styles.situationEmoji}>🛋️</Text>
  <View style={{ flex: 1 }}>
    <Text style={styles.situationTitle}>Particulier - Bien habité</Text>
<Text style={styles.situationSub}>Expertise humaine · Résultat sous 48-72h</Text>
  </View>
  <Text style={[styles.situationArrow, { color: COLORS.gold }]}>→</Text>
</TouchableOpacity>
          <TouchableOpacity
            style={[styles.situationCard, styles.situationPro]}
            onPress={() => handleSituationSelect("pro")}
          >
            <Text style={styles.situationEmoji}>👔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.situationTitlePro}>Professionnel</Text>
              <Text style={styles.situationSubPro}>Offres PRO · Abonnements mensuels</Text>
            </View>
            <Text style={[styles.situationArrow, { color: COLORS.gold }]}>→</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  hero: { backgroundColor: COLORS.dark, padding: 18, paddingBottom: 22 },
  heroTitle: { fontSize: 24, fontWeight: "500", color: "#fff", lineHeight: 32, marginBottom: 6 },
  heroSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 17 },
  content: { padding: 16 },

  sectionLabel: {
    fontSize: 9, fontWeight: "600", color: COLORS.gray,
    letterSpacing: 0.7, textTransform: "uppercase",
    marginBottom: 14, marginTop: 6,
  },

  situationCard: {
    borderRadius: 14, padding: 18, marginBottom: 12,
    flexDirection: "row", alignItems: "center", gap: 14,
  },
  situationDark: { backgroundColor: COLORS.dark },
  situationLight: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  situationPro: { backgroundColor: COLORS.goldLight, borderWidth: 0.5, borderColor: COLORS.goldMid },
  situationEmoji: { fontSize: 28 },
  situationTitle: { fontSize: 15, fontWeight: "600", color: "#fff", marginBottom: 2 },
  situationTitlePro: { fontSize: 15, fontWeight: "600", color: COLORS.goldDark, marginBottom: 2 },
  situationSub: { fontSize: 10, color: "rgba(255,255,255,0.6)" },
  situationSubPro: { fontSize: 10, color: COLORS.goldDark },
  situationArrow: { fontSize: 18, color: "#fff" },

  modalOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.white, borderRadius: 20,
    padding: 20, margin: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.dark, marginBottom: 4 },
  modalSub: { fontSize: 11, color: COLORS.gray, marginBottom: 16 },

  formulaCard: {
    backgroundColor: COLORS.offWhite, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10, position: "relative",
  },
  formulaCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  formulaBadge: { position: "absolute", top: 8, right: 8, backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  formulaBadgeText: { fontSize: 8, fontWeight: "600", color: "#fff" },
  formulaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  formulaName: { fontSize: 14, fontWeight: "600", color: COLORS.dark },
  formulaPrice: { fontSize: 18, fontWeight: "500", color: COLORS.gold },
  formulaDesc: { fontSize: 10, color: COLORS.gray },

  modalCancel: { alignItems: "center", padding: 14 },
  modalCancelText: { fontSize: 12, color: COLORS.gray },
});
