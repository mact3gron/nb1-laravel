import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - CSAPATERŐSSÉG KALKULÁTOR
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| - Futballeredmények megadása
| - Laravel szerveroldali validáció
| - Bajnoki pontok és gólkülönbség
| - Meccsenkénti gólátlag
| - Becsült csapaterősség-index
|
| A számításokat a Laravel végzi.
|
*/

interface BevittAdatok {
    gyozelmek: number;
    dontetlenek: number;
    veresegek: number;
    lott_golok: number;
    kapott_golok: number;
}

interface Eredmeny {
    merkozesek: number;
    pontok: number;
    golkulonbseg: number;
    gol_atlag: number;
    teljesitmenyindex: number;
    ertekeles: string;
}

interface Props {
    eredmeny: Eredmeny | null;
    bevittAdatok: BevittAdatok | null;
}

const mezok = [
    {
        name: 'gyozelmek',
        label: 'Győzelmek',
        description: 'Megnyert mérkőzések',
        max: 1000,
    },
    {
        name: 'dontetlenek',
        label: 'Döntetlenek',
        description: 'Döntetlennel végződő mérkőzések',
        max: 1000,
    },
    {
        name: 'veresegek',
        label: 'Vereségek',
        description: 'Elveszített mérkőzések',
        max: 1000,
    },
    {
        name: 'lott_golok',
        label: 'Lőtt gólok',
        description: 'A csapat által szerzett gólok',
        max: 10000,
    },
    {
        name: 'kapott_golok',
        label: 'Kapott gólok',
        description: 'Az ellenfél által szerzett gólok',
        max: 10000,
    },
] as const;

function golkulonbsegSzoveg(ertek: number): string {
    return ertek > 0 ? `+${ertek}` : String(ertek);
}

