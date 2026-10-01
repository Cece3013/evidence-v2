import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Linking, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { COLORS } from '../constants';
import { useAppStore } from '../store';

const API_URL = process.env.EXPO_PUBLIC_API_URL
  || 'https://poetic-youthfulness-production-fecb.up.railway.app';

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
      const res = await fetch(`${API_URL}/api/orders/client/${encodeURIComponent(user?.email || '')}`);
      const data = await res.json();
      if (data.orders) setClientOrders(data.orders);
    } catch (e) {
      setClientOrders(orders);
    }
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setClientOrders([]);
  };

  // Non connecté
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.notLoggedContainer}>
          <View style={styles.notLoggedIconWrap}>
            <Icon name="UserRound" size={34} color={COLORS.gold} strokeWidth={1.3} />
          </View>
          <Text style={styles.notLoggedTitle}>Mon espace client</Text>
          <Text style={styles.notLoggedSub}>
            Retrouvez vos commandes, vos projections et vos rapports personnalisés.
          </Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => nav.navigate('Login')}>
            <Text style={styles.loginBtnText}>Se connecter</Text>
          </TouchableOpacity>
          <Text style={styles.notLoggedHint}>
            Connexion par code envoyé à l'adresse email de votre commande.
          </Text>
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
          <Icon name="LogOut" size={18} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Statistiques */}
          <View style={styles.statsRow}>
            {[
              { num: vides.length, label: 'biens vides' },
              { num: habites.length, label: 'biens habités' },
              { num: habites.filter(o => o.pdfUrl).length, label: 'rapports' },
            ].map((s) => (
              <View key={s.label} style={styles.statCard}>
                <Text style={styles.statNum}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {loading && <ActivityIndicator color={COLORS.gold} style={{ marginBottom: 18 }} />}

          {/* Biens vides */}
          {vides.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Biens vides — Projections</Text>
              {vides.map((order, i) => (
                <View key={i} style={styles.orderCard}>
                  <View style={styles.orderTop}>
                    <Text style={styles.orderName}>{order.formulaLabel || 'Projection'}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: order.pretALivrer ? '#eef6ef' : COLORS.goldLight }]}>
                      <Text style={[styles.orderBadgeText, { color: order.pretALivrer ? '#3a7a3e' : COLORS.goldDark }]}>
                        {order.pretALivrer ? 'Disponible' : 'En préparation'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderMeta}>{order.reference} · {formatDate(order.createdAt)}</Text>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: order.pretALivrer ? COLORS.goldLight : COLORS.grayLight }]}
                    onPress={() => order.pretALivrer
                      ? nav.navigate('Result', { photos: order.photos, reference: order.reference })
                      : Alert.alert(
                          "En préparation",
                          "Vos visuels sont en cours de vérification. Vous recevrez un email dès qu'ils seront disponibles."
                        )
                    }
                  >
                    <Icon
                      name={order.pretALivrer ? "Images" : "Clock"}
                      size={15}
                      color={order.pretALivrer ? COLORS.goldDark : COLORS.gray}
                    />
                    <Text style={[styles.actionBtnText, { color: order.pretALivrer ? COLORS.goldDark : COLORS.gray }]}>
                      {order.pretALivrer ? 'Voir mes photos' : 'En préparation'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {/* Biens habités */}
          {habites.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Biens habités — Rapports expert</Text>
              {habites.map((order, i) => (
                <View key={i} style={styles.orderCard}>
                  <View style={styles.orderTop}>
                    <Text style={styles.orderName}>{order.formulaLabel || 'Rapport expert'}</Text>
                    <View style={[styles.orderBadge, { backgroundColor: order.pdfUrl ? '#eef6ef' : COLORS.goldLight }]}>
                      <Text style={[styles.orderBadgeText, { color: order.pdfUrl ? '#3a7a3e' : COLORS.goldDark }]}>
                        {order.pdfUrl ? 'Disponible' : 'En cours'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderMeta}>{order.reference} · {formatDate(order.createdAt)}</Text>
                  {order.pdfUrl ? (
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: '#eef6ef' }]}
                      onPress={() => Linking.openURL(order.pdfUrl)}
                    >
                      <Icon name="FileText" size={15} color="#3a7a3e" />
                      <Text style={[styles.actionBtnText, { color: '#3a7a3e' }]}>Télécharger mon rapport</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.pendingRow}>
                      <Icon name="Clock" size={15} color={COLORS.goldDark} />
                      <Text style={styles.pendingText}>
                        Notre équipe travaille sur votre dossier. Vous recevrez un email dès qu'il sera prêt.
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Aucune commande */}
          {clientOrders.length === 0 && !loading && (
            <View style={styles.emptyCard}>
              <Icon name="PackageOpen" size={34} color={COLORS.beigeMid} strokeWidth={1.2} />
              <Text style={styles.emptyText}>Aucune commande pour le moment</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => nav.navigate('Offers')}>
                <Text style={styles.emptyBtnText}>Découvrir nos offres</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Menu */}
          {[
            { icon: "Info", label: "Qui sommes-nous", screen: "About" },
            { icon: "Mail", label: "Nous contacter", screen: null },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.menuItem}
              onPress={() => item.screen
                ? nav.navigate(item.screen)
                : Linking.openURL('mailto:contact@evidence-homestaging.fr')
              }
            >
              <View style={styles.menuIcon}>
                <Icon name={item.icon} size={17} color={COLORS.goldDark} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="ChevronRight" size={17} color={COLORS.beigeMid} />
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
  notLoggedIconWrap: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: COLORS.goldLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  notLoggedTitle: { fontSize: 21, fontWeight: '600', color: COLORS.dark, marginBottom: 10 },
  notLoggedSub: { fontSize: 13, color: COLORS.gray, textAlign: 'center', marginBottom: 30, lineHeight: 20 },
  loginBtn: { backgroundColor: COLORS.dark, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48 },
  loginBtnText: { color: COLORS.gold, fontSize: 14.5, fontWeight: '600' },
  notLoggedHint: { fontSize: 11.5, color: COLORS.gray, textAlign: 'center', marginTop: 20, lineHeight: 17 },

  profileHeader: {
    backgroundColor: COLORS.dark, padding: 18, paddingTop: 22,
    flexDirection: 'row', alignItems: 'center', gap: 15,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.gold, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 19, fontWeight: '600', color: '#fff' },
  profileName: { fontSize: 16, fontWeight: '500', color: '#fff' },
  profileEmail: { fontSize: 11.5, color: 'rgba(255,255,255,0.45)', marginTop: 3 },
  logoutBtn: { padding: 8 },

  content: { padding: 16 },

  statsRow: { flexDirection: 'row', gap: 9, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
    borderWidth: 0.5, borderColor: COLORS.border, paddingVertical: 14, alignItems: 'center',
  },
  statNum: { fontSize: 20, fontWeight: '600', color: COLORS.gold },
  statLabel: { fontSize: 10.5, color: COLORS.gray, marginTop: 4, textAlign: 'center' },

  sectionLabel: {
    fontSize: 11, fontWeight: '600', color: COLORS.gray, letterSpacing: 0.9,
    textTransform: 'uppercase', marginBottom: 12, marginTop: 10,
  },

  orderCard: {
    backgroundColor: COLORS.white, borderRadius: 16,
    borderWidth: 0.5, borderColor: COLORS.border, padding: 16, marginBottom: 10,
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  orderName: { fontSize: 13.5, fontWeight: '600', color: COLORS.dark, flex: 1, marginRight: 10 },
  orderBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  orderBadgeText: { fontSize: 10, fontWeight: '600' },
  orderMeta: { fontSize: 11.5, color: COLORS.gray, marginBottom: 12 },

  actionBtn: {
    paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  actionBtnText: { fontSize: 12.5, fontWeight: '600' },

  pendingRow: {
    backgroundColor: COLORS.goldLight, borderRadius: 12, padding: 13,
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
  },
  pendingText: { fontSize: 11.5, color: COLORS.goldDark, lineHeight: 17, flex: 1 },

  emptyCard: {
    backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 0.5, borderColor: COLORS.border,
    padding: 30, alignItems: 'center', marginBottom: 18, gap: 14,
  },
  emptyText: { fontSize: 13.5, color: COLORS.gray },
  emptyBtn: { backgroundColor: COLORS.dark, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 28 },
  emptyBtnText: { color: COLORS.gold, fontSize: 12.5, fontWeight: '600' },

  menuItem: {
    backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border,
    padding: 14, flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 8,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.goldLight,
    alignItems: 'center', justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 13, color: COLORS.dark },
});