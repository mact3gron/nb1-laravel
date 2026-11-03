import { Head, Link } from '@inertiajs/react';
import Nb1Layout from '../layouts/nb1-layout';

// ==========================================
// 1. ADATBÁZISBÓL ÉRKEZŐ ADATOK
// ==========================================

interface HomeStatistics {
    klubok: number;
    labdarugok: number;
    posztok: number;
}

interface HomeProps {
    statistics: HomeStatistics;
}

// ==========================================
// 2. FŐOLDAL
// ==========================================

export default function Home({
    statistics,
}: HomeProps) {

    const statisztikak = [
        {
            number: statistics.klubok,
            label: 'Labdarúgóklub',
        },
        {
            number: statistics.labdarugok,
            label: 'Labdarúgó',
        },
        {
            number: statistics.posztok,
            label: 'Játékosposzt',
        },
    ];

    return (
        <Nb1Layout>
            <Head title="NB I. | Főoldal" />

            <div className="nb1-home">

                {/* FŐOLDALI STÍLUSOK */}

                <style>{`
                    .nb1-home {
                        --home-green: #176b43;
                        --home-green-dark: #16271e;
                        --home-green-light: #e4f0e8;
                        --home-gold: #d49a23;
                        --home-background: #f3f7f4;

                        width: 100%;
                        color: var(--home-green-dark);
                        font-family: inherit;
                    }

                    .nb1-home *,
                    .nb1-home *::before,
                    .nb1-home *::after {
                        box-sizing: border-box;
                    }

                    .nb1-home h1,
                    .nb1-home h2,
                    .nb1-home h3,
                    .nb1-home p {
                        margin: 0;
                        padding: 0;
                        border: 0;
                    }

                    /* =============================
                       HERO SZEKCIÓ
                       ============================= */

                    .nb1-home .nb1-hero {
                        position: relative;
                        display: flex;
                        align-items: center;
                        width: 100%;
                        min-height: 610px;
                        overflow: hidden;
                        background-color: #0b1711;
                    }

                    .nb1-home .nb1-hero-image {
                        position: absolute;
                        inset: 0;
                        z-index: 0;

                        background-image:
                            url('/images/nb1-hero.png');
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                    }

                    .nb1-home .nb1-hero-overlay {
                        position: absolute;
                        inset: 0;
                        z-index: 1;

                        background: linear-gradient(
                            90deg,
                            rgba(7, 20, 14, 0.96) 0%,
                            rgba(9, 29, 19, 0.83) 42%,
                            rgba(9, 29, 19, 0.12) 100%
                        );
                    }

                    .nb1-home .nb1-hero-container {
                        position: relative;
                        z-index: 2;

                        width: 100%;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 95px 30px;
                    }

                    .nb1-home .nb1-hero-label {
                        display: inline-flex;
                        align-items: center;

                        margin-bottom: 25px;
                        padding: 10px 20px;

                        border: 1px solid
                            rgba(77, 213, 150, 0.5);
                        border-radius: 999px;

                        background:
                            rgba(23, 107, 67, 0.35);

                        color: #a4efc7;
                        font-size: 12px;
                        font-weight: 800;
                        line-height: 1.4;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                    }

                    .nb1-home .nb1-hero-title {
                        max-width: 780px;
                        margin-bottom: 26px;

                        color: #ffffff !important;
                        font-size: clamp(38px, 5vw, 70px);
                        font-weight: 900;
                        line-height: 1.15;
                        letter-spacing: -1px;
                        text-transform: uppercase;
                    }

                    .nb1-home .nb1-hero-title span {
                        color: #4dd596;
                    }

                    .nb1-home .nb1-hero-description {
                        max-width: 610px;

                        color: #edf8f0 !important;
                        font-size: 18px;
                        font-weight: 400;
                        line-height: 1.8;
                    }

                    .nb1-home .nb1-hero-buttons {
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;
                        gap: 16px;
                        margin-top: 38px;
                    }

                    /* =============================
                       GOMBOK
                       ============================= */

                    .nb1-home .nb1-button {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;

                        min-height: 56px;
                        padding: 15px 28px;
                        border-radius: 8px;

                        font-size: 15px;
                        font-weight: 800;
                        line-height: 1.4;
                        text-align: center;
                        text-decoration: none !important;

                        transition:
                            background 0.2s ease,
                            border-color 0.2s ease,
                            transform 0.2s ease;
                    }

                    .nb1-home .nb1-button-primary {
                        border: 2px solid #176b43;
                        background: #176b43 !important;
                        color: #ffffff !important;
                    }

                    .nb1-home .nb1-button-primary:hover {
                        border-color: #218957;
                        background: #218957 !important;
                        color: #ffffff !important;
                        transform: translateY(-2px);
                    }

                    .nb1-home .nb1-button-secondary {
                        border: 2px solid
                            rgba(255, 255, 255, 0.7);

                        background:
                            rgba(255, 255, 255, 0.10) !important;

                        color: #ffffff !important;
                    }

                    .nb1-home .nb1-button-secondary:hover {
                        background:
                            rgba(255, 255, 255, 0.22) !important;

                        color: #ffffff !important;
                        transform: translateY(-2px);
                    }

                    /* =============================
                       STATISZTIKÁK
                       ============================= */

                    .nb1-home .nb1-statistics {
                        padding: 55px 25px;
                        background: var(--home-green-dark);
                    }

                    .nb1-home .nb1-statistics-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));

                        gap: 25px;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .nb1-home .nb1-stat-card {
                        padding: 36px 20px;

                        border: 1px solid
                            rgba(255, 255, 255, 0.12);
                        border-radius: 10px;

                        background:
                            rgba(255, 255, 255, 0.06);

                        text-align: center;
                    }

                    .nb1-home .nb1-stat-number {
                        margin-bottom: 12px;

                        color: #4dd596 !important;
                        font-size: 54px;
                        font-weight: 900;
                        line-height: 1.2;
                    }

                    .nb1-home .nb1-stat-label {
                        color: #e4f0e8 !important;
                        font-size: 14px;
                        font-weight: 800;
                        letter-spacing: 1px;
                        line-height: 1.5;
                        text-transform: uppercase;
                    }

                    /* =============================
                       ADATBÁZIS BEMUTATÁSA
                       ============================= */

                    .nb1-home .nb1-database {
                        padding: 90px 25px;
                        background: var(--home-background);
                    }

                    .nb1-home .nb1-container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .nb1-home .nb1-section-heading {
                        margin-bottom: 45px;
                        text-align: center;
                    }

                    .nb1-home .nb1-section-label {
                        margin-bottom: 14px;

                        color: var(--home-green) !important;
                        font-size: 13px;
                        font-weight: 800;
                        letter-spacing: 2px;
                        text-transform: uppercase;
                    }

                    .nb1-home .nb1-section-title {
                        margin-bottom: 18px;

                        color:
                            var(--home-green-dark) !important;

                        font-size: clamp(28px, 3.5vw, 40px);
                        font-weight: 900;
                        line-height: 1.25;
                    }

                    .nb1-home .nb1-section-description {
                        max-width: 650px;
                        margin: 0 auto;

                        color: #53675b !important;
                        font-size: 16px;
                        line-height: 1.8;
                    }

                    /* =============================
                       KÁRTYÁK
                       ============================= */

                    .nb1-home .nb1-cards-grid {
                        display: grid;
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                        gap: 30px;
                    }

                    .nb1-home .nb1-feature-card {
                        display: block;
                        min-width: 0;
                        padding: 42px;

                        border: 1px solid #cbdcd1;
                        border-radius: 10px;

                        background: #ffffff;
                        color:
                            var(--home-green-dark) !important;

                        text-decoration: none !important;

                        box-shadow:
                            0 10px 30px
                            rgba(12, 39, 23, 0.06);

                        transition:
                            border-color 0.2s ease,
                            box-shadow 0.2s ease,
                            transform 0.2s ease;
                    }

                    .nb1-home .nb1-feature-card:hover {
                        border-color: var(--home-green);

                        box-shadow:
                            0 15px 36px
                            rgba(12, 39, 23, 0.12);

                        transform: translateY(-4px);
                    }

                    .nb1-home .nb1-feature-icon {
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        width: 78px;
                        height: 78px;
                        margin-bottom: 28px;

                        border-radius: 10px;
                        background: var(--home-green-light);

                        font-size: 36px;
                        line-height: 1;
                    }

                    .nb1-home .nb1-feature-title {
                        margin-bottom: 18px;

                        color:
                            var(--home-green-dark) !important;

                        font-size: 25px;
                        font-weight: 900;
                        line-height: 1.3;
                    }

                    .nb1-home .nb1-feature-description {
                        min-height: 90px;

                        color: #53675b !important;
                        font-size: 15px;
                        line-height: 1.9;
                    }

                    .nb1-home .nb1-feature-link {
                        display: inline-block;
                        margin-top: 28px;

                        color: var(--home-green) !important;
                        font-size: 15px;
                        font-weight: 800;
                    }

                    .nb1-home .nb1-feature-card:hover
                    .nb1-feature-link {
                        color: #218957 !important;
                    }

                    /* =============================
                       TABLET
                       ============================= */

                    @media (max-width: 900px) {
                        .nb1-home .nb1-hero {
                            min-height: 560px;
                        }

                        .nb1-home .nb1-hero-container {
                            padding: 75px 25px;
                        }

                        .nb1-home .nb1-hero-overlay {
                            background: linear-gradient(
                                90deg,
                                rgba(7, 20, 14, 0.94),
                                rgba(7, 20, 14, 0.45)
                            );
                        }
                    }

                    /* =============================
                       MOBIL
                       ============================= */

                    @media (max-width: 768px) {
                        .nb1-home .nb1-hero {
                            min-height: 520px;
                        }

                        .nb1-home .nb1-hero-container {
                            padding: 65px 24px;
                        }

                        .nb1-home .nb1-hero-title {
                            font-size: clamp(
                                34px,
                                8vw,
                                50px
                            );
                        }

                        .nb1-home .nb1-hero-description {
                            font-size: 16px;
                        }

                        .nb1-home .nb1-statistics-grid,
                        .nb1-home .nb1-cards-grid {
                            grid-template-columns: 1fr;
                        }

                        .nb1-home .nb1-database {
                            padding: 65px 20px;
                        }

                        .nb1-home .nb1-feature-card {
                            padding: 30px;
                        }

                        .nb1-home .nb1-feature-description {
                            min-height: 0;
                        }
                    }

                    @media (max-width: 480px) {
                        .nb1-home .nb1-hero-container {
                            padding: 55px 18px;
                        }

                        .nb1-home .nb1-hero-title {
                            font-size: 33px;
                            letter-spacing: -0.5px;
                        }

                        .nb1-home .nb1-hero-buttons {
                            flex-direction: column;
                            align-items: stretch;
                        }

                        .nb1-home .nb1-button {
                            width: 100%;
                        }

                        .nb1-home .nb1-stat-number {
                            font-size: 45px;
                        }
                    }
                `}</style>

                {/* =============================
                    HERO
                    ============================= */}

                <section className="nb1-hero">

                    <div className="nb1-hero-image" />

                    <div className="nb1-hero-overlay" />

                    <div className="nb1-hero-container">

                        <span className="nb1-hero-label">
                            Magyar labdarúgás
                        </span>

                        <h1 className="nb1-hero-title">
                            A MAGYAR
                            <br />

                            <span>
                                LABDARÚGÁS
                            </span>

                            <br />
                            VILÁGA
                        </h1>

                        <p className="nb1-hero-description">
                            Fedezd fel az NB I. klubjait,
                            ismerd meg a labdarúgókat,
                            és böngéssz a magyar bajnokság
                            adatai között!
                        </p>

                        <div className="nb1-hero-buttons">

                            <Link
                                href="/klubok"
                                className="
                                    nb1-button
                                    nb1-button-primary
                                "
                            >
                                Klubok megtekintése
                            </Link>

                            <Link
                                href="/labdarugok"
                                className="
                                    nb1-button
                                    nb1-button-secondary
                                "
                            >
                                Labdarúgók
                            </Link>

                        </div>
                    </div>
                </section>

                {/* =============================
                    DINAMIKUS STATISZTIKÁK
                    ============================= */}

                <section className="nb1-statistics">

                    <div className="nb1-statistics-grid">

                        {statisztikak.map((stat) => (
                            <div
                                key={stat.label}
                                className="nb1-stat-card"
                            >
                                <p className="nb1-stat-number">
                                    {stat.number}
                                </p>

                                <p className="nb1-stat-label">
                                    {stat.label}
                                </p>
                            </div>
                        ))}

                    </div>
                </section>

                {/* =============================
                    ADATBÁZIS BEMUTATÁSA
                    ============================= */}

                <section className="nb1-database">

                    <div className="nb1-container">

                        <div className="nb1-section-heading">

                            <p className="nb1-section-label">
                                NB I. adatbázis
                            </p>

                            <h2 className="nb1-section-title">
                                FEDEZD FEL AZ ADATOKAT
                            </h2>

                            <p className="nb1-section-description">
                                Klubok, játékosok és posztok
                                egy helyen, kereshető formában.
                            </p>

                        </div>

                        <div className="nb1-cards-grid">

                            {/* KLUBOK */}

                            <Link
                                href="/klubok"
                                className="nb1-feature-card"
                            >
                                <div className="nb1-feature-icon">
                                    🏆
                                </div>

                                <h3 className="nb1-feature-title">
                                    NB I. klubok
                                </h3>

                                <p className="nb1-feature-description">
                                    Böngéssz a bajnokság
                                    klubjai között!

                                    Keress klubnév alapján,
                                    és ismerd meg a csapatokat.
                                </p>

                                <span className="nb1-feature-link">
                                    Klubok megtekintése →
                                </span>
                            </Link>

                            {/* LABDARÚGÓK */}

                            <Link
                                href="/labdarugok"
                                className="nb1-feature-card"
                            >
                                <div className="nb1-feature-icon">
                                    ⚽
                                </div>

                                <h3 className="nb1-feature-title">
                                    Labdarúgók
                                </h3>

                                <p className="nb1-feature-description">
                                    Ismerd meg a játékosokat,
                                    klubjaikat és posztjukat!

                                    Tekintsd meg mezszámukat
                                    és nyilvántartott értéküket.
                                </p>

                                <span className="nb1-feature-link">
                                    Játékosok megtekintése →
                                </span>
                            </Link>

                        </div>
                    </div>
                </section>

            </div>
        </Nb1Layout>
    );
}