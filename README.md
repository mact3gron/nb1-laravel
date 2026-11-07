
# NB I. Labdarúgás

Webprogramozás II. – Előadás beadandó

Neumann János Egyetem – GAMF

## Készítők

- Farkas Tamás – PLPJEB
- Fodor Árpád – U4BKST

## A projekt bemutatása

Az alkalmazás a magyar NB I. labdarúgó-bajnokság
klubjainak és játékosainak adatait mutatja be.

A weboldal Laravel backenddel, React és TypeScript
frontenddel, valamint MySQL-adatbázissal készült.

## Felhasznált technológiák

- PHP
- Laravel 12
- React
- TypeScript
- Inertia.js
- MySQL
- Eloquent ORM
- Tailwind CSS
- Chart.js
- Git és GitHub

## Adatbázis

A projekt három fő adatbázistáblát használ:

### klub

- id
- csapatnev

### poszt

- id
- nev

### labdarugo

- id
- mezszam
- klubid
- posztid
- utonev
- vezeteknev
- szulido
- magyar
- kulfoldi
- ertek

Az adatbázis Laravel migrációkkal és
seederekkel állítható elő.

## Funkciók

### Nyilvános funkciók

- Főoldal
- Klubok megtekintése
- Labdarúgók megtekintése
- Adatbázis keresése
- Kapcsolatfelvételi űrlap
- Üzenetküldés regisztráció nélkül
- Diagram
- Csapaterősség
- Összehasonlítás

### Regisztrált felhasználók

- Bejelentkezés
- Kijelentkezés
- Felhasználói Dashboard
- Beérkezett üzenetek megtekintése

### Adminisztrátor

- Adminpanel
- Klubok listázása
- Új klub létrehozása
- Meglévő klub módosítása
- Klub törlése
- React + Axios CRUD – játékosok hozzáadása, módosítása és törlése.
- Automatizált tesztek

A klubok kezelését Laravel middleware
védi. A CRUD műveletek kizárólag
adminisztrátori jogosultsággal érhetők el.

## Telepítés helyi környezetben

### 1. Projekt letöltése

Klónozzuk a GitHub repositoryt.

### 2. PHP-függőségek

```bash
composer install
```

### 3. JavaScript-függőségek

```bash
npm ci
```

### 4. Környezeti fájl

Másoljuk a `.env.example` fájlt `.env` néven.

Állítsuk be a MySQL-kapcsolatot
a helyi környezetnek megfelelően.

### 5. Alkalmazáskulcs

```bash
php artisan key:generate
```

### 6. Adatbázis előkészítése

```bash
php artisan migrate
```

Az NB I. forrásadatok betöltése:

```bash
php artisan db:seed --class=Nb1Seeder
```

### 7. Frontend fordítása

```bash
npm run build
```

### 8. Laravel indítása

```bash
php artisan serve --port=8001
```

Az alkalmazás helyben:

http://127.0.0.1:8001

## Főbb útvonalak

| URL | Funkció |
|---|---|
| / | Főoldal |
| /klubok | Klubok |
| /labdarugok | Labdarúgók |
| /kapcsolat | Kapcsolatfelvétel |
| /diagram | Diagram |
| /login | Bejelentkezés |
| /register | Regisztráció |
| /dashboard | Felhasználói felület |
| /uzenetek | Üzenetek |
| /admin | Adminpanel |
| /admin/klubok | Klub CRUD |

## Jogosultságok

A rendszer három felhasználói szintet
különböztet meg:

1. Látogató
2. Regisztrált felhasználó
3. Adminisztrátor

A kapcsolatfelvétel nem igényel
bejelentkezést.

Az üzenetek megtekintéséhez
bejelentkezés szükséges.

A klubok módosításához és törléséhez
adminisztrátori jogosultság szükséges,
amennyiben a klub tartalmaz játékost akkor nem klub nem törölhető.

## GitHub

A projekt fejlesztése közös
GitHub repositoryban történik.

A fejlesztési részfeladatokat külön
commitok rögzítik.

## Internetes tárhely

Az alkalmazás Laravel futtatására
alkalmas PHP- és MySQL-tárhelyre
telepíthető.

A webkiszolgáló publikus gyökérkönyvtára
a Laravel `public` könyvtára kell legyen.

A React alkalmazás fordított fájljai
a `public/build` könyvtárban találhatók.

Az éles környezet konfigurációját
a szerveren tárolt `.env` biztosítja.

Az `.env`, az adatbázisjelszavak és
az adminisztrátori belépési adatok
nem kerülhetnek a nyilvános GitHubra.

## Megjegyzés

A projekt egyetemi beadandó
keretében készült.
