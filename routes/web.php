<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\KlubController;
use App\Http\Controllers\LabdarugoController;
use App\Http\Controllers\KapcsolatController;
use App\Http\Controllers\UzenetekController;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - WEB ROUTES
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Vendégek:
| - Főoldal
| - Adatbázis
| - Kapcsolat
|
| Bejelentkezett felhasználók:
| - Üzenetek
| - Dashboard
|
| Adminisztrátor:
| - Adminpanel
|
*/

// ==================================================
// 1. FŐOLDAL - NYILVÁNOS
// ==================================================

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


// ==================================================
// 2. KLUBOK - NYILVÁNOS
// ==================================================

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// ==================================================
// 3. LABDARÚGÓK - NYILVÁNOS
// ==================================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// ==================================================
// 4. KAPCSOLAT - NYILVÁNOS
// ==================================================

// Vendégek is megnyithatják az űrlapot.

Route::get('/kapcsolat', [
    KapcsolatController::class,
    'index'
])->name('kapcsolat.index');


// Vendégek is küldhetnek üzenetet.
// Percenként maximum 5 beküldési kísérlet.

Route::post('/kapcsolat', [
    KapcsolatController::class,
    'store'
])
    ->middleware('throttle:5,1')
    ->name('kapcsolat.store');


// ==================================================
// 5. ÜZENETEK - BEJELENTKEZÉS SZÜKSÉGES
// ==================================================

// FONTOS:
// Csak auth middleware!
// A tanári feladat nem ír elő adminjogot
// az üzenetek megtekintéséhez.

Route::middleware('auth')->group(function () {

    Route::get('/uzenetek', [
        UzenetekController::class,
        'index'
    ])->name('uzenetek.index');

});


// ==================================================
// 6. DASHBOARD - BEJELENTKEZETT FELHASZNÁLÓ
// ==================================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

    });


// ==================================================
// 7. ADMINISZTRÁCIÓ - CSAK ADMIN
// ==================================================

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/', function () {
            return Inertia::render('admin/index');
        })->name('index');

        // Később ide kerül a klubok CRUD.

    });


// ==================================================
// 8. LARAVEL FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==================================================

require __DIR__ . '/settings.php';


// ==================================================
// 9. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==================================================

require __DIR__ . '/auth.php';
