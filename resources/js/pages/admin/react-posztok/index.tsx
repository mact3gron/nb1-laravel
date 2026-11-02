import axios, { isAxiosError } from 'axios';
import { Head, Link } from '@inertiajs/react';

import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from 'react';

import {
    AlertTriangle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    Pencil,
    Plus,
    RefreshCw,
    Save,
    Search,
    ShieldCheck,
    Trash2,
    Users,
    X,
} from 'lucide-react';

import Nb1Layout from '../../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - REACT + AXIOS POSZT CRUD
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Axios
| Inertia.js + Tailwind CSS
|
| Funkciók:
| - CREATE: új poszt létrehozása
| - READ: posztok lekérdezése JSON-ból
| - UPDATE: meglévő poszt módosítása
| - DELETE: poszt törlése
| - Keresés
| - Lapozás
| - Szerveroldali validáció megjelenítése
| - Hibakezelés
| - Törlés megerősítése
|
| Az adatok Axios HTTP-kérésekkel érkeznek.
| Nincs Inertia useForm vagy router.post/put/delete.
|
| Az admin útvonalakat a Laravel védi.
|
*/

// ==========================================
// 1. TYPESCRIPT TÍPUSOK
// ==========================================

interface Poszt {
    id: number;
    nev: string;
    labdarugok_count: number;
}

