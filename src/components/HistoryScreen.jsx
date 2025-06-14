import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HistoryScreen.module.css';

const mockHistoryData = [
  {
    id: '1',
    photo: 'https://via.placeholder.com/150',
    type: 'Znak drogowy',
    description: 'Ograniczenie prędkości',
    value: '50',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    photo: 'https://via.placeholder.com/150',
    type: 'Znak drogowy',
    description: 'Zakaz wjazdu',
    value: 'B-1',
    confidence: 0.88,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    photo: 'https://via.placeholder.com/150',
    type: 'Tablica rejestracyjna',
    description: 'Polska',
    value: 'WA12345',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

const HistoryScreen = () => {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistoryData = async () => {
      try {
        setHistoryData(mockHistoryData);
      } catch (error) {
        alert('Nie udało się załadować historii skanowań.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistoryData();
  }, []);

  const renderItem = (item) => {
    const date = new Date(item.timestamp);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    return (
      <div key={item.id} className={styles.historyItem} onClick={() => navigate('/result', { state: { data: item } })}>
        <img src={item.photo} alt="thumbnail" className={styles.itemImage} />
        <div className={styles.itemDetails}>
          <div className={styles.itemHeader}>
            <span className={styles.tag}>{item.type}</span>
            <span className={styles.confidence}>{(item.confidence * 100).toFixed(0)}%</span>
          </div>
          <p className={styles.description}>{item.description}: <strong>{item.value}</strong></p>
          <p className={styles.timestamp}>{formattedDate}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Historia skanowań</h2>
        {historyData.length > 0 && (
          <button className={styles.clearButton} onClick={() => setHistoryData([])}>Wyczyść</button>
        )}
      </div>

      {isLoading ? (
        <p className={styles.message}>Ładowanie historii...</p>
      ) : historyData.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.message}>Brak historii skanowań.</p>
          <button className={styles.scanButton} onClick={() => navigate('/camera')}>Skanuj teraz</button>
        </div>
      ) : (
        <div className={styles.list}>
          {historyData.map(renderItem)}
        </div>
      )}
    </div>
  );
};

export default HistoryScreen;
