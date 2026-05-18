import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

export const ProAccountScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      // Récupérer les données de Notion via le backend
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/subscription/${sessionId}`
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger votre abonnement");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSubscription(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setLoading(false);
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

  if (!subscription) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Abonnement non trouvé</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hero}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.heroTitle}>Mon Abonnement</Text>
            <Image source={require("../../assets/logo.png")} style={{ width: 100, height: 60 }} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.content}>

          {/* Status */}
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>✓ Abonnement Actif</Text>
            <Text style={styles.statusOffer}>{subscription.offerName}</Text>
            <Text style={styles.statusPrice}>{subscription.price}€/mois</Text>
          </View>

          {/* Infos entreprise */}
          <Text style={styles.sectionTitle}>Informations Entreprise</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom</Text>
              <Text style={styles.infoValue}>{subscription.companyName}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>SIRET</Text>
              <Text style={styles.infoValue}>{subscription.siret}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{subscription.email}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Téléphone</Text>
              <Text style={styles.infoValue}>{subscription.phone}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{subscription.address}</Text>
            </View>
          </View>

          {/* Date souscription */}
          <Text style={styles.sectionTitle}>Abonnement</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date de début</Text>
              <Text style={styles.infoValue}>{subscription.subscriptionDate}</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Renouvellement</Text>
              <Text style={styles.infoValue}>Automatique chaque mois</Text>
            </View>
          </View>

          {/* Actions */}
          <Text style={styles.sectionTitle}>Actions</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ProInvoices", { sessionId })}
          >
            <Text style={styles.actionIcon}>📄</Text>
            <Text style={styles.actionText}>Voir mes factures</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ProEditData", { sessionId })}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Modifier mes données</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ProChangePlan", { sessionId })}
          >
            <Text style={styles.actionIcon}>⬆️</Text>
            <Text style={styles.actionText}>Modifier mon abonnement</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("ProBuyPhotos", { sessionId })}
          >
            <Text style={styles.actionIcon}>📸</Text>
            <Text style={styles.actionText}>Commander photos supplémentaires</Text>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonDanger]}
            onPress={() => Alert.alert("Résilier", "Êtes-vous sûr ?", [
              { text: "Non", onPress: () => {} },
              { text: "Oui, résilier", onPress: () => navigation.navigate("ProCancel", { sessionId }) },
            ])}
          >
            <Text style={styles.actionIcon}>🚫</Text>
            <Text style={[styles.actionText, { color: COLORS.grayDark }]}>Résilier mon abonnement</Text>
            <Text style={[styles.actionArrow, { color: COLORS.grayDark }]}>→</Text>
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
  errorText: { fontSize: 14, color: COLORS.grayDark },

  statusBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 14,
    padding: 16, marginBottom: 20, borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  statusLabel: { fontSize: 12, fontWeight: "600", color: COLORS.goldDark, marginBottom: 8 },
  statusOffer: { fontSize: 18, fontWeight: "600", color: COLORS.goldDark, marginBottom: 4 },
  statusPrice: { fontSize: 16, fontWeight: "500", color: COLORS.gold },

  sectionTitle: {
    fontSize: 12, fontWeight: "600", color: COLORS.dark,
    marginTop: 16, marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5,
  },

  infoCard: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    overflow: "hidden", marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", padding: 12,
  },
  infoLabel: { fontSize: 11, color: COLORS.gray, fontWeight: "500" },
  infoValue: { fontSize: 12, color: COLORS.dark, fontWeight: "600", flex: 1, textAlign: "right" },
  infoDivider: { height: 0.5, backgroundColor: COLORS.border, marginHorizontal: 12 },

  actionButton: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 12,
  },
  actionButtonDanger: { borderColor: COLORS.beige, backgroundColor: COLORS.grayLight },
  actionIcon: { fontSize: 20 },
  actionText: { flex: 1, fontSize: 13, color: COLORS.dark, fontWeight: "600" },
  actionArrow: { fontSize: 16, color: COLORS.gold },
});