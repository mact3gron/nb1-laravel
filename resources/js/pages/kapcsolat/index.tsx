import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';

import Nb1Layout from '../../layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. - KAPCSOLAT OLDAL
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Kapcsolatfelvételi űrlap
| - Név, e-mail, tárgy, üzenet
| - Laravel szerveroldali validáció
| - Validációs hibák megjelenítése
| - Sikeres beküldés visszajelzése
| - MySQL-adatbázisba mentés a Controlleren keresztül
| - Reszponzív megjelenítés
|
*/

export default function KapcsolatIndex() {

    // Inertia űrlapkezelés
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
    } = useForm({
        nev: '',
        email: '',
        targy: '',
        uzenet: '',
    });

    // Üzenet beküldése
    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ): void {

        event.preventDefault();

        post('/kapcsolat', {
            preserveScroll: true,

            onSuccess: () => {
                reset();
            },
        });
    }

    return (
        <Nb1Layout>

            <Head title="NB I. | Kapcsolat" />

            {/* =====================================
                OLDAL FEJLÉCE
            ===================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-16">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Kapcsolat
                        </span>

                    </div>

                    <span className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Lépj kapcsolatba velünk
                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        KAPCSOLAT

                        <span className="ml-3 text-emerald-400">
                            FELVÉTEL
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                        Kérdésed vagy észrevételed van
                        az NB I. labdarúgás weboldallal
                        kapcsolatban?

                        Küldj nekünk üzenetet
                        az alábbi űrlapon!
                    </p>

                </div>
            </section>

            {/* =====================================
                FŐ TARTALOM
            ===================================== */}

            <section className="bg-slate-950 px-4 py-14 sm:px-6">

                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3">

                    {/* BAL OLDALI INFORMÁCIÓK */}

                    <aside className="lg:col-span-1">

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 shadow-xl">

                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-4xl">
                                ⚽
                            </div>

                            <h2 className="text-2xl font-bold text-white">
                                NB I. Labdarúgás
                            </h2>

                            <p className="mt-4 leading-7 text-slate-400">
                                A magyar labdarúgó-bajnokság
                                klubjainak és játékosainak
                                adatbázisa.
                            </p>

                            <div className="mt-8 border-t border-white/10 pt-6">

                                <h3 className="font-semibold text-emerald-400">
                                    Üzenetküldés
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Töltsd ki a kapcsolatfelvételi
                                    űrlapot!

                                    A beküldött üzenetet
                                    eltároljuk az alkalmazás
                                    adatbázisában.
                                </p>

                            </div>

                            <div className="mt-8 border-t border-white/10 pt-6">

                                <h3 className="font-semibold text-emerald-400">
                                    Projekt
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    Neumann János Egyetem – GAMF
                                    <br />
                                    Webprogramozás II.
                                    <br />
                                    Előadás beadandó
                                </p>

                            </div>

                        </div>

                    </aside>

                    {/* =====================================
                        KAPCSOLATFELVÉTELI ŰRLAP
                    ===================================== */}

                    <div className="lg:col-span-2">

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-xl sm:p-9">

                            <div className="mb-8">

                                <h2 className="text-2xl font-bold text-white">
                                    Üzenet küldése
                                </h2>

                                <p className="mt-3 text-sm leading-7 text-slate-400">
                                    A csillaggal jelölt mezők
                                    kitöltése kötelező.
                                </p>

                            </div>

                            {/* SIKERES ÜZENETKÜLDÉS */}

                            {recentlySuccessful && (

                                <div
                                    role="status"
                                    className="mb-7 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-emerald-300"
                                >
                                    <p className="font-bold">
                                        ✓ Sikeres üzenetküldés!
                                    </p>

                                    <p className="mt-2 text-sm">
                                        Az üzenetedet elmentettük.
                                        Köszönjük a megkeresést!
                                    </p>
                                </div>

                            )}

                            {/* ŰRLAP */}

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >

                                {/* NÉV ÉS E-MAIL */}

                                <div className="grid gap-6 md:grid-cols-2">

                                    {/* NÉV */}

                                    <div>

                                        <label
                                            htmlFor="nev"
                                            className="mb-2 block text-sm font-semibold text-slate-200"
                                        >
                                            Teljes név *
                                        </label>

                                        <input
                                            id="nev"
                                            type="text"
                                            value={data.nev}
                                            onChange={(event) =>
                                                setData('nev', event.target.value)
                                            }
                                            placeholder="Add meg a neved"
                                            minLength={2}
                                            maxLength={100}
                                            required
                                            autoComplete="name"
                                            aria-invalid={Boolean(errors.nev)}
                                            aria-describedby={
                                                errors.nev
                                                    ? 'nev-error'
                                                    : undefined
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />

                                        {errors.nev && (

                                            <p
                                                id="nev-error"
                                                className="mt-2 text-sm text-red-400"
                                            >
                                                {errors.nev}
                                            </p>

                                        )}

                                    </div>

                                    {/* E-MAIL */}

                                    <div>

                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-semibold text-slate-200"
                                        >
                                            E-mail-cím *
                                        </label>

                                        <input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData('email', event.target.value)
                                            }
                                            placeholder="pelda@email.hu"
                                            maxLength={255}
                                            required
                                            autoComplete="email"
                                            aria-invalid={Boolean(errors.email)}
                                            aria-describedby={
                                                errors.email
                                                    ? 'email-error'
                                                    : undefined
                                            }
                                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                        />

                                        {errors.email && (

                                            <p
                                                id="email-error"
                                                className="mt-2 text-sm text-red-400"
                                            >
                                                {errors.email}
                                            </p>

                                        )}

                                    </div>

                                </div>

                                {/* TÁRGY */}

                                <div>

                                    <label
                                        htmlFor="targy"
                                        className="mb-2 block text-sm font-semibold text-slate-200"
                                    >
                                        Üzenet tárgya *
                                    </label>

                                    <input
                                        id="targy"
                                        type="text"
                                        value={data.targy}
                                        onChange={(event) =>
                                            setData('targy', event.target.value)
                                        }
                                        placeholder="Miről szeretnél írni?"
                                        minLength={3}
                                        maxLength={150}
                                        required
                                        aria-invalid={Boolean(errors.targy)}
                                        aria-describedby={
                                            errors.targy
                                                ? 'targy-error'
                                                : undefined
                                        }
                                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />

                                    {errors.targy && (

                                        <p
                                            id="targy-error"
                                            className="mt-2 text-sm text-red-400"
                                        >
                                            {errors.targy}
                                        </p>

                                    )}

                                </div>

                                {/* ÜZENET */}

                                <div>

                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">

                                        <label
                                            htmlFor="uzenet"
                                            className="text-sm font-semibold text-slate-200"
                                        >
                                            Üzenet *
                                        </label>

                                        <span className="text-xs text-slate-500">
                                            {data.uzenet.length} / 5000 karakter
                                        </span>

                                    </div>

                                    <textarea
                                        id="uzenet"
                                        rows={8}
                                        value={data.uzenet}
                                        onChange={(event) =>
                                            setData('uzenet', event.target.value)
                                        }
                                        placeholder="Írd ide az üzeneted..."
                                        minLength={10}
                                        maxLength={5000}
                                        required
                                        aria-invalid={Boolean(errors.uzenet)}
                                        aria-describedby={
                                            errors.uzenet
                                                ? 'uzenet-error'
                                                : undefined
                                        }
                                        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                    />

                                    {errors.uzenet && (

                                        <p
                                            id="uzenet-error"
                                            className="mt-2 text-sm text-red-400"
                                        >
                                            {errors.uzenet}
                                        </p>

                                    )}

                                    <p className="mt-2 text-xs text-slate-500">
                                        Az üzenet legalább 10,
                                        legfeljebb 5000 karakter
                                        hosszúságú lehet.
                                    </p>

                                </div>

                                {/* KÜLDÉS */}

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-7">

                                    <p className="text-sm text-slate-400">
                                        Az üzenetedet az NB I.
                                        adatbázisába mentjük.
                                    </p>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Üzenet küldése...'
                                            : '✉ Üzenet elküldése'}
                                    </button>

                                </div>

                            </form>

                        </div>

                        {/* VISSZA A FŐOLDALRA */}

                        <div className="mt-8 text-center">

                            <Link
                                href="/"
                                className="inline-block rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                            >
                                ← Vissza a főoldalra
                            </Link>

                        </div>

                    </div>

                </div>
            </section>

        </Nb1Layout>
    );
}
