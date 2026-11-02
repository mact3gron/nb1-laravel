import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - KÉT CSAPAT ÖSSZEHASONLÍTÁSA
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| A csapatokat a Laravel az adatbázisból küldi.
| A számítás a Laravel szerveren történik.
| A felhasználó a két klub eredményeit külön adja meg.
|
*/

type Oldal = 'elso' | 'masodik';

type Mezo =
    | 'gyozelmek'
    | 'dontetlenek'
    | 'veresegek'
    | 'lott_golok'
    | 'kapott_golok';

type MezoKulcs = `${Oldal}_${Mezo}`;
type KlubKulcs = `${Oldal}_klub_id`;
type FormKulcs = MezoKulcs | KlubKulcs;

type OsszehasonlitasForm = Record<FormKulcs, string>;

/*
|--------------------------------------------------------------------------
| TYPESCRIPT TÍPUSOK
|--------------------------------------------------------------------------
*/

interface Klub {
    id: number;
    csapatnev: string;
}

interface CsapatEredmeny {
    klub_id: number;
    klub_nev: string;

    gyozelmek: number;
    dontetlenek: number;
    veresegek: number;

    lott_golok: number;
    kapott_golok: number;

    merkozesek: number;
    pontok: number;
    golkulonbseg: number;
    gol_atlag: number;

    teljesitmenyindex: number;
    ertekeles: string;
}

interface OsszehasonlitasEredmeny {
    elso: CsapatEredmeny;
    masodik: CsapatEredmeny;

    kulonbseg: number;
    jobb: Oldal | null;
    azonos_meccsszam: boolean;
}

interface Props {
    klubok: Klub[];
    eredmeny: OsszehasonlitasEredmeny | null;
    bevittAdatok: Partial<OsszehasonlitasForm> | null;
}

/*
|--------------------------------------------------------------------------
| STATISZTIKAI MEZŐK
|--------------------------------------------------------------------------
*/

const mezok: ReadonlyArray<{
    key: Mezo;
    label: string;
    max: number;
}> = [
    {
        key: 'gyozelmek',
        label: 'Győzelmek',
        max: 1000,
    },
    {
        key: 'dontetlenek',
        label: 'Döntetlenek',
        max: 1000,
    },
    {
        key: 'veresegek',
        label: 'Vereségek',
        max: 1000,
    },
    {
        key: 'lott_golok',
        label: 'Lőtt gólok',
        max: 10000,
    },
    {
        key: 'kapott_golok',
        label: 'Kapott gólok',
        max: 10000,
    },
];

/*
|--------------------------------------------------------------------------
| SEGÉDFÜGGVÉNY
|--------------------------------------------------------------------------
*/

function kulonbsegSzoveg(szam: number): string {
    return szam > 0 ? `+${szam}` : String(szam);
}

/*
|--------------------------------------------------------------------------
| EREDMÉNYKÁRTYA
|--------------------------------------------------------------------------
|
| Egy csapat kiszámított statisztikáit mutatja.
|
*/

