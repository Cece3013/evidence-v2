import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

export const ProCancelScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [canceling, setCanceling] = useState(false);

  const handleCancel = async () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous vraiment sûr ? Votre abonnement sera résilié immédiatement.",
      [
        { text: "Non, annuler", onPress: () => {} },
        {
          text: "Oui, résilier",
          onPress: async () => {
            setCanceling(true);
            try {
              const response = await fetch(
                `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/cancel/${sessionId}`,
                { method: "POST" }
              );

              if (!response.ok) {
                Alert.alert("Erreur", "Impossible de résilier l'abonnement");
                setCanceling(false);
                return;
              }

              Alert.alert("Succès", "Votre abonnement a été résilié.", [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Home"),
                },
              ]);
            } catch (error) {
              console.error(error);
              Alert.alert("Erreur", "Erreur réseau");
              setCanceling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Résilier mon abonnement</Text>
        </View>

        <View style={styles.content}>

          {/* Avertissement */}
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningTitle}>Attention</Text>
            <Text style={styles.warningText}>
              La résiliation de votre abonnement est immédiate. Vous perdrez l'accès à tous les services PRO.
            </Text>
          </View>

          {/* Infos */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Ce que vous devez savoir :</Text>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Votre abonnement sera résilié immédiatement</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Aucun remboursement ne sera effectué</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Vous perdrez accès à votre espace PRO</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoBullet}>•</Text>
              <Text style={styles.infoText}>Vos données resteront archivées 12 mois</Text>
            </View>
          </View>

          {/* CTA Cancel */}
          <TouchableOpacity
            style={[styles.ctaButtonDanger, canceling && styles.ctaButtonDisabled]}
            onPress={handleCancel}
            disabled={canceling}
          >
            {canceling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>Résilier définitivement →</Text>
            )}
          </TouchableOpacity>

          {/* CTA Back */}
          <TouchableOpacity
            style={styles.ctaButtonSecondary}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.ctaButtonSecondaryText}>Revenir en arrière</Text>
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

  warningBox: {
    backgroundColor: COLORS.warningBg, borderRadius: 14,
    borderWidth: 0.5, borderColor: COLORS.warningBg,
    padding: 16, marginBottom: 20, alignItems: "center",
  },
  warningIcon: { fontSize: 32, marginBottom: 8 },
  warningTitle: { fontSize: 14, fontWeight: "600", color: COLORS.warningText, marginBottom: 8 },
  warningText: { fontSize: 12, color: COLORS.warningText, lineHeight: 18, textAlign: "center" },

  infoBox: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 20,
  },
  infoTitle: { fontSize: 12, fontWeight: "600", color: COLORS.dark, marginBottom: 10 },
  infoItem: { flexDirection: "row", gap: 8, marginBottom: 8 },
  infoBullet: { fontSize: 12, color: COLORS.gray, marginTop: 1 },
  infoText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },

  ctaButtonDanger: {
    backgroundColor: "#d32f2f", borderRadius: 12,
    padding: 16, alignItems: "center", marginBottom: 10,
  },
  ctaButtonSecondary: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 16, alignItems: "center", marginBottom: 24,
  },
  ctaButtonDisabled: { opacity: 0.5 },
  ctaButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  ctaButtonSecondaryText: { color: COLORS.dark, fontSize: 13, fontWeight: "600" },
});