import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - Labdarúgók
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js + Tailwind CSS
|
| Funkciók:
| - Labdarúgók listázása
| - Klub és poszt megjelenítése
| - Keresés játékos, klub és poszt alapján
| - Lapozás
| - Közös NB I. Layout
|
*/

interface Klub {
    id: number;
    csapatnev: string;
}

interface Poszt {
    id: number;
    nev: string;
}

interface Labdarugo {
    id: number;
    mezszam: number;
    klubid: number;
    posztid: number;
    utonev: string | null;
    vezeteknev: string;
    szulido: string;
    magyar: boolean;
    kulfoldi: boolean;
    ertek: number;
    klub: Klub | null;
    poszt: Poszt | null;
}

interface Pagination {
    data: Labdarugo[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    labdarugok: Pagination;
    filters: {
        search: string;
    };
}

export default function LabdarugokIndex({
    labdarugok,
    filters,
}: Props) {

    const [search, setSearch] = useState(
        filters.search ?? ''
    );

    // Keresés elküldése a Laravel Controllernek
    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        router.get(
            '/labdarugok',
            {
                search: search.trim(),
            },
            {
                preserveState: false,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    // Keresési feltétel törlése
    function clearSearch(): void {
        setSearch('');

        router.get(
            '/labdarugok',
            {},
            {
                preserveState: false,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    // Teljes játékosnév
    function fullName(player: Labdarugo): string {
        return [
            player.vezeteknev,
            player.utonev
        ].filter(Boolean).join(' ');
    }

    // Születési dátum magyar formátumban
    function formatDate(value: string): string {
        if (!value) {
            return 'Nincs adat';
        }

        const date = value.slice(0, 10);
        const parts = date.split('-');

        if (parts.length !== 3) {
            return date;
        }

        return `parts[0].{parts[1]}.${parts[2]}.`;
    }

    // Piaci érték euróezerben
    function formatValue(value: number): string {
        return `${value.toLocaleString('hu-HU')} ezer €`;
    }

    // Állampolgárság
    function citizenship(player: Labdarugo): string {
        const values: string[] = [];

        if (player.magyar) {
            values.push('Magyar');
        }

        if (player.kulfoldi) {
            values.push('Külföldi');
        }

        return values.length > 0
            ? values.join(', ')
            : 'Nincs adat';
    }

    return (
        <Nb1Layout>

            <Head title="NB I. | Labdarúgók" />

            {/* =====================================
                OLDAL FEJLÉCE
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* MORZSANAVIGÁCIÓ */}
                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Labdarúgók
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Magyar labdarúgás
                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        NB I.

                        <span className="ml-3 text-emerald-400">
                            LABDARÚGÓK
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                        Ismerd meg a magyar első osztályú
                        labdarúgás játékosait, klubjaikat,
                        posztjukat és nyilvántartott
                        piaci értéküket!
                    </p>

                </div>
            </section>

            {/* =====================================
                FŐ TARTALOM
            ===================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* STATISZTIKÁK */}

                    <div className="mb-8 grid gap-4 sm:grid-cols-2">

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm font-medium text-slate-400">
                                Találatok száma
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {labdarugok.total}
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm font-medium text-slate-400">
                                Aktuális oldal
                            </p>

                            <p className="mt-3 text-4xl font-black text-white">

                                {labdarugok.current_page}

                                <span className="ml-2 text-lg text-slate-500">
                                    / {labdarugok.last_page}
                                </span>

                            </p>

                        </div>

                    </div>

                    {/* =====================================
                        KERESÉS
                    ===================================== */}

                    <section className="mb-8 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl">

                        <h2 className="text-xl font-bold text-white">
                            Labdarúgó keresése
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            Keress játékosnév, klub vagy
                            poszt alapján.
                        </p>

                        <form
                            onSubmit={handleSearch}
                            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
                        >

                            <div className="flex-1">

                                <label
                                    htmlFor="player-search"
                                    className="mb-2 block text-sm font-semibold text-slate-300"
                                >
                                    Keresési feltétel
                                </label>

                                <input
                                    id="player-search"
                                    type="search"
                                    value={search}
                                    maxLength={100}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Játékos, klub vagy poszt..."
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

                    </section>

                    {/* =====================================
                        LABDARÚGÓK TÁBLÁZATA
                    ===================================== */}

                    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    Játékosok listája
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Labdarúgók névsor szerint.
                                </p>

                            </div>

                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
                                {labdarugok.total} találat
                            </span>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">

                                <thead className="bg-slate-800 uppercase tracking-wider text-slate-300">

                                    <tr>
                                        <th className="px-5 py-5">
                                            Mez
                                        </th>

                                        <th className="px-5 py-5">
                                            Labdarúgó
                                        </th>

                                        <th className="px-5 py-5">
                                            Klub
                                        </th>

                                        <th className="px-5 py-5">
                                            Poszt
                                        </th>

                                        <th className="px-5 py-5">
                                            Született
                                        </th>

                                        <th className="px-5 py-5">
                                            Állampolgárság
                                        </th>

                                        <th className="px-5 py-5">
                                            Érték
                                        </th>

                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/5">

                                    {labdarugok.data.map((player) => (

                                        <tr
                                            key={player.id}
                                            className="transition hover:bg-emerald-500/10"
                                        >

                                            {/* MEZSZÁM */}
                                            <td className="px-5 py-5">

                                                <span className="inline-flex min-w-10 justify-center rounded-lg bg-emerald-500/10 px-3 py-2 font-black text-emerald-400">
                                                    {player.mezszam}
                                                </span>

                                            </td>

                                            {/* JÁTÉKOS NEVE */}
                                            <td className="px-5 py-5 font-bold text-white">
                                                {fullName(player)}
                                            </td>

                                            {/* KLUB */}
                                            <td className="px-5 py-5 text-slate-300">
                                                {player.klub?.csapatnev ?? 'Nincs klub'}
                                            </td>

                                            {/* POSZT */}
                                            <td className="px-5 py-5 text-slate-300">
                                                {player.poszt?.nev ?? 'Nincs poszt'}
                                            </td>

                                            {/* SZÜLETÉS */}
                                            <td className="px-5 py-5 text-slate-300">
                                                {formatDate(player.szulido)}
                                            </td>

                                            {/* ÁLLAMPOLGÁRSÁG */}
                                            <td className="px-5 py-5 text-slate-300">
                                                {citizenship(player)}
                                            </td>

                                            {/* ÉRTÉK */}
                                            <td className="whitespace-nowrap px-5 py-5 font-semibold text-emerald-400">
                                                {formatValue(player.ertek)}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                        {/* NINCS TALÁLAT */}

                        {labdarugok.data.length === 0 && (

                            <div className="px-6 py-14 text-center">

                                <div className="mb-4 text-4xl">
                                    ⚽
                                </div>

                                <h3 className="text-lg font-bold text-white">
                                    Nincs találat
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Nem található labdarúgó
                                    a megadott keresési feltétellel.
                                </p>

                            </div>

                        )}

                    </section>

                    {/* =====================================
                        LAPOZÁS
                    ===================================== */}

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

                        <p className="text-sm text-slate-400">
                            {labdarugok.current_page}. oldal
                            {' '} / {' '}
                            {labdarugok.last_page}
                        </p>

                        <nav
                            aria-label="Labdarúgók lapozása"
                            className="flex gap-3"
                        >

                            {labdarugok.prev_page_url ? (

                                <Link
                                    href={labdarugok.prev_page_url}
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

                            {labdarugok.next_page_url ? (

                                <Link
                                    href={labdarugok.next_page_url}
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
                            className="text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </div>

                </div>
            </section>

        </Nb1Layout>
    );
}


