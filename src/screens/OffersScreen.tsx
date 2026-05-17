import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const OFFERS_VIDE = [
  {
    id: "decouverte",
    name: "Découverte",
    price: "39€",
    priceNum: 39,
    unit: "/analyse",
    popular: false,
    features: [
      "2 photos maximum",
      "Avant / Après IA réaliste",
      "3 conseils actionnables",
      "Multi-vue (Salon & Chambre)",
      "Téléchargement illimité HD",
      "Visuels contrôlés et optimisés",
      "Résultat sous 2-12h",
      "Facture automatique",
    ],
  },
  {
    id: "essentielle",
    name: "Essentielle",
    price: "89€",
    priceNum: 89,
    unit: "/analyse",
    popular: false,
    features: [
      "5 photos maximum",
      "Avant / Après IA réaliste",
      "3 conseils actionnables",
      "Multi-vue (Salon & Chambre)",
      "Téléchargement illimité HD",
      "Visuels contrôlés et optimisés",
      "Résultat sous 2-12h",
      "Facture automatique",
    ],
  },
  {
    id: "performance",
    name: "Performance",
    price: "139€",
    priceNum: 139,
    unit: "/analyse",
    popular: true,
    features: [
      "Jusqu'à 8 photos maximum",
      "Avant / Après IA réaliste",
      "3 conseils actionnables",
      "Multi-vue (Salon & Chambre)",
      "Téléchargement illimité HD",
      "Visuels contrôlés et optimisés",
      "Résultat sous 2-12h",
      "Max impact annonce",
      "Facture automatique",
    ],
  },
];

const OFFERS_HABITE = [
  {
    id: "essentiel_habite",
    name: "Essentiel",
    price: "79€",
    priceNum: 79,
    unit: "/analyse",
    popular: false,
    subLabel: "Bien habité · Expertise humaine · 48-72h",
    features: [
      "Analyse jusqu'à 2 pièces",
      "Rapport PDF personnalisé",
      "Conseils pièce par pièce",
      "Projection directe sur vos photos",
      "Optimisation vente rapide",
      "Facture automatique",
      "Résultat sous 48-72h",
    ],
  },
  {
    id: "premium_habite",
    name: "Premium",
    price: "159€",
    priceNum: 159,
    unit: "/analyse",
    popular: true,
    subLabel: "Bien habité · Expertise humaine · 72h",
    features: [
      "Analyse jusqu'à 5 pièces",
      "Rapport PDF personnalisé",
      "Conseils pièce par pièce",
      "Projection directe sur vos photos",
      "Optimisation vente rapide",
      "Facture automatique",
      "Résultat sous 72h",
    ],
  },
];

const OPTIONS_COMPLEMENTAIRES = [
  {
    id: "photo_supp",
    icon: "📸",
    name: "Photo supplémentaire",
    price: "12€",
    desc: "Besoin d'une photo en plus ?",
  },
  {
    id: "optimisation",
    icon: "✨",
    name: "Optimisation annonce",
    price: "49€",
    desc: "Rédaction + optimisation de l'ordre des photos",
  },
];

