import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/UI";
import { Icon } from "../components/Icon";
import { COLORS } from "../constants";

const APPROACH_ITEMS = [
  {
    icon: "Ruler",
    title: "Valorisation des volumes",
    text: "Nous révélons le potentiel existant, sans modifier la structure. Chaque pièce est optimisée pour paraître plus grande, plus lumineuse, plus accueillante.",
  },
  {
    icon: "Sparkles",
    title: "Désencombrement & neutralisation",
    text: "Un espace neutre permet à l'acheteur de se projeter. Nous guidons la mise en scène pour toucher un maximum d'acheteurs potentiels.",
  },
  {
    icon: "Zap",
    title: "Actions simples & immédiates",
    text: "Pas de travaux lourds. Chaque recommandation est concrète, à faible coût et applicable immédiatement.",
  },
  {
    icon: "Target",
    title: "Orienté résultat acheteur",
    text: "Nous savons exactement ce qui déclenche une visite et ce qui retient l'attention au premier regard.",
  },
];

const WHY_ITEMS = [
  { icon: "Gem", title: "Double expertise unique", desc: "Vision commerciale et sens esthétique réunis, pour des solutions vraiment efficaces." },
  { icon: "Target", title: "Orienté résultat", desc: "Nous savons ce qui attire les acheteurs et déclenche une visite." },
  { icon: "Zap", title: "Rapide & concret", desc: "Des actions simples et stratégiques sur l'existant." },
  { icon: "Handshake", title: "Réaliste & honnête", desc: "Nous valorisons sans dénaturer. Transparence totale." },
];

const RESULTS = [
  { icon: "Camera", label: "Des photos plus attractives" },
  { icon: "Users", label: "Plus de visites" },
  { icon: "Timer", label: "Une vente plus rapide" },
  { icon: "TrendingUp", label: "Une meilleure valorisation" },
];

