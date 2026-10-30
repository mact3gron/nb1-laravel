import { Head, Link, router } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';

interface Klub {
    id: number;
    csapatnev: string;
}

interface Pagination {
    data: Klub[];
    current_page: number;
    last_page: number;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    klubok: Pagination;
    filters: {
        search: string;
    };
}

export default function KlubokIndex({ klubok, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        router.get('/klubok', {
            search: search.trim(),
        }, {
            preserveState: true,
            replace: true,
        });
    }

    function clearSearch() {
        setSearch('');
        router.get('/klubok');
    }

    return (
        <>
            <Head title="NB I. - Klubok" />

            <div className="min-h-screen bg-slate-100 text-slate-900">

                <header className="bg-emerald-800 p-6 text-white">
                    <div className="mx-auto flex max-w-6xl items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            ⚽ NB I. Labdarúgás
                        </h1>

                        <nav className="flex gap-5">
                            <Link href="/">Főoldal</Link>
                            <Link href="/klubok">Klubok</Link>
                            <Link href="/labdarugok">Labdarúgók</Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-10">

                    <h2 className="mb-3 text-3xl font-bold">
                        NB I. klubok
                    </h2>

                    <p className="mb-8 text-slate-600">
                        Az első osztályú labdarúgóklubok listája.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="mb-6 flex flex-wrap gap-3 rounded-xl bg-white p-5 shadow"
                    >
                        <input
                            type="text"
                            value={search}
                            maxLength={100}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Klub keresése..."
                            className="min-w-48 flex-1 rounded-lg border border-slate-300 p-3"
                        />

                        <button
                            type="submit"
                            className="rounded-lg bg-emerald-700 px-6 py-3 text-white hover:bg-emerald-800"
                        >
                            Keresés
                        </button>

                        <button
                            type="button"
                            onClick={clearSearch}
                            className="rounded-lg bg-slate-200 px-6 py-3"
                        >
                            Törlés
                        </button>
                    </form>

                    <section className="overflow-hidden rounded-xl bg-white shadow">

                        <div className="border-b p-5">
                            <h3 className="text-xl font-semibold">
                                Klubok listája
                            </h3>

                            <p className="text-sm text-slate-500">
                                Találatok: {klubok.total}
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-200">
                                    <tr>
                                        <th className="p-4">ID</th>
                                        <th className="p-4">Klub neve</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {klubok.data.map((klub) => (
                                        <tr
                                            key={klub.id}
                                            className="border-t hover:bg-emerald-50"
                                        >
                                            <td className="p-4">
                                                {klub.id}
                                            </td>

                                            <td className="p-4 font-medium">
                                                {klub.csapatnev}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {klubok.data.length === 0 && (
                            <p className="p-8 text-center text-slate-500">
                                Nincs találat.
                            </p>
                        )}
                    </section>

                    <div className="mt-6 flex items-center justify-between">
                        <span>
                            {klubok.current_page}. oldal /
                            {' '}{klubok.last_page}
                        </span>

                        <div className="flex gap-3">
                            {klubok.prev_page_url && (
                                <Link
                                    href={klubok.prev_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
                                >
                                    Előző
                                </Link>
                            )}

                            {klubok.next_page_url && (
                                <Link
                                    href={klubok.next_page_url}
                                    className="rounded-lg bg-emerald-700 px-5 py-2 text-white"
                                >
                                    Következő
                                </Link>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}
