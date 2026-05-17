import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/UI";
import { COLORS } from "../constants";

const APPROACH_ITEMS = [
  {
    icon: "📐",
    title: "Valorisation des volumes",
    text: "Nous révélons le potentiel existant, sans modifier la structure. Chaque pièce est optimisée pour paraître plus grande, plus lumineuse, plus accueillante.",
    variant: "gold",
  },
  {
    icon: "🧹",
    title: "Désencombrement & neutralisation",
    text: "Un espace neutre permet à l'acheteur de se projeter. Nous guidons la mise en scène pour toucher un maximum d'acheteurs potentiels.",
    variant: "gold",
  },
  {
    icon: "⚡",
    title: "Actions simples & immédiates",
    text: "Pas de travaux lourds. Chaque recommandation est concrète, à faible coût et applicable immédiatement.",
    variant: "dark",
  },
  {
    icon: "🎯",
    title: "Orienté résultat acheteur",
    text: "Nous savons exactement ce qui déclenche une visite et ce qui retient l'attention au premier regard.",
    variant: "dark",
  },
];

const WHY_ITEMS = [
  { icon: "🧠", title: "Double expertise unique", desc: "Vision commerciale + sens esthétique = solutions vraiment efficaces." },
  { icon: "📸", title: "Orienté résultat", desc: "On sait ce qui attire les acheteurs et déclenche une visite." },
  { icon: "⚡", title: "Rapide & concret", desc: "Actions simples et stratégiques sur l'existant." },
  { icon: "🤝", title: "Réaliste & honnête", desc: "On valorise sans dénaturer. Transparence totale." },
];

const RESULTS = [
  { icon: "📸", label: "Des photos plus attractives" },
  { icon: "👥", label: "Plus de visites" },
  { icon: "⚡", label: "Une vente plus rapide" },
  { icon: "📈", label: "Une meilleure valorisation du bien" },
];

