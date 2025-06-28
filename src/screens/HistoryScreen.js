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

// W rzeczywistej aplikacji pobieralibyśmy dane z lokalnej bazy danych
// Tutaj używamy przykładowych danych
const mockHistoryData = [
  {
    id: '1',
    photo: 'https://via.placeholder.com/150',
    type: 'Znak drogowy',
    description: 'Ograniczenie prędkości',
    value: '50',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 godzina temu
  },
  {
    id: '2',
    photo: 'https://via.placeholder.com/150',
    type: 'Znak drogowy',
    description: 'Zakaz wjazdu',
    value: 'B-1',
    confidence: 0.88,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 dzień temu
  },
  {
    id: '3',
    photo: 'https://via.placeholder.com/150',
    type: 'Tablica rejestracyjna',
    description: 'Polska',
    value: 'WA12345',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 dni temu
  },
];

const HistoryScreen = ({ navigation }) => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Symulacja ładowania danych z bazy
    const loadHistoryData = async () => {
      try {
        // Tutaj byłby kod do ładowania danych z AsyncStorage lub SQLite
        setHistoryData(mockHistoryData);
      } catch (error) {
        console.error('Błąd podczas ładowania historii:', error);
        Alert.alert('Błąd', 'Nie udało się załadować historii skanowań.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHistoryData();
  }, []);

  // Funkcja do renderowania elementu historii
  const renderHistoryItem = ({ item }) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    
    return (
      <TouchableOpacity 
        style={styles.historyItem}
        onPress={() => navigation.navigate('Result', {
          photo: item.photo,
          recognitionData: {
            type: item.type,
            description: item.description,
            value: item.value,
            confidence: item.confidence,
            timestamp: item.timestamp
          }
        })}
      >
        <Image 
          source={{ uri: item.photo }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
        
        <View style={styles.itemDetails}>
          <View style={styles.itemHeader}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <Text style={styles.confidenceText}>
              {(item.confidence * 100).toFixed(0)}%
            </Text>
          </View>
          
          <Text style={styles.descriptionText}>
            {item.description}: <Text style={styles.valueText}>{item.value}</Text>
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
          onPress: () => {
            // Tutaj byłby kod do usuwania danych z bazy
            setHistoryData([]);
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Nagłówek */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historia skanowań</Text>
        {historyData.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearHistory}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
            <Text style={styles.clearButtonText}>Wyczyść</Text>
          </TouchableOpacity>
        )}
      </View>
      
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#e74c3c',
    marginLeft: 5,
    fontSize: 14,
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