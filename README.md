TODO LIST

[ ] Logowanie do aplikacji, 
[ ] Zakładka zestawienia:
[ ] Lista zestawień klientów

[ ] Nowe zestawienie:

[ ] imię i nazwisko klienta, email, nr zestawienia generowany autmatycznie, hash (20 znaków) do podglądu generowany automatycznie

[ ] hash łączony z id zestawienia do podglądu dla klientów np: /:id_zestawienia/:hash_zestawienia



DB:
[ ] zestawienia nagłówek: id, nr zestawienia, id klienta, id usera, data dodania (w czytelnym formacie), created by, create date (timestamp), updata by, updated date (timestamp)
[ ] zestawienia pozycje: id, id zestawienia, id klienta, reszta kolumn
[ ] users: imie, login, haslo
[ ] klienci: id, imie, nazwisko, email, inne kolumny?
[ ] komentarze: id, productid, zestawienie id, comment, createBy, createDate, date timestamp

pm2 start dist/main.js --name zestawienia
pm2 save
pm2 startup

curl -i http://localhost:3005/

netstat -tulnp | grep 3005
