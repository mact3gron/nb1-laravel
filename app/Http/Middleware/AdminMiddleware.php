<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/*
|--------------------------------------------------------------------------
| NB I. - ADMIN MIDDLEWARE
|--------------------------------------------------------------------------
|
| Laravel 12
|
| Feladat:
| - Vendég felhasználó átirányítása
| - Normál felhasználó hozzáférésének tiltása
| - Adminisztrátor továbbengedése
|
*/

class AdminMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        // Bejelentkezett felhasználó
        $user = $request->user();

        // 1. Vendég felhasználó
        if ($user === null) {
            return redirect()->guest(route('login'));
        }

        // 2. Normál felhasználó
        if ($user->is_admin !== true) {
            abort(
                403,
                'Nincs jogosultságod az adminfelület használatához.'
            );
        }

        // 3. Adminisztrátor
        return $next($request);
    }
}
