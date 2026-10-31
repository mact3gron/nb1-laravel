<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/*
|--------------------------------------------------------------------------
| NB I. - Felhasználó modell
|--------------------------------------------------------------------------
|
| Laravel 12
|
| Felhasználói jogosultságok:
|
| is_admin = false : normál felhasználó
| is_admin = true  : adminisztrátor
|
*/

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Tömegesen kitölthető mezők.
     *
     * Az is_admin mezőt biztonsági okból
     * nem engedjük tömegesen kitölteni.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * JSON-válaszokban rejtett mezők.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Adattípusok.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Adminisztrátor-e a felhasználó?
     */
    public function isAdmin(): bool
    {
        return $this->is_admin === true;
    }
}