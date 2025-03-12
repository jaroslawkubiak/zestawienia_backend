TODO LIST

[x] Logowanie do aplikacji,

Zakładka zestawienia:
[x] Lista zestawień klientów

[ ] Nowe zestawienie:

[x] imię i nazwisko klienta, email, nr zestawienia generowany autmatycznie, hash (20 znaków) do podglądu generowany automatycznie

[ ] hash łączony z id zestawienia do podglądu dla klientów np: /:id_zestawienia/:hash_zestawienia
[ ] statusy do zestawień: w przygotowaniu, gotowy, otwarty, zamknięty

Klienci:
[x] dodawanie nowych klientów
[x] edycja klienta
[x] usuwanie klienta

Dostawcy:
[x] dodawanie nowych dostawców
[x] edycja dostawcy
[x] usuwanie dostawcy

Ustawienia:
[ ] dodawanie/usuwanie produktow
[ ] lista kolumn widocznych w danej kategorii zestawienia (lub na stałe w kodzie)

Pozycje:
[ ] dodać createBy, updateBy, CreateDate, UpdateDate, createTimestamp, updateTimestamp

DB:
[x] zestawienia nagłówek: id, nr zestawienia, id klienta, id usera, data dodania (w czytelnym formacie), created by, create date (timestamp), update by, updated date (timestamp)
[x] zestawienia pozycje: id, id zestawienia, id klienta, reszta kolumn
[x] users: imie, login, haslo
[x] klienci: id, imie, nazwisko, email, inne kolumny?
[x] komentarze: id, productid, zestawienie id, comment, createBy, createDate, date timestamp

pm2 start dist/main.js --name zestawienia
pm2 save
pm2 startup

curl -i http://localhost:3005/

netstat -tulnp | grep 3005