function EredmenyKartya({
    adat,
    jobb,
}: {
    adat: CsapatEredmeny;
    jobb: boolean;
}) {
    const index = Math.max(
        0,
        Math.min(100, adat.teljesitmenyindex)
    );

    return (
        <article
            className={`rounded-2xl border bg-slate-900 p-6 shadow-xl sm:p-8 ${
                jobb
                    ? 'border-emerald-500/70'
                    : 'border-white/10'
            }`}
        >
            {/* KLUB NEVE */}

            <div className="flex flex-wrap items-center justify-between gap-3">

                <h3 className="text-2xl font-black text-white">
                    {adat.klub_nev}
                </h3>

                {jobb && (
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400">
                        Magasabb index
                    </span>
                )}

            </div>

            {/* TELJESÍTMÉNYINDEX */}

            <div className="mt-7 flex items-end justify-between gap-4">

                <div>
                    <p className="text-sm text-slate-400">
                        Becsült teljesítmény
                    </p>

                    <p className="mt-2 text-lg font-bold text-emerald-400">
                        {adat.ertekeles}
                    </p>
                </div>

                <p className="text-4xl font-black text-white">
                    {adat.teljesitmenyindex}

                    <span className="text-lg text-slate-400">
                        {' '}/ 100
                    </span>
                </p>

            </div>

            {/* TELJESÍTMÉNY SÁV */}

            <div
                role="progressbar"
                aria-label={`${adat.klub_nev} teljesítményindexe`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={index}
                className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700"
            >
                <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                        width: `${index}%`,
                    }}
                />
            </div>

            {/* RÉSZLETES STATISZTIKÁK */}

            <dl className="mt-7 grid grid-cols-2 gap-3">

                {[
                    ['Mérkőzések', adat.merkozesek],
                    ['Bajnoki pontok', adat.pontok],
                    ['Győzelmek', adat.gyozelmek],
                    ['Döntetlenek', adat.dontetlenek],
                    ['Vereségek', adat.veresegek],
                    ['Lőtt gólok', adat.lott_golok],
                    ['Kapott gólok', adat.kapott_golok],
                    [
                        'Gólkülönbség',
                        kulonbsegSzoveg(
                            adat.golkulonbseg
                        ),
                    ],
                    [
                        'Gól / mérkőzés',
                        adat.gol_atlag.toLocaleString(
                            'hu-HU',
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        ),
                    ],
                ].map(([nev, ertek]) => (

                    <div
                        key={nev}
                        className="rounded-xl bg-slate-800/70 p-4"
                    >
                        <dt className="text-xs text-slate-400">
                            {nev}
                        </dt>

                        <dd className="mt-2 text-xl font-bold text-white">
                            {ertek}
                        </dd>
                    </div>

                ))}

            </dl>

        </article>
    );
}

/*
|--------------------------------------------------------------------------
| FŐOLDAL KOMPONENS
|--------------------------------------------------------------------------
*/

