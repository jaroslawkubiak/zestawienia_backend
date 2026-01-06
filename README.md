TODO LIST

[x] Logowanie do aplikacji,
[x] Zmiana hasła przez usera

Poprawić:
[x] klik poza modalem zamyka go
[x] gdy usuwasz klienta bez nazwy firmy - pusto w komunikacie
[x] kopiuj link do klienta otwiera okno emaila
[ ] wygląd/layout wszystkich komentarzy
[ ] wygląd/layout linku dla dostawców
[ ] wygląd/layout linku dla klientów
[x] /me jest także używane do external links
[x] dodać folder z hashem do plików zestawień /uploads/sets/:setId/:setHash/positions
[ ] przy usuwaniu set - usunąć komentarze i całą resztę z DB
[ ] linki w komentarzach. mają działać
[ ] jak klient wrzuca pliki to nie uaktualnia się badge z ilością

Nowe do poprawy
[x] wszystkie kolumny pozycji - tekst wyśrodkowany
[x] pozycja link klikalny
[ ] nowa kolumna - uwagi textarea - jako ostatania w kolejności
[ ] meble na wymiar i meble gotowe jako osobne zakładki
[ ] w komentarzach imię i nazwisko
[ ] powiadomienie klienta po 10min od dodania ostatniego komentarza
[ ] podsumowanie komentarzy dla klienta
[ ] dostawca ma widzieć wszystkie dane klienta i nazwę inwestycji
[ ] dostawca: kolejność kolumna taka sama, ukryć: ceny i wartości, status, footer
[ ] rok w stopkach atumatycznie
[ ] dwie templatki z emailem do dostawców: oferta domyślna, zamówienie jako drugie.
Tytuł zamówienie
message: Proszę o realizację zamówienia zgodnie z przesłanym zestawieniem. Prosimy o wystawienie proformy na dane klienta. (wkleić tu dane klienta)
[ ] lista emaili wysłanych - zły link do klienta
[x] guzik zapisz na wysokości bookmarks po prawej
[ ] w nazwie pdf dodać nazwę inwestycji
[ ] pdf automatycznie na ftp i ma się dodawać każdy kolejny pdf, nie usuwać poprzednich

SPRAWDZIĆ NA PROD:
[x] wklejanie obrazów do pozycji i poprawne ich wyświetlanie
[x] wysyłka plików załączników do zestawienia
[x] pobieranie plików załączników z zestawienia
[x] tworzenie PDF
[ ] wysyłka email z poczty firmowej do klientów - nie z gmail
[ ] wysyłka email z poczty firmowej do dostawców - nie z gmail
[x] działanie linków dla klienta (logowanie wpisów w DB)
[x] działanie linków dla dostawcy (logowanie wpisów w DB)
[ ] brak obrazków w podglądzie email
[ ] brak miniatur PDF
[ ] w widoku dużych ikon brak domyślnej ikony pdf

Admin:
[ ] Logowania użytkowników - lista w ukrytym menu
[ ] system logowania błędów

Po zalogowaniu:
[x] Podsumowanie nowych - nieprzeczytanych komentarzy
[x] Gdy klient skończy dodawać komentarze - wysłać email z powiadomieniem do biura

Zakładka zestawienia:
[x] Lista zestawień klientów
[x] checkbox do pokazania statusu zamkniętych zestawień (domyślnie zamknięte nie będą pobierane)

Nowe zestawienie
[x] dodawanie nowego zestawienia
[x] przekierowanie do edit-set
[x] zapis pozycji do db
[x] aktualizacja setCount w klientach
[x] adres inwestycji: textarea

