import { Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';

/*
|--------------------------------------------------------------------------
| NB I. - Közös React Layout
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Közös fejléc és lábléc
| - Aktív menüpontok
| - Bejelentkezett felhasználó felismerése
| - Vendég: bejelentkezés és regisztráció
| - Felhasználó: dashboard és kijelentkezés
| - Reszponzív navigáció
|
*/

interface Nb1LayoutProps {
    children: ReactNode;
}

interface NavigationItem {
    label: string;
    href: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface AuthData {
    user?: AuthUser | null;
}

const navigation: NavigationItem[] = [
    {
        label: 'Főoldal',
        href: '/',
    },
    {
        label: 'Klubok',
        href: '/klubok',
    },
    {
        label: 'Labdarúgók',
        href: '/labdarugok',
    },
];

export default function Nb1Layout({
    children,
}: Nb1LayoutProps) {

    // Inertia által átadott adatok
    const { url, props } = usePage();

    // Laravel által megosztott auth adatok
    const auth = props.auth as AuthData | undefined;

    // Bejelentkezett felhasználó vagy null
    const user = auth?.user ?? null;

    // Aktív navigációs elem
    function isActive(href: string): boolean {
        const pathname = url.split('?')[0];

        if (href === '/') {
            return pathname === '/';
        }

        return (
            pathname === href ||
            pathname.startsWith(href + '/')
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white">

            {/* =====================================
                KÖZÖS FEJLÉC
            ===================================== */}

            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 shadow-lg backdrop-blur-lg">

                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">

                    {/* LOGÓ */}

                    <Link
                        href="/"
                        className="text-2xl font-black tracking-tight"
                    >
                        <span className="text-emerald-400">
                            NB I.
                        </span>

                        <span className="ml-2 text-white">
                            LABDARÚGÁS
                        </span>
                    </Link>

                    {/* FŐ NAVIGÁCIÓ */}

                    <nav
                        aria-label="Fő navigáció"
                        className="flex flex-wrap items-center gap-5"
                    >
                        {navigation.map((item) => (

                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={
                                    isActive(item.href)
                                        ? 'page'
                                        : undefined
                                }
                                className={
                                    'text-sm font-semibold transition-colors ' +
                                    (
                                        isActive(item.href)
                                            ? 'text-emerald-400'
                                            : 'text-slate-300 hover:text-emerald-400'
                                    )
                                }
                            >
                                {item.label}
                            </Link>

                        ))}
                    </nav>

                    {/* FELHASZNÁLÓI NAVIGÁCIÓ */}

                    <div className="flex flex-wrap items-center gap-3">

                        {user ? (

                            <>
                                {/* BEJELENTKEZETT FELHASZNÁLÓ */}

                                <span className="hidden text-sm text-slate-300 lg:inline">
                                    Üdv,
                                    <strong className="ml-1 text-emerald-400">
                                        {user.name}
                                    </strong>
                                </span>

                                <Link
                                    href="/dashboard"
                                    className="rounded-lg border border-emerald-500/50 px-4 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                                >
                                    Kijelentkezés
                                </Link>
                            </>

                        ) : (

                            <>
                                {/* VENDÉG FELHASZNÁLÓ */}

                                <Link
                                    href="/login"
                                    className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                                >
                                    Bejelentkezés
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-lg border border-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                                >
                                    Regisztráció
                                </Link>
                            </>

                        )}

                    </div>

                </div>
            </header>

            {/* =====================================
                OLDAL TARTALMA
            ===================================== */}

            <main className="flex-1">
                {children}
            </main>

            {/* =====================================
                KÖZÖS LÁBLÉC
            ===================================== */}

            <footer className="border-t border-white/10 bg-black/50">

                <div className="mx-auto max-w-7xl px-6 py-10">

                    <div className="grid gap-8 md:grid-cols-3">

                        {/* PROJEKT */}

                        <section>

                            <h3 className="text-xl font-black text-emerald-400">
                                NB I. LABDARÚGÁS
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Magyar labdarúgóklubok és
                                játékosok adatbázisa.
                            </p>

                            <p className="mt-3 text-sm text-slate-500">
                                Webprogramozás II.
                                <br />
                                Előadás beadandó
                            </p>

                        </section>

                        {/* KÉSZÍTŐK */}

                        <section>

                            <h3 className="font-bold text-white">
                                Készítők
                            </h3>

                            <p className="mt-3 text-sm text-slate-400">
                                Farkas Tamás
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                                Fodor Árpád
                            </p>

                            <p className="mt-3 text-xs text-slate-500">
                                Neptun-kódok: kitöltendő
                            </p>

                        </section>

                        {/* TECHNOLÓGIÁK */}

                        <section>

                            <h3 className="font-bold text-white">
                                Technológiák
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-400">
                                Laravel 12
                                <br />
                                React + TypeScript
                                <br />
                                Inertia.js
                                <br />
                                MySQL
                                <br />
                                Tailwind CSS
                            </p>

                        </section>

                    </div>

                    {/* ALSÓ LÁBLÉC */}

                    <div className="mt-10 border-t border-white/10 pt-6 text-center">

                        <p className="text-xs text-slate-500">
                            © 2026 NB I. Labdarúgás
                        </p>

                        <p className="mt-2 text-xs text-slate-500">
                            Neumann János Egyetem – GAMF
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Webprogramozás II. – Előadás beadandó
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
}