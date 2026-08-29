import React, { useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity, TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FORMULAS } from "../constants";
import { useAppStore } from "../store";

export const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const { orderConfig, setOrderConfig } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [cgvAccepted, setCgvAccepted] = useState(false);

  // Infos client
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [propertyType, setPropertyType] = useState<"Appartement" | "Maison" | null>(null);
  const [propertySize, setPropertySize] = useState<"Studio" | "T1" | "T2" | "T3" | "T4" | "T5" | "Autre" | null>(null);
  const [exteriorFeatures, setExteriorFeatures] = useState<string[]>([]);

  const formulaId = orderConfig?.formulaId || "essentiel";
  const formula = Object.values(FORMULAS).find((f: any) => f.id === formulaId);
  const price = (formula as any)?.price || 9.90;
  const priceHT = parseFloat((price / 1.20).toFixed(2));
  const tva = parseFloat((price - priceHT).toFixed(2));
  const formulaName = (formula as any)?.name || "Essentiel";
  const photoCount = orderConfig?.photos?.length || 0;
  const isHabite = orderConfig?.isHabite || false;
  
  // Suppression de " - IA" pour biens vides
  const typePrestation = isHabite ? "Bien habité - Expert" : "Bien vide";

  const toggleExterior = (feature: string) => {
    setExteriorFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

 const handlePay = async () => {
  if (!clientName.trim()) {
    Alert.alert("Champ requis", "Veuillez saisir votre nom.");
    return;
  }
  if (!clientEmail.includes('@')) {
    Alert.alert("Email invalide", "Veuillez saisir un email valide.");
    return;
  }
  if (!propertySize) {
    Alert.alert("Champ requis", "Veuillez sélectionner la taille du logement.");
    return;
  }
  if (!cgvAccepted) {
    Alert.alert("Validation requise", "Veuillez accepter les CGV.");
    return;
  }

  setLoading(true);
  try {
    const API_URL = 'https://poetic-youthfulness-production-fecb.up.railway.app';
    const orderId = "ORD-" + Date.now();

    const payload = {
      photos: orderConfig?.photos || [],
      clientName: clientName.trim(),
      clientEmail: clientEmail.toLowerCase().trim(),
      clientPhone: clientPhone.trim(),
      propertyAddress: propertyAddress.trim(),
      propertyType: propertyType || null,
      propertySize: propertySize,           // variable locale directe
      exteriorFeatures: exteriorFeatures,   // variable locale directe
      isHabite: orderConfig?.isHabite || false,
      orderId,
      formulaId: orderConfig?.formulaId || "essentiel",
      formulaLabel: formulaName,
    };

    console.log('[Payment] payload:', payload);

 // Sauvegarder dans le store pour que ProcessingScreen y ait accès
setOrderConfig({
  clientName: clientName.trim(),
  clientEmail: clientEmail.toLowerCase().trim(),
  clientPhone: clientPhone.trim(),
  propertyAddress: propertyAddress.trim(),
  propertyType: propertyType || undefined,
  propertySize,
  exteriorFeatures,
  formulaLabel: formulaName,
});

// Naviguer vers ProcessingScreen qui fera l'appel backend
navigation.navigate("Processing", { orderId });
  } catch (err) {
    Alert.alert("Erreur", "Une erreur est survenue. Réessayez.");
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Paiement sécurisé</Text>
        <Text style={styles.headerSub}>Facture automatique envoyée par email</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Récapitulatif commande */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Votre commande</Text>
            <Row label="Formule" value={formulaName} />
            <Row label="Type de prestation" value={typePrestation} valueColor={COLORS.gold} />
            <Row label="Photos" value={`${photoCount} photo(s) configurée(s)`} />
            {orderConfig?.photos?.map((p: any, i: number) => (
              <Row key={i} label={`  Photo #${i + 1}`} value={p.roomLabel || "—"} small />
            ))}
            <Row label="Livraison" value={isHabite ? "48 à 72h" : "2h à 12h"} />
            <Row label="Facture" value="Email automatique" />
            <View style={styles.divider} />
            <Row label="Sous-total HT" value={`${priceHT.toFixed(2).replace(".", ",")}€`} />
            <Row label="TVA 20%" value={`${tva.toFixed(2).replace(".", ",")}€`} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total TTC</Text>
              <Text style={styles.totalAmount}>{price.toFixed(2).replace(".", ",")}€</Text>
            </View>
          </View>

          {/* Infos client */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vos coordonnées</Text>

            <Text style={styles.fieldLabel}>Nom complet *</Text>
            <TextInput
              style={styles.input}
              placeholder="Prénom Nom"
              placeholderTextColor={COLORS.gray}
              value={clientName}
              onChangeText={setClientName}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="votre@email.com"
              placeholderTextColor={COLORS.gray}
              value={clientEmail}
              onChangeText={setClientEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.fieldLabel}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="+33 6 00 00 00 00"
              placeholderTextColor={COLORS.gray}
              value={clientPhone}
              onChangeText={setClientPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.fieldLabel}>Adresse du bien</Text>
            <TextInput
              style={styles.input}
              placeholder="123 rue de la Paix, 75001 Paris"
              placeholderTextColor={COLORS.gray}
              value={propertyAddress}
              onChangeText={setPropertyAddress}
              autoCapitalize="words"
            />

            <Text style={styles.fieldLabel}>Type de bien</Text>
            <View style={styles.typeRow}>
              {(["Appartement", "Maison"] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeBtn, propertyType === t && styles.typeBtnActive]}
                  onPress={() => setPropertyType(t)}
                >
                  <Text style={[styles.typeBtnText, propertyType === t && styles.typeBtnTextActive]}>
                    {t === "Appartement" ? "🏢 " : "🏡 "}{t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Taille du logement */}
            <Text style={styles.fieldLabel}>Taille du logement *</Text>
            <View style={styles.sizeGrid}>
              {(["Studio", "T1", "T2", "T3", "T4", "T5", "Autre"] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[styles.sizeBtn, propertySize === size && styles.sizeBtnActive]}
                  onPress={() => setPropertySize(size)}
                >
                  <Text style={[styles.sizeBtnText, propertySize === size && styles.sizeBtnTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Extérieurs */}
            <Text style={styles.fieldLabel}>Extérieurs</Text>
            <View style={styles.exteriorRow}>
              {(["Balcon", "Cour", "Terrasse"] as const).map((feature) => (
                <TouchableOpacity
                  key={feature}
                  style={[styles.exteriorCheckbox, exteriorFeatures.includes(feature) && styles.exteriorCheckboxActive]}
                  onPress={() => toggleExterior(feature)}
                >
                  <View style={[styles.checkbox, exteriorFeatures.includes(feature) && styles.checkboxChecked]}>
                    {exteriorFeatures.includes(feature) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.exteriorLabel}>{feature}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Paiement Stripe */}
          <View style={styles.card}>
            <View style={styles.stripeHeader}>
              <Text style={styles.stripeTitle}>Paiement par carte</Text>
              <View style={styles.stripeBadge}>
                <Text style={styles.stripeBadgeText}>Stripe</Text>
              </View>
              <Text style={{ fontSize: 16, marginLeft: "auto" }}>🔒</Text>
            </View>

            <Text style={styles.fieldLabel}>Numéro de carte</Text>
            <View style={styles.fieldInput}>
              <Text style={styles.fieldPlaceholder}>4242  4242  4242  4242</Text>
              <Text style={{ fontSize: 14 }}>💳</Text>
            </View>

            <View style={styles.fieldRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Expiration</Text>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldPlaceholder}>MM / AA</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>CVC</Text>
                <View style={styles.fieldHalf}>
                  <Text style={styles.fieldPlaceholder}>•••</Text>
                </View>
              </View>
            </View>

            <View style={styles.secureRow}>
              <View style={styles.secureDot} />
              <Text style={styles.secureText}>
                Paiement SSL · Facture PDF envoyée automatiquement
              </Text>
            </View>
          </View>

          {/* CGV */}
          <TouchableOpacity
            style={styles.cgvRow}
            onPress={() => setCgvAccepted(!cgvAccepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, cgvAccepted && styles.checkboxChecked]}>
              {cgvAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.cgvText}>
              Je reconnais avoir pris connaissance des{" "}
              <Text style={styles.cgvLink}>Conditions Générales de Vente</Text>
              {" "}et je demande l'exécution immédiate de la prestation. Je renonce expressément à mon droit de rétractation de 14 jours.
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <View style={styles.devNotice}>
              <Text style={styles.devText}>
                Mode développement — paiement simulé.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.payBtn, (loading || !cgvAccepted || !propertySize) && styles.payBtnDisabled]}
            onPress={handlePay}
            disabled={loading || !cgvAccepted || !propertySize}
          >
            <Text style={styles.payBtnText}>
              {loading ? "Traitement en cours..." : `Lancer l'analyse — ${price.toFixed(2).replace(".", ",")}€`}
            </Text>
          </TouchableOpacity>

          <Text style={styles.legal}>
            Paiement sécurisé SSL · Facture automatique · Données protégées
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Row = ({
  label, value, valueColor, small,
}: {
  label: string; value: string; valueColor?: string; small?: boolean;
}) => (
  <View style={rowStyles.row}>
    <Text style={[rowStyles.label, small && { color: "#aaa", fontSize: 9 }]}>{label}</Text>
    <Text style={[rowStyles.value, valueColor ? { color: valueColor } : {}, small && { fontSize: 9 }]}>
      {value}
    </Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 5,
    borderBottomWidth: 0.5, borderBottomColor: "#f0ece8",
  },
  label: { fontSize: 10, color: COLORS.gray },
  value: { fontSize: 10, fontWeight: "500", color: COLORS.dark },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff", marginBottom: 2 },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.4)" },
  content: { padding: 16 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 12,
  },
  cardTitle: { fontSize: 12, fontWeight: "500", color: COLORS.dark, marginBottom: 10 },
  divider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: 8 },
  totalRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingTop: 8,
  },
  totalLabel: { fontSize: 13, fontWeight: "500", color: COLORS.dark },
  totalAmount: { fontSize: 22, fontWeight: "500", color: COLORS.dark },
  input: {
    backgroundColor: COLORS.offWhite, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 10, marginBottom: 10, fontSize: 13, color: COLORS.dark,
  },
  typeRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  typeBtn: {
    flex: 1, padding: 10, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    backgroundColor: COLORS.offWhite, alignItems: "center",
  },
  typeBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  typeBtnText: { fontSize: 11, color: COLORS.grayDark },
  typeBtnTextActive: { color: COLORS.goldDark, fontWeight: "500" },
  sizeGrid: {
    flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10,
  },
  sizeBtn: {
    flex: 1, minWidth: "30%", padding: 8, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    backgroundColor: COLORS.offWhite, alignItems: "center",
  },
  sizeBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  sizeBtnText: { fontSize: 10, color: COLORS.grayDark },
  sizeBtnTextActive: { color: COLORS.goldDark, fontWeight: "600" },
  exteriorRow: { flexDirection: "row", gap: 10, marginBottom: 10, flexWrap: "wrap" },
  exteriorCheckbox: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.offWhite, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 8, flex: 1, minWidth: "45%",
  },
  exteriorCheckboxActive: { borderColor: COLORS.gold, backgroundColor: "#fdf8f1" },
  exteriorLabel: { fontSize: 11, color: COLORS.grayDark, fontWeight: "500" },
  checkbox: {
    width: 18, height: 18, borderRadius: 4,
    borderWidth: 1.5, borderColor: COLORS.gray,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  checkmark: { color: "#fff", fontSize: 11, fontWeight: "700" },
  stripeHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  stripeTitle: { fontSize: 12, fontWeight: "500", color: COLORS.dark },
  stripeBadge: { backgroundColor: "#635bff", borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  stripeBadgeText: { color: "#fff", fontSize: 9, fontWeight: "600" },
  fieldLabel: { fontSize: 9, color: COLORS.gray, marginBottom: 4, fontWeight: "500" },
  fieldInput: {
    backgroundColor: COLORS.offWhite, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 10, marginBottom: 10,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  fieldRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  fieldHalf: {
    backgroundColor: COLORS.offWhite, borderRadius: 8,
    borderWidth: 0.5, borderColor: COLORS.border, padding: 10,
  },
  fieldPlaceholder: { fontSize: 11, color: COLORS.gray },
  secureRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  secureDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#22c55e" },
  secureText: { fontSize: 9, color: COLORS.gray, flex: 1 },
  cgvRow: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    backgroundColor: COLORS.white, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 12,
  },
  cgvText: { fontSize: 10, color: COLORS.grayDark, flex: 1, lineHeight: 16 },
  cgvLink: { color: COLORS.gold, textDecorationLine: "underline" },
  devNotice: {
    backgroundColor: "#fff8e1", borderRadius: 10,
    borderWidth: 0.5, borderColor: "#f0d060",
    padding: 10, marginBottom: 10,
  },
  devText: { fontSize: 9, color: "#7a6000", textAlign: "center", lineHeight: 14 },
  payBtn: {
    backgroundColor: COLORS.gold, borderRadius: 13,
    padding: 15, alignItems: "center", marginBottom: 8,
  },
  payBtnDisabled: { opacity: 0.4 },
  payBtnText: { color: "#fff", fontSize: 13, fontWeight: "500" },
  legal: { fontSize: 9, color: COLORS.gray, textAlign: "center", marginBottom: 20 },
});