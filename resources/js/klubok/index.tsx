import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

// Klub adatszerkezete
interface Klub {
    id: number;
    csapatnev: string;
}

// Laravel lapozott válasz
interface KlubokPagination {
    data: Klub[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

// Keresési feltételek
interface Filters {
    search: string;
}

// Controllerből érkező adatok
interface Props {
    klubok: KlubokPagination;
    filters: Filters;
}

export default function KlubokIndex({
    klubok,
    filters,
}: Props) {
    const [search, setSearch] = useState(
        filters.search ?? ''
    );

    // Keresés indítása
    const handleSearch = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        router.get(
            '/klubok',
            { search: search.trim() },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Keresés törlése
    const clearSearch = () => {
        setSearch('');

        router.get(
            '/klubok',
            {},
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <>
            <Head title="NB I. - Klubok" />

            <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white">

                {/* Fejléc */}
                <header className="bg-emerald-800 px-6 py-5 text-white shadow-lg">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold">
                            NB I. Labdarúgás
                        </h1>

                        <nav className="flex gap-5 text-sm font-medium">
                            <Link href="/">
                                Főoldal
                            </Link>

                            <Link
                                href="/klubok"
                                className="underline underline-offset-4"
                            >
                                Klubok
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-10">

                    {/* Oldal címe */}
                    <section className="mb-8">
                        <h2 className="text-3xl font-bold">
                            NB I. klubok
                        </h2>

                        <p className="mt-2 text-slate-600 dark:text-slate-300">
                            Az első osztályú labdarúgóklubok
                            adatbázisa.
                        </p>
                    </section>

                    {/* Kereső */}
                    <section className="mb-6 rounded-xl bg-white p-5 shadow-sm dark:bg-slate-900">

                        <form
                            onSubmit={handleSearch}
                            className="flex flex-wrap items-end gap-3"
                        >
                            <div className="min-w-48 flex-1">
                                <label
                                    htmlFor="search"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Klub keresése
                                </label>

                                <input
                                    id="search"
                                    type="text"
                                    value={search}
                                    maxLength={100}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Például: Ferencváros"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="rounded-lg bg-emerald-700 px-6 py-3 font-semibold text-white transition hover:bg-emerald-800"
                            >
                                Keresés
                            </button>

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-300 dark:bg-slate-700 dark:text-white"
                            >
                                Törlés
                            </button>
                        </form>
                    </section>

                    {/* Klubok táblázata */}
                    <section className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-900">

                        <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                            <h3 className="text-xl font-semibold">
                                Klubok listája
                            </h3>

                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Találatok: {klubok.total}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-100 text-sm uppercase dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-4">
                                            Azonosító
                                        </th>

                                        <th className="px-6 py-4">
                                            Klub neve
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {klubok.data.length > 0 ? (
                                        klubok.data.map((klub) => (
                                            <tr
                                                key={klub.id}
                                                className="border-t border-slate-200 hover:bg-emerald-50 dark:border-slate-800 dark:hover:bg-slate-800"
                                            >
                                                <td className="px-6 py-4">
                                                    {klub.id}
                                                </td>

                                                <td className="px-6 py-4 font-medium">
                                                    {klub.csapatnev}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={2}
                                                className="px-6 py-10 text-center text-slate-500"
                                            >
                                                Nincs találat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Lapozás */}
                    <section className="mt-6 flex flex-wrap items-center justify-between gap-4">

                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            {klubok.current_page}. oldal /
                            {' '}{klubok.last_page}
                        </p>

                        <div className="flex gap-3">

                            {klubok.prev_page_url ? (
                                <Link
                                    href={klubok.prev_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"
                                >
                                    Előző
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-lg bg-slate-300 px-5 py-2 text-slate-500">
                                    Előző
                                </span>
                            )}

                            {klubok.next_page_url ? (
                                <Link
                                    href={klubok.next_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 text-white hover:bg-emerald-800"
                                >
                                    Következő
                                </Link>
                            ) : (
                                <span className="cursor-not-allowed rounded-lg bg-slate-300 px-5 py-2 text-slate-500">
                                    Következő
                                </span>
                            )}

                        </div>
                    </section>

                </main>
            </div>
        </>
    );
}
