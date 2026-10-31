<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Klub extends Model
{
    // Az adatbázistábla neve
    protected $table = 'klub';

    // A tábla nem tartalmaz időbélyegeket
    public $timestamps = false;

    // Módosítható mezők
    protected $fillable = [
        'csapatnev',
    ];

    // Egy klubhoz több labdarúgó tartozhat
    public function labdarugok(): HasMany
    {
        return $this->hasMany(
            Labdarugo::class,
            'klubid',
            'id'
        );
    }
}
