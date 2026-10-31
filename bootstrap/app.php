<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HandleInertiaRequests;

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| NB I. - Laravel alkalmazás konfigurációja
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js
|
| Middleware:
| - Laravel alap middleware-ek
| - Inertia.js
| - Adminisztrátori jogosultság
|
*/

return Application::configure(
    basePath: dirname(__DIR__)
)

    // ==========================================
    // ÚTVONALAK
    // ==========================================

    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )

    // ==========================================
    // MIDDLEWARE
    // ==========================================

    ->withMiddleware(function (Middleware $middleware): void {

        // Cookie-kivételek
        $middleware->encryptCookies(
            except: [
                'appearance',
                'sidebar_state',
            ]
        );

        // React + Inertia middleware
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // ======================================
        // ADMIN MIDDLEWARE
        // ======================================

        $middleware->alias([
            'admin' => AdminMiddleware::class,
        ]);

    })

    // ==========================================
    // KIVÉTELKEZELÉS
    // ==========================================

    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) =>
                $request->is('api/*') ||
                $request->expectsJson()
        );

    })

    ->create();