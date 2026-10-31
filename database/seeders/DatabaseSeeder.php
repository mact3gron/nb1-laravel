<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Az adatbázis feltöltése.
     */
    public function run(): void
    {
        $this->call([
            Nb1Seeder::class,
        ]);
    }
}
