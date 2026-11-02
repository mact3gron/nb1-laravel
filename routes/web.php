<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\KlubController;
use App\Http\Controllers\LabdarugoController;
use App\Http\Controllers\KapcsolatController;
use App\Http\Controllers\UzenetekController;
use App\Http\Controllers\DiagramController;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - WEB ROUTES
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Nyilvános:
| - Főoldal
| - Klubok
| - Labdarúgók
| - Kapcsolat
| - Diagram
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
    'index',
])->name('klubok.index');


// ==================================================
// 3. LABDARÚGÓK - NYILVÁNOS
// ==================================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index',
])->name('labdarugok.index');


// ==================================================
// 4. KAPCSOLAT - NYILVÁNOS
// ==================================================

// Üzenetküldés regisztráció nélkül is.

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


// ==================================================
// 5. DIAGRAM - NYILVÁNOS
// ==================================================

// Chart.js diagram a MySQL-adatbázis adataiból.
//
// Bejelentkezés NEM szükséges.

Route::get('/diagram', [
    DiagramController::class,
    'index',
])->name('diagram.index');


// ==================================================
// 6. ÜZENETEK - CSAK BEJELENTKEZVE
// ==================================================

Route::middleware(['auth'])->group(function () {

    Route::get('/uzenetek', [
        UzenetekController::class,
        'index',
    ])->name('uzenetek.index');

});


// ==================================================
// 7. DASHBOARD
// ==================================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

    });


// ==================================================
// 8. ADMINISZTRÁCIÓ - CSAK ADMIN
// ==================================================

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/', function () {
            return Inertia::render('admin/index');
        })->name('index');

        // A CRUD útvonalak később ide kerülnek.

    });


// ==================================================
// 9. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==================================================

require __DIR__ . '/settings.php';


// ==================================================
// 10. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==================================================

require __DIR__ . '/auth.php';