'use client';

import { useEffect, useRef, useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { useLogin } from '@/features/auth';
import { ROUTES } from '@/shared/config';
import { SocialLoginButton } from '@/shared/_components/molecules/SocialLoginButton/SocialLoginButton';
import { Typography } from '@/shared/_components/atoms/Typography';
import Link from 'next/link';
import { 
  FaCheckCircle, 
  FaShieldAlt, 
  FaUsers, 
  FaRocket,
} from 'react-icons/fa';
import styles from './LoginForm.module.css';

// ============================================
// Scroll Context for Parallax Effect
// ============================================

interface ScrollContextValue {
  scrollY: number;
  heroProgress: number;
}

const ScrollContext = createContext<ScrollContextValue>({ scrollY: 0, heroProgress: 0 });

export const useScroll = () => useContext(ScrollContext);

interface ScrollProviderProps {
  children: ReactNode;
}

const ScrollProvider = ({ children }: ScrollProviderProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [heroProgress, setHeroProgress] = useState(0);
  const heroRef = useRef<HTMLElement | null>(null);
  const rafId = useRef<number | null>(null);
  const initialRafId = useRef<number | null>(null);

  const updateScroll = useCallback(() => {
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    const windowHeight = window.innerHeight;

    const heroEl = heroRef.current;
    let heroHeight = windowHeight * 0.7;
    let heroTop = 0;

    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      heroHeight = rect.height;
      heroTop = rect.top + currentScrollY;
    }

    const scrolled = Math.max(0, currentScrollY - heroTop);
    const progress = Math.min(1, scrolled / (heroHeight * 0.6));

    setScrollY(currentScrollY);
    setHeroProgress(progress);
    rafId.current = null;
  }, []);

  const onScroll = useCallback(() => {
    if (rafId.current === null) {
      rafId.current = requestAnimationFrame(updateScroll);
    }
  }, [updateScroll]);

  useEffect(() => {
    const hero = document.querySelector('[data-hero-section]') as HTMLElement;
    if (hero) heroRef.current = hero;

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });

    initialRafId.current = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScroll);
      if (initialRafId.current !== null) {
        cancelAnimationFrame(initialRafId.current);
      }
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [onScroll, updateScroll]);

  return (
    <ScrollContext.Provider value={{ scrollY, heroProgress }}>
      {children}
    </ScrollContext.Provider>
  );
};

// ============================================
// LoginForm Component
// ============================================

export const LoginForm = () => {
  const { providers, selectedProvider, isLoggingIn, error, loginWithProvider, clearError } =
    useLogin();

  const loadingProvider = isLoggingIn ? selectedProvider : null;

  const primaryProvider = providers.find((p) => p.id === 'google');
  const secondaryProviders = providers.filter((p) => p.id !== 'google');

  return (
    <ScrollProvider>
      <div className={styles.container}>
        <HeroSection />
        <AuthSection
          primaryProvider={primaryProvider}
          secondaryProviders={secondaryProviders}
          loadingProvider={loadingProvider}
          error={error}
          clearError={clearError}
          loginWithProvider={loginWithProvider}
        />
      </div>
    </ScrollProvider>
  );
};

// ============================================
// Hero Section (Left Column)
// ============================================

