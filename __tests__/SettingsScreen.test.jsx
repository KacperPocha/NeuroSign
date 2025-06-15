import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsScreen from '../components/SettingsScreen';

describe('SettingsScreen', () => {
  test('renderuje wszystkie ustawienia i reaguje na przełączniki', () => {
    render(<SettingsScreen />);

    // Sprawdź obecność tytułów sekcji
    expect(screen.getByText(/Ogólne/i)).toBeInTheDocument();
    expect(screen.getByText(/Dane i powiadomienia/i)).toBeInTheDocument();

    // Sprawdź przełącznik "Automatyczne zapisywanie"
    const autoSaveSwitch = screen.getByLabelText(/Automatyczne zapisywanie/i);
    fireEvent.click(autoSaveSwitch);
    expect(autoSaveSwitch.checked).toBe(false); // zmienił się stan przełącznika
  });
});