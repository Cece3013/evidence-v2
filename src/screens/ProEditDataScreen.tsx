import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../constants";

export const ProEditDataScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sessionId = route.params?.sessionId;

  const [companyName, setCompanyName] = useState("");
  const [siret, setSiret] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCurrentData();
  }, []);

  const fetchCurrentData = async () => {
    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/subscription/${sessionId}`
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de charger les données");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCompanyName(data.companyName);
      setSiret(data.siret);
      setEmail(data.email);
      setPhone(data.phone);
      setAddress(data.address);
      setLoading(false);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!companyName.trim() || !siret.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `https://poetic-youthfulness-production-fecb.up.railway.app/api/pro/update-data/${sessionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            companyName,
            siret,
            email,
            phone,
            address,
          }),
        }
      );

      if (!response.ok) {
        Alert.alert("Erreur", "Impossible de mettre à jour les données");
        setSaving(false);
        return;
      }

      Alert.alert("Succès", "Données mises à jour !");
      setSaving(false);
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Erreur réseau");
      setSaving(false);
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
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Modifier mes données</Text>
        </View>

        <View style={styles.content}>

          <Text style={styles.sectionTitle}>Informations Entreprise</Text>

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

          {/* CTA Sauvegarder */}
          <TouchableOpacity
            style={[styles.ctaButton, saving && styles.ctaButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaButtonText}>Sauvegarder les modifications →</Text>
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

  input: {
    backgroundColor: COLORS.white, borderRadius: 10,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 12, marginBottom: 10,
    fontSize: 13, color: COLORS.dark,
  },

  ctaButton: {
    backgroundColor: COLORS.dark, borderRadius: 12,
    padding: 16, alignItems: "center", marginTop: 16, marginBottom: 24,
  },
  ctaButtonDisabled: { opacity: 0.5 },
  ctaButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});