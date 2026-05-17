import React from "react";
import { View, Image, StyleSheet } from "react-native";

const logoImage = require("../../assets/logo.png");

export const EvidenceLogoIcon = ({ size = 40 }: { size?: number }) => (
  <Image
    source={logoImage}
    style={{ width: size * 2, height: size, resizeMode: "contain" }}
  />
);

export const EvidenceLogo = ({ size = 40 }: { size?: number }) => (
  <View style={styles.wrap}>
    <Image
      source={logoImage}
      style={{ width: size * 2.5, height: size, resizeMode: "contain" }}
    />
  </View>
);

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
});