import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Complaints() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera roll is required to attach grievance photos!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access camera is required to snap grievance photos!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    if (!title || !description) {
      setError('Please fill in both title and description');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('Authentication token not found. Please log in again.');

      // Mock upload image URL or upload base64. Let's send a standard mock photo URL for database validation
      const imageUrls = image ? ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?fit=crop&w=800&h=450&q=80'] : [];

      const res = await fetch('http://localhost:4000/api/v1/complaints', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, imageUrls })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lodge grievance failed');

      alert('Grievance logged successfully! Admins will reply with action status.');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Connecting to server failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Report Local Grievance</Text>
        <Text style={styles.sub}>Voice your issue directly to District & Taluka administrators.</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Grievance Headline *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="e.g. Water logging in Ward 14"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Detailed Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Provide context, location landmarks, and duration of the problem..."
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Attach Proof Photograph</Text>
          <View style={styles.row}>
            <TouchableOpacity onPress={pickImage} style={styles.btnMedia}>
              <Text style={styles.btnMediaText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.btnMedia}>
              <Text style={styles.btnMediaText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {image && (
            <View style={styles.imagePreviewWrapper}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => setImage(null)} style={styles.btnRemoveImg}>
                <Text style={styles.btnRemoveImgText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.btnSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnSubmitText}>Submit Grievance</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8F9FA', padding: 20 },
  card: { backgroundColor: '#FFF', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: '#EDEAE6', elevation: 2 },
  header: { fontSize: 18, fontWeight: '800', color: '#1E1E24', marginBottom: 5 },
  sub: { fontSize: 11, color: '#6C757D', lineHeight: 1.6, marginBottom: 25 },
  
  formGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#495057', textTransform: 'uppercase', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#EDEAE6', borderRadius: 8, padding: 12, fontSize: 13, color: '#1E1E24', backgroundColor: '#F8F9FA' },
  
  row: { flexDirection: 'row', gap: 15 },
  btnMedia: { flex: 1, backgroundColor: '#EDEAE6', padding: 12, borderRadius: 8, alignItems: 'center' },
  btnMediaText: { color: '#495057', fontWeight: 'bold', fontSize: 12 },

  imagePreviewWrapper: { marginTop: 15, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#EDEAE6', position: 'relative' },
  previewImage: { width: '100%', height: 160 },
  btnRemoveImg: { backgroundColor: 'rgba(230, 57, 70, 0.9)', padding: 8, alignItems: 'center' },
  btnRemoveImgText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },

  btnSubmit: { backgroundColor: '#FF6B00', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  btnSubmitText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  errorText: { color: '#E63946', fontSize: 12, marginBottom: 15, textAlign: 'center' }
});