Edycja zestawienia:
[x] zmiana pozycji poprzed drag and drop i update property kolejność w db
[x] domyślnie sortowanie po kolejności gdy wyświetlane są pozycje
[x] dodanie pustej pozycji
[x] dodanie pustej pozycji gdy na zakładce nie ma ani jednej pozycji
[x] klonowanie wybranej pozycji
[x] usuwanie pozycji
[x] update cen gdy zmienimy ilosc lub cene netto
[x] przy edycji pozycji - aktualizacja positionCount w dostawcach
[x] statusy do zestawień: w przygotowaniu, gotowy, otwarty, w realizacji, zamknięty
[x] status pozycji: (inne tło w zależności od statusu)
[x] wklejanie obrazów do pozycji ze schowka
[x] możliwość wpisywania ceny netto lub brutto.
[x] usunąć z footer ilość, netto i brutto
[x] pola w pozycji jako textarea
[x] podgląd obrazków pozycji na całej stronie: ikona lupy albo coś podobnego
[ ] zmiana kolejności poprzez wpisanie nr pozycji w kolumnie LP

[x] nowe Bookmarks:
1 PODSUMOWANIE
2 OŚWIETLENIE, OSPRZĘT ELEKTRYCZNY
3 ŁAZIENKA
4 KUCHNIA
5 PŁYTKI CERAMICZNE
6 MEBLE NA WYMIAR, MEBLE GOTOWE
7 ŚCIANY, SUFITY, PODŁOGI

Edycja nagłówka zestawienia:
[x] zmiana statusu
[x] zmiana ilości zakładek (bookmarks)
[x] obiekt z szerokościami zapisywany na etapie dodawania nowego zestawienia z domyślnymi wartościami
[x] odczyt i zapis szerokości kolumn dla każdej zakładki i dla każdego zestawienia
[x] dołączyć listę szerokości do obiektu bookmarks w zestwieniach

Footer zestawienia:
[x] obliczanie ceny brutto, wartości netto i wartości brutto
[x] update footera z sumami poszczególnych kolumn

Załączniki zestawienia:
[x] wysyłanie obrazów i innych plikó do katalogów /uploads/sets/SETID/POSITIONID/ FILENAME
[x] podgląd minatur pliku pdf
[x] pobieranie załączników na dysk
[x] usuwanie załączników

Generowanie zestawienia w formie PDF:
[x] generowanie PDF! :)
[x] umieszczanie obrazów w odpowiedniej kolumnie
[x] nagłowek i stopka na każdej stronie pdf
[x] footer z podsumowaniem tylko na końcu tabeli - nie na każdej stronie
[x] przy generowaniu pdf możliwe 3 scenariusze: 1 - otwiera pdf w nowej zakłądce, 2 - zapisuje pdf na dysku, 3 - wysyła pdf na serwer ftp
[x] różne tło wiersza w zależności od statusu
[x] zakładka podsumowanie w PDF

Emails:
[x] wysyłka zestawienia via email w postaci HTML do klienta z linkiem do podglądu
[x] wysyłka zestawień do wybranego dostawcy, do różnych dostawców, linki z hashami dostawców i id zestawienia
[x] generowanie menu z listą dostawców dla danego zestawienia - po zmianie i zapisaniu zmian, menu się odświeża
[x] data ostatniego wysłanego emaila do klienta i dostawców w menu
[x] Email do biura z informacją o dodaniu komentarzy przez klienta
[x] linki do aplikazji w emailach z komentarzami

Klienci:
[x] dodawanie nowych klientów
[x] edycja klienta
[x] usuwanie klienta
[x] jedno pole rozszerzone textarea z: firma z nip, adres, ulica, miasto, kod, email, telefon
[x] guzik kopiowania adresu do schowka
[x] widok dla klienta z zakładkami do przełączania, podsumowanie wart netto i brutto

Dostawcy:
[x] dodawanie nowych dostawców
[x] edycja dostawcy
[x] usuwanie dostawcy
[x] email wymagany
[x] hash generowany do linków

[x] nowa kolumna dane firmy: adres, nip - textarea
[x] guzik kopiowania adresu do schowka
[x] gdy nie ma wpisanego linku produktu to nadal mam napis link w tabeli

