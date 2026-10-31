import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Shield,
    Trophy,
    Users,
} from 'lucide-react';

const features = [
    {
        title: 'Klubok',
        description:
            'Az NB I. csapatainak listája, kereshető és jól áttekinthető formában.',
        icon: Shield,
        routeName: 'klubok.index',
    },
    {
        title: 'Labdarúgók',
        description:
            'Játékosadatok, klubhoz tartozás, posztok és további fontos információk.',
        icon: Users,
        routeName: 'labdarugok.index',
    },
    {
        title: 'Posztok és adatok',
        description:
            'Böngészhető játékosadatok és a pályán betöltött szerepkörök.',
        icon: BarChart3,
        routeName: 'labdarugok.index',
    },
] as const;

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const isLoggedIn = Boolean(auth.user);

    return (
        <>
            <Head title="NB I. Adatbázis">
                <meta
                    name="description"
                    content="NB I. labdarúgó-adatbázis klubokkal, játékosokkal és posztokkal."
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">

                {/* Felső navigáció */}
                <header className="site-header sticky top-0 z-50 backdrop-blur">
                    <div className="site-container flex min-h-20 flex-wrap items-center justify-between gap-4 py-4">
                        <Link
                            href={route('home')}
                            className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-foreground no-underline sm:text-2xl"
                        >
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                                <Trophy
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </span>

                            <span>NB I. Adatbázis</span>
                        </Link>

                        <nav
                            className="site-nav"
                            aria-label="Fő navigáció"
                        >
                            <Link href={route('home')}>
                                Főoldal
                            </Link>

                            <Link href={route('klubok.index')}>
                                Klubok
                            </Link>

                            <Link href={route('labdarugok.index')}>
                                Labdarúgók
                            </Link>

                            {isLoggedIn ? (
                                <Link href={route('dashboard')}>
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('login')}>
                                        Bejelentkezés
                                    </Link>

                                    <Link href={route('register')}>
                                        Regisztráció
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Stadionos fő kép */}
                <section className="relative isolate overflow-hidden">
                    <div
                        className="absolute inset-0 -z-20 bg-cover bg-center"
                        style={{
                            backgroundImage:
                                "url('/images/nb1-hero.jpg')",
                        }}
                    />

                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,107,67,0.32),transparent_45%)]" />

                    <div className="site-container relative flex min-h-[75vh] items-center py-20 sm:py-28">
                        <div className="max-w-3xl text-white">
                            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                                <Trophy
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                                Magyar labdarúgás · NB I.
                            </span>

                            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                                NB I.{' '}
                                <span className="text-emerald-300">
                                    adatbázis
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
                                Klubok, labdarúgók és posztok modern,
                                átlátható felületen. Gyors keresés,
                                letisztult megjelenés és kényelmes
                                navigáció.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <Link
                                    href={route('klubok.index')}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white no-underline shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-500"
                                >
                                    Klubok megtekintése
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <Link
                                    href={route('labdarugok.index')}
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/15 px-6 py-4 text-base font-semibold text-white no-underline backdrop-blur-md transition hover:bg-white/25"
                                >
                                    Labdarúgók listája
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Információs kártyák */}
                <section className="site-section relative z-10 -mt-10 sm:-mt-14">
                    <div className="site-container grid gap-6 md:grid-cols-3">
                        {features.map(
                            ({
                                title,
                                description,
                                icon: Icon,
                                routeName,
                            }) => (
                                <Link
                                    key={title}
                                    href={route(routeName)}
                                    className="group rounded-3xl border border-border bg-card p-7 text-card-foreground no-underline shadow-[0_18px_50px_rgba(0,0,0,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.15)]"
                                >
                                    <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                                        <Icon
                                            className="h-7 w-7"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <h2 className="text-xl font-bold">
                                        {title}
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                        {description}
                                    </p>

                                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                                        Tovább
                                        <ArrowRight
                                            className="h-4 w-4 transition group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Link>
                            )
                        )}
                    </div>
                </section>

                {/* Projektbemutató */}
                <section className="site-section pt-2">
                    <div className="site-container grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

                        <article className="site-card rounded-3xl p-8">
                            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                A projektről
                            </p>

                            <h2 className="text-3xl font-extrabold tracking-tight">
                                NB I. labdarúgó-adatbázis
                            </h2>

                            <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                                Az oldal klubokat és labdarúgókat
                                mutat be kereshető, áttekinthető
                                formában. A projekt Laravel, React,
                                TypeScript és Inertia használatával
                                készült.
                            </p>
                        </article>

                        <aside className="site-card rounded-3xl p-8">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                                Gyors linkek
                            </p>

                            <div className="mt-5 grid gap-3">
                                <Link
                                    href={route('klubok.index')}
                                    className="welcome-quick-link"
                                >
                                    Klubok
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <Link
                                    href={route('labdarugok.index')}
                                    className="welcome-quick-link"
                                >
                                    Labdarúgók
                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>

                                <Link
                                    href={
                                        isLoggedIn
                                            ? route('dashboard')
                                            : route('login')
                                    }
                                    className="welcome-quick-link"
                                >
                                    {isLoggedIn
                                        ? 'Dashboard'
                                        : 'Bejelentkezés'}

                                    <ArrowRight
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Lábléc */}
                <footer className="site-footer mt-10">
                    <div className="site-container flex flex-col gap-2 py-5 text-sm md:flex-row md:items-center md:justify-between">
                        <span>NB I. Adatbázis</span>

                        <span>
                            Webprogramozás II. · Laravel · React ·
                            TypeScript · Inertia
                        </span>
                    </div>
                </footer>
            </div>
        </>
    );
}
