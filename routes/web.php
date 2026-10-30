<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\KlubController;
use App\Http\Controllers\LabdarugoController;

/*
|--------------------------------------------------------------------------
| NB I. Laravel - Web Routes
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js
|
*/

// --------------------------------------------------
// FŐOLDAL
// --------------------------------------------------

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


// --------------------------------------------------
// KLUBOK - NYILVÁNOS LISTÁZÁS
// --------------------------------------------------

Route::get('/klubok', [
    KlubController::class,
    'index'
])->name('klubok.index');


// --------------------------------------------------
// LABDARÚGÓK - NYILVÁNOS LISTÁZÁS
// --------------------------------------------------

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index'
])->name('labdarugok.index');


// --------------------------------------------------
// DASHBOARD - BEJELENTKEZETT FELHASZNÁLÓK
// --------------------------------------------------

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

});


// --------------------------------------------------
// FELHASZNÁLÓI BEÁLLÍTÁSOK
// --------------------------------------------------

require __DIR__.'/settings.php';


// --------------------------------------------------
// AUTENTIKÁCIÓ
// --------------------------------------------------

require __DIR__.'/auth.php';
