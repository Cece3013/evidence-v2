import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import { useAppStore } from '../store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const LoginScreen = () => {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppStore();

  const sendCode = async () => {
    if (!email.includes('@')) return Alert.alert('Email invalide');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (data.success) setStep('code');
      else Alert.alert('Erreur', data.error || 'Impossible d\'envoyer le code.');
    } catch {
      Alert.alert('Erreur', 'Vérifiez votre connexion.');
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (code.length !== 6) return Alert.alert('Code invalide');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), code }),
      });
      const data = await res.json();
      if (data.success) {
        setUser({ id: data.userId, name: data.name || email.split('@')[0], email: data.email });
      } else {
        Alert.alert('Code incorrect', 'Vérifiez le code reçu par email.');
      }
    } catch {
      Alert.alert('Erreur', 'Vérifiez votre connexion.');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon espace client</Text>
          <Text style={styles.subtitle}>Connectez-vous pour accéder à vos commandes</Text>
        </View>

        <View style={styles.card}>
          {step === 'email' ? (
            <>
              <Text style={styles.label}>Votre adresse email</Text>
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                placeholderTextColor={COLORS.gray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity style={styles.btn} onPress={sendCode} disabled={loading}>
                {loading ? <ActivityIndicator color="#C8A96E" /> : <Text style={styles.btnText}>Recevoir mon code</Text>}
              </TouchableOpacity>
              <Text style={styles.hint}>Un code à 6 chiffres vous sera envoyé par email</Text>
            </>
          ) : (
            <>
              <Text style={styles.label}>Code reçu par email</Text>
              <Text style={styles.emailSent}>Envoyé à {email}</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="000000"
                placeholderTextColor={COLORS.gray}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
              <TouchableOpacity style={styles.btn} onPress={verifyCode} disabled={loading}>
                {loading ? <ActivityIndicator color="#C8A96E" /> : <Text style={styles.btnText}>Se connecter</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setStep('email'); setCode(''); }}>
                <Text style={styles.back}>Modifier l'email</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.offWhite },
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { marginBottom: 28, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '500', color: COLORS.dark, marginBottom: 6 },
  subtitle: { fontSize: 12, color: COLORS.gray, textAlign: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 0.5, borderColor: COLORS.border, padding: 24 },
  label: { fontSize: 11, fontWeight: '600', color: COLORS.gray, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  emailSent: { fontSize: 12, color: COLORS.gold, marginBottom: 12 },
  input: { backgroundColor: COLORS.offWhite, borderRadius: 10, borderWidth: 0.5, borderColor: COLORS.border, padding: 14, fontSize: 14, color: COLORS.dark, marginBottom: 16 },
  codeInput: { fontSize: 22, textAlign: 'center', letterSpacing: 8, fontWeight: '500' },
  btn: { backgroundColor: COLORS.dark, borderRadius: 10, padding: 14, alignItems: 'center', marginBottom: 12 },
  btnText: { color: COLORS.gold, fontSize: 14, fontWeight: '500' },
  hint: { fontSize: 11, color: COLORS.gray, textAlign: 'center' },
  back: { fontSize: 12, color: COLORS.gray, textAlign: 'center', textDecorationLine: 'underline' },
});