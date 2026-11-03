<?php

namespace App\Http\Controllers;

use App\Models\Klub;
use App\Models\Labdarugo;
use App\Models\Poszt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - REACT + AXIOS LABDARÚGÓ CRUD
|--------------------------------------------------------------------------
|
| Laravel 12 + Eloquent ORM + React + Axios + Inertia.js
|
| Az alkalmazás labdarúgóinak teljes kezelése.
|
| Funkciók:
| - Játékosok listázása
| - Keresés és szűrés
| - Klubok lekérdezése
| - Posztok lekérdezése
| - Új játékos felvétele
| - Játékos módosítása
| - Játékos törlése
|
| A hozzá tartozó útvonalakat auth + admin
| middleware védi.
|
*/

class ReactLabdarugoController extends Controller
{
    // ==========================================
    // 1. REACT OLDAL MEGJELENÍTÉSE
    // ==========================================

    public function index(): Response
    {
        return Inertia::render(
            'admin/react-labdarugok/index'
        );
    }

    // ==========================================
    // 2. JÁTÉKOSOK LEKÉRÉSE
    // ==========================================

    public function adatok(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:100',
            ],
            'klubid' => [
                'nullable',
                'integer',
                'exists:klub,id',
            ],
            'posztid' => [
                'nullable',
                'integer',
                'exists:poszt,id',
            ],
            'page' => [
                'nullable',
                'integer',
                'min:1',
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $query = Labdarugo::query()
            ->with([
                'klub:id,csapatnev',
                'poszt:id,nev',
            ]);

        // Keresés név alapján
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where(
                    'vezeteknev',
                    'like',
                    '%' . $search . '%'
                )
                ->orWhere(
                    'utonev',
                    'like',
                    '%' . $search . '%'
                );
            });
        }

        // Szűrés klub alapján
        if (!empty($validated['klubid'])) {
            $query->where(
                'klubid',
                $validated['klubid']
            );
        }

        // Szűrés poszt alapján
        if (!empty($validated['posztid'])) {
            $query->where(
                'posztid',
                $validated['posztid']
            );
        }

        $labdarugok = $query
            ->orderBy('vezeteknev')
            ->orderBy('utonev')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return response()->json($labdarugok);
    }

    // ==========================================
    // 3. KLUBOK ÉS POSZTOK LEKÉRÉSE
    // ==========================================

    public function valasztok(): JsonResponse
    {
        $klubok = Klub::query()
            ->select('id', 'csapatnev')
            ->orderBy('csapatnev')
            ->get();

        $posztok = Poszt::query()
            ->select('id', 'nev')
            ->orderBy('nev')
            ->get();

        return response()->json([
            'klubok' => $klubok,
            'posztok' => $posztok,
        ]);
    }

    // ==========================================
    // 4. ÚJ JÁTÉKOS FELVÉTELE
    // ==========================================

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateLabdarugo(
            $request
        );

        $labdarugo = Labdarugo::create(
            $validated
        );

        $labdarugo->load([
            'klub',
            'poszt',
        ]);

        return response()->json([
            'message' =>
                'A labdarúgó sikeresen hozzáadva.',
            'labdarugo' => $labdarugo,
        ], 201);
    }

    // ==========================================
    // 5. JÁTÉKOS MÓDOSÍTÁSA
    // ==========================================

    public function update(
        Request $request,
        Labdarugo $labdarugo
    ): JsonResponse {

        $validated = $this->validateLabdarugo(
            $request
        );

        $labdarugo->update($validated);

        $labdarugo->load([
            'klub',
            'poszt',
        ]);

        return response()->json([
            'message' =>
                'A labdarúgó adatai sikeresen módosultak.',
            'labdarugo' => $labdarugo,
        ]);
    }

    // ==========================================
    // 6. JÁTÉKOS TÖRLÉSE
    // ==========================================

    public function destroy(
        Labdarugo $labdarugo
    ): JsonResponse {

        $labdarugo->delete();

        return response()->json([
            'message' =>
                'A labdarúgó sikeresen törölve.',
        ]);
    }

    // ==========================================
    // 7. ADATOK ELLENŐRZÉSE
    // ==========================================

    private function validateLabdarugo(
        Request $request
    ): array {

        // Névmezők tisztítása
        $utonev = $request->input('utonev');
        $vezeteknev = $request->input('vezeteknev');

        if (is_string($utonev)) {
            $request->merge([
                'utonev' => trim($utonev),
            ]);
        }

        if (is_string($vezeteknev)) {
            $request->merge([
                'vezeteknev' => trim($vezeteknev),
            ]);
        }

        return $request->validate([

            // Vezetéknév
            'vezeteknev' => [
                'required',
                'string',
                'min:2',
                'max:255',
            ],

            // Utónév - opcionális
            'utonev' => [
                'nullable',
                'string',
                'max:255',
            ],

            // Mezszám
            'mezszam' => [
                'required',
                'integer',
                'min:0',
                'max:999',
            ],

            // Klub - adatbázisból
            'klubid' => [
                'required',
                'integer',
                Rule::exists('klub', 'id'),
            ],

            // Poszt - adatbázisból
            'posztid' => [
                'required',
                'integer',
                Rule::exists('poszt', 'id'),
            ],

            // Születési dátum
            'szulido' => [
                'required',
                'date_format:Y-m-d',
                'before_or_equal:today',
            ],

            // Magyar állampolgárság
            'magyar' => [
                'required',
                'boolean',
            ],

            // Külföldi állampolgárság
            'kulfoldi' => [
                'required',
                'boolean',
            ],

            // Játékos értéke, ezer EUR
            'ertek' => [
                'required',
                'integer',
                'min:0',
            ],

        ], [

            'vezeteknev.required' =>
                'A vezetéknév megadása kötelező.',

            'vezeteknev.min' =>
                'A vezetéknév legalább 2 karakter legyen.',

            'mezszam.required' =>
                'A mezszám megadása kötelező.',

            'mezszam.integer' =>
                'A mezszám egész szám legyen.',

            'klubid.required' =>
                'Válassz egy klubot.',

            'klubid.exists' =>
                'A kiválasztott klub nem létezik.',

            'posztid.required' =>
                'Válassz egy játékosposztot.',

            'posztid.exists' =>
                'A kiválasztott poszt nem létezik.',

            'szulido.required' =>
                'A születési dátum kötelező.',

            'szulido.date_format' =>
                'Érvényes születési dátumot adj meg.',

            'szulido.before_or_equal' =>
                'A születési dátum nem lehet jövőbeli.',

            'magyar.required' =>
                'Add meg a magyar állampolgárságot.',

            'kulfoldi.required' =>
                'Add meg a külföldi állampolgárságot.',

            'ertek.required' =>
                'A játékos értékét meg kell adni.',

            'ertek.min' =>
                'A játékos értéke nem lehet negatív.',

        ]);
    }
}