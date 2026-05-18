import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

export const ProBuyPhotosScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [quantity, setQuantity] = useState("1");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricePerPhoto = 4.5;
  const qty = parseInt(quantity) || 0;
  const totalPrice = (qty * pricePerPhoto).toFixed(2);

  const handleBuy = async () => {
    if (qty < 1) {
      Alert.alert("Erreur", "Veuillez sélectionner au moins 1 photo");
      return;
    }
    if (!acceptTerms) {
      Alert.alert("Erreur", "Vous devez accepter les conditions");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/buy-photos/${sessionId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: qty,
            totalPrice: parseFloat(totalPrice),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.error || "Impossible de procéder au paiement");
        setLoading(false);
        return;
      }

      // Rediriger vers Stripe
      if (data.checkoutUrl) {
        Alert.alert("Succès", "Redirection vers le paiement...");
        // En production, ouvrir l'URL Stripe
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Photos supplémentaires</Text>
        </View>

        <View style={styles.content}>

          {/* Infos prix */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Prix unitaire</Text>
            <Text style={styles.priceValue}>4,50€ / photo</Text>
          </View>

          {/* Sélection quantité */}
          <Text style={styles.sectionTitle}>Quantité</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => setQuantity(Math.max(1, qty - 1).toString())}
            >
              <Text style={styles.quantityBtnText}>−</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={(text) => {
                const num = parseInt(text) || 1;
                setQuantity(num.toString());
              }}
              keyboardType="number-pad"
              textAlign="center"
            />

            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => setQuantity((qty + 1).toString())}
            >
              <Text style={styles.quantityBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Récapitulatif */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{qty} photo(s)</Text>
              <Text style={styles.summaryValue}>{(qty * pricePerPhoto).toFixed(2)}€</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total TTC</Text>
              <Text style={styles.summaryTotalValue}>{totalPrice}€</Text>
            </View>
          </View>

          {/* Checkbox conditions */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              Je reconnais avoir pris connaissance des Conditions Générales et je confirme l'achat de {qty} photo(s) supplémentaire(s).
            </Text>
          </View>

          {/* CTA Paiement */}
          <TouchableOpacity
            style={[styles.ctaButton, (!acceptTerms || qty < 1) && styles.ctaButtonDisabled]}
            onPress={handleBuy}
            disabled={!acceptTerms || qty < 1 || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>
                Procéder au paiement ({totalPrice}€) →
              </Text>
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

  priceBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    padding: 14, marginBottom: 20, borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  priceLabel: { fontSize: 11, color: COLORS.goldDark, marginBottom: 4 },
  priceValue: { fontSize: 18, fontWeight: "700", color: COLORS.gold },

  sectionTitle: {
    fontSize: 12, fontWeight: "600", color: COLORS.dark,
    marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5,
  },

  quantityContainer: {
    flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20,
  },
  quantityBtn: {
    width: 40, height: 40, borderRadius: 8,
    backgroundColor: COLORS.dark, alignItems: "center", justifyContent: "center",
  },
  quantityBtnText: { fontSize: 18, color: "#fff", fontWeight: "600" },
  quantityInput: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 10, fontSize: 16, fontWeight: "600", color: COLORS.dark,
  },

  summaryBox: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 16,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 12, color: COLORS.gray },
  summaryValue: { fontSize: 12, fontWeight: "600", color: COLORS.dark },
  summaryDivider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: 10 },
  summaryTotal: { fontSize: 13, fontWeight: "600", color: COLORS.dark },
  summaryTotalValue: { fontSize: 16, fontWeight: "700", color: COLORS.gold },

  checkboxContainer: { flexDirection: "row", marginBottom: 16, alignItems: "flex-start", gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center",
    marginTop: 2,
  },
  checkboxChecked: { borderColor: COLORS.gold, backgroundColor: COLORS.gold },
  checkmark: { color: "#fff", fontWeight: "600", fontSize: 12 },
  checkboxText: { flex: 1, fontSize: 10, color: COLORS.grayDark, lineHeight: 15 },

  ctaButton: {
    backgroundColor: COLORS.dark, borderRadius: 12,
    padding: 16, alignItems: "center", marginBottom: 24,
  },
  ctaButtonDisabled: { opacity: 0.5 },
  ctaButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});