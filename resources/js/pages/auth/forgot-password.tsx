import { Head, useForm } from '@inertiajs/react';

import {
    ArrowLeft,
    CheckCircle2,
    LoaderCircle,
    Mail,
    Send,
    ShieldCheck,
} from 'lucide-react';

import type { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '@/layouts/auth-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - ELFELEJTETT JELSZÓ
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Jelszó-visszaállító e-mail igénylése
| - Laravel password.email útvonal
| - Szerveroldali validáció
| - Hibaüzenetek
| - Sikeres művelet visszajelzése
| - Feldolgozási állapot
| - Visszalépés a bejelentkezéshez
| - Modern, reszponzív NB I. megjelenés
|
| A Laravel autentikációs folyamatát
| nem módosítjuk.
|
*/

// ==========================================
// 1. ŰRLAP ADATAI
// ==========================================

type ForgotPasswordForm = {
    email: string;
};

// ==========================================
// 2. OLDAL TULAJDONSÁGAI
// ==========================================

interface ForgotPasswordProps {
    status?: string;
}

// ==========================================
// 3. FŐ KOMPONENS
// ==========================================

export default function ForgotPassword({
    status,
}: ForgotPasswordProps) {

    // ======================================
    // INERTIA FORM
    // ======================================

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm<ForgotPasswordForm>({
        email: '',
    });

    // ======================================
    // JELSZÓ-VISSZAÁLLÍTÓ LINK KÉRÉSE
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    // ======================================
    // MEGJELENÍTÉS
    // ======================================

    return (
        <AuthLayout
            title="Elfelejtett jelszó"
            description="Segítünk visszaállítani a felhasználói fiókod jelszavát."
        >

            <Head title="NB I. | Elfelejtett jelszó" />

            {/* ==================================
                INFORMÁCIÓS KÁRTYA
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                        <ShieldCheck
                            aria-hidden="true"
                            className="h-6 w-6 text-emerald-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-emerald-300">
                            Jelszó-visszaállítás
                        </h2>

                        <p className="mt-2 text-xs leading-6 text-slate-400">
                            Elfelejtetted a jelszavadat?
                            Add meg a regisztrációkor használt
                            e-mail-címedet, és kérhetsz
                            egy jelszó-visszaállító hivatkozást.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                SIKERES MŰVELET VISSZAJELZÉSE
            ================================== */}

            {status && (

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
                                A kérés feldolgozva
                            </h3>

                            <p className="mt-2 text-sm leading-7 text-slate-200">
                                {status}
                            </p>

                            <p className="mt-3 text-xs leading-6 text-slate-400">
                                Ha nem találod az üzenetet,
                                ellenőrizd a levélszemét
                                mappát is.
                            </p>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================
                JELSZÓ-VISSZAÁLLÍTÁSI ŰRLAP
            ================================== */}

            <form
                onSubmit={submit}
                className="flex flex-col gap-6"
            >

                {/* ==================================
                    E-MAIL-CÍM MEZŐ
                ================================== */}

                <div className="grid gap-2">

                    <Label
                        htmlFor="email"
                        className="font-semibold text-slate-200"
                    >
                        Regisztrált e-mail-cím
                    </Label>

                    <div className="relative">

                        {/* E-MAIL IKON */}

                        <Mail
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                        />

                        {/* E-MAIL BEVITEL */}

                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) =>
                                setData(
                                    'email',
                                    e.target.value
                                )
                            }
                            disabled={processing}
                            placeholder="pelda@email.hu"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={
                                errors.email
                                    ? 'forgot-email-error'
                                    : 'forgot-email-help'
                            }
                            className="
                                h-12
                                w-full
                                rounded-xl
                                border-white/15
                                bg-slate-950/70
                                pl-12
                                pr-4
                                text-base
                                text-white
                                shadow-inner
                                placeholder:text-slate-500
                                focus-visible:border-emerald-500
                                focus-visible:ring-emerald-500/30
                            "
                        />

                    </div>

                    {/* LARAVEL HIBAÜZENET */}

                    <InputError
                        id="forgot-email-error"
                        message={errors.email}
                    />

                    {/* SEGÍTŐ SZÖVEG */}

                    <p
                        id="forgot-email-help"
                        className="mt-1 text-xs leading-6 text-slate-500"
                    >
                        A jelszó-visszaállító linket
                        erre az e-mail-címre kérheted.
                    </p>

                </div>

                {/* ==================================
                    LINKKÉRŐ GOMB
                ================================== */}

                <Button
                    type="submit"
                    tabIndex={2}
                    disabled={processing}
                    className="
                        mt-1
                        h-13
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

                            Kérés feldolgozása...
                        </>

                    ) : (

                        <>
                            <Send
                                aria-hidden="true"
                                className="h-5 w-5"
                            />

                            Visszaállító link kérése
                        </>

                    )}

                </Button>

                {/* ==================================
                    VISSZA A BEJELENTKEZÉSHEZ
                ================================== */}

                <div className="border-t border-white/10 pt-6">

                    <p className="mb-4 text-center text-sm text-slate-400">
                        Mégis eszedbe jutott a jelszavad?
                    </p>

                    <TextLink
                        href={route('login')}
                        tabIndex={3}
                        className="
                            flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-500/40
                            bg-emerald-500/10
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-emerald-300
                            no-underline
                            transition
                            hover:border-emerald-400
                            hover:bg-emerald-500/20
                            hover:text-white
                        "
                    >

                        <ArrowLeft
                            aria-hidden="true"
                            className="h-4 w-4"
                        />

                        Vissza a bejelentkezéshez

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
                        A jelszó-visszaállítás a Laravel
                        hitelesítési rendszerén keresztül
                        történik. A régi jelszavadat
                        nem kell megadnod.
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
