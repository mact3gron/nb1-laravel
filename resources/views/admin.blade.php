
<x-mainpage>

    @php
        $klubokSzama = \App\Models\Klub::count();
        $labdarugokSzama = \App\Models\Labdarugo::count();
        $posztokSzama = \App\Models\Poszt::count();
    @endphp

    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

        <!-- ADMIN FEJLÉC -->

        <section class="mb-8 rounded-xl bg-[#16271e] px-6 py-8 text-white shadow-lg sm:px-8">

            <p class="mb-3 text-sm font-bold text-[#91dfaf]">
                ADMINISZTRÁCIÓ
            </p>

            <h1 class="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
                Adminisztrációs felület
            </h1>

            <p class="mb-4 text-base text-gray-200">
                Üdvözlünk, {{ Auth::user()->name }}!
                Itt kezelheted az NB I. labdarúgó-statisztikai rendszer adatait.
            </p>

            <span class="inline-flex rounded-full border border-[#91dfaf] px-4 py-2 text-sm font-semibold text-[#91dfaf]">
                Jogosultság: Adminisztrátor
            </span>

        </section>

        <!-- STATISZTIKÁK -->

        <section class="mb-10">

            <h2 class="mb-5 text-2xl font-bold text-[#16271e]">
                Adatbázis – áttekintés
            </h2>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div class="rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm">

                    <p class="mb-3 text-sm font-semibold text-gray-500">
                        Klubok száma
                    </p>

                    <p class="text-4xl font-extrabold text-[#176b43]">
                        {{ $klubokSzama }}
                    </p>

                    <p class="mt-3 text-sm text-gray-500">
                        Nyilvántartott labdarúgóklubok
                    </p>

                </div>

                <div class="rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm">

                    <p class="mb-3 text-sm font-semibold text-gray-500">
                        Labdarúgók száma
                    </p>

                    <p class="text-4xl font-extrabold text-[#176b43]">
                        {{ $labdarugokSzama }}
                    </p>

                    <p class="mt-3 text-sm text-gray-500">
                        Az adatbázisban szereplő játékosok
                    </p>

                </div>

                <div class="rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm">

                    <p class="mb-3 text-sm font-semibold text-gray-500">
                        Posztok száma
                    </p>

                    <p class="text-4xl font-extrabold text-[#176b43]">
                        {{ $posztokSzama }}
                    </p>

                    <p class="mt-3 text-sm text-gray-500">
                        Nyilvántartott játékosposztok
                    </p>

                </div>

            </div>

        </section>

        <!-- ADMINISZTRÁCIÓS FUNKCIÓK -->

        <section class="mb-10">

            <h2 class="mb-5 text-2xl font-bold text-[#16271e]">
                Adminisztrációs funkciók
            </h2>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">

                <a href="{{ route('admin.klubok.index') }}"
                   class="group block rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm transition hover:border-[#176b43] hover:shadow-lg">

                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e4f0e8] text-2xl">
                        🏆
                    </div>

                    <h3 class="mb-3 text-xl font-bold text-[#16271e]">
                        Klubok kezelése
                    </h3>

                    <p class="mb-6 text-sm leading-6 text-gray-600">
                        Labdarúgóklubok létrehozása, megtekintése,
                        szerkesztése és törlése.
                    </p>

                    <span class="inline-flex rounded-lg bg-[#176b43] px-4 py-3 text-sm font-bold text-white">
                        Klub CRUD megnyitása
                    </span>

                </a>

                <a href="{{ route('admin.react-labdarugok.index') }}"
                   class="group block rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm transition hover:border-[#176b43] hover:shadow-lg">

                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e4f0e8] text-2xl">
                        ⚽
                    </div>

                    <h3 class="mb-3 text-xl font-bold text-[#16271e]">
                        Labdarúgók kezelése
                    </h3>

                    <p class="mb-6 text-sm leading-6 text-gray-600">
                        Játékosadatok kezelése React és Axios
                        alapú CRUD alkalmazással.
                    </p>

                    <span class="inline-flex rounded-lg bg-[#176b43] px-4 py-3 text-sm font-bold text-white">
                        React + Axios CRUD
                    </span>

                </a>

                <a href="{{ route('admin.teszt.index') }}"
                   class="group block rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm transition hover:border-[#176b43] hover:shadow-lg">

                    <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#e4f0e8] text-2xl">
                        🧪
                    </div>

                    <h3 class="mb-3 text-xl font-bold text-[#16271e]">
                        Tesztek
                    </h3>

                    <p class="mb-6 text-sm leading-6 text-gray-600">
                        Az alkalmazás teszteléséhez kapcsolódó
                        funkciók és eredmények megtekintése.
                    </p>

                    <span class="inline-flex rounded-lg bg-[#176b43] px-4 py-3 text-sm font-bold text-white">
                        Tesztek megnyitása
                    </span>

                </a>

            </div>

        </section>

        <!-- FELHASZNÁLÓI FUNKCIÓK -->

        <section class="mb-8">

            <h2 class="mb-5 text-2xl font-bold text-[#16271e]">
                Felhasználói funkciók
            </h2>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

                <a href="{{ route('user') }}"
                   class="block rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm transition hover:border-[#176b43] hover:shadow-lg">

                    <h3 class="mb-3 text-xl font-bold text-[#16271e]">
                        Felhasználói oldal
                    </h3>

                    <p class="mb-5 text-sm leading-6 text-gray-600">
                        A bejelentkezett felhasználók számára
                        elérhető funkciók megtekintése.
                    </p>

                    <span class="font-bold text-[#176b43]">
                        Felhasználói oldal megnyitása →
                    </span>

                </a>

                <a href="{{ route('uzenetek.index') }}"
                   class="block rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm transition hover:border-[#176b43] hover:shadow-lg">

                    <h3 class="mb-3 text-xl font-bold text-[#16271e]">
                        Beérkezett üzenetek
                    </h3>

                    <p class="mb-5 text-sm leading-6 text-gray-600">
                        A kapcsolatfelvételi űrlapon keresztül
                        beküldött üzenetek megtekintése.
                    </p>

                    <span class="font-bold text-[#176b43]">
                        Üzenetek megtekintése →
                    </span>

                </a>

            </div>

        </section>

    </div>

</x-mainpage>