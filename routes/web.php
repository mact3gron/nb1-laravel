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
| Laravel 12 + React + TypeScript + Inertia.js
|
| Nyilvános oldalak:
| - Főoldal
| - Klubok listája
| - Labdarúgók listája
|
| Bejelentkezett felhasználók:
| - Dashboard
|
| Adminisztrátor:
| - Adminpanel
|
*/

// ==================================================
// 1. FŐOLDAL
// ==================================================

Route::get('/', function () {

    return Inertia::render('home');

})->name('home');


// ==================================================
// 2. KLUBOK
// ==================================================

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// ==================================================
// 3. LABDARÚGÓK
// ==================================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// ==================================================
// 4. FELHASZNÁLÓI DASHBOARD
// ==================================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {

            return Inertia::render('dashboard');

        })->name('dashboard');

    });


// ==================================================
// 5. ADMINISZTRÁCIÓS ÚTVONALAK
// ==================================================

// Csak bejelentkezett adminisztrátoroknak.

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // ADMIN FŐOLDAL
        //
        // React:
        // resources/js/pages/admin/index.tsx

        Route::get('/', function () {

            return Inertia::render('admin/index');

        })->name('index');

        // A későbbi admin CRUD útvonalakat
        // ebben a védett csoportban hozzuk létre.

    });


// ==================================================
// 6. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==================================================

require __DIR__ . '/settings.php';


// ==================================================
// 7. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==================================================

require __DIR__ . '/auth.php';
