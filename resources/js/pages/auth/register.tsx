import { Head, useForm } from '@inertiajs/react';

import {
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
    UserRoundPlus,
} from 'lucide-react';

import { useState, type FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AuthLayout from '@/layouts/auth-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - REGISZTRÁCIÓ
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Felhasználói fiók létrehozása
| - Teljes név megadása
| - E-mail-cím megadása
| - Jelszó megadása
| - Jelszó megerősítése
| - Jelszavak megjelenítése / elrejtése
| - Laravel szerveroldali validáció
| - Hibaüzenetek megjelenítése
| - Feldolgozási állapot visszajelzése
| - Bejelentkezési oldal elérése
| - Reszponzív NB I. dizájn
|
| A Laravel regisztrációs működését
| nem módosítjuk.
|
*/

// ==========================================
// 1. REGISZTRÁCIÓS ŰRLAP ADATAI
// ==========================================

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

// ==========================================
// 2. REGISZTRÁCIÓS KOMPONENS
// ==========================================

export default function Register() {

    // ======================================
    // JELSZAVAK MEGJELENÍTÉSE
    // ======================================

    const [showPassword, setShowPassword] =
        useState(false);

    const [
        showPasswordConfirmation,
        setShowPasswordConfirmation,
    ] = useState(false);

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
    } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // ======================================
    // REGISZTRÁCIÓS ŰRLAP ELKÜLDÉSE
    // ======================================

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        post(route('register'), {
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
            title="Regisztráció"
            description="Hozd létre NB I. felhasználói fiókodat!"
        >

            <Head title="NB I. | Regisztráció" />

            {/* ==================================
                ÜDVÖZLŐ INFORMÁCIÓ
            ================================== */}

            <div className="mb-7 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                        <UserRoundPlus
                            aria-hidden="true"
                            className="h-5 w-5 text-emerald-400"
                        />

                    </div>

                    <div>

                        <p className="text-sm font-bold text-emerald-300">
                            Csatlakozz az NB I. oldalához!
                        </p>

                        <p className="mt-1 text-xs leading-6 text-slate-400">
                            A regisztrációhoz add meg
                            a nevedet, az e-mail-címedet
                            és egy jelszót.
                        </p>

                    </div>

                </div>

            </div>

            {/* ==================================
                REGISZTRÁCIÓS ŰRLAP
            ================================== */}

            <form
                className="flex flex-col gap-6"
                onSubmit={submit}
            >

                <div className="grid gap-6">

                    {/* ==========================
                        TELJES NÉV
                    ========================== */}

                    <div className="grid gap-2">

                        <Label
                            htmlFor="name"
                            className="font-semibold text-slate-200"
                        >
                            Teljes név
                        </Label>

                        <div className="relative">

                            <UserRound
                                aria-hidden="true"
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                            />

                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                maxLength={255}
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Teljes neved"
                                aria-invalid={Boolean(errors.name)}
                                aria-describedby={
                                    errors.name
                                        ? 'name-error'
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
                            id="name-error"
                            message={errors.name}
                        />

                    </div>

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
                                tabIndex={2}
                                autoComplete="email"
                                maxLength={255}
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

                        <Label
                            htmlFor="password"
                            className="font-semibold text-slate-200"
                        >
                            Jelszó
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
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData(
                                        'password',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Adj meg egy jelszót"
                                aria-invalid={Boolean(errors.password)}
                                aria-describedby={
                                    errors.password
                                        ? 'password-error'
                                        : 'password-help'
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

                            {/* JELSZÓ MUTATÁSA / ELREJTÉSE */}

                            <button
                                type="button"
                                tabIndex={4}
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

                        {/* JELSZÓ INFORMÁCIÓ */}

                        <p
                            id="password-help"
                            className="text-xs leading-6 text-slate-500"
                        >
                            Használj hosszú,
                            egyedi jelszót!
                            A pontos követelményeket
                            a Laravel szerveroldalon
                            ellenőrzi.
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
                            Jelszó megerősítése
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
                                tabIndex={5}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value
                                    )
                                }
                                disabled={processing}
                                placeholder="Írd be újra a jelszavad"
                                aria-invalid={Boolean(
                                    errors.password_confirmation
                                )}
                                aria-describedby={
                                    errors.password_confirmation
                                        ? 'password-confirmation-error'
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

                            {/* MEGERŐSÍTÉS MUTATÁSA / ELREJTÉSE */}

                            <button
                                type="button"
                                tabIndex={6}
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
                            id="password-confirmation-error"
                            message={errors.password_confirmation}
                        />

                    </div>

                    {/* ==========================
                        REGISZTRÁCIÓ GOMB
                    ========================== */}

                    <Button
                        type="submit"
                        tabIndex={7}
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

                                Regisztráció folyamatban...
                            </>

                        ) : (

                            <>
                                <UserRoundPlus
                                    aria-hidden="true"
                                    className="h-5 w-5"
                                />

                                Fiók létrehozása
                            </>

                        )}

                    </Button>

                </div>

                {/* ==================================
                    VISSZA A BEJELENTKEZÉSHEZ
                ================================== */}

                <div className="border-t border-white/10 pt-6">

                    <p className="text-center text-sm text-slate-400">
                        Már van felhasználói fiókod?
                    </p>

                    <TextLink
                        href={route('login')}
                        tabIndex={8}
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
                        Vissza a bejelentkezéshez
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
