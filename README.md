TODO LIST

[x] Logowanie do aplikacji,

Zakładka zestawienia:
[x] Lista zestawień klientów
[ ] checkbox do pokaza statusu zamkniętych zestawień (domyślnie zamknięte nie będą pobierane)

Nowe zestawienie
[x] dodawanie nowego zestawienia
[x] przekierowanie do edit-set
[x] zapis pozycji do db
[x] aktualizacja setCount w klientach

Edycja zestawienia:
[x] zmiana statusu
[x] zmiana ilości zakładek (bookmarks)
[x] obiekt z szerokościami zapisywany na etapie dodawania nowego zestawienia z domyślnymi wartościami
[x] odczyt i zapis szerokości kolumn dla każdej zakładki i dla każdego zestawienia
[x] dołączyć listę szerokości do obiektu bookmarks w zestwieniach
[x] zmiana pozycji poprzed drag and drop i update property kolejność w db
[x] domyślnie sortowanie po kolejności gdy wyświetlane są pozycje
[ ] filtrowanie pozycji po zapisie, tylko faktycznie edytowane pozycje wysyłać na backend, aby nie ustawiać wszędzie updatedAt dla niezmienionych pozycji
[x] dodanie pustej pozycji
[x] dodanie pustej pozycji gdy na zakładce nie ma ani jednej pozycji
[x] klonowanie wybranej pozycji
[x] usuwanie pozycji
[x] obliczanie ceny brutto, wartości netto i wartości brutto
[x] update cen gdy zmienimy ilosc lub cene netto
[x] update footera z sumami poszczególnych kolumn
[x] wysyłanie obrazów do katalogów /uploads/sets/SETID/POSITIONID/ FILENAME
[x] przy edycji pozycji - aktualizacja positionCount w dostawcach

[x] statusy do zestawień: w przygotowaniu, gotowy, otwarty, w realizacji, zamknięty

Klienci:
[x] dodawanie nowych klientów
[x] edycja klienta
[x] usuwanie klienta

Dostawcy:
[x] dodawanie nowych dostawców
[x] edycja dostawcy
[x] usuwanie dostawcy
[x] email wymagany
[x] hash generowany do linków

Ustawienia:
[ ] dodawanie/usuwanie produktow
[ ] lista kolumn widocznych w danej kategorii zestawienia (lub na stałe w kodzie)
[ ] domyślna szerokość kolumn pozycji ładoawna z DB, a nie z const
[ ] edycja wiadomości email do klientów
[ ] edycja wiadomości email do dostawców

Pozycje:
[x] dodać createBy, updateBy, CreateDate, UpdateDate, createTimestamp, updateTimestamp

Emails:
[x] wysyłka email z linkiem do zestawienia do klientów (setId/setHash)
[ ] działający link bez logowania hash łączony z id zestawienia do podglądu dla klientów np: /:id_zestawienia/:hash_zestawienia
[ ] wysyłka email z linkiem do części pozycji do której przypisany jest dostawaca (/setId/setHash/SupplierHash)
[ ] lista wysłanych emaili do klientów
[ ] przed wysyłką możliwa edycja wiadomości?

comments:
[ ] dodawanie komentarzy przez klientów
[ ] notyfikacja o nowych komentarzach
[ ] odpowiedź na komentarze w formie iMessage :)

DB:
[x] zestawienia nagłówek: id, nr zestawienia, id klienta, id usera, data dodania (w czytelnym formacie), created by, create date (timestamp), update by, updated date (timestamp)
[x] zestawienia pozycje: id, id zestawienia, id klienta, reszta kolumn
[x] users: imie, login, haslo
[x] klienci: id, imie, nazwisko, email, inne kolumny?
[x] komentarze: id, productid, zestawienie id, comment, createBy, createDate, date timestamp
[ ] rejestracja wysłanych emaili do klientów i dostawców
[x] imię i nazwisko klienta, email, nr zestawienia generowany autmatycznie, hash (20 znaków) do podglądu generowany automatycznie

issue:
[x] zmiana dostawcy w zestawieniach na ostatniej pozycji - menu się chowa pod tabele
[x] klienci i dostawcy - form nie walidny - pokaż errors,
[x] przerobić form klientów i dostawców na nowy styl z new set
[x] oznaczyć pola obowiązkowe

generowanie PDF! :(
wysyłka zestawień do wybranego dostawcy, do różnych dostawców, linki z hashami dostawców i id zestawienia
klonowanie pozycji

akcje: na liście pozycji

- usunięcie
- klonowanie pozycji (pytanie czy bezpośrednio pod spodem czy na końcu listy)

status pozycji:

- do wyboru (różowy)
- zapłacony/zamóiony (zielony)
- w trakcie wyceny (czerwony)
  to może się przydać Conditional Style

obgadać:
- statusy, kiedy jaki ma się zmienić
- email: tytuły i treść emaili do klientów i dostawców
- skąd wysyłać email do dostawcy? gdzie guzik?
- upload dodatkowych plików do zestawień
- KOLORY! Design itp :)
- jaki design dla klientów? jaki layout?




npx typeorm-model-generator -h localhost -d zestawienia -u root -x -e mysql

pm2 start dist/main.js --name zestawienia
pm2 save
pm2 startup

curl -i http://localhost:3005/

netstat -tulnp | grep 3005
