<?php

namespace App\Http\Controllers;

use App\Models\Klub;
use App\Models\Labdarugo;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - DIAGRAM CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Feladat:
| - Klubok lekérdezése MySQL adatbázisból
| - Labdarúgók számának meghatározása klubonként
| - Eloquent ORM használata
| - Diagramadatok átadása a React oldalnak
|
| A megjelenítéshez Chart.js-t használunk.
|
*/

class DiagramController extends Controller
{
    /**
     * Diagram oldal megjelenítése.
     *
     * GET /diagram
     */
    public function index(): Response
    {
        /*
        |------------------------------------------
        | 1. KLUBOK LEKÉRDEZÉSE
        |------------------------------------------
        */

        $klubok = Klub::query()
            ->orderBy('csapatnev')
            ->get([
                'id',
                'csapatnev',
            ]);

        /*
        |------------------------------------------
        | 2. JÁTÉKOSOK SZÁMA KLUBONKÉNT
        |------------------------------------------
        |
        | A labdarugo.klubid kapcsolja össze
        | a játékost a klub.id mezővel.
        |
        | Az adatokat adatbázis szinten
        | összesítjük GROUP BY segítségével.
        |
        */

        $jatekosSzamok = Labdarugo::query()
            ->selectRaw(
                'klubid, COUNT(*) AS darab'
            )
            ->groupBy('klubid')
            ->pluck('darab', 'klubid');

        /*
        |------------------------------------------
        | 3. DIAGRAMADATOK ÖSSZEÁLLÍTÁSA
        |------------------------------------------
        |
        | Minden klubot megjelenítünk.
        | Akkor is, ha nincs játékosa.
        |
        */

        $diagramAdatok = $klubok
            ->map(function (Klub $klub)use($jatekosSzamok) {

                return [
                    'klub' => $klub->csapatnev,

                    'jatekosok' => (int) (
                        $jatekosSzamok->get(
                            $klub->id,
                            0
                        )
                    ),
                ];

            })
            ->values()
            ->all();

        /*
        |------------------------------------------
        | 4. ADATOK ÁTADÁSA A REACT OLDALNAK
        |------------------------------------------
        */

        return Inertia::render('diagram/index', [
            'diagramAdatok' => $diagramAdatok,
        ]);
    }
}