Emails:
[x] wysyłka email z linkiem do zestawienia do klientów (setId/setHash)
[x] działający link bez logowania hash łączony z id zestawienia do podglądu dla klientów np: /:id_zestawienia/:hash_zestawienia
[x] wysyłka email z linkiem do części pozycji do której przypisany jest dostawaca (/setId/setHash/SupplierHash)
[x] lista wysłanych emaili do klientów z podglądem wysłanej wiadomości
[x] przed wysyłką możliwa edycja wiadomości
[x] działający link bez logowania do podglądu dla dostawców np: /:id_zestawienia/:hash_zestawienia/:hash_dostawcy

comments:
[x] powiadomienie przy guziku komentarzy o ilości:
[x] w komentarzach po kliknięciu na nazwę pozycji przenosi do eydcji
[x] dodawanie komentarzy przez klientów
[x] edycja komentarzy przez klientów
[x] modyfikacja statusu odczynia komentarzy przez klientów
[x] notyfikacja o nowych komentarzach
[x] odpowiedź na komentarze w formie iMessage :)
[x] edycja komentarzy usera
[x] usuwanie komentarzy usera
[x] oznaczanie które komentarze klienta są nieprzeczytane

status:
[x] nowe zestawienie ze statusem nowe, przy dodaniu pierwszej pozycji zmiana statusu na w przygotowaniu i blokada usuwania

załączniki:
[x] zapis plików w DB: nazwa pliku, data doodania, kto dodał, rozszerzenie, folder (będzie kilka)
[x] wybór folderu przy uploadzie plików
[x] foldery: moodboard, model3d, rysunki wykonawcze, wizualizacje.
[x] widok listy z sortowaniem
[x] osobny folder: robocze - niewidoczny dla klienta
[x] załączniki: pobierz wszystkie, najlepiej w zip

DB:
[x] zestawienia nagłówek: id, nr zestawienia, id klienta, id usera, data dodania (w czytelnym formacie), created by, create date (timestamp), update by, updated date (timestamp)
[x] zestawienia pozycje: id, id zestawienia, id klienta, reszta kolumn
[x] users: imie, login, haslo
[x] klienci: id, imie, nazwisko, email, inne kolumny?
[x] komentarze: id, productid, zestawienie id, comment, createBy, createDate, date timestamp
[x] rejestracja wysłanych emaili do klientów i dostawców
[x] imię i nazwisko klienta, email, nr zestawienia generowany autmatycznie, hash (20 znaków) do podglądu generowany automatycznie
[x] Pozycje: dodać createBy, updateBy, CreateDate, UpdateDate, createTimestamp, updateTimestamp

issue:
[x] zmiana dostawcy w zestawieniach na ostatniej pozycji - menu się chowa pod tabele
[x] klienci i dostawcy - form nie walidny - pokaż errors,
[x] przerobić form klientów i dostawców na nowy styl z new set
[x] oznaczyć pola obowiązkowe
[x] footer w pdf wkleja się na każdej stronie zamiast po całej tabeli

[x] legenda statusy/kolory:

- biały - domyślny (sumować)
- różowy - W trakcie wyceny (nie sumować)
- żółty - zamiennik (nie sumować)
- jasnozielony - produk zaakceptowany (sumować)
- czerwony - produkt niezakupiony (sumować)
- zielone - produkt zakupiony (sumować)

obgadać:

- email: tytuły i treść emaili do klientów i dostawców
- KOLORY! Design itp :)
- jaki design dla klientów? jaki layout?

npx typeorm-model-generator -h localhost -d zestawienia -u root -x -e mysql

PRODUCTION ISSUE:
[x] Przy przejściu na pustą stronę, gdy jestem zalogowany, pokazuje login page
[x] nie ładuje podglądu obrazów
[x] pliki ładuje do katalogu src/uploads, a nie od razu do uploads
[x] widoczne menu bez logowania

Doprecyzować:
[ ] kolory statusów
[ ] PDF - legenda w podsumowaniu?
[ ] PDF - tryb: zapis, otwórz, FTP?
[ ] Domyślne treści emaili: do klienta, do dostawcy, z podsumowaniem komentarzy
