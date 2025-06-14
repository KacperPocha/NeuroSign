// src/App.js (React Web version of NeuroSign App styled like mobile version)
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import CameraScreen from './components/CameraScreen';
import HistoryScreen from './components/HistoryScreen';
import ResultScreen from './components/ResultScreen';
import SettingsScreen from './components/SettingsScreen';
import FileUploadScreen from './components/FileUploadScreen';
import './App.css';

export default function App() {
  const [resultData, setResultData] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <header
          className="app-header"
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            padding: '15px 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Link
            to="/"
            className="app-title"
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              textDecoration: 'none'
            }}
          >
            NeuroSign
          </Link>
          <nav className="app-nav" style={{ display: 'flex', gap: '15px' }}>
            <Link to="/camera" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
              Skanuj
            </Link>
            <Link to="/upload" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
              Wgraj
            </Link>
            <Link to="/history" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
              Historia
            </Link>
            <Link to="/settings" className="nav-link" style={{ color: 'white', textDecoration: 'none' }}>
              Ustawienia
            </Link>
          </nav>
        </header>

        <main className="app-main" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/camera" element={<CameraScreen onResult={setResultData} />} />
            <Route path="/upload" element={<FileUploadScreen onResult={setResultData} />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/result" element={<ResultScreen data={resultData} />} />
          </Routes>
        </main>

        <footer className="app-footer" style={{ textAlign: 'center', padding: '10px 0', fontSize: '14px', color: '#7f8c8d' }}>
          <p>&copy; 2025 NeuroSign. Wszystkie prawa zastrzeżone.</p>
        </footer>
      </div>
    </Router>
  );
}
