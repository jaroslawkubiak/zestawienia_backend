# ENGLISH VERSION

# Interior Design Project Manager – Backend

A backend system for managing interior design projects, built with **NestJS**.  
It is responsible for business logic, authentication, database operations, email delivery, and file management.

The system is designed as a **role-based API** supporting multiple user types: designers, clients, and suppliers — with a strong focus on security and clear data access separation.

---

# SCREENSHOTS

<div style="display:flex; gap:24px; align-items:flex-start;">
  <!-- Lewa kolumna -->
  <div style="display:flex; flex-direction:column; gap:16px;">
    <p>Set edit view on summary tab</p>
    <img src="example-files/screenshots/set-edit-summary-tab.jpg" width="400" alt="Set edit view on bookmark page">
    <p>Set edit view - bathroom tab</p>
    <img src="example-files/screenshots/set-edit-bathroom-tab.jpg" width="400" alt="Set edit view - bathroom tab">
    <p>Status select menu - every status has different row color</p>
    <img src="example-files/screenshots/status-list.jpg" width="400" alt="Status select menu">
    <p>Client list view</p>
    <img src="example-files/screenshots/client-list-view.jpg" width="400" alt="Client list view">
    <p>Edit client modal</p>
    <img src="example-files/screenshots/client-edit-page.jpg" width="400" alt="Edit client modal">
    <p>Notification popup</p>
    <img src="example-files/screenshots/notification-popup.jpg" width="400" alt="Notification popup">
  </div>

  <!-- Prawa kolumna -->
  <div style="display:flex; flex-direction:column; gap:16px;">
    <p>Send files modal with directory to select</p>
    <img src="example-files/screenshots/send-files-modal.jpg" width="400" alt="Send files modal with directory to select">
    <p>Send files modal with selected files to send</p>
    <img src="example-files/screenshots/send-files-modal-with-selected-files.jpg" width="400" alt="Send files modal with selected files to send">
    <p>Show files modal - icon view</p>
    <img src="example-files/screenshots/show-files-modal-icon-view.jpg" width="400" alt="Show files modal - icon view">
    <p>Show files modal - list view</p>
    <img src="example-files/screenshots/show-files-modal-list-view.jpg" width="400" alt="Show files modal - list view">
    <p>Delete secelted files</p>
    <img src="example-files/screenshots/delete-files-confirmation-popup.jpg" width="400" alt="Delete selected files">
  </div>
</div>

## 🛠️ Tech Stack

- **NestJS**
- **TypeScript**
- **TypeORM**
- **MySQL**
- JWT authentication
- File handling (upload / download)
- SMTP & email templates

---

## 🔐 Authentication & Security

- user authentication using JWT,
- password change functionality,
- protected API endpoints,
- public, hash-based links (access without an account),
- logging client and supplier access via email links.

---

## 🗄️ Data Model

The backend manages, among others:

- users,
- clients,
- suppliers,
- project specifications,
- specification items,
- comments,
- attachments,
- email sending history.

Each core entity includes:

- created by / updated by information,
- creation and update dates,
- timestamp fields.

---

## 📊 Specifications & Items

- creation of project specifications with automatic numbering,
- specification statuses (new, in preparation, open, in progress, closed),
- items with:
  - net / gross prices,
  - quantities,
  - statuses affecting total calculations,
- automatic value recalculations,
- updating item counters for assigned suppliers.

---

## 🖼️ Files & Attachments

- file uploads with a structured directory layout,
- generation of first-page PDF thumbnails for preview,
- generation of image thumbnails for previews,
- downloading individual files,
- downloading selected files as ZIP archives,
- clients can upload files to their own **Inspirations** folder
  - and remove them if needed,
- users can upload files to multiple folders:
  - moodboards,
  - 3D models,
  - functional layouts,
  - visualizations,
  - invoices,
- a **hidden “Working files” folder**, visible only to studio users,
- storing file metadata in the database,
- PDF preview and thumbnail support.

---

## 📧 Email System

- sending emails to:
  - clients,
  - suppliers,
- multiple email templates (offer / order / welcome),
- email sending history stored in the database,
- hash-based links providing access without login for clients and suppliers,
- notifications about comments and project updates.

---

## 💬 Comments & Communication

- comments assigned to items and specifications,
- comment editing and deletion,
- read / unread status tracking,
- notifications for new messages,
- optional email notifications.

---

## ⚙️ Architecture

