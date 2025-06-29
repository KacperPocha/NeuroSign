import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResultScreen = ({ route, navigation }) => {
  const { photo, recognitionData } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  const saveResult = () => {
    setIsSaved(true);
    Alert.alert("Zapisano", "Pomyślnie zapisano wynik rozpoznawania w historii.");
  };

  const shareResult = async () => {
    try {
      await Share.share({
        message: `NeuroSign - wynik rozpoznawania:\nTyp: ${recognitionData.type}\nOpis: ${recognitionData.description}\nWartość: ${recognitionData.value}\nPewność: ${(recognitionData.confidence * 100).toFixed(1)}%`,
        url: photo
      });
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się udostępnić wyniku.");
    }
  };

  const renderConfidenceBar = (confidence) => {
    const percent = confidence * 100;
    let barColor = '#e74c3c';

    if (percent >= 90) barColor = '#2ecc71';
    else if (percent >= 70) barColor = '#f39c12';

    return (
      <View style={styles.confidenceContainer}>
        <Text style={styles.confidenceText}>
          Pewność: {percent.toFixed(1)}%
        </Text>
        <View style={styles.confidenceBarBackground}>
          <View style={[styles.confidenceBar, {
            width: `${percent}%`,
            backgroundColor: barColor
          }]} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />

      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <View style={styles.typeContainer}>
            <Text style={styles.typeLabel}>{recognitionData.type}</Text>
          </View>
          <Text style={styles.timestamp}>
            {new Date(recognitionData.timestamp).toLocaleString()}
          </Text>
        </View>

        <View style={styles.resultContent}>
          <Text style={styles.description}>{recognitionData.description}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{recognitionData.value}</Text>
          </View>

          {renderConfidenceBar(recognitionData.confidence)}

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={20} color="#3498db" />
              <Text style={styles.infoText}>
                Znak rozpoznany przez algorytm sztucznej inteligencji.
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="alert-circle-outline" size={20} color="#f39c12" />
              <Text style={styles.infoText}>
                Wynik rozpoznawania może się różnić od rzeczywistości. Zawsze weryfikuj informacje.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, isSaved && styles.disabledButton]}
          onPress={saveResult}
          disabled={isSaved}
        >
          <Ionicons name="save-outline" size={22} color={isSaved ? "#95a5a6" : "white"} />
          <Text style={[styles.actionButtonText, isSaved && styles.disabledButtonText]}>
            {isSaved ? "Zapisano" : "Zapisz"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={shareResult}>
          <Ionicons name="share-social-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Udostępnij</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Camera')}>
          <Ionicons name="camera-outline" size={22} color="white" />
          <Text style={styles.actionButtonText}>Nowe zdjęcie</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Powrót do strony głównej</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  resultContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  typeContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  typeLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  resultContent: {
    padding: 15,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  valueContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  confidenceContainer: {
    marginBottom: 10,
  },
  confidenceText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#2c3e50',
  },
  confidenceBarBackground: {
    height: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 5,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: 10,
    borderRadius: 5,
  },
  infoContainer: {
    marginTop: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  disabledButtonText: {
    color: '#7f8c8d',
  },
  homeButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResultScreen;
