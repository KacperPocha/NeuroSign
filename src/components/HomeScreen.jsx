// File: HomeScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomeScreen.module.css'; // Assuming you have a CSS file for styling

function HomeScreen() {
  return (
    <div className="home-screen">
      <h1>Witamy w NeuroSign Web</h1>
      <p>Wybierz, co chcesz zrobić:</p>
      <ul>
        <li><Link to="/upload">Wgraj obraz</Link></li>
        <li><Link to="/settings">Ustawienia</Link></li>
      </ul>
    </div>
  );
}

export default HomeScreen;
