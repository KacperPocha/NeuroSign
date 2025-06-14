import React, { useState } from 'react';
import '../styles/SettingsScreen.module.css'; // Assuming you have a CSS file for styling

function Settings() {
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="settings">
      <h2>Ustawienia aplikacji</h2>
      <label>
        <input
          type="checkbox"
          checked={autoSave}
          onChange={() => setAutoSave(!autoSave)}
        />
        Automatyczne zapisywanie wyników
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        Tryb ciemny
      </label>
    </div>
  );
}

export default Settings;
