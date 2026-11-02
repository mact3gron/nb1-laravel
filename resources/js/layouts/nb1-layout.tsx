import { Link, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

/*
|--------------------------------------------------------------------------
| NB I. - KÖZÖS REACT LAYOUT
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Vendég:
| - Főoldal, Adatbázis, Kapcsolat, Diagram
|
| Bejelentkezett felhasználó:
| - Fentiek + Üzenetek, Dashboard
|
| Adminisztrátor:
| - Fentiek + Admin, Klub CRUD
|
*/

interface LayoutProps {
    children: ReactNode;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
}

interface AuthData {
    user?: AuthUser | null;
}

export default function Nb1Layout({
    children,
}: LayoutProps) {

    const { url, props } = usePage();

    const [mobileOpen, setMobileOpen] = useState(false);

    const auth = props.auth as AuthData | undefined;
    const user = auth?.user ?? null;

    const isAdmin = user?.is_admin === true;

    function isActive(path: string): boolean {
        const current = url.split('?')[0];

        if (path === '/') {
            return current === '/';
        }

        return (
            current === path ||
            current.startsWith(path + '/')
        );
    }

    function navClass(path: string): string {
        return (
            'text-sm font-semibold transition-colors ' +
            (
                isActive(path)
                    ? 'text-emerald-400'
                    : 'text-slate-300 hover:text-emerald-400'
            )
        );
    }

    function closeMenu(): void {
        setMobileOpen(false);
    }

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-white">

            {/* FEJLÉC */}

            <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 shadow-lg backdrop-blur-lg">

                <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-5">

                    {/* LOGÓ */}

                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="shrink-0 text-xl font-black tracking-tight sm:text-2xl"
                    >
                        <span className="text-emerald-400">
                            NB I.
                        </span>

                        <span className="ml-2 text-white">
                            LABDARÚGÁS
                        </span>
                    </Link>

                    {/* ASZTALI NAVIGÁCIÓ */}

                    <nav
                        aria-label="Fő navigáció"
                        className="hidden items-center gap-4 xl:flex"
                    >

                        <Link
                            href="/"
                            className={navClass('/')}
                        >
                            Főoldal
                        </Link>

                        {/* ADATBÁZIS ALMENÜ */}

                        <details className="group relative">

                            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-300 hover:text-emerald-400">
                                Adatbázis ▾
                            </summary>

                            <div className="absolute left-0 top-full z-50 min-w-48 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-xl">

                                <Link
                                    href="/klubok"
                                    className="block rounded-lg px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                                >
                                    Klubok
                                </Link>

                                <Link
                                    href="/labdarugok"
                                    className="block rounded-lg px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 hover:text-emerald-400"
                                >
                                    Labdarúgók
                                </Link>

                            </div>

                        </details>

                        {/* KAPCSOLAT - NYILVÁNOS */}

                        <Link
                            href="/kapcsolat"
                            className={navClass('/kapcsolat')}
                        >
                            Kapcsolat
                        </Link>

                        {/* DIAGRAM - NYILVÁNOS */}

                        <Link
                            href="/diagram"
                            className={navClass('/diagram')}
                        >
                            Diagram
                        </Link>

                        {/* CSAPATERŐSSÉG - NYILVÁNOS */}

                        <Link
                            href="/csapatstatisztika"
                            className={navClass('/csapatstatisztika')}
                        >
                            Csapaterősség
                        </Link>

                        {/* CSAPATOK ÖSSZEHASONLÍTÁSA - NYILVÁNOS */}

                        <Link
                            href="/csapat-osszehasonlitas"
                            className={navClass('/csapat-osszehasonlitas')}
                        >
                            Összehasonlítás
                        </Link>

                        {/* ÜZENETEK - BEJELENTKEZVE */}

                        {user && (
                            <Link
                                href="/uzenetek"
                                className={navClass('/uzenetek')}
                            >
                                Üzenetek
                            </Link>
                        )}

                        {/* ADMINISZTRÁTORI MENÜ */}

                        {isAdmin && (
                            <>
                                {/* CRUD - AKTIVÁLVA */}

                                <Link
                                    href="/admin/klubok"
                                    className={navClass('/admin/klubok')}
                                >
                                    CRUD
                                </Link>

                                {/* TESZTJELENTÉSEK - ADMIN */}

                                <Link
                                    href="/admin/teszt"
                                    className={navClass('/admin/teszt')}
                                >
                                    Teszt
                                </Link>

                                <Link
                                    href="/admin"
                                    className={
                                        isActive('/admin') &&
                                        !isActive('/admin/klubok')
                                            ? 'text-sm font-semibold text-emerald-400'
                                            : 'text-sm font-semibold text-slate-300 hover:text-emerald-400'
                                    }
                                >
                                    Admin
                                </Link>
                            </>
                        )}

                    </nav>

                    {/* FIÓKMENÜ */}

                    <div className="hidden items-center gap-3 xl:flex">

                        {user ? (
                            <>
                                <span className="text-sm text-slate-300">
                                    Üdv,
                                    <strong className="ml-1 text-emerald-400">
                                        {user.name}
                                    </strong>
                                </span>

                                <Link
                                    href="/dashboard"
                                    className="rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white"
                                >
                                    Dashboard
                                </Link>

                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="cursor-pointer rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                                >
                                    Kijelentkezés
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-sm font-semibold text-slate-300 hover:text-emerald-400"
                                >
                                    Bejelentkezés
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-400 hover:bg-emerald-600 hover:text-white"
                                >
                                    Regisztráció
                                </Link>
                            </>
                        )}

                    </div>

                    {/* MOBILMENÜ GOMB */}

                    <button
                        type="button"
                        aria-label="Navigáció megnyitása"
                        aria-controls="nb1-mobile-menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold xl:hidden"
                    >
                        {mobileOpen
                            ? '✕ Bezárás'
                            : '☰ Menü'}
                    </button>

                </div>

                {/* MOBIL NAVIGÁCIÓ */}

                {mobileOpen && (
                    <nav
                        id="nb1-mobile-menu"
                        aria-label="Mobil navigáció"
                        className="border-t border-white/10 bg-slate-900 px-5 py-5 xl:hidden"
                    >

                        <div className="mx-auto flex max-w-7xl flex-col gap-2">

                            <Link
                                href="/"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                Főoldal
                            </Link>

                            <p className="px-4 pt-3 text-xs font-bold uppercase text-emerald-400">
                                Adatbázis
                            </p>

                            <Link
                                href="/klubok"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                Klubok
                            </Link>

                            <Link
                                href="/labdarugok"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                Labdarúgók
                            </Link>

                            <Link
                                href="/kapcsolat"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                Kapcsolat
                            </Link>

                            <Link
                                href="/diagram"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                Diagram
                            </Link>

                            {/* CSAPATERŐSSÉG - NYILVÁNOS */}

                            <Link
                                href="/csapatstatisztika"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                ⚽ Csapaterősség
                            </Link>

                            {/* KÉT CSAPAT ÖSSZEHASONLÍTÁSA - NYILVÁNOS */}

                            <Link
                                href="/csapat-osszehasonlitas"
                                onClick={closeMenu}
                                className="rounded-lg px-4 py-3 hover:bg-slate-800"
                            >
                                ⚽ Összehasonlítás
                            </Link>

                            {/* ÜZENETEK */}

                            {user && (
                                <Link
                                    href="/uzenetek"
                                    onClick={closeMenu}
                                    className="rounded-lg px-4 py-3 hover:bg-slate-800"
                                >
                                    Üzenetek
                                </Link>
                            )}

                            {/* ADMIN - MOBILON IS */}

                            {isAdmin && (
                                <>
                                    <Link
                                        href="/admin/klubok"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 font-semibold text-emerald-400 hover:bg-slate-800"
                                    >
                                        ⚙️ Klubok CRUD
                                    </Link>

                                    {/* TESZTJELENTÉSEK - ADMIN */}

                                    <Link
                                        href="/admin/teszt"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 font-semibold text-emerald-400 hover:bg-slate-800"
                                    >
                                        🧪 Teszt
                                    </Link>

                                    <Link
                                        href="/admin"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 font-semibold text-emerald-400 hover:bg-slate-800"
                                    >
                                        Adminisztráció
                                    </Link>
                                </>
                            )}

                            <div className="my-3 border-t border-white/10" />

                            {/* MOBIL FIÓKMENÜ */}

                            {user ? (
                                <>
                                    <p className="px-4 py-2 text-sm text-emerald-400">
                                        Bejelentkezve: {user.name}
                                    </p>

                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 hover:bg-slate-800"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="cursor-pointer rounded-lg bg-red-700 px-4 py-3 text-left font-semibold text-white"
                                    >
                                        Kijelentkezés
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMenu}
                                        className="rounded-lg px-4 py-3 hover:bg-slate-800"
                                    >
                                        Bejelentkezés
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={closeMenu}
                                        className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white"
                                    >
                                        Regisztráció
                                    </Link>
                                </>
                            )}

                        </div>

                    </nav>
                )}

            </header>

            {/* OLDAL TARTALMA */}

            <main className="min-w-0 flex-1">
                {children}
            </main>

            {/* KÖZÖS LÁBLÉC */}

            <footer className="border-t border-white/10 bg-black/50">

                <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">

                    <section>

                        <h2 className="text-xl font-black text-emerald-400">
                            NB I. LABDARÚGÁS
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            Magyar labdarúgóklubok
                            és játékosok adatbázisa.
                        </p>

                        <p className="mt-3 text-sm text-slate-500">
                            Webprogramozás II. – Előadás beadandó
                        </p>

                    </section>

                    <section>

                        <h2 className="font-bold text-white">
                            Készítette:
                        </h2>

                        <p className="mt-3 text-sm text-slate-400">
                            Farkas Tamás – PLPJEB
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            Fodor Árpád – U4BKST
                        </p>

                    </section>

                    <section>

                        <h2 className="font-bold text-white">
                            Technológiák
                        </h2>

                        <p className="mt-3 text-sm leading-7 text-slate-400">
                            Laravel 12
                            <br />
                            React + TypeScript
                            <br />
                            Inertia.js
                            <br />
                            MySQL
                            <br />
                            Chart.js
                            <br />
                            Tailwind CSS
                        </p>

                        <Link
                            href="/"
                            className="mt-4 inline-block text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </section>

                </div>

                <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-500">
                    © 2026 NB I. Labdarúgás –
                    Neumann János Egyetem – GAMF
                </div>

            </footer>

        </div>
    );
}
