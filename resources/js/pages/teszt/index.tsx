import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - AUTOMATIZÁLT TESZTEK
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Valódi PHPUnit / JUnit teszteredmények
| - Unit és Feature tesztek listázása
| - Sikeres, sikertelen, kihagyott tesztek
| - Tesztek szűrése
| - Futási idő megjelenítése
| - Jelentés frissítése
|
| A teszteket nem ez az oldal futtatja.
| A Laravel Controller a valódi JUnit XML
| tesztjelentést olvassa be.
|
*/

// ==========================================
// 1. TYPESCRIPT TÍPUSOK
// ==========================================

type TesztAllapot =
    | 'sikeres'
    | 'sikertelen'
    | 'kihagyott';

type TesztTipus =
    | 'Unit'
    | 'Feature'
    | 'Egyéb';

type TipusSzuro =
    | 'mind'
    | TesztTipus;

type AllapotSzuro =
    | 'mind'
    | TesztAllapot;

interface TesztEset {
    nev: string;
    osztaly: string;
    tipus: TesztTipus;
    allapot: TesztAllapot;
    ido: number;
}

interface Jelentes {
    elerheto: boolean;
    frissitve: string | null;

    osszes: number;
    sikeres: number;
    sikertelen: number;
    kihagyott: number;

    unit: number;
    feature: number;
    egyeb: number;

    futasiIdo: number;

    tesztek: TesztEset[];
    hiba: string | null;
}

interface Props {
    jelentes: Jelentes;
}

// ==========================================
// 2. ÁLLAPOTOK STÍLUSAI
// ==========================================

const allapotSzinek: Record<TesztAllapot, string> = {
    sikeres:
        'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',

    sikertelen:
        'border-red-500/30 bg-red-500/10 text-red-400',

    kihagyott:
        'border-amber-500/30 bg-amber-500/10 text-amber-400',
};

const allapotSzovegek: Record<TesztAllapot, string> = {
    sikeres: 'Sikeres',
    sikertelen: 'Sikertelen',
    kihagyott: 'Kihagyott',
};

// ==========================================
// 3. STATISZTIKAI KÁRTYA
// ==========================================

function StatisztikaKartya({
    cim,
    ertek,
    szin = 'text-white',
}: {
    cim: string;
    ertek: number;
    szin?: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-lg">

            <p className="text-sm font-semibold text-slate-400">
                {cim}
            </p>

            <p
                className={`mt-4 text-4xl font-black ${szin}`}
            >
                {ertek}
            </p>

        </div>
    );
}

// ==========================================
// 4. EGY TESZTES EREDMÉNYSOR
// ==========================================

function TesztSor({
    teszt,
}: {
    teszt: TesztEset;
}) {
    return (
        <article className="rounded-xl border border-white/10 bg-slate-800/50 p-5 transition hover:border-emerald-500/30">

            <div className="flex flex-wrap items-start justify-between gap-4">

                <div className="min-w-0 flex-1">

                    {/* TESZT TÍPUSA */}

                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                        {teszt.tipus} teszt
                    </p>

                    {/* TESZT NEVE */}

                    <h3 className="mt-2 break-words text-base font-bold text-white">
                        {teszt.nev}
                    </h3>

                    {/* TESZTOSZTÁLY */}

                    <p className="mt-2 break-all font-mono text-xs text-slate-400">
                        {teszt.osztaly || 'Ismeretlen tesztosztály'}
                    </p>

                    {/* FUTÁSI IDŐ */}

                    <p className="mt-3 text-xs text-slate-500">
                        Futási idő: {teszt.ido.toFixed(3)} mp
                    </p>

                </div>

                {/* EREDMÉNYJELZÉS */}

                <span
                    className={
                        'inline-flex shrink-0 items-center rounded-full border ' +
                        'px-4 py-2 text-xs font-bold ' +
                        allapotSzinek[teszt.allapot]
                    }
                >
                    {teszt.allapot === 'sikeres'
                        ? '✓ '
                        : teszt.allapot === 'sikertelen'
                            ? '✕ '
                            : '– '}

                    {allapotSzovegek[teszt.allapot]}
                </span>

            </div>

        </article>
    );
}

