<?php
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\KlubController;
use App\Http\Controllers\LabdarugoController;
use App\Http\Controllers\KapcsolatController;
use App\Http\Controllers\UzenetekController;
use App\Http\Controllers\DiagramController;
use App\Http\Controllers\AdminKlubController;
use App\Http\Controllers\CsapatStatisztikaController;
use App\Http\Controllers\CsapatOsszehasonlitasController;
use App\Http\Controllers\TesztController;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - WEB ROUTES
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| NYILVÁNOS:
| - Főoldal
| - Klubok
| - Labdarúgók
| - Kapcsolat
| - Diagram
| - Csapaterősség
| - Két csapat összehasonlítása
|
| BEJELENTKEZETT FELHASZNÁLÓ:
| - Üzenetek
| - Dashboard
|
| ADMINISZTRÁTOR:
| - Adminpanel
| - Klubok CRUD
| - Tesztjelentések
|
*/

// ==========================================
// 1. FŐOLDAL
// ==========================================

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


// ==========================================
// 2. KLUBOK - NYILVÁNOS
// ==========================================

Route::get('/klubok', [
    KlubController::class,
    'index',
])->name('klubok.index');


// ==========================================
// 3. LABDARÚGÓK - NYILVÁNOS
// ==========================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index',
])->name('labdarugok.index');


// ==========================================
// 4. KAPCSOLAT - NYILVÁNOS
// ==========================================

// Regisztráció nélkül is elérhető.

Route::get('/kapcsolat', [
    KapcsolatController::class,
    'index',
])->name('kapcsolat.index');

Route::post('/kapcsolat', [
    KapcsolatController::class,
    'store',
])
    ->middleware('throttle:5,1')
    ->name('kapcsolat.store');


// ==========================================
// 5. DIAGRAM - NYILVÁNOS
// ==========================================

Route::get('/diagram', [
    DiagramController::class,
    'index',
])->name('diagram.index');


// ==========================================
// 5/A. CSAPATERŐSSÉG - NYILVÁNOS
// ==========================================

// Csapatstatisztika és teljesítményindex
// számítása a megadott mérkőzésadatokból.
//
// Regisztráció és bejelentkezés nélkül
// is használható.
//
// GET: Csapaterősség oldal megjelenítése

Route::get('/csapatstatisztika', [
    CsapatStatisztikaController::class,
    'index',
])->name('csapatstatisztika.index');


// POST: Mérkőzésadatok feldolgozása
// és a csapat teljesítményének értékelése.
//
// Maximum 10 kérés percenként.

Route::post('/csapatstatisztika', [
    CsapatStatisztikaController::class,
    'store',
])
    ->middleware('throttle:10,1')
    ->name('csapatstatisztika.store');


// ==========================================
// 5/B. KÉT CSAPAT ÖSSZEHASONLÍTÁSA - NYILVÁNOS
// ==========================================

// A klubok a meglévő MySQL-adatbázisból érkeznek.
// A két csapat eredményeit külön-külön adjuk meg.
// Nincs adatbázis-módosítás; új migráció nem kell.

Route::get('/csapat-osszehasonlitas', [
    CsapatOsszehasonlitasController::class,
    'index',
])->name('csapatosszehasonlitas.index');

Route::post('/csapat-osszehasonlitas', [
    CsapatOsszehasonlitasController::class,
    'store',
])
    ->middleware('throttle:10,1')
    ->name('csapatosszehasonlitas.store');


// ==========================================
// 6. ÜZENETEK - CSAK BEJELENTKEZVE
// ==========================================

Route::middleware(['auth'])
    ->group(function () {

        Route::get('/uzenetek', [
            UzenetekController::class,
            'index',
        ])->name('uzenetek.index');

    });


// ==========================================
// 7. FELHASZNÁLÓI DASHBOARD
// ==========================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

    });


// ==========================================
// 8. ADMINISZTRÁCIÓ
// ==========================================

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // ----------------------------------
        // ADMIN FŐOLDAL
        // ----------------------------------

        Route::get('/', function () {
            return Inertia::render('admin/index');
        })->name('index');


        // ==================================
        // KLUB CRUD
        // ==================================

        // READ - Klubok listázása

        Route::get('/klubok', [
            AdminKlubController::class,
            'index',
        ])->name('klubok.index');


        // CREATE - Új klub létrehozása

        Route::post('/klubok', [
            AdminKlubController::class,
            'store',
        ])->name('klubok.store');


        // UPDATE - Klub módosítása

        Route::put('/klubok/{klub}', [
            AdminKlubController::class,
            'update',
        ])->name('klubok.update');


        // DELETE - Klub törlése

        Route::delete('/klubok/{klub}', [
            AdminKlubController::class,
            'destroy',
        ])->name('klubok.destroy');


        // ==================================
        // TESZT MENÜ - ADMIN
        // ==================================

        // Valódi PHPUnit Unit és Feature
        // teszteredmények megjelenítése.
        // A böngészőből tesztet nem futtatunk.
        // Az auth + admin middleware védi.

        Route::get('/teszt', [
            TesztController::class,
            'index',
        ])->name('teszt.index');

    });


// ==========================================
// 9. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==========================================

require __DIR__ . '/settings.php';


// ==========================================
// 10. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==========================================

require __DIR__ . '/auth.php';
