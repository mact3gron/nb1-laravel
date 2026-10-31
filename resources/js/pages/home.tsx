import { Head, Link } from '@inertiajs/react';
import Nb1Layout from '../layouts/nb1-layout';

// NB I. - Főoldal
// Laravel 12 + React + TypeScript

interface Statistic {
    number: string;
    label: string;
}

const statistics: Statistic[] = [
    {
        number: '12',
        label: 'Labdarúgóklub',
    },
    {
        number: '318',
        label: 'Labdarúgó',
    },
    {
        number: '14',
        label: 'Játékosposzt',
    },
];

export default function Home() {
    return (
        <Nb1Layout>
            <Head title="NB I. | Főoldal" />

            {/* =====================================
                HERO SZEKCIÓ
            ===================================== */}

            <section className="relative isolate flex min-h-[650px] items-center overflow-hidden">

                {/* HÁTTÉRKÉP */}
                <div
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage:
                            "url('/images/nb1-hero.png')",
                    }}
                />

                {/* SÖTÉTÍTŐ RÉTEG */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/65 to-slate-950/20" />

                {/* HERO TARTALOM */}
                <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-24">

                    <span className="mb-6 inline-block rounded-full border border-emerald-400/50 bg-emerald-500/20 px-5 py-2 text-sm font-bold uppercase tracking-widest text-emerald-300">
                        Magyar labdarúgás
                    </span>

                    <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">

                        A MAGYAR
                        <br />

                        <span className="text-emerald-400">
                            LABDARÚGÁS
                        </span>

                        <br />
                        VILÁGA

                    </h1>

                    <p className="mt-7 max-w-xl text-lg leading-8 text-slate-200">
                        Fedezd fel az NB I. klubjait,
                        ismerd meg a labdarúgókat,
                        és böngéssz a magyar bajnokság
                        adatai között!
                    </p>

                    {/* GOMBOK */}
                    <div className="mt-10 flex flex-wrap gap-4">

                        <Link
                            href="/klubok"
                            className="rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white shadow-lg transition hover:bg-emerald-500"
                        >
                            Klubok megtekintése
                        </Link>

                        <Link
                            href="/labdarugok"
                            className="rounded-xl border border-white/40 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                        >
                            Labdarúgók
                        </Link>

                    </div>
                </div>
            </section>

            {/* =====================================
                STATISZTIKÁK
            ===================================== */}

            <section className="border-y border-white/10 bg-slate-900">

                <div className="mx-auto grid max-w-7xl gap-5 px-6 py-10 sm:grid-cols-3">

                    {statistics.map((stat) => (

                        <div
                            key={stat.label}
                            className="rounded-2xl border border-white/10 bg-slate-800/60 p-8 text-center"
                        >
                            <p className="text-5xl font-black text-emerald-400">
                                {stat.number}
                            </p>

                            <p className="mt-3 text-sm font-semibold uppercase tracking-wider text-slate-300">
                                {stat.label}
                            </p>
                        </div>

                    ))}

                </div>
            </section>

            {/* =====================================
                ADATBÁZIS BEMUTATÁSA
            ===================================== */}

            <section className="bg-slate-950 px-6 py-20">

                <div className="mx-auto max-w-7xl">

                    <div className="mb-12 text-center">

                        <p className="font-bold uppercase tracking-widest text-emerald-400">
                            NB I. adatbázis
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                            FEDEZD FEL AZ ADATOKAT
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                            Klubok, játékosok és posztok
                            egy helyen, kereshető formában.
                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">

                        {/* KLUBOK KÁRTYA */}
                        <Link
                            href="/klubok"
                            className="group rounded-2xl border border-white/10 bg-slate-900 p-9 transition hover:border-emerald-500 hover:bg-slate-800"
                        >

                            <div className="mb-7 text-5xl">
                                🏆
                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                NB I. klubok
                            </h3>

                            <p className="mt-4 leading-7 text-slate-400">
                                Böngéssz a bajnokság
                                klubjai között!

                                Keress klubnév alapján,
                                és ismerd meg a csapatokat.
                            </p>

                            <p className="mt-7 font-bold text-emerald-400 group-hover:text-emerald-300">
                                Klubok megtekintése →
                            </p>

                        </Link>

                        {/* LABDARÚGÓK KÁRTYA */}
                        <Link
                            href="/labdarugok"
                            className="group rounded-2xl border border-white/10 bg-slate-900 p-9 transition hover:border-emerald-500 hover:bg-slate-800"
                        >

                            <div className="mb-7 text-5xl">
                                ⚽
                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                Labdarúgók
                            </h3>

                            <p className="mt-4 leading-7 text-slate-400">
                                Ismerd meg a játékosokat,
                                klubjaikat és posztjukat!

                                Tekintsd meg mezszámukat
                                és nyilvántartott értéküket.
                            </p>

                            <p className="mt-7 font-bold text-emerald-400 group-hover:text-emerald-300">
                                Játékosok megtekintése →
                            </p>

                        </Link>

                    </div>
                </div>
            </section>
        </Nb1Layout>
    );
}


