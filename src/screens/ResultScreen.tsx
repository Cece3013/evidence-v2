import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Image, Linking,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionLabel } from "../components/UI";
import { Icon } from "../components/Icon";
import { COLORS, ROOM_TYPES } from "../constants";

const PRIORITE_CONFIG = {
  urgent:    { icon: "Zap",       label: "Urgent",    bg: "#fff5f5", border: "#f5d5d5", color: "#c0392b" },
  important: { icon: "Pin",       label: "Important", bg: "#fffbf0", border: COLORS.goldMid, color: "#b8892e" },
  optionnel: { icon: "Lightbulb", label: "Conseil",   bg: "#f2f8f2", border: "#cfe3d0", color: "#2d6a32" },
};

const CONSEILS = [
  { priorite: "urgent", texte: "Ouvrez tous les volets et allumez les lumières avant chaque visite.", impact: "Un logement vide paraît plus grand et plus accueillant quand il est lumineux." },
  { priorite: "important", texte: "Montrez ces projections aux visiteurs pendant la visite.", impact: "L'acheteur se projette difficilement dans un espace vide : les visuels comblent ce manque." },
  { priorite: "optionnel", texte: "Aérez le logement en amont et vérifiez la propreté des sols et vitrages.", impact: "Dans un bien vide, le moindre détail se remarque immédiatement." },
];

/** Convertit un identifiant de pièce en libellé lisible */
function pieceLabel(id: string) {
  const room = ROOM_TYPES.find((r) => r.id === id);
  return room?.label || id;
}

