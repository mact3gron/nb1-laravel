import { Head, useForm } from '@inertiajs/react';

import {
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    Mail,
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
| NB I. LABDARÚGÁS - ÚJ JELSZÓ BEÁLLÍTÁSA
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Jelszó visszaállítása
| - Laravel visszaállítási token megtartása
| - E-mail-cím megjelenítése
| - Új jelszó megadása
| - Új jelszó megerősítése
| - Jelszavak megjelenítése / elrejtése
| - Laravel szerveroldali validáció
| - Hibaüzenetek megjelenítése
| - Feldolgozási állapot visszajelzése
| - Reszponzív NB I. megjelenés
|
| A Laravel password.store útvonalát
| változatlanul használjuk.
|
*/

// ==========================================
// 1. OLDAL TULAJDONSÁGAI
// ==========================================

interface ResetPasswordProps {
    token: string;
    email: string;
}

// ==========================================
// 2. ŰRLAP ADATAI
// ==========================================

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

// ==========================================
// 3. FŐ KOMPONENS
// ==========================================

export default function ResetPassword({
    token,
    email,
}: ResetPasswordProps) {

    // ======================================
    // JELSZAVAK LÁTHATÓSÁGA
    // ======================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showPasswordConfirmation,
        setShowPasswordConfirmation,
    ] = useState(false);

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
    } = useForm<ResetPasswordForm>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // ======================================
    // ÚJ JELSZÓ ELMENTÉSE
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () =>
                reset(
                    'password',
                    'password_confirmation'
                ),
        });
    };

    // ======================================
    // MEGJELENÍTÉS
    // ======================================

    return (
        <AuthLayout
            title="Új jelszó beállítása"
            description="Adj meg egy új jelszót az NB I. felhasználói fiókodhoz."
        >

            <Head title="NB I. | Új jelszó" />

            {/* ==================================
                BIZTONSÁGI INFORMÁCIÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                        <KeyRound
                            aria-hidden="true"
                            className="h-6 w-6 text-emerald-400"
                        />

                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-emerald-300">
                            Jelszó megváltoztatása
                        </h2>

                        <p className="mt-2 text-xs leading-6 text-slate-400">
                            A jelszó-visszaállító
                            hivatkozáson keresztül
                            új jelszót állíthatsz be.
                            Add meg és erősítsd meg
                            az új jelszavadat.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                ÚJ JELSZÓ ŰRLAP
            ================================== */}

            <form
                onSubmit={submit}
                className="flex flex-col gap-6"
            >

                <div className="grid gap-6">

                    {/* ==========================
                        E-MAIL-CÍM
                    ========================== */}

                    <div className="grid gap-2">

                        <Label
                            htmlFor="email"
                            className="font-semibold text-slate-200"
                        >
                            Regisztrált e-mail-cím
                        </Label>

                        <div className="relative">

                            <Mail
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                            />

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                readOnly
                                aria-invalid={Boolean(errors.email)}
                                aria-describedby={
                                    errors.email
                                        ? 'reset-email-error'
                                        : undefined
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
                                    text-slate-300
                                    shadow-inner
                                    focus-visible:border-emerald-500
                                    focus-visible:ring-emerald-500/30
                                "
                            />

                        </div>

                        <InputError
                            id="reset-email-error"
                            message={errors.email}
                        />

                        <p className="text-xs leading-6 text-slate-500">
                            Ez a visszaállító
                            hivatkozáshoz tartozó
                            e-mail-cím.
                        </p>

                    </div>

                    {/* ==========================
                        ÚJ JELSZÓ
                    ========================== */}

                    <div className="grid gap-2">

                        <Label
                            htmlFor="password"
                            className="font-semibold text-slate-200"
                        >
                            Új jelszó
                        </Label>

                        <div className="relative">

                            <LockKeyhole
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                            />

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
                                tabIndex={2}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Add meg az új jelszavad"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password
                                        ? 'reset-password-error'
                                        : 'reset-password-help'
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

                            {/* JELSZÓ MEGJELENÍTÉSE */}

                            <button
                                type="button"
                                tabIndex={3}
                                disabled={processing}
                                onClick={() =>
                                    setShowPassword(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Új jelszó elrejtése'
                                        : 'Új jelszó megjelenítése'
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

                        <InputError
                            id="reset-password-error"
                            message={errors.password}
                        />

                        <p
                            id="reset-password-help"
                            className="text-xs leading-6 text-slate-500"
                        >
                            Használj egyedi, hosszú
                            jelszót, amelyet más
                            weboldalon nem használsz.
                        </p>

                    </div>

                    {/* ==========================
                        JELSZÓ MEGERŐSÍTÉSE
                    ========================== */}

                    <div className="grid gap-2">

                        <Label
                            htmlFor="password_confirmation"
                            className="font-semibold text-slate-200"
                        >
                            Új jelszó megerősítése
                        </Label>

                        <div className="relative">

                            <ShieldCheck
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                            />

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type={
                                    showPasswordConfirmation
                                        ? 'text'
                                        : 'password'
                                }
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Írd be újra az új jelszót"
                                aria-invalid={Boolean(
                                    errors.password_confirmation
                                )}
                                aria-describedby={
                                    errors.password_confirmation
                                        ? 'reset-confirmation-error'
                                        : undefined
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

                            {/* MEGERŐSÍTŐ JELSZÓ MEGJELENÍTÉSE */}

                            <button
                                type="button"
                                tabIndex={5}
                                disabled={processing}
                                onClick={() =>
                                    setShowPasswordConfirmation(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showPasswordConfirmation
                                        ? 'Megerősítő jelszó elrejtése'
                                        : 'Megerősítő jelszó megjelenítése'
                                }
                                aria-pressed={
                                    showPasswordConfirmation
                                }
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

                                {showPasswordConfirmation ? (

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

                        <InputError
                            id="reset-confirmation-error"
                            message={errors.password_confirmation}
                        />

                    </div>

                    {/* ==========================
                        JELSZÓ MENTÉSE
                    ========================== */}

                    <Button
                        type="submit"
                        tabIndex={6}
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

                                Új jelszó mentése...
                            </>

                        ) : (

                            <>
                                <CheckCircle2
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />

                                Új jelszó beállítása
                            </>

                        )}

                    </Button>

                </div>

            </form>

            {/* ==================================
                BIZTONSÁGI TÁJÉKOZTATÓ
            ================================== */}

            <div className="mt-7 rounded-xl border border-white/10 bg-slate-950/40 px-5 py-4">

                <div className="flex items-start gap-3">

                    <ShieldCheck
                        aria-hidden="true"
                        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                    />

                    <p className="text-xs leading-6 text-slate-400">
                        A jelszó módosítását a Laravel
                        szerveroldalon ellenőrzi.
                        A visszaállító hivatkozásnak
                        érvényesnek kell lennie.
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
