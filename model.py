import numpy as np  
import pandas as pd  
import os  
import random  
import matplotlib.pyplot as plt  
import tensorflow as tf  
from matplotlib.image import imread  
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img  
from tensorflow.keras.models import Sequential, load_model  
from tensorflow.keras.layers import Dense, Flatten, Conv2D, MaxPooling2D, Dropout  
from tensorflow.keras.optimizers import Adam  

dataset_path = './data/data'  # Ścieżka do folderu zawierającego dane (obrazy znaków drogowych)

train_folder = 'train'  # Nazwa folderu treningowego
test_folder = 'test'    # Nazwa folderu testowego

IMAGE_HEIGHT = 32  # Wysokość obrazu po przeskalowaniu
IMAGE_WIDTH = 32   # Szerokość obrazu po przeskalowaniu

train_gen = ImageDataGenerator(rescale=1.0 / 255)  # Generator do wczytywania i normalizacji danych treningowych
test_gen = ImageDataGenerator(rescale=1.0 / 255)   # Generator do wczytywania i normalizacji danych testowych

train_dataset = train_gen.flow_from_directory(
    batch_size=100,  # Liczba obrazów w jednej paczce (batchu)
    directory=os.path.join(dataset_path, train_folder),  # Pełna ścieżka do folderu treningowego
    class_mode='sparse',  # Klasy zapisane jako liczby całkowite (etykiety)
    shuffle=True,  # Przypadkowe mieszanie danych
    target_size=(IMAGE_HEIGHT, IMAGE_WIDTH)  # Skalowanie obrazów do zadanych wymiarów
)

test_dataset = test_gen.flow_from_directory(
    batch_size=100,  # Liczba obrazów w jednej paczce (batchu)
    directory=os.path.join(dataset_path, test_folder),  # Pełna ścieżka do folderu testowego
    class_mode='sparse',  # Klasy jako liczby całkowite
    shuffle=False,  # Nie mieszaj danych testowych
    target_size=(IMAGE_HEIGHT, IMAGE_WIDTH)  # Skalowanie obrazów do zadanych wymiarów
)

NUM_CLASSES = train_dataset.num_classes  # Liczba klas (unikalnych znaków drogowych)
print(f'Liczba klas: {NUM_CLASSES}')  # Wyświetlenie liczby klas

# Słownik z opisami etykiet (kod znaku => opis po polsku)
label_descriptions = {
    'A-1': 'Niebezpieczny zakręt w prawo',
    'A-11': 'Nierówna droga',
    'A-11a': 'Próg zwalniający',
    'A-12a': 'Zwężenie jezdni - dwustronne',
    'A-14': 'Roboty drogowe',
    'A-15': 'Śliska jezdnia',
    'A-16': 'Przejście dla pieszych',
    'A-17': 'Dzieci',
    'A-18b': 'Zwierzęta dzikie',
    'A-2': 'Niebezpieczny zakręt w lewo',
    'A-20': 'Odcinek jezdni o ruchu dwukierunkowym',
    'A-21': 'Tramwaj',
    'A-24': 'Rowerzyści',
    'A-29': 'Sygnały świetlne',
    'A-3': 'Niebezpieczne zakręty, pierwszy w prawo',
    'A-30': 'Inne niebezpieczeństwo',
    'A-32': 'Oszronienie jezdni',
    'A-4': 'Niebezpieczne zakręty, pierwszy w lewo',
    'A-6a': 'Skrzyżowanie z drogą podporządkowaną występującą po obu stronach',
    'A-6b': 'Skrzyżowanie z drogą podporządkowaną występującą po prawej stronie',
    'A-6c': 'Skrzyżowanie z drogą podporządkowaną występującą po lewej stronie',
    'A-6d': 'Wlot drogi jednokierunkowej z prawej strony',
    'A-6e': 'Wlot drogi jednokierunkowej z lewej strony',
    'A-7': 'Ustąp pierwszeństwa',
    'A-8': 'Skrzyżowanie o ruchu okrężnym',
    'B-1': 'Zakaz ruchu w obu kierunkach',
    'B-18': 'Zakaz wjazdu pojazdów o rzeczywistej masie całkowitej ponad ... t.',
    'B-2': 'Zakaz wjazdu',
    'B-20': 'STOP',
    'B-21': 'Zakaz skręcania w lewo',
    'B-22': 'Zakaz skręcania w prawo',
    'B-25': 'Zakaz wyprzedzania',
    'B-26': 'Zakaz wyprzedzania przez samochody ciężarowe',
    'B-27': 'Koniec zakazu wyprzedzania',
    'B-33': 'Ograniczenie prędkości',
    'B-34': 'Koniec ograniczenia prędkości',
    'B-36': 'Zakaz zatrzymywania się',
    'B-41': 'Zakaz ruchu pieszych',
    'B-42': 'Koniec zakazów',
    'B-43': 'Strefa ograniczonej prędkości',
    'B-44': 'Koniec strefy ograniczonej prędkości',
    'B-5': 'Zakaz wjazdu samochodów ciężarowych',
    'B-6-B-8-B-9': 'Zakaz wjazdu pojazdów innych niż samochodowe',
    'B-8': 'Zakaz wjazdu pojazdów zaprzęgowych',
    'B-9': 'Zakaz wjazdu rowerów',
    'C-10': 'Nakaz jazdy z lewej strony znaku',
    'C-12': 'Ruch okrężny',
    'C-13': 'Droga dla rowerów',
    'C-13-C-16': 'Droga dla pieszych i rowerzystów',
    'C-13a': 'Koniec drogi dla rowerów',
    'C-13a-C-16a': 'Koniec drogi dla pieszych i rowerzystów',
    'C-16': 'Droga dla pieszych',
    'C-2': 'Nakaz jazdy w prawo za znakiem',
    'C-4': 'Nakaz jazdy w lewo za znakiem',
    'C-5': 'Nakaz jazdy prosto',
    'C-6': 'Nakaz jazdy prosto lub w prawo',
    'C-7': 'Nakaz jazdy prosto lub w lewo',
    'C-9': 'Nakaz jazdy z prawej strony znaku',
    'D-1': 'Droga z pierwszeństwem',
    'D-14': 'Koniec pasa ruchu',
    'D-15': 'Przystanek autobusowy',
    'D-18': 'Parking',
    'D-18b': 'Parking zadaszony',
    'D-2': 'Koniec drogi z pierwszeństwem',
    'D-21': 'Szpital',
    'D-23': 'Stacja paliwowa',
    'D-23a': 'Stacja paliwowa tylko z gazem do napędu pojazdów',
    'D-24': 'Telefon',
    'D-26': 'Stacja obsługi technicznej',
    'D-26b': 'Myjnia',
    'D-26c': 'Toaleta publiczna',
    'D-27': 'Bufet lub kawiarnia',
    'D-28': 'Restauracja',
    'D-29': 'Hotel (motel)',
    'D-4': 'Punkt widokowy',
    'D-5': 'Przystanek kolejowy',
    'D-6': 'Przystanek tramwajowy',
    'D-7': 'Stacja rowerów publicznych'
}

