<?php
namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Throwable;

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
| - Adminjogosultság egységes kezelése (role és is_admin)
| - Adatbázisszerkezet ellenőrzése
| - E-mail és név ellenőrzése
| - Jelszó bekérése rejtetten
| - Jelszó megerősítése
| - Biztonságos jelszóhash készítése
| - Hibakezelés
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

        /*
        |--------------------------------------------------------------------------
        | 1. Adatbázis ellenőrzése
        |--------------------------------------------------------------------------
        */

        try {
            if (!Schema::hasTable('users')) {
                $this->error('Hiányzik a users tábla!');
                $this->warn(
                    'Futtasd: php artisan migrate'
                );

                return self::FAILURE;
            }

            if (
                !Schema::hasColumn('users', 'is_admin') ||
                !Schema::hasColumn('users', 'role')
            ) {
                $this->error(
                    'Hiányzik az is_admin vagy a role oszlop!'
                );

                $this->warn(
                    'Futtasd: php artisan migrate'
                );

                return self::FAILURE;
            }
        } catch (Throwable $e) {
            report($e);

            $this->error(
                'Nem sikerült ellenőrizni az adatbázist!'
            );

            $this->warn(
                'Ellenőrizd a .env adatbázis-beállításait!'
            );

            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 2. E-mail-cím bekérése és ellenőrzése
        |--------------------------------------------------------------------------
        */

        $email = strtolower(trim(
            (string) $this->ask('E-mail-cím')
        ));

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Érvénytelen e-mail-cím!');

            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Meglévő felhasználó keresése
        |--------------------------------------------------------------------------
        */

        try {
            $existingUser = User::query()
                ->where('email', $email)
                ->first();
        } catch (Throwable $e) {
            report($e);

            $this->error(
                'Hiba történt a felhasználó keresésekor!'
            );

            return self::FAILURE;
        }

        if ($existingUser !== null) {

            // Ellenőrizzük mindkét adminmezőt.
            if (
                (bool) $existingUser->is_admin &&
                (int) $existingUser->role === 1
            ) {
                $this->info(
                    'Ez a felhasználó már adminisztrátor.'
                );

                return self::SUCCESS;
            }

            $this->warn(
                'Ezzel az e-mail-címmel már létezik felhasználó.'
            );

            $this->line(
                "Felhasználó: {$existingUser->name}"
            );

            // Adminjogosultság csak jóváhagyással.
            if (!$this->confirm(
                'Adminisztrátorrá szeretnéd tenni?',
                false
            )) {
                $this->info('Művelet megszakítva.');

                return self::SUCCESS;
            }

            /*
            | Adminjogosultság egységes beállítása.
            | role = 1 : adminisztrátor
            | role = 2 : normál felhasználó
            */

            try {
                $existingUser->is_admin = true;
                $existingUser->role = 1;

                $existingUser->save();
            } catch (Throwable $e) {
                report($e);

                $this->error(
                    'Nem sikerült beállítani az adminjogosultságot!'
                );

                return self::FAILURE;
            }

            $this->newLine();

            $this->info('====================================');
            $this->info(' ADMINJOGOSULTSÁG SIKERESEN BEÁLLÍTVA');
            $this->info('====================================');

            $this->line(
                "Felhasználó: {$existingUser->name}"
            );

            $this->line(
                "E-mail: {$existingUser->email}"
            );

            $this->newLine();

            return self::SUCCESS;
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Új felhasználó nevének bekérése
        |--------------------------------------------------------------------------
        */

        $name = trim(
            (string) $this->ask('Teljes név')
        );

        if ($name === '') {
            $this->error('A név nem lehet üres!');

            return self::FAILURE;
        }

        if (mb_strlen($name) > 255) {
            $this->error(
                'A név legfeljebb 255 karakter lehet!'
            );

            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 5. Biztonságos jelszó bekérése
        |--------------------------------------------------------------------------
        */

        // A jelszó karakterei nem jelennek meg.
        $password = (string) $this->secret(
            'Jelszó (minimum 12 karakter)'
        );

        if (mb_strlen($password) < 12) {
            $this->error(
                'A jelszó legyen legalább 12 karakter!'
            );

            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 6. Jelszó megerősítése
        |--------------------------------------------------------------------------
        */

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

        /*
        |--------------------------------------------------------------------------
        | 7. Adatok jóváhagyása
        |--------------------------------------------------------------------------
        */

        $this->newLine();

        $this->line("Név: {$name}");
        $this->line("E-mail: {$email}");

        $this->newLine();

        if (!$this->confirm(
            'Létrehozod az adminisztrátort?',
            false
        )) {
            $this->warn('Művelet megszakítva.');

            return self::SUCCESS;
        }

        /*
        |--------------------------------------------------------------------------
        | 8. E-mail ellenőrzésének kezelése
        |--------------------------------------------------------------------------
        */

        $emailVerified = $this->confirm(
            'Az e-mail-cím tulajdonjogát ellenőrizted?',
            false
        );

        /*
        |--------------------------------------------------------------------------
        | 9. Új adminisztrátor létrehozása
        |--------------------------------------------------------------------------
        */

        try {
            $user = new User();

            $user->name = $name;
            $user->email = $email;

            // Jelszó biztonságos hash-elése.
            $user->password = Hash::make($password);

            // Adminjogosultság.
            $user->is_admin = true;
            $user->role = 1;

            // E-mail-cím ellenőrzöttsége.
            if ($emailVerified) {
                $user->email_verified_at = now();
            }

            // Mentés az adatbázisba.
            $user->save();

        } catch (Throwable $e) {
            report($e);

            $this->error(
                'Nem sikerült létrehozni az adminisztrátort!'
            );

            $this->warn(
                'Ellenőrizd az adatbázist és a Laravel naplófájlt!'
            );

            return self::FAILURE;
        }

        /*
        |--------------------------------------------------------------------------
        | 10. Sikeres létrehozás
        |--------------------------------------------------------------------------
        */

        $this->newLine();

        $this->info('====================================');
        $this->info(' ADMINISZTRÁTOR SIKERESEN LÉTREHOZVA');
        $this->info('====================================');

        $this->line("Felhasználó: {$user->name}");
        $this->line("E-mail: {$user->email}");
        $this->line("Jogosultság: ADMIN");
        $this->line("Role: {$user->role}");

        $this->newLine();

        return self::SUCCESS;
    }
}
