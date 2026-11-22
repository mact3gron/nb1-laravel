<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdatbazisController;
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

Route::get('/introduction', function () {
    return view('introduction');
})->name('introduction');

Route::get('/adatbazis', [
    AdatbazisController::class,
    'index',
])->name('adatbazis');

Route::get('/klubok', [
    KlubController::class,
    'index',
])->name('klubok.index');

Route::get('/labdarugok', [
    LabdarugoController::class,
    'index',
])->name('labdarugok.index');

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

Route::get('/diagram', [
    DiagramController::class,
    'index',
])->name('diagram.index');

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

Route::middleware(['auth'])
    ->group(function () {
        Route::get('/uzenetek', [
            UzenetekController::class,
            'index',
        ])->name('uzenetek.index');
    });

Route::middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::get('/user', function () {
            return view('user');
        })->name('user');
    });

Route::middleware(['auth'])
    ->get('/admin', [
        AdminController::class,
        'adminPage',
    ])
    ->name('admin.index');

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/klubok', [
            AdminKlubController::class,
            'index',
        ])->name('klubok.index');

        Route::get('/klubok/create', [
            AdminKlubController::class,
            'create',
        ])->name('klubok.create');

        Route::post('/klubok', [
            AdminKlubController::class,
            'store',
        ])->name('klubok.store');

        Route::get('/klubok/{klub}/edit', [
            AdminKlubController::class,
            'edit',
        ])->name('klubok.edit');

        Route::put('/klubok/{klub}', [
            AdminKlubController::class,
            'update',
        ])->name('klubok.update');

        Route::delete('/klubok/{klub}', [
            AdminKlubController::class,
            'destroy',
        ])->name('klubok.destroy');

        Route::get('/teszt', [
            TesztController::class,
            'index',
        ])->name('teszt.index');

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

require __DIR__ . '/settings.php';

require __DIR__ . '/auth.php';