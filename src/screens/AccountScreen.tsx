import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { useAppStore } from '../store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const AccountScreen = () => {
  const nav = useNavigation<any>();
  const { user, setUser, orders } = useAppStore();
  const [clientOrders, setClientOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/orders/client/${user?.email}`);
      const data = await res.json();
      if (data.orders) setClientOrders(data.orders);
    } catch (e) {
      // Fallback sur le store local
      setClientOrders(orders);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setClientOrders([]);
  };

  // Si pas connecté → écran login
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.notLoggedContainer}>
          <Text style={styles.notLoggedIcon}>◯</Text>
          <Text style={styles.notLoggedTitle}>Mon espace client</Text>
          <Text style={styles.notLoggedSub}>Connectez-vous pour accéder à vos commandes et rapports</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => nav.navigate('Login')}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const vides = clientOrders.filter(o => !o.isHabite);
  const habites = clientOrders.filter(o => o.isHabite);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { num: vides.length, label: 'biens vides' },
              { num: habites.length, label: 'biens habités' },
              { num: habites.filter(o => o.pdfUrl).length, label: 'rapports PDF' },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {loading && <ActivityIndicator color={COLORS.gold} style={{ marginBottom: 16 }} />}

          {/* Commandes biens vides */}
          {vides.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Biens vides — Résultats IA</Text>
              {vides.map((order, i) => (
                <View key={i} style={styles.orderCard}>
                  <View style={styles.orderTop}>
                    <Text style={styles.orderName}>{order.formulaLabel || 'Analyse IA'}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: '#edf7ee' }]}>
                      <Text style={[styles.orderBadgeText, { color: '#3a7a3e' }]}>Terminé</Text>
                    </View>
                  </View>
                  <Text style={styles.orderMeta}>{formatDate(order.createdAt)}</Text>
                  <View style={styles.orderActions}>
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: COLORS.goldLight }]}
                      onPress={() => nav.navigate('Result')}
                    >
                      <Text style={[styles.actionBtnText, { color: COLORS.goldDark }]}>Voir résultat</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </>
          )}

          {/* Commandes biens habités */}
          {habites.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Biens habités — Rapports expert</Text>
              {habites.map((order, i) => (
                <View key={i} style={styles.orderCard}>
                  <View style={styles.orderTop}>
                    <Text style={styles.orderName}>{order.formulaLabel || 'Rapport expert'}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: order.pdfUrl ? '#edf7ee' : '#fdf6ec' }]}>
                      <Text style={[styles.orderBadgeText, { color: order.pdfUrl ? '#3a7a3e' : '#b8892e' }]}>
                        {order.pdfUrl ? 'Rapport disponible' : 'En cours (48-72h)'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderMeta}>{formatDate(order.createdAt)}</Text>
                  {order.pdfUrl && (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#edf7ee', marginTop: 8 }]}
                      onPress={() => Linking.openURL(order.pdfUrl)}
                    >
                      <Text style={[styles.actionBtnText, { color: '#3a7a3e' }]}>Télécharger mon rapport PDF</Text>
                    </TouchableOpacity>
                  )}
                  {!order.pdfUrl && (
                    <View style={styles.pendingRow}>
                      <Text style={styles.pendingText}>Nos experts travaillent sur votre dossier. Vous recevrez un email dès que votre rapport est prêt.</Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Aucune commande */}
          {clientOrders.length === 0 && !loading && (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>Aucune commande pour le moment</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => nav.navigate('Offers')}>
                <Text style={styles.emptyBtnText}>Découvrir nos offres</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu */}
          {[
            { icon: "🏡", label: "Qui sommes-nous", screen: "About" },
            { icon: "✉️", label: "Contact", screen: null },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => item.screen && nav.navigate(item.screen)}
            >
              <View style={[styles.menuIcon, { backgroundColor: '#f0f0f0' }]}>
                <Text style={{ fontSize: 14 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function formatDate(iso: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  notLoggedContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  notLoggedIcon: { fontSize: 48, color: COLORS.gray, marginBottom: 16 },
  notLoggedTitle: { fontSize: 20, fontWeight: '500', color: COLORS.dark, marginBottom: 8 },
  notLoggedSub: { fontSize: 13, color: COLORS.gray, textAlign: 'center', marginBottom: 28, lineHeight: 20 },
  loginBtn: { backgroundColor: COLORS.dark, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40 },
  loginBtnText: { color: COLORS.gold, fontSize: 14, fontWeight: '500' },
  profileHeader: { backgroundColor: COLORS.dark, padding: 16, paddingTop: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '500', color: '#fff' },
  profileName: { fontSize: 15, fontWeight: '500', color: '#fff' },
  profileEmail: { fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  logoutBtn: { padding: 6 },
  logoutText: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  content: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 10, alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '500', color: COLORS.gold },
  statLabel: { fontSize: 8, color: COLORS.gray, marginTop: 2, textAlign: 'center' },
  sectionLabel: { fontSize: 9, fontWeight: '600', color: COLORS.gray, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8, marginTop: 8 },
  orderCard: { backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 12, marginBottom: 8 },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  orderName: { fontSize: 11, fontWeight: '500', color: COLORS.dark, flex: 1, marginRight: 8 },
  orderBadge: { borderRadius: 20, paddingHorizontal: 7, paddingVertical: 2 },
  orderBadgeText: { fontSize: 8, fontWeight: '600' },
  orderMeta: { fontSize: 9, color: COLORS.gray },
  orderActions: { flexDirection: 'row', gap: 6, marginTop: 8 },
  actionBtn: { flex: 1, padding: 8, borderRadius: 7, alignItems: 'center' },
  actionBtnText: { fontSize: 10, fontWeight: '500' },
  pendingRow: { marginTop: 8, backgroundColor: '#fdf6ec', borderRadius: 8, padding: 10 },
  pendingText: { fontSize: 11, color: '#b8892e', lineHeight: 16 },
  emptyCard: { backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 24, alignItems: 'center', marginBottom: 16 },
  emptyText: { fontSize: 13, color: COLORS.gray, marginBottom: 16 },
  emptyBtn: { backgroundColor: COLORS.dark, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 24 },
  emptyBtnText: { color: COLORS.gold, fontSize: 12, fontWeight: '500' },
  menuItem: { backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 6 },
  menuIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 11, color: COLORS.dark },
  menuArrow: { fontSize: 10, color: '#ccc' },
});