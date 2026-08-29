import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button, SectionLabel } from "../components/UI";
import {
  COLORS, ROOM_TYPES,
  CHAMBRE_SUBTYPES,
} from "../constants";
import { useAppStore } from "../store";

interface PhotoConfig {
  uri: string;
  roomTypeId: string;
  roomSubTypeId?: string;
  angles: string[];
  label: string;
  roomSize?: string;
}

type ConfigStep = "room" | "subtype" | "size" | "multivue";

const MULTI_VUE_ANGLES = [
  { id: "entree", label: "Entrée", icon: "🚪" },
  { id: "gauche", label: "Gauche", icon: "⬅️" },
  { id: "droite", label: "Droite", icon: "➡️" },
  { id: "fenetre", label: "Fenêtre", icon: "🪟" },
];

const PHOTO_TIPS_TODO = [
  { icon: "☀️", text: "Lumière naturelle (volets ouverts)" },
  { icon: "📐", text: "Angle droit (téléphone bien droit)" },
  { icon: "✨", text: "Pièce propre et rangée" },
  { icon: "🪑", text: "Surfaces dégagées (tables, meubles...)" },
  { icon: "🛋️", text: "Canapé et chaises sans vêtements ni plaids" },
];

const PHOTO_TIPS_AVOID = [
  "Photos floues",
  "Grand angle / déformation",
  "Pièces sombres",
  "Objets au sol ou en désordre",
  "Trop d'objets visibles",
];

