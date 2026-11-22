<x-mainpage>

    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

        <section class="mb-8 flex flex-col gap-6 rounded-xl bg-[#16271e] px-6 py-8 text-white shadow-lg sm:px-8 lg:flex-row lg:items-center lg:justify-between">

            <div>

                <p class="mb-3 text-sm font-bold text-[#91dfaf]">
                    ADMINISZTRÁCIÓ
                </p>

                <h1 class="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
                    Klubok kezelése
                </h1>

                <p class="text-sm leading-6 text-gray-200">
                    Laravel Blade alapú CRUD – klubok hozzáadása,
                    szerkesztése és törlése.
                </p>

            </div>

            <a href="{{ route('admin.klubok.create') }}"
               class="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#176b43] px-6 py-4 text-sm font-bold text-white no-underline transition hover:bg-[#218957]">
                + Új klub
            </a>

        </section>

        @if (session('success'))
            <div class="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 font-semibold text-green-800">
                {{ session('success') }}
            </div>
        @endif

        @if (session('failed'))
            <div class="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-800">
                {{ session('failed') }}
            </div>
        @endif

        <section class="mb-6 rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm">

            <form method="GET"
                  action="{{ route('admin.klubok.index') }}"
                  class="flex flex-col gap-4 md:flex-row md:items-end">

                <div class="w-full flex-1">

                    <label for="search"
                           class="mb-2 block text-sm font-bold text-[#16271e]">
                        Klub keresése
                    </label>

                    <input type="text"
                           id="search"
                           name="search"
                           value="{{ $search }}"
                           placeholder="Klub neve..."
                           class="w-full rounded-lg border border-[#dce8df] bg-white px-4 py-3 text-sm text-[#16271e] outline-none transition focus:border-[#176b43] focus:ring-2 focus:ring-[#176b43]/20">

                </div>

                <button type="submit"
                        class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#176b43] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#218957]">
                    Keresés
                </button>

                <a href="{{ route('admin.klubok.index') }}"
                   class="inline-flex items-center justify-center rounded-lg border border-[#176b43] bg-white px-6 py-3 text-sm font-bold text-[#176b43] no-underline transition hover:bg-[#e4f0e8]">
                    Keresés törlése
                </a>

            </form>

        </section>

        <section class="overflow-hidden rounded-xl border border-[#dce8df] bg-white shadow-sm">

            <div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#dce8df] px-6 py-5">

                <h2 class="text-xl font-bold text-[#16271e]">
                    Klubok listája
                </h2>

                <span class="rounded-full bg-[#e4f0e8] px-4 py-2 text-sm font-bold text-[#176b43]">
                    {{ $klubok->total() }} klub
                </span>

            </div>

            <div class="w-full overflow-x-auto">

                <table class="w-full border-collapse text-left text-sm">

                    <thead class="bg-[#e4f0e8] text-[#16271e]">

                        <tr>

                            <th scope="col" class="px-5 py-4 font-bold">
                                ID
                            </th>

                            <th scope="col" class="px-5 py-4 font-bold">
                                Klub neve
                            </th>

                            <th scope="col" class="px-5 py-4 font-bold">
                                Labdarúgók száma
                            </th>

                            <th scope="col" class="px-5 py-4 text-center font-bold">
                                Műveletek
                            </th>

                        </tr>

                    </thead>

                    <tbody class="divide-y divide-[#e5eee8]">

                        @forelse ($klubok as $klub)

                            <tr class="transition hover:bg-[#f3f7f4]">

                                <td class="px-5 py-4 text-[#16271e]">
                                    {{ $klub->id }}
                                </td>

                                <td class="px-5 py-4 font-bold text-[#16271e]">
                                    {{ $klub->csapatnev }}
                                </td>

                                <td class="px-5 py-4 text-[#16271e]">
                                    {{ $klub->labdarugok_count }}
                                </td>

                                <td class="px-5 py-4">

                                    <div class="flex flex-wrap items-center justify-center gap-3">

                                        <a href="{{ route('admin.klubok.edit', $klub->id) }}"
                                           class="inline-flex items-center justify-center rounded-lg bg-[#e4f0e8] px-4 py-2 text-sm font-semibold text-[#176b43] no-underline transition hover:bg-[#cde5d5]">
                                            Szerkesztés
                                        </a>

                                        <form action="{{ route('admin.klubok.destroy', $klub->id) }}"
                                              method="POST"
                                              onsubmit="return confirm('Biztosan törölni szeretnéd ezt a klubot?')">

                                            @csrf
                                            @method('DELETE')

                                            <button type="submit"
                                                    class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                                                Törlés
                                            </button>

                                        </form>

                                    </div>

                                </td>

                            </tr>

                        @empty

                            <tr>

                                <td colspan="4"
                                    class="px-6 py-12 text-center text-gray-500">
                                    Nincs megjeleníthető klub az adatbázisban.
                                </td>

                            </tr>

                        @endforelse

                    </tbody>

                </table>

            </div>

            <div class="border-t border-[#dce8df] px-6 py-5">

                {{ $klubok->links() }}

            </div>

        </section>

        <div class="mt-8">

            <a href="{{ route('admin.index') }}"
               class="inline-flex items-center font-semibold text-[#176b43] no-underline transition hover:underline">
                ← Vissza az adminisztrációhoz
            </a>

        </div>

    </div>

</x-mainpage>