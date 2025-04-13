import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  // Stany dla ustawień
  const [autoSave, setAutoSave] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Wersja aplikacji
  const appVersion = "1.0.0";
  
  // Efekt do ładowania ustawień przy pierwszym renderze
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // W prawdziwej aplikacji ładowalibyśmy ustawienia z AsyncStorage
        // Tutaj dla uproszczenia używamy wartości domyślnych
        // Przykład, jak wyglądałoby ładowanie z AsyncStorage:
        // const savedAutoSave = await AsyncStorage.getItem('autoSave');
        // if (savedAutoSave !== null) setAutoSave(JSON.parse(savedAutoSave));
      } catch (error) {
        console.error('Błąd podczas ładowania ustawień:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Funkcje obsługujące zmiany ustawień
  const handleAutoSaveChange = (value) => {
    setAutoSave(value);
    // W prawdziwej aplikacji zapisalibyśmy to w AsyncStorage
    // AsyncStorage.setItem('autoSave', JSON.stringify(value));
  };
  
  const handleHighAccuracyChange = (value) => {
    setHighAccuracy(value);
    // AsyncStorage.setItem('highAccuracy', JSON.stringify(value));
  };
  
  const handleDarkModeChange = (value) => {
    setDarkMode(value);
    // AsyncStorage.setItem('darkMode', JSON.stringify(value));
    // Tutaj można by zastosować również zmianę motywu aplikacji
  };
  
  const handleOfflineModeChange = (value) => {
    setOfflineMode(value);
    // AsyncStorage.setItem('offlineMode', JSON.stringify(value));
  };
  
  const handleNotificationsChange = (value) => {
    setNotificationsEnabled(value);
    // AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
  };
  
  // Funkcja do czyszczenia danych aplikacji
  const handleClearData = () => {
    Alert.alert(
      'Wyczyścić dane?',
      'Czy na pewno chcesz wyczyścić wszystkie dane aplikacji? Ta operacja jest nieodwracalna.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Wyczyść', 
          style: 'destructive',
          onPress: async () => {
            try {
              // W prawdziwej aplikacji wyczyścilibyśmy AsyncStorage i bazę danych
              // await AsyncStorage.clear();
              Alert.alert('Sukces', 'Dane aplikacji zostały wyczyszczone.');
            } catch (error) {
              console.error('Błąd podczas czyszczenia danych:', error);
              Alert.alert('Błąd', 'Nie udało się wyczyścić danych aplikacji.');
            }
          }
        }
      ]
    );
  };
  
  // Funkcja do wyświetlania informacji o aplikacji
  const showAboutInfo = () => {
    Alert.alert(
      'O aplikacji',
      `NeuroSign wersja ${appVersion}\n\nAplikacja do rozpoznawania znaków z wykorzystaniem sztucznej inteligencji.\n\n© 2025 NeuroSign`
    );
  };

  // Funkcja do otwierania strony pomocy
  const openHelp = () => {
    Linking.openURL('https://example.com/neurosign/help');
  };
  
  // Funkcja do wyświetlania polityki prywatności
  const showPrivacyPolicy = () => {
    Alert.alert(
      'Polityka prywatności',
      'NeuroSign szanuje Twoją prywatność i nie gromadzi żadnych danych osobowych bez Twojej zgody. Wszystkie dane przetwarzane są lokalnie na Twoim urządzeniu, chyba że włączysz synchronizację z chmurą.'
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      {/* Sekcja ogólnych ustawień */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ogólne</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="save-outline" size={22} color="#3498db" />
            <Text style={styles.settingLabel}>Automatyczne zapisywanie</Text>
          </View>
          <Switch
            value={autoSave}
            onValueChange={handleAutoSaveChange}
            trackColor={{ false: '#bdc3c7', true: '#3498db' }}
            thumbColor={autoSave ? '#2980b9' : '#ecf0f1'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="speedometer-outline" size={22} color="#3498db" />
            <Text style={styles.settingLabel}>Wysoka dokładność</Text>
          </View>
          <Switch
            value={highAccuracy}
            onValueChange={handleHighAccuracyChange}
            trackColor={{ false: '#bdc3c7', true: '#3498db' }}
            thumbColor={highAccuracy ? '#2980b9' : '#ecf0f1'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="moon-outline" size={22} color="#3498db" />
            <Text style={styles.settingLabel}>Tryb ciemny</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={handleDarkModeChange}
            trackColor={{ false: '#bdc3c7', true: '#3498db' }}
            thumbColor={darkMode ? '#2980b9' : '#ecf0f1'}
          />
        </View>
      </View>
      
      {/* Sekcja ustawień danych */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dane i powiadomienia</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="wifi-outline" size={22} color="#3498db" />
            <Text style={styles.settingLabel}>Tryb offline</Text>
          </View>
          <Switch
            value={offlineMode}
            onValueChange={handleOfflineModeChange}
            trackColor={{ false: '#bdc3c7', true: '#3498db' }}
            thumbColor={offlineMode ? '#2980b9' : '#ecf0f1'}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <Ionicons name="notifications-outline" size={22} color="#3498db" />
            <Text style={styles.settingLabel}>Powiadomienia</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsChange}
            trackColor={{ false: '#bdc3c7', true: '#3498db' }}
            thumbColor={notificationsEnabled ? '#2980b9' : '#ecf0f1'}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={22} color="#e74c3c" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Wyczyść dane aplikacji
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Sekcja o aplikacji */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O aplikacji</Text>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={showAboutInfo}
        >
          <Ionicons name="information-circle-outline" size={22} color="#3498db" />
          <Text style={styles.actionButtonText}>Informacje</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={openHelp}
        >
          <Ionicons name="help-circle-outline" size={22} color="#3498db" />
          <Text style={styles.actionButtonText}>Pomoc</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={showPrivacyPolicy}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#3498db" />
          <Text style={styles.actionButtonText}>Polityka prywatności</Text>
        </TouchableOpacity>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Wersja {appVersion}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    marginBottom: 5,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#e74c3c',
  },
  versionContainer: {
    alignItems: 'center',
    paddingTop: 15,
  },
  versionText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default SettingsScreen;