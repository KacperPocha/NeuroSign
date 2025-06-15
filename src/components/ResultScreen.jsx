import { useLocation } from 'react-router-dom';

const ResultScreen = () => {
  const location = useLocation();
  const { photo, recognitionData } = location.state || {};

  return (
    <div>
      <h2>Wynik rozpoznania</h2>
      {photo && <img src={photo} alt="Wczytany znak" style={{ maxWidth: '100%' }} />}
      {recognitionData && (
        <div>
          <p><strong>Typ:</strong> {recognitionData.type}</p>
          <p><strong>Opis:</strong> {recognitionData.description}</p>
          <p><strong>Wartość:</strong> {recognitionData.value}</p>
          <p><strong>Pewność:</strong> {(recognitionData.confidence * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
};

export default ResultScreen;
