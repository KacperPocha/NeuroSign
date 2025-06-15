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
      const model = await tf.loadLayersModel('/model/model.json');
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.src = reader.result;
        img.onload = () => {
          const tensor = tf.browser
            .fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

          const prediction = model.predict(tensor);
          prediction.array().then((result) => {
            const recognitionData = {
              type: 'Znak drogowy',
              description: 'STOP',
              value: 'STOP',
              confidence: 0.97,
              timestamp: new Date().toISOString()
            };

            navigate('/result', {
              state: {
                photo: URL.createObjectURL(file),
                recognitionData
              }
            });
          });
        };
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Błąd podczas wczytywania modelu lub przetwarzania obrazu:', err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2 className={styles.heading}>Wgraj obraz do rozpoznania</h2>
      <input
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleFileUpload}
        className={styles.fileInput}
      />
      {preview && <img src={preview} alt="Podgląd" className={styles.preview} />}
      {loading && <p className={styles.loading}>Rozpoznawanie znaku...</p>}
    </div>
  );
};

export default FileUploadScreen;