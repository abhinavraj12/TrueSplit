/**
 * Authentication helper for TrueSplit
 * Handles token storage, validation, and route protection
 */

class AuthHelper {
    static TOKEN_KEY = 'auth_token';
    static USER_KEY = 'user_data';
    
    /**
     * Check if user is authenticated
     */
    static isAuthenticated() {
        const token = localStorage.getItem(this.TOKEN_KEY);
        return !!token && this.isTokenValid(token);
    }
    
    /**
     * Validate token structure (basic validation)
     */
    static isTokenValid(token) {
        if (!token) return false;
        
        try {
            // Simple JWT validation - check if it has 3 parts
            const parts = token.split('.');
            if (parts.length !== 3) return false;
            
            // Decode payload to check expiration
            const payload = JSON.parse(atob(parts[1]));
            const now = Math.floor(Date.now() / 1000);
            
            // Check if token is expired
            if (payload.exp && payload.exp < now) {
                this.clearAuth();
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Token validation error:', error);
            this.clearAuth();
            return false;
        }
    }
    
    /**
     * Get stored token
     */
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    
    /**
     * Clear authentication data
     */
    static clearAuth() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
    
    /**
     * Redirect authenticated users from auth pages
     */
    static protectAuthRoutes() {
        const currentPath = window.location.pathname;
        
        // Routes that should not be accessible when logged in
        const authRoutes = ['/', '/auth', '/index.html', '/auth.html'];
        
        if (authRoutes.includes(currentPath) && this.isAuthenticated()) {
            window.location.href = '/dashboard';
        }
    }
    
    /**
     * Protect dashboard routes - redirect to auth if not logged in
     */
    static protectDashboardRoutes() {
        const currentPath = window.location.pathname;
        
        // Routes that require authentication
        const protectedRoutes = ['/dashboard', '/dashboard.html'];
        
        if (protectedRoutes.includes(currentPath) && !this.isAuthenticated()) {
            window.location.href = '/auth';
        }
    }
    
    /**
     * Logout user
     */
    static logout() {
        this.clearAuth();
        window.location.href = '/';
    }
    
    /**
     * Get user info from token
     */
    static getUserInfo() {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            return {
                email: payload.sub,
                roles: payload.roles || []
            };
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    }
    
    /**
     * Add authentication to fetch requests
     */
    static authFetch(url, options = {}) {
        const token = this.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return fetch(url, {
            ...options,
            headers
        });
    }
}

// Apply route protection on page load
document.addEventListener('DOMContentLoaded', function() {
    AuthHelper.protectAuthRoutes();
    AuthHelper.protectDashboardRoutes();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthHelper;
} else if (typeof window !== 'undefined') {
    window.AuthHelper = AuthHelper;
}