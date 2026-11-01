<?php
namespace App\Http\Controllers;

use App\Models\Uzenet;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - KAPCSOLAT CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Feladata:
|
| 1. Kapcsolat oldal megjelenítése
| 2. Üzenet fogadása
| 3. Szerveroldali validáció
| 4. Üzenet mentése a MySQL-adatbázisba
| 5. Visszajelzés sikeres beküldéskor
|
*/

class KapcsolatController extends Controller
{
    /**
     * Kapcsolat oldal megjelenítése.
     *
     * GET /kapcsolat
     */
    public function index(): Response
    {
        return Inertia::render('kapcsolat/index');
    }

    /**
     * Üzenet fogadása és mentése.
     *
     * POST /kapcsolat
     */
    public function store(Request $request): RedirectResponse
    {
        /*
        |--------------------------------------------------------------------------
        | 1. SZERVEROLDALI VALIDÁCIÓ
        |--------------------------------------------------------------------------
        |
        | A Laravel ellenőrzi a beérkező adatokat.
        | Sikertelen validáció esetén az űrlap
        | hibajelzéseket kap, és nem történik mentés.
        |
        */

        $validated = $request->validate(
            [
                'nev' => [
                    'required',
                    'string',
                    'min:2',
                    'max:100',
                ],

                'email' => [
                    'required',
                    'email:rfc',
                    'max:255',
                ],

                'targy' => [
                    'required',
                    'string',
                    'min:3',
                    'max:150',
                ],

                'uzenet' => [
                    'required',
                    'string',
                    'min:10',
                    'max:5000',
                ],
            ],
            [
                'nev.required' =>
                    'A név megadása kötelező.',

                'nev.min' =>
                    'A név legalább 2 karakter legyen.',

                'nev.max' =>
                    'A név legfeljebb 100 karakter lehet.',

                'email.required' =>
                    'Az e-mail-cím megadása kötelező.',

                'email.email' =>
                    'Érvényes e-mail-címet adj meg.',

                'targy.required' =>
                    'A tárgy megadása kötelező.',

                'targy.min' =>
                    'A tárgy legalább 3 karakter legyen.',

                'targy.max' =>
                    'A tárgy legfeljebb 150 karakter lehet.',

                'uzenet.required' =>
                    'Az üzenet megadása kötelező.',

                'uzenet.min' =>
                    'Az üzenet legalább 10 karakter legyen.',

                'uzenet.max' =>
                    'Az üzenet legfeljebb 5000 karakter lehet.',
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | 2. ÜZENET MENTÉSE
        |--------------------------------------------------------------------------
        |
        | Csak az ellenőrzött mezőket mentjük.
        | Az Uzenet modell Eloquent ORM-et használ.
        |
        */

        Uzenet::create($validated);

        /*
        |--------------------------------------------------------------------------
        | 3. SIKERES MENTÉS UTÁNI ÁTIRÁNYÍTÁS
        |--------------------------------------------------------------------------
        |
        | A Laravel visszairányítja a látogatót
        | a Kapcsolat oldalra.
        |
        */

        return redirect()
            ->route('kapcsolat.index')
            ->with(
                'success',
                'Az üzeneted sikeresen elküldve!'
            );
    }
}
