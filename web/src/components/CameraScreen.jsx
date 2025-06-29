import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import '../styles/CameraScreen.module.css';
import styles from '../styles/Buttons.module.css';

const CameraScreen = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = () => {
    setIsCapturing(true);
    const imageSrc = webcamRef.current.getScreenshot();


    setTimeout(() => {
      onCapture({
        uri: imageSrc,
        recognitionData: {
          type: 'Znak drogowy',
          description: 'Ograniczenie prędkości',
          value: '50',
          confidence: 0.92,
          timestamp: new Date().toISOString()
        }
      });
      setIsCapturing(false);
    }, 1000);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
        style={{ maxWidth: 640 }}
      />
      <button onClick={capture} disabled={isCapturing} className={styles.buttonSecondary}>
        {isCapturing ? 'Przetwarzanie...' : 'Zrób zdjęcie'}
      </button>
    </div>
  );
};

export default CameraScreen;
