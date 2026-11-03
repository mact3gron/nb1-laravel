
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
| - React + Axios Labdarúgó CRUD
| - Nyilvános klub- és játékoslista
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
        title: 'Klubok kezelése – CRUD',
        description:
            'Klubok létrehozása, listázása, szerkesztése ' +
            'és törlése. Laravel Eloquent ORM alapú ' +
            'adminisztrátori CRUD-funkció.',
        icon: '🏆',
        href: '/admin/klubok',
        action: 'Klub CRUD megnyitása',
        primary: true,
    },
    {
        title: 'React + Axios – Labdarúgó CRUD',
        description:
            'Teljes játékoskezelés React és Axios ' +
            'segítségével. Új labdarúgók hozzáadása, ' +
            'meglévők szerkesztése és törlése. ' +
            'A klubok és a posztok legördülő listái ' +
            'a MySQL-adatbázisból töltődnek be. ' +
            'A Webprogramozás II. pluszfeladata.',
        icon: '⚽',
        href: '/admin/react-labdarugok',
        action: 'React + Axios CRUD megnyitása',
        primary: true,
    },
    {
        title: 'Klubok megtekintése',
        description:
            'A magyar labdarúgó-bajnokság klubjainak ' +
            'nyilvános, kereshető adatbázisa.',
        icon: '📋',
        href: '/klubok',
        action: 'Klublista megnyitása',
        primary: false,
    },
    {
        title: 'Labdarúgók megtekintése',
        description:
            'A nyilvántartott játékosok, klubtagságok, ' +
            'posztok és játékosadatok böngészése.',
        icon: '👥',
        href: '/labdarugok',
        action: 'Játékoslista megnyitása',
        primary: false,
    },
    {
        title: 'Automatizált tesztek',
        description:
            'A csapaterősség-kalkulátor Unit és ' +
            'Feature tesztjeinek bemutatása. ' +
            'A Webprogramozás II. tesztelési pluszfeladata.',
        icon: '🧪',
        href: '/admin/teszt',
        action: 'Tesztek megtekintése',
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

                    {/* MORZSAMENÜ */}

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

                    {/* FEJLÉC CÍMKE */}

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        🛡️ Adminisztrátori felület
                    </span>

                    {/* FŐCÍM */}

                    <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl">
                        NB I.

                        <span className="ml-3 text-emerald-400">
                            ADMIN PANEL
                        </span>
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                        A magyar labdarúgó-bajnokság
                        adatainak adminisztrációs központja.
                        Laravel CRUD és React + Axios
                        játékoskezelő funkciókkal.
                    </p>

                    {/* GYORS ELÉRÉSEK */}

                    <div className="mt-8 flex flex-wrap gap-4">

                        <Link
                            href="/admin/klubok"
                            className="inline-flex items-center rounded-xl bg-emerald-600 px-7 py-4 font-bold text-white transition hover:bg-emerald-500"
                        >
                            🏆 Klub CRUD
                        </Link>

                        <Link
                            href="/admin/react-labdarugok"
                            className="inline-flex items-center rounded-xl border border-emerald-500/40 px-7 py-4 font-bold text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10"
                        >
                            ⚽ React + Axios Labdarúgó CRUD
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
                                    klubjainak és labdarúgóinak
                                    kezelését.

                                    A hagyományos Laravel CRUD
                                    mellett külön React + Axios
                                    alapú játékoskezelő is
                                    rendelkezésre áll.
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

                    {/* KÁRTYÁK */}

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                        {adminCards.map((card) => (
                            <article
                                key={card.href}
                                className={
                                    'flex flex-col rounded-2xl border bg-slate-900 p-8 shadow-xl transition ' +
                                    (
                                        card.primary
                                            ? 'border-emerald-500/50'
                                            : 'border-white/10 hover:border-emerald-500/40'
                                    )
                                }
                            >

                                {/* IKON */}

                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl">
                                    {card.icon}
                                </div>

                                {/* CÍM */}

                                <h3 className="text-2xl font-bold text-white">
                                    {card.title}
                                </h3>

                                {/* LEÍRÁS */}

                                <p className="mt-4 flex-1 leading-7 text-slate-400">
                                    {card.description}
                                </p>

                                {/* GOMB */}

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

                    {/* TECHNOLÓGIAI MAGYARÁZAT */}

                    <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-slate-900 p-7">

                        <h2 className="text-xl font-bold text-white">
                            React + Axios CRUD – technológiai megvalósítás
                        </h2>

                        <p className="mt-4 leading-8 text-slate-400">
                            A labdarúgók kezelésére szolgáló
                            külön modul React és TypeScript
                            felhasználásával készült.

                            A kliensoldali Axios-kérések a Laravel
                            JSON-végpontjaival kommunikálnak.

                            Az adatbázis-műveleteket a Laravel
                            Eloquent ORM végzi, szerveroldali
                            validációval és adminisztrátori
                            jogosultságellenőrzéssel.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">

                            {[
                                'React',
                                'Axios',
                                'TypeScript',
                                'Laravel',
                                'Eloquent ORM',
                                'MySQL',
                            ].map((technology) => (
                                <span
                                    key={technology}
                                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300"
                                >
                                    {technology}
                                </span>
                            ))}

                        </div>
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
                                    A CRUD-műveleteket a Laravel
                                    szerveroldalon adminisztrátori
                                    jogosultság alapján védi.

                                    A nyilvános klub- és
                                    labdarúgólisták minden
                                    látogató számára elérhetők.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* VISSZA */}

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
