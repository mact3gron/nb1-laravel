<?php
namespace App\Services;

use InvalidArgumentException;

/*
|--------------------------------------------------------------------------
| NB I. - CSAPATSTATISZTIKA
|--------------------------------------------------------------------------
|
| Teszt menü - számítási logika
|
| Bemenő adatok:
| - Győzelmek
| - Döntetlenek
| - Vereségek
| - Lőtt gólok
| - Kapott gólok
|
| Kimenő adatok:
| - Mérkőzések száma
| - Pontszám
| - Gólkülönbség
| - Lőtt gólok átlaga
| - Becsült teljesítményindex
|
| A teljesítményindex saját, szemléltető
| képlet, nem hivatalos csapaterősség.
|
*/

class CsapatStatisztika
{
    public function szamol(
        int $gyozelmek,
        int $dontetlenek,
        int $veresegek,
        int $lottGolok,
        int $kapottGolok
    ): array {

        // 1. Negatív adatok ellenőrzése

        $adatok = [
            $gyozelmek,
            $dontetlenek,
            $veresegek,
            $lottGolok,
            $kapottGolok,
        ];

        foreach ($adatok as $adat) {
            if ($adat < 0) {
                throw new InvalidArgumentException(
                    'Az adatok nem lehetnek negatívak.'
                );
            }
        }

        // 2. Mérkőzések száma

        $merkozesek =
            $gyozelmek +
            $dontetlenek +
            $veresegek;

        if ($merkozesek === 0) {
            throw new InvalidArgumentException(
                'Legalább egy mérkőzést meg kell adni.'
            );
        }

        // 3. Bajnoki pontszám

        $pontok =
            $gyozelmek * 3 +
            $dontetlenek;

        // 4. Gólkülönbség

        $golkulonbseg =
            $lottGolok - $kapottGolok;

        // 5. Lőtt gólok átlaga mérkőzésenként

        $golAtlag = round(
            $lottGolok / $merkozesek,
            2
        );

        // 6. Megszerzett pontok aránya

        $maximalisPont = $merkozesek * 3;

        $pontArany =
            $pontok / $maximalisPont;

        // 7. Lőtt gólok részaránya
        // 0-0 összesítés esetén semleges 0.5

        $osszesGol = $lottGolok + $kapottGolok;

        $golArany = $osszesGol > 0
            ? $lottGolok / $osszesGol
            : 0.5;

        // 8. Becsült teljesítményindex
        // Pontarány: 70%
        // Gólarány: 30%

        $index = (int) round(
            100 * (
                0.70 * $pontArany +
                0.30 * $golArany
            )
        );

        $ertekeles = match (true) {
            $index >= 70 => 'Magas',
            $index >= 40 => 'Közepes',
            default => 'Alacsony',
        };

        return [
            'merkozesek' => $merkozesek,
            'pontok' => $pontok,
            'golkulonbseg' => $golkulonbseg,
            'gol_atlag' => $golAtlag,
            'teljesitmenyindex' => $index,
            'ertekeles' => $ertekeles,
        ];
    }
}
