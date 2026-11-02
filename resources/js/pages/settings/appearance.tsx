import { Head, Link } from '@inertiajs/react';

import {
    ArrowLeft,
    CheckCircle2,
    Info,
    KeyRound,
    Laptop,
    Monitor,
    Moon,
    Palette,
    ShieldCheck,
    Sun,
    UserRound,
    type LucideIcon,
} from 'lucide-react';

import {
    useAppearance,
    type Appearance,
} from '@/hooks/use-appearance';

import Nb1Layout from '@/layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - MEGJELENÉSI BEÁLLÍTÁSOK
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Világos megjelenés kiválasztása
| - Sötét megjelenés kiválasztása
| - Rendszer szerinti megjelenés
| - Beállítás mentése a böngészőben
| - Aktív beállítás megjelenítése
| - Navigáció a profilbeállításokhoz
| - Navigáció a jelszóbeállításokhoz
| - Egységes, reszponzív NB I. dizájn
|
| A meglévő useAppearance hookot
| használjuk.
|
| A Laravel útvonalak és az eredeti
| témaváltási működés változatlanok.
|
*/

// ==========================================
// 1. MEGJELENÉSI MÓDOK
// ==========================================

interface MegjelenesOpcio {
    value: Appearance;
    title: string;
    description: string;
    Icon: LucideIcon;
}

const megjelenesOpcioK: MegjelenesOpcio[] = [
    {
        value: 'light',
        title: 'Világos',
        description:
            'Világos megjelenési mód használata.',
        Icon: Sun,
    },
    {
        value: 'dark',
        title: 'Sötét',
        description:
            'Sötét megjelenési mód használata.',
        Icon: Moon,
    },
    {
        value: 'system',
        title: 'Rendszer',
        description:
            'A számítógép vagy böngésző beállításának követése.',
        Icon: Monitor,
    },
];

// ==========================================
// 2. FŐ KOMPONENS
// ==========================================