- modular NestJS architecture,
- clear separation into:
  - controllers,
  - services,
  - entities,
  - DTOs,
- prepared for:
  - global error interceptors,
  - centralized error logging,
  - further API expansion.

---

## 🚀 Project Status

The backend is stable and actively used in a production environment.  
Planned improvements include:

- centralized error logging,
- extended notification system,
- full email automation,
- additional security enhancements.

---

## 👤 Author

This project was created as a real-world system supporting the daily work of an interior design studio  
and as a **backend portfolio project**.

# POLISH VERSION

# Interior Design Project Manager – Backend

Backend systemu do zarządzania projektami wnętrz, zbudowany w **NestJS**.  
Odpowiada za logikę biznesową, autoryzację, obsługę bazy danych, wysyłkę e-maili oraz zarządzanie plikami.

System został zaprojektowany jako **API obsługujące wiele ról użytkowników**: projektantów, klientów i dostawców – z naciskiem na bezpieczeństwo oraz czytelny podział dostępu do danych.

---

## 🛠️ Stack technologiczny

- **NestJS**
- **TypeScript**
- **TypeORM**
- **MySQL**
- JWT Authentication
- Obsługa plików (upload / download)
- SMTP / e-mail templates

---

## 🔐 Autoryzacja i bezpieczeństwo

- logowanie użytkowników (JWT),
- zmiana hasła,
- zabezpieczenie endpointów,
- publiczne linki z hashami (dostęp bez konta),
- logowanie wejść klientów i dostawców przez linki z e-maili.

---

## 🗄️ Model danych

Backend obsługuje m.in.:

- użytkowników (users),
- klientów,
- dostawców,
- zestawienia projektowe,
- pozycje zestawień,
- komentarze,
- załączniki,
- historię wysłanych e-maili.

Każda kluczowa encja zawiera:

- informacje o autorze zmian,
- daty utworzenia i aktualizacji,
- znaczniki czasowe (timestamp).

---

## 📊 Zestawienia i pozycje

- tworzenie zestawień z automatyczną numeracją,
- statusy zestawień (nowe, w przygotowaniu, otwarte, w realizacji, zamknięte),
- pozycje z:
  - cenami netto / brutto,
  - ilościami,
  - statusami wpływającymi na sumowanie,
- automatyczne przeliczanie wartości,
- aktualizacja ilości pozycji u dostawców.

---

## 🖼️ Pliki i załączniki

- upload plików do struktury katalogów:
- generowanie miniatur pierszej strony PDF do podglądu
- generowanie miniatur plików graficznych do podglądu
- pobieranie pojedynczych plików
- pobieranie zaznaczonych plików jako ZIP
- klient może dodawać pliki do swojego katalogu: inspiracje
  -może je też usuwać
- użytkownik może dodawać do różnych katalogów: moodboardy, modele 3D, układ funkcjonalny, wizualizacje, faktury
- ukryty dla klienta katalog : robocze, widoczny tylko dla użytkowników biura
- zapisywanie metadanych plików w bazie,
- podgląd PDF i miniatur.

---

## 📧 System e-mail

- wysyłka e-maili do:
  - klientów,
  - dostawców,
- różne szablony wiadomości (oferta / zamówienie / welcome),
- rejestr wysłanych e-maili w bazie,
- linki z hashami umożliwiające dostęp bez logowania dla klientów i dostawców,
- powiadomienia o komentarzach i zmianach.

---

## 💬 Komentarze i komunikacja

- komentarze przypisane do pozycji i zestawień,
- edycja i usuwanie komentarzy,
- oznaczanie komentarzy jako przeczytane,
- notyfikacje o nowych wpisach,
- możliwość wysyłki powiadomień e-mail.

---

## ⚙️ Architektura

- modularna struktura NestJS,
- wyraźny podział na:
- kontrolery,
- serwisy,
- encje,
- DTO,
- przygotowane miejsce pod:
- globalny interceptor błędów,
- system logowania błędów,
- dalszą rozbudowę API.

---

## 🚀 Status projektu

Backend jest stabilny i używany w środowisku produkcyjnym.  
Dalszy rozwój obejmuje:

- centralne logowanie błędów,
- rozbudowę notyfikacji,
- pełną automatyzację wysyłek e-mail,
- dalsze usprawnienia bezpieczeństwa.

---

## 👤 Autor

Projekt stworzony jako system realnie wspierający pracę biura projektowania wnętrz  
oraz jako **element portfolio backendowego**.
