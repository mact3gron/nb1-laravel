<?php
namespace Tests\Feature;

use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - FEATURE TESZTEK
|--------------------------------------------------------------------------
|
| Laravel 12 + PHPUnit + Inertia.js
|
| Tesztelt Controller:
| app/Http/Controllers/CsapatStatisztikaController.php
|
| Tesztelt szolgáltatás:
| app/Services/CsapatStatisztika.php
|
| Összesen: 4 automatikus Feature teszt
|
| 1. Nyilvános oldal elérése
| 2. Helyes adatok feldolgozása
| 3. Nulla mérkőzés elutasítása
| 4. Ellentmondásos gólstatisztika elutasítása
|
| A tesztek nem módosítják az adatbázist.
|
*/

class CsapatStatisztikaControllerTest extends TestCase
{
    /*
    |--------------------------------------------------------------------------
    | 1. TESZT - NYILVÁNOS OLDAL ELÉRÉSE
    |--------------------------------------------------------------------------
    |
    | A csapaterősség oldalnak vendégként is
    | elérhetőnek kell lennie.
    |
    | Inertia HTTP-kéréssel ellenőrizzük:
    | - HTTP 200 válasz
    | - Helyes React komponens
    | - A Controller által átadott adatok
    |
    | FONTOS:
    | Nem adunk meg kézzel X-Inertia fejlécet.
    | A korábbi 409-es hibát az Inertia
    | verzióellenőrzése okozta.
    |
    */

    public function test_csapaterosseg_oldal_vendegkent_elerheto(): void
    {
        // Normál GET kérés, bejelentkezés nélkül.

        $response = $this->get(
            route('csapatstatisztika.index')
        );

        // HTTP 200 OK.

        $response->assertOk();

        // Az Inertia komponens és a kezdő adatok
        // ellenőrzése.
        //
        // A false paraméter kikapcsolja a
        // külön fájlelérési ellenőrzést.
        // A komponens nevét továbbra is
        // pontosan vizsgáljuk.

        $response->assertInertia(
            fn (Assert $page) => $page
                ->component(
                    'csapatstatisztika/index',
                    false
                )
                ->where('eredmeny', null)
                ->where('bevittAdatok', null)
                ->etc()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. TESZT - HELYES ADATOK FELDOLGOZÁSA
    |--------------------------------------------------------------------------
    |
    | A POST kérés a következő eredményeket
    | küldi el a Controllernek:
    |
    | Győzelmek: 2
    | Döntetlenek: 1
    | Vereségek: 1
    | Lőtt gólok: 7
    | Kapott gólok: 4
    |
    | Elvárt eredmények:
    |
    | Mérkőzések: 4
    | Bajnoki pontok: 7
    | Gólkülönbség: +3
    | Gólátlag: 1.75
    | Teljesítményindex: 60
    | Értékelés: Közepes
    |
    */

    public function test_helyes_adatokkal_sikeres_a_szamitas(): void
    {
        $response = $this
            ->from(
                route('csapatstatisztika.index')
            )
            ->post(
                route('csapatstatisztika.store'),
                [
                    'gyozelmek' => 2,
                    'dontetlenek' => 1,
                    'veresegek' => 1,
                    'lott_golok' => 7,
                    'kapott_golok' => 4,
                ]
            );

        // Sikeres feldolgozás után
        // visszatérés az eredményoldalra.

        $response->assertRedirect(
            route('csapatstatisztika.index')
        );

        $response->assertSessionHasNoErrors();

        // A Controller a számítás eredményét
        // a munkamenetben adja tovább.

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.merkozesek',
            4
        );

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.pontok',
            7
        );

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.golkulonbseg',
            3
        );

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.gol_atlag',
            1.75
        );

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.teljesitmenyindex',
            60
        );

        $response->assertSessionHas(
            'csapatstatisztika_eredmeny.ertekeles',
            'Közepes'
        );

        // Az eredeti bemeneti adatoknak
        // szintén elérhetőnek kell lenniük.

        $response->assertSessionHas(
            'csapatstatisztika_adatok.gyozelmek',
            2
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 3. TESZT - NULLA MÉRKŐZÉS ELUTASÍTÁSA
    |--------------------------------------------------------------------------
    |
    | Ha minden eredmény 0,
    | nem történt lejátszott mérkőzés.
    |
    | A Controllernek validációs hibát
    | kell visszaadnia.
    |
    */

    public function test_nulla_merkozes_eseten_validacios_hiba(): void
    {
        $response = $this
            ->from(
                route('csapatstatisztika.index')
            )
            ->post(
                route('csapatstatisztika.store'),
                [
                    'gyozelmek' => 0,
                    'dontetlenek' => 0,
                    'veresegek' => 0,
                    'lott_golok' => 0,
                    'kapott_golok' => 0,
                ]
            );

        // A Laravel visszairányítja
        // a felhasználót az űrlaphoz.

        $response->assertRedirect(
            route('csapatstatisztika.index')
        );

        // A győzelmek mezőhöz
        // validációs hiba tartozik.

        $response->assertSessionHasErrors([
            'gyozelmek',
        ]);

        // Hibás bemenet esetén
        // nem jöhet létre új eredmény.

        $response->assertSessionMissing(
            'csapatstatisztika_eredmeny'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 4. TESZT - HIBÁS GÓLSTATISZTIKA
    |--------------------------------------------------------------------------
    |
    | 3 győzelemhez legalább 3 lőtt
    | gól szükséges.
    |
    | Vizsgált adatok:
    |
    | Győzelmek: 3
    | Döntetlenek: 0
    | Vereségek: 1
    | Lőtt gólok: 2
    | Kapott gólok: 1
    |
    | Az adatok ellentmondásosak.
    |
    | A rendszernek el kell utasítania
    | a hibás lőtt gólszámot.
    |
    */

    public function test_hibas_golstatisztika_elutasitasa(): void
    {
        $response = $this
            ->from(
                route('csapatstatisztika.index')
            )
            ->post(
                route('csapatstatisztika.store'),
                [
                    'gyozelmek' => 3,
                    'dontetlenek' => 0,
                    'veresegek' => 1,
                    'lott_golok' => 2,
                    'kapott_golok' => 1,
                ]
            );

        $response->assertRedirect(
            route('csapatstatisztika.index')
        );

        // A lőtt gólok mezőjében
        // validációs hibának kell lennie.

        $response->assertSessionHasErrors([
            'lott_golok',
        ]);

        // Hibás statisztikából
        // nem készülhet értékelés.

        $response->assertSessionMissing(
            'csapatstatisztika_eredmeny'
        );
    }
}
