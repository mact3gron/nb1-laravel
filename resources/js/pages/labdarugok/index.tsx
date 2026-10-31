import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

// Klub adatszerkezete
interface Klub {
    id: number;
    csapatnev: string;
}

// Poszt adatszerkezete
interface Poszt {
    id: number;
    nev: string;
}

// Labdarúgó adatszerkezete
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

// Lapozott adatstruktúra
interface Pagination {
    data: Labdarugo[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

// Laravel Controllerből érkező adatok
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

    // Keresés
    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get(
            '/labdarugok',
            { search: search.trim() },
            {
                preserveState: true,
                replace: true,
            }
        );
    }

    // Keresés törlése
    function clearSearch() {
        setSearch('');

        router.get('/labdarugok', {}, {
            preserveState: true,
            replace: true,
        });
    }

    // Játékos teljes neve
    function fullName(player: Labdarugo): string {
        return [
            player.vezeteknev,
            player.utonev
        ].filter(Boolean).join(' ');
    }

    // Születési dátum formázása
    function formatDate(value: string): string {
        const [year, month, day] = value
            .slice(0, 10)
            .split('-');

        return `year.{month}.${day}.`;
    }

    // Piaci érték: ezer euró
    function formatValue(value: number): string {
        return `${value.toLocaleString('hu-HU')} ezer €`;
    }

    return (
        <>
            <Head title="NB I. - Labdarúgók" />

            <div className="min-h-screen bg-slate-100 text-slate-900">

                {/* FEJLÉC */}
                <header className="bg-emerald-800 text-white shadow-lg">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">

                        <h1 className="text-2xl font-bold">
                            ⚽ NB I. Labdarúgás
                        </h1>

                        <nav className="flex flex-wrap gap-5 font-medium">
                            <Link href="/">
                                Főoldal
                            </Link>

                            <Link href="/klubok">
                                Klubok
                            </Link>

                            <Link
                                href="/labdarugok"
                                className="underline underline-offset-4"
                            >
                                Labdarúgók
                            </Link>
                        </nav>

                    </div>
                </header>

                {/* FŐ TARTALOM */}
                <main className="mx-auto max-w-7xl px-4 py-10">

                    {/* OLDAL CÍME */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold">
                            NB I. labdarúgók
                        </h2>

                        <p className="mt-2 text-slate-600">
                            Játékosok, klubok, posztok és
                            piaci értékek.
                        </p>
                    </section>

                    {/* KERESÉS */}
                    <section className="mb-6 rounded-xl bg-white p-5 shadow-sm">

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-wrap items-end gap-3"
                        >
                            <div className="min-w-48 flex-1">

                                <label
                                    htmlFor="search"
                                    className="mb-2 block font-medium"
                                >
                                    Labdarúgó keresése
                                </label>

                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    maxLength={100}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Játékos, klub vagy poszt..."
                                    className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-emerald-600"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white hover:bg-emerald-800"
                            >
                                Keresés
                            </button>

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-lg bg-slate-200 px-6 py-3 font-semibold hover:bg-slate-300"
                            >
                                Törlés
                            </button>

                        </form>
                    </section>

                    {/* LABDARÚGÓK TÁBLÁZATA */}
                    <section className="overflow-hidden rounded-xl bg-white shadow-sm">

                        <div className="border-b border-slate-200 p-6">

                            <h3 className="text-xl font-semibold">
                                Játékosok listája
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Találatok: {labdarugok.total}
                            </p>

                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">

                                <thead className="bg-emerald-800 text-white">
                                    <tr>
                                        <th className="p-4">Mez</th>
                                        <th className="p-4">Játékos</th>
                                        <th className="p-4">Klub</th>
                                        <th className="p-4">Poszt</th>
                                        <th className="p-4">Született</th>
                                        <th className="p-4">Állampolgárság</th>
                                        <th className="p-4">Érték</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {labdarugok.data.map((player) => (

                                        <tr
                                            key={player.id}
                                            className="border-b border-slate-100 transition hover:bg-emerald-50"
                                        >

                                            <td className="p-4 font-bold">
                                                {player.mezszam}
                                            </td>

                                            <td className="p-4 font-semibold">
                                                {fullName(player)}
                                            </td>

                                            <td className="p-4">
                                                {player.klub?.csapatnev ?? 'Nincs klub'}
                                            </td>

                                            <td className="p-4">
                                                {player.poszt?.nev ?? 'Nincs poszt'}
                                            </td>

                                            <td className="p-4">
                                                {formatDate(player.szulido)}
                                            </td>

                                            <td className="p-4">
                                                {[
                                                    player.magyar ? 'Magyar' : null,
                                                    player.kulfoldi ? 'Külföldi' : null
                                                ].filter(Boolean).join(', ') || 'Nincs adat'}
                                            </td>

                                            <td className="p-4 font-medium text-emerald-700">
                                                {formatValue(player.ertek)}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {labdarugok.data.length === 0 && (
                            <div className="p-10 text-center text-slate-500">
                                Nincs találat a megadott keresésre.
                            </div>
                        )}

                    </section>

                    {/* LAPOZÁS */}
                    <section className="mt-6 flex flex-wrap items-center justify-between gap-4">

                        <p className="text-sm text-slate-600">
                            {labdarugok.current_page}. oldal /
                            {' '}{labdarugok.last_page}
                        </p>

                        <div className="flex gap-3">

                            {labdarugok.prev_page_url && (
                                <Link
                                    href={labdarugok.prev_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 font-medium text-white hover:bg-emerald-800"
                                >
                                    Előző
                                </Link>
                            )}

                            {labdarugok.next_page_url && (
                                <Link
                                    href={labdarugok.next_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 font-medium text-white hover:bg-emerald-800"
                                >
                                    Következő
                                </Link>
                            )}

                        </div>

                    </section>

                </main>
            </div>
        </>
    );
}



