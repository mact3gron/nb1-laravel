import { Head, Link } from '@inertiajs/react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import type {
    ChartData,
    ChartOptions,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - DIAGRAM OLDAL
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Chart.js:
| - Klubonkénti játékosszám
| - Valódi MySQL-adatok
| - Interaktív oszlopdiagram
| - Reszponzív megjelenítés
|
*/

// ==========================================
// CHART.JS KOMPONENSEK REGISZTRÁLÁSA
// ==========================================

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// ==========================================
// TÍPUSDEFINÍCIÓK
// ==========================================

interface DiagramAdat {
    klub: string;
    jatekosok: number;
}

interface Props {
    diagramAdatok: DiagramAdat[];
}

// ==========================================
// DIAGRAM OLDAL
// ==========================================

export default function DiagramIndex({
    diagramAdatok,
}: Props) {

    // --------------------------------------
    // ADATOK ELŐKÉSZÍTÉSE
    // --------------------------------------

    const klubNevek = diagramAdatok.map(
        (adat) => adat.klub
    );

    const jatekosSzamok = diagramAdatok.map(
        (adat) => adat.jatekosok
    );

    // --------------------------------------
    // ÖSSZESÍTÉSEK
    // --------------------------------------

    const klubokSzama = diagramAdatok.length;

    const osszesJatekos = jatekosSzamok.reduce(
        (osszeg, darab) => osszeg + darab,
        0
    );

    const legtobbJatekos = jatekosSzamok.length > 0
        ? Math.max(...jatekosSzamok)
        : 0;

    const vanAdat = klubokSzama > 0;

    // --------------------------------------
    // CHART.JS ADATOK
    // --------------------------------------

    const chartData: ChartData<'bar'> = {

        labels: klubNevek,

        datasets: [
            {
                label: 'Labdarúgók száma',

                data: jatekosSzamok,

                backgroundColor: diagramAdatok.map(
                    (_, index) =>
                        index % 2 === 0
                            ? 'rgba(16, 185, 129, 0.85)'
                            : 'rgba(20, 184, 166, 0.85)'
                ),

                hoverBackgroundColor:
                    'rgba(52, 211, 153, 1)',

                borderColor:
                    'rgba(110, 231, 183, 1)',

                borderWidth: 1,

                borderRadius: 8,

                borderSkipped: false,

                maxBarThickness: 54,
            },
        ],
    };

    // --------------------------------------
    // CHART.JS BEÁLLÍTÁSOK
    // --------------------------------------

    const chartOptions: ChartOptions<'bar'> = {

        responsive: true,

        maintainAspectRatio: false,

        animation: {
            duration: 800,
        },

        interaction: {
            mode: 'index',
            intersect: false,
        },

        plugins: {

            legend: {
                display: true,

                labels: {
                    color: '#e2e8f0',
                    font: {
                        size: 13,
                    },
                },
            },

            tooltip: {
                enabled: true,

                backgroundColor: '#020617',

                titleColor: '#6ee7b7',

                bodyColor: '#ffffff',

                borderColor: '#065f46',

                borderWidth: 1,

                padding: 12,
            },

            title: {
                display: false,
            },
        },

        scales: {

            x: {
                grid: {
                    display: false,
                },

                ticks: {
                    color: '#cbd5e1',
                    minRotation: 20,
                    maxRotation: 55,
                    font: {
                        size: 12,
                    },
                },
            },

            y: {
                beginAtZero: true,

                ticks: {
                    color: '#cbd5e1',
                    precision: 0,
                    stepSize: 1,
                },

                grid: {
                    color: 'rgba(148, 163, 184, 0.12)',
                },

                title: {
                    display: true,
                    text: 'Labdarúgók száma',
                    color: '#cbd5e1',
                },
            },
        },
    };

    // ======================================
    // MEGJELENÍTÉS
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Diagram" />

            {/* FEJLÉC */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Diagram
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                        NB I. Statisztikák
                    </span>

                    <h1 className="mt-6 text-4xl font-black text-white sm:text-5xl">

                        NB I.

                        <span className="ml-3 text-emerald-400">
                            DIAGRAM
                        </span>

                    </h1>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        A magyar első osztályú
                        labdarúgó-bajnokság klubjainak
                        játékoslétszáma interaktív
                        diagramon, az adatbázis
                        aktuális adatai alapján.
                    </p>

                </div>

            </section>

            {/* FŐ TARTALOM */}

            <section className="bg-slate-950 px-4 py-14 sm:px-6">

                <div className="mx-auto max-w-7xl">

                    {/* ÖSSZESÍTŐ KÁRTYÁK */}

                    <div className="grid gap-6 md:grid-cols-3">

                        {/* KLUBOK */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                            <div className="mb-5 text-4xl">
                                🏆
                            </div>

                            <p className="text-sm font-semibold text-slate-400">
                                Klubok száma
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {klubokSzama}
                            </p>

                        </div>

                        {/* JÁTÉKOSOK */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                            <div className="mb-5 text-4xl">
                                ⚽
                            </div>

                            <p className="text-sm font-semibold text-slate-400">
                                Labdarúgók száma
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {osszesJatekos}
                            </p>

                        </div>

                        {/* MAXIMUM */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-7">

                            <div className="mb-5 text-4xl">
                                📊
                            </div>

                            <p className="text-sm font-semibold text-slate-400">
                                Legnagyobb játékoskeret
                            </p>

                            <p className="mt-3 text-4xl font-black text-emerald-400">
                                {legtobbJatekos}
                            </p>

                        </div>

                    </div>

                    {/* DIAGRAM KÁRTYA */}

                    <div className="mt-10 rounded-2xl border border-emerald-500/20 bg-slate-900 p-5 shadow-xl sm:p-8">

                        <div className="mb-8">

                            <h2 className="text-2xl font-bold text-white">
                                Labdarúgók száma klubonként
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-slate-400">
                                Az oszlopdiagram a MySQL
                                adatbázisban szereplő klubokhoz
                                tartozó játékosok számát
                                mutatja.

                                Az egyes oszlopokra mutatva
                                megtekinthető a pontos érték.
                            </p>

                        </div>

                        {/* DIAGRAM */}

                        {vanAdat ? (

                            <div className="overflow-x-auto">

                                <div className="h-[470px] min-w-[760px]">

                                    <Bar
                                        data={chartData}
                                        options={chartOptions}
                                    />

                                </div>

                            </div>

                        ) : (

                            <div className="rounded-xl border border-white/10 bg-slate-800 p-12 text-center">

                                <p className="text-3xl">
                                    📊
                                </p>

                                <h3 className="mt-5 text-xl font-bold text-white">
                                    Nincsenek diagramadatok
                                </h3>

                                <p className="mt-3 text-slate-400">
                                    Jelenleg nem találhatók
                                    megjeleníthető klubok
                                    az adatbázisban.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* MAGYARÁZAT */}

                    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-7">

                        <h2 className="text-xl font-bold text-white">
                            A diagram adatforrása
                        </h2>

                        <p className="mt-4 leading-8 text-slate-400">
                            A kimutatás a
                            <strong className="mx-1 text-emerald-400">
                                klub
                            </strong>
                            és a
                            <strong className="mx-1 text-emerald-400">
                                labdarugo
                            </strong>
                            adatbázistáblákból készül.

                            A Laravel Eloquent ORM
                            összesíti a játékosokat
                            klubazonosító alapján,
                            majd az eredményt átadja
                            a React + Chart.js
                            megjelenítőnek.
                        </p>

                    </div>

                    {/* NAVIGÁCIÓ */}

                    <div className="mt-10 flex flex-wrap gap-4">

                        <Link
                            href="/"
                            className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                        >
                            ← Vissza a főoldalra
                        </Link>

                        <Link
                            href="/klubok"
                            className="rounded-xl bg-emerald-600 px-7 py-3 font-semibold text-white transition hover:bg-emerald-500"
                        >
                            Klubok megtekintése →
                        </Link>

                    </div>

                </div>

            </section>

        </Nb1Layout>
    );
}