export default function AppearanceSettings() {

    // ======================================
    // 3. MEGLÉVŐ TÉMAVÁLTÓ HOOK
    // ======================================

    const {
        appearance,
        updateAppearance,
    } = useAppearance();

    // ======================================
    // 4. AKTÍV MÓD MEGNEVEZÉSE
    // ======================================

    const aktivOpcio = megjelenesOpcioK.find(
        (opcio) => opcio.value === appearance
    );

    // ======================================
    // 5. MEGJELENÉSI MÓD VÁLTÁSA
    // ======================================
    //
    // A useAppearance automatikusan:
    //
    // - Frissíti a React állapotot
    // - Menti a kiválasztott módot
    // - Beállítja a HTML dark osztályát
    //
    // Nincs szükség külön Laravel kérésre.
    //

    function megjelenesValtas(
        ujMod: Appearance
    ): void {
        updateAppearance(ujMod);
    }

    // ======================================
    // 6. OLDAL MEGJELENÍTÉSE
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Megjelenési beállítások" />

            {/* ==================================
                OLDAL FEJLÉCE
            ================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-14">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="transition hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <Link
                            href="/dashboard"
                            className="transition hover:text-emerald-400"
                        >
                            Dashboard
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Megjelenési beállítások
                        </span>

                    </div>

                    {/* KATEGÓRIA */}

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">

                        <Palette className="h-4 w-4" />

                        Felhasználói beállítások

                    </span>

                    {/* OLDAL CÍME */}

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        MEGJELENÉSI

                        <span className="mt-2 block text-emerald-400">
                            BEÁLLÍTÁSOK
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                        Válaszd ki a számodra megfelelő
                        megjelenési módot!
                        A beállítás automatikusan
                        mentésre kerül a böngésződben.
                    </p>

                </div>

            </section>

            {/* ==================================
                FŐ TARTALOM
            ================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">

                    {/* ==================================
                        BAL OLDALI BEÁLLÍTÁSMENÜ
                    ================================== */}

                    <aside className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">

                        <h2 className="mb-5 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                            Fiókbeállítások
                        </h2>

                        <nav
                            aria-label="Fiókbeállítások navigációja"
                            className="flex flex-col gap-2"
                        >

                            {/* PROFIL */}

                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-emerald-400"
                            >

                                <UserRound className="h-5 w-5" />

                                Profil

                            </Link>

                            {/* JELSZÓ */}

                            <Link
                                href="/settings/password"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-emerald-400"
                            >

                                <KeyRound className="h-5 w-5" />

                                Jelszó

                            </Link>

                            {/* MEGJELENÉS - AKTÍV */}

                            <Link
                                href="/settings/appearance"
                                aria-current="page"
                                className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-bold text-emerald-400"
                            >

                                <Palette className="h-5 w-5" />

                                Megjelenés

                            </Link>

                        </nav>

                        <div className="my-6 border-t border-white/10" />

                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400"
                        >

                            <ArrowLeft className="h-4 w-4" />

                            Vissza a Dashboardhoz

                        </Link>

                    </aside>

                    {/* ==================================
                        JOBB OLDALI TARTALOM
                    ================================== */}

                    <div className="min-w-0 space-y-8">

                        {/* ==================================
                            BEVEZETŐ KÁRTYA
                        ================================== */}

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">

                                    <Palette className="h-6 w-6 text-emerald-400" />

                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Személyre szabott megjelenés
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-300">
                                        A megjelenési mód
                                        kiválasztásával beállíthatod,
                                        hogy az alkalmazás
                                        világos vagy sötét témát
                                        használjon, illetve kövesse
                                        a rendszered beállításait.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            MEGJELENÉSI MÓD KIVÁLASZTÁSA
                        ================================== */}

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                            {/* FEJLÉC */}

                            <div className="border-b border-white/10 bg-slate-800/40 px-6 py-6 sm:px-8">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                                        <Laptop className="h-6 w-6 text-emerald-400" />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-white">
                                            Megjelenési mód
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Válassz az alábbi lehetőségek közül!
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* TÉMAVÁLASZTÓ */}

                            <div className="p-6 sm:p-8">

                                <div
                                    role="group"
                                    aria-label="Megjelenési mód kiválasztása"
                                    className="grid gap-4 md:grid-cols-3"
                                >

                                    {megjelenesOpcioK.map((opcio) => {

                                        const aktiv =
                                            appearance === opcio.value;

                                        const Icon = opcio.Icon;

                                        return (

                                            <button
                                                key={opcio.value}
                                                type="button"
                                                onClick={() =>
                                                    megjelenesValtas(
                                                        opcio.value
                                                    )
                                                }
                                                aria-pressed={aktiv}
                                                className={
                                                    'group relative flex min-h-52 flex-col items-center justify-center ' +
                                                    'rounded-2xl border p-6 text-center transition ' +
                                                    'focus-visible:outline-2 focus-visible:outline-offset-2 ' +
                                                    'focus-visible:outline-emerald-400 ' +
                                                    (
                                                        aktiv
                                                            ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/20'
                                                            : 'border-white/10 bg-slate-950/60 hover:border-emerald-500/40 hover:bg-slate-800'
                                                    )
                                                }
                                            >

                                                {/* AKTÍV ÁLLAPOT */}

                                                {aktiv && (

                                                    <span className="absolute right-4 top-4 text-emerald-400">

                                                        <CheckCircle2 className="h-5 w-5" />

                                                    </span>

                                                )}

                                                {/* IKON */}

                                                <div
                                                    className={
                                                        'mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ' +
                                                        (
                                                            aktiv
                                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                                : 'bg-slate-800 text-slate-400 group-hover:text-emerald-400'
                                                        )
                                                    }
                                                >

                                                    <Icon className="h-8 w-8" />

                                                </div>

                                                {/* MEGNEVEZÉS */}

                                                <h3
                                                    className={
                                                        'text-lg font-bold ' +
                                                        (
                                                            aktiv
                                                                ? 'text-emerald-400'
                                                                : 'text-white'
                                                        )
                                                    }
                                                >
                                                    {opcio.title}
                                                </h3>

                                                {/* LEÍRÁS */}

                                                <p className="mt-3 text-xs leading-6 text-slate-400">
                                                    {opcio.description}
                                                </p>

                                            </button>

                                        );

                                    })}

                                </div>

                                {/* ==================================
                                    AKTUÁLIS BEÁLLÍTÁS
                                ================================== */}

                                <div
                                    role="status"
                                    aria-live="polite"
                                    className="mt-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                                >

                                    <div className="flex items-start gap-3">

                                        <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400" />

                                        <div>

                                            <h3 className="font-bold text-emerald-300">
                                                Aktuális beállítás
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-200">

                                                Kiválasztott mód:
                                                {' '}

                                                <strong className="text-white">
                                                    {aktivOpcio?.title ?? 'Rendszer'}
                                                </strong>

                                            </p>

                                            <p className="mt-2 text-xs leading-6 text-slate-400">
                                                A beállítás automatikusan
                                                mentésre kerül.
                                                Külön Mentés gomb
                                                használata nem szükséges.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            MŰKÖDÉSI INFORMÁCIÓ
                        ================================== */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                            <div className="flex items-start gap-4">

                                <Info className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Hogyan működik?
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A világos mód a világos
                                        stílusokat használó elemekhez
                                        alkalmazkodik.
                                        A sötét mód a sötét
                                        megjelenítést részesíti
                                        előnyben.
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        Rendszer mód esetén
                                        a böngésző a számítógép
                                        aktuális megjelenési
                                        beállítását követi.
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        Az NB I. egyedi stadionos
                                        felületének egyes részei
                                        állandó sötét színeket
                                        használnak, ezért azok
                                        megjelenése témaváltáskor
                                        változatlan maradhat.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            ALKALMAZÁS INFORMÁCIÓ
                        ================================== */}

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">

                            <div className="flex items-start gap-4">

                                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />

                                <div>

                                    <h2 className="font-bold text-white">
                                        Beállítások megőrzése
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A választott megjelenési
                                        módot a böngésző
                                        helyi tárhelye tárolja.
                                        A beállítás megmarad
                                        az oldal újratöltése után is,
                                        amíg a böngésző adatai
                                        elérhetők.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            VISSZA A PROFILHOZ
                        ================================== */}

                        <div className="pt-2">

                            <Link
                                href="/settings/profile"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                            >

                                <ArrowLeft className="h-4 w-4" />

                                Vissza a profilhoz

                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </Nb1Layout>
    );
}