export const AboutScreen = () => {
  const navigation = useNavigation<any>();
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>

   {/* Hero */}
<View style={styles.hero}>
  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    <Text style={styles.heroTitle}>Vendez votre bien{"\n"}plus vite et mieux.</Text>
    <Image source={require("../../assets/logo.png")} style={{ width: 120, height: 80 }} resizeMode="contain" />
  </View>
</View>

<View style={styles.content}>
          {/* Notre équipe — EN HAUT */}
          <Text style={styles.sectionTitleBold}>Notre équipe</Text>
          <View style={styles.teamRow}>
            {[
              { icon: "🏡", name: "Experte immo", role: "Marché, acheteurs & stratégie de vente", tagLabel: "Immobilier", tagBg: "#fdf0d8", tagColor: COLORS.goldDark },
              { icon: "🎨", name: "Décoratrice", role: "Home staging & mise en valeur des espaces", tagLabel: "Décoration", tagBg: "#eef4ee", tagColor: "#4a7a4e" },
            ].map((member) => (
              <View key={member.name} style={styles.teamCard}>
                <View style={[styles.teamAvatar, { backgroundColor: member.tagBg }]}>
                  <Text style={{ fontSize: 24 }}>{member.icon}</Text>
                </View>
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
                <View style={[styles.teamTag, { backgroundColor: member.tagBg }]}>
                  <Text style={[styles.teamTagText, { color: member.tagColor }]}>{member.tagLabel}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Notre mission */}
          <Text style={styles.sectionTitleBold}>Notre mission</Text>
          <View style={styles.missionBlock}>
            <Text style={styles.missionText}>
              Aider chaque propriétaire à révéler le potentiel de son bien, qu'il soit vide ou encore habité, grâce à une mise en valeur intelligente, stratégique et efficace.
            </Text>
          </View>

          {/* 4 résultats */}
          <View style={styles.resultsGrid}>
            {RESULTS.map((r, i) => (
              <View key={i} style={styles.resultItem}>
                <Text style={styles.resultIcon}>{r.icon}</Text>
                <Text style={styles.resultLabel}>{r.label}</Text>
              </View>
            ))}
          </View>

          {/* Notre approche */}
          <Text style={styles.sectionTitleBold}>Notre approche</Text>
          {APPROACH_ITEMS.map((item, i) => (
            <View key={i} style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setOpenAccordion(openAccordion === i ? null : i)}
              >
                <View style={[styles.accordionIcon, { backgroundColor: item.variant === "gold" ? COLORS.goldLight : "#f0f0f0" }]}>
                  <Text style={{ fontSize: 14 }}>{item.icon}</Text>
                </View>
                <Text style={styles.accordionTitle}>{item.title}</Text>
                <Text style={styles.accordionArrow}>{openAccordion === i ? "▾" : "▸"}</Text>
              </TouchableOpacity>
              {openAccordion === i && (
                <Text style={styles.accordionBody}>{item.text}</Text>
              )}
            </View>
          ))}

          {/* Pourquoi nous choisir */}
          <Text style={[styles.sectionTitleBold, { marginTop: 8 }]}>Pourquoi nous choisir</Text>
          <View style={styles.whyGrid}>
            {WHY_ITEMS.map((item) => (
              <View key={item.title} style={styles.whyCard}>
                <Text style={styles.whyIcon}>{item.icon}</Text>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* Résultats prouvés — 3 alignés */}
          <View style={styles.statsBlock}>
            <Text style={styles.statsTitle}>RÉSULTATS PROUVÉS</Text>
            <View style={styles.statsRow}>
              {[
                { value: "+31%", label: "ventes plus rapides" },
                { value: "+8%", label: "prix de vente" },
                { value: "2×", label: "plus de visites" },
              ].map((s) => (
                <View key={s.value} style={styles.statItem}>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Button
            label="Voir nos offres →"
            onPress={() => navigation.navigate("Offers")}
            variant="dark"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  hero: { backgroundColor: COLORS.dark, padding: 18, paddingBottom: 24 },
  heroTitle: { fontSize: 22, fontWeight: "500", color: "#fff", lineHeight: 30 },
  content: { padding: 16 },

  sectionTitleBold: {
    fontSize: 17, fontWeight: "700", color: COLORS.dark,
    marginBottom: 12, marginTop: 4,
  },

  teamRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  teamCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 13, alignItems: "center",
  },
  teamAvatar: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  teamName: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginBottom: 4 },
  teamRole: { fontSize: 9, color: COLORS.gray, textAlign: "center", lineHeight: 13, marginBottom: 8 },
  teamTag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  teamTagText: { fontSize: 9, fontWeight: "500" },

  missionBlock: { backgroundColor: COLORS.gold, borderRadius: 14, padding: 16, marginBottom: 14 },
  missionText: { fontSize: 13, color: "#fff", lineHeight: 20 },

  resultsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  resultItem: {
    width: "47%", backgroundColor: COLORS.white,
    borderRadius: 12, borderWidth: 0.5, borderColor: COLORS.border,
    padding: 12, flexDirection: "row", alignItems: "center", gap: 8,
  },
  resultIcon: { fontSize: 18 },
  resultLabel: { fontSize: 11, fontWeight: "500", color: COLORS.dark, flex: 1, lineHeight: 15 },

  accordionCard: {
    backgroundColor: COLORS.white, borderRadius: 13,
    borderWidth: 0.5, borderColor: COLORS.border,
    overflow: "hidden", marginBottom: 8,
  },
  accordionHeader: { padding: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  accordionIcon: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  accordionTitle: { fontSize: 11, fontWeight: "500", color: COLORS.dark, flex: 1 },
  accordionArrow: { fontSize: 10, color: COLORS.gray },
  accordionBody: { paddingHorizontal: 14, paddingBottom: 12, paddingLeft: 50, fontSize: 9, color: COLORS.grayDark, lineHeight: 14 },

  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  whyCard: {
    width: "47%", backgroundColor: COLORS.white,
    borderRadius: 13, borderWidth: 0.5, borderColor: COLORS.border, padding: 12,
  },
  whyIcon: { fontSize: 18, marginBottom: 6 },
  whyTitle: { fontSize: 10, fontWeight: "600", color: COLORS.dark, marginBottom: 3, lineHeight: 14 },
  whyDesc: { fontSize: 8, color: COLORS.gray, lineHeight: 13 },

  statsBlock: { backgroundColor: COLORS.dark, borderRadius: 14, padding: 14, marginBottom: 14 },
  statsTitle: { fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 8 },
  statItem: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 9, padding: 10,
    borderWidth: 0.5, borderColor: "rgba(255,255,255,0.06)", alignItems: "center",
  },
  statValue: { fontSize: 20, fontWeight: "500", color: COLORS.gold },
  statLabel: { fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 2, textAlign: "center" },
});