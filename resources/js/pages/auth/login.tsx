import { Head, useForm } from '@inertiajs/react';
import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from 'lucide-react';

import { useState, type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '@/layouts/auth-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - BEJELENTKEZÉS
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Bejelentkezés e-mail-címmel és jelszóval
| - Emlékezz rám
| - Elfelejtett jelszó
| - Regisztrációs oldal elérése
| - Laravel szerveroldali validáció
| - Hibaüzenetek megjelenítése
| - Sikeres műveleti visszajelzés
| - Jelszó megjelenítése / elrejtése
| - Reszponzív NB I. dizájn
|
| A Laravel autentikációs működését
| nem módosítjuk.
|
*/

// ==========================================
// 1. BEJELENTKEZÉSI ADATOK
// ==========================================

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

// ==========================================
// 2. OLDAL TULAJDONSÁGAI
// ==========================================

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

// ==========================================
// 3. LOGIN KOMPONENS
// ==========================================

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {

    // ======================================
    // JELSZÓ MEGJELENÍTÉSE
    // ======================================

    const [showPassword, setShowPassword] =
        useState(false);

    // ======================================
    // LARAVEL INERTIA FORM
    // ======================================

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    // ======================================
    // BEJELENTKEZÉS
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // ======================================
    // OLDAL MEGJELENÍTÉSE
    // ======================================

    return (
        <AuthLayout
            title="Bejelentkezés"
            description="Lépj be a fiókodba, és fedezd fel az NB I. világát!"
        >

            <Head title="NB I. | Bejelentkezés" />

            {/* ==================================
                BEVEZETŐ INFORMÁCIÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                        <ShieldCheck
                            aria-hidden="true"
                            className="h-5 w-5 text-emerald-400"
                        />

                    </div>

                    <div>

                        <p className="text-sm font-bold text-emerald-300">
                            NB I. – Felhasználói fiók
                        </p>

                        <p className="mt-1 text-xs leading-6 text-slate-400">
                            Add meg a regisztrált e-mail-címedet
                            és jelszavadat a belépéshez.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                LARAVEL VISSZAJELZÉS
            ================================== */}

            {status && (

                <div
                    role="status"
                    className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center text-sm font-medium text-emerald-300"
                >
                    {status}
                </div>

            )}

            {/* ==================================
                BEJELENTKEZÉSI ŰRLAP
            ================================== */}

            <form
                className="flex flex-col gap-6"
                onSubmit={submit}
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
                            E-mail-cím
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
                                        ? 'email-error'
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
                                    text-white
                                    shadow-inner
                                    placeholder:text-slate-500
                                    focus-visible:border-emerald-500
                                    focus-visible:ring-emerald-500/30
                                "
                            />

                        </div>

                        <InputError
                            id="email-error"
                            message={errors.email}
                        />

                    </div>

                    {/* ==========================
                        JELSZÓ
                    ========================== */}

                    <div className="grid gap-2">

                        <div className="flex flex-wrap items-center justify-between gap-2">

                            <Label
                                htmlFor="password"
                                className="font-semibold text-slate-200"
                            >
                                Jelszó
                            </Label>

                            {/* ELFELEJTETT JELSZÓ */}

                            {canResetPassword && (

                                <TextLink
                                    href={route('password.request')}
                                    className="text-xs font-semibold text-emerald-400 no-underline hover:text-emerald-300 hover:underline"
                                    tabIndex={5}
                                >
                                    Elfelejtetted a jelszavad?
                                </TextLink>

                            )}

                        </div>

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
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Add meg a jelszavad"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password
                                        ? 'password-error'
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

                            {/* JELSZÓ LÁTHATÓSÁGA */}

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

                        <InputError
                            id="password-error"
                            message={errors.password}
                        />

                    </div>

                    {/* ==========================
                        EMLÉKEZZ RÁM
                    ========================== */}

                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-4">

                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={4}
                            checked={data.remember}
                            disabled={processing}
                            onCheckedChange={(checked) =>
                                setData(
                                    'remember',
                                    checked === true
                                )
                            }
                            className="border-emerald-500/50"
                        />

                        <Label
                            htmlFor="remember"
                            className="cursor-pointer text-sm font-medium text-slate-300"
                        >
                            Emlékezz rám
                        </Label>

                    </div>

                    {/* ==========================
                        BEJELENTKEZÉS GOMB
                    ========================== */}

                    <Button
                        type="submit"
                        tabIndex={6}
                        disabled={processing}
                        className="
                            mt-2
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

                                Bejelentkezés folyamatban...
                            </>

                        ) : (

                            <>
                                <LockKeyhole
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />

                                Bejelentkezés
                            </>

                        )}

                    </Button>

                </div>

                {/* ==================================
                    REGISZTRÁCIÓ
                ================================== */}

                <div className="border-t border-white/10 pt-6">

                    <p className="text-center text-sm text-slate-400">
                        Még nincs felhasználói fiókod?
                    </p>

                    <TextLink
                        href={route('register')}
                        tabIndex={7}
                        className="
                            mt-4
                            flex
                            w-full
                            items-center
                            justify-center
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
                        Új fiók létrehozása
                    </TextLink>

                </div>

            </form>

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
