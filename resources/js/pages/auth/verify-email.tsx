
import { Head, useForm } from '@inertiajs/react';

import {
    CheckCircle2,
    LoaderCircle,
    LogOut,
    Mail,
    MailCheck,
    Send,
    ShieldCheck,
} from 'lucide-react';

import type { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';

import AuthLayout from '@/layouts/auth-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - E-MAIL MEGERŐSÍTÉSE
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Regisztrált e-mail-cím megerősítése
| - Megerősítő hivatkozás újraküldése
| - Laravel verification.send útvonal
| - Sikeres újraküldés visszajelzése
| - Feldolgozási állapot
| - Kijelentkezés
| - Modern, reszponzív NB I. dizájn
|
| A Laravel e-mail-verifikációs működését
| nem módosítjuk.
|
*/

// ==========================================
// 1. OLDAL TULAJDONSÁGAI
// ==========================================

interface VerifyEmailProps {
    status?: string;
}

// ==========================================
// 2. FŐ KOMPONENS
// ==========================================

export default function VerifyEmail({
    status,
}: VerifyEmailProps) {

    // ======================================
    // INERTIA ŰRLAP
    // ======================================

    const {
        post,
        processing,
    } = useForm({});

    // ======================================
    // MEGERŐSÍTŐ E-MAIL ÚJRAKÜLDÉSE
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    // ======================================
    // SIKERES ÚJRAKÜLDÉS ÁLLAPOTA
    // ======================================

    const emailElkuldve =
        status === 'verification-link-sent';

    // ======================================
    // OLDAL MEGJELENÍTÉSE
    // ======================================

    return (
        <AuthLayout
            title="E-mail-cím megerősítése"
            description="Erősítsd meg az e-mail-címedet az NB I. felhasználói fiókod aktiválásához."
        >

            <Head title="NB I. | E-mail megerősítése" />

            {/* ==================================
                E-MAIL-MEGERŐSÍTÉSI INFORMÁCIÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">

                        <MailCheck
                            aria-hidden="true"
                            className="h-6 w-6 text-emerald-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-emerald-300">
                            Már csak egy lépés!
                        </h2>

                        <p className="mt-2 text-sm leading-7 text-slate-300">
                            A regisztráció után
                            e-mail-címed megerősítése
                            szükséges a fiókod
                            ellenőrzéséhez.
                        </p>

                        <p className="mt-3 text-xs leading-6 text-slate-400">
                            Nyisd meg a regisztrációkor
                            megadott e-mail-fiókodat,
                            és kattints az elküldött
                            megerősítő hivatkozásra.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                SIKERES ÚJRAKÜLDÉS
            ================================== */}

            {emailElkuldve && (

                <div
                    role="status"
                    aria-live="polite"
                    className="mb-7 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5"
                >

                    <div className="flex items-start gap-3">

                        <CheckCircle2
                            aria-hidden="true"
                            className="mt-0.5 h-6 w-6 shrink-0 text-emerald-400"
                        />

                        <div>

                            <h3 className="text-sm font-bold text-emerald-300">
                                Megerősítő e-mail elküldve
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-slate-200">
                                Új megerősítő hivatkozást
                                küldtünk a regisztrációkor
                                megadott e-mail-címedre.
                            </p>

                            <p className="mt-3 text-xs leading-6 text-slate-400">
                                Ellenőrizd a beérkezett
                                leveleidet és szükség
                                esetén a levélszemét
                                mappát is.
                            </p>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================
                E-MAIL-MEGERŐSÍTÉSI ÚTMUTATÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-white/10 bg-slate-950/40 p-5">

                <h3 className="mb-5 text-sm font-bold text-white">
                    Hogyan erősítheted meg az e-mail-címedet?
                </h3>

                <div className="space-y-5">

                    {/* ELSŐ LÉPÉS */}

                    <div className="flex items-start gap-4">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-black text-emerald-400">
                            1
                        </span>

                        <div>

                            <p className="text-sm font-semibold text-slate-200">
                                Nyisd meg az e-mail-fiókodat
                            </p>

                            <p className="mt-1 text-xs leading-6 text-slate-400">
                                Keresd meg az NB I.
                                alkalmazástól érkezett
                                megerősítő levelet.
                            </p>

                        </div>

                    </div>

                    {/* MÁSODIK LÉPÉS */}

                    <div className="flex items-start gap-4">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-black text-emerald-400">
                            2
                        </span>

                        <div>

                            <p className="text-sm font-semibold text-slate-200">
                                Kattints a hivatkozásra
                            </p>

                            <p className="mt-1 text-xs leading-6 text-slate-400">
                                A levélben található
                                megerősítő link segítségével
                                ellenőrizheted az
                                e-mail-címedet.
                            </p>

                        </div>

                    </div>

                    {/* HARMADIK LÉPÉS */}

                    <div className="flex items-start gap-4">

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm font-black text-emerald-400">
                            3
                        </span>

                        <div>

                            <p className="text-sm font-semibold text-slate-200">
                                Folytasd az oldal használatát
                            </p>

                            <p className="mt-1 text-xs leading-6 text-slate-400">
                                Sikeres megerősítés után
                                elérheted az e-mail-ellenőrzést
                                igénylő funkciókat is.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================
                ÚJRAKÜLDÉSI ŰRLAP
            ================================== */}

            <form
                onSubmit={submit}
                className="flex flex-col gap-6"
            >

                {/* ==================================
                    SEGÍTŐ INFORMÁCIÓ
                ================================== */}

                <div className="rounded-xl border border-white/10 bg-slate-900/50 px-5 py-4">

                    <div className="flex items-start gap-3">

                        <Mail
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                        />

                        <p className="text-xs leading-6 text-slate-400">
                            Nem érkezett meg a levél?
                            Az alábbi gombbal kérhetsz
                            új e-mail-megerősítő
                            hivatkozást.
                        </p>

                    </div>

                </div>

                {/* ==================================
                    MEGERŐSÍTŐ LINK ÚJRAKÜLDÉSE
                ================================== */}

                <Button
                    type="submit"
                    tabIndex={1}
                    disabled={processing}
                    className="
                        h-12
                        w-full
                        rounded-xl
                        bg-emerald-600
                        px-6
                        text-base
                        font-bold
                        text-white
                        shadow-lg
                        shadow-emerald-950/40
                        transition
                        hover:bg-emerald-500
                        focus-visible:ring-emerald-400
                        disabled:cursor-not-allowed
                    "
                >

                    {processing ? (

                        <>
                            <LoaderCircle
                                aria-hidden="true"
                                className="h-5 w-5 animate-spin"
                            />

                            E-mail küldése folyamatban...
                        </>

                    ) : (

                        <>
                            <Send
                                aria-hidden="true"
                                className="h-5 w-5"
                            />

                            Megerősítő e-mail újraküldése
                        </>

                    )}

                </Button>

                {/* ==================================
                    KIJELENTKEZÉS
                ================================== */}

                <div className="border-t border-white/10 pt-6">

                    <p className="mb-4 text-center text-sm text-slate-400">
                        Most nem szeretnéd megerősíteni
                        az e-mail-címedet?
                    </p>

                    <TextLink
                        href={route('logout')}
                        method="post"
                        tabIndex={2}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/5
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-red-300
                            no-underline
                            transition
                            hover:border-red-400
                            hover:bg-red-500/10
                            hover:text-red-200
                        "
                    >

                        <LogOut
                            aria-hidden="true"
                            className="h-4 w-4"
                        />

                        Kijelentkezés

                    </TextLink>

                </div>

            </form>

            {/* ==================================
                BIZTONSÁGI INFORMÁCIÓ
            ================================== */}

            <div className="mt-7 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-4">

                <div className="flex items-start gap-3">

                    <ShieldCheck
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                    />

                    <p className="text-xs leading-6 text-slate-400">
                        Az e-mail-cím megerősítését
                        a Laravel hitelesítési
                        rendszere kezeli.
                        A megerősítő hivatkozás
                        érvényességét a szerver
                        ellenőrzi.
                    </p>

                </div>

            </div>

            {/* ==================================
                OLDAL ALSÓ INFORMÁCIÓ
            ================================== */}

            <div className="mt-7 text-center">

                <p className="text-xs leading-6 text-slate-500">
                    NB I. Labdarúgás

                    <span className="mx-2 text-emerald-500">
                        •
                    </span>

                    Laravel + React + TypeScript
                </p>

            </div>

        </AuthLayout>
    );
}
