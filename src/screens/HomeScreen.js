import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
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
        style={styles.scanButton}
        onPress={() => navigation.navigate('Camera')}
      >
        <Ionicons name="camera" size={36} color="white" />
        <Text style={styles.scanButtonText}>Rozpocznij skanowanie</Text>
      </TouchableOpacity>

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
        
        <View style={styles.emptyHistoryContainer}>
          <Ionicons name="images-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyHistoryText}>
            Brak ostatnich skanowań. Rozpocznij skanowanie, aby zobaczyć wyniki.
          </Text>
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
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
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