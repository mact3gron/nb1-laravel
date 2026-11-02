import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';

/*
|--------------------------------------------------------------------------
| NB I. - KÖZÖS AUTH LAYOUT
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Közös megjelenés:
| - Bejelentkezés
| - Regisztráció
| - Elfelejtett jelszó
| - Jelszó-visszaállítás
| - Egyéb autentikációs oldalak
|
| A Laravel AuthLayout működése változatlan.
| A children tartalmazza az eredeti űrlapokat.
|
| A stadionkép helye:
| public/images/nb1-hero.png
|
*/

interface AuthLayoutProps {
    children: ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="dark relative min-h-svh overflow-hidden bg-slate-950 text-slate-100">

            {/* =====================================
                TELJES OLDAL HÁTTÉR
            ===================================== */}

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 85% 10%, rgba(16,185,129,0.14), transparent 35%)',
                }}
            />

            <div className="relative mx-auto grid min-h-svh w-full max-w-[1700px] lg:grid-cols-2">

                {/* =====================================
                    BAL OLDAL - STADIONOS BEMUTATKOZÁS
                ===================================== */}

                <aside className="relative hidden min-h-svh flex-col justify-between overflow-hidden border-r border-white/10 lg:flex">

                    {/* STADION HÁTTÉRKÉP */}

                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "linear-gradient(180deg, rgba(2,12,8,0.45) 0%, rgba(2,12,8,0.35) 35%, rgba(2,12,8,0.96) 100%), url('/images/nb1-hero.png')",
                        }}
                    />

                    {/* ZÖLD FÉNYHATÁS */}

                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-black/40"
                    />

                    {/* FELSŐ LOGÓ */}

                    <div className="relative z-10 px-10 pt-10 xl:px-14">

                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-3"
                            aria-label="NB I. Labdarúgás - Főoldal"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/15 shadow-lg backdrop-blur-md">
                                <AppLogoIcon className="h-8 w-8 fill-current text-emerald-400" />
                            </div>

                            <div>
                                <span className="block text-xl font-black tracking-wide text-white">
                                    NB I.
                                </span>

                                <span className="block text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
                                    Labdarúgás
                                </span>
                            </div>
                        </Link>

                    </div>

                    {/* STADIONOS BEMUTATKOZÓ SZÖVEG */}

                    <div className="relative z-10 px-10 pb-20 xl:px-14">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/50 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300 backdrop-blur-md">

                            <span className="h-2 w-2 rounded-full bg-emerald-400" />

                            Magyar labdarúgás

                        </div>

                        <h1 className="max-w-xl text-5xl font-black leading-tight tracking-tight text-white xl:text-6xl">

                            A FUTBALL
                            <span className="block text-emerald-400">
                                VILÁGA
                            </span>
                            EGY HELYEN.

                        </h1>

                        <p className="mt-7 max-w-lg text-lg leading-8 text-slate-200">
                            Fedezd fel a magyar NB I.
                            csapatait, játékosait,
                            statisztikáit és
                            összehasonlító funkcióit!
                        </p>

                        {/* FUNKCIÓK */}

                        <div className="mt-9 flex flex-wrap gap-3">

                            <span className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                                ⚽ Klubok
                            </span>

                            <span className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                                📊 Statisztikák
                            </span>

                            <span className="rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm font-semibold text-white backdrop-blur-md">
                                🏆 Összehasonlítás
                            </span>

                        </div>

                        {/* VISSZA A FŐOLDALRA */}

                        <Link
                            href={route('home')}
                            className="mt-10 inline-flex items-center gap-3 rounded-xl border border-emerald-400/40 bg-emerald-600/20 px-6 py-3 text-sm font-bold text-emerald-200 transition hover:border-emerald-400 hover:bg-emerald-600 hover:text-white"
                        >
                            <span>←</span>
                            Vissza a főoldalra
                        </Link>

                    </div>

                    {/* BAL OLDALI LÁBLÉC */}

                    <div className="relative z-10 border-t border-white/10 bg-black/25 px-10 py-5 backdrop-blur-md xl:px-14">

                        <p className="text-xs text-slate-300">
                            NB I. Labdarúgás
                            <span className="mx-2 text-emerald-400">
                                •
                            </span>
                            Webprogramozás II. beadandó
                        </p>

                    </div>

                </aside>

                {/* =====================================
                    JOBB OLDAL - ŰRLAP
                ===================================== */}

                <main className="relative flex min-h-svh min-w-0 flex-col px-5 py-6 sm:px-10 lg:px-12 xl:px-16">

                    {/* MOBIL FEJLÉC */}

                    <div className="flex items-center justify-between gap-4 lg:justify-end">

                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 lg:hidden"
                            aria-label="NB I. Labdarúgás - Főoldal"
                        >

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/40 bg-emerald-500/10">
                                <AppLogoIcon className="h-7 w-7 fill-current text-emerald-400" />
                            </div>

                            <span className="text-lg font-black tracking-wide text-white">
                                NB I.
                                <span className="ml-2 text-emerald-400">
                                    LABDARÚGÁS
                                </span>
                            </span>

                        </Link>

                        <Link
                            href={route('home')}
                            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-emerald-500/50 hover:text-emerald-400"
                        >
                            ← Főoldal
                        </Link>

                    </div>

                    {/* ŰRLAP KÖZÉPRE IGAZÍTÁSA */}

                    <div className="flex flex-1 items-center justify-center py-10">

                        <div className="w-full max-w-[490px]">

                            {/* FELSŐ JELZÉS */}

                            <div className="mb-6 text-center">

                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-emerald-300">

                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                                    NB I. – Felhasználói fiók

                                </span>

                            </div>

                            {/* AUTH KÁRTYA */}

                            <div className="rounded-[28px] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">

                                <div className="flex flex-col gap-8">

                                    {/* LOGÓ ÉS OLDALCÍM */}

                                    <div className="flex flex-col items-center gap-4">

                                        <Link
                                            href={route('home')}
                                            className="flex flex-col items-center gap-2 font-medium"
                                        >

                                            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-950/30">

                                                <AppLogoIcon className="h-9 w-9 fill-current text-emerald-400" />

                                            </div>

                                            <span className="sr-only">
                                                {title}
                                            </span>

                                        </Link>

                                        <div className="space-y-3 text-center">

                                            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                                                {title}
                                            </h1>

                                            {description && (
                                                <p className="mx-auto max-w-sm text-center text-sm leading-7 text-slate-400">
                                                    {description}
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* MEGLÉVŐ AUTH ŰRLAP */}

                                    <div className="min-w-0 text-slate-100">
                                        {children}
                                    </div>

                                </div>

                            </div>

                            {/* KÁRTYA ALATTI INFORMÁCIÓ */}

                            <div className="mt-7 text-center">

                                <p className="text-xs leading-6 text-slate-500">
                                    Biztonságos bejelentkezés
                                    a Laravel autentikációs
                                    rendszerével.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* JOBB OLDALI LÁBLÉC */}

                    <footer className="border-t border-white/10 pt-5 text-center">

                        <p className="text-xs leading-6 text-slate-500">
                            © 2026 NB I. Labdarúgás
                        </p>

                        <p className="mt-1 text-xs leading-6 text-slate-500">
                            Farkas Tamás – PLPJEB
                            <span className="mx-2 text-emerald-500">
                                •
                            </span>
                            Fodor Árpád – U4BKST
                        </p>

                    </footer>

                </main>

            </div>

        </div>
    );
}
