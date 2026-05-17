import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../store";

const COLORS = {
  offWhite: "#F7F6F2",
  dark: "#121212",
  white: "#FFFFFF",
  border: "#E6E6E6",
  gold: "#D4AF37",
  goldLight: "#F9F0C1",
  gray: "#7E7E7E",
  grayDark: "#333333",
  goldDark: "#A67C00",
};

const PROPERTY_TYPES = ["Maison", "Appartement"] as const;
const ROOM_COUNTS = ["Studio", "T1", "T2", "T3", "T4", "T5 et au-delà"];
const EXTERIORS = ["Balcon", "Terrasse", "Cour"];
const PROFILES = ["Agence immobilière", "Mandataire", "Particulier", "Promoteur"];

const FORMULAS_VIDE = [
  { id: "decouverte", name: "Découverte", price: "39€", priceNum: 39, maxPhotos: 2, desc: "2 photos · Avant/Après immédiat" },
  { id: "essentielle", name: "Essentielle", price: "89€", priceNum: 89, maxPhotos: 5, desc: "5 photos · Avant/Après immédiat" },
  { id: "performance", name: "Performance", price: "139€", priceNum: 139, maxPhotos: 8, popular: true, desc: "8 photos · Max impact annonce" },
];

const FORMULAS_HABITE = [
  { id: "essentiel_habite", name: "Essentiel", price: "79€", priceNum: 79, maxPhotos: 2, desc: "Jusqu'à 2 pièces · 48-72h" },
  { id: "premium_habite", name: "Premium", price: "159€", priceNum: 159, maxPhotos: 5, popular: true, desc: "Jusqu'à 5 pièces · 72h" },
];

type PropertyType = "Maison" | "Appartement";

export const AnalyzeScreen = () => {
  const navigation = useNavigation<any>();
  const { setOrderConfig } = useAppStore();

  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [roomCount, setRoomCount] = useState<string | null>(null);
  const [selectedExteriors, setSelectedExteriors] = useState<string[]>([]);
  const [profile, setProfile] = useState<string | null>(null);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [situationType, setSituationType] = useState<"vide" | "habite" | null>(null);

  const toggleExterior = (ext: string) => {
    setSelectedExteriors((prev) =>
      prev.includes(ext) ? prev.filter((e) => e !== ext) : [...prev, ext]
    );
  };

  const handleSituationSelect = (type: "vide" | "habite") => {
    setSituationType(type);
    setShowFormulaModal(true);
  };

  const handleFormulaSelect = (formulaId: string, priceNum: number, maxPhotos: number) => {
    setOrderConfig({
      formulaId,
      formulaPrice: priceNum,
      propertyType: propertyType || undefined,
      roomCount: roomCount || undefined,
      exteriors: selectedExteriors,
      profile: profile || undefined,
      isHabite: situationType === "habite",
    });
    setShowFormulaModal(false);
    navigation.navigate("Upload");
  };

  const formulas = situationType === "vide" ? FORMULAS_VIDE : FORMULAS_HABITE;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Hero */}
      <View style={styles.hero}>
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
    <Text style={styles.heroTitle}>Expertise réelle.{"\n"}Résultats concrets.</Text>
    <Image source={require("../../assets/logo.png")} style={{ width: 100, height: 70 }} resizeMode="contain" />
  </View>
  <Text style={styles.heroSub}>
    Résultat sous 2 à 12h ou sous 72h suivant la formule.
  </Text>
