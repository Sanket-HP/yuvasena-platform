import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FF6B00',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Yuva Sena Hub' }} />
        <Stack.Screen name="membership" options={{ title: 'Digital Card' }} />
        <Stack.Screen name="scanner" options={{ title: 'Attendance Scan' }} />
        <Stack.Screen name="complaints" options={{ title: 'Lodge Grievance' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
