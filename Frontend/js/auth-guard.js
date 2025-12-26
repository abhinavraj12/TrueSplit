/**
 * auth-guard.js - Simple Authentication Guard
 * Protects routes that require authentication
 * Reusable and minimal implementation
 */

class AuthGuard {
    constructor() {
        this.PROTECTED_ROUTES = ['/dashboard'];
        this.AUTH_CHECK_ENDPOINT = 'http://localhost:8080/api/me';
        this.LOGIN_PAGE = '/auth';
        this.HOME_PAGE = '/';
        
        // Routes that should redirect to dashboard if already logged in
        this.REDIRECT_IF_AUTHED = ['/', '/auth', '/index.html'];
    }
    
    // Initialize the auth guard
    init() {
        const currentPath = window.location.pathname;
        
        // Check if current route needs protection
        if (this.isProtectedRoute(currentPath)) {
            this.protectRoute();
        }
        
        // Check if current route should redirect if already authenticated
        if (this.shouldRedirectIfAuthed(currentPath)) {
            this.redirectIfAuthed();
        }
    }
    
    // Check if a route requires authentication
    isProtectedRoute(path) {
        return this.PROTECTED_ROUTES.some(route => 
            path === route || 
            path === `${route}.html` ||
            path.endsWith(`${route}.html`)
        );
    }
    
    // Check if route should redirect if already authenticated
    shouldRedirectIfAuthed(path) {
        return this.REDIRECT_IF_AUTHED.some(route => 
            path === route || 
            path === `${route}.html` ||
            (route !== '/' && path.endsWith(`${route}.html`))
        );
    }
    
    // Protect a route by checking authentication
    async protectRoute() {
        try {
            const response = await fetch(this.AUTH_CHECK_ENDPOINT, {
                method: 'GET',
                credentials: 'include', // Important for HttpOnly cookies
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                // Not authenticated, redirect to login
                this.redirectToLogin();
                return false;
            }
            
            // User is authenticated, proceed with page
            const userData = await response.json();
            this.updateUIWithUserInfo(userData);
            return true;
            
        } catch (error) {
            console.error('Auth check failed:', error);
            this.redirectToLogin();
            return false;
        }
    }
    
    // Redirect to login page
    redirectToLogin() {
        // Store the intended destination for after login
        const currentUrl = window.location.pathname;
        if (currentUrl !== this.LOGIN_PAGE) {
            sessionStorage.setItem('redirectAfterLogin', currentUrl);
        }
        
        window.location.href = this.LOGIN_PAGE;
    }
    
    // Redirect to dashboard if already authenticated
    async redirectIfAuthed() {
        try {
            const response = await fetch(this.AUTH_CHECK_ENDPOINT, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Already authenticated, redirect to dashboard
                window.location.href = '/dashboard';
            }
        } catch (error) {
            // Not authenticated, stay on current page
            console.debug('User not authenticated, staying on page');
        }
    }
    
    // Update UI with user information (optional)
    updateUIWithUserInfo(userData) {
        // You can use this to update the UI with user info
        // For example, update the username in the dashboard
        const userNameElements = document.querySelectorAll('.app-user-name');
        if (userNameElements.length > 0 && userData && userData.username) {
            const email = userData.username;
            const displayName = email.split('@')[0]; // Simple extraction
            userNameElements.forEach(el => {
                el.textContent = `Welcome, ${displayName}`;
            });
        }
    }
    
    // Add a route to the protected list (for future use)
    addProtectedRoute(route) {
        if (!this.PROTECTED_ROUTES.includes(route)) {
            this.PROTECTED_ROUTES.push(route);
        }
    }
    
    // Check if user is authenticated (for other components to use)
    async checkAuth() {
        try {
            const response = await fetch(this.AUTH_CHECK_ENDPOINT, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            return response.ok;
        } catch (error) {
            return false;
        }
    }
    
    // Logout function
    async logout() {
        try {
            // Show loading/confirmation
            if (window.Dashboard && window.Dashboard.showToast) {
                window.Dashboard.showToast('Logging out...', 'info');
            }
            
            // Call backend logout endpoint
            const response = await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                credentials: 'include', // Important for sending cookies
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                // Clear client-side storage
                sessionStorage.clear();
                localStorage.removeItem('truesplit_theme');
                
                // Show success message
                if (window.Dashboard && window.Dashboard.showToast) {
                    window.Dashboard.showToast('Logged out successfully!', 'success');
                }
                
                // Wait a moment for toast to show, then redirect
                setTimeout(() => {
                    // Redirect to home page with cache buster
                    window.location.href = `${this.HOME_PAGE}?logout=${Date.now()}`;
                }, 1000);
                
            } else {
                throw new Error('Logout request failed');
            }
            
        } catch (error) {
            console.error('Logout error:', error);
            
            // Fallback: try to clear cookies client-side and redirect
            document.cookie = "TS_AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "TS_AUTH=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;";
            
            // Show error message
            if (window.Dashboard && window.Dashboard.showToast) {
                window.Dashboard.showToast('Logout completed', 'info');
            }
            
            // Still redirect to home
            setTimeout(() => {
                window.location.href = this.HOME_PAGE;
            }, 500);
        }
    }
}

// Initialize auth guard immediately
const authGuard = new AuthGuard();

// Auto-initialize when included in dashboard
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => authGuard.init());
} else {
    authGuard.init();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthGuard;
} else if (typeof window !== 'undefined') {
    window.AuthGuard = authGuard;
}