</View>

        <View style={styles.content}>

          {/* Type de bien */}
          <Text style={styles.sectionLabel}>SÉLECTIONNER VOTRE TYPE DE BIEN</Text>
          <View style={styles.typeRow}>
            {PROPERTY_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeBtn, propertyType === type && styles.typeBtnActive]}
                onPress={() => setPropertyType(type)}
              >
                <Text style={styles.typeIcon}>{type === "Maison" ? "🏡" : "🏢"}</Text>
                <Text style={[styles.typeBtnText, propertyType === type && styles.typeBtnTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Nombre de pièces */}
          <Text style={styles.sectionLabel}>NOMBRE DE PIÈCES</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => { setShowRoomPicker(!showRoomPicker); setShowProfilePicker(false); }}
          >
            <Text style={[styles.pickerText, !roomCount && styles.pickerPlaceholder]}>
              {roomCount || "Sélectionner..."}
            </Text>
            <Text style={styles.pickerArrow}>{showRoomPicker ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showRoomPicker && (
            <View style={styles.dropdownList}>
              {ROOM_COUNTS.map((room) => (
                <TouchableOpacity
                  key={room}
                  style={[styles.dropdownItem, roomCount === room && styles.dropdownItemActive]}
                  onPress={() => { setRoomCount(room); setShowRoomPicker(false); }}
                >
                  <Text style={[styles.dropdownText, roomCount === room && styles.dropdownTextActive]}>
                    {room}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Les extérieurs */}
          <Text style={styles.sectionLabel}>LES EXTÉRIEURS</Text>
          <View style={styles.extRow}>
            {EXTERIORS.map((ext) => (
              <TouchableOpacity
                key={ext}
                style={[styles.extBtn, selectedExteriors.includes(ext) && styles.extBtnActive]}
                onPress={() => toggleExterior(ext)}
              >
                <Text style={[styles.extText, selectedExteriors.includes(ext) && styles.extTextActive]}>
                  {ext === "Balcon" ? "🏗️" : ext === "Terrasse" ? "☀️" : "🌿"} {ext}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Vous êtes */}
          <Text style={styles.sectionLabel}>VOUS ÊTES</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => { setShowProfilePicker(!showProfilePicker); setShowRoomPicker(false); }}
          >
            <Text style={[styles.pickerText, !profile && styles.pickerPlaceholder]}>
              {profile || "Sélectionner..."}
            </Text>
            <Text style={styles.pickerArrow}>{showProfilePicker ? "▲" : "▼"}</Text>
          </TouchableOpacity>
          {showProfilePicker && (
            <View style={styles.dropdownList}>
              {PROFILES.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.dropdownItem, profile === p && styles.dropdownItemActive]}
                  onPress={() => { setProfile(p); setShowProfilePicker(false); }}
                >
                  <Text style={[styles.dropdownText, profile === p && styles.dropdownTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Votre situation */}
          <Text style={styles.sectionLabel}>VOTRE SITUATION</Text>

          <TouchableOpacity
            style={[styles.situationCard, styles.situationDark]}
            onPress={() => handleSituationSelect("vide")}
          >
            <Text style={styles.situationEmoji}>🏠</Text>
            <Text style={styles.situationTitleDark}>Bien vide</Text>
            <Text style={styles.situationArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.situationCard, styles.situationLight]}
            onPress={() => handleSituationSelect("habite")}
          >
            <Text style={styles.situationEmoji}>🛋️</Text>
            <Text style={styles.situationTitleLight}>Bien habité</Text>
            <Text style={[styles.situationArrow, { color: COLORS.gold }]}>→</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Modal sélection formule */}
      {showFormulaModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {situationType === "vide" ? "Bien vide — Choisissez votre formule" : "Bien habité — Choisissez votre formule"}
            </Text>
            <Text style={styles.modalSub}>
              {situationType === "vide"
                ? "Projection virtuelle · Résultat immédiat"
                : "Expertise humaine · Résultat sous 48-72h"}
            </Text>

            {formulas.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.formulaCard, f.popular && styles.formulaCardFeatured]}
                onPress={() => handleFormulaSelect(f.id, f.priceNum, f.maxPhotos)}
              >
                {f.popular && (
                  <View style={styles.formulaBadge}>
                    <Text style={styles.formulaBadgeText}>Populaire</Text>
                  </View>
                )}
                <View style={styles.formulaRow}>
                  <Text style={styles.formulaName}>{f.name}</Text>
                  <Text style={styles.formulaPrice}>{f.price}</Text>
                </View>
                <Text style={styles.formulaDesc}>{f.desc}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowFormulaModal(false)}
            >
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  hero: { backgroundColor: COLORS.dark, padding: 18, paddingBottom: 22 },
  heroTitle: { fontSize: 24, fontWeight: "500", color: "#fff", lineHeight: 32, marginBottom: 6 },
  heroSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 17 },
  content: { padding: 16 },

  sectionLabel: {
    fontSize: 9, fontWeight: "600", color: COLORS.gray,
    letterSpacing: 0.7, textTransform: "uppercase",
    marginBottom: 10, marginTop: 6,
  },

  typeRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  typeBtn: {
    flex: 1, borderRadius: 13, padding: 16,
    backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.border,
    alignItems: "center", gap: 6,
  },
  typeBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  typeIcon: { fontSize: 26 },
  typeBtnText: { fontSize: 13, fontWeight: "500", color: COLORS.grayDark },
  typeBtnTextActive: { color: COLORS.goldDark },

  picker: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 13, flexDirection: "row",
    alignItems: "center", justifyContent: "space-between", marginBottom: 6,
  },
  pickerText: { fontSize: 13, color: COLORS.dark },
  pickerPlaceholder: { color: COLORS.gray },
  pickerArrow: { fontSize: 10, color: COLORS.gray },
  dropdownList: {
    backgroundColor: COLORS.white, borderRadius: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
    marginBottom: 14, overflow: "hidden",
  },
  dropdownItem: { padding: 13, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  dropdownItemActive: { backgroundColor: COLORS.goldLight },
  dropdownText: { fontSize: 13, color: COLORS.dark },
  dropdownTextActive: { color: COLORS.goldDark, fontWeight: "500" },

  extRow: { flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  extBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 20, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  extBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  extText: { fontSize: 12, color: COLORS.grayDark },
  extTextActive: { color: COLORS.goldDark, fontWeight: "500" },

  situationCard: {
    borderRadius: 14, padding: 18, marginBottom: 10,
    flexDirection: "row", alignItems: "center", gap: 14,
  },
  situationDark: { backgroundColor: COLORS.dark },
  situationLight: { backgroundColor: COLORS.white, borderWidth: 0.5, borderColor: COLORS.border },
  situationEmoji: { fontSize: 28 },
  situationTitleDark: { fontSize: 15, fontWeight: "500", color: "#fff", flex: 1 },
  situationTitleLight: { fontSize: 15, fontWeight: "500", color: COLORS.dark, flex: 1 },
  situationArrow: { fontSize: 18, color: COLORS.gold },

  modalOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.white, borderRadius: 20,
    padding: 20, margin: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: COLORS.dark, marginBottom: 4 },
  modalSub: { fontSize: 11, color: COLORS.gray, marginBottom: 16 },

  formulaCard: {
    backgroundColor: COLORS.offWhite, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, marginBottom: 10, position: "relative",
  },
  formulaCardFeatured: { borderWidth: 1.5, borderColor: COLORS.gold, backgroundColor: COLORS.goldLight },
  formulaBadge: { position: "absolute", top: 8, right: 8, backgroundColor: COLORS.gold, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  formulaBadgeText: { fontSize: 8, fontWeight: "600", color: "#fff" },
  formulaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  formulaName: { fontSize: 14, fontWeight: "600", color: COLORS.dark },
  formulaPrice: { fontSize: 18, fontWeight: "500", color: COLORS.gold },
  formulaDesc: { fontSize: 10, color: COLORS.gray },

  modalCancel: { alignItems: "center", padding: 14 },
  modalCancelText: { fontSize: 12, color: COLORS.gray },
});