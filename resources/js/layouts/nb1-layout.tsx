import { Link, usePage } from '@inertiajs/react';
import { useState, type ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean | number;
}

interface AuthData {
    user?: AuthUser | null;
}

interface MenuItem {
    label: string;
    href: string;
}

const publicMenu: MenuItem[] = [
    { label: 'Főoldal', href: '/' },
    { label: 'Klubok', href: '/klubok' },
    { label: 'Labdarúgók', href: '/labdarugok' },
    { label: 'Kapcsolat', href: '/kapcsolat' },
    { label: 'Diagram', href: '/diagram' },
    { label: 'Csapaterősség', href: '/csapatstatisztika' },
    { label: 'Összehasonlítás', href: '/csapat-osszehasonlitas' },
];

const adminMenu: MenuItem[] = [
    { label: 'Admin főoldal', href: '/admin' },
    { label: 'Klub CRUD', href: '/admin/klubok' },
    { label: 'React CRUD', href: '/admin/react-posztok' },
    { label: 'Tesztek', href: '/admin/teszt' },
];

export default function Nb1Layout({
    children,
}: LayoutProps) {
    const { url, props } = usePage();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [adminOpen, setAdminOpen] = useState(false);

    const auth = props.auth as AuthData | undefined;
    const user = auth?.user ?? null;

    const isAdmin =
        user?.is_admin === true ||
        user?.is_admin === 1;

    const currentPath = url.split('?')[0];

    function isActive(path: string): boolean {
        if (path === '/') {
            return currentPath === '/';
        }

        return (
            currentPath === path ||
            currentPath.startsWith(path + '/')
        );
    }

    function closeMenus(): void {
        setMobileOpen(false);
        setAdminOpen(false);
    }

    function renderMenuLink(item: MenuItem) {
        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                className={
                    isActive(item.href)
                        ? 'nb1-nav-link nb1-nav-active'
                        : 'nb1-nav-link'
                }
                aria-current={
                    currentPath === item.href
                        ? 'page'
                        : undefined
                }
            >
                {item.label}
            </Link>
        );
    }

    return (
        <div className="nb1-layout">
            <style>{`
                .nb1-layout {
                    --nb1-green: #176b43;
                    --nb1-green-hover: #218957;
                    --nb1-dark: #16271e;
                    --nb1-light: #e4f0e8;
                    --nb1-background: #f3f7f4;
                    --nb1-gold: #d49a23;

                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: var(--nb1-background);
                    color: var(--nb1-dark);
                }

                .nb1-layout *,
                .nb1-layout *::before,
                .nb1-layout *::after {
                    box-sizing: border-box;
                }

                /* FEJLÉC */

                .nb1-layout .nb1-site-header {
                    position: relative;
                    z-index: 50;
                    width: 100%;
                    padding: 0;
                    background: #fff;
                    border-bottom: 1px solid #dce8df;
                    box-shadow: 0 3px 14px rgba(0, 0, 0, 0.04);
                }

                .nb1-layout .nb1-header-container {
                    width: 100%;
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: 0 28px;
                }

                .nb1-layout .nb1-brand-area {
                    padding: 28px 0 20px;
                    text-align: center;
                }

                .nb1-layout .nb1-brand {
                    display: inline-block;
                    padding: 0;
                    margin: 0;
                    background: none;
                    border: none;
                    color: var(--nb1-dark) !important;
                    font-size: clamp(27px, 3vw, 39px);
                    font-weight: 900;
                    line-height: 1.2;
                    letter-spacing: -0.8px;
                    text-decoration: none !important;
                }

                .nb1-layout .nb1-brand:hover {
                    color: var(--nb1-green) !important;
                }

                .nb1-layout .nb1-brand-subtitle {
                    margin: 8px 0 0;
                    padding: 0;
                    color: #667a6d;
                    font-size: 13px;
                    line-height: 1.5;
                }

                /* NAVIGÁCIÓ */

                .nb1-layout .nb1-navigation-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 18px;
                    min-height: 67px;
                    border-top: 1px solid #edf1ed;
                }

                .nb1-layout .nb1-navigation {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 3px;
                    min-width: 0;
                    padding: 10px 0;
                    margin: 0;
                }

                .nb1-layout .nb1-nav-link {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 39px;
                    padding: 10px 12px;
                    margin: 0;
                    border: 0;
                    border-radius: 6px;
                    background: transparent;
                    color: #4a5d51 !important;
                    font-size: 13px;
                    font-weight: 700;
                    line-height: 1.4;
                    font-style: normal;
                    text-decoration: none !important;
                    white-space: nowrap;
                    transition:
                        background 0.2s ease,
                        color 0.2s ease;
                }

                .nb1-layout .nb1-nav-link:hover {
                    background: var(--nb1-light);
                    color: var(--nb1-green) !important;
                }

                .nb1-layout .nb1-nav-active,
                .nb1-layout .nb1-nav-active:hover {
                    background: var(--nb1-green);
                    color: #ffffff !important;
                }

                /* ADMIN LEGÖRDÜLŐ */

                .nb1-layout .nb1-admin-dropdown {
                    position: relative;
                }

                .nb1-layout .nb1-admin-toggle {
                    cursor: pointer;
                    font-family: inherit;
                }

                .nb1-layout .nb1-admin-dropdown-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    left: 0;
                    z-index: 100;
                    display: flex;
                    flex-direction: column;
                    min-width: 210px;
                    padding: 8px;
                    background: #fff;
                    border: 1px solid #dce8df;
                    border-radius: 8px;
                    box-shadow: 0 14px 30px rgba(0,0,0,.12);
                }

                .nb1-layout .nb1-admin-dropdown-menu
                .nb1-nav-link {
                    justify-content: flex-start;
                    width: 100%;
                }

                /* FIÓK */

                .nb1-layout .nb1-account-actions {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex-shrink: 0;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .nb1-layout .nb1-account-name {
                    color: #65796c;
                    font-size: 12px;
                    font-weight: 600;
                }

                .nb1-layout .nb1-account-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 39px;
                    padding: 9px 15px;
                    margin: 0;
                    border-radius: 6px;
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 800;
                    line-height: 1.4;
                    text-align: center;
                    text-decoration: none !important;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .nb1-layout .nb1-account-outline {
                    background: #fff;
                    border: 1px solid var(--nb1-green);
                    color: var(--nb1-green) !important;
                }

                .nb1-layout .nb1-account-outline:hover {
                    background: var(--nb1-light);
                    color: var(--nb1-green) !important;
                }

                .nb1-layout .nb1-account-primary {
                    background: var(--nb1-green);
                    border: 1px solid var(--nb1-green);
                    color: #fff !important;
                }

                .nb1-layout .nb1-account-primary:hover {
                    background: var(--nb1-green-hover);
                    color: #fff !important;
                }

                .nb1-layout .nb1-account-dark {
                    background: var(--nb1-dark);
                    border: 1px solid var(--nb1-dark);
                    color: #fff !important;
                }

                .nb1-layout .nb1-account-dark:hover {
                    background: #2d4737;
                    color: #fff !important;
                }

                /* MOBILMENÜ */

                .nb1-layout .nb1-mobile-menu-button {
                    display: none;
                    width: 100%;
                    margin: 0 0 16px;
                    padding: 12px 18px;
                    border: 1px solid var(--nb1-green);
                    border-radius: 7px;
                    background: var(--nb1-green);
                    color: #fff;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .nb1-layout .nb1-mobile-navigation {
                    display: none;
                    flex-direction: column;
                    gap: 4px;
                    padding: 12px 0 20px;
                    border-top: 1px solid #dce8df;
                }

                .nb1-layout .nb1-mobile-navigation
                .nb1-nav-link {
                    justify-content: flex-start;
                    width: 100%;
                    padding: 12px 15px;
                    white-space: normal;
                }

                .nb1-layout .nb1-mobile-section-title {
                    padding: 16px 15px 7px;
                    color: var(--nb1-green);
                    font-size: 12px;
                    font-weight: 900;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }

                .nb1-layout .nb1-mobile-account {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding-top: 16px;
                    margin-top: 12px;
                    border-top: 1px solid #dce8df;
                }

                .nb1-layout .nb1-mobile-account
                .nb1-account-button {
                    width: 100%;
                }

                /* TARTALOM */

                .nb1-layout .nb1-main {
                    width: 100%;
                    min-width: 0;
                    flex: 1;
                }

                /* LÁBLÉC */

                .nb1-layout .nb1-site-footer {
                    width: 100%;
                    padding: 65px 25px 22px;
                    background: var(--nb1-dark);
                    color: #d5e3d8;
                }

                .nb1-layout .nb1-footer-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .nb1-layout .nb1-footer-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 45px;
                }

                .nb1-layout .nb1-footer-heading {
                    margin: 0 0 22px;
                    padding: 0;
                    color: #fff !important;
                    font-size: 19px;
                    font-weight: 900;
                    line-height: 1.3;
                }

                .nb1-layout .nb1-footer-text {
                    margin: 0 0 14px;
                    padding: 0;
                    color: #d5e3d8 !important;
                    font-size: 14px;
                    line-height: 1.8;
                }

                .nb1-layout .nb1-footer-link {
                    color: #91dfaf !important;
                    text-decoration: underline;
                    text-underline-offset: 3px;
                }

                .nb1-layout .nb1-footer-link:hover {
                    color: #fff !important;
                }

                .nb1-layout .nb1-footer-bottom {
                    margin-top: 45px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(255,255,255,.12);
                    color: #b8d0be;
                    font-size: 12px;
                    line-height: 1.8;
                    text-align: center;
                }

                /* KISEBB ASZTALI NÉZET */

                @media (max-width: 1180px) {
                    .nb1-layout .nb1-navigation-row {
                        display: none;
                    }

                    .nb1-layout .nb1-mobile-menu-button {
                        display: block;
                    }

                    .nb1-layout .nb1-mobile-navigation {
                        display: flex;
                    }

                    .nb1-layout .nb1-mobile-navigation[hidden] {
                        display: none;
                    }

                    .nb1-layout .nb1-brand-area {
                        padding: 22px 0 18px;
                    }
                }

                /* MOBIL */

                @media (max-width: 768px) {
                    .nb1-layout .nb1-header-container {
                        padding: 0 18px;
                    }

                    .nb1-layout .nb1-brand {
                        font-size: 29px;
                    }

                    .nb1-layout .nb1-brand-subtitle {
                        font-size: 12px;
                    }

                    .nb1-layout .nb1-site-footer {
                        padding: 48px 20px 20px;
                    }

                    .nb1-layout .nb1-footer-grid {
                        grid-template-columns: 1fr;
                        gap: 25px;
                    }

                    .nb1-layout .nb1-footer-heading {
                        margin-bottom: 12px;
                    }

                    .nb1-layout .nb1-footer-bottom {
                        margin-top: 28px;
                    }
                }
            `}</style>

            {/* FEJLÉC */}

            <header className="nb1-site-header">
                <div className="nb1-header-container">

                    <div className="nb1-brand-area">
                        <Link
                            href="/"
                            className="nb1-brand"
                            onClick={closeMenus}
                        >
                            NB I. Labdarúgás
                        </Link>

                        <p className="nb1-brand-subtitle">
                            Magyar labdarúgóklubok és játékosok adatbázisa
                        </p>
                    </div>

                    {/* ASZTALI NAVIGÁCIÓ */}

                    <div className="nb1-navigation-row">
                        <nav
                            className="nb1-navigation"
                            aria-label="Fő navigáció"
                        >
                            {publicMenu.map(renderMenuLink)}

                            {user && renderMenuLink({
                                label: 'Üzenetek',
                                href: '/uzenetek',
                            })}

                            {isAdmin && (
                                <div className="nb1-admin-dropdown">
                                    <button
                                        type="button"
                                        className="nb1-nav-link nb1-admin-toggle"
                                        onClick={() =>
                                            setAdminOpen(!adminOpen)
                                        }
                                        aria-expanded={adminOpen}
                                    >
                                        Admin ▾
                                    </button>

                                    {adminOpen && (
                                        <div className="nb1-admin-dropdown-menu">
                                            {adminMenu.map(renderMenuLink)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </nav>

                        {/* FIÓK MŰVELETEK */}

                        <div className="nb1-account-actions">
                            {user ? (
                                <>
                                    <span className="nb1-account-name">
                                        {user.name}
                                    </span>

                                    <Link
                                        href="/dashboard"
                                        className="nb1-account-button nb1-account-outline"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="nb1-account-button nb1-account-dark"
                                    >
                                        Kijelentkezés
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="nb1-account-button nb1-account-outline"
                                    >
                                        Bejelentkezés
                                    </Link>

                                    <Link
                                        href="/register"
                                        className="nb1-account-button nb1-account-primary"
                                    >
                                        Regisztráció
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* MOBILMENÜ GOMB */}

                    <button
                        type="button"
                        className="nb1-mobile-menu-button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-controls="nb1-mobile-navigation"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen
                            ? '✕ Menü bezárása'
                            : '☰ Menü megnyitása'}
                    </button>

                    {/* MOBIL NAVIGÁCIÓ */}

                    <nav
                        id="nb1-mobile-navigation"
                        className="nb1-mobile-navigation"
                        aria-label="Mobil navigáció"
                        hidden={!mobileOpen}
                    >
                        {publicMenu.map(renderMenuLink)}

                        {user && renderMenuLink({
                            label: 'Üzenetek',
                            href: '/uzenetek',
                        })}

                        {isAdmin && (
                            <>
                                <div className="nb1-mobile-section-title">
                                    Adminisztráció
                                </div>

                                {adminMenu.map(renderMenuLink)}
                            </>
                        )}

                        <div className="nb1-mobile-account">
                            {user ? (
                                <>
                                    <span className="nb1-account-name">
                                        Bejelentkezve: {user.name}
                                    </span>

                                    <Link
                                        href="/dashboard"
                                        onClick={closeMenus}
                                        className="nb1-account-button nb1-account-outline"
                                    >
                                        Dashboard
                                    </Link>

                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="nb1-account-button nb1-account-dark"
                                    >
                                        Kijelentkezés
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={closeMenus}
                                        className="nb1-account-button nb1-account-outline"
                                    >
                                        Bejelentkezés
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={closeMenus}
                                        className="nb1-account-button nb1-account-primary"
                                    >
                                        Regisztráció
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </header>

            {/* OLDALTARTALOM */}

            <main
                className="nb1-main"
                id="nb1-main-content"
            >
                {children}
            </main>

            {/* LÁBLÉC */}

            <footer className="nb1-site-footer">
                <div className="nb1-footer-container">

                    <div className="nb1-footer-grid">

                        <section>
                            <h2 className="nb1-footer-heading">
                                NB I. Labdarúgás
                            </h2>

                            <p className="nb1-footer-text">
                                Magyar labdarúgóklubok és
                                játékosok adatbázisa.
                            </p>

                            <p className="nb1-footer-text">
                                Webprogramozás II. –
                                Előadás beadandó
                            </p>
                        </section>

                        <section>
                            <h2 className="nb1-footer-heading">
                                Készítette
                            </h2>

                            <p className="nb1-footer-text">
                                Farkas Tamás – PLPJEB
                            </p>

                            <p className="nb1-footer-text">
                                Fodor Árpád – U4BKST
                            </p>

                            <p className="nb1-footer-text">
                                Neumann János Egyetem – GAMF
                            </p>
                        </section>

                        <section>
                            <h2 className="nb1-footer-heading">
                                Technológiák
                            </h2>

                            <p className="nb1-footer-text">
                                Laravel 12 · React · TypeScript
                                · Inertia.js · MySQL · Chart.js · Axios
                            </p>

                            <p className="nb1-footer-text">
                                Megjelenés:{' '}
                                <a
                                    href="https://html5up.net/dopetrope"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="nb1-footer-link"
                                >
                                    Dopetrope – HTML5 UP
                                </a>
                            </p>

                            <p className="nb1-footer-text">
                                <Link
                                    href="/"
                                    className="nb1-footer-link"
                                >
                                    Vissza a főoldalra
                                </Link>
                            </p>
                        </section>
                    </div>

                    <div className="nb1-footer-bottom">
                        © 2026 NB I. Labdarúgás
                        {' | '}
                        Design:{' '}
                        <a
                            href="https://html5up.net"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nb1-footer-link"
                        >
                            HTML5 UP
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}