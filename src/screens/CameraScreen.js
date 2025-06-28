import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isProcessing, setIsProcessing] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  // Prośba o uprawnienia do kamery
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(cameraStatus === 'granted' && mediaStatus === 'granted');
    })();
  }, []);

  // Funkcja do robienia zdjęcia
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        
        // Symulacja przetwarzania obrazu przez AI
        // W rzeczywistej aplikacji, tutaj wywołałbyś modele TensorFlow.js i Tesseract.js
        setTimeout(() => {
          setIsProcessing(false);
          
          // Nawigacja do ekranu wyników z danymi zdjęcia
          navigation.navigate('Result', {
            photo: photo.uri,
            // Tutaj dodajemy przykładowe dane rozpoznanego znaku
            // W rzeczywistej aplikacji, dane te pochodziłyby z modelu AI
            recognitionData: {
              type: 'Znak drogowy',
              description: 'Ograniczenie prędkości',
              value: '50',
              confidence: 0.92,
              timestamp: new Date().toISOString(),
            }
          });
        }, 1500);
        
      } catch (error) {
        console.error('Błąd podczas robienia zdjęcia:', error);
        setIsProcessing(false);
        Alert.alert('Błąd', 'Nie udało się zrobić zdjęcia. Spróbuj ponownie.');
      }
    }
  };

  // Zmiana trybu lampy błyskowej
  const toggleFlashMode = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.on
        : Camera.Constants.FlashMode.off
    );
  };

  // Sprawdzenie uprawnień
  if (hasPermission === null) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#3498db" /></View>;
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off" size={64} color="#e74c3c" />
        <Text style={styles.permissionText}>
          Brak dostępu do kamery. Aplikacja potrzebuje tego uprawnienia do działania.
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Powrót</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        type={type}
        ref={cameraRef}
        flashMode={flashMode}
      >
        {/* Overlay z wskazówkami */}
        <View style={styles.overlay}>
          {/* Czerwony obszar do wizualizacji rozpoznawania */}
          <View style={styles.scanArea}>
            <View style={styles.scanAreaCorner} />
            <View style={[styles.scanAreaCorner, styles.topRight]} />
            <View style={[styles.scanAreaCorner, styles.bottomLeft]} />
            <View style={[styles.scanAreaCorner, styles.bottomRight]} />
          </View>
          
          {/* Podpowiedź dla użytkownika */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Wyceluj kamerę w znak, aby go rozpoznać
            </Text>
          </View>
        </View>

        {/* Dolny panel kontrolny */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.captureButton}
            onPress={takePicture}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={toggleFlashMode}
          >
            <Ionicons 
              name={flashMode === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    position: 'relative',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  permissionText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    fontSize: 16,
    color: '#2c3e50',
  },
  permissionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#e74c3c',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  scanAreaCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#e74c3c',
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    left: undefined,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    top: undefined,
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
  },
  bottomRight: {
    top: undefined,
    left: undefined,
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    borderWidth: 2,
    borderColor: 'white',
  }
});

export default CameraScreen;
