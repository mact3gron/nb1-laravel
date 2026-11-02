<?php
namespace App\Http\Controllers;

use App\Models\Klub;
use App\Services\CsapatStatisztika;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - KÉT CSAPAT ÖSSZEHASONLÍTÁSA
|--------------------------------------------------------------------------
|
| A klubok az adatbázisból érkeznek.
| A statisztikák kiszámításához a meglévő CsapatStatisztika
| szolgáltatást használjuk, az adatbázist nem módosítjuk.
|
*/

class CsapatOsszehasonlitasController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('csapat-osszehasonlitas/index', [
            'klubok' => Klub::query()
                ->orderBy('csapatnev')
                ->get(['id', 'csapatnev']),
            'eredmeny' => $request->session()->get('csapatosszehasonlitas_eredmeny'),
            'bevittAdatok' => $request->session()->get('csapatosszehasonlitas_adatok'),
        ]);
    }

    public function store(
        Request $request,
        CsapatStatisztika $statisztika
    ): RedirectResponse {
        // A tényleges Klub modell táblanevét és elsődleges kulcsát használjuk.
        $klubModel = new Klub();
        $klubTabla = $klubModel->getTable();
        $klubKulcs = $klubModel->getKeyName();

        $rules = [
            'elso_klub_id' => ['required', 'integer', Rule::exists($klubTabla, $klubKulcs)],
            'masodik_klub_id' => [
                'required',
                'integer',
                Rule::exists($klubTabla, $klubKulcs),
                'different:elso_klub_id',
            ],
        ];

        foreach (['elso', 'masodik'] as $oldal) {
            foreach (['gyozelmek', 'dontetlenek', 'veresegek'] as $mezo) {
                $rules["{$oldal}_{$mezo}"] = ['required', 'integer', 'min:0', 'max:1000'];
            }

            foreach (['lott_golok', 'kapott_golok'] as $mezo) {
                $rules["{$oldal}_{$mezo}"] = ['required', 'integer', 'min:0', 'max:10000'];
            }
        }

        $adatok = $request->validate($rules, [
            'required' => 'A mező kitöltése kötelező.',
            'integer' => 'Egész számot adj meg.',
            'min' => 'Negatív számot nem adhatsz meg.',
            'max' => 'A megadott érték túl nagy.',
            'exists' => 'A kiválasztott klub nem található.',
            'different' => 'Két különböző klubot válassz.',
        ]);

        $eredmenyek = [];

        foreach (['elso', 'masodik'] as $oldal) {
            $gyozelmek = (int) $adatok["{$oldal}_gyozelmek"];
            $dontetlenek = (int) $adatok["{$oldal}_dontetlenek"];
            $veresegek = (int) $adatok["{$oldal}_veresegek"];
            $lottGolok = (int) $adatok["{$oldal}_lott_golok"];
            $kapottGolok = (int) $adatok["{$oldal}_kapott_golok"];

            $meccsek = $gyozelmek + $dontetlenek + $veresegek;

            if ($meccsek === 0) {
                throw ValidationException::withMessages([
                    "{$oldal}_gyozelmek" => 'Legalább egy lejátszott mérkőzés szükséges.',
                ]);
            }

            if ($lottGolok < $gyozelmek) {
                throw ValidationException::withMessages([
                    "{$oldal}_lott_golok" => 'A lőtt gólok száma nem lehet kisebb a győzelmek számánál.',
                ]);
            }

            if ($kapottGolok < $veresegek) {
                throw ValidationException::withMessages([
                    "{$oldal}_kapott_golok" => 'A kapott gólok száma nem lehet kisebb a vereségek számánál.',
                ]);
            }

            // Ugyanaz a számítás, mint az önálló Csapaterősség oldalon.
            $szamitott = $statisztika->szamol(
                $gyozelmek,
                $dontetlenek,
                $veresegek,
                $lottGolok,
                $kapottGolok
            );

            $klub = Klub::query()->findOrFail((int) $adatok["{$oldal}_klub_id"]);

            $eredmenyek[$oldal] = [
                'klub_id' => (int) $klub->getKey(),
                'klub_nev' => $klub->csapatnev,
                'gyozelmek' => $gyozelmek,
                'dontetlenek' => $dontetlenek,
                'veresegek' => $veresegek,
                'lott_golok' => $lottGolok,
                'kapott_golok' => $kapottGolok,
                ...$szamitott,
            ];
        }

        $elsoIndex = $eredmenyek['elso']['teljesitmenyindex'];
        $masodikIndex = $eredmenyek['masodik']['teljesitmenyindex'];

        $eredmeny = [
            ...$eredmenyek,
            'kulonbseg' => abs($elsoIndex - $masodikIndex),
            'jobb' => $elsoIndex === $masodikIndex
                ? null
                : ($elsoIndex > $masodikIndex ? 'elso' : 'masodik'),
            'azonos_meccsszam' => $eredmenyek['elso']['merkozesek'] === $eredmenyek['masodik']['merkozesek'],
        ];

        return redirect()
            ->route('csapatosszehasonlitas.index')
            ->with('csapatosszehasonlitas_eredmeny', $eredmeny)
            ->with('csapatosszehasonlitas_adatok', $adatok);
    }
}