// ==========================================
// 5. FŐ TESZT OLDAL
// ==========================================

export default function TesztIndex({
    jelentes,
}: Props) {

    // ======================================
    // SZŰRÉSI ÁLLAPOTOK
    // ======================================

    const [tipusSzuro, setTipusSzuro] =
        useState<TipusSzuro>('mind');

    const [allapotSzuro, setAllapotSzuro] =
        useState<AllapotSzuro>('mind');

    // ======================================
    // TESZTEK SZŰRÉSE
    // ======================================

    const szurtTesztek = jelentes.tesztek.filter(
        (teszt) => {

            const tipusMegfelel =
                tipusSzuro === 'mind' ||
                teszt.tipus === tipusSzuro;

            const allapotMegfelel =
                allapotSzuro === 'mind' ||
                teszt.allapot === allapotSzuro;

            return tipusMegfelel && allapotMegfelel;
        }
    );

    // ======================================
    // ÖSSZESÍTETT ÁLLAPOT
    // ======================================

    const mindenSikeres =
        jelentes.elerheto &&
        jelentes.osszes > 0 &&
        jelentes.sikertelen === 0 &&
        jelentes.kihagyott === 0;

    const vanHiba =
        jelentes.elerheto &&
        jelentes.sikertelen > 0;

    // ======================================
    // JELENTÉS FRISSÍTÉSE
    // ======================================
    //
    // Csak újraolvassuk a jelentést.
    // Nem indítunk parancsot a szerveren.
    //
    // A router.reload automatikusan
    // megőrzi a scrollt és a React állapotát.
    //

    function frissites(): void {
        router.reload({
            only: ['jelentes'],
        });
    }

    // ======================================
    // MEGJELENÍTÉS
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Automatizált tesztek" />

            {/* ==================================
                OLDAL FEJLÉCE
            ================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-14">

                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <Link
                            href="/admin"
                            className="hover:text-emerald-400"
                        >
                            Admin
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Tesztek
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        NB I. – PHPUnit
                    </span>

                    <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl">
                        AUTOMATIZÁLT
                        <span className="block text-emerald-400">
                            TESZTEK
                        </span>
                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        A Laravel alkalmazás valódi
                        Unit és Feature tesztjeinek
                        futtatási eredményei.
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                        Az eredmények a szerveren tárolt
                        JUnit XML-jelentésből származnak.
                        Az oldal nem futtat új teszteket.
                    </p>

                </div>

            </section>

            {/* ==================================
                FŐ TARTALOM
            ================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto max-w-7xl space-y-8">

                    {/* ==========================
                        JELENTÉS FEJLÉCE
                    ========================== */}

                    <div className="flex flex-wrap items-center justify-between gap-5">

                        <div>

                            <h2 className="text-2xl font-bold text-white">
                                Tesztjelentés
                            </h2>

                            <p className="mt-2 text-sm text-slate-400">
                                Utolsó jelentés:
                                {' '}
                                {jelentes.frissitve
                                    ? jelentes.frissitve
                                    : 'Még nincs adat'}
                            </p>

                        </div>

                        <button
                            type="button"
                            onClick={frissites}
                            className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 font-bold text-emerald-400 transition hover:bg-emerald-600 hover:text-white"
                        >
                            ↻ Jelentés frissítése
                        </button>

                    </div>

                    {/* ==========================
                        JELENTÉS NEM ELÉRHETŐ
                    ========================== */}

                    {!jelentes.elerheto && (

                        <div
                            role="alert"
                            className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-7"
                        >

                            <h3 className="text-xl font-bold text-amber-300">
                                Nincs elérhető tesztjelentés
                            </h3>

                            <p className="mt-4 leading-7 text-slate-300">
                                {jelentes.hiba ??
                                    'A teszteredmények még nem érhetők el.'}
                            </p>

                            <p className="mt-4 text-sm leading-7 text-slate-400">
                                Futtasd a PHPUnit teszteket
                                a projekt termináljából,
                                és hozd létre a JUnit XML
                                jelentést. Ezután kattints
                                a Jelentés frissítése gombra.
                            </p>

                            <p className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-xs leading-6 text-emerald-300">
                                storage/app/test-results/junit.xml
                            </p>

                        </div>

                    )}

                    {/* ==========================
                        ELÉRHETŐ TESZTJELENTÉS
                    ========================== */}

                    {jelentes.elerheto && (

                        <>

                            {/* ÁLLAPOT ÖSSZEFOGLALÓ */}

                            <div
                                className={
                                    'rounded-2xl border p-6 ' +
                                    (
                                        mindenSikeres
                                            ? 'border-emerald-500/30 bg-emerald-950/20'
                                            : vanHiba
                                                ? 'border-red-500/30 bg-red-950/20'
                                                : 'border-amber-500/30 bg-amber-950/20'
                                    )
                                }
                            >

                                <h3 className="text-xl font-bold text-white">

                                    {mindenSikeres
                                        ? '✓ Minden teszt sikeres'
                                        : vanHiba
                                            ? '✕ Sikertelen tesztek találhatók'
                                            : 'A tesztfutás nem teljesen sikeres'}

                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-300">
                                    Összesen {jelentes.osszes} teszt
                                    szerepel a jelentésben.
                                    {' '}
                                    {jelentes.sikeres} sikeres,
                                    {' '}
                                    {jelentes.sikertelen} sikertelen,
                                    {' '}
                                    {jelentes.kihagyott} kihagyott.
                                </p>

                            </div>

                            {/* ======================
                                STATISZTIKAI KÁRTYÁK
                            ====================== */}

                            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

                                <StatisztikaKartya
                                    cim="Összes teszt"
                                    ertek={jelentes.osszes}
                                />

                                <StatisztikaKartya
                                    cim="Sikeres"
                                    ertek={jelentes.sikeres}
                                    szin="text-emerald-400"
                                />

                                <StatisztikaKartya
                                    cim="Sikertelen"
                                    ertek={jelentes.sikertelen}
                                    szin="text-red-400"
                                />

                                <StatisztikaKartya
                                    cim="Kihagyott"
                                    ertek={jelentes.kihagyott}
                                    szin="text-amber-400"
                                />

                            </div>

                            {/* ======================
                                UNIT ÉS FEATURE
                            ====================== */}

                            <div className="grid gap-5 md:grid-cols-3">

                                <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                                    <h3 className="font-bold text-white">
                                        Unit tesztek
                                    </h3>

                                    <p className="mt-3 text-3xl font-black text-emerald-400">
                                        {jelentes.unit}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        A program egyes
                                        számításainak és
                                        metódusainak ellenőrzése.
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                                    <h3 className="font-bold text-white">
                                        Feature tesztek
                                    </h3>

                                    <p className="mt-3 text-3xl font-black text-emerald-400">
                                        {jelentes.feature}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        Laravel HTTP-kérések,
                                        Controller működés
                                        és validáció ellenőrzése.
                                    </p>

                                </div>

                                <div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

                                    <h3 className="font-bold text-white">
                                        Összesített futási idő
                                    </h3>

                                    <p className="mt-3 text-3xl font-black text-emerald-400">
                                        {jelentes.futasiIdo.toFixed(3)}
                                        <span className="ml-2 text-base text-slate-400">
                                            mp
                                        </span>
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        A jelentésben szereplő
                                        tesztesetek futási
                                        idejének összege.
                                    </p>

                                </div>

                            </div>

                            {/* ======================
                                TESZTEK SZŰRÉSE
                            ====================== */}

                            <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                                <div className="mb-7">

                                    <h3 className="text-2xl font-bold text-white">
                                        Részletes teszteredmények
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        A teszteket típus
                                        és eredmény szerint
                                        szűrheted.
                                    </p>

                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">

                                    {/* TÍPUS SZŰRŐ */}

                                    <div>

                                        <label
                                            htmlFor="teszt-tipus"
                                            className="mb-2 block text-sm font-semibold text-slate-200"
                                        >
                                            Teszt típusa
                                        </label>

                                        <select
                                            id="teszt-tipus"
                                            value={tipusSzuro}
                                            onChange={(event) =>
                                                setTipusSzuro(
                                                    event.target.value as TipusSzuro
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                        >
                                            <option value="mind">
                                                Összes típus
                                            </option>

                                            <option value="Unit">
                                                Unit
                                            </option>

                                            <option value="Feature">
                                                Feature
                                            </option>

                                            <option value="Egyéb">
                                                Egyéb
                                            </option>
                                        </select>

                                    </div>

                                    {/* ÁLLAPOT SZŰRŐ */}

                                    <div>

                                        <label
                                            htmlFor="teszt-allapot"
                                            className="mb-2 block text-sm font-semibold text-slate-200"
                                        >
                                            Teszt eredménye
                                        </label>

                                        <select
                                            id="teszt-allapot"
                                            value={allapotSzuro}
                                            onChange={(event) =>
                                                setAllapotSzuro(
                                                    event.target.value as AllapotSzuro
                                                )
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                        >
                                            <option value="mind">
                                                Összes eredmény
                                            </option>

                                            <option value="sikeres">
                                                Sikeres
                                            </option>

                                            <option value="sikertelen">
                                                Sikertelen
                                            </option>

                                            <option value="kihagyott">
                                                Kihagyott
                                            </option>
                                        </select>

                                    </div>

                                </div>

                                {/* TALÁLATOK SZÁMA */}

                                <p className="mt-6 text-sm text-slate-400">
                                    Megjelenített tesztek:
                                    {' '}
                                    <strong className="text-emerald-400">
                                        {szurtTesztek.length}
                                    </strong>
                                    {' / '}
                                    {jelentes.osszes}
                                </p>

                                {/* TESZT LISTA */}

                                <div className="mt-6 space-y-4">

                                    {szurtTesztek.length > 0 ? (

                                        szurtTesztek.map((teszt, index) => (

                                            <TesztSor
                                                key={
                                                    teszt.osztaly +
                                                    '-' +
                                                    teszt.nev +
                                                    '-' +
                                                    index
                                                }
                                                teszt={teszt}
                                            />

                                        ))

                                    ) : (

                                        <div className="rounded-xl border border-white/10 bg-slate-800/50 p-8 text-center">

                                            <p className="font-semibold text-slate-300">
                                                Nincs a szűrésnek
                                                megfelelő teszt.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTipusSzuro('mind');
                                                    setAllapotSzuro('mind');
                                                }}
                                                className="mt-4 text-sm font-bold text-emerald-400 hover:text-emerald-300"
                                            >
                                                Szűrők visszaállítása
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </>

                    )}

                    {/* ==========================
                        INFORMÁCIÓ
                    ========================== */}

                    <div className="rounded-2xl border border-white/10 bg-emerald-950/20 p-7">

                        <h3 className="text-lg font-bold text-emerald-400">
                            Hogyan működik a tesztelés?
                        </h3>

                        <p className="mt-4 text-sm leading-8 text-slate-300">
                            A Unit tesztek a csapatstatisztika
                            számításait ellenőrzik.
                            A Feature tesztek a Laravel
                            webes funkcióit és a szerveroldali
                            adatellenőrzést vizsgálják.
                        </p>

                        <p className="mt-3 text-sm leading-8 text-slate-400">
                            A teszteket a PHPUnit futtatja.
                            Az eredmények JUnit XML-formátumban
                            kerülnek mentésre, amelyet
                            a Laravel beolvas és ezen
                            az oldalon megjelenít.
                        </p>

                        <p className="mt-3 text-sm leading-8 text-slate-400">
                            A Jelentés frissítése gomb
                            kizárólag az utolsó mentett
                            jelentést olvassa újra.
                            Új tesztfutást nem indít.
                        </p>

                    </div>

                    {/* ==========================
                        NAVIGÁCIÓ
                    ========================== */}

                    <div className="flex flex-wrap gap-4">

                        <Link
                            href="/admin"
                            className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                        >
                            ← Vissza az adminpanelhez
                        </Link>

                        <Link
                            href="/csapatstatisztika"
                            className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white transition hover:bg-emerald-500"
                        >
                            ⚽ Csapaterősség
                        </Link>

                    </div>

                </div>

            </section>

        </Nb1Layout>
    );
}
