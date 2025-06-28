import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
        simulateSignRecognition(result.assets[0].uri);
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

  // Symulacyjna funkcja rozpoznawania znaków
  const simulateSignRecognition = async (imageUri = null) => {
    setIsScanning(true);
    
    // Symulacja procesu rozpoznawania
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = {
      signType: 'STOP',
      confidence: 0.95,
      timestamp: new Date().toLocaleString('pl-PL'),
      description: 'Znak drogowy STOP - obowiązek zatrzymania pojazdu',
      color: '#e74c3c',
      shape: 'ośmiokąt',
      imageUri: imageUri
    };
    
    setLastResult(result);
    setIsScanning(false);
    
    Alert.alert(
      'Rozpoznano znak!',
      `Znak: ${result.signType}\nPewność: ${(result.confidence * 100).toFixed(1)}%\nOpis: ${result.description}`,
      [{ text: 'OK' }]
    );
  };

  // Prawdziwa funkcja rozpoznawania znaków (nieużywana w tym kodzie)
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

      const response = await fetch('https://your-api-endpoint.com/recognize-sign', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      
      return {
        signType: result.signType,
        confidence: result.confidence,
        timestamp: new Date().toLocaleString('pl-PL'),
        description: result.description,
        boundingBox: result.boundingBox,
      };
    } catch (error) {
      console.error('Błąd rozpoznawania znaku:', error);
      throw new Error('Nie udało się rozpoznać znaku');
    }
  };

  const handleScanPress = () => {
    // Wywołujemy funkcję wyboru zdjęcia z galerii
    pickImageFromGallery();
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
            <Text style={styles.resultTimestamp}>{lastResult.timestamp}</Text>
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
              <Ionicons name="cloud-upload" size={24} color="#3498db" />
            </View>
            <Text style={styles.featureTitle}>Synchronizacja</Text>
            <Text style={styles.featureDescription}>
              Zapisywanie wyników w bazie danych
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
        
        {lastResult ? (
          <View style={styles.historyItem}>
            <Ionicons name="stop" size={24} color={lastResult.color} />
            <View style={styles.historyItemContent}>
              <Text style={styles.historyItemTitle}>{lastResult.signType}</Text>
              <Text style={styles.historyItemTime}>{lastResult.timestamp}</Text>
            </View>
            <Text style={styles.historyItemConfidence}>
              {(lastResult.confidence * 100).toFixed(0)}%
            </Text>
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
    marginBottom: 30,
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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
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
});

export default HomeScreen;
