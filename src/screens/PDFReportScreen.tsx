// src/screens/PDFReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { Button, Card, SectionLabel } from '../components/UI';
import { EvidenceLogoIcon } from '../components/EvidenceLogo';
import { COLORS } from '../constants';
import { useAppStore } from '../store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const PDFReportScreen = () => {
  const navigation = useNavigation<any>();
  const { currentResult, orderConfig } = useAppStore();
  const [shared, setShared] = useState(false);

  const today = format(new Date(), 'd MMMM yyyy', { locale: fr });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mon rapport home staging — EVIDENCE Home Staging\nScore : ${currentResult?.score}/100`,
        url: currentResult?.pdfUrl || '',
        title: 'Rapport Home Staging',
      });
      setShared(true);
    } catch {}
  };

  const handleDownload = () => {
    // In production: download PDF from S3 signed URL via expo-file-system
    // FileSystem.downloadAsync(pdfUrl, FileSystem.documentDirectory + 'rapport-evidence.pdf')
    navigation.navigate('Account');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rapport expert PDF</Text>
        <Text style={styles.headerSub}>Généré automatiquement · Prêt à télécharger</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Card style={styles.reportCard}>
            {/* Report Header */}
            <View style={styles.reportHeader}>
              <View style={styles.reportHeaderLeft}>
                <View style={styles.reportIconWrap}>
                  <EvidenceLogoIcon size={28} />
                </View>
                <View>
                  <Text style={styles.reportTitle}>Rapport Home Staging</Text>
                  <Text style={styles.reportMeta}>
                    {orderConfig.roomType || 'Salon'} · {orderConfig.decoStyle || 'Scandinave'}
                    {orderConfig.multiVue ? ' · Multi-vue' : ''} · {today}
                  </Text>
                </View>
              </View>
            </View>

            {/* Executive Summary */}
            <Text style={styles.sectionTitle}>RÉSUMÉ EXÉCUTIF</Text>
            <Text style={styles.reportLine}>
              Score global : {currentResult?.score || 73}/100 — Bon potentiel de vente.
            </Text>
            {orderConfig.multiVue && (
              <Text style={styles.reportLine}>
                {(currentResult?.beforeAfterPairs?.length || 2)} vues générées : entrée, fenêtre, diagonale.
              </Text>
            )}
            <Text style={styles.reportLine}>
              Principal atout : luminosité naturelle ({currentResult?.scoreDetails?.[0]?.value || 85}/100).
            </Text>

            {/* Room Analysis */}
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>ANALYSE PIÈCE PAR PIÈCE</Text>
            <Text style={styles.reportLine}>
              {orderConfig.roomType || 'Salon'} — Points forts : volumes, hauteur sous plafond.
            </Text>
            <Text style={styles.reportLine}>
              Mobilier suggéré : canapé 3 places gris clair, table basse bois clair, tapis crème.
            </Text>
            <Text style={styles.reportLine}>
              Végétation : 1 plante grande taille, angle gauche de la pièce.
            </Text>

            {/* Score Details */}
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>SCORES DÉTAILLÉS</Text>
            {(currentResult?.scoreDetails || [
              { label: 'Luminosité', value: 85 },
              { label: 'Perception espace', value: 70 },
              { label: 'Neutralité déco', value: 68 },
              { label: 'Agencement', value: 72 },
            ]).map((d) => (
              <View key={d.label} style={styles.scoreRow}>
                <Text style={styles.scoreLabel}>{d.label}</Text>
                <View style={styles.scoreBar}>
                  <View style={[styles.scoreBarFill, { width: `${d.value}%` }]} />
                </View>
                <Text style={styles.scoreVal}>{d.value}/100</Text>
              </View>
            ))}

            {/* Recommendations */}
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>RECOMMANDATIONS PRIORITAIRES</Text>
            {(currentResult?.conseils || [
              'Retirer rideaux foncés — remplacer par voilages blancs.',
              'Grand miroir 120cm face à la fenêtre principale.',
              'Neutraliser coussins et textiles décoratifs.',
            ]).map((c, i) => (
              <Text key={i} style={styles.reportLine}>{i + 1}. {c}</Text>
            ))}

            {/* Budget */}
            <Text style={[styles.sectionTitle, { marginTop: 10 }]}>BUDGET ESTIMÉ</Text>
            <Text style={styles.reportLine}>Actions sans dépense (désencombrement, réagencement) — 0€</Text>
            <Text style={styles.reportLine}>Textiles neutres (coussins, plaid) — env. 40–80€</Text>
            <Text style={styles.reportLine}>Miroir + plante — env. 60–120€</Text>
            <Text style={[styles.reportLine, styles.reportTotal]}>
              Investissement total estimé — 100 à 200€
            </Text>
          </Card>

          {/* Download Button */}
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
            <Text style={styles.downloadIcon}>⬇</Text>
            <Text style={styles.downloadText}>Télécharger le PDF HD</Text>
          </TouchableOpacity>

          <Button label="Partager par email" onPress={handleShare} variant="ghost" />

          <View style={styles.savedBanner}>
            <Text style={{ fontSize: 14 }}>✅</Text>
            <Text style={styles.savedText}>
              Rapport + facture sauvegardés dans votre espace client.
              Accès illimité depuis "Mes rapports".
            </Text>
          </View>

          <Button label="Régénérer les images →" onPress={() => navigation.navigate('Regeneration')} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  header: { backgroundColor: COLORS.dark, padding: 14, paddingBottom: 16 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  content: { padding: 16 },
  reportCard: { padding: 16 },
  reportHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: '#f0ece8' },
  reportHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  reportIconWrap: { width: 38, height: 38, backgroundColor: COLORS.goldLight, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  reportTitle: { fontSize: 13, fontWeight: '500', color: COLORS.dark },
  reportMeta: { fontSize: 8, color: COLORS.gray, marginTop: 2 },
  sectionTitle: { fontSize: 9, fontWeight: '700', color: COLORS.gold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  reportLine: { fontSize: 10, color: COLORS.grayDark, paddingVertical: 3, borderBottomWidth: 0.5, borderBottomColor: '#f8f7f4', lineHeight: 15 },
  reportTotal: { fontWeight: '500', color: COLORS.dark, borderBottomWidth: 0 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5 },
  scoreLabel: { fontSize: 9, color: COLORS.gray, width: 110 },
  scoreBar: { flex: 1, height: 4, backgroundColor: COLORS.grayLight, borderRadius: 2, overflow: 'hidden' },
  scoreBarFill: { height: 4, backgroundColor: COLORS.gold, borderRadius: 2 },
  scoreVal: { fontSize: 9, fontWeight: '500', color: COLORS.dark, width: 42, textAlign: 'right' },
  downloadBtn: { backgroundColor: COLORS.dark, borderRadius: 12, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 },
  downloadIcon: { fontSize: 16, color: '#fff' },
  downloadText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  savedBanner: { backgroundColor: COLORS.successBg, borderWidth: 0.5, borderColor: COLORS.successBorder, borderRadius: 11, padding: 11, flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginBottom: 10 },
  savedText: { fontSize: 10, color: COLORS.successText, flex: 1, lineHeight: 15 },
});


// ─────────────────────────────────────────────────────────────────────────────────
// src/screens/AccountScreen.tsx
// ─────────────────────────────────────────────────────────────────────────────────
import React2 from 'react';
import { View as V2, Text as T2, ScrollView as SC2, TouchableOpacity as TO2, StyleSheet as SS2 } from 'react-native';
import { useNavigation as UN2 } from '@react-navigation/native';
import { SafeAreaView as SAV2 } from 'react-native-safe-area-context';
import { COLORS as C2 } from '../constants';
import { useAppStore as useAppStore2 } from '../store';

const menuSections = [
  {
    label: 'Mon espace',
    items: [
      { icon: '🖼️', label: 'Mes images avant / après', screen: 'Gallery', bg: '#fdf6ec' },
      { icon: '📄', label: 'Mes rapports PDF',         screen: 'PDF',     bg: '#fdf6ec' },
      { icon: '🧾', label: 'Mes factures',             screen: 'Invoice', bg: '#fdf6ec' },
      { icon: '💳', label: 'Historique de paiements',  screen: null,      bg: '#f0f0f0' },
      { icon: '⚙️', label: 'Paramètres du compte',     screen: null,      bg: '#f0f0f0' },
    ],
  },
  {
    label: 'Informations',
    items: [
      { icon: '🏡', label: 'Qui sommes-nous',  screen: 'About',   bg: '#f0f0f0' },
      { icon: '❓', label: 'FAQ',              screen: null,      bg: '#f0f0f0' },
      { icon: '✉️', label: 'Contact',          screen: null,      bg: '#f0f0f0' },
    ],
  },
];

export const AccountScreen = () => {
  const nav    = UN2<any>();
  const { orders } = useAppStore2();

  const mockUser = { name: 'Marie Laurent', email: 'marie.laurent@email.com', role: 'Agent immobilier' };

  return (
    <SAV2 style={{ flex: 1, backgroundColor: C2.offWhite }} edges={['top']}>
      {/* Profile Header */}
      <V2 style={{ backgroundColor: C2.dark, padding: 16, paddingTop: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <V2 style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: C2.gold, alignItems: 'center', justifyContent: 'center' }}>
          <T2 style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>
            {mockUser.name.split(' ').map((n) => n[0]).join('')}
          </T2>
        </V2>
        <V2>
          <T2 style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>{mockUser.name}</T2>
          <T2 style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{mockUser.email}</T2>
          <V2 style={{ backgroundColor: 'rgba(200,169,110,0.2)', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4, borderWidth: 0.5, borderColor: 'rgba(200,169,110,0.4)' }}>
            <T2 style={{ fontSize: 8, color: C2.gold }}>{mockUser.role}</T2>
          </V2>
        </V2>
      </V2>

      <SC2 showsVerticalScrollIndicator={false}>
        <V2 style={{ padding: 16 }}>
          {/* Stats */}
          <V2 style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            {[
              { num: orders.length || 4, label: 'analyses' },
              { num: 2, label: 'rapports PDF' },
              { num: orders.length || 3, label: 'factures' },
            ].map((s) => (
              <V2 key={s.label} style={{ flex: 1, backgroundColor: C2.white, borderRadius: 11, borderWidth: 0.5, borderColor: C2.border, padding: 10, alignItems: 'center' }}>
                <T2 style={{ fontSize: 16, fontWeight: '500', color: C2.gold }}>{s.num}</T2>
                <T2 style={{ fontSize: 8, color: C2.gray, marginTop: 2 }}>{s.label}</T2>
              </V2>
            ))}
          </V2>

          {/* Orders */}
          <T2 style={{ fontSize: 9, fontWeight: '600', color: C2.gray, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8 }}>MES COMMANDES</T2>
          {[
            { name: 'Essentiel+ · Salon · Multi-vue', status: 'Terminé', date: '7 avril 2026', price: '19,90€', style: 'Scandinave', statusOk: true },
            { name: 'Premium · Maison 4P', status: 'En cours', date: '5 avril 2026', price: '49,00€', style: 'Rapport 48h', statusOk: false },
          ].map((order, i) => (
            <V2 key={i} style={{ backgroundColor: C2.white, borderRadius: 11, borderWidth: 0.5, borderColor: C2.border, padding: 12, marginBottom: 8 }}>
              <V2 style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <T2 style={{ fontSize: 11, fontWeight: '500', color: C2.dark, flex: 1, marginRight: 8 }}>{order.name}</T2>
                <V2 style={{ backgroundColor: order.statusOk ? '#edf7ee' : '#fdf6ec', borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 }}>
                  <T2 style={{ fontSize: 8, fontWeight: '600', color: order.statusOk ? '#3a7a3e' : '#b8892e' }}>{order.status}</T2>
                </V2>
              </V2>
              <T2 style={{ fontSize: 9, color: C2.gray }}>{order.date} · {order.price} · {order.style}</T2>
              {order.statusOk && (
                <V2 style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                  {[
                    { label: 'Résultat', screen: 'Result', bg: C2.goldLight, color: C2.goldDark },
                    { label: 'PDF', screen: 'PDF', bg: '#f0f0f0', color: C2.grayDark },
                    { label: 'Facture', screen: 'Invoice', bg: C2.successBg, color: C2.successText },
                    { label: '♾️ Regen.', screen: 'Regeneration', bg: '#fdf8f1', color: C2.goldDark },
                  ].map((btn) => (
                    <TO2
                      key={btn.label}
                      style={{ flex: 1, padding: 6, backgroundColor: btn.bg, borderRadius: 7, alignItems: 'center' }}
                      onPress={() => nav.navigate(btn.screen)}
                    >
                      <T2 style={{ fontSize: 8, color: btn.color, fontWeight: '500' }}>{btn.label}</T2>
                    </TO2>
                  ))}
                </V2>
              )}
            </V2>
          ))}

          {/* Menu Sections */}
          {menuSections.map((section) => (
            <V2 key={section.label} style={{ marginTop: 6 }}>
              <T2 style={{ fontSize: 9, fontWeight: '600', color: C2.gray, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 7 }}>
                {section.label.toUpperCase()}
              </T2>
              {section.items.map((item) => (
                <TO2
                  key={item.label}
                  style={{ backgroundColor: C2.white, borderRadius: 11, borderWidth: 0.5, borderColor: C2.border, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 6 }}
                  onPress={() => item.screen && nav.navigate(item.screen)}
                >
                  <V2 style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: item.bg, alignItems: 'center', justifyContent: 'center' }}>
                    <T2 style={{ fontSize: 14 }}>{item.icon}</T2>
                  </V2>
                  <T2 style={{ flex: 1, fontSize: 11, color: C2.dark }}>{item.label}</T2>
                  <T2 style={{ fontSize: 10, color: '#ccc' }}>›</T2>
                </TO2>
              ))}
            </V2>
          ))}
        </V2>
      </SC2>
    </SAV2>
  );
};
