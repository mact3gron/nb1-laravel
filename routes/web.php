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
| Nyilvános oldalak:
| - Főoldal
| - Klubok
| - Labdarúgók
|
| Felhasználói funkciók:
| - Bejelentkezés
| - Regisztráció
| - Dashboard
| - Beállítások
|
*/


// ==================================================
// 1. FŐOLDAL
// ==================================================

// A kezdőlap átirányítása a klubok oldalára.

Route::get('/', function () {
    return redirect()->route('klubok.index');
})->name('home');


// ==================================================
// 2. KLUBOK LISTÁZÁSA
// ==================================================

// Nyilvánosan elérhető klublista.
// Keresés és lapozás.

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// ==================================================
// 3. LABDARÚGÓK LISTÁZÁSA
// ==================================================

// Nyilvánosan elérhető játékoslista.
// Klub, poszt, keresés és lapozás.

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// ==================================================
// 4. FELHASZNÁLÓI DASHBOARD
// ==================================================

// Csak bejelentkezett és ellenőrzött
// felhasználók számára elérhető.

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

});


// ==================================================
// 5. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==================================================

// A React Starter Kit beállításai.

require __DIR__ . '/settings.php';


// ==================================================
// 6. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==================================================

// A React Starter Kit autentikációs útvonalai.

require __DIR__ . '/auth.php';
