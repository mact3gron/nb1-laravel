import {
    Head,
    Link,
    router,
    useForm,
    usePage,
    useRemember,
} from '@inertiajs/react';

import {
    useState,
    type FormEvent,
} from 'react';

import Nb1Layout from '../../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - ADMIN KLUB CRUD
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| CREATE - Új klub létrehozása
| READ   - Klubok listázása, keresése
| UPDATE - Klubnév módosítása felugró ablakban
| DELETE - Klub törlése megerősítéssel
|
| A CRUD útvonalakat auth + admin middleware védi.
|
*/

interface Klub {
    id: number;
    csapatnev: string;
    labdarugok_count: number;
}

interface PaginationData {
    data: Klub[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    klubok: PaginationData;
    filters: {
        search: string;
    };
}

interface EditState {
    id: number | null;
    csapatnev: string;
}

interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

export default function AdminKlubokIndex({
    klubok,
    filters,
}: Props) {

    const { props } = usePage();

    const flash = (props.flash ?? {}) as FlashMessages;

    // Keresőmező
    const [search, setSearch] = useState(
        filters.search ?? ''
    );

    // Új klub hozzáadása
    const createForm = useForm({
        csapatnev: '',
    });

    // Szerkesztés állapotának megőrzése
    const [edit, setEdit] = useRemember<EditState>(
        {
            id: null,
            csapatnev: '',
        },
        'nb1-admin-klub-edit'
    );

    // Mentés folyamatban
    const [saving, setSaving] = useState(false);

    // Szerkesztési hiba
    const [editError, setEditError] = useState('');

    // Helyi visszajelzés
    const [feedback, setFeedback] = useState('');

    // ======================================
    // KERESÉS
    // ======================================

    function handleSearch(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        router.get(
            '/admin/klubok',
            { search: search.trim() },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    }

    function clearSearch(): void {

        setSearch('');

        router.get(
            '/admin/klubok',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    }

    // ======================================
    // CREATE
    // ======================================

    function handleCreate(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        setFeedback('');

        createForm.post('/admin/klubok', {
            preserveScroll: true,

            onSuccess: () => {
                createForm.reset();

                setFeedback(
                    'Az új klub sikeresen létrejött!'
                );
            },
        });
    }

    // ======================================
    // UPDATE - SZERKESZTÉS MEGNYITÁSA
    // ======================================

    function openEdit(klub: Klub): void {

        setEdit({
            id: klub.id,
            csapatnev: klub.csapatnev,
        });

        setEditError('');
        setFeedback('');
    }

    // ======================================
    // UPDATE - SZERKESZTÉS BEZÁRÁSA
    // ======================================

    function closeEdit(): void {

        if (saving) {
            return;
        }

        setEdit({
            id: null,
            csapatnev: '',
        });

        setEditError('');
    }

    // ======================================
    // UPDATE - MÓDOSÍTÁS MENTÉSE
    // ======================================

    function handleUpdate(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        if (edit.id === null || saving) {
            return;
        }

        const klubNev = edit.csapatnev.trim();

        if (klubNev.length < 2) {
            setEditError(
                'A klub neve legalább 2 karakter legyen.'
            );
            return;
        }

        if (klubNev.length > 255) {
            setEditError(
                'A klub neve legfeljebb 255 karakter lehet.'
            );
            return;
        }

        setEditError('');
        setFeedback('');
        setSaving(true);

        router.put(
            `/admin/klubok/${edit.id}`,
            {
                csapatnev: klubNev,
            },
            {
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {

                    setEdit({
                        id: null,
                        csapatnev: '',
                    });

                    setFeedback(
                        'A klub neve sikeresen módosult!'
                    );
                },

                onError: (errors) => {
                    setEditError(
                        errors.csapatnev ??
                        'Nem sikerült menteni a módosítást.'
                    );
                },

                onFinish: () => {
                    setSaving(false);
                },
            }
        );
    }

    // ======================================
    // DELETE
    // ======================================

    function handleDelete(klub: Klub): void {

        if (klub.labdarugok_count > 0) {
            setFeedback(
                'A klubhoz játékosok tartoznak, ezért nem törölhető.'
            );
            return;
        }

        const confirmed = window.confirm(
            `Biztosan törölni szeretnéd?\n\n${klub.csapatnev}`
        );

        if (!confirmed) {
            return;
        }

        setFeedback('');

        router.delete(
            `/admin/klubok/${klub.id}`,
            {
                preserveScroll: true,
            }
        );
    }

    // ======================================
    // OLDAL
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Klubok kezelése" />

            {/* FEJLÉC */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-14">

                    <p className="text-sm font-semibold text-emerald-400">
                        ADMINISZTRÁCIÓ / KLUBOK
                    </p>

                    <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
                        Klubok kezelése
                    </h1>

                    <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                        Új klubok hozzáadása, keresése,
                        szerkesztése és törlése.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">

                        <Link
                            href="/admin"
                            className="rounded-xl border border-emerald-500 px-5 py-3 font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white"
                        >
                            ← Adminpanel
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-white hover:border-emerald-500"
                        >
                            Főoldal
                        </Link>

                    </div>

                </div>
            </section>

            {/* FŐ TARTALOM */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl space-y-8">

                    {/* VISSZAJELZÉSEK */}

                    {(flash.success || feedback) && (

                        <div
                            role="status"
                            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-emerald-300"
                        >
                            {flash.success || feedback}
                        </div>

                    )}

                    {flash.error && (

                        <div
                            role="alert"
                            className="rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-red-300"
                        >
                            {flash.error}
                        </div>

                    )}

                    {/* ÖSSZESÍTÉS */}

                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                        <p className="text-sm text-slate-400">
                            Klubok száma a jelenlegi szűrésben
                        </p>

                        <p className="mt-3 text-4xl font-black text-emerald-400">
                            {klubok.total}
                        </p>

                    </div>

                    {/* ÚJ KLUB */}

                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                        <h2 className="text-2xl font-bold text-white">
                            Új klub hozzáadása
                        </h2>

                        <form
                            onSubmit={handleCreate}
                            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start"
                        >

                            <div className="flex-1">

                                <label
                                    htmlFor="new-klub"
                                    className="mb-2 block text-sm font-semibold text-slate-200"
                                >
                                    Klub neve
                                </label>

                                <input
                                    id="new-klub"
                                    type="text"
                                    value={createForm.data.csapatnev}
                                    onChange={(event) =>
                                        createForm.setData(
                                            'csapatnev',
                                            event.target.value
                                        )
                                    }
                                    minLength={2}
                                    maxLength={255}
                                    required
                                    placeholder="Új klub neve"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-emerald-500"
                                />

                                {createForm.errors.csapatnev && (
                                    <p className="mt-2 text-sm text-red-400">
                                        {createForm.errors.csapatnev}
                                    </p>
                                )}

                            </div>

                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-500 disabled:opacity-50 sm:mt-7"
                            >
                                {createForm.processing
                                    ? 'Mentés...'
                                    : '+ Klub hozzáadása'}
                            </button>

                        </form>

                    </div>

                    {/* KLUBLISTA */}

                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                        <h2 className="text-2xl font-bold text-white">
                            Klubok listája
                        </h2>

                        {/* KERESÉS */}

                        <form
                            onSubmit={handleSearch}
                            className="mt-6 flex flex-col gap-3 sm:flex-row"
                        >

                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Keresés klubnévre..."
                                aria-label="Keresés klubnévre"
                                maxLength={100}
                                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none focus:border-emerald-500"
                            />

                            <button
                                type="submit"
                                className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-500"
                            >
                                Keresés
                            </button>

                            <button
                                type="button"
                                onClick={clearSearch}
                                className="rounded-xl border border-slate-600 px-6 py-3 text-slate-300"
                            >
                                Alaphelyzet
                            </button>

                        </form>

                        {/* TÁBLÁZAT */}

                        <div className="mt-7 overflow-x-auto rounded-xl border border-white/10">

                            <table className="w-full min-w-[650px] text-left">

                                <thead className="bg-emerald-950/70">
                                    <tr>
                                        <th className="px-5 py-4 text-emerald-400">
                                            ID
                                        </th>
                                        <th className="px-5 py-4 text-emerald-400">
                                            Klub neve
                                        </th>
                                        <th className="px-5 py-4 text-emerald-400">
                                            Játékosok
                                        </th>
                                        <th className="px-5 py-4 text-emerald-400">
                                            Műveletek
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-white/10">

                                    {klubok.data.map((klub) => (

                                        <tr
                                            key={klub.id}
                                            className="hover:bg-slate-800/50"
                                        >

                                            <td className="px-5 py-5 text-slate-400">
                                                {klub.id}
                                            </td>

                                            <td className="px-5 py-5 font-semibold text-white">
                                                {klub.csapatnev}
                                            </td>

                                            <td className="px-5 py-5 text-slate-300">
                                                {klub.labdarugok_count}
                                            </td>

                                            <td className="px-5 py-5">

                                                <div className="flex flex-wrap gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() => openEdit(klub)}
                                                        className="rounded-lg border border-blue-500/40 px-4 py-2 text-sm font-semibold text-blue-300 hover:bg-blue-600 hover:text-white"
                                                    >
                                                        Szerkesztés
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(klub)}
                                                        disabled={klub.labdarugok_count > 0}
                                                        title={
                                                            klub.labdarugok_count > 0
                                                                ? 'Ehhez a klubhoz játékosok tartoznak'
                                                                : 'Klub törlése'
                                                        }
                                                        className="rounded-lg border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        Törlés
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                            {klubok.data.length === 0 && (
                                <div className="p-10 text-center text-slate-400">
                                    Nincs megjeleníthető klub.
                                </div>
                            )}

                        </div>

                        {/* LAPOZÁS */}

                        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">

                            <p className="text-sm text-slate-400">
                                {klubok.from ?? 0}
                                {' – '}
                                {klubok.to ?? 0}
                                {' / '}
                                {klubok.total} találat
                            </p>

                            <nav
                                aria-label="Klubok lapozása"
                                className="flex items-center gap-3"
                            >

                                {klubok.prev_page_url ? (

                                    <Link
                                        href={klubok.prev_page_url}
                                        preserveScroll
                                        className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm text-emerald-400"
                                    >
                                        ← Előző
                                    </Link>

                                ) : (
                                    <span className="text-slate-600">
                                        ← Előző
                                    </span>
                                )}

                                <span className="text-sm text-white">
                                    {klubok.current_page}
                                    {' / '}
                                    {klubok.last_page}
                                </span>

                                {klubok.next_page_url ? (

                                    <Link
                                        href={klubok.next_page_url}
                                        preserveScroll
                                        className="rounded-lg border border-emerald-500/40 px-4 py-2 text-sm text-emerald-400"
                                    >
                                        Következő →
                                    </Link>

                                ) : (
                                    <span className="text-slate-600">
                                        Következő →
                                    </span>
                                )}

                            </nav>

                        </div>

                    </div>

                    {/* ADATBÁZISVÉDELEM */}

                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm leading-7 text-amber-100">

                        A játékosokkal rendelkező klubok
                        nem törölhetők. A szerveroldali
                        Controller is ellenőrzi ezt.

                    </div>

                </div>

            </section>

            {/* ======================================
                FELUGRÓ SZERKESZTŐABLAK
            ====================================== */}

            {edit.id !== null && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4">

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-klub-title"
                        className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl sm:p-8"
                    >

                        <div className="flex items-start justify-between gap-4">

                            <div>

                                <p className="text-sm font-semibold text-emerald-400">
                                    NB I. ADMIN CRUD
                                </p>

                                <h2
                                    id="edit-klub-title"
                                    className="mt-2 text-2xl font-black text-white"
                                >
                                    Klub szerkesztése
                                </h2>

                            </div>

                            <button
                                type="button"
                                onClick={closeEdit}
                                disabled={saving}
                                aria-label="Szerkesztőablak bezárása"
                                className="rounded-lg border border-slate-600 px-3 py-2 text-slate-300 hover:bg-slate-800"
                            >
                                ✕
                            </button>

                        </div>

                        <p className="mt-4 text-sm text-slate-400">
                            Módosítsd a klub nevét, majd
                            kattints a Mentés gombra.
                        </p>

                        <form
                            onSubmit={handleUpdate}
                            className="mt-7 space-y-6"
                        >

                            <div>

                                <label
                                    htmlFor="edit-csapatnev"
                                    className="mb-2 block text-sm font-semibold text-white"
                                >
                                    Klub neve
                                </label>

                                <input
                                    id="edit-csapatnev"
                                    type="text"
                                    autoFocus
                                    value={edit.csapatnev}
                                    onChange={(event) => {

                                        setEdit({
                                            ...edit,
                                            csapatnev: event.target.value,
                                        });

                                        if (editError) {
                                            setEditError('');
                                        }
                                    }}
                                    minLength={2}
                                    maxLength={255}
                                    required
                                    disabled={saving}
                                    aria-invalid={Boolean(editError)}
                                    aria-describedby={
                                        editError
                                            ? 'edit-klub-error'
                                            : undefined
                                    }
                                    className="w-full rounded-xl border border-emerald-500/50 bg-slate-800 px-5 py-4 text-lg font-semibold text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                                />

                                {editError && (
                                    <p
                                        id="edit-klub-error"
                                        role="alert"
                                        className="mt-3 text-sm text-red-400"
                                    >
                                        {editError}
                                    </p>
                                )}

                            </div>

                            <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6">

                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    disabled={saving}
                                    className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-300 hover:bg-slate-800"
                                >
                                    Mégse
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-emerald-600 px-7 py-3 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving
                                        ? 'Mentés folyamatban...'
                                        : '✓ Módosítás mentése'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </Nb1Layout>
    );
}
