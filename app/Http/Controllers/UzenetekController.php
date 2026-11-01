<?php
namespace App\Http\Controllers;

use App\Models\Uzenet;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - ÜZENETEK CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Feladata:
| - Kapcsolat űrlapon érkezett üzenetek lekérdezése
| - Legújabb üzenetek megjelenítése elsőként
| - Lapozás: 10 üzenet oldalanként
| - Adatok átadása a React oldalnak
|
| FONTOS:
| A hozzáférést a routes/web.php fájlban
| auth middleware-rel fogjuk védeni.
|
*/

class UzenetekController extends Controller
{
    /**
     * Üzenetek listázása.
     *
     * GET /uzenetek
     */
    public function index(): Response
    {
        // Üzenetek lekérdezése az adatbázisból
        $uzenetek = Uzenet::query()

            // Csak a szükséges mezőket kérjük le
            ->select([
                'id',
                'nev',
                'email',
                'targy',
                'uzenet',
                'created_at',
            ])

            // Legújabb üzenetek előre
            ->orderByDesc('created_at')

            // Azonos időpontnál az ID dönt
            ->orderByDesc('id')

            // Lapozás
            ->paginate(10);

        // React + TypeScript oldal megjelenítése
        return Inertia::render('uzenetek/index', [
            'uzenetek' => $uzenetek,
        ]);
    }
}
