<?php
namespace App\Http\Controllers;

use App\Models\Klub;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - ADMIN KLUB CRUD CONTROLLER
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Adatbazistabla: klub
| Mezők: id, csapatnev
|
| Funkciok:
| - index: klubok listazasa
| - store: uj klub letrehozasa
| - update: klub modosítása
| - destroy: klub torlese
|
| A route-okat auth + admin middleware
| fogja vedeni a routes/web.php fajlban.
|
*/

class AdminKlubController extends Controller
{
    /**
     * READ - Klubok listázása.
     *
     * GET /admin/klubok
     */
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $search = trim(
            (string) ($validated['search'] ?? '')
        );

        $klubok = Klub::query()
            ->select([
                'id',
                'csapatnev',
            ])
            ->withCount('labdarugok')
            ->when(
                $search !== '',
                function ($query) use ($search) {
                    $query->where(
                        'csapatnev',
                        'like',
                        '%' . $search . '%'
                    );
                }
            )
            ->orderBy('csapatnev')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render(
            'admin/klubok/index',
            [
                'klubok' => $klubok,
                'filters' => [
                    'search' => $search,
                ],
            ]
        );
    }

    /**
     * CREATE - Új klub létrehozása.
     *
     * POST /admin/klubok
     */
    public function store(
        Request $request
    ): RedirectResponse {

        $validated = $this->validateKlub($request);

        Klub::create($validated);

        return redirect()
            ->route('admin.klubok.index')
            ->with(
                'success',
                'Az új klub sikeresen létrejött!'
            );
    }

    /**
     * UPDATE - Klub módosítása.
     *
     * PUT /admin/klubok/{klub}
     */
    public function update(
        Request $request,
        Klub $klub
    ): RedirectResponse {

        $validated = $this->validateKlub(
            $request,
            $klub
        );

        $klub->update($validated);

        return redirect()
            ->route('admin.klubok.index')
            ->with(
                'success',
                'A klub adatai sikeresen módosultak!'
            );
    }

    /**
     * DELETE - Klub törlése.
     *
     * DELETE /admin/klubok/{klub}
     */
    public function destroy(
        Klub $klub
    ): RedirectResponse {

        /*
        |--------------------------------------
        | Kapcsolódó játékosok ellenőrzése
        |--------------------------------------
        |
        | A labdarugo táblában a klubid
        | idegen kulcs.
        |
        | Ha a klubhoz játékos tartozik,
        | nem engedjük törölni.
        |
        */

        if ($klub->labdarugok()->exists()) {

            return redirect()
                ->route('admin.klubok.index')
                ->with(
                    'error',
                    'A klub nem törölhető, mert ' .
                    'labdarúgók tartoznak hozzá!'
                );
        }

        $klub->delete();

        return redirect()
            ->route('admin.klubok.index')
            ->with(
                'success',
                'A klub sikeresen törölve!'
            );
    }

    /**
     * Klubnév szerveroldali validációja.
     *
     * A CREATE és UPDATE ugyanazokat
     * az ellenőrzéseket használja.
     */
    private function validateKlub(
        Request $request,
        ?Klub $klub = null
    ): array {

        // Felesleges szóközök eltávolítása
        $csapatnev = $request->input('csapatnev');

        if (is_string($csapatnev)) {
            $request->merge([
                'csapatnev' => trim($csapatnev),
            ]);
        }

        // Duplikált klubnév kizárása
        $uniqueRule = Rule::unique(
            'klub',
            'csapatnev'
        );

        // Szerkesztésnél a saját rekord
        // nem számít duplikációnak.
        if ($klub !== null) {
            $uniqueRule->ignore($klub->id);
        }

        return $request->validate(
            [
                'csapatnev' => [
                    'required',
                    'string',
                    'min:2',
                    'max:255',
                    $uniqueRule,
                ],
            ],
            [
                'csapatnev.required' =>
                    'A klub nevének megadása kötelező.',

                'csapatnev.string' =>
                    'A klub neve szöveges érték legyen.',

                'csapatnev.min' =>
                    'A klub neve legalább 2 karakter legyen.',

                'csapatnev.max' =>
                    'A klub neve legfeljebb 255 karakter lehet.',

                'csapatnev.unique' =>
                    'Már létezik ilyen nevű klub.',
            ]
        );
    }
}
