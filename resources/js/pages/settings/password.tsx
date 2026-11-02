import { Head, Link, useForm } from '@inertiajs/react';
import {
    useRef,
    useState,
    type FormEventHandler,
} from 'react';

import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
    Palette,
    Save,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import InputError from '@/components/input-error';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Nb1Layout from '@/layouts/nb1-layout';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - JELSZÓBEÁLLÍTÁSOK
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Aktuális jelszó megadása
| - Új jelszó megadása
| - Új jelszó megerősítése
| - Jelszavak megjelenítése / elrejtése
| - Laravel szerveroldali validáció
| - Hibás mezők kezelése
| - Sikeres módosítás visszajelzése
| - Jelszómezők automatikus törlése
| - Egységes NB I. dizájn
|
| Az eredeti Laravel password.update
| útvonalat és működést megtartjuk.
|
*/

// ==========================================
// 1. ŰRLAP ADATAI
// ==========================================

type PasswordForm = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

// ==========================================
// 2. FŐ KOMPONENS
// ==========================================

export default function Password() {

    // ======================================
    // 3. INPUT REFERENCIÁK
    // ======================================

    const currentPasswordInput =
        useRef<HTMLInputElement>(null);

    const passwordInput =
        useRef<HTMLInputElement>(null);

    const confirmationInput =
        useRef<HTMLInputElement>(null);

    // ======================================
    // 4. JELSZAVAK LÁTHATÓSÁGA
    // ======================================

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmation,
        setShowConfirmation,
    ] = useState(false);

    // ======================================
    // 5. LARAVEL INERTIA FORM
    // ======================================

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm<PasswordForm>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // ======================================
    // 6. JELSZÓ MÓDOSÍTÁSA
    // ======================================

    const updatePassword: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,

            // Sikeres mentés után
            // minden jelszómezőt kiürítünk.

            onSuccess: () => {
                reset();

                setShowCurrentPassword(false);
                setShowPassword(false);
                setShowConfirmation(false);
            },

            // Hibás adatok esetén
            // az érintett mezőre fókuszálunk.

            onError: (formErrors) => {

                if (formErrors.password) {
                    reset(
                        'password',
                        'password_confirmation'
                    );

                    passwordInput.current?.focus();
                }

                if (formErrors.current_password) {
                    reset('current_password');

                    currentPasswordInput.current?.focus();
                }

                if (formErrors.password_confirmation) {
                    confirmationInput.current?.focus();
                }
            },
        });
    };

    // ======================================
    // 7. OLDAL MEGJELENÍTÉSE
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Jelszóbeállítások" />

            {/* ==================================
                OLDAL FEJLÉCE
            ================================== */}

            <section className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950">

                <div className="mx-auto max-w-7xl px-6 py-14">

                    {/* MORZSANAVIGÁCIÓ */}

                    <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-400">

                        <Link
                            href="/"
                            className="transition hover:text-emerald-400"
                        >
                            Főoldal
                        </Link>

                        <span>/</span>

                        <Link
                            href="/dashboard"
                            className="transition hover:text-emerald-400"
                        >
                            Dashboard
                        </Link>

                        <span>/</span>

                        <span className="text-emerald-400">
                            Jelszóbeállítások
                        </span>

                    </div>

                    {/* KATEGÓRIA */}

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">

                        <ShieldCheck className="h-4 w-4" />

                        Fiókbiztonság

                    </span>

                    {/* CÍM */}

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        JELSZÓ

                        <span className="ml-3 text-emerald-400">
                            MÓDOSÍTÁSA
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                        Itt módosíthatod az NB I.
                        felhasználói fiókod jelszavát.
                        A módosításhoz add meg az aktuális
                        és az új jelszavadat.
                    </p>

                </div>

            </section>

            {/* ==================================
                FŐ TARTALOM
            ================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">

                    {/* ==================================
                        BAL OLDALI BEÁLLÍTÁSMENÜ
                    ================================== */}

                    <aside className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">

                        <h2 className="mb-5 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                            Fiókbeállítások
                        </h2>

                        <nav
                            aria-label="Fiókbeállítások navigációja"
                            className="flex flex-col gap-2"
                        >

                            {/* PROFIL */}

                            <Link
                                href="/settings/profile"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-emerald-400"
                            >

                                <UserRound className="h-5 w-5" />

                                Profil

                            </Link>

                            {/* JELSZÓ - AKTÍV */}

                            <Link
                                href="/settings/password"
                                aria-current="page"
                                className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-bold text-emerald-400"
                            >

                                <KeyRound className="h-5 w-5" />

                                Jelszó

                            </Link>

                            {/* MEGJELENÉS */}

                            <Link
                                href="/settings/appearance"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-emerald-400"
                            >

                                <Palette className="h-5 w-5" />

                                Megjelenés

                            </Link>

                        </nav>

                        <div className="my-6 border-t border-white/10" />

                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400"
                        >

                            <ArrowLeft className="h-4 w-4" />

                            Vissza a Dashboardhoz

                        </Link>

                    </aside>

                    {/* ==================================
                        JOBB OLDALI TARTALOM
                    ================================== */}

                    <div className="min-w-0 space-y-8">

                        {/* ==================================
                            BIZTONSÁGI INFORMÁCIÓ
                        ================================== */}

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10">

                                    <ShieldCheck className="h-6 w-6 text-emerald-400" />

                                </div>

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Biztonságos jelszókezelés
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-300">
                                        A fiókod védelmében
                                        használj hosszú,
                                        egyedi jelszót,
                                        amelyet más weboldalon
                                        nem használsz.
                                    </p>

                                    <p className="mt-2 text-xs leading-6 text-slate-400">
                                        A jelszó helyességét
                                        és az új jelszó
                                        követelményeit
                                        a Laravel szerveroldalon
                                        ellenőrzi.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            JELSZÓMÓDOSÍTÓ KÁRTYA
                        ================================== */}

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                            {/* KÁRTYA FEJLÉCE */}

                            <div className="border-b border-white/10 bg-slate-800/40 px-6 py-6 sm:px-8">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">

                                        <LockKeyhole className="h-6 w-6 text-emerald-400" />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-white">
                                            Jelszó megváltoztatása
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Add meg a szükséges
                                            adatokat a módosításhoz.
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* ==================================
                                LARAVEL ŰRLAP
                            ================================== */}

                            <form
                                onSubmit={updatePassword}
                                className="space-y-7 p-6 sm:p-8"
                            >

                                {/* ==========================
                                    AKTUÁLIS JELSZÓ
                                ========================== */}

                                <div className="grid gap-3">

                                    <Label
                                        htmlFor="current_password"
                                        className="font-semibold text-slate-200"
                                    >
                                        Aktuális jelszó
                                    </Label>

                                    <div className="relative">

                                        <LockKeyhole
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                                        />

                                        <Input
                                            id="current_password"
                                            name="current_password"
                                            ref={currentPasswordInput}
                                            type={
                                                showCurrentPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            required
                                            autoComplete="current-password"
                                            value={data.current_password}
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'current_password',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Add meg a jelenlegi jelszavad"
                                            aria-invalid={Boolean(
                                                errors.current_password
                                            )}
                                            className="h-12 w-full rounded-xl border-slate-700 bg-slate-950 pl-12 pr-12 text-base text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
                                        />

                                        {/* LÁTHATÓSÁG */}

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (previous) => !previous
                                                )
                                            }
                                            aria-label={
                                                showCurrentPassword
                                                    ? 'Aktuális jelszó elrejtése'
                                                    : 'Aktuális jelszó megjelenítése'
                                            }
                                            aria-pressed={showCurrentPassword}
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400 disabled:opacity-50"
                                        >

                                            {showCurrentPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}

                                        </button>

                                    </div>

                                    <InputError
                                        message={errors.current_password}
                                        className="text-red-400"
                                    />

                                </div>

                                {/* ==========================
                                    ÚJ JELSZÓ
                                ========================== */}

                                <div className="grid gap-3">

                                    <Label
                                        htmlFor="password"
                                        className="font-semibold text-slate-200"
                                    >
                                        Új jelszó
                                    </Label>

                                    <div className="relative">

                                        <KeyRound
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                                        />

                                        <Input
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            required
                                            autoComplete="new-password"
                                            value={data.password}
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Add meg az új jelszavad"
                                            aria-invalid={Boolean(
                                                errors.password
                                            )}
                                            className="h-12 w-full rounded-xl border-slate-700 bg-slate-950 pl-12 pr-12 text-base text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
                                        />

                                        {/* LÁTHATÓSÁG */}

                                        <button
                                            type="button"
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
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400 disabled:opacity-50"
                                        >

                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}

                                        </button>

                                    </div>

                                    <InputError
                                        message={errors.password}
                                        className="text-red-400"
                                    />

                                    <p className="text-xs leading-6 text-slate-500">
                                        Az új jelszó legyen
                                        hosszú, nehezen kitalálható
                                        és egyedi.
                                    </p>

                                </div>

                                {/* ==========================
                                    JELSZÓ MEGERŐSÍTÉSE
                                ========================== */}

                                <div className="grid gap-3">

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
                                            ref={confirmationInput}
                                            type={
                                                showConfirmation
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            required
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Írd be újra az új jelszót"
                                            aria-invalid={Boolean(
                                                errors.password_confirmation
                                            )}
                                            className="h-12 w-full rounded-xl border-slate-700 bg-slate-950 pl-12 pr-12 text-base text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
                                        />

                                        {/* LÁTHATÓSÁG */}

                                        <button
                                            type="button"
                                            disabled={processing}
                                            onClick={() =>
                                                setShowConfirmation(
                                                    (previous) => !previous
                                                )
                                            }
                                            aria-label={
                                                showConfirmation
                                                    ? 'Megerősítő jelszó elrejtése'
                                                    : 'Megerősítő jelszó megjelenítése'
                                            }
                                            aria-pressed={showConfirmation}
                                            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-800 hover:text-emerald-400 disabled:opacity-50"
                                        >

                                            {showConfirmation ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}

                                        </button>

                                    </div>

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="text-red-400"
                                    />

                                </div>

                                {/* ==========================
                                    MENTÉS
                                ========================== */}

                                <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-6">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {processing ? (

                                            <>
                                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                                Jelszó mentése...
                                            </>

                                        ) : (

                                            <>
                                                <Save className="h-5 w-5" />
                                                Jelszó módosítása
                                            </>

                                        )}

                                    </button>

                                    {/* SIKERES MENTÉS */}

                                    {recentlySuccessful && (

                                        <p
                                            role="status"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400"
                                        >

                                            <CheckCircle2 className="h-5 w-5" />

                                            A jelszó sikeresen módosult!

                                        </p>

                                    )}

                                </div>

                            </form>

                        </div>

                        {/* ==================================
                            FONTOS INFORMÁCIÓ
                        ================================== */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                            <div className="flex items-start gap-4">

                                <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Fontos tudnivalók
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A módosításhoz
                                        ismerned kell az
                                        aktuális jelszavadat.
                                        Ha elfelejtetted,
                                        a bejelentkezési
                                        oldalon kérhetsz
                                        jelszó-visszaállítást.
                                    </p>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A sikeres mentés után
                                        az űrlap jelszómezői
                                        automatikusan kiürülnek.
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ==================================
                            VISSZA
                        ================================== */}

                        <div className="pt-2">

                            <Link
                                href="/settings/profile"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                            >

                                <ArrowLeft className="h-4 w-4" />

                                Vissza a profilhoz

                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </Nb1Layout>
    );
}
