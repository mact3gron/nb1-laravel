import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState, type FormEventHandler } from 'react';

import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    Mail,
    Palette,
    Save,
    ShieldCheck,
    Trash2,
    UserRound,
    UserRoundCog,
} from 'lucide-react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '@/components/ui/dialog';

import Nb1Layout from '@/layouts/nb1-layout';
import type { SharedData } from '@/types';

/*
|--------------------------------------------------------------------------
| NB I. LABDARÚGÁS - PROFILBEÁLLÍTÁSOK
|--------------------------------------------------------------------------
|
| Laravel 12 + React + TypeScript + Inertia.js
|
| Funkciók:
| - Profiladatok megjelenítése
| - Felhasználónév módosítása
| - E-mail-cím módosítása
| - Laravel szerveroldali validáció
| - Mentési visszajelzés
| - E-mail-megerősítés újraküldése
| - Navigáció a jelszóbeállításokhoz
| - Navigáció a megjelenési beállításokhoz
| - Fiók törlése jelszómegerősítéssel
| - Reszponzív NB I. dizájn
|
| Az eredeti Laravel útvonalakat használjuk.
|
*/

interface ProfileProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Profile({
    mustVerifyEmail,
    status,
}: ProfileProps) {

    // ======================================
    // 1. BEJELENTKEZETT FELHASZNÁLÓ
    // ======================================

    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // ======================================
    // 2. PROFIL ŰRLAP
    // ======================================

    const {
        data,
        setData,
        patch,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    // ======================================
    // 3. FIÓKTÖRLÉS ŰRLAP
    // ======================================

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [showDeletePassword, setShowDeletePassword] =
        useState(false);

    const deletePasswordInput =
        useRef<HTMLInputElement>(null);

    const deleteForm = useForm({
        password: '',
    });

    function closeDelete(): void {
        if (deleteForm.processing) {
            return;
        }

        setDeleteOpen(false);
        setShowDeletePassword(false);
        deleteForm.clearErrors();
        deleteForm.reset();
    }

    const deleteAccount: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        deleteForm.delete(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeDelete(),
            onError: () => {
                deletePasswordInput.current?.focus();
            },
            onFinish: () => {
                deleteForm.reset('password');
            },
        });
    };

    // ======================================
    // 4. E-MAIL-MEGERŐSÍTÉS ÁLLAPOTA
    // ======================================

    const emailVerificationRequired =
        mustVerifyEmail &&
        user.email_verified_at === null;

    // ======================================
    // 5. MEGJELENÍTÉS
    // ======================================

    return (
        <Nb1Layout>

            <Head title="NB I. | Profilbeállítások" />

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
                            Profilbeállítások
                        </span>

                    </div>

                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-bold uppercase tracking-widest text-emerald-400">

                        <UserRoundCog className="h-4 w-4" />

                        Felhasználói fiók

                    </span>

                    <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">

                        PROFIL
                        <span className="ml-3 text-emerald-400">
                            BEÁLLÍTÁSOK
                        </span>

                    </h1>

                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                        Kezeld felhasználói adataidat,
                        módosítsd az e-mail-címedet,
                        és állítsd be fiókod biztonsági
                        lehetőségeit.
                    </p>

                </div>

            </section>

            {/* ==================================
                FŐ TARTALOM
            ================================== */}

            <section className="bg-slate-950 px-4 py-12 sm:px-6">

                <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">

                    {/* ==========================
                        BAL OLDALI MENÜ
                    ========================== */}

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
                                aria-current="page"
                                className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 font-bold text-emerald-400"
                            >
                                <UserRound className="h-5 w-5" />

                                Profil
                            </Link>

                            {/* JELSZÓ */}

                            <Link
                                href="/settings/password"
                                className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-emerald-400"
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

                    {/* ==========================
                        JOBB OLDALI TARTALOM
                    ========================== */}

                    <div className="min-w-0 space-y-8">

                        {/* ======================
                            PROFIL INFORMÁCIÓ
                        ====================== */}

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-6">

                            <div className="flex flex-wrap items-center gap-5">

                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10">

                                    <UserRound className="h-8 w-8 text-emerald-400" />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                        Bejelentkezett felhasználó
                                    </p>

                                    <h2 className="mt-2 break-words text-xl font-black text-white">
                                        {user.name}
                                    </h2>

                                    <p className="mt-1 break-all text-sm text-slate-400">
                                        {user.email}
                                    </p>

                                </div>

                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">

                                    <ShieldCheck className="h-4 w-4" />

                                    Aktív munkamenet

                                </span>

                            </div>

                        </div>

                        {/* ======================
                            PROFIL SZERKESZTÉSE
                        ====================== */}

                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-xl">

                            <div className="border-b border-white/10 bg-slate-800/40 px-6 py-6 sm:px-8">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">

                                        <UserRoundCog className="h-6 w-6 text-emerald-400" />

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-white">
                                            Személyes adatok
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            Név és e-mail-cím módosítása
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* PROFIL ŰRLAP */}

                            <form
                                onSubmit={submit}
                                className="space-y-7 p-6 sm:p-8"
                            >

                                {/* ==================
                                    FELHASZNÁLÓNÉV
                                ================== */}

                                <div className="grid gap-3">

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
                                            autoComplete="name"
                                            maxLength={255}
                                            value={data.name}
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Add meg a teljes neved"
                                            aria-invalid={Boolean(errors.name)}
                                            className="h-12 rounded-xl border-slate-700 bg-slate-950 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
                                        />

                                    </div>

                                    <InputError
                                        message={errors.name}
                                        className="text-red-400"
                                    />

                                </div>

                                {/* ==================
                                    E-MAIL-CÍM
                                ================== */}

                                <div className="grid gap-3">

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
                                            autoComplete="username"
                                            maxLength={255}
                                            value={data.email}
                                            disabled={processing}
                                            onChange={(e) =>
                                                setData(
                                                    'email',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="pelda@email.hu"
                                            aria-invalid={Boolean(errors.email)}
                                            className="h-12 rounded-xl border-slate-700 bg-slate-950 pl-12 pr-4 text-base text-white placeholder:text-slate-500 focus-visible:ring-emerald-500/30"
                                        />

                                    </div>

                                    <InputError
                                        message={errors.email}
                                        className="text-red-400"
                                    />

                                </div>

                                {/* ==================
                                    E-MAIL VERIFIKÁCIÓ
                                ================== */}

                                {emailVerificationRequired && (

                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">

                                        <div className="flex items-start gap-3">

                                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />

                                            <div className="space-y-3">

                                                <p className="font-semibold text-amber-300">
                                                    Az e-mail-címed még nincs megerősítve.
                                                </p>

                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="text-sm font-bold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                                                >
                                                    Megerősítő e-mail újraküldése
                                                </Link>

                                                {status === 'verification-link-sent' && (

                                                    <p
                                                        role="status"
                                                        className="flex items-center gap-2 text-sm text-emerald-300"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />

                                                        Az új megerősítő hivatkozást elküldtük.
                                                    </p>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                )}

                                {/* ==================
                                    MENTÉS
                                ================== */}

                                <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-6">

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center justify-center gap-3 rounded-xl bg-emerald-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                                    >

                                        {processing ? (

                                            <>
                                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                                Mentés...
                                            </>

                                        ) : (

                                            <>
                                                <Save className="h-5 w-5" />
                                                Változtatások mentése
                                            </>

                                        )}

                                    </button>

                                    {recentlySuccessful && (

                                        <p
                                            role="status"
                                            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />

                                            Sikeresen elmentve!
                                        </p>

                                    )}

                                </div>

                            </form>

                        </div>

                        {/* ======================
                            BIZTONSÁGI INFORMÁCIÓ
                        ====================== */}

                        <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 sm:p-8">

                            <div className="flex items-start gap-4">

                                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-400" />

                                <div>

                                    <h2 className="text-lg font-bold text-white">
                                        Fiókbiztonság
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A profiladatok módosítását
                                        a Laravel hitelesítési és
                                        szerveroldali validációs
                                        rendszere kezeli.
                                    </p>

                                    <Link
                                        href="/settings/password"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                                    >
                                        <KeyRound className="h-4 w-4" />

                                        Jelszó megváltoztatása
                                    </Link>

                                </div>

                            </div>

                        </div>

                        {/* ======================
                            FIÓK TÖRLÉSE
                        ====================== */}

                        <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-6 sm:p-8">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10">

                                    <Trash2 className="h-6 w-6 text-red-400" />

                                </div>

                                <div className="min-w-0 flex-1">

                                    <h2 className="text-xl font-bold text-white">
                                        Fiók törlése
                                    </h2>

                                    <p className="mt-3 text-sm leading-7 text-slate-400">
                                        A felhasználói fiók törlése
                                        végleges művelet.
                                        A törlés előtt a rendszer
                                        az aktuális jelszót is
                                        ellenőrzi.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setDeleteOpen(true)}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-6 py-3 font-bold text-red-300 transition hover:bg-red-600 hover:text-white"
                                    >
                                        <Trash2 className="h-4 w-4" />

                                        Fiók törlése
                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* ======================
                            VISSZA A DASHBOARDHOZ
                        ====================== */}

                        <div className="pt-2">

                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-emerald-400"
                            >
                                <ArrowLeft className="h-4 w-4" />

                                Vissza a Dashboardhoz
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* ==================================
                FIÓKTÖRLÉS MEGERŐSÍTŐ ABLAK
            ================================== */}

            <Dialog
                open={deleteOpen}
                onOpenChange={(open) => {
                    if (open) {
                        setDeleteOpen(true);
                    } else {
                        closeDelete();
                    }
                }}
            >

                <DialogContent className="border-red-500/30 bg-slate-900 text-white sm:max-w-lg">

                    <DialogTitle className="flex items-center gap-3 text-xl font-bold text-white">

                        <AlertTriangle className="h-6 w-6 text-red-400" />

                        Fiók végleges törlése

                    </DialogTitle>

                    <DialogDescription className="text-sm leading-7 text-slate-300">

                        Biztosan törölni szeretnéd a fiókodat?
                        A művelet nem vonható vissza.
                        A folytatáshoz add meg az aktuális jelszavadat.

                    </DialogDescription>

                    <form
                        onSubmit={deleteAccount}
                        className="mt-5 space-y-6"
                    >

                        <div className="grid gap-3">

                            <Label
                                htmlFor="delete-password"
                                className="font-semibold text-slate-200"
                            >
                                Aktuális jelszó
                            </Label>

                            <div className="relative">

                                <Input
                                    id="delete-password"
                                    ref={deletePasswordInput}
                                    type={
                                        showDeletePassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    required
                                    autoComplete="current-password"
                                    value={deleteForm.data.password}
                                    disabled={deleteForm.processing}
                                    onChange={(e) =>
                                        deleteForm.setData(
                                            'password',
                                            e.target.value
                                        )
                                    }
                                    placeholder="Jelszó megadása"
                                    aria-invalid={Boolean(deleteForm.errors.password)}
                                    className="h-12 rounded-xl border-slate-700 bg-slate-950 pr-12 text-white placeholder:text-slate-500"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeletePassword(
                                            (previous) => !previous
                                        )
                                    }
                                    aria-label={
                                        showDeletePassword
                                            ? 'Jelszó elrejtése'
                                            : 'Jelszó megjelenítése'
                                    }
                                    disabled={deleteForm.processing}
                                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-emerald-400"
                                >

                                    {showDeletePassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}

                                </button>

                            </div>

                            <InputError
                                message={deleteForm.errors.password}
                                className="text-red-400"
                            />

                        </div>

                        <DialogFooter className="gap-3 sm:gap-2">

                            <button
                                type="button"
                                onClick={closeDelete}
                                disabled={deleteForm.processing}
                                className="rounded-xl border border-slate-600 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                            >
                                Mégse
                            </button>

                            <button
                                type="submit"
                                disabled={deleteForm.processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:opacity-50"
                            >

                                {deleteForm.processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        Törlés...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Végleges törlés
                                    </>
                                )}

                            </button>

                        </DialogFooter>

                    </form>

                </DialogContent>

            </Dialog>

        </Nb1Layout>
    );
}
