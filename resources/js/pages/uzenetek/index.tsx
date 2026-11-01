import { Head, Link } from '@inertiajs/react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - ÜZENETEK OLDAL
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Követelmények:
| - Üzenetek megjelenítése táblázatban
| - Legfrissebb üzenetek elsőként
| - Küldés dátumának és idejének megjelenítése
| - Csak bejelentkezett felhasználóknak
|
| Az auth védelmet a Laravel útvonal biztosítja.
|
*/

// ==========================================
// TÍPUSDEFINÍCIÓK
// ==========================================

interface Uzenet {
    id: number;
    nev: string;
    email: string;
    targy: string;
    uzenet: string;
    created_at: string;
}

interface PaginationData {
    data: Uzenet[];

    current_page: number;
    last_page: number;

    per_page: number;
    total: number;

    from: number | null;
    to: number | null;

    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    uzenetek: PaginationData;
}

// ==========================================
// DÁTUM FORMÁZÁSA
// ==========================================

function formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(date);
}

// ==========================================
// ÜZENETEK OLDAL
// ==========================================

export default function UzenetekIndex({
    uzenetek,
}: Props) {

    const vanUzenet = uzenetek.data.length > 0;

    return (
        <Nb1Layout>

            <Head title="NB I. | Üzenetek" />

            {/* =====================================
                FEJLÉC
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Üzenetek
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Bejelentkezett felhasználók
                    </span>

                    <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl">
                        BEÉRKEZETT
                        <span className="ml-3 text-emerald-400">
                            ÜZENETEK
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                        Itt tekintheted meg a Kapcsolat
                        űrlapon keresztül elküldött
                        üzeneteket.

                        Az üzenetek a beküldés
                        időpontja szerint, a legújabbtól
                        a legrégebbiig jelennek meg.
                    </p>

                </div>
            </section>

            {/* =====================================
                FŐ TARTALOM
            ===================================== */}

            <section className="flex-1 bg-slate-950 px-4 py-14 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* ÖSSZESÍTÉS */}

                    <div className="mb-8 flex flex-wrap items-center justify-between gap-5">

                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                Üzenetek listája
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Az adatbázisban tárolt
                                kapcsolatfelvételi üzenetek.
                            </p>
                        </div>

                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4">

                            <p className="text-xs font-semibold uppercase text-emerald-400">
                                Összes üzenet
                            </p>

                            <p className="mt-1 text-3xl font-black text-white">
                                {uzenetek.total}
                            </p>

                        </div>

                    </div>

                    {/* =====================================
                        TÁBLÁZAT
                    ===================================== */}

                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                        {vanUzenet ? (

                            <div className="overflow-x-auto">

                                <table className="min-w-[800px] w-full border-collapse text-left">

                                    <caption className="sr-only">
                                        Beérkezett üzenetek a legfrissebbtől
                                        a legrégebbiig
                                    </caption>

                                    <thead className="bg-emerald-950/70">

                                        <tr className="border-b border-emerald-500/20">

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                                            >
                                                #
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                                            >
                                                Feladó
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                                            >
                                                Tárgy
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                                            >
                                                Üzenet
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-xs font-bold uppercase tracking-wider text-emerald-400"
                                            >
                                                Küldés ideje
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-white/10">

                                        {uzenetek.data.map(
                                            (uzenet, index) => (

                                                <tr
                                                    key={uzenet.id}
                                                    className="align-top transition-colors hover:bg-slate-800/70"
                                                >

                                                    {/* SORSZÁM */}

                                                    <td className="px-5 py-6 text-sm text-slate-500">

                                                        {(
                                                            (uzenetek.current_page - 1)
                                                            * uzenetek.per_page
                                                        ) + index + 1}

                                                    </td>

                                                    {/* FELADÓ */}

                                                    <td className="px-5 py-6">

                                                        <p className="max-w-48 break-words font-semibold text-white">
                                                            {uzenet.nev}
                                                        </p>

                                                        <p className="mt-2 max-w-48 break-all text-xs text-slate-400">
                                                            {uzenet.email}
                                                        </p>

                                                    </td>

                                                    {/* TÁRGY */}

                                                    <td className="px-5 py-6">

                                                        <p className="max-w-44 break-words font-semibold text-emerald-400">
                                                            {uzenet.targy}
                                                        </p>

                                                    </td>

                                                    {/* ÜZENET SZÖVEGE */}

                                                    <td className="px-5 py-6">

                                                        <p className="max-w-md whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
                                                            {uzenet.uzenet}
                                                        </p>

                                                    </td>

                                                    {/* KÜLDÉS DÁTUMA */}

                                                    <td className="whitespace-nowrap px-5 py-6">

                                                        <span className="inline-flex rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300">

                                                            {formatDate(
                                                                uzenet.created_at
                                                            )}

                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            /* NINCS ÜZENET */

                            <div className="px-6 py-20 text-center">

                                <div className="text-6xl">
                                    ✉️
                                </div>

                                <h3 className="mt-6 text-2xl font-bold text-white">
                                    Még nem érkezett üzenet
                                </h3>

                                <p className="mx-auto mt-4 max-w-md leading-7 text-slate-400">
                                    Jelenleg nincs megjeleníthető
                                    üzenet az adatbázisban.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* =====================================
                        LAPOZÁS
                    ===================================== */}

                    {uzenetek.total > 0 && (

                        <div className="mt-8 flex flex-wrap items-center justify-between gap-5">

                            <p className="text-sm text-slate-400">

                                Megjelenítve:

                                <strong className="mx-1 text-white">
                                    {uzenetek.from ?? 0}
                                </strong>

                                –

                                <strong className="mx-1 text-white">
                                    {uzenetek.to ?? 0}
                                </strong>

                                / {uzenetek.total} üzenet

                            </p>

                            <nav
                                aria-label="Üzenetek lapozása"
                                className="flex flex-wrap items-center gap-3"
                            >

                                {/* ELŐZŐ OLDAL */}

                                {uzenetek.prev_page_url ? (

                                    <Link
                                        href={uzenetek.prev_page_url}
                                        preserveScroll
                                        className="rounded-xl border border-emerald-500/40 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                                    >
                                        ← Előző
                                    </Link>

                                ) : (

                                    <span className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-600">
                                        ← Előző
                                    </span>

                                )}

                                {/* AKTUÁLIS OLDALSZÁM */}

                                <span className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white">

                                    {uzenetek.current_page}
                                    {' / '}
                                    {uzenetek.last_page}

                                </span>

                                {/* KÖVETKEZŐ OLDAL */}

                                {uzenetek.next_page_url ? (

                                    <Link
                                        href={uzenetek.next_page_url}
                                        preserveScroll
                                        className="rounded-xl border border-emerald-500/40 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                                    >
                                        Következő →
                                    </Link>

                                ) : (

                                    <span className="rounded-xl border border-white/10 px-5 py-3 text-sm text-slate-600">
                                        Következő →
                                    </span>

                                )}

                            </nav>

                        </div>

                    )}

                    {/* =====================================
                        VISSZA A FŐOLDALRA
                    ===================================== */}

                    <div className="mt-12 border-t border-white/10 pt-8">

                        <Link
                            href="/"
                            className="inline-flex items-center rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </div>

                </div>
            </section>

        </Nb1Layout>
    );
}
