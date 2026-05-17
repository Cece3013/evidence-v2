import React from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

const MOCK_ANALYSES = [
  {
    id: "1",
    type: "habite",
    formulaName: "Premium",
    roomType: "3 pièces",
    date: "15 avril 2026",
    statut: "En cours",
    statutColor: "#b8892e",
    statutBg: "#fdf6ec",
    pdfUrl: null,
  },
  {
    id: "2",
    type: "vide",
    formulaName: "Essentiel+",
    roomType: "Salon · Scandinave",
    date: "10 avril 2026",
    statut: "Terminé",
    statutColor: "#2d6a32",
    statutBg: "#edf7ee",
    pdfUrl: "https://example.com/rapport.pdf",
  },
];

export const MesAnalysesScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes analyses</Text>
        <Text style={styles.headerSub}>Suivi de vos rapports et résultats</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {MOCK_ANALYSES.map((analyse) => (
            <View key={analyse.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardFormula}>{analyse.formulaName}</Text>
                  <Text style={styles.cardRoom}>{analyse.roomType}</Text>
                  <Text style={styles.cardDate}>{analyse.date}</Text>
                </View>
                <View style={[styles.statutBadge, { backgroundColor: analyse.statutBg }]}>
                  <Text style={[styles.statutText, { color: analyse.statutColor }]}>
                    {analyse.statut}
                  </Text>
                </View>
              </View>

              {analyse.type === "habite" && (
                <View style={styles.habiteInfo}>
                  <Text style={styles.habiteInfoText}>
                    ⏱️ Notre équipe traite votre dossier. Vous serez notifié par email dès que votre rapport est prêt.
                  </Text>
                </View>
              )}

              <View style={styles.cardActions}>
                {analyse.pdfUrl ? (
                  <>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => {}}>
                      <Text style={styles.actionBtnText}>👁️ Consulter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnGold]} onPress={() => {}}>
                      <Text style={[styles.actionBtnText, { color: "#fff" }]}>⬇️ Télécharger</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.pendingWrap}>
                    <Text style={styles.pendingText}>En attente de livraison</Text>
                  </View>
                )}
                <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Invoice")}>
                  <Text style={styles.actionBtnText}>🧾 Facture</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff", marginBottom: 2 },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.4)" },
  content: { padding: 16 },
  card: {
    backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 12,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  cardFormula: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginBottom: 2 },
  cardRoom: { fontSize: 11, color: COLORS.gray, marginBottom: 2 },
  cardDate: { fontSize: 9, color: COLORS.gray },
  statutBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statutText: { fontSize: 10, fontWeight: "600" },
  habiteInfo: {
    backgroundColor: "#fdf8f1", borderRadius: 8,
    borderWidth: 0.5, borderColor: "#f0d9b5",
    padding: 10, marginBottom: 10,
  },
  habiteInfoText: { fontSize: 10, color: "#8a6020", lineHeight: 15 },
  cardActions: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  actionBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 0.5, borderColor: COLORS.border,
    backgroundColor: COLORS.offWhite,
  },
  actionBtnGold: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  actionBtnText: { fontSize: 10, color: COLORS.dark },
  pendingWrap: {
    flex: 1, paddingVertical: 7,
    alignItems: "center",
  },
  pendingText: { fontSize: 10, color: COLORS.gray, fontStyle: "italic" },
});