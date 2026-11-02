<?php
namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

/*
|--------------------------------------------------------------------------
| NB I. - INERTIA MIDDLEWARE
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Feladata:
| - Alkalmazás neve
| - Eredeti Laravel idézetadatok
| - Bejelentkezett felhasználó átadása
| - Adminjogosultság elérhetővé tétele
| - Sikeres és sikertelen műveletek visszajelzése
|
*/

class HandleInertiaRequests extends Middleware
{
    /**
     * Laravel alapnézet.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Frontend állományok verziója.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Globálisan megosztott Inertia adatok.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Az eredeti starter kit idézetei
        [$message, $author] = str(
            Inspiring::quotes()->random()
        )->explode('-');

        return array_merge(
            parent::share($request),
            [
                // Alkalmazás neve
                'name' => config('app.name'),

                // Eredeti idézetadatok megtartása
                'quote' => [
                    'message' => trim($message),
                    'author' => trim($author),
                ],

                // Bejelentkezett felhasználó
                'auth' => [
                    'user' => $request->user(),
                ],

                // Sikeres és sikertelen műveletek
                'flash' => [
                    'success' => fn () =>
                        $request->session()->get(
                            'success'
                        ),

                    'error' => fn () =>
                        $request->session()->get(
                            'error'
                        ),
                ],
            ]
        );
    }
}
