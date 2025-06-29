// src/__tests__/FileUploadScreen.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FileUploadScreen from '../components/FileUploadScreen';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mockuj navigate
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

// Mock modelu TensorFlow.js
jest.mock('@tensorflow/tfjs', () => ({
  loadLayersModel: jest.fn().mockResolvedValue({
    predict: jest.fn().mockReturnValue({
      array: () => Promise.resolve([[0.1, 0.9]]),
    }),
  }),
}));

describe('FileUploadScreen', () => {
  const navigateMock = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(navigateMock);
  });

  test('renderuje nagłówek i przycisk', () => {
    render(
      <MemoryRouter>
        <FileUploadScreen />
      </MemoryRouter>
    );

    expect(screen.getByText(/Wgraj obraz do rozpoznania/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Wybierz obraz/i)).toBeInTheDocument();
  });

  test('pokazuje podgląd obrazu i tekst ładowania', async () => {
    const file = new File(['(⌐□_□)'], 'image.png', { type: 'image/png' });

    render(
      <MemoryRouter>
        <FileUploadScreen />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Wybierz obraz/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/Rozpoznawanie znaku/i)).toBeInTheDocument();
    });
  });

  test('nawiguje do result po rozpoznaniu', async () => {
    const file = new File(['data'], 'image.jpg', { type: 'image/jpeg' });

    render(
      <MemoryRouter>
        <FileUploadScreen />
      </MemoryRouter>
    );

    const input = screen.getByLabelText(/Wybierz obraz/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/result', expect.anything());
    });
  });
});
