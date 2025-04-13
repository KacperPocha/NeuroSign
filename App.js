import React, { useEffect, useState, Callback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Nawigacja
import AppNavigator from './src/navigation/AppNavigator';

// Zapobiegaj automatycznemu ukrywaniu splash screena
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // 🔤 Załaduj czcionki (np. Ionicons)
        await Font.loadAsync({
          ...Ionicons.font,
        });

        // ⏱️ Symulacja ładowania (np. model, konfiguracja)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Błąd podczas ładowania zasobów:', e);
      } finally {
        setIsReady(true);
        console.log("Ukrywam SplashScreen");
        await SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Ładowanie NeuroSign...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#3498db',
  },
});
