import React, { useContext } from 'react';
import styles from '../styles/SettingsScreen.module.css';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const handleDarkModeToggle = (e) => {
    setDarkMode(e.target.checked);
  };

  return (
    <div className={styles.settingsContainer}>
      <h2 className={styles.heading}>Ustawienia</h2>

      <div className={styles.settingItem}>
        <label htmlFor="darkModeToggle" className={styles.settingLabel}>
          Tryb ciemny
        </label>
        <input
          id="darkModeToggle"
          type="checkbox"
          checked={darkMode}
          onChange={handleDarkModeToggle}
          className={styles.toggleInput}
        />
      </div>

      {/* Tu możesz dodać kolejne ustawienia */}
    </div>
  );
};

export default SettingsScreen;
