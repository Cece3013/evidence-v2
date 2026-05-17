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
  COLORS, ROOM_TYPES, DECO_STYLES,
  CHAMBRE_SUBTYPES, MULTI_VUE_ANGLES,
} from "../constants";
import { useAppStore } from "../store";

interface PhotoConfig {
  uri: string;
  roomTypeId: string;
  roomSubTypeId?: string;
  decoStyleId?: string;
  angles: string[];
  label: string;
  roomSize?: string;
}

type ConfigStep = "room" | "subtype" | "size" | "multivue" | "style";

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

  const maxPhotos = orderConfig?.formulaId === "essentiel" ? 6
    : orderConfig?.formulaId === "essentiel_plus" ? 15
    : orderConfig?.formulaId === "premium" ? 3 : 6;

  const formulaName = orderConfig?.formulaId === "essentiel" ? "Essentiel · 6 photos max"
    : orderConfig?.formulaId === "essentiel_plus" ? "Essentiel+ · 15 photos max"
    : orderConfig?.formulaId === "premium" ? "Premium · 3 pièces max"
    : "Premium+ · 6 pièces max";

  const [photos, setPhotos] = useState<PhotoConfig[]>([]);
  const [configStep, setConfigStep] = useState<ConfigStep | null>(null);
  const [pendingUri, setPendingUri] = useState<string | null>(null);
  const [selRoom, setSelRoom] = useState("salon");
  const [selSubType, setSelSubType] = useState<string | undefined>(undefined);
  const [selStyle, setSelStyle] = useState("neutral");
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
      setSelStyle("neutral");
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

    // Pour multi-vue : utiliser le même seed pour cohérence
    const seed = sharedSeed || Math.floor(Math.random() * 2147483647);
    if (!sharedSeed && showMultiVue && selAngles.length > 1) {
      setSharedSeed(seed);
    }

    const room = ROOM_TYPES.find((r) => r.id === selRoom);
    const sub = CHAMBRE_SUBTYPES.find((s) => s.id === selSubType);
    const style = DECO_STYLES.find((s) => s.id === selStyle);
    const roomLabel = sub ? `${sub.label}` : room?.label || "Pièce";
    const label = `${roomLabel}${showMultiVue && selAngles.length > 1 ? " · Multi-vue" : ""}`;
    const newPhoto: PhotoConfig = {
      uri: pendingUri,
      roomTypeId: selRoom,
      roomSubTypeId: selSubType,
      decoStyleId: isHabite ? undefined : selStyle,
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
        decoStyleId: p.decoStyleId,
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

            {/* Guide photo pour bien habité */}
            {isHabite && photos.length === 0 && (
              <View style={styles.guideCard}>
                <Text style={styles.guideTitle}>📸 Prenez de bonnes photos en 10 secondes</Text>
                <Text style={styles.guideSub}>Pour un résultat optimal, respectez ces règles simples</Text>

                <Text style={styles.guideSection}>✅ À faire</Text>
                {PHOTO_TIPS_TODO.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={styles.tipIcon}>{tip.icon}</Text>
                    <Text style={styles.tipText}>{tip.text}</Text>
                  </View>
                ))}

                <Text style={[styles.guideSection, { color: "#c0392b", marginTop: 12 }]}>✗ À éviter absolument</Text>
                {PHOTO_TIPS_AVOID.map((tip, i) => (
                  <View key={i} style={styles.tipRow}>
                    <Text style={{ fontSize: 12, color: "#c0392b" }}>✗</Text>
                    <Text style={[styles.tipText, { color: COLORS.grayDark }]}>{tip}</Text>
                  </View>
                ))}

                <View style={styles.objectifBlock}>
                  <Text style={styles.objectifTitle}>🎯 Objectif</Text>
                  <Text style={styles.objectifText}>Une photo claire, droite et épurée</Text>
                  <Text style={styles.objectifText}>Pour valoriser votre bien au maximum</Text>
                  <Text style={[styles.objectifText, { fontWeight: "600", marginTop: 6 }]}>
                    Des photos propres = un résultat plus réaliste = une vente plus rapide
                  </Text>
                </View>
              </View>
            )}

            <SectionLabel text={`PHOTOS AJOUTÉES (${photos.length}/${maxPhotos})`} />

            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <View style={styles.photoThumb}>
                  <Text style={{ fontSize: 20 }}>
                    {ROOM_TYPES.find((r) => r.id === photo.roomTypeId)?.icon || "🖼️"}
                  </Text>
                </View>
                <View style={styles.photoInfo}>
                  <Text style={styles.photoNum}>Photo #{index + 1}</Text>
                  <View style={styles.photoBadges}>
                    <View style={styles.photoBadge}>
                      <Text style={styles.photoBadgeText}>
                        {ROOM_TYPES.find((r) => r.id === photo.roomTypeId)?.label}
                        {photo.roomSubTypeId && ` · ${CHAMBRE_SUBTYPES.find((s) => s.id === photo.roomSubTypeId)?.label}`}
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
            ))}

            {photos.length < maxPhotos && (
              <TouchableOpacity style={styles.addBtn} onPress={pickPhoto}>
                <Text style={styles.addBtnPlus}>+</Text>
                <View>
                  <Text style={styles.addBtnTitle}>Ajouter une photo</Text>
                  <Text style={styles.addBtnSub}>
                    {isHabite ? "Pièce · Multi-vue configurables" : "Pièce · Style · Multi-vue configurables"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}

            {photos.length === 0 && !isHabite && (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 36, marginBottom: 10 }}>📸</Text>
                <Text style={styles.emptyTitle}>Aucune photo ajoutée</Text>
                <Text style={styles.emptySub}>
                  Chaque photo sera configurée individuellement.
                </Text>
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
        /* Configuration d'une photo */
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.configProgress}>
              {(["room", "subtype", "multivue", "style"] as ConfigStep[])
                .filter((s) => {
                  if (s === "subtype" && !showChambreSub) return false;
                  if (s === "multivue" && !showMultiVue) return false;
                  if (s === "style" && isHabite) return false;
                  return true;
                })
                .map((s) => (
                  <View key={s} style={[styles.configDot, configStep === s && styles.configDotActive]} />
                ))}
            </View>

            {/* Étape pièce */}
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
                      <Text style={styles.roomIcon}>{room.icon}</Text>
                      <Text style={[styles.roomLabel, selRoom === room.id && styles.roomLabelActive]}>
                        {room.label}
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

            {/* Étape sous-type chambre */}
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
                      <Text style={{ fontSize: 22, marginBottom: 4 }}>{sub.icon}</Text>
                      <Text style={[styles.subLabel, selSubType === sub.id && styles.subLabelActive]}>{sub.label}</Text>
                      <Text style={styles.subAge}>{sub.ageRange}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep("room")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button label="Suivant →" onPress={() => setConfigStep("size")}
                     />
                  </View>
                </View>
              </>
            )}
{/* Étape surface */}
{configStep === "size" && (
  <>
    <Text style={styles.configTitle}>Surface approximative</Text>
    <Text style={styles.configSub}>
      Cette information aide l'IA à adapter le mobilier à votre espace.
    </Text>
    <View style={styles.sizeGrid}>
      {[
        { id: "small", label: "Petite", detail: "Moins de 15 m²", icon: "▪️" },
        { id: "medium", label: "Moyenne", detail: "15 à 30 m²", icon: "🔲" },
        { id: "large", label: "Grande", detail: "Plus de 30 m²", icon: "⬛" },
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
            {/* Étape multi-vue */}
            {configStep === "multivue" && (
              <>
                <Text style={styles.configTitle}>Angles de vue</Text>
                <Text style={styles.configSub}>
                  {isHabite
                    ? "Sélectionnez les angles souhaités."
                    : "Pour le multi-vue, le même aménagement sera rendu sous chaque angle sélectionné."}
                </Text>
                <View style={styles.multiVueNote}>
  <Text style={styles.multiVueNoteText}>
    ℹ️ Chaque angle sélectionné compte pour une photo de votre quota.
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
                {!isHabite && (
                  <View style={styles.multiVueNote}>
                    <Text style={styles.multiVueNoteText}>
                      ℹ️ Le même style et aménagement sera appliqué à tous les angles sélectionnés pour une cohérence parfaite.
                    </Text>
                  </View>
                )}
                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep(showChambreSub ? "subtype" : "room")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                   <Button label="Confirmer →" onPress={confirmPhoto} />
                  </View>
                </View>
              </>
            )}

            {/* Étape style — bien vide uniquement */}
            {configStep === "style" && !isHabite && (
              <>
                <Text style={styles.configTitle}>Style de décoration</Text>
                <View style={styles.styleGrid}>
                  {DECO_STYLES.map((style) => (
                    <TouchableOpacity
                      key={style.id}
                      style={[styles.styleCard, selStyle === style.id && styles.styleCardActive]}
                      onPress={() => setSelStyle(style.id)}
                    >
                      <View style={[styles.styleSwatch, { backgroundColor: style.swatchColor }]}>
                        <Text style={{ fontSize: 22 }}>{style.icon}</Text>
                      </View>
                      <Text style={[styles.styleLabel, selStyle === style.id && styles.styleLabelActive]}>
                        {style.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.recapCard}>
                  <Text style={styles.recapTitle}>Récapitulatif</Text>
                  <View style={styles.recapRow}>
                    <Text style={styles.recapKey}>Pièce</Text>
                    <Text style={styles.recapVal}>
                      {ROOM_TYPES.find((r) => r.id === selRoom)?.label}
                      {selSubType && ` · ${CHAMBRE_SUBTYPES.find((s) => s.id === selSubType)?.label}`}
                    </Text>
                  </View>
                  {showMultiVue && (
                    <View style={styles.recapRow}>
                      <Text style={styles.recapKey}>Angles</Text>
                      <Text style={styles.recapVal}>{selAngles.length === 1 ? "Vue unique" : `Multi-vue ×${selAngles.length}`}</Text>
                    </View>
                  )}
                  <View style={styles.recapRow}>
                    <Text style={styles.recapKey}>Style</Text>
                    <Text style={[styles.recapVal, { color: COLORS.gold }]}>
                      {DECO_STYLES.find((s) => s.id === selStyle)?.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.navRow}>
                  <TouchableOpacity style={styles.backBtn} onPress={() => setConfigStep(showMultiVue ? "multivue" : showChambreSub ? "subtype" : "room")}>
                    <Text style={styles.backBtnText}>← Retour</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <Button label="Confirmer ✓" onPress={confirmPhoto} />
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
sizeCard: {
  flex: 1, borderRadius: 12, padding: 14, borderWidth: 1.5,
  borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center",
},
sizeCardActive: { borderColor: COLORS.gold, backgroundColor: "#fdf8f1" },
sizeLabel: { fontSize: 12, fontWeight: "500", color: COLORS.dark, marginBottom: 2 },
sizeLabelActive: { color: COLORS.goldDark },
sizeDetail: { fontSize: 9, color: COLORS.gray, textAlign: "center" },

  guideCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 16, marginBottom: 16,
  },
  guideTitle: { fontSize: 14, fontWeight: "700", color: COLORS.dark, marginBottom: 4 },
  guideSub: { fontSize: 11, color: COLORS.gray, marginBottom: 14 },
  guideSection: { fontSize: 12, fontWeight: "700", color: "#2d6a32", marginBottom: 8 },
  tipRow: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 6 },
  tipIcon: { fontSize: 14, width: 20 },
  tipText: { fontSize: 11, color: COLORS.grayDark, flex: 1, lineHeight: 16 },
  objectifBlock: {
    backgroundColor: COLORS.offWhite, borderRadius: 10,
    padding: 12, marginTop: 12,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  objectifTitle: { fontSize: 12, fontWeight: "700", color: COLORS.dark, marginBottom: 6 },
  objectifText: { fontSize: 11, color: COLORS.grayDark, lineHeight: 17 },

  photoItem: {
    backgroundColor: COLORS.white, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 12, marginBottom: 8,
    flexDirection: "row", alignItems: "center", gap: 10,
  },
  photoThumb: { width: 46, height: 46, borderRadius: 9, backgroundColor: COLORS.beige, alignItems: "center", justifyContent: "center" },
  photoInfo: { flex: 1 },
  photoNum: { fontSize: 10, fontWeight: "500", color: COLORS.dark, marginBottom: 4 },
  photoBadges: { flexDirection: "row", gap: 5, flexWrap: "wrap" },
  photoBadge: { backgroundColor: COLORS.offWhite, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 0.5, borderColor: COLORS.border },
  photoBadgeGold: { backgroundColor: COLORS.goldLight, borderColor: COLORS.goldMid },
  photoBadgeText: { fontSize: 8, color: COLORS.grayDark },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#fff0f0", alignItems: "center", justifyContent: "center" },

  addBtn: {
    borderWidth: 1.5, borderStyle: "dashed", borderColor: COLORS.gold,
    borderRadius: 13, padding: 16, flexDirection: "row",
    alignItems: "center", gap: 12, backgroundColor: COLORS.goldLight, marginBottom: 12,
  },
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

  styleGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  styleCard: { width: "47%", borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, overflow: "hidden" },
  styleCardActive: { borderColor: COLORS.gold },
  styleSwatch: { height: 60, width: "100%", alignItems: "center", justifyContent: "center" },
  styleLabel: { fontSize: 11, fontWeight: "500", color: COLORS.dark, padding: 8, paddingBottom: 8 },
  styleLabelActive: { color: COLORS.goldDark },

  recapCard: { backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border, padding: 14, marginBottom: 14 },
  recapTitle: { fontSize: 11, fontWeight: "500", color: COLORS.dark, marginBottom: 10 },
  recapRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#f0ece8" },
  recapKey: { fontSize: 10, color: COLORS.gray },
  recapVal: { fontSize: 10, fontWeight: "500", color: COLORS.dark },

  navRow: { flexDirection: "row", gap: 10, alignItems: "center", marginBottom: 8 },
  backBtn: { paddingVertical: 13, paddingHorizontal: 14, borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border },
  backBtnText: { fontSize: 12, color: COLORS.gray },

  cancelConfig: { alignItems: "center", padding: 12, marginBottom: 16 },
  cancelConfigText: { fontSize: 12, color: COLORS.gray },
});