export const OffersScreen = () => {
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const [tab, setTab] = useState<"vide" | "habite">(route.params?.type || "vide");

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Nos offres</Text>
          <Image source={require("../../assets/logo.png")} style={{ width: 100, height: 60 }} resizeMode="contain" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Intro centrée */}
          <Text style={styles.introTitle}>
            Deux solutions pour valoriser chaque bien, selon sa situation.
          </Text>

          {/* Bien vide */}
          <View style={styles.situationBlock}>
            <View style={styles.situationHeader}>
              <Text style={styles.situationIcon}>🏠</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.situationTitle}>Votre bien est vide</Text>
                <Text style={styles.situationAccent}>On montre le potentiel, on projette</Text>
              </View>
            </View>
            <Text style={styles.situationText}>
              {"Aujourd'hui, la plupart des biens vides ne déclenchent pas de coup de cœur en ligne.\n\nNous permettons aux acheteurs de se projeter dès la première photo, et lors de leurs visites, grâce à des projections d'aménagement réalistes.\n\nCe qui fait la différence, c'est que nos visuels sont "}
              <Text style={styles.bold}>guidés et validés par une expertise immobilière</Text>
              {", donc crédibles et adaptés au bien.\n\nRésultat : plus de clics, plus de visites, moins de négociation."}
            </Text>
          </View>

          {/* Bien habité — encart noir */}
          <View style={styles.situationBlock}>
            <View style={styles.situationHeader}>
              <Text style={styles.situationIcon}>🛋️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.situationTitle}>Votre bien est meublé</Text>
                <Text style={styles.situationAccent}>On améliore l'existant, on optimise</Text>
              </View>
            </View>
            <Text style={styles.situationText}>
              Nous vous proposons d'optimiser votre bien habité afin de déclencher le coup de cœur.{"\n\n"}
              Grâce à une analyse experte en home staging, nous adaptons des recommandations concrètes et illustrées à votre intérieur et votre marché.
            </Text>
          </View>

          {/* Offres PRO — Lien vers page dédiée */}
          <TouchableOpacity
            style={styles.proLink}
            onPress={() => nav.navigate("ProOffers")}
          >
            <Text style={styles.proLinkIcon}>👔</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.proLinkTitle}>Vous êtes professionnel ?</Text>
              <Text style={styles.proLinkSub}>Découvrez nos offres PRO</Text>
            </View>
            <Text style={styles.proLinkArrow}>→</Text>
          </TouchableOpacity>

          {/* Toggle */}
          <View style={styles.toggle}>
            {(["vide", "habite"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, tab === t && styles.toggleBtnActive]}
                onPress={() => setTab(t)}
              >
                <Text style={[styles.toggleText, tab === t && styles.toggleTextActive]}>
                  {t === "vide" ? "🏠 Bien vide" : "🛋️ Bien habité"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Offres — informatif uniquement, pas de lien direct */}
          {(tab === "vide" ? OFFERS_VIDE : OFFERS_HABITE).map((offer) => (
            <View
              key={offer.id}
              style={[styles.offerCard, offer.popular && styles.offerCardFeatured]}
            >
              {offer.popular && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {tab === "vide" ? "Populaire" : "Recommandé"}
                  </Text>
                </View>
              )}
              <Text style={styles.offerName}>{offer.name}</Text>
              {tab === "habite" && (offer as any).subLabel && (
                <Text style={styles.offerSubLabel}>{(offer as any).subLabel}</Text>
              )}
              <View style={styles.priceRow}>
                <Text style={styles.offerPrice}>{offer.price}</Text>
                <Text style={styles.offerUnit}>{offer.unit}</Text>
              </View>
              {offer.features.map((feat, i) => (
                <View key={i} style={styles.featureRow}>
                  <Text style={styles.featureCheck}>✓</Text>
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Options complémentaires — seulement pour bien vide */}
          {tab === "vide" && (
            <>
              <Text style={styles.optionsTitle}>Options complémentaires</Text>
              {OPTIONS_COMPLEMENTAIRES.map((opt) => (
                <View key={opt.id} style={styles.optionCard}>
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.optionName}>{opt.name}</Text>
                    <Text style={styles.optionDesc}>{opt.desc}</Text>
                  </View>
                  <Text style={styles.optionPrice}>{opt.price}</Text>
                </View>
              ))}
            </>
          )}

        </View>
        {/* CTA Analyser */}
        <TouchableOpacity
          style={styles.ctaAnalyze}
          onPress={() => nav.navigate("Analyze")}
        >
          <Text style={styles.ctaAnalyzeText}>
            Analyser mon bien maintenant →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
  content: { padding: 16 },

  introTitle: {
    fontSize: 17, fontWeight: "700", color: COLORS.dark,
    marginBottom: 16, textAlign: "center", lineHeight: 24,
  },

  ctaAnalyze: {
    backgroundColor: COLORS.dark,
    borderRadius: 13, padding: 16,
    alignItems: "center", marginTop: 8, marginBottom: 20,
    borderWidth: 1, borderColor: COLORS.gold,
  },
  ctaAnalyzeText: {
    color: COLORS.gold, fontSize: 14, fontWeight: "600",
  },

  situationBlock: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 16, marginBottom: 12 },
  situationHeader: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  situationIcon: { fontSize: 24 },
  situationTitle: { fontSize: 14, fontWeight: "500", color: "#fff", marginBottom: 2 },
  situationAccent: { fontSize: 11, color: COLORS.gold, fontStyle: "italic" },
  situationText: { fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 18 },
  bold: { fontWeight: "700", color: "#fff" },

  proLink: {
    backgroundColor: COLORS.dark, borderRadius: 14, padding: 16,
    marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 12,
  },
  proLinkIcon: { fontSize: 24 },
  proLinkTitle: { fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 2 },
  proLinkSub: { fontSize: 10, color: COLORS.gold, fontStyle: "italic" },
  proLinkArrow: { fontSize: 18, color: COLORS.gold },

  toggle: {
    flexDirection: "row", backgroundColor: COLORS.dark,
    borderRadius: 10, padding: 3, marginBottom: 14,
  },
  toggleBtn: { flex: 1, padding: 9, borderRadius: 8, alignItems: "center" },
  toggleBtnActive: { backgroundColor: COLORS.gold },
  toggleText: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  toggleTextActive: { color: "#fff", fontWeight: "500" },

  offerCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    padding: 16, borderWidth: 0.5, borderColor: COLORS.border,
    marginBottom: 12, position: "relative",
  },
  offerCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold },
  badge: { position: "absolute", top: 10, right: 10, backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 8, fontWeight: "600", color: "#fff" },
  offerName: { fontSize: 15, fontWeight: "500", color: COLORS.dark, marginBottom: 2 },
  offerSubLabel: { fontSize: 9, color: COLORS.gray, marginBottom: 8 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 14, marginTop: 6 },
  offerPrice: { fontSize: 26, fontWeight: "500", color: COLORS.dark },
  offerUnit: { fontSize: 12, color: COLORS.gray },
  featureRow: { flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" },
  featureCheck: { fontSize: 11, color: COLORS.gold, fontWeight: "600", marginTop: 1 },
  featureText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },

  optionsTitle: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginTop: 16, marginBottom: 10 },
  optionCard: {
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  optionIcon: { fontSize: 20 },
  optionName: { fontSize: 12, fontWeight: "600", color: COLORS.goldDark, marginBottom: 2 },
  optionDesc: { fontSize: 10, color: COLORS.goldDark },
  optionPrice: { fontSize: 14, fontWeight: "700", color: COLORS.goldDark },
});