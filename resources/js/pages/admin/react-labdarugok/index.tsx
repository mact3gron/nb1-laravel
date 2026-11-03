import axios, { isAxiosError } from 'axios';
import { Head, Link } from '@inertiajs/react';
import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from 'react';
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Save,
    Trash2,
    Users,
    X,
} from 'lucide-react';

import Nb1Layout from '../../../layouts/nb1-layout';

// ==========================================
// 1. TYPESCRIPT TÍPUSOK
// ==========================================

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
    vezeteknev: string;
    utonev: string | null;
    mezszam: number;
    klubid: number;
    posztid: number;
    szulido: string;
    magyar: boolean | number;
    kulfoldi: boolean | number;
    ertek: number;
    klub: Klub | null;
    poszt: Poszt | null;
}

interface Pagination {
    data: Labdarugo[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface Valasztok {
    klubok: Klub[];
    posztok: Poszt[];
}

interface FormAdatok {
    vezeteknev: string;
    utonev: string;
    mezszam: string;
    klubid: string;
    posztid: string;
    szulido: string;
    magyar: boolean;
    kulfoldi: boolean;
    ertek: string;
}

interface ApiHiba {
    message?: string;
    errors?: Record<string, string[]>;
}

interface ApiValasz {
    message: string;
    labdarugo?: Labdarugo;
}

// ==========================================
// 2. AXIOS BEÁLLÍTÁSOK
// ==========================================

const API_URL = '/admin/react-labdarugok';

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withXSRFToken: true,
});

// ==========================================
// 3. ÜRES ŰRLAP
// ==========================================

function uresForm(): FormAdatok {
    return {
        vezeteknev: '',
        utonev: '',
        mezszam: '',
        klubid: '',
        posztid: '',
        szulido: '',
        magyar: true,
        kulfoldi: false,
        ertek: '',
    };
}

// ==========================================
// 4. HIBAKEZELÉS
// ==========================================

function hibaUzenet(error: unknown): string {
    if (isAxiosError<ApiHiba>(error)) {
        return (
            error.response?.data?.message ??
            'Hiba történt a szerverrel való kommunikáció során.'
        );
    }

    return 'Váratlan hiba történt.';
}

function validaciosHibak(
    error: unknown,
): Record<string, string> {
    if (!isAxiosError<ApiHiba>(error)) {
        return {};
    }

    const errors = error.response?.data?.errors ?? {};
    const result: Record<string, string> = {};

    Object.entries(errors).forEach(([key, messages]) => {
        result[key] = messages[0] ?? 'Érvénytelen adat.';
    });

    return result;
}

// ==========================================
// 5. FŐ KOMPONENS
// ==========================================

