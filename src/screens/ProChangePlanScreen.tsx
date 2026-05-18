import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const PRO_OFFERS = [
  {
    id: "pro_starter",
    name: "PRO Starter",
    price: 49,
    priceId: "price_1TYBfHBtigY0O7pl47IpqnTG",
    photosPerMonth: 10,
    features: ["10 photos/mois", "Support email", "Accès 24/7"],
  },
  {
    id: "pro_business",
    name: "PRO Business",
    price: 99,
    priceId: "price_1TYBghBtigY0O7pl9jpFVbFb",
    photosPerMonth: 30,
    features: ["30 photos/mois", "Support prioritaire", "Accès 24/7"],
  },
  {
    id: "pro_agency",
    name: "PRO Agency",
    price: 199,
    priceId: "price_1TYBhnBtigY0O7plC1Njtp7T",
    photosPerMonth: 80,
    features: ["80 photos/mois", "Support prioritaire", "Accès 24/7"],
  },
];

export const ProChangePlanScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/subscription/${sessionId}`
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger le plan actuel");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCurrentPlan(data.offerId);
      setSelectedPlan(data.offerId);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setLoading(false);
    }
  };

  const handleChangeplan = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) {
      Alert.alert("Erreur", "Veuillez sélectionner un plan différent");
      return;
    }

    setChanging(true);

    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/change-plan/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPlanId: selectedPlan }),
        }
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de changer de plan");
        setChanging(false);
        return;
      }

      Alert.alert("Succès", "Votre plan a été modifié !", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Modifier mon abonnement</Text>
        </View>

        <View style={styles.content}>

          <Text style={styles.sectionTitle}>Choisir un nouveau plan</Text>

          {PRO_OFFERS.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[
                styles.planCard,
                selectedPlan === offer.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(offer.id)}
            >
              <View style={styles.planHeader}>
                <View>
                  <Text style={styles.planName}>{offer.name}</Text>
                  <Text style={styles.planPrice}>{offer.price}€/mois</Text>
                </View>
                <View
                  style={[
                    styles.planRadio,
                    selectedPlan === offer.id && styles.planRadioSelected,
                  ]}
                >
                  {selectedPlan === offer.id && (
                    <View style={styles.planRadioDot} />
                  )}
                </View>
              </View>

              <View style={styles.planDivider} />

              {offer.features.map((feat, i) => (
                <Text key={i} style={styles.planFeature}>
                  ✓ {feat}
                </Text>
              ))}

              {currentPlan === offer.id && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Plan actuel</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Infos */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • La modification prendra effet à votre prochain renouvellement
            </Text>
            <Text style={styles.infoText}>
              • Les changements vers un plan supérieur sont immédiats
            </Text>
            <Text style={styles.infoText}>
              • Les changements vers un plan inférieur sont au prochain renouvellement
            </Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.ctaButton, changing && styles.ctaButtonDisabled]}
            onPress={handleChangeplan}
            disabled={changing || selectedPlan === currentPlan}
          >
            {changing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>Confirmer le changement →</Text>
            )}
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  hero: { backgroundColor: COLORS.dark, padding: 20, paddingBottom: 24 },
  heroTitle: { fontSize: 20, fontWeight: "600", color: "#fff" },
  content: { padding: 16 },

  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  sectionTitle: {
    fontSize: 12, fontWeight: "600", color: COLORS.dark,
    marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5,
  },

  planCard: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10, position: "relative",
  },
  planCardSelected: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  planName: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginBottom: 2 },
  planPrice: { fontSize: 12, color: COLORS.gold, fontWeight: "500" },

  planRadio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: COLORS.border,
  },
  planRadioSelected: { borderColor: COLORS.gold },
  planRadioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.gold, margin: 3 },

  planDivider: { height: 0.5, backgroundColor: COLORS.border, marginBottom: 10 },
  planFeature: { fontSize: 10, color: COLORS.grayDark, marginBottom: 4, lineHeight: 14 },

  currentBadge: {
    backgroundColor: COLORS.successBg, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4, marginTop: 10, alignSelf: "flex-start",
  },
  currentBadgeText: { fontSize: 9, color: COLORS.successText, fontWeight: "600" },

  infoBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    padding: 12, marginBottom: 16, borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  infoText: { fontSize: 10, color: COLORS.goldDark, marginBottom: 6, lineHeight: 14 },

  ctaButton: {
    backgroundColor: COLORS.dark, borderRadius: 12,
    padding: 16, alignItems: "center", marginBottom: 24,
  },
  ctaButtonDisabled: { opacity: 0.5 },
  ctaButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});