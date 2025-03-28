# NeuroSign

## 🚀 Opis projektu

**NeuroSign** to aplikacja webowa i mobilna, która wykorzystuje sztuczną inteligencję do rozpoznawania znaków (np. drogowych, tablic rejestracyjnych) na podstawie obrazu z kamery. Działa zarówno w przeglądarce, jak i na urządzeniach mobilnych.

## 🎯 Funkcje

✅ Rozpoznawanie znaków z obrazu kamery 📷\
✅ Obsługa zarówno aplikacji webowej, jak i mobilnej 🌍📱\
✅ Wykorzystanie sieci neuronowych (TensorFlow\.js) 🧠\
✅ OCR do odczytywania znaków tekstowych (Tesseract.js) 🔠\
✅ Historia rozpoznanych znaków 📜\
✅ Przechowywanie wyników w bazie danych ☁️

## 🛠️ Technologie

### Frontend:

- **React.js (Next.js)** – dla wersji webowej 🌐
- **React Native (Expo)** – dla wersji mobilnej 📱
- **Tailwind CSS / ShadCN** – UI i stylizacja 🎨

### Backend:

- **Node.js + Express.js** – API do przetwarzania danych 🖥️
- **Firebase / Supabase** – baza danych i autoryzacja 🔐

### AI / OCR:

- **TensorFlow\.js** – sieć neuronowa do klasyfikacji znaków 🧠
- **Tesseract.js** – OCR do odczytywania tekstu 🔤
- **OpenCV.js** – przetwarzanie obrazu 🎥

## 📦 Instalacja i uruchomienie

### 1️⃣ Klonowanie repozytorium


### 2️⃣ Instalacja zależności

#### Web:


#### Mobile:



### 3️⃣ Konfiguracja środowiska (.env)



## 📸 Jak działa?

1️⃣ Użytkownik otwiera aplikację i pozwala na dostęp do kamery.\
2️⃣ Aplikacja przechwytuje obraz i przetwarza go w czasie rzeczywistym.\
3️⃣ AI klasyfikuje znak lub OCR odczytuje tekst.\
4️⃣ Wynik jest wyświetlany na ekranie i może być zapisany w bazie.

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

5. **Autoryzacja i zarządzanie użytkownikami**  
   - Możliwość logowania i rejestracji użytkowników.
   - 

**Wymagania niefunkcjonalne**  

1. **Wydajność**  
   - Szybkie przetwarzanie obrazu w czasie rzeczywistym. 
   - Optymalizacja kodu i modeli AI do płynnej pracy na urządzeniach mobilnych.  

2. **Skalowalność**  
   - Backend z możliwością rozszerzenia.   

3. **Bezpieczeństwo**  
   - Bezpieczna autoryzacja użytkowników.  
   - Zabezpieczenie przed nieautoryzowanym dostępem do historii detekcji.  

4. **Dostępność**  
   - Aplikacja powinna działać na różnych urządzeniach (telefony, tablety, komputery).  
   - Obsługa różnych systemów operacyjnych (Android, iOS, Windows, macOS).  

5. **Łatwość użytkowania**  
   - Intuicyjny interfejs, prosty onboarding dla nowych użytkowników.   

6. **Rozszerzalność**  
   - Modułowa architektura umożliwiająca dodawanie nowych funkcji.  
   - Możliwość dodania kolejnych modeli AI bez modyfikacji całej aplikacji.
  
**Testy integracyjne dla NeuroSign**  

 **1. Test integracji: Rozpoznawanie znaków z kamery**
📌 **Cel:** Sprawdzenie, czy obraz z kamery jest poprawnie przetwarzany przez model AI i OCR oraz wyświetlany w interfejsie użytkownika.  
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

**2. Test integracji: Zapisywanie historii rozpoznań (frontend + backend + baza danych)**  
📌 **Cel:** Sprawdzenie, czy dane o rozpoznanych znakach są poprawnie zapisywane i pobierane z bazy.  
🛠 **Moduły:**  
- Frontend (React.js / React Native)  
- Backend (Node.js + Express.js)  
- Baza danych (Firebase / Supabase)  

✅ **Kroki testowe:**  
1. Przeprowadź detekcję znaku w aplikacji.  
2. Sprawdź, czy aplikacja wysyła żądanie POST do API backendu.  
3. Sprawdź, czy backend poprawnie zapisuje dane w bazie.  
4. Odśwież aplikację i sprawdź, czy historia detekcji została poprawnie pobrana.  

🛑 **Możliwe błędy:**  
- Dane nie zapisują się w bazie.  
- Historia nie jest pobierana z backendu.  
- Backend zwraca błędy (np. 500 Internal Server Error).  


**3. Test integracji: Pobieranie i analiza statystyk (backend + frontend + baza danych)**  
📌 **Cel:** Sprawdzenie, czy aplikacja poprawnie pobiera i wyświetla statystyki dotyczące rozpoznanych znaków.  
🛠 **Moduły:**  
- Frontend (dashboard statystyk)  
- Backend (API statystyk)  
- Baza danych

✅ **Kroki testowe:**  
1. Otwórz aplikację i przejdź do sekcji „Statystyki”.  
2. Sprawdź, czy aplikacja wysyła żądanie GET do API backendu.  
3. Upewnij się, że backend poprawnie agreguje dane z bazy.  
4. Sprawdź, czy frontend poprawnie wyświetla statystyki (np. liczba wykryć danego znaku).  

🛑 **Możliwe błędy:**  
- Baza danych nie zwraca poprawnych danych.  
- Frontend nie aktualizuje statystyk w czasie rzeczywistym.  
- API zwraca błędy (np. 404 Not Found).  



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

