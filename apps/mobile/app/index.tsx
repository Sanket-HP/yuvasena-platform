import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';

export default function Index() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Login states
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState(1); // 1 = Phone request, 2 = Verify OTP
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const savedToken = await AsyncStorage.getItem('accessToken');
    const savedUser = await AsyncStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP request failed');

      setStep(2);
      alert('Mock OTP code is 123456');
    } catch (err: any) {
      setError(err.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verify failed');

      if (data.isNewUser) {
        alert('Verification success! Please proceed to Register on Website.');
        setStep(1);
        return;
      }

      await AsyncStorage.setItem('accessToken', data.accessToken);
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.accessToken);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setStep(1);
  };

  if (!token) {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authCard}>
          <Text style={styles.authHeader}>YUVA SENA</Text>
          <Text style={styles.authSub}>Youth Digital Identity Portal</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {step === 1 ? (
            <View>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={styles.input}
                placeholder="10 digit Indian number"
              />
              <TouchableOpacity onPress={handleRequestOtp} style={styles.btnPrimary} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Request OTP</Text>}
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Verify 6-Digit OTP</Text>
              <TextInput
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                style={styles.input}
                placeholder="Enter 123456"
              />
              <TouchableOpacity onPress={handleVerifyOtp} style={styles.btnPrimary} disabled={loading}>
                {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Verify & Login</Text>}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.btnSecondary}>
                <Text style={styles.btnSecondaryText}>Change Number</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Jai Maharashtra,</Text>
        <Text style={styles.bannerSub}>{user.name}</Text>
        <Text style={styles.bannerRole}>{user.role}</Text>
      </View>

      {/* Action shortcuts grid */}
      <View style={styles.shortcutsGrid}>
        <TouchableOpacity onPress={() => router.push('/membership')} style={styles.shortcutCard}>
          <Text style={styles.shortcutIcon}>🪪</Text>
          <Text style={styles.shortcutText}>Membership Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/complaints')} style={styles.shortcutCard}>
          <Text style={styles.shortcutIcon}>📝</Text>
          <Text style={styles.shortcutText}>Lodge Grievance</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/scanner')} style={styles.shortcutCard}>
          <Text style={styles.shortcutIcon}>📷</Text>
          <Text style={styles.shortcutText}>Mark Attendance</Text>
        </TouchableOpacity>
      </View>

      {/* Quick news list */}
      <View style={styles.newsSection}>
        <Text style={styles.sectionHeader}>Trending Campaigns</Text>
        
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>State Youth Summit 2026</Text>
          <Text style={styles.newsContent}>Official registrations are now open for the annual state assembly camp in Mumbai Dadar.</Text>
        </View>
        
        <View style={styles.newsCard}>
          <Text style={styles.newsTitle}>Free Digital Skills Bootcamp</Text>
          <Text style={styles.newsContent}>Enrollment details for high school coding classes are downloadable now in the downloads tab.</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.btnLogout}>
        <Text style={styles.btnLogoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  authContainer: { flex: 1, backgroundColor: '#0F0F12', justifyContent: 'center', alignItems: 'center', padding: 20 },
  authCard: { width: '100%', maxWidth: 360, backgroundColor: '#16161A', padding: 30, borderRadius: 16, borderTopWidth: 4, borderTopColor: '#FF6B00' },
  authHeader: { fontSize: 24, fontWeight: '800', color: '#FFF', textAlign: 'center' },
  authSub: { fontSize: 12, color: '#A0A0B0', textAlign: 'center', marginTop: 5, marginBottom: 25 },
  label: { fontSize: 11, fontWeight: '600', color: '#A0A0B0', textTransform: 'uppercase', marginBottom: 8 },
  input: { backgroundColor: '#1D1D24', borderWidth: 1, borderColor: '#262630', padding: 12, borderRadius: 8, color: '#FFF', fontSize: 14, marginBottom: 20 },
  btnPrimary: { backgroundColor: '#FF6B00', padding: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  btnSecondary: { padding: 10, marginTop: 10, alignItems: 'center' },
  btnSecondaryText: { color: '#A0A0B0', fontSize: 12 },
  errorText: { color: '#E63946', fontSize: 12, marginBottom: 15, textAlign: 'center' },
  
  banner: { padding: 30, backgroundColor: '#FF6B00', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  bannerTitle: { fontSize: 16, color: '#FFF', opacity: 0.9 },
  bannerSub: { fontSize: 24, fontWeight: '800', color: '#FFF', marginTop: 5 },
  bannerRole: { fontSize: 10, fontWeight: 'bold', color: '#FFF', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 50, alignSelf: 'flex-start', marginTop: 8, textTransform: 'uppercase' },

  shortcutsGrid: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, gap: 10 },
  shortcutCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#EDEAE6', elevation: 2 },
  shortcutIcon: { fontSize: 24, marginBottom: 10 },
  shortcutText: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', color: '#1E1E24' },

  newsSection: { padding: 20 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#1E1E24', marginBottom: 15 },
  newsCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#EDEAE6', marginBottom: 12 },
  newsTitle: { fontSize: 14, fontWeight: 'bold', color: '#FF6B00', marginBottom: 6 },
  newsContent: { fontSize: 12, color: '#495057', lineHeight: 1.6 },

  btnLogout: { margin: 20, padding: 16, borderHeight: 1, borderWidth: 1, borderColor: '#E63946', borderRadius: 12, alignItems: 'center' },
  btnLogoutText: { color: '#E63946', fontWeight: 'bold', fontSize: 14 }
});