const HeroSection = () => {
  const { heroProgress } = useScroll();

  const bgTranslateY = heroProgress * 12;
  const contentTranslateY = heroProgress * 25;
  const contentOpacity = Math.max(0.85, 1 - heroProgress * 0.15);

  return (
    <section 
      className={styles.heroSection} 
      data-hero-section
      style={{
        transform: `translateY(${-bgTranslateY}px)`,
        willChange: 'transform',
      }}
    >
      <div className={styles.heroInner}>
        <div 
          className={styles.brand}
          style={{
            transform: `translateY(${-contentTranslateY * 0.6}px)`,
            opacity: contentOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <span className={styles.brandLogo}>TrueSplit</span>
        </div>

        <div 
          className={styles.heroContent}
          style={{
            transform: `translateY(${-contentTranslateY}px)`,
            opacity: contentOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <h1 className={styles.heroTitle}>
            Split
            <br />
            expenses.
            <br />
            <span className={styles.heroTitleEmphasis}>
              Keep
              <br />
              friendships.
            </span>
          </h1>

          <div className={styles.heroSubtext}>
            <div className={styles.subtextItem}>
              <span className={styles.subtextIcon} aria-hidden="true">✦</span>
              <span>No awkward reminders.</span>
            </div>
            <div className={styles.subtextItem}>
              <span className={styles.subtextIcon} aria-hidden="true">✦</span>
              <span>No confusing spreadsheets.</span>
            </div>
            <div className={styles.subtextItem}>
              <span className={styles.subtextIcon} aria-hidden="true">✦</span>
              <span>Just fair sharing.</span>
            </div>
          </div>
        </div>

        <div 
          className={styles.trustSection}
          style={{
            transform: `translateY(${-contentTranslateY * 0.4}px)`,
            opacity: contentOpacity,
            willChange: 'transform, opacity',
          }}
        >
          <div className={styles.avatars}>
            <div className={styles.avatarStack}>
              <div className={styles.avatar} style={{ background: '#8B5CFC' }}>JD</div>
              <div className={styles.avatar} style={{ background: '#A78BFA' }}>AK</div>
              <div className={styles.avatar} style={{ background: '#6D28D9' }}>SM</div>
              <div className={styles.avatar} style={{ background: '#5CB08E' }}>RJ</div>
              <div className={styles.avatar} style={{ background: '#E8C86A' }}>+</div>
            </div>
            <div className={styles.trustText}>
              <span>Trusted by thousands</span>
              <span className={styles.trustHighlight}>to split smarter.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Auth Section (Right Column)
// ============================================

interface AuthSectionProps {
  primaryProvider: { id: string; name: string; icon: string; color: string; textColor: string } | undefined;
  secondaryProviders: Array<{ id: string; name: string; icon: string; color: string; textColor: string }>;
  loadingProvider: string | null;
  error: string | null;
  clearError: () => void;
  loginWithProvider: (providerId: string) => void;
}

const AuthSection = ({
  primaryProvider,
  secondaryProviders,
  loadingProvider,
  error,
  clearError,
  loginWithProvider,
}: AuthSectionProps) => {
  return (
    <section className={styles.authSection}>
      <div className={styles.authInner}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h2 className={styles.authTitle}>Welcome back</h2>
            <p className={styles.authSubtext}>Continue where you left off.</p>
          </div>

          {error && (
            <div className={styles.errorContainer}>
              <Typography variant="small" color="error" className={styles.errorText}>
                {error}
              </Typography>
              <button
                onClick={clearError}
                className={styles.errorDismiss}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {primaryProvider && (
            <SocialLoginButton
              key={primaryProvider.id}
              provider={primaryProvider.id as "google" | "facebook" | "apple"}
              onClick={() => loginWithProvider(primaryProvider.id)}
              isLoading={loadingProvider === primaryProvider.id}
              fullWidth
              className={styles.primaryButton}
            />
          )}

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <div className={styles.secondaryButtons}>
            {secondaryProviders.map((provider) => (
              <SocialLoginButton
                key={provider.id}
                provider={provider.id as "google" | "facebook" | "apple"}
                onClick={() => loginWithProvider(provider.id)}
                isLoading={loadingProvider === provider.id}
                fullWidth
                className={styles.secondaryButton}
              />
            ))}
          </div>

          <div className={styles.valueReminder}>
            <span className={styles.valueIcon} aria-hidden="true">✦</span>
            <span className={styles.valueText}>
              Your expenses. Your groups. One place.
            </span>
          </div>

          <div className={styles.trustFeatures}>
            <div className={styles.trustFeature}>
              <FaCheckCircle className={styles.featureIcon} />
              <span>Free forever</span>
            </div>
            <div className={styles.trustFeature}>
              <FaShieldAlt className={styles.featureIcon} />
              <span>Bank‑level security</span>
            </div>
            <div className={styles.trustFeature}>
              <FaUsers className={styles.featureIcon} />
              <span>Loved by thousands</span>
            </div>
            <div className={styles.trustFeature}>
              <FaRocket className={styles.featureIcon} />
              <span>Settle instantly</span>
            </div>
          </div>

          <div className={styles.legalNotice}>
            <Typography variant="small" color="muted" className={styles.legalText}>
              By continuing, you agree to our{' '}
              <Link href={ROUTES.TERMS} className={styles.legalLink}>
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href={ROUTES.PRIVACY} className={styles.legalLink}>
                Privacy Policy
              </Link>
              .
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm;