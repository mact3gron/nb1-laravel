<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Labdarugo extends Model
{
    // Az adatbázistábla neve
    protected $table = 'labdarugo';

    // A tábla nem tartalmaz időbélyegeket
    public $timestamps = false;

    // Tömegesen kitölthető mezők
    protected $fillable = [
        'mezszam',
        'klubid',
        'posztid',
        'utonev',
        'vezeteknev',
        'szulido',
        'magyar',
        'kulfoldi',
        'ertek',
    ];

    // Adattípusok kezelése
    protected function casts(): array
    {
        return [
            'mezszam' => 'integer',
            'klubid' => 'integer',
            'posztid' => 'integer',
            'szulido' => 'date',
            'magyar' => 'boolean',
            'kulfoldi' => 'boolean',
            'ertek' => 'integer',
        ];
    }

    // A labdarúgó egy klubhoz tartozik
    public function klub(): BelongsTo
    {
        return $this->belongsTo(
            Klub::class,
            'klubid',
            'id'
        );
    }

    // A labdarúgó egy poszthoz tartozik
    public function poszt(): BelongsTo
    {
        return $this->belongsTo(
            Poszt::class,
            'posztid',
            'id'
        );
    }
}
