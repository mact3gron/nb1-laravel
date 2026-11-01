<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| NB I. - Üzenetek adatbázistábla
|--------------------------------------------------------------------------
|
| Kapcsolat űrlapon elküldött üzenetek tárolása.
|
| Mezők:
| - id: egyedi azonosító
| - nev: feladó neve
| - email: feladó e-mail-címe
| - targy: üzenet tárgya
| - uzenet: üzenet szövege
| - created_at: elküldés időpontja
| - updated_at: módosítás időpontja
|
*/

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('uzenetek', function (Blueprint $table) {

            // Elsődleges kulcs
            $table->id();

            // Feladó
            $table->string('nev', 100);

            // E-mail-cím
            $table->string('email', 255);

            // Tárgy
            $table->string('targy', 150);

            // Üzenet tartalma
            $table->text('uzenet');

            // Létrehozás és módosítás időpontja
            $table->timestamps();

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('uzenetek');
    }
};
