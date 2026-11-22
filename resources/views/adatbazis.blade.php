<x-mainpage>
    <style>
        .nb1-database { background: #060b1e; color: #eef5ff; min-height: 70vh; }
        .nb1-database-hero { padding: 62px 24px; background: linear-gradient(110deg, #10182e 0%, #09172a 55%, #002f24 100%); }
        .nb1-database-container { max-width: 1200px; margin: 0 auto; }
        .nb1-database-breadcrumb { color: #91adc3; font-size: 14px; margin: 0 0 28px; }
        .nb1-database-breadcrumb a { color: #91adc3; text-decoration: none; }
        .nb1-database-kicker { display: inline-block; padding: 7px 16px; border: 1px solid #007f62; border-radius: 100px; color: #00d69d; font-size: 12px; font-weight: 800; letter-spacing: 0.5px; }
        .nb1-database-title { margin: 22px 0 16px; font-size: clamp(34px, 5vw, 48px); line-height: 1.2; font-weight: 900; color: #fff; }
        .nb1-database-title span { color: #00c890; }
        .nb1-database-description { max-width: 750px; margin: 0; color: #d4e4ff; font-size: 16px; line-height: 1.9; }
        .nb1-database-content { padding: 44px 24px 85px; }
        .nb1-database-section { margin-bottom: 30px; background: #10182d; border: 1px solid #263348; border-radius: 14px; overflow: hidden; }
        .nb1-database-section-head { padding: 25px 26px 19px; border-bottom: 1px solid #263348; }
        .nb1-database-section-title { margin: 0; color: #fff; font-size: 22px; font-weight: 800; }
        .nb1-database-section-desc { margin: 7px 0 0; color: #9bb7d6; font-size: 14px; }
        .nb1-database-table-wrap { overflow-x: auto; }
        .nb1-database-table { width: 100%; border-collapse: collapse; color: #e9f2ff; text-align: left; font-size: 14px; }
        .nb1-database-table thead { background: #1d2a42; color: #e5f0ff; }
        .nb1-database-table th { padding: 15px 18px; font-size: 12px; font-weight: 800; white-space: nowrap; }
        .nb1-database-table td { padding: 15px 18px; border-top: 1px solid #263348; }
        .nb1-database-table tbody tr:hover { background: #16243c; }
        .nb1-database-empty { text-align: center; color: #9bb7d6; }
        .nb1-database-pagination { padding: 22px 26px; border-top: 1px solid #263348; color: #fff; }
        .nb1-database-pagination nav { max-width: 100%; }
        .nb1-database-pagination a, .nb1-database-pagination span { color: #e7f5ff; }
        .nb1-database-pagination svg { width: 18px; height: 18px; }
        @media (max-width: 600px) {
            .nb1-database-hero { padding: 38px 18px; }
            .nb1-database-content { padding: 24px 14px 55px; }
            .nb1-database-section-head { padding: 20px 18px; }
            .nb1-database-table th, .nb1-database-table td { padding: 12px; }
            .nb1-database-pagination { padding: 18px; }
        }
    </style>

    <div class="nb1-database">
        <section class="nb1-database-hero">
            <div class="nb1-database-container">
                <p class="nb1-database-breadcrumb"><a href="{{ route('home') }}">Főoldal</a> / Adatbázis</p>
                <span class="nb1-database-kicker">MAGYAR LABDARÚGÁS</span>
                <h1 class="nb1-database-title">NB I. <span>ADATBÁZIS</span></h1>
                <p class="nb1-database-description">Fedezd fel az NB I. klubjait, labdarúgóit és játékosposztjait. Az adatok közvetlenül a rendszer három összekapcsolt adatbázistáblájából származnak.</p>
            </div>
        </section>

        <div class="nb1-database-content">
            <div class="nb1-database-container">
                <section class="nb1-database-section">
                    <div class="nb1-database-section-head">
                        <h2 class="nb1-database-section-title">Klubok</h2>
                        <p class="nb1-database-section-desc">A klubok és a hozzájuk tartozó labdarúgók száma.</p>
                    </div>
                    <div class="nb1-database-table-wrap">
                        <table class="nb1-database-table">
                            <thead><tr><th>ID</th><th>Klub neve</th><th>Labdarúgók száma</th></tr></thead>
                            <tbody>
                                @forelse ($klubok as $klub)
                                    <tr><td>{{ $klub->id }}</td><td>{{ $klub->csapatnev }}</td><td>{{ $klub->labdarugok_count }}</td></tr>
                                @empty
                                    <tr><td class="nb1-database-empty" colspan="3">Nincsenek klubok.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    <div class="nb1-database-pagination">{{ $klubok->links() }}</div>
                </section>

                <section class="nb1-database-section">
                    <div class="nb1-database-section-head">
                        <h2 class="nb1-database-section-title">Labdarúgók</h2>
                        <p class="nb1-database-section-desc">A játékosok és kapcsolódó klub- és posztadataik.</p>
                    </div>
                    <div class="nb1-database-table-wrap">
                        <table class="nb1-database-table">
                            <thead><tr><th>ID</th><th>Labdarúgó neve</th><th>Klub</th><th>Poszt</th></tr></thead>
                            <tbody>
                                @forelse ($labdarugok as $labdarugo)
                                    <tr>
                                        <td>{{ $labdarugo->id }}</td>
                                        <td>{{ $labdarugo->vezeteknev }} {{ $labdarugo->utonev }}</td>
                                        <td>{{ $labdarugo->klub?->csapatnev ?? 'Nincs adat' }}</td>
                                        <td>{{ $labdarugo->poszt?->nev ?? 'Nincs adat' }}</td>
                                    </tr>
                                @empty
                                    <tr><td class="nb1-database-empty" colspan="4">Nincsenek labdarúgók.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    <div class="nb1-database-pagination">{{ $labdarugok->links() }}</div>
                </section>

                <section class="nb1-database-section">
                    <div class="nb1-database-section-head">
                        <h2 class="nb1-database-section-title">Posztok</h2>
                        <p class="nb1-database-section-desc">Az adatbázisban szereplő labdarúgóposztok.</p>
                    </div>
                    <div class="nb1-database-table-wrap">
                        <table class="nb1-database-table">
                            <thead><tr><th>ID</th><th>Poszt neve</th></tr></thead>
                            <tbody>
                                @forelse ($posztok as $poszt)
                                    <tr><td>{{ $poszt->id }}</td><td>{{ $poszt->nev }}</td></tr>
                                @empty
                                    <tr><td class="nb1-database-empty" colspan="2">Nincsenek posztok.</td></tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                    <div class="nb1-database-pagination">{{ $posztok->links() }}</div>
                </section>
            </div>
        </div>
    </div>
</x-mainpage>