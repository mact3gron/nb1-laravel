
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| NB I. - Adminisztrátori jogosultság
|--------------------------------------------------------------------------
|
| Laravel 12
|
| A users táblához hozzáadjuk
| az is_admin mezőt.
|
| false = normál felhasználó
| true  = adminisztrátor
|
*/

return new class extends Migration
{
    /**
     * Migration végrehajtása.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->boolean('is_admin')
                ->default(false);

        });
    }

    /**
     * Migration visszavonása.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            $table->dropColumn('is_admin');

        });
    }
};
