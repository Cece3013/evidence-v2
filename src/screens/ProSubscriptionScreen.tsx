import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Image, Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const PRO_OFFERS_MAP: Record<string, { name: string; price: number; priceId: string }> = {
  pro_starter: { name: "PRO Starter", price: 49, priceId: "price_1TjdIzBtigY0O7pljXLznLIs" },
  pro_business: { name: "PRO Business", price: 99, priceId: "price_1TjdJIBtigY0O7plmAViGr2c" },
  pro_agency: { name: "PRO Agency", price: 199, priceId: "price_1TjdJbBtigY0O7plhTK1GXe4" },
};

export const ProSubscriptionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const offerId = route.params?.offerId || "pro_starter";
  const offer = PRO_OFFERS_MAP[offerId];

  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubscribe = async () => {
    if (!companyName.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le nom de l'entreprise");
      return;
    }
    if (!siret.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le SIRET");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Erreur", "Veuillez entrer l'email");
      return;
    }
    if (!phone.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le téléphone");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Erreur", "Veuillez entrer l'adresse");
      return;
    }
    if (!acceptTerms) {
      Alert.alert("Erreur", "Vous devez accepter les conditions");
      return;
    }

    setLoading(true);

    try {
      // Appeler le backend pour créer l'abonnement Stripe
      const response = await fetch("https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: offer.priceId,
          companyName,
          siret,
          email,
          phone,
          address,
          offerId,
          subscriptionDate: today,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.error || "Erreur lors de l'abonnement");
        setLoading(false);
        return;
      }

      // Rediriger vers Stripe Checkout
      if (data.checkoutUrl) {
        Alert.alert("Succès", "Abonnement créé ! Redirection vers le paiement...");
        await Linking.openURL(data.checkoutUrl);
      }
      
    } catch (error) {
      Alert.alert("Erreur", "Erreur réseau");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Abonnement {offer.name}</Text>
          <Text style={styles.heroSub}>{offer.price}€ / mois</Text>
        </View>

        <View style={styles.content}>

          {/* Infos abonnement */}
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>✓ Abonnement mensuel sans engagement</Text>
            <Text style={styles.infoLabel}>✓ Renouvellement automatique jusqu'à résiliation</Text>
          </View>

          {/* Formulaire */}
          <Text style={styles.sectionTitle}>Informations de l'entreprise</Text>

          <TextInput
            style={styles.input}
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChangeText={setCompanyName}
            placeholderTextColor={COLORS.gray}
          />

          <TextInput
            style={styles.input}
            placeholder="SIRET"
            value={siret}
            onChangeText={setSiret}
            placeholderTextColor={COLORS.gray}
          />

          <TextInput
            style={styles.input}
            placeholder="Email professionnel"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={COLORS.gray}
          />

          <TextInput
            style={styles.input}
            placeholder="Téléphone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.gray}
          />

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Adresse de l'entreprise"
            value={address}
            onChangeText={setAddress}
            multiline
            placeholderTextColor={COLORS.gray}
          />

          {/* Checkbox conditions */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.checkboxText}>
              Je reconnais avoir pris connaissance des Conditions Générales de Vente et demande l'activation immédiate de mon abonnement après validation du paiement.{"\n\n"}
              Je reconnais qu'aucun remboursement ne pourra être demandé après activation de l'abonnement et accès aux services numériques.
            </Text>
          </View>

          {/* CTA Paiement */}
          <TouchableOpacity
            style={[styles.ctaButton, !acceptTerms && styles.ctaButtonDisabled]}
            onPress={handleSubscribe}
            disabled={!acceptTerms || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>
                Procéder au paiement ({offer.price}€/mois) →
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
  heroTitle: { fontSize: 20, fontWeight: "600", color: "#fff", marginBottom: 4 },
  heroSub: { fontSize: 14, color: COLORS.gold, fontWeight: "500" },
  content: { padding: 16 },

  infoBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 12,
    padding: 14, marginBottom: 20, borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  infoLabel: { fontSize: 11, color: COLORS.goldDark, marginBottom: 6, lineHeight: 16 },

  sectionTitle: { fontSize: 12, fontWeight: "600", color: COLORS.dark, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },

  input: {
    backgroundColor: COLORS.white, borderRadius: 10,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 12, marginBottom: 10,
    fontSize: 13, color: COLORS.dark,
  },

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