
<x-mainpage>

    <div class="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">

        <section class="mb-8 rounded-xl bg-[#16271e] px-6 py-8 text-white shadow-lg sm:px-8">

            <p class="mb-3 text-sm font-bold text-[#91dfaf]">
                ADMINISZTRÁCIÓ
            </p>

            <h1 class="mb-3 text-3xl font-extrabold text-white sm:text-4xl">
                Új klub létrehozása
            </h1>

            <p class="text-sm leading-6 text-gray-200">
                Új labdarúgóklub hozzáadása az NB I. adatbázisához.
            </p>

        </section>

        <section class="rounded-xl border border-[#dce8df] bg-white p-6 shadow-sm sm:p-8">

            <h2 class="mb-2 text-xl font-bold text-[#16271e]">
                Klub adatai
            </h2>

            <p class="mb-8 text-sm text-gray-500">
                Add meg a létrehozni kívánt klub nevét.
            </p>

            <form action="{{ route('admin.klubok.store') }}"
                  method="POST"
                  class="space-y-6">

                @csrf

                <div class="max-w-2xl">

                    <label for="csapatnev"
                           class="mb-2 block text-sm font-bold text-[#16271e]">
                        Klub neve
                    </label>

                    <input
                        type="text"
                        id="csapatnev"
                        name="csapatnev"
                        required
                        minlength="2"
                        maxlength="255"
                        value="{{ old('csapatnev') }}"
                        placeholder="Add meg a klub nevét..."
                        class="w-full rounded-lg border border-[#dce8df] bg-white px-4 py-3 text-sm text-[#16271e] outline-none transition focus:border-[#176b43] focus:ring-2 focus:ring-[#176b43]/20"
                    >

                    @error('csapatnev')
                        <span class="mt-2 block text-sm font-medium text-red-600">
                            {{ $message }}
                        </span>
                    @enderror

                </div>

                <div class="flex flex-wrap items-center justify-between gap-4 border-t border-[#dce8df] pt-6">

                    <a href="{{ route('admin.klubok.index') }}"
                       class="inline-flex items-center justify-center rounded-lg border border-[#176b43] bg-white px-6 py-3 text-sm font-bold text-[#176b43] no-underline transition hover:bg-[#e4f0e8]">
                        ← Vissza a klubokhoz
                    </a>

                    <button type="submit"
                            class="inline-flex cursor-pointer items-center justify-center rounded-lg bg-[#176b43] px-8 py-3 text-sm font-bold text-white transition hover:bg-[#218957]">
                        Klub mentése
                    </button>

                </div>

            </form>

        </section>

    </div>

</x-mainpage>