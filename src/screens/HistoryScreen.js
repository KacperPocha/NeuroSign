import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

// Ścieżka do pliku historii
const HISTORY_FILE_PATH = FileSystem.documentDirectory + 'scan_history.json';

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistoryData();
  }, []);

  // Funkcja do ładowania historii z pliku JSON
  const loadHistoryData = async () => {
    try {
      setIsLoading(true);
      
      // Sprawdzenie czy plik istnieje
      const fileInfo = await FileSystem.getInfoAsync(HISTORY_FILE_PATH);
      
      if (fileInfo.exists) {
        // Odczytanie zawartości pliku
        const fileContent = await FileSystem.readAsStringAsync(HISTORY_FILE_PATH);
        const parsedData = JSON.parse(fileContent);
        
        // Sortowanie według czasu (najnowsze pierwsze)
        const sortedData = parsedData.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setHistoryData(sortedData);
        console.log('Historia załadowana z pliku:', sortedData.length, 'elementów');
      } else {
        // Jeśli plik nie istnieje, tworzymy pusty plik
        await FileSystem.writeAsStringAsync(HISTORY_FILE_PATH, JSON.stringify([]));
        setHistoryData([]);
        console.log('Utworzono nowy plik historii');
      }
    } catch (error) {
      console.error('Błąd podczas ładowania historii:', error);
      Alert.alert(
        'Błąd', 
        'Nie udało się załadować historii skanowań. Sprawdź dostęp do plików.',
        [{ text: 'OK' }]
      );
      setHistoryData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Funkcja do zapisywania historii do pliku JSON
  const saveHistoryData = async (data) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      await FileSystem.writeAsStringAsync(HISTORY_FILE_PATH, jsonString);
      console.log('Historia zapisana do pliku');
    } catch (error) {
      console.error('Błąd podczas zapisywania historii:', error);
      Alert.alert(
        'Błąd', 
        'Nie udało się zapisać historii do pliku.',
        [{ text: 'OK' }]
      );
    }
  };

  // Funkcja do usuwania pojedynczego elementu
  const deleteHistoryItem = (itemId) => {
    Alert.alert(
      'Usuń element',
      'Czy na pewno chcesz usunąć ten element z historii?',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Usuń', 
          style: 'destructive',
          onPress: async () => {
            const updatedData = historyData.filter(item => item.id !== itemId);
            setHistoryData(updatedData);
            await saveHistoryData(updatedData);
          } 
        }
      ]
    );
  };

  // Funkcja do renderowania elementu historii
  const renderHistoryItem = ({ item }) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString('pl-PL')} ${date.toLocaleTimeString('pl-PL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
    
    return (
      <TouchableOpacity 
        style={styles.historyItem}
        onPress={() => navigation.navigate('Result', {
          photo: item.photo || item.imageUri,
          recognitionData: {
            type: item.type || item.signType,
            description: item.description,
            value: item.value || item.signType,
            confidence: item.confidence,
            timestamp: item.timestamp
          }
        })}
      >
        {(item.photo || item.imageUri) && (
          <Image 
            source={{ uri: item.photo || item.imageUri }} 
            style={styles.itemImage} 
            resizeMode="cover"
          />
        )}
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{item.type || item.signType || 'Nieznany'}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.confidenceText}>
                {(item.confidence * 100).toFixed(0)}%
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteHistoryItem(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={styles.descriptionText}>
            {item.description}
            {item.value && item.value !== item.signType && (
              <Text style={styles.valueText}> - {item.value}</Text>
            )}
          </Text>
          
          <Text style={styles.timestampText}>
            {formattedDate}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Funkcja do usuwania wszystkich elementów historii
  const clearHistory = () => {
    Alert.alert(
      'Usunąć historię?',
      'Czy na pewno chcesz usunąć całą historię skanowań? Tej operacji nie można cofnąć.',
      [
        { text: 'Anuluj', style: 'cancel' },
        { 
          text: 'Usuń', 
          style: 'destructive',
          onPress: async () => {
            setHistoryData([]);
            await saveHistoryData([]);
          } 
        }
      ]
    );
  };

  // Funkcja do eksportowania historii
  const exportHistory = async () => {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalItems: historyData.length,
        data: historyData
      };
      
      const exportPath = FileSystem.documentDirectory + `history_export_${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(exportPath, JSON.stringify(exportData, null, 2));
      
      Alert.alert(
        'Eksport zakończony',
        `Historia została wyeksportowana do:\n${exportPath}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Błąd podczas eksportu:', error);
      Alert.alert('Błąd', 'Nie udało się wyeksportować historii.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historia skanowań</Text>
        {historyData.length > 0 && (
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.exportButton}
              onPress={exportHistory}
            >
              <Ionicons name="download-outline" size={18} color="#3498db" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearHistory}
            >
              <Ionicons name="trash-outline" size={18} color="#e74c3c" />
              <Text style={styles.clearButtonText}>Wyczyść</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Informacja o liczbie elementów */}
      {historyData.length > 0 && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Łącznie: {historyData.length} {historyData.length === 1 ? 'skanowanie' : 'skanowań'}
          </Text>
        </View>
      )}
      
      {/* Lista historii */}
      {isLoading ? (
        <View style={styles.centered}>
          <Ionicons name="hourglass-outline" size={48} color="#bdc3c7" />
          <Text style={styles.loadingText}>Ładowanie historii...</Text>
        </View>
      ) : historyData.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>
            Brak historii skanowań.
          </Text>
          <Text style={styles.emptySubtext}>
            Zeskanuj znak, aby zobaczyć go w historii.
          </Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text style={styles.scanButtonText}>Skanuj teraz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={historyData}
          renderItem={renderHistoryItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={isLoading}
          onRefresh={loadHistoryData}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exportButton: {
    marginRight: 15,
    padding: 5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#e74c3c',
    marginLeft: 5,
    fontSize: 14,
  },
  statsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  statsText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  listContainer: {
    padding: 15,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#3498db',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
    marginRight: 10,
  },
  deleteButton: {
    padding: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 5,
  },
  valueText: {
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default HistoryScreen;
