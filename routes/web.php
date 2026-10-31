<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\KlubController;
use App\Http\Controllers\LabdarugoController;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - WEB ROUTES
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js
|
| Nyilvános funkciók:
| - Főoldal
| - Klubok listázása
| - Labdarúgók listázása
| - Keresés és lapozás
|
| Felhasználói funkciók:
| - Bejelentkezés
| - Regisztráció
| - Dashboard
| - Felhasználói beállítások
|
*/


// ==================================================
// 1. FŐOLDAL
// ==================================================

// React oldal:
// resources/js/pages/home.tsx

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


// ==================================================
// 2. KLUBOK
// ==================================================

// Nyilvános klublista kereséssel és lapozással.
// React oldal:
// resources/js/pages/klubok/index.tsx

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// ==================================================
// 3. LABDARÚGÓK
// ==================================================

// Nyilvános labdarúgólista.
// Keresés játékos, klub és poszt alapján.
// React oldal:
// resources/js/pages/labdarugok/index.tsx

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// ==================================================
// 4. FELHASZNÁLÓI DASHBOARD
// ==================================================

// Csak bejelentkezett és ellenőrzött
// felhasználóknak.

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

});


// ==================================================
// 5. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==================================================

require __DIR__ . '/settings.php';


// ==================================================
// 6. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==================================================

require __DIR__ . '/auth.php';
