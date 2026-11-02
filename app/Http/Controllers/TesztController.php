<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

/*
|--------------------------------------------------------------------------
| NB I. - TESZT EREDMÉNYEK CONTROLLER
|--------------------------------------------------------------------------
|
| Valódi PHPUnit / Laravel Unit és Feature teszteredmények megjelenítése.
|
| A Controller kizárólag egy helyi JUnit XML jelentést olvas.
| NEM futtat terminálparancsot HTTP-kérésből, és NEM módosít adatbázist.
|
| Az útvonalat később auth + admin middleware-rel védjük.
|
*/

class TesztController extends Controller
{
    public function index(): Response
    {
        // Fix, nem nyilvános fájlútvonal. Nem fogadunk fájlnevet a kérésből.
        $fajl = storage_path('app/test-results/junit.xml');

        $jelentes = [
            'elerheto' => false,
            'frissitve' => null,
            'osszes' => 0,
            'sikeres' => 0,
            'sikertelen' => 0,
            'kihagyott' => 0,
            'unit' => 0,
            'feature' => 0,
            'egyeb' => 0,
            'futasiIdo' => 0.0,
            'tesztek' => [],
            'hiba' => null,
        ];

        // Még nem készült JUnit jelentés.
        if (!is_file($fajl)) {
            $jelentes['hiba'] =
                'Még nincs teszteredmény. Futtasd a teszteket JUnit jelentéssel.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        if (!is_readable($fajl)) {
            $jelentes['hiba'] = 'A tesztjelentés nem olvasható.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        // Sérült vagy szokatlanul nagy jelentést nem dolgozunk fel.
        $meret = filesize($fajl);

        if ($meret === false || $meret === 0 || $meret > 5 * 1024 * 1024) {
            $jelentes['hiba'] = 'A tesztjelentés üres vagy túl nagy.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        if (!function_exists('simplexml_load_file')) {
            $jelentes['hiba'] =
                'A PHP SimpleXML bővítmény nincs engedélyezve.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        // XML-értelmezés hálózati hozzáférés nélkül.
        $korabbiHibakezeles = libxml_use_internal_errors(true);

        try {
            $xml = @simplexml_load_file(
                $fajl,
                \SimpleXMLElement::class,
                LIBXML_NONET
            );
        } finally {
            libxml_clear_errors();
            libxml_use_internal_errors($korabbiHibakezeles);
        }

        if ($xml === false) {
            $jelentes['hiba'] = 'A JUnit XML jelentés hibás vagy sérült.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        $esetek = $xml->xpath('//testcase');

        if ($esetek === false || count($esetek) === 0) {
            $jelentes['hiba'] = 'A jelentés nem tartalmaz teszteseteket.';

            return Inertia::render('teszt/index', [
                'jelentes' => $jelentes,
            ]);
        }

        foreach ($esetek as $eset) {
            $nev = (string) ($eset['name'] ?? 'Ismeretlen teszt');
            $osztaly = (string) ($eset['class'] ?? $eset['classname'] ?? '');
            $fajlnev = (string) ($eset['file'] ?? '');
            $ido = (float) ($eset['time'] ?? 0);

            // A PHPUnit különböző verziói eltérő elválasztókat használhatnak.
            $azonosito = strtolower(str_replace(
                ['/', '.'],
                '\\',
                $osztaly . ' ' . $fajlnev
            ));

            $tipus = 'Egyéb';

            if (str_contains($azonosito, 'tests\\unit\\')) {
                $tipus = 'Unit';
                $jelentes['unit']++;
            } elseif (str_contains($azonosito, 'tests\\feature\\')) {
                $tipus = 'Feature';
                $jelentes['feature']++;
            } else {
                $jelentes['egyeb']++;
            }

            if (count($eset->failure) > 0 || count($eset->error) > 0) {
                $allapot = 'sikertelen';
                $jelentes['sikertelen']++;
            } elseif (count($eset->skipped) > 0) {
                $allapot = 'kihagyott';
                $jelentes['kihagyott']++;
            } else {
                $allapot = 'sikeres';
                $jelentes['sikeres']++;
            }

            $jelentes['tesztek'][] = [
                'nev' => $nev,
                'osztaly' => $osztaly,
                'tipus' => $tipus,
                'allapot' => $allapot,
                'ido' => round($ido, 3),
            ];

            $jelentes['futasiIdo'] += $ido;
        }

        $jelentes['osszes'] = count($jelentes['tesztek']);
        $jelentes['futasiIdo'] = round($jelentes['futasiIdo'], 3);
        $jelentes['elerheto'] = true;

        $modositas = filemtime($fajl);
        $jelentes['frissitve'] = $modositas !== false
            ? date('Y-m-d H:i:s', $modositas)
            : null;

        return Inertia::render('teszt/index', [
            'jelentes' => $jelentes,
        ]);
    }
}
