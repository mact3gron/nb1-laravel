<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(
        Request $request,
        Closure $next
    ): Response {

        $user = $request->user();

        if ($user === null) {
            return redirect()->guest(route('login'));
        }

        if ((int) $user->role !== 1) {
            abort(
                403,
                'Nincs jogosultságod az adminfelület használatához.'
            );
        }

        return $next($request);
    }
}