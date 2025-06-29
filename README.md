# NeuroSign

## 🚀 Opis projektu

**NeuroSign** to aplikacja webowa i mobilna, która wykorzystuje sztuczną inteligencję do rozpoznawania znaków (np. drogowych, tablic rejestracyjnych) na podstawie obrazu z kamery. Działa zarówno w przeglądarce, jak i na urządzeniach mobilnych.

## 🎯 Funkcje

✅ Rozpoznawanie znaków z obrazu kamery 📷\
✅ Obsługa zarówno aplikacji webowej, jak i mobilnej 🌍📱\
✅ Wykorzystanie sieci neuronowych (TensorFlow\.js) 🧠\
✅ Historia rozpoznanych znaków 📜\

## 🛠️ Technologie

### Frontend:

- **React.js** – dla wersji webowej 🌐
- **React Native (Expo)** – dla wersji mobilnej 📱

### AI / OCR:

- **TensorFlow\.js** – sieć neuronowa do klasyfikacji znaków 🧠
- **OpenCV.js** – przetwarzanie obrazu 🎥

## 📦 Instalacja i uruchomienie


### 1️⃣ Klonowanie repozytorium



### 2️⃣ Instalacja zależności

#### Web:


#### Mobile:

## Uruchomienie:
**Przed uruchominiem wymagana jest instalacja środowiska expo instalacja dostepna jest pod tym linkiem : https://docs.expo.dev/**
1. **npm install** 
2. **npx expo install --fix**  
3. **npx expo start -c**

 **Po wpisaniu powyższych komend powinien pojawić się kod qr** 





### 3️⃣ Konfiguracja środowiska (.env)
1. **Utwórz wirtualne środowisko python -m venv myVenv**
2. **Aktywuj środwisko .\myVenv\Scripts\Activate**
3. **Zainstaluj biblioteki pip install -r requirements.txt**


## 📸 Jak działa?

1️⃣ Użytkownik otwiera aplikację i pozwala na dostęp do kamery.\
2️⃣ Aplikacja przechwytuje obraz i przetwarza go w czasie rzeczywistym.\
3️⃣ AI klasyfikuje znak\
4️⃣ Wynik jest wyświetlany na ekranie i zapisywany w historii.

**Wymagania funkcjonalne**  

1. **Rozpoznawanie znaków z obrazu**  
   - Wykorzystanie **TensorFlow.js** do klasyfikacji znaków.  

2. **Obsługa aplikacji webowej i mobilnej**  
   - Wersja **webowa** działająca w przeglądarce.  
   - Wersja **mobilna** dla Androida i iOS.  

3. **Interfejs użytkownika**  
   - Przejrzysty UI.    

4. **Historia rozpoznanych znaków**  
   - Zapis historii detekcji w bazie danych. 
   - Możliwość przeglądania historii.

**Wymagania niefunkcjonalne**  

1. **Wydajność**  
   - Szybkie przetwarzanie obrazu w czasie rzeczywistym. 
   - Optymalizacja kodu i modeli AI do płynnej pracy na urządzeniach mobilnych.  

2. **Skalowalność**  
   - Backend z możliwością rozszerzenia.   

3. **Dostępność**  
   - Aplikacja powinna działać na różnych urządzeniach (telefony, tablety, komputery).  
   - Obsługa różnych systemów operacyjnych (Android, iOS, Windows, macOS).  

4. **Łatwość użytkowania**  
   - Intuicyjny interfejs, prosty onboarding dla nowych użytkowników.   

5. **Rozszerzalność**  
   - Modułowa architektura umożliwiająca dodawanie nowych funkcji.  
   - Możliwość dodania kolejnych modeli AI bez modyfikacji całej aplikacji.
  
**Testy integracyjne dla NeuroSign**  

 **1. Test integracji: Rozpoznawanie znaków z kamery**
📌 **Cel:** Sprawdzenie, czy obraz z kamery jest poprawnie przetwarzany przez model AI oraz wyświetlany w interfejsie użytkownika.  
🛠 **Moduły:**  
- Frontend (React.js / React Native)  
- TensorFlow.js (model AI)  

✅ **Kroki testowe:**  
1. Otwórz aplikację i przyznaj dostęp do kamery.  
2. Skieruj kamerę na znak drogowy lub tablicę rejestracyjną.  
3. Sprawdź, czy obraz został przechwycony poprawnie.  
4. Upewnij się, że AI zwróciło prawidłowy typ znaku.  
5. Sprawdź, czy OCR poprawnie rozpoznał tekst na znaku.  
6. Sprawdź, czy wynik został wyświetlony w UI.  

🛑 **Możliwe błędy:**  
- Model AI nie rozpoznaje znaku poprawnie.  
- OCR nie odczytuje tekstu lub zwraca błędne znaki.  
- Brak obrazu z kamery w UI.  

---

**2. Test integracji: Zapisywanie historii rozpoznań**  
📌 **Cel:** Sprawdzenie, czy dane o rozpoznanych znakach są poprawnie zapisywane w historii.  
🛠 **Moduły:**  
- Frontend (React.js / React Native)

✅ **Kroki testowe:**  
1. Przeprowadź detekcję znaku w aplikacji.  
2. Sprawdź, czy backend poprawnie zapisuje dane w historii.  
3. Odśwież aplikację i sprawdź, czy historia detekcji została poprawnie pobrana.  

🛑 **Możliwe błędy:**  
- Dane nie zapisują się w historii.  


## 🎯 Przyszłe usprawnienia

- 🚀 Wsparcie dla większej liczby znaków
- 🌍 Rozpoznawanie w różnych językach
- 📊 Statystyki i analiza rozpoznanych znaków

## 👥 Autorzy

- **Kacper Pocha**
- **Kamil Mędrala** 

## 📄 Licencja

Projekt udostępniany na licencji **MIT**. Możesz swobodnie go rozwijać i modyfikować.

---

💡 Masz pomysł na usprawnienie? **Otwórz issue** lub **stwórz pull request**! 🚀

