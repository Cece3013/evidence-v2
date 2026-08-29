import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EvidenceLogoIcon } from "../components/EvidenceLogo";
import { Button } from "../components/UI";
import { COLORS } from "../constants";
import { useAppStore } from "../store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const InvoiceScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { orderConfig, addOrder } = useAppStore();
  const { orderId, invoice: routeInvoice } = route.params || {};

  const [invoice, setInvoice] = useState(routeInvoice || null);
  const [loading, setLoading] = useState(!routeInvoice);

  useEffect(() => {
    if (!routeInvoice) {
      setTimeout(() => {
        const price = orderConfig?.formulaPrice || 9.90;
        const priceHT = parseFloat((price / 1.20).toFixed(2));
        const tva = parseFloat((price - priceHT).toFixed(2));
        setInvoice({
          invoiceNumber: "EHS-2026-" + Math.floor(Math.random() * 99999).toString().padStart(5, "0"),
          date: new Date().toISOString(),
          clientName: "Client",
          clientEmail: "client@email.com",
          formulaName: orderConfig?.formulaId === "essentiel" ? "Essentiel" : "Essentiel+",
          roomType: "Multiple pièces",
          photoCount: orderConfig?.photos?.length || 0,
          priceHT,
          tva,
          priceTTC: price,
        });
        setLoading(false);
      }, 1000);
    }
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.offWhite }}>
        <ActivityIndicator color={COLORS.gold} size="large" />
        <Text style={{ marginTop: 12, fontSize: 12, color: COLORS.gray }}>Génération de la facture…</Text>
      </View>
    );
  }

  const dateFormatted = invoice?.date
    ? format(new Date(invoice.date), "d MMMM yyyy", { locale: fr })
    : format(new Date(), "d MMMM yyyy", { locale: fr });

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.successWrap}>
            <View style={styles.successCircle}>
              <Text style={{ fontSize: 24 }}>✅</Text>
            </View>
            <Text style={styles.successTitle}>Paiement confirmé</Text>
            <Text style={styles.successSub}>Facture envoyée à {invoice?.clientEmail}</Text>
          </View>

          <View style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <EvidenceLogoIcon size={26} />
                <View>
                  <Text style={styles.invoiceBrand}>EVIDENCE Home Staging</Text>
                  <Text style={styles.invoiceNum}>Facture N° {invoice?.invoiceNumber}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.invoiceDate}>{dateFormatted}</Text>
                <View style={styles.paidBadge}>
                  <Text style={styles.paidBadgeText}>Payée</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>DÉTAIL DE LA COMMANDE</Text>
            <InvoiceRow label="Formule" value={invoice?.formulaName || ""} />
            <InvoiceRow label="Photos" value={`${invoice?.photoCount} photo(s)`} />
            <View style={styles.amountDivider} />
            <InvoiceRow label="Sous-total HT" value={`${invoice?.priceHT?.toFixed(2).replace(".", ",")}€`} />
            <InvoiceRow label="TVA 20%" value={`${invoice?.tva?.toFixed(2).replace(".", ",")}€`} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total TTC</Text>
              <Text style={styles.totalAmount}>{invoice?.priceTTC?.toFixed(2).replace(".", ",")}€</Text>
            </View>
          </View>

          <View style={styles.emailBanner}>
            <Text style={{ fontSize: 16 }}>📧</Text>
            <Text style={styles.emailText}>
              Facture PDF envoyée automatiquement à votre adresse email.
            </Text>
          </View>

          <Button
            label="Lancer l'analyse IA →"
            onPress={() => navigation.navigate("Processing", { orderId })}
          />
          <Button
            label="Voir dans mon compte"
            onPress={() => navigation.navigate("Main")}
            variant="ghost"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InvoiceRow = ({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) => (
  <View style={irStyles.row}>
    <Text style={irStyles.label}>{label}</Text>
    <Text style={[irStyles.value, valueColor ? { color: valueColor } : {}]}>{value}</Text>
  </View>
);

const irStyles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 0.5, borderBottomColor: "#f8f7f4" },
  label: { fontSize: 10, color: COLORS.gray },
  value: { fontSize: 10, fontWeight: "500", color: COLORS.dark },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: 16 },
  successWrap: { alignItems: "center", marginBottom: 18 },
  successCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#f0faf0", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  successTitle: { fontSize: 16, fontWeight: "500", color: COLORS.dark, marginBottom: 3 },
  successSub: { fontSize: 10, color: COLORS.gray },
  invoiceCard: { backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 0.5, borderColor: COLORS.border, padding: 16, marginBottom: 12 },
  invoiceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: "#f0ece8" },
  invoiceBrand: { fontSize: 11, fontWeight: "500", color: COLORS.dark },
  invoiceNum: { fontSize: 8, color: COLORS.gray, marginTop: 1 },
  invoiceDate: { fontSize: 8, color: COLORS.gray },
  paidBadge: { backgroundColor: "#edf7ee", borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2, marginTop: 3 },
  paidBadgeText: { fontSize: 8, fontWeight: "600", color: "#3a7a3e" },
  sectionTitle: { fontSize: 9, fontWeight: "600", color: COLORS.gray, letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" },
  amountDivider: { height: 0.5, backgroundColor: COLORS.border, marginVertical: 8 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 8 },
  totalLabel: { fontSize: 13, fontWeight: "500", color: COLORS.dark },
  totalAmount: { fontSize: 20, fontWeight: "500", color: COLORS.dark },
  emailBanner: { backgroundColor: "#f0faf0", borderWidth: 0.5, borderColor: "#c0e0c0", borderRadius: 11, padding: 11, flexDirection: "row", gap: 9, alignItems: "flex-start", marginBottom: 12 },
  emailText: { fontSize: 10, color: "#2d6a32", flex: 1, lineHeight: 15 },
});