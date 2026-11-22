@php
    $path = request()->path();
    $active = function (string $href) use ($path): string {
        $normalized = trim($href, '/');
        $selected = $normalized === ''
            ? $path === '/'
            : ($path === $normalized || str_starts_with($path, $normalized . '/'));
        return $selected ? 'nb1-nav-link nb1-nav-active' : 'nb1-nav-link';
    };
    $admin = auth()->check() && (int) auth()->user()->role === 1;
@endphp

<header class="nb1-site-header">
    <div class="nb1-header-container">
        <div class="nb1-brand-area">
            <a href="{{ route('home') }}" class="nb1-brand">NB I. Labdarúgás</a>
            <p class="nb1-brand-subtitle">Magyar labdarúgóklubok és játékosok adatbázisa</p>
        </div>

        <div class="nb1-navigation-row">
            <nav class="nb1-navigation" aria-label="Fő navigáció">
                <a class="{{ $active('/') }}" href="{{ route('home') }}">Főoldal</a>
                <a class="{{ $active('/adatbazis') }}" href="{{ route('adatbazis') }}">Adatbázis</a>
                <a class="{{ $active('/kapcsolat') }}" href="{{ route('kapcsolat.index') }}">Kapcsolat</a>
                <a class="{{ $active('/diagram') }}" href="{{ route('diagram.index') }}">Diagram</a>

                @auth
                    <a class="{{ $active('/uzenetek') }}" href="{{ route('uzenetek.index') }}">Üzenetek</a>
                    @if ($admin)
                        <div class="nb1-admin-dropdown">
                            <button type="button" class="nb1-nav-link nb1-admin-toggle" id="nb1-admin-toggle" aria-expanded="false" aria-controls="nb1-admin-menu">Admin ▾</button>
                            <div class="nb1-admin-dropdown-menu" id="nb1-admin-menu" hidden>
                                <a class="{{ $active('/admin') }}" href="{{ route('admin.index') }}">Admin főoldal</a>
                                <a class="{{ $active('/admin/klubok') }}" href="{{ route('admin.klubok.index') }}">Klub CRUD</a>
                                <a class="{{ $active('/admin/react-labdarugok') }}" href="{{ route('admin.react-labdarugok.index') }}">React + Axios – Labdarúgó CRUD</a>
                                <a class="{{ $active('/admin/teszt') }}" href="{{ route('admin.teszt.index') }}">Tesztek</a>
                            </div>
                        </div>
                    @endif
                @endauth
            </nav>

            <div class="nb1-account-actions">
                @auth
                    <span class="nb1-account-name">{{ auth()->user()->name }}</span>
                    <a href="{{ route('dashboard') }}" class="nb1-account-button nb1-account-outline">Dashboard</a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="nb1-account-button nb1-account-dark">Kijelentkezés</button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="nb1-account-button nb1-account-outline">Bejelentkezés</a>
                    <a href="{{ route('register') }}" class="nb1-account-button nb1-account-primary">Regisztráció</a>
                @endauth
            </div>
        </div>

        <button type="button" class="nb1-mobile-menu-button" id="nb1-mobile-toggle" aria-controls="nb1-mobile-navigation" aria-expanded="false">☰ Menü megnyitása</button>

        <nav id="nb1-mobile-navigation" class="nb1-mobile-navigation" aria-label="Mobil navigáció" hidden>
            <a class="{{ $active('/') }}" href="{{ route('home') }}">Főoldal</a>
            <a class="{{ $active('/adatbazis') }}" href="{{ route('adatbazis') }}">Adatbázis</a>
            <a class="{{ $active('/kapcsolat') }}" href="{{ route('kapcsolat.index') }}">Kapcsolat</a>
            <a class="{{ $active('/diagram') }}" href="{{ route('diagram.index') }}">Diagram</a>

            @auth
                <a class="{{ $active('/uzenetek') }}" href="{{ route('uzenetek.index') }}">Üzenetek</a>
                @if ($admin)
                    <div class="nb1-mobile-section-title">Adminisztráció</div>
                    <a class="{{ $active('/admin') }}" href="{{ route('admin.index') }}">Admin főoldal</a>
                    <a class="{{ $active('/admin/klubok') }}" href="{{ route('admin.klubok.index') }}">Klub CRUD</a>
                    <a class="{{ $active('/admin/react-labdarugok') }}" href="{{ route('admin.react-labdarugok.index') }}">React + Axios – Labdarúgó CRUD</a>
                    <a class="{{ $active('/admin/teszt') }}" href="{{ route('admin.teszt.index') }}">Tesztek</a>
                @endif
                <div class="nb1-mobile-account">
                    <span class="nb1-account-name">Bejelentkezve: {{ auth()->user()->name }}</span>
                    <a href="{{ route('dashboard') }}" class="nb1-account-button nb1-account-outline">Dashboard</a>
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit" class="nb1-account-button nb1-account-dark">Kijelentkezés</button>
                    </form>
                </div>
            @else
                <div class="nb1-mobile-account">
                    <a href="{{ route('login') }}" class="nb1-account-button nb1-account-outline">Bejelentkezés</a>
                    <a href="{{ route('register') }}" class="nb1-account-button nb1-account-primary">Regisztráció</a>
                </div>
            @endauth
        </nav>
    </div>
</header>