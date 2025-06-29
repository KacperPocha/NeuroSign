import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeScreen from '../components/HomeScreen';

describe('HomeScreen', () => {
  test('renderuje tytuł i przycisk skanowania', () => {
    render(
      <MemoryRouter>
        <HomeScreen />
      </MemoryRouter>
    );

    expect(screen.getByText(/NeuroSign/i)).toBeInTheDocument();
    expect(screen.getByText(/Rozpocznij skanowanie/i)).toBeInTheDocument();
    expect(screen.getByText(/Funkcje aplikacji/i)).toBeInTheDocument();
  });
});
