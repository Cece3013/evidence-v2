import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../components/Icon";
import { COLORS } from "../constants";

const OFFERS_VIDE = [
  {
    id: "decouverte",
    name: "Découverte",
    price: "39€",
    unit: "/analyse",
    popular: false,
    tagline: "Idéale pour un premier aperçu",
    features: [
      "2 photos aménagées",
      "Avant / Après réaliste",
      "3 conseils actionnables",
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
    unit: "/analyse",
    popular: false,
    tagline: "Pour une annonce plus complète",
    features: [
      "5 photos aménagées",
      "Avant / Après réaliste",
      "3 conseils actionnables",
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
    unit: "/analyse",
    popular: true,
    tagline: "Maximise l'impact de vos annonces",
    features: [
      "8 photos aménagées",
      "Avant / Après réaliste",
      "3 conseils actionnables",
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
    unit: "/analyse",
    popular: false,
    tagline: "Expertise humaine · Livraison 48-72h",
    features: [
      "Analyse jusqu'à 2 pièces",
      "Rapport PDF personnalisé",
      "Conseils pièce par pièce",
      "Projection directe sur vos photos",
      "Optimisation vente rapide",
      "Facture automatique",
    ],
  },
  {
    id: "premium_habite",
    name: "Premium",
    price: "159€",
    unit: "/analyse",
    popular: true,
    tagline: "Expertise humaine · Livraison sous 72h",
    features: [
      "Analyse jusqu'à 5 pièces",
      "Rapport PDF personnalisé",
      "Conseils pièce par pièce",
      "Projection directe sur vos photos",
      "Optimisation vente rapide",
      "Facture automatique",
    ],
  },
];

const OPTIONS_COMPLEMENTAIRES = [
  {
    id: "photo_supp",
    icon: "ImagePlus",
    name: "Photo supplémentaire",
    price: "12€",
    desc: "Besoin d'une photo en plus ?",
  },
  {
    id: "optimisation",
    icon: "PenLine",
    name: "Optimisation annonce",
    price: "49€",
    desc: "Rédaction + optimisation de l'ordre des photos",
  },
  {
    id: "pack_vente",
    icon: "Rocket",
    name: "Pack Vente Accélérée",
    price: "69€",
    desc: "Optimisation annonce + conseils stratégiques",
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
                   <Image source={require("../../assets/logo.png")} style={{ width: 110, height: 60 }} resizeMode="contain" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          <Text style={styles.introTitle}>
            Deux solutions pour valoriser chaque bien, selon sa situation.
          </Text>

          {/* Bien vide */}
          <View style={styles.situationBlock}>
            <View style={styles.situationHeader}>
              <View style={styles.situationIconWrap}>
                <Icon name="Home" size={22} color={COLORS.goldDark} />
              </View>
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

          {/* Bien habité */}
          <View style={styles.situationBlock}>
            <View style={styles.situationHeader}>
              <View style={styles.situationIconWrap}>
                <Icon name="Sofa" size={22} color={COLORS.goldDark} />
              </View>
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

          {/* Lien PRO */}
          <TouchableOpacity style={styles.proLink} onPress={() => nav.navigate("ProOffers")}>
            <Icon name="Building2" size={22} color={COLORS.gold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.proLinkTitle}>Vous êtes professionnel ?</Text>
              <Text style={styles.proLinkSub}>Découvrez nos offres PRO</Text>
            </View>
            <Icon name="ArrowRight" size={18} color={COLORS.gold} />
          </TouchableOpacity>

          {/* Toggle */}
          <View style={styles.toggle}>
            {(["vide", "habite"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.toggleBtn, tab === t && styles.toggleBtnActive]}
                onPress={() => setTab(t)}
              >
                <Icon
                  name={t === "vide" ? "Home" : "Sofa"}
                  size={15}
                  color={tab === t ? COLORS.goldDark : COLORS.gray}
                />
                <Text style={[styles.toggleText, tab === t && styles.toggleTextActive]}>
                  {t === "vide" ? "Bien vide" : "Bien habité"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Offres */}
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
              <Text style={styles.offerTagline}>{offer.tagline}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.offerPrice}>{offer.price}</Text>
                <Text style={styles.offerUnit}>{offer.unit}</Text>
              </View>
              <View style={styles.featureDivider} />
              {offer.features.map((feat, i) => (
                <View key={i} style={styles.featureRow}>
                  <Icon name="Check" size={14} color={COLORS.gold} strokeWidth={2} />
                  <Text style={styles.featureText}>{feat}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Options complémentaires */}
          {tab === "vide" && (
            <>
              <Text style={styles.optionsTitle}>Options complémentaires</Text>
              {OPTIONS_COMPLEMENTAIRES.map((opt) => (
                <View key={opt.id} style={styles.optionCard}>
                  <View style={styles.optionIconWrap}>
                    <Icon name={opt.icon} size={19} color={COLORS.goldDark} />
                  </View>
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

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity style={styles.ctaAnalyze} onPress={() => nav.navigate("Analyze")}>
            <Text style={styles.ctaAnalyzeText}>Analyser mon bien maintenant</Text>
            <Icon name="ArrowRight" size={17} color={COLORS.gold} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: {
    backgroundColor: COLORS.offWhite, paddingHorizontal: 16, paddingVertical: 16,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 19, fontWeight: "600", color: COLORS.dark },
  content: { padding: 16 },

  introTitle: {
    fontSize: 18, fontWeight: "600", color: COLORS.dark,
    marginBottom: 20, textAlign: "center", lineHeight: 26,
  },

  situationBlock: {
    backgroundColor: COLORS.white, borderRadius: 18, padding: 18, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.goldMid,
  },
  situationHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 },
  situationIconWrap: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.goldLight,
    alignItems: "center", justifyContent: "center",
  },
  situationTitle: { fontSize: 15, fontWeight: "600", color: COLORS.dark, marginBottom: 3 },
  situationAccent: { fontSize: 12, color: COLORS.goldDark, fontStyle: "italic" },
  situationText: { fontSize: 12.5, color: COLORS.grayDark, lineHeight: 20 },
  bold: { fontWeight: "700", color: COLORS.dark },

  proLink: {
    backgroundColor: COLORS.khaki, borderRadius: 16, padding: 18,
    marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 14,
  },
  proLinkTitle: { fontSize: 14, fontWeight: "600", color: "#fff", marginBottom: 3 },
  proLinkSub: { fontSize: 11, color: COLORS.gold, fontStyle: "italic" },

  toggle: {
    flexDirection: "row", backgroundColor: COLORS.white,
    borderRadius: 12, padding: 4, marginBottom: 16,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  toggleBtn: {
    flex: 1, paddingVertical: 11, borderRadius: 9, alignItems: "center",
    flexDirection: "row", justifyContent: "center", gap: 7,
  },
  toggleBtnActive: { backgroundColor: COLORS.goldLight },
  toggleText: { fontSize: 12.5, color: COLORS.gray },
  toggleTextActive: { color: COLORS.goldDark, fontWeight: "600" },

  offerCard: {
    backgroundColor: COLORS.white, borderRadius: 18,
    padding: 18, borderWidth: 0.5, borderColor: COLORS.border,
    marginBottom: 12, position: "relative",
  },
  offerCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold },
  badge: {
    position: "absolute", top: 14, right: 14, backgroundColor: COLORS.gold,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  badgeText: { fontSize: 9, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  offerName: { fontSize: 17, fontWeight: "600", color: COLORS.dark, marginBottom: 3 },
  offerTagline: { fontSize: 11.5, color: COLORS.gray, fontStyle: "italic" },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 5, marginTop: 10, marginBottom: 14 },
  offerPrice: { fontSize: 30, fontWeight: "600", color: COLORS.dark },
  offerUnit: { fontSize: 12.5, color: COLORS.gray },
  featureDivider: { height: 0.5, backgroundColor: COLORS.border, marginBottom: 12 },
  featureRow: { flexDirection: "row", gap: 9, marginBottom: 9, alignItems: "center" },
  featureText: { fontSize: 12.5, color: COLORS.grayDark, flex: 1, lineHeight: 18 },

  optionsTitle: {
    fontSize: 14, fontWeight: "600", color: COLORS.dark,
    marginTop: 20, marginBottom: 12,
  },
  optionCard: {
    backgroundColor: COLORS.goldLight, borderRadius: 14,
    padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12,
    borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  optionIconWrap: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.white,
    alignItems: "center", justifyContent: "center",
  },
  optionName: { fontSize: 13, fontWeight: "600", color: COLORS.goldDark, marginBottom: 2 },
  optionDesc: { fontSize: 11, color: COLORS.goldDark, opacity: 0.75, lineHeight: 15 },
  optionPrice: { fontSize: 16, fontWeight: "700", color: COLORS.goldDark },

  ctaAnalyze: {
    backgroundColor: COLORS.dark,
    borderRadius: 16, paddingVertical: 17,
    alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 9,
    marginTop: 8, marginBottom: 24,
  },
  ctaAnalyzeText: { color: COLORS.gold, fontSize: 14.5, fontWeight: "600" },
});