export const ResultScreen = () => {
  const route = useRoute<any>();
  const { photos = [], reference = "" } = route.params || {};

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeView, setActiveView] = useState<"avant" | "apres">("apres");

  if (!photos.length) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.emptyWrap}>
          <Icon name="ImageOff" size={40} color={COLORS.beigeMid} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>Aucune photo disponible</Text>
          <Text style={styles.emptySub}>
            Vos visuels apparaîtront ici dès qu'ils auront été validés par notre équipe.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const paire = photos[activeIndex];
  const imageUrl = activeView === "avant" ? paire.avant : paire.apres;
  const hasAvant = !!paire.avant;
  const label = pieceLabel(paire.piece);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vos projections</Text>
          <Text style={styles.headerSub}>
            {reference ? `${reference} · ` : ""}{photos.length} photo{photos.length > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Sélecteur de pièce */}
        {photos.length > 1 && (
          <View style={styles.selector}>
            {photos.map((p: any, i: number) => (
              <TouchableOpacity
                key={i}
                style={[styles.selectorBtn, activeIndex === i && styles.selectorBtnActive]}
                onPress={() => { setActiveIndex(i); setActiveView("apres"); }}
              >
                <Text style={[styles.selectorText, activeIndex === i && styles.selectorTextActive]}>
                  {pieceLabel(p.piece)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.visual}>

          {hasAvant && (
            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.viewToggleBtn, activeView === "avant" && styles.viewToggleBtnActive]}
                onPress={() => setActiveView("avant")}
              >
                <Text style={[styles.viewToggleText, activeView === "avant" && styles.viewToggleTextActive]}>
                  Avant
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewToggleBtn, activeView === "apres" && styles.viewToggleBtnActive]}
                onPress={() => setActiveView("apres")}
              >
                <Text style={[styles.viewToggleText, activeView === "apres" && styles.viewToggleTextActive]}>
                  Projection
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.mainImage} resizeMode="cover" />
            <View style={[styles.imageBadge, activeView === "avant" && styles.imageBadgeAvant]}>
              <Text style={styles.imageBadgeText}>
                {activeView === "avant" ? "Photo d'origine" : label}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadBtn} onPress={() => Linking.openURL(paire.apres)}>
            <Icon name="Download" size={17} color="#fff" />
            <Text style={styles.downloadBtnText}>Télécharger la projection en HD</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <SectionLabel text="Conseils pour vos visites" />
          <View style={styles.conseilsIntro}>
            <Text style={styles.conseilsIntroText}>
              Préparez vos visites physiques pour maximiser l'impact de vos projections visuelles.
            </Text>
          </View>
          {CONSEILS.map((conseil, i) => {
            const config = PRIORITE_CONFIG[conseil.priorite as keyof typeof PRIORITE_CONFIG];
            return (
              <View key={i} style={[styles.conseilCard, { backgroundColor: config.bg, borderColor: config.border }]}>
                <View style={styles.conseilHeader}>
                  <Icon name={config.icon} size={17} color={config.color} />
                  <View style={[styles.conseilBadge, { backgroundColor: config.border }]}>
                    <Text style={[styles.conseilBadgeText, { color: config.color }]}>{config.label}</Text>
                  </View>
                </View>
                <Text style={styles.conseilTexte}>{conseil.texte}</Text>
                <Text style={styles.conseilImpact}>{conseil.impact}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "600", color: COLORS.dark },
  emptySub: { fontSize: 12.5, color: COLORS.gray, textAlign: "center", lineHeight: 19 },

  header: { backgroundColor: COLORS.dark, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16 },
  headerTitle: { fontSize: 19, fontWeight: "600", color: "#fff", marginBottom: 4 },
  headerSub: { fontSize: 11.5, color: "rgba(255,255,255,0.45)" },

  selector: { backgroundColor: COLORS.dark, flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 18, paddingBottom: 16, gap: 8 },
  selectorBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.08)" },
  selectorBtnActive: { backgroundColor: COLORS.gold },
  selectorText: { fontSize: 11, color: "rgba(255,255,255,0.55)" },
  selectorTextActive: { color: "#fff", fontWeight: "600" },

  visual: { backgroundColor: COLORS.dark, paddingBottom: 20 },
  viewToggle: {
    flexDirection: "row", marginHorizontal: 18, marginBottom: 14,
    backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: 4,
  },
  viewToggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 9 },
  viewToggleBtnActive: { backgroundColor: COLORS.gold },
  viewToggleText: { fontSize: 12.5, color: "rgba(255,255,255,0.55)" },
  viewToggleTextActive: { color: "#fff", fontWeight: "600" },

  imageContainer: { marginHorizontal: 18, borderRadius: 18, overflow: "hidden", height: 265, position: "relative", marginBottom: 16 },
  mainImage: { width: "100%", height: "100%" },
  imageBadge: {
    position: "absolute", bottom: 12, right: 12, backgroundColor: COLORS.gold,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  imageBadgeAvant: { backgroundColor: "rgba(0,0,0,0.6)" },
  imageBadgeText: { fontSize: 11, fontWeight: "600", color: "#fff" },

  downloadBtn: {
    marginHorizontal: 18, backgroundColor: COLORS.gold, borderRadius: 14,
    paddingVertical: 15, alignItems: "center", justifyContent: "center",
    flexDirection: "row", gap: 9,
  },
  downloadBtnText: { fontSize: 13.5, fontWeight: "600", color: "#fff" },

  content: { padding: 16 },
  conseilsIntro: {
    backgroundColor: COLORS.goldLight, borderRadius: 14, padding: 14, marginBottom: 12,
    borderWidth: 0.5, borderColor: COLORS.goldMid,
  },
  conseilsIntroText: { fontSize: 12, color: COLORS.goldDark, lineHeight: 18 },
  conseilCard: { borderRadius: 16, borderWidth: 0.5, padding: 16, marginBottom: 10 },
  conseilHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  conseilBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  conseilBadgeText: { fontSize: 10, fontWeight: "700" },
  conseilTexte: { fontSize: 13, color: COLORS.dark, lineHeight: 19, marginBottom: 8 },
  conseilImpact: { fontSize: 11.5, color: COLORS.gray, lineHeight: 17, fontStyle: "italic" },
});