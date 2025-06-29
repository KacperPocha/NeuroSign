import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Ścieżka do pliku historii
const HISTORY_FILE_PATH = FileSystem.documentDirectory + 'scan_history.json';

const HomeScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [recentScans, setRecentScans] = useState([]);

  useEffect(() => {
    loadRecentScans();
  }, []);

  // Funkcja do ładowania ostatnich skanowań
  const loadRecentScans = async () => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE_PATH);
      
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(HISTORY_FILE_PATH);
        const historyData = JSON.parse(fileContent);
        
        // Pobierz 3 najnowsze skanowania
        const recent = historyData
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 3);
        
        setRecentScans(recent);
        
        // Ustaw ostatni wynik jako pierwszy z listy
        if (recent.length > 0) {
          setLastResult(recent[0]);
        }
      }
    } catch (error) {
      console.error('Błąd podczas ładowania ostatnich skanowań:', error);
    }
  };

  // Funkcja do zapisywania nowego wyniku do historii
  const saveToHistory = async (result) => {
    try {
      let historyData = [];
      
      // Sprawdź czy plik historii istnieje
      const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE_PATH);
      
      if (fileInfo.exists) {
        const fileContent = await FileSystem.readAsStringAsync(HISTORY_FILE_PATH);
        historyData = JSON.parse(fileContent);
      }
      
      // Dodaj nowy wynik na początek tablicy
      historyData.unshift(result);
      
      // Ogranicz historię do 100 elementów (opcjonalnie)
      if (historyData.length > 100) {
        historyData = historyData.slice(0, 100);
      }
      
      // Zapisz zaktualizowaną historię
      await FileSystem.writeAsStringAsync(HISTORY_FILE_PATH, JSON.stringify(historyData, null, 2));
      
      console.log('Wynik zapisany do historii');
      
      // Odśwież listę ostatnich skanowań
      await loadRecentScans();
      
    } catch (error) {
      console.error('Błąd podczas zapisywania do historii:', error);
      Alert.alert('Błąd', 'Nie udało się zapisać wyniku do historii.');
    }
  };

  // Funkcja wyboru zdjęcia z galerii
  const pickImageFromGallery = async () => {
    try {
      // Sprawdzenie uprawnień do galerii
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Brak uprawnień',
          'Potrzebne są uprawnienia do dostępu do galerii zdjęć.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Wybranie zdjęcia z galerii
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        // Po wybraniu zdjęcia wywołujemy symulację rozpoznawania
        await simulateSignRecognition(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Błąd podczas wybierania zdjęcia:', error);
      Alert.alert(
        'Błąd',
        'Nie udało się wybrać zdjęcia z galerii.',
        [{ text: 'OK' }]
      );
    }
  };

 
  const simulateSignRecognition = async (imageUri = null) => {
    setIsScanning(true);
    
    try {
     
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Różne przykładowe wyniki dla różnorodności
      const possibleResults = [
        {
          signType: 'STOP',
          description: 'Znak drogowy STOP - obowiązek zatrzymania pojazdu',
          confidence: 0.95,
          color: '#e74c3c',
          shape: 'ośmiokąt',
        },
      ];
      
      const randomResult = possibleResults[0];
      
      const result = {
        id: Date.now().toString(), // Unikalny identyfikator
        signType: randomResult.signType,
        type: 'Znak drogowy', // Dodane dla kompatybilności
        description: randomResult.description,
        value: randomResult.signType, // Dodane dla kompatybilności
        confidence: randomResult.confidence,
        timestamp: new Date().toISOString(),
        color: randomResult.color,
        shape: randomResult.shape,
        imageUri: imageUri,
        photo: imageUri // Dodane dla kompatybilności z HistoryScreen
      };
      
      setLastResult(result);
      
      // Zapisz wynik do historii
      await saveToHistory(result);
      
      Alert.alert(
        'Rozpoznano znak!',
        `Znak: ${result.signType}\nPewność: ${(result.confidence * 100).toFixed(1)}%\nOpis: ${result.description}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Błąd podczas rozpoznawania:', error);
      Alert.alert('Błąd', 'Wystąpił błąd podczas rozpoznawania znaku.');
    } finally {
      setIsScanning(false);
    }
  };

  // Prawdziwa funkcja rozpoznawania znaków (template do implementacji)
  const realSignRecognition = async (imageUri) => {
    try {
      // Tutaj byłaby integracja z rzeczywistym API rozpoznawania obrazów
      // np. Google Vision API, Azure Computer Vision, lub własny model ML
      
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'sign.jpg',
      });

      const response = await fetch('https://RailwayHging0498394hduih-endpoint.com/recognize-sign', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      return {
        id: Date.now().toString(),
        signType: result.signType,
        type: 'Znak drogowy',
        description: result.description,
        value: result.signType,
        confidence: result.confidence,
        timestamp: new Date().toISOString(),
        boundingBox: result.boundingBox,
        imageUri: imageUri,
        photo: imageUri
      };
    } catch (error) {
      console.error('Błąd rozpoznawania znaku:', error);
      throw new Error('Nie udało się rozpoznać znaku');
    }
  };

  const handleScanPress = () => {
    pickImageFromGallery();
  };

  // Funkcja do renderowania elementu historii
  const renderRecentScanItem = (item, index) => {
    const date = new Date(item.timestamp);
    const formattedDate = date.toLocaleDateString('pl-PL');
    const formattedTime = date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <TouchableOpacity 
        key={item.id || index}
        style={styles.historyItem}
        onPress={() => navigation.navigate('History')}
      >
        <View style={[styles.historyIcon, { backgroundColor: item.color || '#3498db' }]}>
          <Ionicons 
            name={getIconForSignType(item.signType || item.type)} 
            size={20} 
            color="white" 
          />
        </View>
        <View style={styles.historyItemContent}>
          <Text style={styles.historyItemTitle}>
            {item.signType || item.type || 'Nieznany znak'}
          </Text>
          <Text style={styles.historyItemTime}>
            {formattedDate} o {formattedTime}
          </Text>
        </View>
        <Text style={styles.historyItemConfidence}>
          {(item.confidence * 100).toFixed(0)}%
        </Text>
      </TouchableOpacity>
    );
  };

  // Funkcja pomocnicza do wyboru ikony na podstawie typu znaku
  const getIconForSignType = (signType) => {
    if (!signType) return 'help-outline';
    
    const type = signType.toLowerCase();
    if (type.includes('stop')) return 'stop-outline';
    if (type.includes('speed') || type.includes('limit')) return 'speedometer-outline';
    if (type.includes('parking')) return 'car-outline';
    if (type.includes('yield')) return 'triangle-outline';
    if (type.includes('no') || type.includes('zakaz')) return 'ban-outline';
    return 'warning-outline';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>NeuroSign</Text>
        <Text style={styles.subtitle}>
          Inteligentne rozpoznawanie znaków
        </Text>
      </View>

      {/* Główny przycisk skanowania */}
      <TouchableOpacity 
        style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
        onPress={handleScanPress}
        disabled={isScanning}
      >
        <Ionicons 
          name={isScanning ? "hourglass" : "camera"} 
          size={36} 
          color="white" 
        />
        <Text style={styles.scanButtonText}>
          {isScanning ? 'Rozpoznawanie...' : 'Wgraj zdjęcie'}
        </Text>
      </TouchableOpacity>

      {/* Wynik ostatniego skanowania */}
      {lastResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Ostatni wynik:</Text>
          <View style={styles.resultCard}>
            {lastResult.imageUri && (
              <Image 
                source={{ uri: lastResult.imageUri }} 
                style={styles.resultImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.resultHeader}>
              <Text style={[styles.signType, { color: lastResult.color }]}>
                {lastResult.signType}
              </Text>
              <Text style={styles.confidence}>
                {(lastResult.confidence * 100).toFixed(1)}%
              </Text>
            </View>
            <Text style={styles.resultDescription}>{lastResult.description}</Text>
            <Text style={styles.resultTimestamp}>
              {new Date(lastResult.timestamp).toLocaleString('pl-PL')}
            </Text>
          </View>
        </View>
      )}

      {/* Funkcje aplikacji */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Funkcje aplikacji</Text>
        
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="camera" size={24} color="#3498db" />
            </View>
            <Text style={styles.featureTitle}>Rozpoznawanie znaków</Text>
            <Text style={styles.featureDescription}>
              Skanowanie i rozpoznawanie znaków w czasie rzeczywistym
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="text" size={24} color="#3498db" />
            </View>
            <Text style={styles.featureTitle}>OCR</Text>
            <Text style={styles.featureDescription}>
              Odczytywanie tekstu z tablic i znaków
            </Text>
          </View>
        </View>
        
        <View style={styles.featureRow}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="time" size={24} color="#3498db" />
            </View>
            <Text style={styles.featureTitle}>Historia</Text>
            <Text style={styles.featureDescription}>
              Przeglądanie wcześniej zeskanowanych znaków
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="save" size={24} color="#3498db" />
            </View>
            <Text style={styles.featureTitle}>Automatyczny zapis</Text>
            <Text style={styles.featureDescription}>
              Zapisywanie wyników w lokalnym pliku JSON
            </Text>
          </View>
        </View>
      </View>

      {/* Ostatnie skanowania */}
      <View style={styles.recentScansContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ostatnie skanowania</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAllText}>Zobacz wszystkie</Text>
          </TouchableOpacity>
        </View>
        
        {recentScans.length > 0 ? (
          <View>
            {recentScans.map((item, index) => renderRecentScanItem(item, index))}
          </View>
        ) : (
          <View style={styles.emptyHistoryContainer}>
            <Ionicons name="images-outline" size={48} color="#bdc3c7" />
            <Text style={styles.emptyHistoryText}>
              Brak ostatnich skanowań. Rozpocznij skanowanie, aby zobaczyć wyniki.
            </Text>
          </View>
        )}
      </View>

      {/* Statystyki */}
      {recentScans.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statystyki</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{recentScans.length}</Text>
              <Text style={styles.statLabel}>Ostatnie skanowania</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {recentScans.length > 0 
                  ? Math.round(recentScans.reduce((sum, item) => sum + item.confidence, 0) / recentScans.length * 100)
                  : 0}%
              </Text>
              <Text style={styles.statLabel}>Średnia pewność</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {recentScans.length > 0 
                  ? new Date(recentScans[0].timestamp).toLocaleDateString('pl-PL')
                  : '-'}
              </Text>
              <Text style={styles.statLabel}>Ostatnie skanowanie</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButtonDisabled: {
    backgroundColor: '#95a5a6',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  signType: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  resultDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#95a5a6',
  },
  featuresContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  recentScansContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#3498db',
    fontSize: 14,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  historyItemConfidence: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyHistoryText: {
    textAlign: 'center',
    color: '#95a5a6',
    marginTop: 10,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  statsContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 30,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default HomeScreen;