const TEAM = [
  {
    initials: "EI",
    name: "Experte immobilier",
    role: "Marché, acheteurs et stratégie de vente",
    tagLabel: "Immobilier",
    tagBg: COLORS.goldLight,
    tagColor: COLORS.goldDark,
  },
  {
    initials: "DE",
    name: "Décoratrice",
    role: "Home staging et mise en valeur des espaces",
    tagLabel: "Décoration",
    tagBg: "#eef4ee",
    tagColor: "#4a7a4e",
  },
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
                       <Image source={require("../../assets/logo.png")} style={{ width: 124, height: 80 }} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.content}>

          {/* Notre équipe */}
          <Text style={styles.sectionTitle}>Notre équipe</Text>
          <View style={styles.teamRow}>
            {TEAM.map((member) => (
              <View key={member.name} style={styles.teamCard}>
                <View style={[styles.teamAvatar, { backgroundColor: member.tagBg }]}>
                  <Text style={[styles.teamInitials, { color: member.tagColor }]}>{member.initials}</Text>
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
          <Text style={styles.sectionTitle}>Notre mission</Text>
          <View style={styles.missionBlock}>
            <View style={styles.missionIconWrap}>
              <Icon name="HeartHandshake" size={22} color={COLORS.goldDark} />
            </View>
            <Text style={styles.missionText}>
              Aider chaque propriétaire à révéler le potentiel de son bien, qu'il soit vide ou encore habité, grâce à une mise en valeur intelligente, stratégique et efficace.
            </Text>
          </View>

          {/* 4 résultats */}
          <View style={styles.resultsGrid}>
            {RESULTS.map((r, i) => (
              <View key={i} style={styles.resultItem}>
                <Icon name={r.icon} size={19} color={COLORS.gold} />
                <Text style={styles.resultLabel}>{r.label}</Text>
              </View>
            ))}
          </View>

          {/* Notre approche */}
          <Text style={styles.sectionTitle}>Notre approche</Text>
          {APPROACH_ITEMS.map((item, i) => {
            const open = openAccordion === i;
            return (
              <View key={i} style={styles.accordionCard}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => setOpenAccordion(open ? null : i)}
                  activeOpacity={0.7}
                >
                  <View style={styles.accordionIcon}>
                    <Icon name={item.icon} size={17} color={COLORS.goldDark} />
                  </View>
                  <Text style={styles.accordionTitle}>{item.title}</Text>
                  <Icon
                    name={open ? "ChevronUp" : "ChevronDown"}
                    size={16}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
                {open && <Text style={styles.accordionBody}>{item.text}</Text>}
              </View>
            );
          })}

          {/* Pourquoi nous choisir */}
          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Pourquoi nous choisir</Text>
          <View style={styles.whyGrid}>
            {WHY_ITEMS.map((item) => (
              <View key={item.title} style={styles.whyCard}>
                <Icon name={item.icon} size={21} color={COLORS.gold} />
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            ))}
          </View>

          {/* Résultats prouvés */}
          <View style={styles.statsBlock}>
            <Text style={styles.statsTitle}>Résultats prouvés</Text>
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
  hero: {
    backgroundColor: COLORS.offWhite, paddingHorizontal: 18, paddingTop: 20, paddingBottom: 24,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  heroTitle: { fontSize: 24, fontWeight: "600", color: COLORS.dark, lineHeight: 33, flex: 1 },
  content: { padding: 16 },

  sectionTitle: {
    fontSize: 18, fontWeight: "700", color: COLORS.dark,
    marginBottom: 14, marginTop: 6,
  },

  teamRow: { flexDirection: "row", gap: 10, marginBottom: 22 },
  teamCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 16,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 16, alignItems: "center",
  },
  teamAvatar: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: "center", justifyContent: "center", marginBottom: 10,
  },
  teamInitials: { fontSize: 17, fontWeight: "600", letterSpacing: 0.5 },
  teamName: { fontSize: 13.5, fontWeight: "600", color: COLORS.dark, marginBottom: 5, textAlign: "center" },
  teamRole: { fontSize: 11, color: COLORS.gray, textAlign: "center", lineHeight: 15, marginBottom: 10 },
  teamTag: { borderRadius: 20, paddingHorizontal: 11, paddingVertical: 4 },
  teamTagText: { fontSize: 10, fontWeight: "600" },

  missionBlock: {
    backgroundColor: COLORS.goldLight, borderRadius: 16, padding: 18, marginBottom: 20,
    borderWidth: 0.5, borderColor: COLORS.goldMid,
    flexDirection: "row", gap: 14, alignItems: "flex-start",
  },
  missionIconWrap: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.white,
    alignItems: "center", justifyContent: "center",
  },
  missionText: { fontSize: 13, color: COLORS.grayDark, lineHeight: 20, flex: 1 },

  resultsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 22 },
  resultItem: {
    width: "47.5%", backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, flexDirection: "row", alignItems: "center", gap: 10,
  },
  resultLabel: { fontSize: 12, fontWeight: "500", color: COLORS.dark, flex: 1, lineHeight: 16 },

  accordionCard: {
    backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 0.5, borderColor: COLORS.border,
    overflow: "hidden", marginBottom: 9,
  },
  accordionHeader: { padding: 15, flexDirection: "row", alignItems: "center", gap: 12 },
  accordionIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.goldLight,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  accordionTitle: { fontSize: 13, fontWeight: "500", color: COLORS.dark, flex: 1 },
  accordionBody: {
    paddingHorizontal: 16, paddingBottom: 16, paddingLeft: 63,
    fontSize: 12, color: COLORS.grayDark, lineHeight: 19,
  },

  whyGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginBottom: 20 },
  whyCard: {
    width: "47.5%", backgroundColor: COLORS.white,
    borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border,
    padding: 15, gap: 8,
  },
  whyTitle: { fontSize: 12.5, fontWeight: "600", color: COLORS.dark, lineHeight: 17 },
  whyDesc: { fontSize: 11, color: COLORS.gray, lineHeight: 16 },

  statsBlock: { backgroundColor: COLORS.dark, borderRadius: 18, padding: 18, marginBottom: 18 },
  statsTitle: {
    fontSize: 10.5, color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
    letterSpacing: 1, marginBottom: 16, fontWeight: "600",
  },
  statsRow: { flexDirection: "row", gap: 9 },
  statItem: {
    flex: 1, backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12, paddingVertical: 14, paddingHorizontal: 8,
    borderWidth: 0.5, borderColor: "rgba(255,255,255,0.08)", alignItems: "center",
  },
  statValue: { fontSize: 22, fontWeight: "600", color: COLORS.gold },
  statLabel: { fontSize: 9.5, color: "rgba(255,255,255,0.45)", marginTop: 4, textAlign: "center", lineHeight: 13 },
});