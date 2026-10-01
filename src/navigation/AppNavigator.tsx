import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View, Image } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoginScreen } from '../screens/LoginScreen';
import { AboutScreen } from "../screens/AboutScreen";
import { AnalyzeScreen } from "../screens/AnalyzeScreen";
import { OffersScreen } from "../screens/OffersScreen";
import { ProOffersScreen } from "../screens/ProOffersScreen";
import { AccountScreen } from "../screens/AccountScreen";
import { SiteScreen } from "../screens/SiteScreen";
import { COLORS } from "../constants";

// Alignement V1 (01/10/2026) : commande, espace PRO et suivi passent par les
// pages du site affichées dans l'application (écran « Site »). Les anciens
// écrans (Upload, Payment, Processing, Result, PDFReport, Invoice, Pro…)
// ne sont plus utilisés.

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 0.5,
        borderTopColor: COLORS.border,
        paddingTop: 6,
        paddingBottom: 10,
        height: 60,
      },
      tabBarActiveTintColor: COLORS.gold,
      tabBarInactiveTintColor: COLORS.gray,
      tabBarLabelStyle: { fontSize: 8, marginTop: 2 },
      tabBarIcon: ({ focused, color }) => {
        const icons: Record<string, string> = {
          Home: "⌂",
          Offers: "✦",
          Analyze: "⊕",
          Account: "◯",
        };
        return (
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: focused ? COLORS.goldLight : "transparent",
            }}
          >
            <Text style={{ fontSize: 13, color }}>
              {icons[route.name] || "●"}
            </Text>
          </View>
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={AboutScreen} options={{ tabBarLabel: "Accueil" }} />
    <Tab.Screen name="Offers" component={OffersScreen} options={{ tabBarLabel: "Offres" }} />
    <Tab.Screen name="Analyze" component={AnalyzeScreen} options={{ tabBarLabel: "Analyser" }} />
    <Tab.Screen name="Account" component={AccountScreen} options={{ tabBarLabel: "Compte" }} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.dark },
            headerTintColor: COLORS.gold,
            headerTitleStyle: { color: "#fff", fontSize: 14 },
            headerBackTitle: "Retour",
            headerTitle: () => (
              <Image
                source={require("../../assets/logo.png")}
                style={{ width: 180, height: 60 }}
                resizeMode="contain"
              />
            ),
          }}
        >
          <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Offers" component={OffersScreen} options={{ title: "Nos offres" }} />
          <Stack.Screen name="ProOffers" component={ProOffersScreen} options={{ title: "Offres PRO" }} />
          <Stack.Screen name="Site" component={SiteScreen} options={{ title: "Evidence" }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: "Qui sommes-nous" }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Connexion' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