# Definicja modelu sieci neuronowej do rozpoznawania znaków drogowych
traffic_model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(IMAGE_HEIGHT, IMAGE_WIDTH, 3)),  # Warstwa konwolucyjna z 32 filtrami 3x3
    MaxPooling2D((2, 2)),  # Warstwa maksymalnego próbkowania (redukcja wymiaru)
    Conv2D(64, (3, 3), activation='relu'),  # Kolejna warstwa konwolucyjna z 64 filtrami
    MaxPooling2D((2, 2)),  # Kolejna warstwa próbkowania
    Flatten(),  # Spłaszczenie danych z 2D do 1D
    Dense(128, activation='relu'),  # Warstwa gęsta z 128 neuronami
    Dropout(0.5),  # Warstwa odrzucająca 50% neuronów losowo (zapobiega przeuczeniu)
    Dense(NUM_CLASSES, activation='softmax')  # Warstwa wyjściowa – klasyfikacja do jednej z klas
])

# Kompilacja modelu – wybór optymalizatora, funkcji straty i metryk
traffic_model.compile(
    optimizer=Adam(learning_rate=0.001),  # Optymalizator Adam z określonym learning rate
    loss='sparse_categorical_crossentropy',  # Funkcja straty odpowiednia dla etykiet jako liczby całkowite
    metrics=['accuracy']  # Metryka: dokładność
)

# Obliczenie liczby kroków (batchów) w jednej epoce dla zbioru treningowego i walidacyjnego
steps_per_epoch = np.ceil(train_dataset.samples / train_dataset.batch_size).astype(int)
val_steps = np.ceil(test_dataset.samples / test_dataset.batch_size).astype(int)


# Trenowanie modelu
training_history = traffic_model.fit(
    train_dataset,  # Dane treningowe
    steps_per_epoch=steps_per_epoch,  # Liczba kroków w epoce
    epochs=10,  # Liczba epok treningowych
    validation_data=test_dataset,  # Dane walidacyjne
    validation_steps=val_steps,  # Liczba kroków walidacyjnych
    verbose=1  # Wypisywanie postępu uczenia
)

traffic_model.save('ReadyModel.h5')  # Zapis wytrenowanego modelu do pliku .h5



# Funkcja do rysowania wykresów dokładności i straty podczas uczenia
def plot_metrics(history):
    training_acc = history.history['accuracy']  # Dokładność treningowa w każdej epoce
    validation_acc = history.history['val_accuracy']  # Dokładność walidacyjna
    training_loss = history.history['loss']  # Strata treningowa
    validation_loss = history.history['val_loss']  # Strata walidacyjna

    epochs_range = range(1, len(training_acc) + 1)  # Zakres epok

    plt.figure(figsize=(14, 6))  # Rozmiar wykresu

    # Wykres dokładności
    plt.subplot(1, 2, 1)
    plt.plot(epochs_range, training_acc, marker='o', linestyle='-', color='green', label='Train Accuracy')
    plt.plot(epochs_range, validation_acc, marker='o', linestyle='--', color='orange', label='Validation Accuracy')
    plt.title('Model Accuracy', fontsize=16)
    plt.xlabel('Epochs', fontsize=12)
    plt.ylabel('Accuracy', fontsize=12)
    plt.xticks(fontsize=10)
    plt.yticks(fontsize=10)
    plt.legend(fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.6)

    # Wykres straty
    plt.subplot(1, 2, 2)
    plt.plot(epochs_range, training_loss, marker='s', linestyle='-', color='blue', label='Train Loss')
    plt.plot(epochs_range, validation_loss, marker='s', linestyle='--', color='red', label='Validation Loss')
    plt.title('Model Loss', fontsize=16)
    plt.xlabel('Epochs', fontsize=12)
    plt.ylabel('Loss', fontsize=12)
    plt.xticks(fontsize=10)
    plt.yticks(fontsize=10)
    plt.legend(fontsize=10)
    plt.grid(True, linestyle='--', alpha=0.6)

    plt.tight_layout()  # Automatyczne dopasowanie elementów na wykresie
    plt.show()  # Wyświetlenie wykresów


plot_metrics(training_history)  # Wywołanie funkcji rysującej wykresy dla historii uczenia
