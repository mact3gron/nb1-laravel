import { Head, Link, usePage } from '@inertiajs/react';
import Nb1Layout from '../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - Felhasználói Dashboard
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| - Bejelentkezett felhasználó üdvözlése
| - Visszalépés a főoldalra
| - Klubok és labdarúgók megnyitása
| - Adminpanel megnyitása csak adminoknak
| - Egységes NB I. megjelenés
|
*/

interface AuthUser {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
}

interface AuthData {
    user?: AuthUser | null;
}

export default function Dashboard() {

    const { props } = usePage();

    const auth = props.auth as AuthData | undefined;
    const user = auth?.user ?? null;

    const isAdmin = user?.is_admin === true;

    return (
        <Nb1Layout>

            <Head title="NB I. | Dashboard" />

            {/* DASHBOARD FEJLÉC */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-400">
                        Felhasználói vezérlőpult
                    </span>

                    <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl">
                        Üdvözlünk,
                        <span className="ml-3 text-emerald-400">
                            {user?.name ?? 'Felhasználó'}!
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                        Üdvözlünk az NB I. labdarúgás
                        felhasználói felületén!
                        Innen könnyedén elérheted az
                        alkalmazás fontosabb funkcióit.
                    </p>

                    {/* FŐOLDAL GOMB */}

                    <div className="mt-9 flex flex-wrap gap-4">

                        <Link
                            href="/"
                            className="inline-flex items-center rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white transition hover:bg-emerald-500"
                        >
                            ← Vissza a főoldalra
                        </Link>

                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="inline-flex items-center rounded-xl border border-emerald-500 px-7 py-4 font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                            >
                                Adminpanel megnyitása
                            </Link>
                        )}

                    </div>

                </div>
            </section>

            {/* DASHBOARD FŐ TARTALOM */}

            <section className="bg-slate-950 px-6 py-14">

                <div className="mx-auto max-w-7xl">

                    <h2 className="text-2xl font-bold text-white">
                        Gyors navigáció
                    </h2>

                    <p className="mt-3 text-slate-400">
                        Válaszd ki, melyik részt szeretnéd
                        megnyitni.
                    </p>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">

                        {/* KLUBOK */}

                        <Link
                            href="/klubok"
                            className="group rounded-2xl border border-white/10 bg-slate-900 p-8 transition hover:border-emerald-500"
                        >
                            <div className="mb-5 text-5xl">
                                🏆
                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                NB I. klubok
                            </h3>

                            <p className="mt-4 leading-7 text-slate-400">
                                A magyar első osztályú
                                labdarúgóklubok kereshető
                                listája.
                            </p>

                            <p className="mt-6 font-bold text-emerald-400 group-hover:text-emerald-300">
                                Klubok megtekintése →
                            </p>
                        </Link>

                        {/* LABDARÚGÓK */}

                        <Link
                            href="/labdarugok"
                            className="group rounded-2xl border border-white/10 bg-slate-900 p-8 transition hover:border-emerald-500"
                        >
                            <div className="mb-5 text-5xl">
                                ⚽
                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                Labdarúgók
                            </h3>

                            <p className="mt-4 leading-7 text-slate-400">
                                Játékosok, klubok, posztok
                                és nyilvántartott piaci
                                értékek.
                            </p>

                            <p className="mt-6 font-bold text-emerald-400 group-hover:text-emerald-300">
                                Labdarúgók megtekintése →
                            </p>
                        </Link>

                    </div>

                    {/* FELHASZNÁLÓI INFORMÁCIÓK */}

                    <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-8">

                        <h2 className="text-xl font-bold text-white">
                            Fiókinformációk
                        </h2>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-sm text-slate-400">
                                    Felhasználónév
                                </p>

                                <p className="mt-2 font-semibold text-white">
                                    {user?.name ?? 'Nincs adat'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    E-mail-cím
                                </p>

                                <p className="mt-2 break-all font-semibold text-white">
                                    {user?.email ?? 'Nincs adat'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Jogosultság
                                </p>

                                <p className="mt-2 font-semibold text-emerald-400">
                                    {isAdmin
                                        ? 'Adminisztrátor'
                                        : 'Regisztrált felhasználó'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-slate-400">
                                    Fiók kezelése
                                </p>

                                <Link
                                    href="/settings/profile"
                                    className="mt-2 inline-block font-semibold text-emerald-400 hover:text-emerald-300"
                                >
                                    Profilbeállítások →
                                </Link>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

        </Nb1Layout>
    );
}
