
import { Head, Link } from '@inertiajs/react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - Adminisztrációs főoldal
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript
| Inertia.js + Tailwind CSS
|
| Funkciók:
| - Adminisztrációs főoldal
| - Klubok áttekintése
| - Labdarúgók áttekintése
| - Posztok modul előkészítése
| - Közös NB I. Layout
|
| A CRUD-funkciókat külön készítjük el.
|
*/

interface AdminCard {
    title: string;
    description: string;
    icon: string;
    href: string | null;
    action: string;
}

const adminCards: AdminCard[] = [
    {
        title: 'Klubok',
        description:
            'A bajnokságban szereplő klubok adatainak áttekintése.',
        icon: '🏆',
        href: '/klubok',
        action: 'Klublista megnyitása',
    },
    {
        title: 'Labdarúgók',
        description:
            'Játékosok, klubtagságok, posztok és piaci értékek áttekintése.',
        icon: '⚽',
        href: '/labdarugok',
        action: 'Játékoslista megnyitása',
    },
    {
        title: 'Posztok',
        description:
            'A labdarúgó-posztok adminisztrációs felületének előkészítése.',
        icon: '📋',
        href: null,
        action: 'Hamarosan',
    },
];

export default function AdminIndex() {
    return (
        <Nb1Layout>
            <Head title="NB I. | Adminisztráció" />

            {/* =====================================
                ADMIN FEJLÉC
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="transition hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Adminisztráció
                        </span>

                    </div>

                    {/* ADMIN JELÖLÉS */}

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <span>🛡️</span>
                        Adminisztrátori felület
                    </span>

                    <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        NB I.

                        <span className="ml-3 text-emerald-400">
                            ADMIN PANEL
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                        A magyar labdarúgó-bajnokság
                        adatainak adminisztrációs központja.
                    </p>

                </div>
            </section>

            {/* =====================================
                ADMIN FŐ TARTALOM
            ===================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* ÜDVÖZLŐ BLOKK */}

                    <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-slate-900 p-7 shadow-xl">

                        <div className="flex flex-wrap items-center justify-between gap-5">

                            <div>

                                <h2 className="text-2xl font-bold text-white">
                                    Adminisztrációs központ
                                </h2>

                                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                                    Itt érheted el a klubok és
                                    labdarúgók listáját.

                                    Az adatok létrehozását,
                                    szerkesztését és törlését
                                    a következő fejlesztési
                                    lépésekben építjük be.
                                </p>

                            </div>

                            <div className="rounded-2xl bg-emerald-500/10 p-5 text-4xl">
                                ⚙️
                            </div>

                        </div>

                    </div>

                    {/* =====================================
                        ADMIN MODULOK
                    ===================================== */}

                    <div className="mb-7">

                        <h2 className="text-2xl font-black text-white">
                            Kezelhető adatok
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Válassz az adatbázis fő területei közül.
                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                        {adminCards.map((card) => (

                            <article
                                key={card.title}
                                className="flex flex-col rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-xl transition hover:border-emerald-500/50"
                            >

                                {/* MODUL IKON */}

                                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl">
                                    {card.icon}
                                </div>

                                {/* MODUL NEVE */}

                                <h3 className="text-2xl font-bold text-white">
                                    {card.title}
                                </h3>

                                {/* MODUL LEÍRÁSA */}

                                <p className="mt-4 flex-1 leading-7 text-slate-400">
                                    {card.description}
                                </p>

                                {/* MODUL MEGNYITÁSA */}

                                <div className="mt-8">

                                    {card.href ? (

                                        <Link
                                            href={card.href}
                                            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
                                        >
                                            {card.action}
                                        </Link>

                                    ) : (

                                        <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold text-slate-500">
                                            {card.action}
                                        </span>

                                    )}

                                </div>

                            </article>

                        ))}

                    </div>

                    {/* =====================================
                        JOGOSULTSÁG INFORMÁCIÓ
                    ===================================== */}

                    <div className="mt-10 rounded-2xl border border-white/10 bg-slate-900 p-7">

                        <div className="flex items-start gap-5">

                            <div className="text-3xl">
                                🔒
                            </div>

                            <div>

                                <h3 className="text-lg font-bold text-white">
                                    Jogosultságkezelés
                                </h3>

                                <p className="mt-3 leading-7 text-slate-400">
                                    Az adminisztrációs útvonalak
                                    hozzáférését a Laravel
                                    AdminMiddleware ellenőrzi.

                                    A nyilvános klub- és
                                    játékoslisták minden
                                    látogató számára
                                    elérhetők maradnak.
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* =====================================
                        VISSZA A FŐOLDALRA
                    ===================================== */}

                    <div className="mt-12 text-center">

                        <Link
                            href="/"
                            className="inline-block rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </div>

                </div>

            </section>
        </Nb1Layout>
    );
}
