
<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
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
use App\Http\Controllers\ReactLabdarugoController;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - WEB ROUTES
|--------------------------------------------------------------------------
|
| Laravel 12
| Tanári autentikációs minta + NB I. alkalmazás
|
*/

// ==========================================
// 1. FŐOLDAL
// ==========================================

Route::get('/', function () {

    $statistics = [
        'klubok' => DB::table('klub')->count(),
        'labdarugok' => DB::table('labdarugo')->count(),
        'posztok' => DB::table('poszt')->count(),
    ];

    return Inertia::render('home', [
        'statistics' => $statistics,
    ]);

})->name('home');


// ==========================================
// 2. TANÁRI AUTENTIKÁCIÓS MINTA
// ==========================================

Route::get('/introduction', function () {
    return view('introduction');
})->name('introduction');


// ==========================================
// 3. KLUBOK - NYILVÁNOS
// ==========================================

Route::get('/klubok', [
    KlubController::class,
    'index',
])->name('klubok.index');


// ==========================================
// 4. LABDARÚGÓK - NYILVÁNOS
// ==========================================

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index',
])->name('labdarugok.index');


// ==========================================
// 5. KAPCSOLAT - NYILVÁNOS
// ==========================================

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
// 6. DIAGRAM - NYILVÁNOS
// ==========================================

Route::get('/diagram', [
    DiagramController::class,
    'index',
])->name('diagram.index');


// ==========================================
// 7. CSAPATERŐSSÉG
// ==========================================

Route::get('/csapatstatisztika', [
    CsapatStatisztikaController::class,
    'index',
])->name('csapatstatisztika.index');

Route::post('/csapatstatisztika', [
    CsapatStatisztikaController::class,
    'store',
])
    ->middleware('throttle:10,1')
    ->name('csapatstatisztika.store');


// ==========================================
// 8. KÉT CSAPAT ÖSSZEHASONLÍTÁSA
// ==========================================

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
// 9. BEJELENTKEZETT FELHASZNÁLÓK
// ==========================================

Route::middleware(['auth'])
    ->group(function () {

        Route::get('/uzenetek', [
            UzenetekController::class,
            'index',
        ])->name('uzenetek.index');

    });


// ==========================================
// 10. TANÁRI USER OLDAL ÉS DASHBOARD
// ==========================================

Route::middleware(['auth', 'verified'])
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('/user', function () {
            return view('user');
        })->name('user');

    });


// ==========================================
// 11. ADMINISZTRÁCIÓ
// ==========================================

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // TANÁRI BLADE ADMIN OLDAL

        Route::get('/', function () {
            return view('admin');
        })->name('index');


        // ==================================
        // KLUB CRUD
        // ==================================

        Route::get('/klubok', [
            AdminKlubController::class,
            'index',
        ])->name('klubok.index');

        Route::post('/klubok', [
            AdminKlubController::class,
            'store',
        ])->name('klubok.store');

        Route::put('/klubok/{klub}', [
            AdminKlubController::class,
            'update',
        ])->name('klubok.update');

        Route::delete('/klubok/{klub}', [
            AdminKlubController::class,
            'destroy',
        ])->name('klubok.destroy');


        // ==================================
        // TESZT MENÜ
        // ==================================

        Route::get('/teszt', [
            TesztController::class,
            'index',
        ])->name('teszt.index');


        // ==================================
        // REACT + AXIOS LABDARÚGÓ CRUD
        // ==================================

        Route::get('/react-labdarugok', [
            ReactLabdarugoController::class,
            'index',
        ])->name('react-labdarugok.index');

        Route::get('/react-labdarugok/adatok', [
            ReactLabdarugoController::class,
            'adatok',
        ])->name('react-labdarugok.adatok');

        Route::get('/react-labdarugok/valasztok', [
            ReactLabdarugoController::class,
            'valasztok',
        ])->name('react-labdarugok.valasztok');

        Route::post('/react-labdarugok', [
            ReactLabdarugoController::class,
            'store',
        ])->name('react-labdarugok.store');

        Route::put('/react-labdarugok/{labdarugo}', [
            ReactLabdarugoController::class,
            'update',
        ])->name('react-labdarugok.update');

        Route::delete('/react-labdarugok/{labdarugo}', [
            ReactLabdarugoController::class,
            'destroy',
        ])->name('react-labdarugok.destroy');

    });


// ==========================================
// 12. FELHASZNÁLÓI BEÁLLÍTÁSOK
// ==========================================

require __DIR__ . '/settings.php';


// ==========================================
// 13. BEJELENTKEZÉS ÉS REGISZTRÁCIÓ
// ==========================================

require __DIR__ . '/auth.php';