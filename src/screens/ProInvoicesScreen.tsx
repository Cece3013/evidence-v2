import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Image, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

export const ProInvoicesScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/invoices/${sessionId}`
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger les factures");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setInvoices(data.invoices || []);
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

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Mes Factures</Text>
        </View>

        <View style={styles.content}>

          {invoices.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>📄</Text>
              <Text style={styles.emptyText}>Aucune facture pour le moment</Text>
              <Text style={styles.emptySub}>Vos factures apparaîtront ici</Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={invoices}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={styles.invoiceCard}>
                  <View style={styles.invoiceRow}>
                    <View>
                      <Text style={styles.invoiceNumber}>Facture {item.number}</Text>
                      <Text style={styles.invoiceDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.invoiceAmount}>{item.amount}€</Text>
                  </View>
                  <View style={styles.invoiceDivider} />
                  <TouchableOpacity
                    style={styles.invoiceButton}
                    onPress={() => Alert.alert("PDF", "Téléchargement de la facture...")}
                  >
                    <Text style={styles.invoiceButtonText}>Télécharger PDF →</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

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

  emptyBox: {
    backgroundColor: COLORS.white, borderRadius: 14,
    padding: 32, alignItems: "center", borderWidth: 0.5, borderColor: COLORS.border,
    marginTop: 20,
  },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, fontWeight: "600", color: COLORS.dark, marginBottom: 4 },
  emptySub: { fontSize: 11, color: COLORS.gray },

  invoiceCard: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10, overflow: "hidden",
  },
  invoiceRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12,
  },
  invoiceNumber: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginBottom: 2 },
  invoiceDate: { fontSize: 11, color: COLORS.gray },
  invoiceAmount: { fontSize: 16, fontWeight: "700", color: COLORS.gold },
  invoiceDivider: { height: 0.5, backgroundColor: COLORS.border, marginBottom: 12 },

  invoiceButton: {
    backgroundColor: COLORS.offWhite, borderRadius: 8,
    padding: 10, alignItems: "center",
  },
  invoiceButtonText: { fontSize: 12, color: COLORS.gold, fontWeight: "600" },
});