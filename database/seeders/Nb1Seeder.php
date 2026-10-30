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
                    ? null : $row['utonev'],
                'vezeteknev' => $row['vezeteknev'],
                'szulido' => str_replace(
                    '.', '-', $row['szulido']
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
            DB::table('klub')->upsert(
                $klubok,
                ['id'],
                ['csapatnev']
            );

            DB::table('poszt')->upsert(
                $posztok,
                ['id'],
                ['nev']
            );

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
                        'ertek'
                    ]
                );
            }
        });
    }

    private function readTsv(string $filename): array
    {
        $path = database_path('data/' . $filename);

        if (!is_file($path)) {
            throw new RuntimeException(
                "Hiányzó adatfájl: {$path}"
            );
        }

        $lines = file(
            $path,
            FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
        );

        if (lines===false||count(lines) < 2) {
            throw new RuntimeException(
                "Üres adatfájl: {$path}"
            );
        }

        $headers = explode("\t", array_shift($lines));
        $rows = [];

        foreach ($lines as $line) {
            $values = explode("\t", $line);

            if (count(values)!==count(headers)) {
                throw new RuntimeException(
                    "Hibás adatsor: {$path}"
                );
            }

            $rows[]=arraycombine(headers, $values);
        }

        return $rows;
    }
}