interface PosztPagination {
    data: Poszt[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface ApiValasz {
    message: string;
    poszt?: Poszt;
}

interface ApiHiba {
    message?: string;
    errors?: Record<string, string[]>;
}

// ==========================================
// 2. AXIOS BEÁLLÍTÁSOK
// ==========================================

// Az összes kérés ugyanazon Laravel
// alkalmazás admin útvonalaira érkezik.
//
// A Laravel CSRF-védelmét megtartjuk.
// A válaszokat JSON-formátumban kérjük.

const api = axios.create({
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withXSRFToken: true,
});

const API_URL = '/admin/react-posztok';

// ==========================================
// 3. KÖZÖS HIBAÜZENET-KEZELÉS
// ==========================================

function apiHibauzenet(error: unknown): string {
    if (!isAxiosError(error)) {
        return 'Váratlan hiba történt. Próbáld újra!';
    }

    const status = error.response?.status;
    const adat = error.response?.data as ApiHiba | undefined;

    if (status === 401) {
        return 'A munkamenet lejárt. Jelentkezz be újra!';
    }

    if (status === 403) {
        return 'Nincs adminisztrátori jogosultságod!';
    }

    if (status === 419) {
        return 'A munkamenet lejárt. Frissítsd az oldalt, majd próbáld újra!';
    }

    if (status === 404) {
        return 'A kért poszt már nem található.';
    }

    if (status === 409) {
        return (
            adat?.message ??
            'A művelet adatbázis-kapcsolatok miatt nem hajtható végre.'
        );
    }

    if (status === 422) {
        return (
            adat?.errors?.nev?.[0] ??
            adat?.message ??
            'Ellenőrizd a megadott adatokat!'
        );
    }

    if (typeof adat?.message === 'string') {
        return adat.message;
    }

    return 'Nem sikerült kapcsolódni a szerverhez.';
}

// ==========================================
// 4. FŐ REACT KOMPONENS
// ==========================================

export default function ReactPosztokIndex() {

    // ======================================
    // POSZTOK ÉS LAPOZÁS
    // ======================================

    const [posztok, setPosztok] =
        useState<Poszt[]>([]);

    const [pagination, setPagination] =
        useState<PosztPagination | null>(null);

    const [oldal, setOldal] = useState(1);

    const [frissitesSzamlalo, setFrissitesSzamlalo] =
        useState(0);

    // ======================================
    // KERESÉS
    // ======================================

    const [kereses, setKereses] =
        useState('');

    const [aktivKereses, setAktivKereses] =
        useState('');

    // ======================================
    // ŰRLAP
    // ======================================

    const [nev, setNev] =
        useState('');

    const [szerkesztettId, setSzerkesztettId] =
        useState<number | null>(null);

    const [nevHiba, setNevHiba] =
        useState('');

    const formRef = useRef<HTMLDivElement>(null);

    // ======================================
    // FELDOLGOZÁSI ÁLLAPOTOK
    // ======================================

    const [betoltes, setBetoltes] =
        useState(true);

    const [mentes, setMentes] =
        useState(false);

    const [torles, setTorles] =
        useState(false);

    // ======================================
    // VISSZAJELZÉSEK
    // ======================================

    const [hiba, setHiba] =
        useState('');

    const [siker, setSiker] =
        useState('');

    // ======================================
    // TÖRLÉS MEGERŐSÍTÉSE
    // ======================================

    const [torlendoPoszt, setTorlendoPoszt] =
        useState<Poszt | null>(null);

    // ======================================
    // SEGÉDFÜGGVÉNYEK
    // ======================================

    function ujratoltes(): void {
        setFrissitesSzamlalo(
            (elozo) => elozo + 1
        );
    }

    function visszajelzesekTorlese(): void {
        setHiba('');
        setSiker('');
        setNevHiba('');
    }

    // ======================================
    // 5. READ - ADATOK LEKÉRÉSE
    // ======================================
    //
    // GET /admin/react-posztok/adatok
    //
    // A keresést és lapozást a Laravel
    // szerveroldalon dolgozza fel.
    //
    // Az AbortController megakadályozza,
    // hogy egy régi kérés felülírja az
    // újabb lekérdezés eredményét.
    //

    useEffect(() => {
        const controller = new AbortController();

        async function betoltPosztok(): Promise<void> {
            setBetoltes(true);
            setHiba('');

            try {
                const response = await api.get<PosztPagination>(
                    `${API_URL}/adatok`,
                    {
                        params: {
                            search: aktivKereses,
                            page: oldal,
                        },
                        signal: controller.signal,
                    }
                );

                if (controller.signal.aborted) {
                    return;
                }

                setPosztok(response.data.data);
                setPagination(response.data);

            } catch (error: unknown) {
                if (controller.signal.aborted) {
                    return;
                }

                setHiba(apiHibauzenet(error));

            } finally {
                if (!controller.signal.aborted) {
                    setBetoltes(false);
                }
            }
        }

        void betoltPosztok();

        return () => {
            controller.abort();
        };
    }, [aktivKereses, oldal, frissitesSzamlalo]);

    // ======================================
    // 6. KERESÉS
    // ======================================

    function keresesKuldes(
        event: FormEvent<HTMLFormElement>
    ): void {
        event.preventDefault();

        const ujKereses = kereses.trim();

        setAktivKereses(ujKereses);
        setOldal(1);

        // Ugyanarra a keresésre is
        // lehessen újra rákeresni.
        ujratoltes();
    }

    function keresesTorlese(): void {
        setKereses('');
        setAktivKereses('');
        setOldal(1);

        ujratoltes();
    }

    // ======================================
    // 7. ÚJ POSZT ŰRLAP
    // ======================================

    function ujPoszt(): void {
        setSzerkesztettId(null);
        setNev('');

        visszajelzesekTorlese();

        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    // ======================================
    // 8. UPDATE - SZERKESZTÉS INDÍTÁSA
    // ======================================

    function szerkesztesInditasa(poszt: Poszt): void {
        setSzerkesztettId(poszt.id);
        setNev(poszt.nev);

        visszajelzesekTorlese();

        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    // ======================================
    // 9. CREATE / UPDATE - MENTÉS
    // ======================================
    //
    // Új rekord:
    // POST /admin/react-posztok
    //
    // Meglévő rekord:
    // PUT /admin/react-posztok/{id}
    //

    async function posztMentese(
        event: FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        if (mentes) {
            return;
        }

        visszajelzesekTorlese();

        const tisztitottNev = nev.trim();

        // Kliensoldali alapellenőrzés.
        // A Laravel külön is validál.

        if (tisztitottNev.length < 2) {
            setNevHiba(
                'A poszt neve legalább 2 karakter legyen.'
            );
            return;
        }

        if (tisztitottNev.length > 255) {
            setNevHiba(
                'A poszt neve legfeljebb 255 karakter lehet.'
            );
            return;
        }

        setMentes(true);

        try {
            let response;

            if (szerkesztettId === null) {

                // CREATE

                response = await api.post<ApiValasz>(
                    API_URL,
                    {
                        nev: tisztitottNev,
                    }
                );

            } else {

                // UPDATE

                response = await api.put<ApiValasz>(
                    `${API_URL}/${szerkesztettId}`,
                    {
                        nev: tisztitottNev,
                    }
                );
            }

            setSiker(response.data.message);

            setSzerkesztettId(null);
            setNev('');

            ujratoltes();

        } catch (error: unknown) {

            if (
                isAxiosError(error) &&
                error.response?.status === 422
            ) {
                const adat = error.response.data as ApiHiba;

                if (adat.errors?.nev?.[0]) {
                    setNevHiba(adat.errors.nev[0]);
                } else {
                    setHiba(apiHibauzenet(error));
                }
            } else {
                setHiba(apiHibauzenet(error));
            }

        } finally {
            setMentes(false);
        }
    }

    // ======================================
    // 10. DELETE - TÖRLÉS MEGERŐSÍTÉSE
    // ======================================

    function torlesMegnyitasa(poszt: Poszt): void {
        if (poszt.labdarugok_count > 0) {
            setHiba(
                'Ez a poszt nem törölhető, mert labdarúgók tartoznak hozzá.'
            );
            return;
        }

        visszajelzesekTorlese();

        setTorlendoPoszt(poszt);
    }

    function torlesBezarasa(): void {
        if (!torles) {
            setTorlendoPoszt(null);
        }
    }

    // ======================================
    // 11. DELETE - AXIOS KÉRÉS
    // ======================================
    //
    // DELETE /admin/react-posztok/{id}
    //

    async function posztTorlese(): Promise<void> {
        if (torlendoPoszt === null || torles) {
            return;
        }

        setTorles(true);

        visszajelzesekTorlese();

        try {
            const response = await api.delete<ApiValasz>(
                `${API_URL}/${torlendoPoszt.id}`
            );

            setSiker(response.data.message);

            setTorlendoPoszt(null);

            // Ha az utolsó rekordot töröltük
            // egy nem első oldalról, visszalépünk.

            if (posztok.length === 1 && oldal > 1) {
                setOldal((elozo) => elozo - 1);
            } else {
                ujratoltes();
            }

        } catch (error: unknown) {
            setHiba(apiHibauzenet(error));
            setTorlendoPoszt(null);

        } finally {
            setTorles(false);
        }
    }

    // ======================================
    // 12. LAPOZÁS
    // ======================================

    function oldalValtas(ujOldal: number): void {
        if (
            ujOldal < 1 ||
            ujOldal > (pagination?.last_page ?? 1) ||
            betoltes
        ) {
            return;
        }

        setOldal(ujOldal);
    }

    // ======================================
    // 13. MEGJELENÍTÉS
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | React + Axios CRUD" />

            {/* ==================================
                OLDAL FEJLÉCE
            ================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-14">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <Link
                            href="/admin"
                            className="hover:text-emerald-400"
                        >
                            Admin
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            React + Axios CRUD
                        </span>

                    </div>

                    {/* TECHNOLÓGIA JELZÉS */}

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">

                        <ShieldCheck className="h-4 w-4" />

                        Adminisztrátori funkció

                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
                        REACT + AXIOS
                        <span className="mt-2 block text-emerald-400">
                            POSZT CRUD
                        </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
                        Labdarúgóposztok létrehozása,
                        listázása, módosítása és törlése
                        külön React + Axios adatkezeléssel.
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">

                        <span className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
                            React
                        </span>

                        <span className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
                            TypeScript
                        </span>

                        <span className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
                            Axios
                        </span>

                        <span className="rounded-lg border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-200">
                            Laravel JSON
                        </span>

                    </div>

                </div>

            </section>

            {/* ==================================
                FŐ TARTALOM
            ================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl space-y-8">

                    {/* ==================================
                        STATISZTIKAI KÁRTYÁK
                    ================================== */}

                    <div className="grid gap-4 sm:grid-cols-3">

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm text-slate-400">
                                Összes poszt
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {pagination?.total ?? '—'}
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm text-slate-400">
                                Megjelenített posztok
                            </p>

                            <p className="mt-3 text-4xl font-black text-white">
                                {posztok.length}
                            </p>

                        </div>

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                            <p className="text-sm text-slate-400">
                                Aktuális oldal
                            </p>

                            <p className="mt-3 text-4xl font-black text-white">
                                {pagination?.current_page ?? 1}
                                <span className="ml-2 text-lg text-slate-500">
                                    / {pagination?.last_page ?? 1}
                                </span>
                            </p>

                        </div>

                    </div>

                    {/* ==================================
                        SIKERES MŰVELET
                    ================================== */}

                    {siker && (

                        <div
                            role="status"
                            className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-5"
                        >

                            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

                            <p className="flex-1 text-sm font-semibold text-emerald-300">
                                {siker}
                            </p>

                            <button
                                type="button"
                                onClick={() => setSiker('')}
                                aria-label="Visszajelzés bezárása"
                                className="text-emerald-300 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                        </div>

                    )}

                    {/* ==================================
                        HIBAÜZENET
                    ================================== */}

                    {hiba && (

                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/30 p-5"
                        >

                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />

                            <p className="flex-1 text-sm font-semibold text-red-300">
                                {hiba}
                            </p>

                            <button
                                type="button"
                                onClick={() => setHiba('')}
                                aria-label="Hibaüzenet bezárása"
                                className="text-red-300 hover:text-white"
                            >
                                <X className="h-4 w-4" />
                            </button>

                        </div>

                    )}

                    {/* ==================================
                        CREATE / UPDATE ŰRLAP
                    ================================== */}

                    <div
                        ref={formRef}
                        className="scroll-mt-28 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl"
                    >

                        <div className="border-b border-white/10 bg-slate-800/50 px-6 py-5">

                            <div className="flex flex-wrap items-center justify-between gap-4">

                                <div>

                                    <h2 className="text-xl font-bold text-white">

                                        {szerkesztettId === null
                                            ? 'Új poszt létrehozása'
                                            : 'Poszt szerkesztése'}

                                    </h2>

                                    <p className="mt-2 text-sm text-slate-400">

                                        {szerkesztettId === null
                                            ? 'Adj hozzá új labdarúgóposztot az adatbázishoz.'
                                            : 'Módosítsd a kiválasztott poszt nevét.'}

                                    </p>

                                </div>

                                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">

                                    {szerkesztettId === null
                                        ? 'CREATE'
                                        : 'UPDATE'}

                                </span>

                            </div>

                        </div>

                        <form
                            onSubmit={(event) => {
                                void posztMentese(event);
                            }}
                            className="p-6 sm:p-8"
                        >

                            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">

                                <div>

                                    <label
                                        htmlFor="poszt-nev"
                                        className="mb-3 block text-sm font-semibold text-slate-200"
                                    >
                                        Poszt megnevezése
                                    </label>

                                    <input
                                        id="poszt-nev"
                                        name="nev"
                                        type="text"
                                        required
                                        minLength={2}
                                        maxLength={255}
                                        value={nev}
                                        disabled={mentes}
                                        onChange={(event) => {
                                            setNev(event.target.value);
                                            setNevHiba('');
                                        }}
                                        placeholder="Például: támadó középpályás"
                                        aria-invalid={Boolean(nevHiba)}
                                        aria-describedby={
                                            nevHiba
                                                ? 'poszt-nev-hiba'
                                                : undefined
                                        }
                                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-3.5 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60"
                                    />

                                    {nevHiba && (

                                        <p
                                            id="poszt-nev-hiba"
                                            className="mt-3 text-sm text-red-400"
                                        >
                                            {nevHiba}
                                        </p>

                                    )}

                                </div>

                                <button
                                    type="submit"
                                    disabled={mentes}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {mentes ? (

                                        <>
                                            <LoaderCircle className="h-5 w-5 animate-spin" />
                                            Mentés...
                                        </>

                                    ) : szerkesztettId === null ? (

                                        <>
                                            <Plus className="h-5 w-5" />
                                            Poszt hozzáadása
                                        </>

                                    ) : (

                                        <>
                                            <Save className="h-5 w-5" />
                                            Módosítás mentése
                                        </>

                                    )}

                                </button>

                            </div>

                            {szerkesztettId !== null && (

                                <button
                                    type="button"
                                    disabled={mentes}
                                    onClick={ujPoszt}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-emerald-400"
                                >
                                    <X className="h-4 w-4" />
                                    Szerkesztés megszakítása
                                </button>

                            )}

                        </form>

                    </div>

                    {/* ==================================
                        KERESÉS
                    ================================== */}

                    <section className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">

                        <div className="flex flex-wrap items-center justify-between gap-4">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    Posztok keresése
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    A keresés a Laravel-adatbázisban történik.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={ujratoltes}
                                disabled={betoltes}
                                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Frissítés
                            </button>

                        </div>

                        <form
                            onSubmit={keresesKuldes}
                            className="mt-6 flex flex-col gap-3 sm:flex-row"
                        >

                            <input
                                type="search"
                                aria-label="Poszt keresése"
                                value={kereses}
                                maxLength={100}
                                onChange={(event) =>
                                    setKereses(event.target.value)
                                }
                                placeholder="Keress posztnevet..."
                                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-5 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-500"
                            />

                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:bg-emerald-500"
                            >
                                <Search className="h-4 w-4" />
                                Keresés
                            </button>

                            <button
                                type="button"
                                onClick={keresesTorlese}
                                className="rounded-xl border border-slate-600 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
                            >
                                Törlés
                            </button>

                        </form>

                    </section>

                    {/* ==================================
                        READ - POSZTOK LISTÁZÁSA
                    ================================== */}

                    <section className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    Labdarúgóposztok
                                </h2>

                                <p className="mt-2 text-sm text-slate-400">
                                    JSON-adatok megjelenítése Axios segítségével.
                                </p>

                            </div>

                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400">
                                READ
                            </span>

                        </div>

                        {betoltes ? (

                            <div
                                role="status"
                                className="flex items-center justify-center gap-3 p-14 text-slate-300"
                            >
                                <LoaderCircle className="h-6 w-6 animate-spin text-emerald-400" />
                                Posztok betöltése...
                            </div>

                        ) : posztok.length === 0 ? (

                            <div className="p-14 text-center">

                                <p className="text-4xl">
                                    ⚽
                                </p>

                                <h3 className="mt-4 text-lg font-bold text-white">
                                    Nincs megjeleníthető poszt
                                </h3>

                                <p className="mt-2 text-sm text-slate-400">
                                    Módosítsd a keresési feltételt,
                                    vagy adj hozzá új posztot.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[650px] text-left text-sm">

                                    <thead className="bg-slate-800 text-xs uppercase tracking-wider text-slate-300">

                                        <tr>

                                            <th className="px-6 py-5">
                                                ID
                                            </th>

                                            <th className="px-6 py-5">
                                                Poszt neve
                                            </th>

                                            <th className="px-6 py-5">
                                                Labdarúgók
                                            </th>

                                            <th className="px-6 py-5 text-right">
                                                Műveletek
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody className="divide-y divide-white/5">

                                        {posztok.map((poszt) => (

                                            <tr
                                                key={poszt.id}
                                                className="transition hover:bg-emerald-500/5"
                                            >

                                                <td className="px-6 py-5">

                                                    <span className="rounded-lg bg-emerald-500/10 px-3 py-2 font-bold text-emerald-400">
                                                        #{poszt.id}
                                                    </span>

                                                </td>

                                                <td className="px-6 py-5 font-semibold text-white">
                                                    {poszt.nev}
                                                </td>

                                                <td className="px-6 py-5">

                                                    <span className="inline-flex items-center gap-2 text-slate-300">

                                                        <Users className="h-4 w-4 text-emerald-400" />

                                                        {poszt.labdarugok_count}

                                                    </span>

                                                </td>

                                                <td className="px-6 py-5">

                                                    <div className="flex justify-end gap-2">

                                                        {/* UPDATE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                szerkesztesInditasa(poszt)
                                                            }
                                                            disabled={mentes || torles}
                                                            title="Poszt módosítása"
                                                            aria-label={`${poszt.nev} szerkesztése`}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 font-semibold text-blue-300 transition hover:bg-blue-600 hover:text-white disabled:opacity-50"
                                                        >

                                                            <Pencil className="h-4 w-4" />

                                                            Szerkesztés

                                                        </button>

                                                        {/* DELETE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                torlesMegnyitasa(poszt)
                                                            }
                                                            disabled={
                                                                poszt.labdarugok_count > 0 ||
                                                                mentes ||
                                                                torles
                                                            }
                                                            title={
                                                                poszt.labdarugok_count > 0
                                                                    ? 'Nem törölhető: játékosok tartoznak hozzá'
                                                                    : 'Poszt törlése'
                                                            }
                                                            aria-label={`${poszt.nev} törlése`}
                                                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                                                        >

                                                            <Trash2 className="h-4 w-4" />

                                                            Törlés

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>

                    {/* ==================================
                        LAPOZÁS
                    ================================== */}

                    {pagination && (

                        <div className="flex flex-wrap items-center justify-between gap-5">

                            <p className="text-sm text-slate-400">

                                {pagination.from ?? 0}
                                {' – '}
                                {pagination.to ?? 0}
                                {' / '}
                                {pagination.total}
                                {' találat'}

                            </p>

                            <div className="flex items-center gap-3">

                                <button
                                    type="button"
                                    disabled={
                                        pagination.current_page <= 1 ||
                                        betoltes
                                    }
                                    onClick={() =>
                                        oldalValtas(oldal - 1)
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    <ChevronLeft className="h-4 w-4" />

                                    Előző

                                </button>

                                <span className="text-sm font-bold text-white">

                                    {pagination.current_page}
                                    {' / '}
                                    {pagination.last_page}

                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        pagination.current_page >= pagination.last_page ||
                                        betoltes
                                    }
                                    onClick={() =>
                                        oldalValtas(oldal + 1)
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                                >

                                    Következő

                                    <ChevronRight className="h-4 w-4" />

                                </button>

                            </div>

                        </div>

                    )}

                    {/* ==================================
                        ADATVÉDELMI INFORMÁCIÓ
                    ================================== */}

                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">

                        <div className="flex items-start gap-4">

                            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />

                            <div>

                                <h3 className="font-bold text-white">
                                    Védett adminisztrátori adatkezelés
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    A posztok kezelését a Laravel végzi.
                                    A React külön Axios-kéréseket küld a
                                    JSON-végpontokra.
                                    A kéréseket szerveroldali validáció
                                    és adminjogosultság-ellenőrzés védi.
                                </p>

                                <p className="mt-2 text-sm leading-7 text-slate-400">
                                    A labdarúgókhoz kapcsolt posztok
                                    nem törölhetők, így nem sérülnek
                                    a játékosok adatbázis-kapcsolatai.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ==================================
                        VISSZA AZ ADMINPANELHEZ
                    ================================== */}

                    <div className="pt-4">

                        <Link
                            href="/admin"
                            className="inline-flex rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                        >
                            ← Vissza az adminpanelhez
                        </Link>

                    </div>

                </div>

            </section>

            {/* ==================================
                TÖRLÉSI MEGERŐSÍTŐ ABLAK
            ================================== */}

            {torlendoPoszt && (

                <div
                    role="presentation"
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
                >

                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="torles-title"
                        aria-describedby="torles-description"
                        className="w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900 p-7 shadow-2xl"
                    >

                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10">

                            <AlertTriangle className="h-7 w-7 text-red-400" />

                        </div>

                        <h2
                            id="torles-title"
                            className="text-2xl font-bold text-white"
                        >
                            Poszt törlése
                        </h2>

                        <p
                            id="torles-description"
                            className="mt-4 text-sm leading-7 text-slate-300"
                        >
                            Biztosan törölni szeretnéd a
                            {' '}
                            <strong className="text-white">
                                {torlendoPoszt.nev}
                            </strong>
                            {' '}
                            nevű posztot?
                        </p>

                        <p className="mt-3 text-sm text-red-300">
                            Ez a művelet nem vonható vissza!
                        </p>

                        <div className="mt-8 flex flex-wrap justify-end gap-3">

                            <button
                                type="button"
                                onClick={torlesBezarasa}
                                disabled={torles}
                                className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                Mégse
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    void posztTorlese();
                                }}
                                disabled={torles}
                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
                            >

                                {torles ? (

                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        Törlés...
                                    </>

                                ) : (

                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Végleges törlés
                                    </>

                                )}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </Nb1Layout>
    );
}
