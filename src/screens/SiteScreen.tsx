// src/screens/SiteScreen.tsx
// Affiche une page du site Evidence DANS l'application (commande, espace PRO,
// suivi de commande…). Le parcours validé du site (contrôle photo, choix
// cuisine / salle de bain, paiement Stripe, suivi) est ainsi utilisé tel quel :
// un seul parcours à maintenir pour le site et l'application.
//
// Utilisation : navigation.navigate("Site", { url: "https://…", titre: "Commander" })
import React, { useCallback, useRef, useState } from "react";
import {
  View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, BackHandler,
} from "react-native";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { COLORS, SITE_URL } from "../constants";

export const SiteScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const url: string = route.params?.url || SITE_URL;

  const webRef = useRef<WebView>(null);
  const [peutRevenir, setPeutRevenir] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  // Android : le bouton « retour » du téléphone revient d'abord en arrière
  // dans la page du site, avant de quitter l'écran.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (peutRevenir && webRef.current) {
          webRef.current.goBack();
          return true;
        }
        return false;
      });
      return () => sub.remove();
    }, [peutRevenir])
  );

  // Les liens qui ne sont pas des pages web (e-mail, téléphone) s'ouvrent
  // dans l'application correspondante du téléphone.
  const autoriserNavigation = (req: { url: string }) => {
    if (req.url.startsWith("mailto:") || req.url.startsWith("tel:")) {
      Linking.openURL(req.url).catch(() => {});
      return false;
    }
    // Pages légales (CGV, mentions, confidentialité) ouvertes depuis une autre
    // page : on les affiche dans Safari / Chrome, pour ne pas faire perdre au
    // client la commande en cours dans l'application.
    const pageLegale = /\/(cgv|mentions-legales|confidentialite)(\?|#|$)/.test(req.url);
    if (pageLegale && req.url !== url) {
      Linking.openURL(req.url).catch(() => {});
      return false;
    }
    return true;
  };

  if (erreur) {
    return (
      <View style={styles.centre}>
        <Text style={styles.erreurTitre}>Connexion impossible</Text>
        <Text style={styles.erreurTexte}>
          Vérifiez votre connexion internet, puis réessayez.
        </Text>
        <TouchableOpacity
          style={styles.bouton}
          onPress={() => {
            setErreur(false);
            setChargement(true);
          }}
        >
          <Text style={styles.boutonTexte}>Réessayer</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 14 }}>
          <Text style={styles.lien}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <WebView
        ref={webRef}
        source={{ uri: url }}
        onLoadEnd={() => setChargement(false)}
        onError={() => setErreur(true)}
        onNavigationStateChange={(etat) => setPeutRevenir(etat.canGoBack)}
        onShouldStartLoadWithRequest={autoriserNavigation}
        // Garde la connexion PRO et les choix en cours (comme un navigateur)
        domStorageEnabled
        javaScriptEnabled
        sharedCookiesEnabled
        // Envoi de photos depuis la pellicule ou l'appareil photo
        allowFileAccess
        mediaCapturePermissionGrantType="prompt"
        // Ouverture des PDF et images en plein écran (iPhone)
        allowsInlineMediaPlayback
        allowsBackForwardNavigationGestures
        pullToRefreshEnabled
        style={styles.page}
      />
      {chargement && (
        <View style={styles.chargement} pointerEvents="none">
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: COLORS.offWhite },
  chargement: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center", backgroundColor: COLORS.offWhite,
  },
  centre: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, backgroundColor: COLORS.offWhite },
  erreurTitre: { fontSize: 18, fontWeight: "600", color: COLORS.dark, marginBottom: 8 },
  erreurTexte: { fontSize: 13, color: COLORS.gray, textAlign: "center", marginBottom: 24, lineHeight: 20 },
  bouton: { backgroundColor: COLORS.dark, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 32 },
  boutonTexte: { color: COLORS.gold, fontSize: 14, fontWeight: "600" },
  lien: { color: COLORS.goldDark, fontSize: 13, textDecorationLine: "underline" },
});
