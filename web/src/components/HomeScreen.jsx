import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HomeScreen.module.css'; 

function HomeScreen() {
  return (
    <div className={styles.homeScreen}>
      <h1>Witamy w NeuroSign Web</h1>
      <p>Wybierz, co chcesz zrobić:</p>
      <div className={styles.buttonContainer}>
        <Link className={styles.scanButton} to="/upload">Wgraj obraz</Link>
        <Link className={styles.scanButton} to="/settings">Ustawienia</Link>
      </div>
    </div>
  );
}


export default HomeScreen;
