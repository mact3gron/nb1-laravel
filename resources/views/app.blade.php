<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    >

    <title inertia>
        {{ config('app.name', 'NB I. Labdarúgás') }}
    </title>

    <!-- Eredeti betűtípus -->
    <link
        rel="preconnect"
        href="https://fonts.bunny.net"
    >

    <link
        href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
        rel="stylesheet"
    >

    <!-- Laravel útvonalak -->
    @routes

    <!-- React fejlesztői környezet -->
    @viteReactRefresh

    <!-- Laravel + React + Tailwind -->
    @vite('resources/js/app.tsx')

    <!-- Inertia oldalcímek -->
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>
</html>