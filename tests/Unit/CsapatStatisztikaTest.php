<?php
namespace Tests\Unit;

use App\Services\CsapatStatisztika;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - UNIT TESZTEK
|--------------------------------------------------------------------------
|
| Laravel 12 - PHPUnit
|
| Tesztelt osztály:
| app/Services/CsapatStatisztika.php
|
| Összesen: 8 automatikus Unit teszt
|
| Ellenőrzések:
| 1. Mérkőzések és bajnoki pontok
| 2. Gólkülönbség és gólátlag
| 3. Teljesítményindex számítása
| 4. Magas csapaterősség
| 5. Alacsony csapaterősség
| 6. Két csapat összehasonlítása
| 7. Negatív értékek elutasítása
| 8. Nulla mérkőzés elutasítása
|
| A tesztek nem módosítják az adatbázist.
|
*/

class CsapatStatisztikaTest extends TestCase
{
    private CsapatStatisztika $statisztika;

    /*
    |--------------------------------------------------------------------------
    | TESZTKÖRNYEZET ELŐKÉSZÍTÉSE
    |--------------------------------------------------------------------------
    */

    protected function setUp(): void
    {
        parent::setUp();

        $this->statisztika = new CsapatStatisztika();
    }

    /*
    |--------------------------------------------------------------------------
    | 1. TESZT - MÉRKŐZÉSEK ÉS BAJNOKI PONTOK
    |--------------------------------------------------------------------------
    |
    | 2 győzelem = 6 pont
    | 1 döntetlen = 1 pont
    | 1 vereség = 0 pont
    |
    | Összesen: 4 mérkőzés, 7 pont
    |
    */

    public function test_merkozesek_es_pontok_szamitasa(): void
    {
        $eredmeny = $this->statisztika->szamol(
            2,
            1,
            1,
            7,
            4
        );

        $this->assertSame(
            4,
            $eredmeny['merkozesek']
        );

        $this->assertSame(
            7,
            $eredmeny['pontok']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. TESZT - GÓLKÜLÖNBSÉG ÉS GÓLÁTLAG
    |--------------------------------------------------------------------------
    |
    | 1 győzelem
    | 1 döntetlen
    | 2 vereség
    |
    | Lőtt gólok: 2
    | Kapott gólok: 7
    |
    | Gólkülönbség: -5
    | Gólátlag: 2 / 4 = 0.5
    |
    */

    public function test_golkulonbseg_es_golatlag(): void
    {
        $eredmeny = $this->statisztika->szamol(
            1,
            1,
            2,
            2,
            7
        );

        $this->assertSame(
            -5,
            $eredmeny['golkulonbseg']
        );

        $this->assertEqualsWithDelta(
            0.5,
            $eredmeny['gol_atlag'],
            0.001
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 3. TESZT - TELJESÍTMÉNYINDEX
    |--------------------------------------------------------------------------
    |
    | Győzelmek: 2
    | Döntetlenek: 1
    | Vereségek: 1
    | Lőtt gólok: 7
    | Kapott gólok: 4
    |
    | Pontarány súlya: 70%
    | Gólarány súlya: 30%
    |
    | Várt index: 60 / 100
    |
    */

    public function test_teljesitmenyindex_szamitasa(): void
    {
        $eredmeny = $this->statisztika->szamol(
            2,
            1,
            1,
            7,
            4
        );

        $this->assertSame(
            60,
            $eredmeny['teljesitmenyindex']
        );

        $this->assertSame(
            'Közepes',
            $eredmeny['ertekeles']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 4. TESZT - MAGAS CSAPATERŐSSÉG
    |--------------------------------------------------------------------------
    |
    | 4 győzelem
    | 0 döntetlen
    | 0 vereség
    | 12 lőtt gól
    | 1 kapott gól
    |
    | Várt index: 98 / 100
    | Értékelés: Magas
    |
    */

    public function test_magas_csapaterosseg(): void
    {
        $eredmeny = $this->statisztika->szamol(
            4,
            0,
            0,
            12,
            1
        );

        $this->assertSame(
            12,
            $eredmeny['pontok']
        );

        $this->assertSame(
            98,
            $eredmeny['teljesitmenyindex']
        );

        $this->assertSame(
            'Magas',
            $eredmeny['ertekeles']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 5. TESZT - ALACSONY CSAPATERŐSSÉG
    |--------------------------------------------------------------------------
    |
    | 0 győzelem
    | 1 döntetlen
    | 0 vereség
    | 0 lőtt gól
    | 0 kapott gól
    |
    | A 0-0 gólarányt a szolgáltatás
    | semleges 0.5 értékkel kezeli.
    |
    | Várt index: 38 / 100
    |
    */

    public function test_alacsony_csapaterosseg(): void
    {
        $eredmeny = $this->statisztika->szamol(
            0,
            1,
            0,
            0,
            0
        );

        $this->assertSame(
            1,
            $eredmeny['pontok']
        );

        $this->assertSame(
            38,
            $eredmeny['teljesitmenyindex']
        );

        $this->assertSame(
            'Alacsony',
            $eredmeny['ertekeles']
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 6. TESZT - KÉT CSAPAT ÖSSZEHASONLÍTÁSA
    |--------------------------------------------------------------------------
    |
    | Első csapat:
    | 2 győzelem, 1 döntetlen, 1 vereség
    | 7 lőtt gól, 4 kapott gól
    | Index: 60
    |
    | Második csapat:
    | 1 győzelem, 2 döntetlen, 1 vereség
    | 5 lőtt gól, 5 kapott gól
    | Index: 44
    |
    | Az első csapat mutatója 16 ponttal
    | magasabb.
    |
    */

    public function test_ket_csapat_osszehasonlitasa(): void
    {
        $elsoCsapat = $this->statisztika->szamol(
            2,
            1,
            1,
            7,
            4
        );

        $masodikCsapat = $this->statisztika->szamol(
            1,
            2,
            1,
            5,
            5
        );

        $this->assertSame(
            60,
            $elsoCsapat['teljesitmenyindex']
        );

        $this->assertSame(
            44,
            $masodikCsapat['teljesitmenyindex']
        );

        $this->assertGreaterThan(
            $masodikCsapat['teljesitmenyindex'],
            $elsoCsapat['teljesitmenyindex']
        );

        $kulonbseg =
            $elsoCsapat['teljesitmenyindex']
            - $masodikCsapat['teljesitmenyindex'];

        $this->assertSame(
            16,
            $kulonbseg
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 7. TESZT - NEGATÍV ÉRTÉK ELUTASÍTÁSA
    |--------------------------------------------------------------------------
    |
    | A győzelmek száma nem lehet negatív.
    | A programnak kivételt kell dobnia.
    |
    */

    public function test_negativ_ertek_elutasitasa(): void
    {
        $this->expectException(
            InvalidArgumentException::class
        );

        $this->expectExceptionMessage(
            'Az adatok nem lehetnek negatívak.'
        );

        $this->statisztika->szamol(
            -1,
            1,
            1,
            2,
            3
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 8. TESZT - NULLA MÉRKŐZÉS ELUTASÍTÁSA
    |--------------------------------------------------------------------------
    |
    | Ha nincs legalább egy mérkőzés,
    | a rendszer nem végezhet számítást.
    |
    */

    public function test_nulla_merkozes_elutasitasa(): void
    {
        $this->expectException(
            InvalidArgumentException::class
        );

        $this->expectExceptionMessage(
            'Legalább egy mérkőzést meg kell adni.'
        );

        $this->statisztika->szamol(
            0,
            0,
            0,
            0,
            0
        );
    }
}
