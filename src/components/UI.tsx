// src/components/UI.tsx
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, Dimensions,
} from 'react-native';
import { COLORS } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'gold' | 'dark' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: string;
}

export const Button = ({
  label, onPress, variant = 'gold', loading, disabled, size = 'md', fullWidth = true, icon,
}: ButtonProps) => {
  const styles = buttonStyles(variant, size, fullWidth, disabled || loading);
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} disabled={disabled || loading} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? COLORS.gold : '#fff'} size="small" />
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.label}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const buttonStyles = (variant: string, size: string, fullWidth: boolean, disabled?: boolean) => {
  const paddingV = size === 'sm' ? 9 : size === 'lg' ? 16 : 13;
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 14 : 12;
  const bgMap: Record<string, string> = {
    gold: disabled ? '#d4b87a' : COLORS.gold,
    dark: disabled ? '#444' : COLORS.dark,
    outline: 'transparent',
    ghost: 'transparent',
  };
  const colorMap: Record<string, string> = {
    gold: '#fff', dark: '#fff', outline: COLORS.gold, ghost: COLORS.gray,
  };
  const borderMap: Record<string, string> = {
    gold: 'transparent', dark: 'transparent', outline: COLORS.gold, ghost: COLORS.beige,
  };
  return StyleSheet.create({
    btn: {
      backgroundColor: bgMap[variant],
      borderRadius: 13,
      paddingVertical: paddingV,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : undefined,
      borderWidth: 0.5,
      borderColor: borderMap[variant],
    },
    label: { color: colorMap[variant], fontSize, fontWeight: '500' },
    icon: { fontSize: 14 },
  });
};

// ─── Card ───────────────────────────────────────────────────────────────────────
export const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[cardStyles.card, style]}>{children}</View>
);
const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 10,
  },
});

// ─── SectionLabel ───────────────────────────────────────────────────────────────
export const SectionLabel = ({ text, style }: { text: string; style?: any }) => (
  <Text style={[slStyles.label, style]}>{text}</Text>
);
const slStyles = StyleSheet.create({
  label: {
    fontSize: 9, fontWeight: '600', color: COLORS.gray,
    letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 8,
  },
});

// ─── ScoreRing ──────────────────────────────────────────────────────────────────
export const ScoreRing = ({ score, size = 90 }: { score: number; size?: number }) => {
  const r = size * 0.42;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (score / 100) * circumference;
  const strokeOffset = circumference - strokeDash;
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Bon' : score >= 50 ? 'Moyen' : 'À améliorer';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.078} />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={COLORS.gold} strokeWidth={size * 0.078}
          strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
          strokeDashoffset={circumference / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text style={{ fontSize: size * 0.26, fontWeight: '600', color: '#fff', lineHeight: size * 0.28 }}>{score}</Text>
        <Text style={{ fontSize: size * 0.11, color: 'rgba(255,255,255,0.4)' }}>/100</Text>
        <Text style={{ fontSize: size * 0.095, color: COLORS.gold, marginTop: 1 }}>{label}</Text>
      </View>
    </View>
  );
};

// Import Svg + Circle for ScoreRing
import Svg, { Circle } from 'react-native-svg';

// ─── InfoBanner ─────────────────────────────────────────────────────────────────
interface InfoBannerProps {
  icon?: string;
  text: string;
  variant?: 'warning' | 'success' | 'info' | 'unlimited';
}
export const InfoBanner = ({ icon, text, variant = 'warning' }: InfoBannerProps) => {
  const bgMap: Record<string, string> = {
    warning: COLORS.warningBg,
    success: COLORS.successBg,
    info: '#f0f8ff',
    unlimited: '#f0faf0',
  };
  const borderMap: Record<string, string> = {
    warning: COLORS.warning,
    success: COLORS.successBorder,
    info: '#b0d4f0',
    unlimited: COLORS.successBorder,
  };
  const textColorMap: Record<string, string> = {
    warning: COLORS.warningText,
    success: COLORS.successText,
    info: '#1a4a6e',
    unlimited: COLORS.successText,
  };
  return (
    <View style={[iBannerStyles.wrap, { backgroundColor: bgMap[variant], borderColor: borderMap[variant] }]}>
      {icon && <Text style={iBannerStyles.icon}>{icon}</Text>}
      <Text style={[iBannerStyles.text, { color: textColorMap[variant] }]}>{text}</Text>
    </View>
  );
};
const iBannerStyles = StyleSheet.create({
  wrap: { borderRadius: 10, borderWidth: 0.5, padding: 10, flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 10 },
  icon: { fontSize: 13, flexShrink: 0, marginTop: 1 },
  text: { fontSize: 9, lineHeight: 14, flex: 1 },
});

