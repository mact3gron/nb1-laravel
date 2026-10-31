import { Head, Link } from '@inertiajs/react';

// NB I. főoldal
// Laravel 12 + React + TypeScript

const statistics = [
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
        <>
            <Head title="NB I. | Főoldal" />

            <div className="min-h-screen bg-slate-950 text-white">

                {/* NAVIGÁCIÓ */}
                <header className="relative z-20 border-b border-white/10 bg-slate-950">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">

                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tight"
                        >
                            <span className="text-emerald-400">
                                NB I.
                            </span>
                            {' '}LABDARÚGÁS
                        </Link>

                        <nav className="flex flex-wrap items-center gap-5 text-sm font-semibold">

                            <Link
                                href="/"
                                className="text-emerald-400 hover:text-white"
                            >
                                Főoldal
                            </Link>

                            <Link
                                href="/klubok"
                                className="text-slate-200 hover:text-emerald-400"
                            >
                                Klubok
                            </Link>

                            <Link
                                href="/labdarugok"
                                className="text-slate-200 hover:text-emerald-400"
                            >
                                Labdarúgók
                            </Link>

                            <Link
                                href="/login"
                                className="text-slate-200 hover:text-emerald-400"
                            >
                                Bejelentkezés
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg border border-emerald-500 px-4 py-2 text-emerald-300 hover:bg-emerald-600 hover:text-white"
                            >
                                Regisztráció
                            </Link>

                        </nav>
                    </div>
                </header>

                {/* HERO SZEKCIÓ */}
                <main>
                    <section className="relative isolate flex min-h-[650px] items-center overflow-hidden">

                        {/* Háttérkép */}
                        <div
                            className="absolute inset-0 -z-20 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('/images/nb1-hero.png')",
                            }}
                        />

                        {/* Sötétítő réteg */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/20" />

                        <div className="mx-auto w-full max-w-7xl px-6 py-24">

                            <span className="mb-6 inline-block rounded-full border border-emerald-400/50 bg-emerald-500/20 px-5 py-2 text-sm font-bold uppercase tracking-widest text-emerald-300">
                                Magyar labdarúgás
                            </span>

                            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
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
                                és böngéssz a magyar
                                bajnokság adatai között!
                            </p>

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

                    {/* STATISZTIKÁK */}
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

                    {/* ADATBÁZIS BEMUTATÁSA */}
                    <section className="mx-auto max-w-7xl px-6 py-20">

                        <div className="mb-12 text-center">
                            <p className="font-bold uppercase tracking-widest text-emerald-400">
                                NB I. adatbázis
                            </p>

                            <h2 className="mt-3 text-4xl font-black">
                                FEDEZD FEL AZ ADATOKAT
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                                A klubok, játékosok és posztok
                                adatai egy helyen, kereshető
                                formában.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">

                            {/* KLUBOK */}
                            <Link
                                href="/klubok"
                                className="group rounded-2xl border border-white/10 bg-slate-900 p-9 transition hover:border-emerald-500 hover:bg-slate-800"
                            >
                                <div className="mb-7 text-5xl">
                                    🏆
                                </div>

                                <h3 className="text-2xl font-bold">
                                    NB I. klubok
                                </h3>

                                <p className="mt-4 leading-7 text-slate-400">
                                    Böngéssz a bajnokság
                                    csapatai között!
                                    Keress klubnév alapján,
                                    és tekintsd meg a
                                    rendelkezésre álló adatokat.
                                </p>

                                <p className="mt-7 font-bold text-emerald-400 group-hover:text-emerald-300">
                                    Klubok megtekintése →
                                </p>
                            </Link>

                            {/* JÁTÉKOSOK */}
                            <Link
                                href="/labdarugok"
                                className="group rounded-2xl border border-white/10 bg-slate-900 p-9 transition hover:border-emerald-500 hover:bg-slate-800"
                            >
                                <div className="mb-7 text-5xl">
                                    ⚽
                                </div>

                                <h3 className="text-2xl font-bold">
                                    Labdarúgók
                                </h3>

                                <p className="mt-4 leading-7 text-slate-400">
                                    Ismerd meg a játékosokat,
                                    klubjaikat, posztjukat,
                                    mezszámukat és nyilvántartott
                                    piaci értéküket!
                                </p>

                                <p className="mt-7 font-bold text-emerald-400 group-hover:text-emerald-300">
                                    Játékosok megtekintése →
                                </p>
                            </Link>

                        </div>
                    </section>
                </main>

                {/* LÁBLÉC */}
                <footer className="border-t border-white/10 bg-black/50 px-6 py-8">

                    <div className="mx-auto max-w-7xl text-center">

                        <p className="font-bold text-emerald-400">
                            NB I. Labdarúgás
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                            Webprogramozás II. – Előadás beadandó
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                            Készítők: [1. név – Neptun-kód],
                            {' '}[2. név – Neptun-kód]
                        </p>

                        <p className="mt-3 text-xs text-slate-500">
                            Laravel 12 · React · TypeScript · MySQL
                        </p>

                    </div>
                </footer>

            </div>
        </>
    );
}
