<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/*
|--------------------------------------------------------------------------
| NB I. - Üzenet modell
|--------------------------------------------------------------------------
|
| Laravel 12 - Eloquent ORM
|
| Adatbázistábla: uzenetek
|
| Funkciók:
| - Kapcsolat űrlap adatainak mentése
| - Üzenetek lekérdezése
| - Üzenetek rendezése dátum szerint
|
*/

class Uzenet extends Model
{
    use HasFactory;

    /**
     * Adatbázistábla neve.
     *
     * @var string
     */
    protected $table = 'uzenetek';

    /**
     * Tömegesen kitölthető mezők.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nev',
        'email',
        'targy',
        'uzenet',
    ];

    /**
     * Automatikus időbélyegek.
     */
    public $timestamps = true;

    /**
     * Adattípusok.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * Üzenetek lekérdezése
     * legfrissebb elöl sorrendben.
     */
    public function scopeLegfrissebb($query)
    {
        return $query->orderByDesc('created_at')
                     ->orderByDesc('id');
    }
}
