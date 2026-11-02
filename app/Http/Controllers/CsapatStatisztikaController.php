<?php
namespace App\Http\Controllers;

use App\Services\CsapatStatisztika;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - CSAPATERŐSSÉG KALKULÁTOR CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Feladatok:
| - Csapaterősség oldal megjelenítése
| - Futballeredmények fogadása
| - Szerveroldali validáció
| - Teljesítményindex kiszámítása
| - Eredmény átadása a React oldalnak
|
| A számítást a CsapatStatisztika service végzi.
|
*/

class CsapatStatisztikaController extends Controller
{
    /**
     * Kalkulátor oldal megjelenítése.
     *
     * GET /csapatstatisztika
     */
    public function index(Request $request): Response
    {
        return Inertia::render(
            'csapatstatisztika/index',
            [
                // Előző számítás eredménye
                'eredmeny' => $request->session()->get(
                    'csapatstatisztika_eredmeny'
                ),

                // A felhasználó által megadott adatok
                'bevittAdatok' => $request->session()->get(
                    'csapatstatisztika_adatok'
                ),
            ]
        );
    }

    /**
     * Csapaterősség kiszámítása.
     *
     * POST /csapatstatisztika
     */
    public function store(
        Request $request,
        CsapatStatisztika $statisztika
    ): RedirectResponse {

        // ======================================
        // 1. SZERVEROLDALI VALIDÁCIÓ
        // ======================================

        $validated = $request->validate(
            [
                'gyozelmek' => [
                    'required',
                    'integer',
                    'min:0',
                    'max:1000',
                ],

                'dontetlenek' => [
                    'required',
                    'integer',
                    'min:0',
                    'max:1000',
                ],

                'veresegek' => [
                    'required',
                    'integer',
                    'min:0',
                    'max:1000',
                ],

                'lott_golok' => [
                    'required',
                    'integer',
                    'min:0',
                    'max:10000',
                ],

                'kapott_golok' => [
                    'required',
                    'integer',
                    'min:0',
                    'max:10000',
                ],
            ],
            [
                'required' =>
                    'A mező kitöltése kötelező.',

                'integer' =>
                    'Csak egész számot adhatsz meg.',

                'min' =>
                    'Negatív érték nem adható meg.',

                'max' =>
                    'A megadott érték túl nagy.',
            ]
        );

        // ======================================
        // 2. ADATOK ÁTALAKÍTÁSA
        // ======================================

        $gyozelmek = (int) $validated['gyozelmek'];

        $dontetlenek = (int) $validated['dontetlenek'];

        $veresegek = (int) $validated['veresegek'];

        $lottGolok = (int) $validated['lott_golok'];

        $kapottGolok = (int) $validated['kapott_golok'];

        // ======================================
        // 3. MÉRKŐZÉSSZÁM ELLENŐRZÉSE
        // ======================================

        $merkozesek =
            $gyozelmek +
            $dontetlenek +
            $veresegek;

        if ($merkozesek === 0) {
            throw ValidationException::withMessages([
                'gyozelmek' =>
                    'Legalább egy lejátszott mérkőzést adj meg.',
            ]);
        }

        // ======================================
        // 4. FUTBALLEREDMÉNYEK ELLENŐRZÉSE
        // ======================================

        // Minden győzelemhez legalább
        // egy lőtt gól szükséges.

        if ($gyozelmek > $lottGolok) {
            throw ValidationException::withMessages([
                'lott_golok' =>
                    'A lőtt gólok száma nem lehet kisebb '
                    . 'a győzelmek számánál.',
            ]);
        }

        // Minden vereséghez legalább
        // egy kapott gól tartozik.

        if ($veresegek > $kapottGolok) {
            throw ValidationException::withMessages([
                'kapott_golok' =>
                    'A kapott gólok száma nem lehet kisebb '
                    . 'a vereségek számánál.',
            ]);
        }

        // ======================================
        // 5. CSAPATSTATISZTIKA SZÁMÍTÁSA
        // ======================================

        $eredmeny = $statisztika->szamol(
            $gyozelmek,
            $dontetlenek,
            $veresegek,
            $lottGolok,
            $kapottGolok
        );

        // ======================================
        // 6. EREDMÉNY VISSZAADÁSA
        // ======================================
        //
        // Inertia POST kérés után redirectet
        // használunk.
        //
        // Az eredményt ideiglenesen a
        // munkamenetben tároljuk.
        //
        // Nem mentünk új adatot a MySQL-be.
        //

        return redirect()
            ->route('csapatstatisztika.index')
            ->with(
                'csapatstatisztika_eredmeny',
                $eredmeny
            )
            ->with(
                'csapatstatisztika_adatok',
                [
                    'gyozelmek' => $gyozelmek,
                    'dontetlenek' => $dontetlenek,
                    'veresegek' => $veresegek,
                    'lott_golok' => $lottGolok,
                    'kapott_golok' => $kapottGolok,
                ]
            );
    }
}