export default function CsapatStatisztikaIndex({
    eredmeny,
    bevittAdatok,
}: Props) {

    // Az előző számítás adatait visszatöltjük,
    // ha azok elérhetők a munkamenetben.

    const form = useForm({
        gyozelmek: String(bevittAdatok?.gyozelmek ?? 0),
        dontetlenek: String(bevittAdatok?.dontetlenek ?? 0),
        veresegek: String(bevittAdatok?.veresegek ?? 0),
        lott_golok: String(bevittAdatok?.lott_golok ?? 0),
        kapott_golok: String(bevittAdatok?.kapott_golok ?? 0),
    });

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        form.post('/csapatstatisztika', {
            preserveScroll: true,
        });
    }

    // Az eredményt a Laravel Controller adja vissza.

    const index = eredmeny
        ? Math.min(
            100,
            Math.max(0, eredmeny.teljesitmenyindex)
        )
        : 0;

    return (
        <Nb1Layout>

            <Head title="NB I. | Csapaterősség" />

            {/* ================================
                OLDAL FEJLÉCE
            ================================= */}

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
                            Csapaterősség
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        ⚽ NB I. – Futballstatisztika
                    </span>

                    <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl">
                        CSAPATERŐSSÉG
                        <span className="block text-emerald-400">
                            ÉRTÉKELÉS
                        </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        Add meg egy labdarúgócsapat
                        mérkőzéseredményeit!
                        Az alkalmazás kiszámítja
                        a bajnoki pontszámot,
                        a gólkülönbséget és
                        a becsült teljesítményindexet.
                    </p>

                </div>
            </section>

            {/* ================================
                ŰRLAP ÉS EREDMÉNYEK
            ================================= */}

            <section className="bg-slate-950 px-4 py-14 sm:px-6">

                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-5">

                    {/* BAL OLDAL: ADATBEVITEL */}

                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl sm:p-8 lg:col-span-2">

                        <div className="mb-8">

                            <h2 className="text-2xl font-bold text-white">
                                Mérkőzésstatisztika
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-400">
                                Add meg a vizsgált időszak
                                mérkőzéseinek összesített
                                adatait!
                            </p>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {mezok.map((mezo) => (

                                <div key={mezo.name}>

                                    <label
                                        htmlFor={mezo.name}
                                        className="mb-2 block text-sm font-semibold text-slate-200"
                                    >
                                        {mezo.label} *
                                    </label>

                                    <input
                                        id={mezo.name}
                                        name={mezo.name}
                                        type="number"
                                        min={0}
                                        max={mezo.max}
                                        step={1}
                                        inputMode="numeric"
                                        required
                                        disabled={form.processing}
                                        value={form.data[mezo.name]}
                                        onChange={(event) =>
                                            form.setData(
                                                mezo.name,
                                                event.target.value
                                            )
                                        }
                                        aria-invalid={Boolean(
                                            form.errors[mezo.name]
                                        )}
                                        aria-describedby={
                                            form.errors[mezo.name]
                                                ? `${mezo.name}-error`
                                                : undefined
                                        }
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-lg font-semibold text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
                                    />

                                    <p className="mt-2 text-xs text-slate-500">
                                        {mezo.description}
                                    </p>

                                    {form.errors[mezo.name] && (

                                        <p
                                            id={`${mezo.name}-error`}
                                            role="alert"
                                            className="mt-2 text-sm text-red-400"
                                        >
                                            {form.errors[mezo.name]}
                                        </p>

                                    )}

                                </div>

                            ))}

                            <div className="border-t border-white/10 pt-6">

                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full rounded-xl bg-emerald-600 px-7 py-4 text-lg font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {form.processing
                                        ? 'Statisztika feldolgozása...'
                                        : '⚽ Csapaterősség kiértékelése'}
                                </button>

                                <p className="mt-4 text-center text-xs leading-6 text-slate-500">
                                    Az adatok ellenőrzése
                                    és a számítás a Laravel
                                    szerveren történik.
                                </p>

                            </div>

                        </form>

                    </div>

                    {/* JOBB OLDAL: EREDMÉNY */}

                    <div className="space-y-7 lg:col-span-3">

                        {eredmeny ? (

                            <>
                                {/* FŐ EREDMÉNY */}

                                <div
                                    role="status"
                                    className="rounded-2xl border border-emerald-500/30 bg-slate-900 p-7 shadow-xl sm:p-9"
                                >

                                    <div className="flex flex-wrap items-center justify-between gap-4">

                                        <div>

                                            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                                                Csapat teljesítménye
                                            </p>

                                            <h2 className="mt-3 text-3xl font-black text-white">
                                                {eredmeny.ertekeles}
                                            </h2>

                                        </div>

                                        <div className="text-right">

                                            <p className="text-sm text-slate-400">
                                                Teljesítményindex
                                            </p>

                                            <p className="mt-1 text-4xl font-black text-emerald-400">
                                                {eredmeny.teljesitmenyindex}
                                                <span className="text-xl text-slate-400">
                                                    /100
                                                </span>
                                            </p>

                                        </div>

                                    </div>

                                    {/* INDEX SÁV */}

                                    <div className="mt-8">

                                        <div
                                            role="progressbar"
                                            aria-label="Becsült teljesítményindex"
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                            aria-valuenow={index}
                                            className="h-4 overflow-hidden rounded-full bg-slate-800"
                                        >
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                                style={{
                                                    width: `${index}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-3 flex justify-between text-xs text-slate-500">
                                            <span>0</span>
                                            <span>50</span>
                                            <span>100</span>
                                        </div>

                                    </div>

                                    <p className="mt-6 text-sm leading-7 text-slate-400">
                                        Ez a mutató a megadott
                                        eredmények alapján készült
                                        saját statisztikai értékelés.
                                        Nem hivatalos csapaterősségi
                                        rangsor és nem mérkőzés-előrejelzés.
                                    </p>

                                </div>

                                {/* RÉSZLETES STATISZTIKÁK */}

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                                        <p className="text-sm text-slate-400">
                                            Lejátszott mérkőzések
                                        </p>

                                        <p className="mt-3 text-4xl font-black text-white">
                                            {eredmeny.merkozesek}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                                        <p className="text-sm text-slate-400">
                                            Bajnoki pontok
                                        </p>

                                        <p className="mt-3 text-4xl font-black text-emerald-400">
                                            {eredmeny.pontok}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                                        <p className="text-sm text-slate-400">
                                            Gólkülönbség
                                        </p>

                                        <p className="mt-3 text-4xl font-black text-white">
                                            {golkulonbsegSzoveg(
                                                eredmeny.golkulonbseg
                                            )}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                                        <p className="text-sm text-slate-400">
                                            Lőtt gólok / mérkőzés
                                        </p>

                                        <p className="mt-3 text-4xl font-black text-white">
                                            {eredmeny.gol_atlag.toLocaleString(
                                                'hu-HU',
                                                {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                        </p>

                                    </div>

                                </div>

                                {/* MÓDSZERTAN */}

                                <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                                    <h3 className="text-xl font-bold text-white">
                                        Hogyan értékel a rendszer?
                                    </h3>

                                    <p className="mt-4 text-sm leading-8 text-slate-400">
                                        A becsült teljesítményindex
                                        a megszerezhető bajnoki
                                        pontok arányát 70%-os,
                                        a lőtt és kapott gólok
                                        alapján számított gólarányt
                                        30%-os súllyal veszi figyelembe.
                                    </p>

                                    <p className="mt-3 text-sm leading-8 text-slate-400">
                                        70 ponttól magas,
                                        40 ponttól közepes,
                                        ez alatt alacsony
                                        teljesítménybesorolást ad.
                                    </p>

                                </div>

                            </>

                        ) : (

                            /* MÉG NINCS EREDMÉNY */

                            <div className="rounded-2xl border border-white/10 bg-slate-900 px-7 py-20 text-center shadow-xl">

                                <div className="text-6xl">
                                    📊
                                </div>

                                <h2 className="mt-7 text-2xl font-bold text-white">
                                    Csapatstatisztika
                                </h2>

                                <p className="mx-auto mt-4 max-w-md leading-8 text-slate-400">
                                    Töltsd ki a bal oldali
                                    mérkőzésadatokat, majd kattints
                                    a Csapaterősség kiértékelése
                                    gombra!
                                </p>

                                <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-slate-500">
                                    Itt jelennek meg a bajnoki
                                    pontok, a gólkülönbség,
                                    a gólátlag és a becsült
                                    teljesítményindex.
                                </p>

                            </div>

                        )}

                        {/* INFORMÁCIÓ */}

                        <div className="rounded-2xl border border-white/10 bg-emerald-950/20 p-7">

                            <h3 className="font-bold text-emerald-400">
                                NB I. – Statisztikai elemzés
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-300">
                                Ez a funkció a megadott
                                mérkőzésadatok kiértékelésére
                                szolgál.

                                Nem módosítja a meglévő
                                klubok vagy labdarúgók
                                adatbázisrekordjait.
                            </p>

                        </div>

                    </div>

                </div>

                {/* NAVIGÁCIÓ */}

                <div className="mx-auto mt-12 flex max-w-7xl flex-wrap gap-4">

                    <Link
                        href="/"
                        className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                    >
                        ← Vissza a főoldalra
                    </Link>

                    <Link
                        href="/diagram"
                        className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white transition hover:bg-emerald-500"
                    >
                        NB I. diagram megtekintése →
                    </Link>

                </div>

            </section>

        </Nb1Layout>
    );
}
