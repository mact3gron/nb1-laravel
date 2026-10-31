<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/*
|--------------------------------------------------------------------------
| NB I. - Adminisztrátori Middleware
|--------------------------------------------------------------------------
|
| Laravel 12
|
| Feladata:
|
| 1. Ellenőrzi, hogy a felhasználó bejelentkezett-e.
| 2. Ellenőrzi az is_admin mező értékét.
| 3. Csak adminisztrátor esetén engedi tovább a kérést.
|
| Vendég: bejelentkezési oldal
| Normál felhasználó: HTTP 403
| Adminisztrátor: hozzáférés engedélyezve
|
*/

class AdminMiddleware
{
    /**
     * Beérkező HTTP-kérés ellenőrzése.
     *
     * @param Closure(Request): Response $next
     */
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        // Bejelentkezett felhasználó lekérése.
        $user = $request->user();

        // 1. Nincs bejelentkezve.
        if ($user === null) {
            return redirect()->guest(route('login'));
        }

        // 2. Bejelentkezett, de nem admin.
        if ($user->is_admin !== true) {
            abort(
                403,
                'Nincs jogosultságod az adminfelület használatához.'
            );
        }

        // 3. Adminisztrátor: kérés továbbengedése.
        return next(request);
    }
}