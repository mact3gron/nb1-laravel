<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Klubok
        Schema::create('klub', function (Blueprint $table) {
            $table->id();
            $table->string('csapatnev');
        });

        // Játékosposztok
        Schema::create('poszt', function (Blueprint $table) {
            $table->id();
            $table->string('nev');
        });

        // Labdarúgók
        Schema::create('labdarugo', function (Blueprint $table) {
            $table->id();
            $table->integer('mezszam');

            $table->foreignId('klubid')
                  ->constrained('klub')
                  ->restrictOnDelete();

            $table->foreignId('posztid')
                  ->constrained('poszt')
                  ->restrictOnDelete();

            $table->string('utonev')->nullable();
            $table->string('vezeteknev');
            $table->date('szulido');
            $table->boolean('magyar');
            $table->boolean('kulfoldi');
            $table->integer('ertek');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('labdarugo');
        Schema::dropIfExists('poszt');
        Schema::dropIfExists('klub');
    }
};
