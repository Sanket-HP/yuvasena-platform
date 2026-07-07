import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Membership() {
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found');

      const res = await fetch('http://localhost:4000/api/v1/members/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load profile');

      setMember(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch membership profile from backend.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  if (error || !member) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'Profile not loaded'}</Text>
        <TouchableOpacity style={styles.btnRetry} onPress={fetchProfile}>
          <Text style={styles.btnRetryText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Digital Card Frame */}
      <View style={styles.cardFrame}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>YUVA SENA</Text>
          <Text style={styles.headerSub}>OFFICIAL MEMBER CARD</Text>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <Image
            source={{ uri: member.profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fit=crop&w=150&h=150&q=80' }}
            style={styles.profilePic}
          />
          <Text style={styles.nameText}>{member.user.name}</Text>
          <Text style={styles.idText}>ID: {member.membershipNo}</Text>

          <View style={styles.divider} />

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>District: </Text>
              <Text style={styles.detailValue}>{member.district.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Taluka: </Text>
              <Text style={styles.detailValue}>{member.taluka.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Blood Group: </Text>
              <Text style={styles.detailValue}>{member.bloodGroup}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status: </Text>
              <Text style={[styles.detailValue, { color: '#2A9D8F', fontWeight: 'bold' }]}>{member.status}</Text>
            </View>
          </View>

          {/* QR code verification */}
          <View style={styles.qrContainer}>
            <Image
              source={{ uri: member.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${member.membershipNo}` }}
              style={styles.qrCode}
            />
            <Text style={styles.qrCaption}>Scan to Verify Authenticity</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8F9FA', alignItems: 'center', padding: 25 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 14, color: '#E63946', textAlign: 'center', marginBottom: 20 },
  btnRetry: { backgroundColor: '#FF6B00', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnRetryText: { color: '#FFF', fontWeight: 'bold' },

  cardFrame: { width: '100%', maxWidth: 320, backgroundColor: '#FFF', borderRadius: 16, borderHeight: 1, borderWidth: 2, borderColor: '#FF6B00', overflow: 'hidden', elevation: 4 },
  cardHeader: { backgroundColor: '#FF6B00', padding: 20, alignItems: 'center' },
  headerText: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  headerSub: { fontSize: 10, color: '#FFF', opacity: 0.8, marginTop: 4, letterSpacing: 1 },

  cardBody: { padding: 25, alignItems: 'center' },
  profilePic: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#FF6B00', marginBottom: 15 },
  nameText: { fontSize: 18, fontWeight: 'bold', color: '#1E1E24' },
  idText: { fontSize: 12, color: '#FF6B00', fontWeight: '600', marginTop: 4 },
  
  divider: { width: '100%', height: 1, backgroundColor: '#EDEAE6', marginVertical: 20 },
  
  detailsContainer: { width: '100%', paddingHorizontal: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailLabel: { fontSize: 12, color: '#495057', fontWeight: '600' },
  detailValue: { fontSize: 12, color: '#1E1E24' },

  qrContainer: { marginTop: 25, alignItems: 'center' },
  qrCode: { width: 110, height: 110 },
  qrCaption: { fontSize: 9, color: '#A0A0B0', marginTop: 8 }
});
