<?php
namespace App\Http\Controllers;

use App\Models\Poszt;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - REACT + AXIOS POSZT CRUD CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + Eloquent ORM + React + Axios + Inertia.js
|
| A már létező "poszt" adatbázistáblával dolgozunk.
| Mezők: id, nev
|
| A hagyományos admin Klub CRUD-tól független bónuszfunkció.
|
| GET    /admin/react-posztok            React oldal (Inertia)
| GET    /admin/react-posztok/adatok     READ   (JSON)
| POST   /admin/react-posztok            CREATE (JSON)
| PUT    /admin/react-posztok/{poszt}    UPDATE (JSON)
| DELETE /admin/react-posztok/{poszt}    DELETE (JSON)
|
| Az összes útvonalat az auth + admin middleware védi.
| A React felület Axios segítségével küld JSON-kéréseket.
|
*/

class ReactPosztController extends Controller
{
    // ==========================================
    // 1. REACT OLDAL MEGJELENÍTÉSE
    // ==========================================

    public function index(): Response
    {
        return Inertia::render('admin/react-posztok/index');
    }

    // ==========================================
    // 2. READ - POSZTOK LEKÉRÉSE JSON-BAN
    // ==========================================

    public function adatok(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $search = trim((string) ($validated['search'] ?? ''));

        $posztok = Poszt::query()
            ->select(['id', 'nev'])
            ->withCount('labdarugok')
            ->when($search !== '', function ($query) use ($search) {
                $query->where('nev', 'like', '%' . $search . '%');
            })
            ->orderBy('nev')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString();

        return response()->json($posztok);
    }

    // ==========================================
    // 3. CREATE - ÚJ POSZT LÉTREHOZÁSA
    // ==========================================

    public function store(Request $request): JsonResponse
    {
        $validated = $this->validatePoszt($request);

        $poszt = Poszt::create($validated);
        $poszt->loadCount('labdarugok');

        return response()->json([
            'message' => 'Az új poszt sikeresen létrejött.',
            'poszt' => $poszt,
        ], 201);
    }

    // ==========================================
    // 4. UPDATE - MEGLÉVŐ POSZT MÓDOSÍTÁSA
    // ==========================================

    public function update(Request $request, Poszt $poszt): JsonResponse
    {
        $validated = $this->validatePoszt($request, $poszt);

        $poszt->update($validated);
        $poszt->loadCount('labdarugok');

        return response()->json([
            'message' => 'A poszt sikeresen módosult.',
            'poszt' => $poszt,
        ]);
    }

    // ==========================================
    // 5. DELETE - POSZT TÖRLÉSE
    // ==========================================

    public function destroy(Poszt $poszt): JsonResponse
    {
        // A játékosok által használt posztokat nem töröljük.
        if ($poszt->labdarugok()->exists()) {
            return response()->json([
                'message' => 'A poszt nem törölhető, mert labdarúgók tartoznak hozzá.',
            ], 409);
        }

        try {
            $poszt->delete();
        } catch (QueryException $exception) {
            // Védelem párhuzamos adatbázis-módosítás esetére is.
            if (in_array((string) $exception->getCode(), ['23000', '23503'], true)) {
                return response()->json([
                    'message' => 'A poszt nem törölhető, mert más rekord hivatkozik rá.',
                ], 409);
            }

            throw $exception;
        }

        return response()->json([
            'message' => 'A poszt sikeresen törölve.',
        ]);
    }

    // ==========================================
    // 6. KÖZÖS SZERVEROLDALI VALIDÁCIÓ
    // ==========================================

    private function validatePoszt(Request $request, ?Poszt $poszt = null): array
    {
        // Felesleges szóközök levágása a megadott névről.
        $nev = $request->input('nev');

        if (is_string($nev)) {
            $request->merge(['nev' => trim($nev)]);
        }

        $uniqueRule = Rule::unique('poszt', 'nev');

        if ($poszt !== null) {
            $uniqueRule->ignore($poszt->getKey());
        }

        return $request->validate([
            'nev' => [
                'required',
                'string',
                'min:2',
                'max:255',
                $uniqueRule,
            ],
        ], [
            'nev.required' => 'A poszt megnevezése kötelező.',
            'nev.string' => 'A poszt megnevezése szöveg legyen.',
            'nev.min' => 'A poszt neve legalább 2 karakter hosszú legyen.',
            'nev.max' => 'A poszt neve legfeljebb 255 karakter lehet.',
            'nev.unique' => 'Már létezik ilyen nevű poszt.',
        ]);
    }
}
