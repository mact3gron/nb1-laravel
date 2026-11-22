
<x-mainpage>
    <h1>Felhasználói oldal</h1>

    <h2>Üdvözlünk, {{ Auth::user()->name }}!</h2>

    <p>
        Sikeresen bejelentkeztél az NB I. labdarúgó-statisztikai rendszerbe.
    </p>

    <p>
        <strong>E-mail-cím:</strong>
        {{ Auth::user()->email }}
    </p>

    <p>
        <strong>Jogosultság:</strong>
        @if (Auth::user()->role == 1)
            Adminisztrátor
        @else
            Normál felhasználó
        @endif
    </p>

    <hr>

    <h2>NB I. adatbázis – áttekintés</h2>

    <p>
        <strong>Klubok száma:</strong>
        {{ \Illuminate\Support\Facades\DB::table('klub')->count() }}
    </p>

    <p>
        <strong>Labdarúgók száma:</strong>
        {{ \Illuminate\Support\Facades\DB::table('labdarugo')->count() }}
    </p>

    <p>
        <strong>Posztok száma:</strong>
        {{ \Illuminate\Support\Facades\DB::table('poszt')->count() }}
    </p>

    <hr>

    <h2>Elérhető funkciók</h2>

    <ul>
        <li>
            <a href="{{ route('klubok.index') }}">Klubok megtekintése</a>
        </li>

        <li>
            <a href="{{ route('labdarugok.index') }}">Labdarúgók megtekintése</a>
        </li>

        <li>
            <a href="{{ route('diagram.index') }}">Diagramok</a>
        </li>

        <li>
            <a href="{{ route('csapatstatisztika.index') }}">Csapaterősség</a>
        </li>

        <li>
            <a href="{{ route('csapatosszehasonlitas.index') }}">Csapatok összehasonlítása</a>
        </li>

        <li>
            <a href="{{ route('uzenetek.index') }}">Üzenetek</a>
        </li>
    </ul>

    @if (Auth::user()->role == 1)
        <hr>

        <h2>Adminisztrátori funkciók</h2>

        <p>
            <a href="{{ route('admin.index') }}">
                Adminisztrációs felület megnyitása
            </a>
        </p>
    @endif
</x-mainpage>