/**
 * auth.js - Professional Authentication
 * Handles Google OAuth flow with clean UX
 * Production-ready code
 */

class AuthManager {
    constructor() {
        this.googleAuthOrb = document.getElementById('googleAuthOrb');
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupOneTimeAnimations();
    }
    
    setupEventListeners() {
        if (this.googleAuthOrb) {
            this.googleAuthOrb.addEventListener('click', () => this.handleGoogleAuth());
            
            this.googleAuthOrb.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleGoogleAuth();
                }
            });
        }
    }
    
    setupAccessibility() {
        if (this.googleAuthOrb) {
            this.googleAuthOrb.setAttribute('role', 'button');
            this.googleAuthOrb.setAttribute('tabindex', '0');
            this.googleAuthOrb.setAttribute('aria-describedby', 'orb-description');
        }
        
        const description = document.createElement('div');
        description.id = 'orb-description';
        description.className = 'app-sr-only';
        description.textContent = 'Secure Google authentication button. Press Enter or Space to continue.';
        document.body.appendChild(description);
        
        const liveRegion = document.createElement('div');
        liveRegion.id = 'auth-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'app-sr-only';
        document.body.appendChild(liveRegion);
    }
    
    setupOneTimeAnimations() {
        // Wave animation plays once on load - handled by CSS
        // Add subtle logo animation
        const logo = document.querySelector('.app-auth-logo');
        if (logo) {
            setTimeout(() => {
                logo.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    logo.style.transform = 'scale(1)';
                }, 200);
            }, 1000);
        }
    }
    
    async handleGoogleAuth() {
        try {
            this.setLoadingState(true);
            this.createLoadingEffect();
            
            await this.initiateGoogleOAuth();
            
            this.showSuccessAnimation();
            
            setTimeout(() => {
                window.location.href = 'http://localhost:8080/oauth2/authorization/google';
            }, 800);
            
        } catch (error) {
            console.error('Authentication error:', error);
            this.showErrorState();
        }
    }
    
    setLoadingState(isLoading) {
        if (!this.googleAuthOrb) return;
        
        if (isLoading) {
            this.googleAuthOrb.disabled = true;
            this.googleAuthOrb.style.opacity = '0.7';
            this.googleAuthOrb.style.cursor = 'wait';
            
            const orbTexts = this.googleAuthOrb.querySelectorAll('.app-orb-text');
            if (orbTexts.length >= 2) {
                orbTexts[0].textContent = 'Authenticating';
                orbTexts[1].textContent = '...';
            }
        } else {
            this.googleAuthOrb.disabled = false;
            this.googleAuthOrb.style.opacity = '1';
            this.googleAuthOrb.style.cursor = 'pointer';
            
            const orbTexts = this.googleAuthOrb.querySelectorAll('.app-orb-text');
            if (orbTexts.length >= 2) {
                orbTexts[0].textContent = 'Continue with';
                orbTexts[1].textContent = 'Google';
            }
        }
    }
    
    createLoadingEffect() {
        const portal = document.querySelector('.app-google-portal');
        if (!portal) return;
        
        const ripple = document.createElement('div');
        ripple.className = 'app-loading-ripple';
        portal.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode === portal) {
                ripple.remove();
            }
        }, 1200);
    }
    
    async initiateGoogleOAuth() {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Redirecting to Google OAuth...');
                resolve();
            }, 800);
        });
    }
    
    showSuccessAnimation() {
        const portal = document.querySelector('.app-google-portal');
        if (!portal) return;
        
        const explosion = document.createElement('div');
        explosion.className = 'app-success-explosion';
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'app-success-particle';
            explosion.appendChild(particle);
        }
        
        portal.appendChild(explosion);
        
        setTimeout(() => {
            if (explosion.parentNode === portal) {
                explosion.remove();
            }
        }, 1000);
    }
    
    showErrorState() {
        this.setLoadingState(false);
        
        if (this.googleAuthOrb) {
            this.googleAuthOrb.style.boxShadow = '0 0 0 3px var(--app-accent-red)';
            
            setTimeout(() => {
                this.googleAuthOrb.style.boxShadow = '';
            }, 2000);
        }
        
        this.announceToScreenReader('Authentication failed. Please try again.');
    }
    
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('auth-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            
            setTimeout(() => {
                if (liveRegion.textContent === message) {
                    liveRegion.textContent = '';
                }
            }, 3000);
        }
    }
}

// Add utility CSS
const style = document.createElement('style');
style.textContent = `
    .app-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new AuthManager();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}