export default function ReactLabdarugok() {
    const [klubok, setKlubok] = useState<Klub[]>([]);
    const [posztok, setPosztok] = useState<Poszt[]>([]);

    const [pagination, setPagination] =
        useState<Pagination | null>(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(
        null,
    );

    const [search, setSearch] = useState('');
    const [filterKlub, setFilterKlub] = useState('');
    const [filterPoszt, setFilterPoszt] = useState('');
    const [page, setPage] = useState(1);

    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [form, setForm] =
        useState<FormAdatok>(uresForm());

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // ======================================
    // 6. VÁLASZTÓLISTÁK BETÖLTÉSE
    // ======================================

    useEffect(() => {
        let active = true;

        async function loadValasztok() {
            try {
                const response = await api.get<Valasztok>(
                    `${API_URL}/valasztok`,
                );

                if (!active) return;

                setKlubok(response.data.klubok);
                setPosztok(response.data.posztok);
            } catch (error) {
                if (!active) return;
                setErrorMessage(hibaUzenet(error));
            }
        }

        void loadValasztok();

        return () => {
            active = false;
        };
    }, []);

    // ======================================
    // 7. JÁTÉKOSOK BETÖLTÉSE
    // ======================================

    const loadPlayers = useCallback(async () => {
        setLoading(true);

        try {
            const response = await api.get<Pagination>(
                `${API_URL}/adatok`,
                {
                    params: {
                        search: search || undefined,
                        klubid: filterKlub || undefined,
                        posztid: filterPoszt || undefined,
                        page,
                    },
                },
            );

            setPagination(response.data);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage(hibaUzenet(error));
        } finally {
            setLoading(false);
        }
    }, [search, filterKlub, filterPoszt, page]);

    useEffect(() => {
        void loadPlayers();
    }, [loadPlayers]);

    // ======================================
    // 8. ŰRLAP MEGNYITÁSA
    // ======================================

    function openCreate(): void {
        setEditingId(null);
        setForm(uresForm());
        setErrors({});
        setMessage('');
        setErrorMessage('');
        setFormOpen(true);
    }

    function openEdit(player: Labdarugo): void {
        setEditingId(player.id);

        setForm({
            vezeteknev: player.vezeteknev,
            utonev: player.utonev ?? '',
            mezszam: String(player.mezszam),
            klubid: String(player.klubid),
            posztid: String(player.posztid),
            szulido: player.szulido.slice(0, 10),
            magyar: Boolean(player.magyar),
            kulfoldi: Boolean(player.kulfoldi),
            ertek: String(player.ertek),
        });

        setErrors({});
        setMessage('');
        setErrorMessage('');
        setFormOpen(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    function closeForm(): void {
        setFormOpen(false);
        setEditingId(null);
        setErrors({});
    }

    // ======================================
    // 9. ŰRLAP MEZŐ FRISSÍTÉSE
    // ======================================

    function updateField<K extends keyof FormAdatok>(
        field: K,
        value: FormAdatok[K],
    ): void {
        setForm((previous) => ({
            ...previous,
            [field]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [field]: '',
        }));
    }

    // ======================================
    // 10. JÁTÉKOS MENTÉSE
    // ======================================

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        setSaving(true);
        setErrors({});
        setMessage('');
        setErrorMessage('');

        const payload = {
            vezeteknev: form.vezeteknev.trim(),
            utonev: form.utonev.trim() || null,
            mezszam: Number(form.mezszam),
            klubid: Number(form.klubid),
            posztid: Number(form.posztid),
            szulido: form.szulido,
            magyar: form.magyar ? 1 : 0,
            kulfoldi: form.kulfoldi ? 1 : 0,
            ertek: Number(form.ertek),
        };

        try {
            let response;

            if (editingId === null) {
                response = await api.post<ApiValasz>(
                    API_URL,
                    payload,
                );
            } else {
                response = await api.put<ApiValasz>(
                    `${API_URL}/${editingId}`,
                    payload,
                );
            }

            closeForm();
            setMessage(response.data.message);

            if (page !== 1) {
                setPage(1);
            } else {
                await loadPlayers();
            }
        } catch (error) {
            setErrors(validaciosHibak(error));
            setErrorMessage(hibaUzenet(error));
        } finally {
            setSaving(false);
        }
    }

    // ======================================
    // 11. JÁTÉKOS TÖRLÉSE
    // ======================================

    async function handleDelete(
        player: Labdarugo,
    ): Promise<void> {
        const fullName = [
            player.vezeteknev,
            player.utonev,
        ].filter(Boolean).join(' ');

        const confirmed = window.confirm(
            `Biztosan törölni szeretnéd ezt a játékost?\n\n${fullName}\n\nA művelet nem vonható vissza.`,
        );

        if (!confirmed) return;

        setDeleting(player.id);
        setMessage('');
        setErrorMessage('');

        try {
            const response = await api.delete<ApiValasz>(
                `${API_URL}/${player.id}`,
            );

            setMessage(response.data.message);

            if (
                pagination?.data.length === 1 &&
                page > 1
            ) {
                setPage(page - 1);
            } else {
                await loadPlayers();
            }
        } catch (error) {
            setErrorMessage(hibaUzenet(error));
        } finally {
            setDeleting(null);
        }
    }

    // ======================================
    // 12. SEGÉDFÜGGVÉNYEK
    // ======================================

    function formatMoney(value: number): string {
        return new Intl.NumberFormat('hu-HU').format(
            value * 1000,
        ) + ' €';
    }

    function formatDate(value: string): string {
        const date = value.slice(0, 10);

        const parts = date.split('-');

        if (parts.length !== 3) return date;

        return `${parts[0]}.${parts[1]}.${parts[2]}.`;
    }

    function formError(field: string) {
        return errors[field] ? (
            <p className="mt-1 text-xs text-red-600">
                {errors[field]}
            </p>
        ) : null;
    }

    // ======================================
    // 13. MEGJELENÍTÉS
    // ======================================

    return (
        <Nb1Layout>
            <Head title="React + Axios Labdarúgó CRUD" />

            <div className="min-h-screen bg-[#f3f7f4] py-10 text-[#16271e]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">

                    {/* FEJLÉC */}

                    <div className="mb-8 rounded-xl bg-[#16271e] p-7 text-white shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-5">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#a4efc7]">
                                    <Users size={18} />
                                    Adminisztráció
                                </div>

                                <h1 className="!mb-3 !text-3xl !font-bold !text-white">
                                    Labdarúgók kezelése
                                </h1>

                                <p className="!m-0 !text-sm !text-gray-200">
                                    React + Axios CRUD – játékosok
                                    hozzáadása, módosítása és törlése.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={openCreate}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#176b43] px-5 py-3 font-bold !text-white hover:bg-[#218957]"
                            >
                                <Plus size={18} />
                                Új játékos
                            </button>
                        </div>
                    </div>

                    {/* ÜZENETEK */}

                    {message && (
                        <div
                            role="status"
                            className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
                        >
                            <CheckCircle2 size={20} />
                            {message}
                        </div>
                    )}

                    {errorMessage && (
                        <div
                            role="alert"
                            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
                        >
                            {errorMessage}
                        </div>
                    )}

                    {/* ÚJ JÁTÉKOS / SZERKESZTÉS */}

                    {formOpen && (
                        <section className="mb-8 rounded-xl border border-[#d5e5d9] bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-7 flex items-center justify-between gap-3">
                                <h2 className="!m-0 !text-2xl !font-bold !text-[#16271e]">
                                    {editingId === null
                                        ? 'Új labdarúgó hozzáadása'
                                        : 'Labdarúgó szerkesztése'}
                                </h2>

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                    aria-label="Űrlap bezárása"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* VEZETÉKNÉV */}

                                    <div>
                                        <label
                                            htmlFor="vezeteknev"
                                            className="mb-2 block font-semibold"
                                        >
                                            Vezetéknév *
                                        </label>

                                        <input
                                            id="vezeteknev"
                                            type="text"
                                            required
                                            maxLength={255}
                                            value={form.vezeteknev}
                                            onChange={(event) =>
                                                updateField(
                                                    'vezeteknev',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                            placeholder="Pl. Kovács"
                                        />

                                        {formError('vezeteknev')}
                                    </div>

                                    {/* UTÓNÉV */}

                                    <div>
                                        <label
                                            htmlFor="utonev"
                                            className="mb-2 block font-semibold"
                                        >
                                            Utónév
                                        </label>

                                        <input
                                            id="utonev"
                                            type="text"
                                            maxLength={255}
                                            value={form.utonev}
                                            onChange={(event) =>
                                                updateField(
                                                    'utonev',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                            placeholder="Pl. Péter"
                                        />

                                        {formError('utonev')}
                                    </div>

                                    {/* MEZSZÁM */}

                                    <div>
                                        <label
                                            htmlFor="mezszam"
                                            className="mb-2 block font-semibold"
                                        >
                                            Mezszám *
                                        </label>

                                        <input
                                            id="mezszam"
                                            type="number"
                                            min={0}
                                            max={999}
                                            required
                                            value={form.mezszam}
                                            onChange={(event) =>
                                                updateField(
                                                    'mezszam',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                            placeholder="Pl. 10"
                                        />

                                        {formError('mezszam')}
                                    </div>

                                    {/* SZÜLETÉSI DÁTUM */}

                                    <div>
                                        <label
                                            htmlFor="szulido"
                                            className="mb-2 block font-semibold"
                                        >
                                            Születési dátum *
                                        </label>

                                        <input
                                            id="szulido"
                                            type="date"
                                            required
                                            max={
                                                new Date()
                                                    .toLocaleDateString(
                                                        'en-CA',
                                                    )
                                            }
                                            value={form.szulido}
                                            onChange={(event) =>
                                                updateField(
                                                    'szulido',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                        />

                                        {formError('szulido')}
                                    </div>

                                    {/* KLUB */}

                                    <div>
                                        <label
                                            htmlFor="klubid"
                                            className="mb-2 block font-semibold"
                                        >
                                            Klub *
                                        </label>

                                        <select
                                            id="klubid"
                                            required
                                            value={form.klubid}
                                            onChange={(event) =>
                                                updateField(
                                                    'klubid',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                        >
                                            <option value="">
                                                Válassz klubot
                                            </option>

                                            {klubok.map((klub) => (
                                                <option
                                                    key={klub.id}
                                                    value={klub.id}
                                                >
                                                    {klub.csapatnev}
                                                </option>
                                            ))}
                                        </select>

                                        {formError('klubid')}
                                    </div>

                                    {/* POSZT */}

                                    <div>
                                        <label
                                            htmlFor="posztid"
                                            className="mb-2 block font-semibold"
                                        >
                                            Játékosposzt *
                                        </label>

                                        <select
                                            id="posztid"
                                            required
                                            value={form.posztid}
                                            onChange={(event) =>
                                                updateField(
                                                    'posztid',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                        >
                                            <option value="">
                                                Válassz posztot
                                            </option>

                                            {posztok.map((poszt) => (
                                                <option
                                                    key={poszt.id}
                                                    value={poszt.id}
                                                >
                                                    {poszt.nev}
                                                </option>
                                            ))}
                                        </select>

                                        {formError('posztid')}
                                    </div>

                                    {/* JÁTÉKOS ÉRTÉKE */}

                                    <div>
                                        <label
                                            htmlFor="ertek"
                                            className="mb-2 block font-semibold"
                                        >
                                            Játékos értéke (ezer EUR) *
                                        </label>

                                        <input
                                            id="ertek"
                                            type="number"
                                            min={0}
                                            step={1}
                                            required
                                            value={form.ertek}
                                            onChange={(event) =>
                                                updateField(
                                                    'ertek',
                                                    event.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                            placeholder="Pl. 500"
                                        />

                                        <p className="mt-1 text-xs text-gray-500">
                                            Az 500-as érték 500 000 eurót jelent.
                                        </p>

                                        {formError('ertek')}
                                    </div>

                                    {/* ÁLLAMPOLGÁRSÁG */}

                                    <div>
                                        <p className="mb-3 font-semibold">
                                            Állampolgárság
                                        </p>

                                        <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">

                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={form.magyar}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'magyar',
                                                            event.target.checked,
                                                        )
                                                    }
                                                    className="h-5 w-5 accent-[#176b43]"
                                                />
                                                Magyar állampolgár
                                            </label>

                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={form.kulfoldi}
                                                    onChange={(event) =>
                                                        updateField(
                                                            'kulfoldi',
                                                            event.target.checked,
                                                        )
                                                    }
                                                    className="h-5 w-5 accent-[#176b43]"
                                                />
                                                Külföldi állampolgár
                                            </label>

                                            <p className="!m-0 text-xs text-gray-500">
                                                Mindkettő megjelölhető
                                                kettős állampolgárság esetén.
                                            </p>
                                        </div>

                                        {formError('magyar')}
                                        {formError('kulfoldi')}
                                    </div>
                                </div>

                                {/* MENTÉS */}

                                <div className="mt-8 flex flex-wrap gap-3 border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#176b43] px-6 py-3 font-bold !text-white hover:bg-[#218957] disabled:opacity-60"
                                    >
                                        {saving ? (
                                            <LoaderCircle
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={18} />
                                        )}

                                        {editingId === null
                                            ? 'Játékos hozzáadása'
                                            : 'Módosítás mentése'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeForm}
                                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                                    >
                                        Mégse
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* KERESÉS / SZŰRÉS */}

                    <section className="mb-6 rounded-xl border border-[#d5e5d9] bg-white p-5 shadow-sm">
                        <div className="grid gap-4 md:grid-cols-3">

                            <div>
                                <label
                                    htmlFor="search"
                                    className="mb-2 block font-semibold"
                                >
                                    Játékos keresése
                                </label>

                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        id="search"
                                        type="search"
                                        placeholder="Név alapján..."
                                        value={search}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                            setPage(1);
                                        }}
                                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-klub"
                                    className="mb-2 block font-semibold"
                                >
                                    Szűrés klubra
                                </label>

                                <select
                                    id="filter-klub"
                                    value={filterKlub}
                                    onChange={(event) => {
                                        setFilterKlub(event.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                >
                                    <option value="">
                                        Összes klub
                                    </option>

                                    {klubok.map((klub) => (
                                        <option
                                            key={klub.id}
                                            value={klub.id}
                                        >
                                            {klub.csapatnev}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="filter-poszt"
                                    className="mb-2 block font-semibold"
                                >
                                    Szűrés posztra
                                </label>

                                <select
                                    id="filter-poszt"
                                    value={filterPoszt}
                                    onChange={(event) => {
                                        setFilterPoszt(event.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                                >
                                    <option value="">
                                        Összes poszt
                                    </option>

                                    {posztok.map((poszt) => (
                                        <option
                                            key={poszt.id}
                                            value={poszt.id}
                                        >
                                            {poszt.nev}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => void loadPlayers()}
                                className="inline-flex items-center gap-2 rounded-lg border border-[#176b43] bg-white px-4 py-2 font-semibold !text-[#176b43] hover:bg-[#e4f0e8]"
                            >
                                <RefreshCw size={16} />
                                Frissítés
                            </button>
                        </div>
                    </section>

                    {/* JÁTÉKOSLISTA */}

                    <section className="overflow-hidden rounded-xl border border-[#d5e5d9] bg-white shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-5">
                            <h2 className="!m-0 !text-xl !font-bold !text-[#16271e]">
                                Játékosok listája
                            </h2>

                            <span className="rounded-full bg-[#e4f0e8] px-4 py-2 text-sm font-bold text-[#176b43]">
                                {pagination?.total ?? 0} játékos
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center gap-3 p-12 text-gray-500">
                                <LoaderCircle
                                    size={24}
                                    className="animate-spin"
                                />
                                Adatok betöltése...
                            </div>
                        ) : !pagination?.data.length ? (
                            <div className="p-12 text-center text-gray-500">
                                Nem található játékos.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[950px] border-collapse text-left text-sm">
                                    <thead className="bg-[#e4f0e8] text-[#16271e]">
                                        <tr>
                                            <th className="p-4">
                                                Név
                                            </th>
                                            <th className="p-4">
                                                Mezszám
                                            </th>
                                            <th className="p-4">
                                                Klub
                                            </th>
                                            <th className="p-4">
                                                Poszt
                                            </th>
                                            <th className="p-4">
                                                Születési dátum
                                            </th>
                                            <th className="p-4">
                                                Állampolgárság
                                            </th>
                                            <th className="p-4">
                                                Érték
                                            </th>
                                            <th className="p-4 text-right">
                                                Műveletek
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {pagination.data.map(
                                            (player) => (
                                                <tr
                                                    key={player.id}
                                                    className="border-t border-gray-100 hover:bg-[#f3f7f4]"
                                                >
                                                    <td className="p-4 font-bold text-[#16271e]">
                                                        {player.vezeteknev}
                                                        {' '}
                                                        {player.utonev ?? ''}
                                                    </td>

                                                    <td className="p-4">
                                                        {player.mezszam}
                                                    </td>

                                                    <td className="p-4">
                                                        {player.klub?.csapatnev ?? '–'}
                                                    </td>

                                                    <td className="p-4">
                                                        {player.poszt?.nev ?? '–'}
                                                    </td>

                                                    <td className="p-4">
                                                        {formatDate(
                                                            player.szulido,
                                                        )}
                                                    </td>

                                                    <td className="p-4">
                                                        {[
                                                            Boolean(player.magyar)
                                                                ? 'Magyar'
                                                                : null,
                                                            Boolean(player.kulfoldi)
                                                                ? 'Külföldi'
                                                                : null,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(', ') || '–'}
                                                    </td>

                                                    <td className="p-4">
                                                        {formatMoney(
                                                            player.ertek,
                                                        )}
                                                    </td>

                                                    <td className="p-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    openEdit(player)
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-[#e4f0e8] px-3 py-2 font-semibold !text-[#176b43] hover:bg-[#cce3d3]"
                                                            >
                                                                <Pencil size={15} />
                                                                Szerkesztés
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    deleting === player.id
                                                                }
                                                                onClick={() =>
                                                                    void handleDelete(player)
                                                                }
                                                                className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                                                            >
                                                                <Trash2 size={15} />
                                                                Törlés
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* LAPOZÁS */}

                        {pagination &&
                            pagination.last_page > 1 && (
                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 p-5">
                                    <span className="text-sm text-gray-600">
                                        {pagination.from}–{pagination.to}
                                        {' / '}
                                        {pagination.total} játékos
                                    </span>

                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            disabled={
                                                page <= 1 ||
                                                loading
                                            }
                                            onClick={() =>
                                                setPage(page - 1)
                                            }
                                            className="rounded-lg border border-gray-300 bg-white p-2 disabled:opacity-40"
                                            aria-label="Előző oldal"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <span className="text-sm font-bold">
                                            {pagination.current_page}
                                            {' / '}
                                            {pagination.last_page}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={
                                                page >= pagination.last_page ||
                                                loading
                                            }
                                            onClick={() =>
                                                setPage(page + 1)
                                            }
                                            className="rounded-lg border border-gray-300 bg-white p-2 disabled:opacity-40"
                                            aria-label="Következő oldal"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                    </section>

                    {/* VISSZA */}

                    <div className="mt-8">
                        <Link
                            href="/admin"
                            className="font-semibold !text-[#176b43] hover:underline"
                        >
                            ← Vissza az adminisztrációhoz
                        </Link>
                    </div>
                </div>
            </div>
        </Nb1Layout>
    );
}