import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - Klubok
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js + Tailwind CSS
|
| Funkciók:
| - Klubok listázása
| - Keresés klubnév alapján
| - Lapozás
| - Reszponzív megjelenítés
| - Közös NB I. Layout
|
*/

// Klub adatszerkezete
interface Klub {
    id: number;
    csapatnev: string;
}

// Laravel lapozott adatok
interface Pagination {
    data: Klub[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

// Controllerből érkező adatok
interface Props {
    klubok: Pagination;
    filters: {
        search: string;
    };
}

export default function KlubokIndex({
    klubok,
    filters,
}: Props) {

    // Keresési szöveg
    const [search, setSearch] = useState(
        filters.search ?? ''
    );

    // Keresés elküldése Laravelnek
    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        router.get(
            '/klubok',
            {
                search: search.trim(),
            },
            {
                preserveState: false,
                replace: true,
                preserveScroll: true,
            }
        );
    }

    // Keresés törlése
    function clearSearch(): void {
        setSearch('');

        router.get(
            '/klubok',
            {},
            {
                preserveState: false,
                replace: true,
                preserveScroll: true,
            }
        );
    }

    return (
        <Nb1Layout>

            <Head title="NB I. | Klubok" />

            {/* =====================================
                OLDAL FEJLÉCE
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Klubok
                        </span>
                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Magyar labdarúgás
                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                        NB I.
                        <span className="ml-3 text-emerald-400">
                            KLUBOK
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                        Ismerd meg a magyar első osztályú
                        labdarúgóklubokat!
                        Keresd meg kedvenc csapatodat
                        az NB I. adatbázisában.
                    </p>

                </div>
            </section>

            {/* =====================================
                FŐ TARTALOM
            ===================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* STATISZTIKA */}

                    <div className="mb-8 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm font-medium text-slate-400">
                                Találatok száma
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {klubok.total}
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm font-medium text-slate-400">
                                Aktuális oldal
                            </p>

                            <p className="mt-3 text-4xl font-black text-white">
                                {klubok.current_page}

                                <span className="ml-2 text-lg text-slate-500">
                                    / {klubok.last_page}
                                </span>
                            </p>

                        </div>
                    </div>

                    {/* =====================================
                        KERESÉS
                    ===================================== */}

                    <div className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">

                        <div className="mb-5">

                            <h2 className="text-xl font-bold text-white">
                                Klub keresése
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Keress a klubok neve alapján.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 sm:flex-row sm:items-end"
                        >

                            <div className="flex-1">

                                <label
                                    htmlFor="klub-search"
                                    className="mb-2 block text-sm font-semibold text-slate-300"
                                >
                                    Klub neve
                                </label>

                                <input
                                    id="klub-search"
                                    type="search"
                                    value={search}
                                    maxLength={100}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Például: Ferencváros"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                />

                            </div>

                            <button
                                type="submit"
                                className="rounded-xl bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-500"
                            >
                                Keresés
                            </button>

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-xl border border-slate-600 bg-slate-800 px-7 py-3 font-bold text-slate-200 transition hover:bg-slate-700"
                            >
                                Törlés
                            </button>

                        </form>

                    </div>

                    {/* =====================================
                        KLUBOK TÁBLÁZATA
                    ===================================== */}

                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    Klubok listája
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    A klubok ABC-sorrendben.
                                </p>

                            </div>

                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
                                {klubok.total} találat
                            </span>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse text-left">

                                <thead className="bg-slate-800 text-sm uppercase tracking-wider text-slate-300">

                                    <tr>
                                        <th
                                            scope="col"
                                            className="w-32 px-6 py-5"
                                        >
                                            Azonosító
                                        </th>

                                        <th
                                            scope="col"
                                            className="px-6 py-5"
                                        >
                                            Klub neve
                                        </th>
                                    </tr>

                                </thead>

                                <tbody className="divide-y divide-white/5">

                                    {klubok.data.map((klub) => (

                                        <tr
                                            key={klub.id}
                                            className="transition hover:bg-emerald-500/10"
                                        >

                                            <td className="px-6 py-5">

                                                <span className="inline-flex min-w-10 justify-center rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-emerald-400">
                                                    {klub.id}
                                                </span>

                                            </td>

                                            <td className="px-6 py-5">

                                                <span className="font-semibold text-white">
                                                    {klub.csapatnev}
                                                </span>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {/* ÜRES KERESÉSI EREDMÉNY */}

                        {klubok.data.length === 0 && (

                            <div className="px-6 py-14 text-center">

                                <div className="mb-4 text-4xl">
                                    ⚽
                                </div>

                                <h3 className="text-lg font-bold text-white">
                                    Nincs találat
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    A megadott keresési feltételre
                                    nem található klub.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* =====================================
                        LAPOZÁS
                    ===================================== */}

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

                        <p className="text-sm text-slate-400">
                            {klubok.current_page}. oldal
                            {' '} / {' '}
                            {klubok.last_page}
                        </p>

                        <nav
                            aria-label="Klublista lapozása"
                            className="flex gap-3"
                        >

                            {klubok.prev_page_url ? (

                                <Link
                                    href={klubok.prev_page_url}
                                    preserveScroll
                                    className="rounded-xl border border-emerald-600 px-6 py-3 font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                                >
                                    Előző
                                </Link>

                            ) : (

                                <span className="cursor-not-allowed rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-600">
                                    Előző
                                </span>

                            )}

                            {klubok.next_page_url ? (

                                <Link
                                    href={klubok.next_page_url}
                                    preserveScroll
                                    className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-500"
                                >
                                    Következő
                                </Link>

                            ) : (

                                <span className="cursor-not-allowed rounded-xl bg-slate-800 px-6 py-3 font-semibold text-slate-600">
                                    Következő
                                </span>

                            )}

                        </nav>
                    </div>

                    {/* VISSZA A FŐOLDALRA */}

                    <div className="mt-12 text-center">

                        <Link
                            href="/"
                            className="inline-block text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </div>

                </div>
            </section>

        </Nb1Layout>
    );
}
