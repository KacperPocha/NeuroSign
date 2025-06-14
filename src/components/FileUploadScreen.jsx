import React, { useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const FileUploadScreen = () => {
  const [prediction, setPrediction] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Wczytaj model
    const model = await tf.loadLayersModel('/model/model.json');

    // Konwersja obrazu na tensor (załaduj z pliku)
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.src = reader.result;
      img.onload = () => {
        const tensor = tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([224, 224]) // Dopasuj do Twojego modelu
          .toFloat()
          .expandDims();
        const prediction = model.predict(tensor);
        prediction.array().then((res) => setPrediction(res));
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>Wgraj obraz do rozpoznania</h2>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      {prediction && <pre>{JSON.stringify(prediction, null, 2)}</pre>}
    </div>
  );
};

export default FileUploadScreen;