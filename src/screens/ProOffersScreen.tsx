import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const PRO_OFFERS = [
  {
    id: "pro_starter",
    name: "PRO Starter",
    price: "49€",
    priceNum: 49,
    unit: "/mois",
    popular: false,
    target: "Indépendants · Petites structures",
    features: [
      "10 photos/mois incluses",
      "Biens vides & habités",
      "Livraison sous 2-12h",
      "Photos supplémentaires 4,50€",
      "Support réactif par email",
      "Accès plateforme 24/7",
      "Facture automatique",
    ],
  },
  {
    id: "pro_business",
    name: "PRO Business",
    price: "99€",
    priceNum: 99,
    unit: "/mois",
    popular: true,
    target: "Agences actives",
    features: [
      "30 photos/mois incluses",
      "Biens vides & habités",
      "Livraison sous 2-12h",
      "Photos supplémentaires 4,50€",
      "Support réactif prioritaire",
      "Accès plateforme 24/7",
      "Analytics & rapports",
      "Facture automatique",
    ],
  },
  {
    id: "pro_agency",
    name: "PRO Agency",
    price: "199€",
    priceNum: 199,
    unit: "/mois",
    popular: false,
    target: "Agences & réseaux fort volume",
    features: [
      "Photos illimitées/mois",
      "Biens vides & habités",
      "Livraison sous 2-12h",
      "Photos supplémentaires 4,50€",
      "Support réactif prioritaire",
      "Gestion équipe & utilisateurs",
      "Analytics & rapports avancés",
      "API d'intégration",
      "Facture automatique",
    ],
  },
];

export const ProOffersScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.headerTitle}>Offres PRO</Text>
          <Image source={require("../../assets/logo.png")} style={{ width: 100, height: 60 }} resizeMode="contain" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Intro */}
          <Text style={styles.introTitle}>
            Solutions d'abonnement pensées pour les professionnels de l'immobilier.
          </Text>
          <Text style={styles.introSub}>
            Photos illimitées, support réactif, intégrations avancées.
          </Text>

          {/* Offres */}
          {PRO_OFFERS.map((offer) => (
            <View
              key={offer.id}
              style={[styles.offerCard, offer.popular && styles.offerCardFeatured]}
            >
              {offer.popular && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Recommandé</Text>
                </View>
              )}
              <Text style={styles.offerName}>{offer.name}</Text>
              <Text style={styles.offerTarget}>{offer.target}</Text>
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
              <TouchableOpacity
                style={[styles.cta, offer.popular && styles.ctaPrimary]}
                onPress={() => alert("Contacter l'équipe pour activer cette offre")}
              >
                <Text style={[styles.ctaText, offer.popular && styles.ctaTextPrimary]}>
                  Choisir cette offre →
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Info footer */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Besoin d'aide ?</Text>
            <Text style={styles.infoText}>
              Contactez notre équipe pour discuter d'un plan personnalisé ou intégrations spéciales.
            </Text>
          </View>

        </View>
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
    marginBottom: 8, textAlign: "center", lineHeight: 24,
  },
  introSub: {
    fontSize: 12, color: COLORS.gray,
    marginBottom: 20, textAlign: "center", lineHeight: 18,
  },

  offerCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    padding: 16, borderWidth: 0.5, borderColor: COLORS.border,
    marginBottom: 12, position: "relative",
  },
  offerCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold },
  badge: { position: "absolute", top: 10, right: 10, backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 8, fontWeight: "600", color: "#fff" },

  offerName: { fontSize: 15, fontWeight: "600", color: COLORS.dark, marginBottom: 2 },
  offerTarget: { fontSize: 10, color: COLORS.gray, marginBottom: 10 },

  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 4, marginBottom: 14, marginTop: 6 },
  offerPrice: { fontSize: 26, fontWeight: "500", color: COLORS.dark },
  offerUnit: { fontSize: 12, color: COLORS.gray },

  featureRow: { flexDirection: "row", gap: 8, marginBottom: 6, alignItems: "flex-start" },
  featureCheck: { fontSize: 11, color: COLORS.gold, fontWeight: "600", marginTop: 1 },
  featureText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },

  cta: {
    marginTop: 12, paddingVertical: 10, alignItems: "center",
    borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.offWhite,
  },
  ctaPrimary: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  ctaText: { fontSize: 12, fontWeight: "600", color: COLORS.grayDark },
  ctaTextPrimary: { color: COLORS.goldDark },

  infoBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    padding: 14, marginTop: 20, marginBottom: 20, borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  infoTitle: { fontSize: 13, fontWeight: "600", color: COLORS.goldDark, marginBottom: 4 },
  infoText: { fontSize: 11, color: COLORS.goldDark, lineHeight: 16 },
});