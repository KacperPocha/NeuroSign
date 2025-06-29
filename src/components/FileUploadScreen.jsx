// src/components/FileUploadScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import styles from '../styles/FileUploadScreen.module.css';

const FileUploadScreen = () => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setPreview(URL.createObjectURL(file));

    try {
     
      await tf.ready();
      await new Promise((res) => setTimeout(res, 1000)); // symulacja ładowania modelu

      
      const recognitionData = {
        type: 'Znak drogowy',
        description: 'STOP',
        value: 'STOP',
        confidence: 0.98,
        timestamp: new Date().toISOString()
      };

      // Opóźnienie by zasymulować przetwarzanie
      setTimeout(() => {
        navigate('/result', {
          state: {
            photo: URL.createObjectURL(file),
            recognitionData
          }
        });
      }, 1500);
    } catch (err) {
      console.error('Błąd ładowania modelu:', err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2 className={styles.heading}>Wgraj obraz do rozpoznania</h2>

      {!loading && (
        <label htmlFor="fileInput" className={styles.customUpload}>
          Wybierz obraz
          <input
            type="file"
            id="fileInput"
            accept="image/png, image/jpeg"
            onChange={handleFileUpload}
            className={styles.hiddenInput}
          />
        </label>
      )}

      {preview && <img src={preview} alt="Podgląd" className={styles.preview} />}
      {loading && <p className={styles.loading}>Rozpoznawanie znaku...</p>}
    </div>
  );
};

export default FileUploadScreen;
