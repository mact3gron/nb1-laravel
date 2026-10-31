<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poszt extends Model
{
    // Az adatbázistábla neve
    protected $table = 'poszt';

    // A tábla nem tartalmaz időbélyegeket
    public $timestamps = false;

    // Tömegesen kitölthető mezők
    protected $fillable = [
        'nev',
    ];

    // Egy poszthoz több labdarúgó tartozhat
    public function labdarugok(): HasMany
    {
        return $this->hasMany(
            Labdarugo::class,
            'posztid',
            'id'
        );
    }
}
