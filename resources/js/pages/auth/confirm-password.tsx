import { Head, useForm } from '@inertiajs/react';

import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    ShieldCheck,
} from 'lucide-react';

import { useState, type FormEventHandler } from 'react';

import InputError from '@/components/input-error';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '@/layouts/auth-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - JELSZÓ MEGERŐSÍTÉSE
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Aktuális jelszó megerősítése
| - Laravel password.confirm útvonal
| - Szerveroldali jelszóellenőrzés
| - Hibaüzenetek megjelenítése
| - Jelszó megjelenítése és elrejtése
| - Feldolgozási állapot
| - Jelszómező törlése a kérés végén
| - Reszponzív NB I. dizájn
|
| A Laravel hitelesítési működése
| változatlan marad.
|
*/

// ==========================================
// 1. ŰRLAP ADATAI
// ==========================================

type ConfirmPasswordForm = {
    password: string;
};

// ==========================================
// 2. FŐ KOMPONENS
// ==========================================

export default function ConfirmPassword() {

    // ======================================
    // JELSZÓ LÁTHATÓSÁGA
    // ======================================

    const [showPassword, setShowPassword] =
        useState(false);

    // ======================================
    // INERTIA ŰRLAP
    // ======================================

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<ConfirmPasswordForm>({
        password: '',
    });

    // ======================================
    // JELSZÓ MEGERŐSÍTÉSE
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    // ======================================
    // MEGJELENÍTÉS
    // ======================================

    return (
        <AuthLayout
            title="Jelszó megerősítése"
            description="Biztonsági ellenőrzés szükséges a folytatáshoz."
        >

            <Head title="NB I. | Jelszó megerősítése" />

            {/* ==================================
                BIZTONSÁGI INFORMÁCIÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">

                <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">

                        <ShieldCheck
                            aria-hidden="true"
                            className="h-6 w-6 text-emerald-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-emerald-300">
                            Biztonságos terület
                        </h2>

                        <p className="mt-2 text-sm leading-7 text-slate-300">
                            Az alkalmazás egy védett
                            részéhez szeretnél hozzáférni.
                            A folytatáshoz erősítsd meg
                            személyazonosságodat az
                            aktuális jelszavaddal.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                JELSZÓMEGERŐSÍTŐ ŰRLAP
            ================================== */}

            <form
                onSubmit={submit}
                className="flex flex-col gap-6"
            >

                {/* ==========================
                    JELSZÓ MEZŐ
                ========================== */}

                <div className="grid gap-2">

                    <Label
                        htmlFor="password"
                        className="font-semibold text-slate-200"
                    >
                        Aktuális jelszó
                    </Label>

                    <div className="relative">

                        {/* JELSZÓ IKON */}

                        <LockKeyhole
                            aria-hidden="true"
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                        />

                        {/* JELSZÓ BEVITEL */}

                        <Input
                            id="password"
                            name="password"
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) =>
                                setData(
                                    'password',
                                    e.target.value
                                )
                            }
                            disabled={processing}
                            placeholder="Add meg az aktuális jelszavad"
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={
                                errors.password
                                    ? 'confirm-password-error'
                                    : 'confirm-password-help'
                            }
                            className="
                                h-12
                                w-full
                                rounded-xl
                                border-white/15
                                bg-slate-950/70
                                pl-12
                                pr-12
                                text-base
                                text-white
                                shadow-inner
                                placeholder:text-slate-500
                                focus-visible:border-emerald-500
                                focus-visible:ring-emerald-500/30
                            "
                        />

                        {/* ==========================
                            JELSZÓ LÁTHATÓSÁGA
                        ========================== */}

                        <button
                            type="button"
                            tabIndex={2}
                            disabled={processing}
                            onClick={() =>
                                setShowPassword(
                                    (previous) => !previous
                                )
                            }
                            aria-label={
                                showPassword
                                    ? 'Jelszó elrejtése'
                                    : 'Jelszó megjelenítése'
                            }
                            aria-pressed={showPassword}
                            className="
                                absolute
                                right-3
                                top-1/2
                                flex
                                h-9
                                w-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-lg
                                text-slate-400
                                transition
                                hover:bg-slate-800
                                hover:text-emerald-400
                                focus-visible:outline-2
                                focus-visible:outline-emerald-400
                                disabled:opacity-50
                            "
                        >

                            {showPassword ? (

                                <EyeOff
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />

                            ) : (

                                <Eye
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />

                            )}

                        </button>

                    </div>

                    {/* LARAVEL HIBAÜZENET */}

                    <InputError
                        id="confirm-password-error"
                        message={errors.password}
                    />

                    {/* SEGÍTŐ SZÖVEG */}

                    <p
                        id="confirm-password-help"
                        className="mt-1 text-xs leading-6 text-slate-500"
                    >
                        A bejelentkezéshez használt
                        jelszavadat add meg.
                        Nem kell új jelszót létrehoznod.
                    </p>

                </div>

                {/* ==========================
                    MEGERŐSÍTÉS GOMB
                ========================== */}

                <Button
                    type="submit"
                    tabIndex={3}
                    disabled={processing}
                    className="
                        mt-2
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

                            Ellenőrzés folyamatban...
                        </>

                    ) : (

                        <>
                            <ShieldCheck
                                aria-hidden="true"
                                className="h-5 w-5"
                            />

                            Jelszó megerősítése
                        </>

                    )}

                </Button>

            </form>

            {/* ==================================
                BIZTONSÁGI TÁJÉKOZTATÓ
            ================================== */}

            <div className="mt-7 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-4">

                <div className="flex items-start gap-3">

                    <LockKeyhole
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                    />

                    <p className="text-xs leading-6 text-slate-400">
                        A jelszó helyességét
                        a Laravel szerveroldalon
                        ellenőrzi. Sikeres megerősítés
                        után folytathatod a korábban
                        megkezdett műveletet.
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