export const UploadScreen = () => {
  const navigation = useNavigation<any>();
  const { orderConfig, setOrderConfig } = useAppStore();
  const isHabite = orderConfig?.isHabite || false;

  const maxPhotos = orderConfig?.formulaId === "decouverte" ? 2
    : orderConfig?.formulaId === "essentielle" ? 5
    : orderConfig?.formulaId === "performance" ? 8
    : orderConfig?.formulaId === "essentiel_habite" ? 2
    : orderConfig?.formulaId === "premium_habite" ? 5
    : 6;

  const formulaName = orderConfig?.formulaId === "decouverte" ? "Découverte · 2 photos max"
    : orderConfig?.formulaId === "essentielle" ? "Essentielle · 5 photos max"
    : orderConfig?.formulaId === "performance" ? "Performance · 8 photos max"
    : orderConfig?.formulaId === "essentiel_habite" ? "Essentiel · 2 pièces max"
    : orderConfig?.formulaId === "premium_habite" ? "Premium · 5 pièces max"
    : "Formule";

  const [photos, setPhotos] = useState<PhotoConfig[]>([]);
  const [configStep, setConfigStep] = useState<ConfigStep | null>(null);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState("salon");
  const [selSubType, setSelSubType] = useState<string | undefined>(undefined);
  const [selAngles, setSelAngles] = useState<string[]>(["entree"]);
  const [sharedSeed, setSharedSeed] = useState<number | null>(null);
  const [selSize, setSelSize] = useState<string>("medium");

  const showChambreSub = selRoom === "chambre";
  const showMultiVue = selRoom === "salon" || selRoom === "chambre";

  const pickPhoto = async () => {
    if (photos.length >= maxPhotos) {
      Alert.alert("Limite atteinte", `Maximum ${maxPhotos} photos pour cette formule.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Autorisez l'accès à vos photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setPendingUri(result.assets[0].uri);
      setSelRoom("salon");
      setSelSubType(undefined);
      setSelAngles(["entree"]);
      setConfigStep("room");
    }
  };

  const toggleAngle = (id: string) => {
    setSelAngles((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const confirmPhoto = () => {
    if (!pendingUri) return;

    const seed = sharedSeed || Math.floor(Math.random() * 2147483647);
    if (!sharedSeed && showMultiVue && selAngles.length > 1) {
      setSharedSeed(seed);
    }

    const roomObj = ROOM_TYPES.find((r) => r.id === selRoom) as any;
    const subObj = CHAMBRE_SUBTYPES.find((s) => s.id === selSubType) as any;
    const roomLabel = subObj ? `${subObj.label}` : roomObj?.label || "Pièce";
    const label = `${roomLabel}${showMultiVue && selAngles.length > 1 ? " · Multi-vue" : ""}`;
    
    const newPhoto: PhotoConfig = {
      uri: pendingUri,
      roomTypeId: selRoom,
      roomSubTypeId: selSubType,
      angles: showMultiVue ? selAngles : ["entree"],
      roomSize: selSize,
      label,
    };

    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    setOrderConfig({
      photos: newPhotos.map((p) => ({
        uri: p.uri,
        roomLabel: p.label,
        roomTypeId: p.roomTypeId,
        roomSubTypeId: p.roomSubTypeId,
        angles: p.angles,
        seed,
      })),
    });
    setConfigStep(null);
    setPendingUri(null);
  };

  const removePhoto = (index: number) => {
    Alert.alert("Supprimer", "Supprimer cette photo ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: () => setPhotos((prev) => prev.filter((_, i) => i !== index)) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes photos</Text>
        <Text style={styles.headerSub}>{formulaName}</Text>
      </View>

      {configStep === null ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {isHabite && photos.length === 0 && (
              <View style={styles.guideCard}>
                <Text style={styles.guideTitle}>📸 Prenez de bonnes photos</Text>
                <Text style={styles.guideSub}>Pour un résultat optimal</Text>

                <Text style={styles.guideSection}>✅ À faire</Text>
                {PHOTO_TIPS_TODO.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <Text style={styles.tipText}>{tip.text}</Text>
                  </View>
                ))}

                <Text style={[styles.guideSection, { color: "#c0392b", marginTop: 12 }]}>✗ À éviter</Text>
                {PHOTO_TIPS_AVOID.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={{ fontSize: 12, color: "#c0392b" }}>✗</Text>
                    <Text style={[styles.tipText, { color: COLORS.grayDark }]}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            <SectionLabel text={`PHOTOS (${photos.length}/${maxPhotos})`} />

            {photos.map((photo, index) => {
              const roomObj = ROOM_TYPES.find((r) => r.id === photo.roomTypeId) as any;
              return (
                <View key={index} style={styles.photoItem}>
                  <View style={styles.photoThumb}>
                    <Text style={{ fontSize: 20 }}>
                      {roomObj?.icon || "🖼️"}
                    </Text>
                  </View>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoNum}>Photo #{index + 1}</Text>
                    <View style={styles.photoBadges}>
                      <View style={styles.photoBadge}>
                        <Text style={styles.photoBadgeText}>
                          {roomObj?.label}
                        </Text>
                      </View>
                      {photo.angles.length > 1 && (
                        <View style={[styles.photoBadge, { backgroundColor: "#f0f0f0" }]}>
                          <Text style={styles.photoBadgeText}>Multi-vue ×{photo.angles.length}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removePhoto(index)} style={styles.deleteBtn}>
                    <Text style={{ fontSize: 11, color: "#c0392b" }}>✕</Text>
                  </TouchableOpacity>
                </View>
              );
            })}

            {photos.length < maxPhotos && (
              <TouchableOpacity style={styles.addBtn} onPress={pickPhoto}>
                <Text style={styles.addBtnPlus}>+</Text>
                <View>
                  <Text style={styles.addBtnTitle}>Ajouter une photo</Text>
                  <Text style={styles.addBtnSub}>Multi-vue configurable</Text>
                </View>
              </TouchableOpacity>
            )}

            {photos.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>📸</Text>
                <Text style={styles.emptyTitle}>Aucune photo</Text>
                <Text style={styles.emptySub}>Chaque photo sera configurée individuellement.</Text>
              </View>
            )}

            {photos.length > 0 && (
              <Button
                label={`Procéder au paiement — ${orderConfig?.formulaPrice?.toFixed(2).replace(".", ",")}€`}
                onPress={() => navigation.navigate("Payment")}
              />
            )}
          </View>
        </ScrollView>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.configProgress}>
              {(["room", "subtype", "size", "multivue"] as ConfigStep[])
                .filter((s) => {
                  if (s === "subtype" && !showChambreSub) return false;
                  if (s === "multivue" && !showMultiVue) return false;
                  return true;
                })
                .map((s) => (
                  <View key={s} style={[styles.configDot, configStep === s && styles.configDotActive]} />
                ))}
            </View>

            {configStep === "room" && (
              <>
                <Text style={styles.configTitle}>Type de pièce</Text>
                <View style={styles.roomGrid}>
                  {ROOM_TYPES.map((room) => (
                    <TouchableOpacity
                      key={room.id}
                      style={[styles.roomCard, selRoom === room.id && styles.roomCardActive]}
                      onPress={() => { setSelRoom(room.id); setSelSubType(undefined); setSelAngles(["entree"]); }}
                    >
                      <Text style={styles.roomIcon}>{(room as any).icon}</Text>
                      <Text style={[styles.roomLabel, selRoom === room.id && styles.roomLabelActive]}>
                        {(room as any).label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Button
                  label="Suivant →"
                  onPress={() => {
                    if (showChambreSub) setConfigStep("subtype");
                    else setConfigStep("size");
                  }}
                />
              </>
            )}

            {configStep === "subtype" && (
              <>
                <Text style={styles.configTitle}>Type de chambre</Text>
                <View style={styles.subTypeGrid}>
                  {CHAMBRE_SUBTYPES.map((sub) => (
                    <TouchableOpacity
                      key={sub.id}
                      style={[styles.subCard, selSubType === sub.id && styles.subCardActive]}
                      onPress={() => setSelSubType(sub.id)}
                    >
                      <Text style={{ fontSize: 22, marginBottom: 4 }}>{(sub as any).icon}</Text>
                      <Text style={[styles.subLabel, selSubType === sub.id && styles.subLabelActive]}>{(sub as any).label}</Text>
                      <Text style={styles.subAge}>{(sub as any).ageRange}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep("room")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button label="Suivant →" onPress={() => setConfigStep("size")} />
                  </View>
                </View>
              </>
            )}

            {configStep === "size" && (
              <>
                <Text style={styles.configTitle}>Surface</Text>
                <Text style={styles.configSub}>Aide l'IA à adapter le mobilier</Text>
                <View style={styles.sizeGrid}>
                  {[
                    { id: "small", label: "Petite", detail: "< 15 m²", icon: "▪️" },
                    { id: "medium", label: "Moyenne", detail: "15-30 m²", icon: "🔲" },
                    { id: "large", label: "Grande", detail: "> 30 m²", icon: "⬛" },
                  ].map((size) => (
                    <TouchableOpacity
                      key={size.id}
                      style={[styles.sizeCard, selSize === size.id && styles.sizeCardActive]}
                      onPress={() => setSelSize(size.id)}
                    >
                      <Text style={{ fontSize: 28, marginBottom: 6 }}>{size.icon}</Text>
                      <Text style={[styles.sizeLabel, selSize === size.id && styles.sizeLabelActive]}>
                        {size.label}
                      </Text>
                      <Text style={styles.sizeDetail}>{size.detail}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.navRow}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setConfigStep(showChambreSub ? "subtype" : "room")}
                  >
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button
                      label="Suivant →"
                      onPress={() => {
                        if (showMultiVue) setConfigStep("multivue");
                        else confirmPhoto();
                      }}
                    />
                  </View>
                </View>
              </>
            )}

            {configStep === "multivue" && (
              <>
                <Text style={styles.configTitle}>Angles de vue</Text>
                <Text style={styles.configSub}>Sélectionnez les angles</Text>
                <View style={styles.multiVueNote}>
                  <Text style={styles.multiVueNoteText}>
                    ℹ️ Chaque angle compte pour une photo
                  </Text>
                </View>
                <View style={styles.angleGrid}>
                  {MULTI_VUE_ANGLES.map((angle) => {
                    const isSelected = selAngles.includes(angle.id);
                    return (
                      <TouchableOpacity
                        key={angle.id}
                        style={[styles.angleCard, isSelected && styles.angleCardActive]}
                        onPress={() => toggleAngle(angle.id)}
                      >
                        <Text style={{ fontSize: 24, marginBottom: 6 }}>{angle.icon}</Text>
                        {isSelected && (
                          <View style={styles.angleCheck}>
                            <Text style={{ fontSize: 8, color: "#fff", fontWeight: "700" }}>✓</Text>
                          </View>
                        )}
                        <Text style={[styles.angleLabel, isSelected && styles.angleLabelActive]}>
                          {angle.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep("size")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button label="Confirmer →" onPress={confirmPhoto} />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity
              style={styles.cancelConfig}
              onPress={() => { setConfigStep(null); setPendingUri(null); }}
            >
              <Text style={styles.cancelConfigText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: "500", color: "#fff", marginBottom: 2 },
  headerSub: { fontSize: 10, color: "rgba(255,255,255,0.4)" },
  content: { padding: 16 },
  sizeGrid: { flexDirection: "row", gap: 8, marginBottom: 16 },
  sizeCard: { flex: 1, borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center" },
  sizeCardActive: { borderColor: COLORS.gold, backgroundColor: "#fdf8f1" },
  sizeLabel: { fontSize: 12, fontWeight: "500", color: COLORS.dark, marginBottom: 2 },
  sizeLabelActive: { color: COLORS.goldDark },
  sizeDetail: { fontSize: 9, color: COLORS.gray, textAlign: "center" },
  guideCard: { backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, padding: 16, marginBottom: 16 },
  guideTitle: { fontSize: 14, fontWeight: "700", color: COLORS.dark, marginBottom: 4 },
  guideSub: { fontSize: 11, color: COLORS.gray, marginBottom: 14 },
  guideSection: { fontSize: 12, fontWeight: "700", color: "#2d6a32", marginBottom: 8 },
  tipRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 6 },
  tipIcon: { fontSize: 14, width: 20 },
  tipText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },
  photoItem: { backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 0.5, borderColor: COLORS.border, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 10 },
  photoThumb: { width: 46, height: 46, borderRadius: 9, backgroundColor: COLORS.beige, alignItems: "center", justifyContent: "center" },
  photoInfo: { flex: 1 },
  photoNum: { fontSize: 10, fontWeight: "500", color: COLORS.dark, marginBottom: 4 },
  photoBadges: { flexDirection: "row", gap: 5, flexWrap: "wrap" },
  photoBadge: { backgroundColor: COLORS.offWhite, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 0.5, borderColor: COLORS.border },
  photoBadgeText: { fontSize: 8, color: COLORS.grayDark },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff0f0", alignItems: "center", justifyContent: "center" },
  addBtn: { borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.gold, borderRadius: 13, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: COLORS.goldLight, marginBottom: 12 },
  addBtnPlus: { fontSize: 28, color: COLORS.gold, fontWeight: "300" },
  addBtnTitle: { fontSize: 13, fontWeight: "500", color: COLORS.goldDark },
  addBtnSub: { fontSize: 10, color: COLORS.gold },
  emptyState: { alignItems: "center", padding: 28, backgroundColor: COLORS.white, borderRadius: 13, borderWidth: 0.5, borderColor: COLORS.border, marginBottom: 12 },
  emptyTitle: { fontSize: 14, fontWeight: "500", color: COLORS.dark, marginBottom: 6 },
  emptySub: { fontSize: 11, color: COLORS.gray, textAlign: "center", lineHeight: 17 },
  configProgress: { flexDirection: "row", gap: 6, marginBottom: 20, justifyContent: "center" },
  configDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.beige },
  configDotActive: { backgroundColor: COLORS.gold, width: 24 },
  configTitle: { fontSize: 20, fontWeight: "500", color: COLORS.dark, marginBottom: 6 },
  configSub: { fontSize: 12, color: COLORS.gray, marginBottom: 16, lineHeight: 18 },
  roomGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  roomCard: { width: "30.5%", borderRadius: 12, padding: 10, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center" },
  roomCardActive: { borderColor: COLORS.gold, backgroundColor: "#fdf8f1" },
  roomIcon: { fontSize: 22, marginBottom: 4 },
  roomLabel: { fontSize: 9, color: COLORS.grayDark, textAlign: "center" },
  roomLabelActive: { color: COLORS.goldDark, fontWeight: "600" },
  subTypeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  subCard: { width: "47%", borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center" },
  subCardActive: { borderColor: COLORS.gold, backgroundColor: "#fff8ed" },
  subLabel: { fontSize: 11, color: COLORS.grayDark, fontWeight: "500", marginBottom: 2 },
  subLabelActive: { color: COLORS.goldDark },
  subAge: { fontSize: 9, color: COLORS.gold },
  angleGrid: { flexDirection: "row", gap: 8, marginBottom: 12 },
  angleCard: { flex: 1, borderRadius: 12, padding: 14, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center", position: "relative" },
  angleCardActive: { borderColor: COLORS.gold, backgroundColor: "#fdf8f1" },
  angleCheck: { position: "absolute", top: 6, right: 6, width: 16, height: 16, backgroundColor: COLORS.gold, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  angleLabel: { fontSize: 9, color: COLORS.grayDark, textAlign: "center" },
  angleLabelActive: { color: COLORS.goldDark, fontWeight: "500" },
  multiVueNote: { backgroundColor: COLORS.goldLight, borderRadius: 10, padding: 10, marginBottom: 12, borderWidth: 0.5, borderColor: COLORS.goldMid },
  multiVueNoteText: { fontSize: 10, color: COLORS.goldDark, lineHeight: 15 },
  navRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  backBtn: { paddingVertical: 13, paddingHorizontal: 14, borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border },
  backBtnText: { fontSize: 12, color: COLORS.gray },
  cancelConfig: { alignItems: "center", padding: 12, marginBottom: 16 },
  cancelConfigText: { fontSize: 12, color: COLORS.gray },
});