export default function CsapatOsszehasonlitasIndex({
    klubok,
    eredmeny,
    bevittAdatok,
}: Props) {

    /*
    |--------------------------------------------------------------------------
    | ŰRLAP ALAPADATAI
    |--------------------------------------------------------------------------
    */

    const alapAdatok: OsszehasonlitasForm = {

        elso_klub_id: String(
            bevittAdatok?.elso_klub_id ?? ''
        ),

        elso_gyozelmek: String(
            bevittAdatok?.elso_gyozelmek ?? 0
        ),

        elso_dontetlenek: String(
            bevittAdatok?.elso_dontetlenek ?? 0
        ),

        elso_veresegek: String(
            bevittAdatok?.elso_veresegek ?? 0
        ),

        elso_lott_golok: String(
            bevittAdatok?.elso_lott_golok ?? 0
        ),

        elso_kapott_golok: String(
            bevittAdatok?.elso_kapott_golok ?? 0
        ),

        masodik_klub_id: String(
            bevittAdatok?.masodik_klub_id ?? ''
        ),

        masodik_gyozelmek: String(
            bevittAdatok?.masodik_gyozelmek ?? 0
        ),

        masodik_dontetlenek: String(
            bevittAdatok?.masodik_dontetlenek ?? 0
        ),

        masodik_veresegek: String(
            bevittAdatok?.masodik_veresegek ?? 0
        ),

        masodik_lott_golok: String(
            bevittAdatok?.masodik_lott_golok ?? 0
        ),

        masodik_kapott_golok: String(
            bevittAdatok?.masodik_kapott_golok ?? 0
        ),
    };

    const form = useForm<OsszehasonlitasForm>(
        alapAdatok
    );

    /*
    |--------------------------------------------------------------------------
    | AZONOS KLUB ELLENŐRZÉSE
    |--------------------------------------------------------------------------
    */

    const ugyanazAKlub = Boolean(
        form.data.elso_klub_id &&
        form.data.masodik_klub_id &&
        form.data.elso_klub_id ===
            form.data.masodik_klub_id
    );

    /*
    |--------------------------------------------------------------------------
    | ŰRLAP BEKÜLDÉSE
    |--------------------------------------------------------------------------
    */

    function bekuldes(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        if (ugyanazAKlub) {
            return;
        }

        form.post('/csapat-osszehasonlitas', {
            preserveScroll: true,
        });
    }

    return (
        <Nb1Layout>

            <Head title="NB I. | Csapatok összehasonlítása" />

            {/* =====================================
                FEJLÉC
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 to-emerald-950 px-6 py-14">

                <div className="mx-auto max-w-7xl">

                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                        ⚽ NB I. – Két csapat összevetése
                    </p>

                    <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
                        CSAPATOK ÖSSZEHASONLÍTÁSA
                    </h1>

                    <p className="mt-5 max-w-3xl leading-8 text-slate-300">
                        Válassz ki két különböző klubot
                        az NB I. adatbázisából,
                        add meg külön-külön a
                        mérkőzéseredményeiket,
                        majd hasonlítsd össze
                        a teljesítményüket!
                    </p>

                </div>

            </section>

            {/* =====================================
                ŰRLAP
            ===================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* ELLENŐRZÉS: VAN-E KÉT KLUB? */}

                    {klubok.length < 2 ? (

                        <div
                            role="alert"
                            className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-6 text-amber-200"
                        >
                            Az összehasonlításhoz
                            legalább két klub szükséges
                            az adatbázisban.
                        </div>

                    ) : (

                        <form onSubmit={bekuldes}>

                            <div className="grid gap-7 lg:grid-cols-2">

                                {(
                                    ['elso', 'masodik'] as const
                                ).map((oldal, index) => {

                                    const klubKulcs: KlubKulcs =
                                        `${oldal}_klub_id`;

                                    const kivalasztott =
                                        form.data[klubKulcs];

                                    const masikKulcs: KlubKulcs =
                                        oldal === 'elso'
                                            ? 'masodik_klub_id'
                                            : 'elso_klub_id';

                                    return (

                                        <fieldset
                                            key={oldal}
                                            className="min-w-0 rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg sm:p-8"
                                        >

                                            <legend className="px-2 text-xl font-black text-white">
                                                {index + 1}. csapat
                                            </legend>

                                            {/* KLUB KIVÁLASZTÁSA */}

                                            <label
                                                htmlFor={klubKulcs}
                                                className="mb-2 block text-sm font-semibold text-slate-200"
                                            >
                                                Klub kiválasztása *
                                            </label>

                                            <select
                                                id={klubKulcs}
                                                name={klubKulcs}
                                                required
                                                value={kivalasztott}
                                                disabled={form.processing}
                                                onChange={(event) =>
                                                    form.setData(
                                                        klubKulcs,
                                                        event.target.value
                                                    )
                                                }
                                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-400"
                                            >

                                                <option value="">
                                                    Válassz klubot...
                                                </option>

                                                {klubok.map((klub) => (

                                                    <option
                                                        key={klub.id}
                                                        value={String(
                                                            klub.id
                                                        )}
                                                        disabled={
                                                            String(
                                                                klub.id
                                                            ) ===
                                                            form.data[
                                                                masikKulcs
                                                            ]
                                                        }
                                                    >
                                                        {klub.csapatnev}
                                                    </option>

                                                ))}

                                            </select>

                                            {form.errors[klubKulcs] && (

                                                <p
                                                    role="alert"
                                                    className="mt-2 text-sm text-red-400"
                                                >
                                                    {
                                                        form.errors[
                                                            klubKulcs
                                                        ]
                                                    }
                                                </p>

                                            )}

                                            {/* MÉRKŐZÉSADATOK */}

                                            <div className="mt-7 grid gap-5 sm:grid-cols-2">

                                                {mezok.map((mezo) => {

                                                    const mezoKulcs: MezoKulcs =
                                                        `${oldal}_${mezo.key}`;

                                                    return (

                                                        <div
                                                            key={mezoKulcs}
                                                        >

                                                            <label
                                                                htmlFor={
                                                                    mezoKulcs
                                                                }
                                                                className="mb-2 block text-sm font-semibold text-slate-200"
                                                            >
                                                                {mezo.label} *
                                                            </label>

                                                            <input
                                                                id={
                                                                    mezoKulcs
                                                                }
                                                                name={
                                                                    mezoKulcs
                                                                }
                                                                type="number"
                                                                min={0}
                                                                max={
                                                                    mezo.max
                                                                }
                                                                step={1}
                                                                required
                                                                disabled={
                                                                    form.processing
                                                                }
                                                                value={
                                                                    form.data[
                                                                        mezoKulcs
                                                                    ]
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    form.setData(
                                                                        mezoKulcs,
                                                                        event.target.value
                                                                    )
                                                                }
                                                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-400"
                                                            />

                                                            {
                                                                form.errors[
                                                                    mezoKulcs
                                                                ] && (

                                                                <p
                                                                    role="alert"
                                                                    className="mt-2 text-sm text-red-400"
                                                                >
                                                                    {
                                                                        form.errors[
                                                                            mezoKulcs
                                                                        ]
                                                                    }
                                                                </p>

                                                            )}

                                                        </div>

                                                    );
                                                })}

                                            </div>

                                        </fieldset>

                                    );
                                })}

                            </div>

                            {/* AZONOS KLUB HIBA */}

                            {ugyanazAKlub && (

                                <p
                                    role="alert"
                                    className="mt-5 text-center font-semibold text-amber-400"
                                >
                                    A két csapat nem lehet ugyanaz.
                                </p>

                            )}

                            {/* MŰVELETI GOMBOK */}

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">

                                <button
                                    type="submit"
                                    disabled={
                                        form.processing ||
                                        ugyanazAKlub
                                    }
                                    className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {
                                        form.processing
                                            ? 'Feldolgozás...'
                                            : '⚽ Két csapat összehasonlítása'
                                    }
                                </button>

                                <Link
                                    href="/csapatstatisztika"
                                    className="rounded-xl border border-slate-600 px-7 py-4 font-semibold text-slate-300 hover:border-emerald-500 hover:text-white"
                                >
                                    Egy csapat értékelése
                                </Link>

                            </div>

                        </form>

                    )}

                    {/* =====================================
                        SZÁMÍTOTT EREDMÉNYEK
                    ===================================== */}

                    {eredmeny && (

                        <section
                            className="mt-14"
                            aria-labelledby="osszehasonlitas-eredmeny"
                        >

                            <h2
                                id="osszehasonlitas-eredmeny"
                                className="text-center text-3xl font-black text-white"
                            >
                                ÖSSZEHASONLÍTÁS EREDMÉNYE
                            </h2>

                            {/* ÖSSZEFOGLALÓ */}

                            <p
                                className="mt-4 text-center text-slate-300"
                                role="status"
                            >
                                {
                                    eredmeny.jobb === null

                                        ? 'A két csapat teljesítményindexe azonos.'

                                        : `${
                                            eredmeny[
                                                eredmeny.jobb
                                            ].klub_nev
                                        } teljesítményindexe ${
                                            eredmeny.kulonbseg
                                        } ponttal magasabb.`
                                }
                            </p>

                            {/* ELTÉRŐ MÉRKŐZÉSSZÁM */}

                            {!eredmeny.azonos_meccsszam && (

                                <p className="mx-auto mt-5 max-w-3xl rounded-xl border border-amber-500/40 bg-amber-950/30 px-5 py-4 text-center text-sm text-amber-200">
                                    A csapatok eltérő számú
                                    mérkőzést játszottak.
                                    Az eredmények összevetéséhez
                                    érdemes azonos időszakot
                                    használni.
                                </p>

                            )}

                            {/* KÉT CSAPAT KÁRTYÁJA */}

                            <div className="mt-8 grid gap-7 lg:grid-cols-2">

                                <EredmenyKartya
                                    adat={eredmeny.elso}
                                    jobb={
                                        eredmeny.jobb === 'elso'
                                    }
                                />

                                <EredmenyKartya
                                    adat={eredmeny.masodik}
                                    jobb={
                                        eredmeny.jobb === 'masodik'
                                    }
                                />

                            </div>

                            {/* MÓDSZERTAN */}

                            <p className="mt-7 text-center text-sm leading-7 text-slate-400">
                                Az index a megszerzett
                                pontok arányából (70%)
                                és a lőtt gólok részarányából
                                (30%) áll.

                                Ez saját, szemléltető
                                statisztikai mutató,
                                nem hivatalos rangsor
                                és nem mérkőzés-kimenetel
                                előrejelzés.
                            </p>

                        </section>

                    )}

                </div>

            </section>

        </Nb1Layout>
    );
}
