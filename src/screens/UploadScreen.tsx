import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button, SectionLabel } from "../components/UI";
import { Icon } from "../components/Icon";
import { COLORS, ROOM_TYPES } from "../constants";
import { useAppStore } from "../store";

interface PhotoConfig {
  uri: string;
  roomTypeId: string;
  label: string;
  roomSize?: string;
  commentaire?: string;
}

type ConfigStep = "room" | "size" | "comment";

const PHOTO_TIPS_TODO = [
  { icon: "Sun", text: "Lumière naturelle (volets ouverts)" },
  { icon: "Frame", text: "Angle droit (téléphone bien droit)" },
  { icon: "Sparkles", text: "Pièce propre et rangée" },
  { icon: "LayoutGrid", text: "Surfaces dégagées (tables, meubles...)" },
  { icon: "Sofa", text: "Canapé et chaises sans vêtements ni plaids" },
];

const PHOTO_TIPS_AVOID = [
  "Photos floues",
  "Grand angle / déformation",
  "Pièces sombres",
  "Objets au sol ou en désordre",
  "Trop d'objets visibles",
];

const SIZES = [
  { id: "small", label: "Petite", detail: "moins de 15 m²", icon: "Minimize2" },
  { id: "medium", label: "Moyenne", detail: "15 à 30 m²", icon: "Square" },
  { id: "large", label: "Grande", detail: "plus de 30 m²", icon: "Maximize2" },
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
  const [selSize, setSelSize] = useState<string>("medium");
  const [comment, setComment] = useState("");

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
      setSelSize("medium");
      setComment("");
      setConfigStep("room");
    }
  };

  const confirmPhoto = () => {
    if (!pendingUri) return;

    const roomObj = ROOM_TYPES.find((r) => r.id === selRoom) as any;
    const label = roomObj?.label || "Pièce";

    const newPhoto: PhotoConfig = {
      uri: pendingUri,
      roomTypeId: selRoom,
      roomSize: selSize,
      commentaire: comment.trim() || undefined,
      label,
    };

    const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    setOrderConfig({
      photos: newPhotos.map((p) => ({
        uri: p.uri,
        roomLabel: p.label,
        roomTypeId: p.roomTypeId,
        roomSize: p.roomSize,
        commentaire: p.commentaire,
      })),
    });
    setConfigStep(null);
    setPendingUri(null);
    setComment("");
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
                <View style={styles.guideTitleRow}>
                  <Icon name="Camera" size={20} />
                  <Text style={styles.guideTitle}>Prenez de bonnes photos</Text>
                </View>
                <Text style={styles.guideSub}>Pour un résultat optimal</Text>

                <Text style={styles.guideSection}>À faire</Text>
                {PHOTO_TIPS_TODO.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Icon name={tip.icon} size={16} color={COLORS.gold} />
                    <Text style={styles.tipText}>{tip.text}</Text>
                  </View>
                ))}

                <Text style={[styles.guideSection, { color: "#c0392b", marginTop: 14 }]}>À éviter</Text>
                {PHOTO_TIPS_AVOID.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Icon name="X" size={16} color="#c0392b" />
                    <Text style={styles.tipText}>{tip}</Text>
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
                    <Icon name={roomObj?.icon || "Image"} size={22} />
                  </View>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoNum}>Photo {index + 1}</Text>
                    <View style={styles.photoBadges}>
                      <View style={styles.photoBadge}>
                        <Text style={styles.photoBadgeText}>{roomObj?.label}</Text>
                      </View>
                      {photo.commentaire && (
                        <View style={[styles.photoBadge, { backgroundColor: COLORS.goldLight, borderColor: COLORS.goldMid }]}>
                          <Text style={[styles.photoBadgeText, { color: COLORS.goldDark }]}>Note ajoutée</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => removePhoto(index)} style={styles.deleteBtn}>
                    <Icon name="X" size={14} color="#c0392b" />
                  </TouchableOpacity>
                </View>
              );
            })}

            {photos.length < maxPhotos && (
              <TouchableOpacity style={styles.addBtn} onPress={pickPhoto}>
                <Icon name="Plus" size={24} color={COLORS.gold} strokeWidth={1.5} />
                <View>
                  <Text style={styles.addBtnTitle}>Ajouter une photo</Text>
                  <Text style={styles.addBtnSub}>Une pièce par photo</Text>
                </View>
              </TouchableOpacity>
            )}

            {photos.length === 0 && (
              <View style={styles.emptyState}>
                <Icon name="ImagePlus" size={36} color={COLORS.beigeMid} strokeWidth={1.2} />
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
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.configProgress}>
              {(["room", "size", "comment"] as ConfigStep[]).map((s) => (
                <View key={s} style={[styles.configDot, configStep === s && styles.configDotActive]} />
              ))}
            </View>

            {configStep === "room" && (
              <>
                <Text style={styles.configTitle}>Type de pièce</Text>

                <View style={styles.helpBox}>
                  <Icon name="Info" size={17} color={COLORS.goldDark} />
                  <Text style={styles.helpText}>
                    Sélectionnez précisément ce que vous souhaitez voir aménagé.{"\n"}
                    <Text style={styles.helpBold}>Salon</Text> : coin salon uniquement.{"\n"}
                    <Text style={styles.helpBold}>Salon / Salle à manger</Text> : pour qu'une table à manger soit intégrée.{"\n"}
                    Chaque photo est traitée seule : les autres angles de la pièce ne sont pas visibles pour nous.
                  </Text>
                </View>

                <View style={styles.roomGrid}>
                  {ROOM_TYPES.map((room) => {
                    const active = selRoom === room.id;
                    return (
                      <TouchableOpacity
                        key={room.id}
                        style={[styles.roomCard, active && styles.roomCardActive]}
                        onPress={() => setSelRoom(room.id)}
                      >
                        <Icon
                          name={(room as any).icon}
                          size={24}
                          color={active ? COLORS.goldDark : COLORS.gray}
                        />
                        <Text style={[styles.roomLabel, active && styles.roomLabelActive]}>
                          {(room as any).label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Button label="Suivant →" onPress={() => setConfigStep("size")} />
              </>
            )}

            {configStep === "size" && (
              <>
                <Text style={styles.configTitle}>Surface</Text>
                <Text style={styles.configSub}>Aide à adapter le mobilier à votre espace</Text>
                <View style={styles.sizeGrid}>
                  {SIZES.map((size) => {
                    const active = selSize === size.id;
                    return (
                      <TouchableOpacity
                        key={size.id}
                        style={[styles.sizeCard, active && styles.sizeCardActive]}
                        onPress={() => setSelSize(size.id)}
                      >
                        <Icon
                          name={size.icon}
                          size={26}
                          color={active ? COLORS.goldDark : COLORS.gray}
                        />
                        <Text style={[styles.sizeLabel, active && styles.sizeLabelActive]}>
                          {size.label}
                        </Text>
                        <Text style={styles.sizeDetail}>{size.detail}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep("room")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button label="Suivant →" onPress={() => setConfigStep("comment")} />
                  </View>
                </View>
              </>
            )}

            {configStep === "comment" && (
              <>
                <Text style={styles.configTitle}>Une précision ?</Text>
                <Text style={styles.configSub}>
                  Facultatif — indiquez ici toute demande particulière concernant cette pièce.
                </Text>

                <TextInput
                  style={styles.commentInput}
                  placeholder="Exemple : cette pièce sert de bureau, merci de garder le meuble en bois, la porte à gauche donne sur la terrasse..."
                  placeholderTextColor={COLORS.gray}
                  value={comment}
                  onChangeText={setComment}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  maxLength={400}
                />
                <Text style={styles.charCount}>{comment.length} / 400</Text>

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
              onPress={() => { setConfigStep(null); setPendingUri(null); setComment(""); }}
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
  header: {
    backgroundColor: COLORS.offWhite, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 19, fontWeight: "600", color: COLORS.dark, marginBottom: 4 },
  headerSub: { fontSize: 12, color: COLORS.gray },
  content: { padding: 16 },

  guideCard: { backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 0.5, borderColor: COLORS.border, padding: 18, marginBottom: 16 },
  guideTitleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  guideTitle: { fontSize: 15, fontWeight: "600", color: COLORS.dark },
  guideSub: { fontSize: 12, color: COLORS.gray, marginBottom: 16 },
  guideSection: { fontSize: 11, fontWeight: "600", color: "#2d6a32", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.6 },
  tipRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  tipText: { fontSize: 12, color: COLORS.grayDark, flex: 1, lineHeight: 17 },

  photoItem: { backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", gap: 12 },
  photoThumb: { width: 46, height: 46, borderRadius: 12, backgroundColor: COLORS.goldLight, alignItems: "center", justifyContent: "center" },
  photoInfo: { flex: 1 },
  photoNum: { fontSize: 12, fontWeight: "500", color: COLORS.dark, marginBottom: 4 },
  photoBadges: { flexDirection: "row", gap: 5, flexWrap: "wrap" },
  photoBadge: { backgroundColor: COLORS.offWhite, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 3, borderWidth: 0.5, borderColor: COLORS.border },
  photoBadgeText: { fontSize: 10, color: COLORS.grayDark },
  deleteBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#fff0f0", alignItems: "center", justifyContent: "center" },

  addBtn: { borderWidth: 1.2, borderStyle: "dashed", borderColor: COLORS.goldMid, borderRadius: 16, padding: 18, flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: COLORS.goldLight, marginBottom: 12 },
  addBtnTitle: { fontSize: 14, fontWeight: "500", color: COLORS.goldDark },
  addBtnSub: { fontSize: 11, color: COLORS.gold, marginTop: 2 },

  emptyState: { alignItems: "center", padding: 32, backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 0.5, borderColor: COLORS.border, marginBottom: 12, gap: 10 },
  emptyTitle: { fontSize: 14, fontWeight: "500", color: COLORS.dark },
  emptySub: { fontSize: 12, color: COLORS.gray, textAlign: "center", lineHeight: 18 },

  configProgress: { flexDirection: "row", gap: 6, marginBottom: 24, justifyContent: "center" },
  configDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.beige },
  configDotActive: { backgroundColor: COLORS.gold, width: 26 },
  configTitle: { fontSize: 22, fontWeight: "500", color: COLORS.dark, marginBottom: 6 },
  configSub: { fontSize: 12.5, color: COLORS.gray, marginBottom: 20, lineHeight: 19 },

  helpBox: {
    backgroundColor: COLORS.goldLight, borderRadius: 14, padding: 14, marginBottom: 18,
    borderWidth: 0.5, borderColor: COLORS.goldMid,
    flexDirection: "row", gap: 11, alignItems: "flex-start",
  },
  helpText: { fontSize: 11.5, color: COLORS.goldDark, lineHeight: 18, flex: 1 },
  helpBold: { fontWeight: "700" },

  roomGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  roomCard: { width: "31.5%", borderRadius: 14, paddingVertical: 16, paddingHorizontal: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center", gap: 8 },
  roomCardActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight, borderWidth: 1.5 },
  roomLabel: { fontSize: 10, color: COLORS.grayDark, textAlign: "center", lineHeight: 14 },
  roomLabelActive: { color: COLORS.goldDark, fontWeight: "600" },

  sizeGrid: { flexDirection: "row", gap: 8, marginBottom: 20 },
  sizeCard: { flex: 1, borderRadius: 14, paddingVertical: 18, paddingHorizontal: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center", gap: 8 },
  sizeCardActive: { borderColor: COLORS.gold, backgroundColor: COLORS.goldLight, borderWidth: 1.5 },
  sizeLabel: { fontSize: 13, fontWeight: "500", color: COLORS.dark },
  sizeLabelActive: { color: COLORS.goldDark },
  sizeDetail: { fontSize: 10, color: COLORS.gray, textAlign: "center" },

  commentInput: {
    backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border,
    padding: 14, fontSize: 13, color: COLORS.dark, minHeight: 130, lineHeight: 19,
  },
  charCount: { fontSize: 11, color: COLORS.gray, textAlign: "right", marginTop: 6, marginBottom: 18 },

  navRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  backBtn: { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border },
  backBtnText: { fontSize: 13, color: COLORS.gray },
  cancelConfig: { alignItems: "center", padding: 14, marginBottom: 16 },
  cancelConfigText: { fontSize: 13, color: COLORS.gray },
});