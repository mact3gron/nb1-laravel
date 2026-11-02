import { Head, Link } from '@inertiajs/react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - ADMINISZTRÁCIÓS FŐOLDAL
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Adminisztrációs központ
| - Klubok teljes CRUD kezelése
| - Nyilvános klub- és játékoslista elérése
| - Navigáció a főoldalra
|
| Hozzáférés: auth + admin middleware
|
*/

interface AdminCard {
    title: string;
    description: string;
    icon: string;
    href: string;
    action: string;
    primary: boolean;
}

const adminCards: AdminCard[] = [
    {
        title: 'Klubok kezelése',
        description:
            'Klubok létrehozása, listázása, szerkesztése ' +
            'és törlése. Teljes adminisztrátori CRUD.',
        icon: '🏆',
        href: '/admin/klubok',
        action: 'CRUD megnyitása',
        primary: true,
    },
    {
        title: 'Klubok megtekintése',
        description:
            'A bajnokság klubjainak nyilvános, ' +
            'kereshető adatbázisa.',
        icon: '📋',
        href: '/klubok',
        action: 'Klublista megnyitása',
        primary: false,
    },
    {
        title: 'Labdarúgók',
        description:
            'Játékosok, klubtagságok, posztok ' +
            'és a nyilvántartott játékosadatok.',
        icon: '⚽',
        href: '/labdarugok',
        action: 'Játékoslista megnyitása',
        primary: false,
    },
];

export default function AdminIndex() {
    return (
        <Nb1Layout>

            <Head title="NB I. | Adminisztráció" />

            {/* ADMIN FEJLÉC */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Adminisztráció
                        </span>

                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        🛡️ Adminisztrátori felület
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

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Link
                            href="/admin/klubok"
                            className="inline-flex items-center rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white transition hover:bg-emerald-500"
                        >
                            ⚙️ Klubok kezelése
                        </Link>

                        <Link
                            href="/"
                            className="inline-flex items-center rounded-xl border border-emerald-500/40 px-7 py-4 font-bold text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10"
                        >
                            ← Vissza a főoldalra
                        </Link>

                    </div>

                </div>

            </section>

            {/* ADMIN TARTALOM */}

            <section className="bg-slate-950 px-4 py-14 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* ÜDVÖZLŐ RÉSZ */}

                    <div className="mb-10 rounded-2xl border border-emerald-500/20 bg-slate-900 p-7 shadow-xl">

                        <div className="flex flex-wrap items-center justify-between gap-5">

                            <div>

                                <h2 className="text-2xl font-bold text-white">
                                    Adminisztrációs központ
                                </h2>

                                <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                                    Innen érheted el az NB I.
                                    klubok kezelését.

                                    Új klubot hozhatsz létre,
                                    módosíthatod a meglévő
                                    klubneveket, és törölheted
                                    a játékosok nélküli klubokat.
                                </p>

                            </div>

                            <div className="rounded-2xl bg-emerald-500/10 p-5 text-4xl">
                                ⚙️
                            </div>

                        </div>

                    </div>

                    {/* ADMIN MODULOK */}

                    <div className="mb-7">

                        <h2 className="text-2xl font-black text-white">
                            Adminisztrációs modulok
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Válaszd ki a használni kívánt funkciót.
                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                        {adminCards.map((card) => (

                            <article
                                key={card.title}
                                className={
                                    'flex flex-col rounded-2xl border bg-slate-900 p-8 shadow-xl transition ' +
                                    (
                                        card.primary
                                            ? 'border-emerald-500/50'
                                            : 'border-white/10 hover:border-emerald-500/40'
                                    )
                                }
                            >

                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl">
                                    {card.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-white">
                                    {card.title}
                                </h3>

                                <p className="mt-4 flex-1 leading-7 text-slate-400">
                                    {card.description}
                                </p>

                                <Link
                                    href={card.href}
                                    className={
                                        'mt-8 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 font-bold transition ' +
                                        (
                                            card.primary
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                : 'border border-emerald-500/40 text-emerald-400 hover:bg-emerald-600 hover:text-white'
                                        )
                                    }
                                >
                                    {card.action} →
                                </Link>

                            </article>

                        ))}

                    </div>

                    {/* JOGOSULTSÁGOK */}

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
                                    A CRUD műveleteit a Laravel
                                    szerveroldalon, adminisztrátori
                                    jogosultság alapján védi.

                                    A nyilvános klub- és
                                    labdarúgólisták minden
                                    látogató számára elérhetők.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="mt-10 text-center">

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
