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
| Nyilvános útvonalak:
| - Főoldal
| - Klubok
| - Labdarúgók
|
| Bejelentkezett felhasználók:
| - Dashboard
|
| Adminisztrátor:
| - Admin felület
|
*/

// ==========================================
// 1. FŐOLDAL
// ==========================================

Route::get('/', function () {
    return Inertia::render('home');
})->name('home');


// ==========================================
// 2. KLUBOK
// ==========================================

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// ==========================================
// 3. LABDARÚGÓK
// ==========================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// ==========================================
// 4. BEJELENTKEZETT FELHASZNÁLÓ
// ==========================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

    });


// ==========================================
// 5. ADMINISZTRÁTORI ÚTVONALAK
// ==========================================

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Ideiglenes ellenőrző oldal.
        // A következő lépésben React adminoldalra
        // cseréljük.

        Route::get('/', function () {

            return response(
                'Adminisztrátori hozzáférés engedélyezve.',
                200
            )->header(
                'Content-Type',
                'text/plain; charset=UTF-8'
            );

        })->name('index');

    });


// ==========================================
// 6. BEÁLLÍTÁSOK
// ==========================================

require __DIR__ . '/settings.php';


// ==========================================
// 7. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==========================================

require __DIR__ . '/auth.php';