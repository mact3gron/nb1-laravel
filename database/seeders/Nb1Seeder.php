<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class Nb1Seeder extends Seeder
{
    public function run(): void
    {
        // Klubok beolvasása
        $klubok = array_map(
            fn (array $row): array => [
                'id' => (int) $row['id'],
                'csapatnev' => $row['csapatnev'],
            ],
            $this->readTsv('klub.txt')
        );

        // Posztok beolvasása
        $posztok = array_map(
            fn (array $row): array => [
                'id' => (int) $row['id'],
                'nev' => $row['nev'],
            ],
            $this->readTsv('poszt.txt')
        );

        // Labdarúgók beolvasása
        $labdarugok = array_map(
            fn (array $row): array => [
                'id' => (int) $row['id'],
                'mezszam' => (int) $row['mezszam'],
                'klubid' => (int) $row['klubid'],
                'posztid' => (int) $row['posztid'],
                'utonev' => $row['utonev'] === ''
                    ? null
                    : $row['utonev'],
                'vezeteknev' => $row['vezeteknev'],
                'szulido' => str_replace(
                    '.',
                    '-',
                    rtrim(trim($row['szulido']), '.')
                ),
                'magyar' => (int) ($row['magyar'] !== '0'),
                'kulfoldi' => (int) ($row['kulfoldi'] !== '0'),
                'ertek' => (int) $row['ertek'],
            ],
            $this->readTsv('labdarugo.txt')
        );

        // Adatok mentése az adatbázisba
        DB::transaction(function () use (
            $klubok,
            $posztok,
            $labdarugok
        ): void {

            // Klubok mentése
            DB::table('klub')->upsert(
                $klubok,
                ['id'],
                ['csapatnev']
            );

            // Posztok mentése
            DB::table('poszt')->upsert(
                $posztok,
                ['id'],
                ['nev']
            );

            // Labdarúgók mentése 100-as csoportokban
            foreach (array_chunk($labdarugok, 100) as $chunk) {
                DB::table('labdarugo')->upsert(
                    $chunk,
                    ['id'],
                    [
                        'mezszam',
                        'klubid',
                        'posztid',
                        'utonev',
                        'vezeteknev',
                        'szulido',
                        'magyar',
                        'kulfoldi',
                        'ertek',
                    ]
                );
            }
        });
    }

    /**
     * TSV adatfájl beolvasása.
     */
    private function readTsv(string $filename): array
    {
        $path = database_path('data/' . $filename);

        // Ellenőrizzük, hogy létezik-e a fájl
        if (!is_file($path)) {
            throw new RuntimeException(
                "Hiányzó adatfájl: {$path}"
            );
        }

        // Fájl sorainak beolvasása
        $lines = file(
            $path,
            FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
        );

        // Ellenőrizzük, hogy van-e adat
        if ($lines === false || count($lines) < 2) {
            throw new RuntimeException(
                "Üres adatfájl: {$path}"
            );
        }

        // Fejléc feldolgozása
        $headerLine = array_shift($lines);

        // UTF-8 BOM eltávolítása, ha szükséges
        $headerLine = preg_replace(
            '/^\xEF\xBB\xBF/',
            '',
            $headerLine
        );

        $headers = explode("\t", $headerLine);

        $rows = [];

        // Adatsorok feldolgozása
        foreach ($lines as $lineNumber => $line) {
            $values = explode("\t", $line);

            // Oszlopok számának ellenőrzése
            if (count($values) !== count($headers)) {
                throw new RuntimeException(
                    "Hibás adatsor a(z) {$filename} fájlban, " .
                    "adatsor: " . ($lineNumber + 1)
                );
            }

            // Fejlécek és értékek összekapcsolása
            $rows[] = array_combine($headers, $values);
        }

        return $rows;
    }
}
