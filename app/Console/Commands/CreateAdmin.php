<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| NB I. - Adminisztrátor létrehozása
|--------------------------------------------------------------------------
|
| Laravel 12
|
| Parancs:
| php artisan admin:create
|
| Funkciók:
| - Új adminisztrátor létrehozása
| - Meglévő felhasználó adminná tétele
| - Jelszó bekérése rejtetten
| - Jelszó megerősítése
| - Biztonságos jelszóhash készítése
|
*/

class CreateAdmin extends Command
{
    /**
     * Artisan parancs neve.
     */
    protected $signature = 'admin:create';

    /**
     * Parancs leírása.
     */
    protected $description =
        'NB I. adminisztrátori fiók létrehozása';

    /**
     * Parancs végrehajtása.
     */
    public function handle(): int
    {
        $this->newLine();

        $this->info('====================================');
        $this->info(' NB I. ADMINISZTRÁTOR LÉTREHOZÁSA');
        $this->info('====================================');

        $this->newLine();

        // Ellenőrizzük az adatbázis szerkezetét.
        if (!Schema::hasColumn('users', 'is_admin')) {
            $this->error(
                'Hiányzik az is_admin oszlop!'
            );

            $this->warn(
                'Először futtasd: php artisan migrate'
            );

            return self::FAILURE;
        }

        // E-mail-cím bekérése.
        $email = strtolower(trim(
            (string) $this->ask('E-mail-cím')
        ));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Érvénytelen e-mail-cím!');

            return self::FAILURE;
        }

        // Meglévő felhasználó ellenőrzése.
        $existingUser = User::query()
            ->where('email', $email)
            ->first();

        if ($existingUser !== null) {

            if ($existingUser->is_admin) {
                $this->info(
                    'Ez a felhasználó már adminisztrátor.'
                );

                return self::SUCCESS;
            }

            $this->warn(
                'Ezzel az e-mail-címmel már létezik felhasználó.'
            );

            // Adminjogosultság csak jóváhagyással.
            if (!$this->confirm(
                'Adminisztrátorrá szeretnéd tenni?',
                false
            )) {
                $this->info('Művelet megszakítva.');

                return self::SUCCESS;
            }

            $existingUser->is_admin = true;
            $existingUser->save();

            $this->newLine();

            $this->info(
                'A meglévő felhasználó adminisztrátor lett!'
            );

            return self::SUCCESS;
        }

        // Új felhasználó neve.
        $name = trim(
            (string) $this->ask('Teljes név')
        );

        if ($name === '') {
            $this->error('A név nem lehet üres!');

            return self::FAILURE;
        }

        // Jelszó bekérése.
        // A terminál nem jeleníti meg a karaktereket.
        $password = (string) $this->secret(
            'Jelszó (minimum 12 karakter)'
        );

        if (strlen($password) < 12) {
            $this->error(
                'A jelszó legyen legalább 12 karakter!'
            );

            return self::FAILURE;
        }

        // Jelszó megerősítése.
        $passwordConfirmation = (string) $this->secret(
            'Jelszó megerősítése'
        );

        if (!hash_equals(
            $password,
            $passwordConfirmation
        )) {
            $this->error(
                'A két jelszó nem egyezik!'
            );

            return self::FAILURE;
        }

        // Adatok végleges jóváhagyása.
        $this->newLine();

        $this->line("Név: {$name}");
        $this->line("E-mail: {$email}");

        if (!$this->confirm(
            'Létrehozod az adminisztrátort?',
            false
        )) {
            $this->warn('Művelet megszakítva.');

            return self::SUCCESS;
        }

        // Új adminisztrátori felhasználó.
        $user = new User();

        $user->name = $name;
        $user->email = $email;

        // Jelszó biztonságos tárolása.
        $user->password=Hash::make($password);

        // Adminjogosultság beállítása.
        $user->is_admin = true;

        // E-mail-cím ellenőrzésének kezelése.
        // Csak akkor jelöljük ellenőrzöttnek,
        // ha ezt a parancs futtatója igazolja.
        if ($this->confirm(
            'Az e-mail-cím tulajdonjoga ellenőrizve van?',
            false
        )) {
            $user->email_verified_at = now();
        }

        // Mentés az adatbázisba.
        $user->save();

        $this->newLine();

        $this->info('====================================');
        $this->info(' ADMINISZTRÁTOR SIKERESEN LÉTREHOZVA');
        $this->info('====================================');

        $this->line("Felhasználó: {$user->name}");
        $this->line("E-mail: {$user->email}");

        $this->newLine();

        return self::SUCCESS;
    }
}