// ─── StepIndicator ──────────────────────────────────────────────────────────────
export const StepIndicator = ({ steps, currentStep }: { steps: string[]; currentStep: number }) => (
  <View style={{ backgroundColor: COLORS.dark, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {steps.map((_, i) => (
        <React.Fragment key={i}>
          <View style={{
            width: 20, height: 20, borderRadius: 10,
            backgroundColor: i < currentStep ? COLORS.gold : i === currentStep ? '#fff' : 'rgba(255,255,255,0.12)',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: 9, fontWeight: '600',
              color: i < currentStep ? '#fff' : i === currentStep ? COLORS.dark : 'rgba(255,255,255,0.3)',
            }}>
              {i < currentStep ? '✓' : i + 1}
            </Text>
          </View>
          {i < steps.length - 1 && (
            <View style={{ flex: 1, height: 1, backgroundColor: i < currentStep ? COLORS.gold : 'rgba(255,255,255,0.12)' }} />
          )}
        </React.Fragment>
      ))}
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
      {steps.map((label, i) => (
        <Text key={i} style={{
          fontSize: 8, width: 52, textAlign: 'center',
          color: i === currentStep ? COLORS.gold : 'rgba(255,255,255,0.3)',
        }}>
          {label}
        </Text>
      ))}
    </View>
  </View>
);

// ─── CriteriaBar ────────────────────────────────────────────────────────────────
export const CriteriaBar = ({ label, value }: { label: string; value: number }) => (
  <View style={cBarStyles.wrap}>
    <View style={cBarStyles.top}>
      <Text style={cBarStyles.label}>{label}</Text>
      <Text style={cBarStyles.value}>{value}/100</Text>
    </View>
    <View style={cBarStyles.track}>
      <View style={[cBarStyles.fill, { width: `${value}%` }]} />
    </View>
  </View>
);
const cBarStyles = StyleSheet.create({
  wrap: { backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 10, marginBottom: 7 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 10, color: COLORS.grayDark },
  value: { fontSize: 10, fontWeight: '500', color: COLORS.dark },
  track: { height: 3, backgroundColor: COLORS.grayLight, borderRadius: 2 },
  fill: { height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
});

// ─── ConseilCard ────────────────────────────────────────────────────────────────
export const ConseilCard = ({ index, text }: { index: number; text: string }) => (
  <View style={ccStyles.wrap}>
    <View style={ccStyles.num}>
      <Text style={ccStyles.numText}>{index}</Text>
    </View>
    <Text style={ccStyles.text}>{text}</Text>
  </View>
);
const ccStyles = StyleSheet.create({
  wrap: { backgroundColor: COLORS.white, borderRadius: 11, borderWidth: 0.5, borderColor: COLORS.border, padding: 10, marginBottom: 7, flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  num: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.goldLight, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  numText: { fontSize: 9, fontWeight: '600', color: COLORS.gold },
  text: { fontSize: 10, color: '#444', lineHeight: 15, flex: 1 },
});

// ─── BeforeAfterSlider ──────────────────────────────────────────────────────────
export const BeforeAfterSlider = ({ height = 110 }: { height?: number }) => (
  <View style={[baStyles.wrap, { height }]}>
    <View style={baStyles.left}>
      <Text style={baStyles.roomIcon}>🪑</Text>
    </View>
    <View style={baStyles.right}>
      <Text style={baStyles.roomIcon}>🛋️</Text>
    </View>
    <View style={baStyles.divider} />
    <View style={baStyles.handle}><Text style={{ fontSize: 9 }}>↔</Text></View>
    <View style={[baStyles.tag, baStyles.tagLeft]}><Text style={baStyles.tagText}>Avant</Text></View>
    <View style={[baStyles.tag, baStyles.tagRight, { backgroundColor: 'rgba(200,169,110,0.9)' }]}>
      <Text style={baStyles.tagText}>Après IA</Text>
    </View>
  </View>
);
const baStyles = StyleSheet.create({
  wrap: { borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: '#e0dbd2', marginBottom: 10 },
  left: { position: 'absolute', left: 0, top: 0, width: '50%', height: '100%', backgroundColor: '#d4cdc4', alignItems: 'center', justifyContent: 'center' },
  right: { position: 'absolute', right: 0, top: 0, width: '50%', height: '100%', backgroundColor: '#f0ebe3', alignItems: 'center', justifyContent: 'center' },
  divider: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: '#fff', zIndex: 5 },
  handle: { position: 'absolute', left: '50%', top: '50%', width: 24, height: 24, backgroundColor: '#fff', borderRadius: 12, zIndex: 6, alignItems: 'center', justifyContent: 'center', marginLeft: -12, marginTop: -12 },
  tag: { position: 'absolute', bottom: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tagLeft: { left: 6, backgroundColor: 'rgba(0,0,0,0.4)' },
  tagRight: { right: 6 },
  tagText: { fontSize: 8, fontWeight: '600', color: '#fff' },
  roomIcon: { fontSize: 20, opacity: 1 },
});
