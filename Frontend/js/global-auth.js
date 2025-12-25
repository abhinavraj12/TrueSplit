/**
 * global-auth.js - Global authentication check for all pages
 * This should be included in EVERY HTML page
 */

(function() {
    'use strict';
    
    function checkAuth() {
        const token = localStorage.getItem('auth_token');
        
        // Check if token exists and is valid
        if (token) {
            try {
                const parts = token.split('.');
                if (parts.length !== 3) {
                    localStorage.removeItem('auth_token');
                    return false;
                }
                
                const payload = JSON.parse(atob(parts[1]));
                const now = Math.floor(Date.now() / 1000);
                
                if (payload.exp && payload.exp < now) {
                    localStorage.removeItem('auth_token');
                    return false;
                }
                
                return true;
            } catch (error) {
                localStorage.removeItem('auth_token');
                return false;
            }
        }
        
        return false;
    }
    
    function shouldProtectRoute() {
        const path = window.location.pathname;
        
        // Routes that require user to be logged OUT
        const publicRoutes = ['/', '/index.html', '/auth', '/auth.html', '/oauth-callback.html'];
        
        // Routes that require user to be logged IN
        const privateRoutes = ['/dashboard', '/dashboard.html'];
        
        const isAuthenticated = checkAuth();
        
        // If user is logged in and trying to access public routes, redirect to dashboard
        if (isAuthenticated && publicRoutes.includes(path)) {
            // Don't redirect if we're on oauth-callback (that's handling the token)
            if (path !== '/oauth-callback.html') {
                window.location.href = '/dashboard';
            }
        }
        
        // If user is not logged in and trying to access private routes, redirect to auth
        if (!isAuthenticated && privateRoutes.includes(path)) {
            window.location.href = '/auth';
        }
    }
    
    // Run check when page loads
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(shouldProtectRoute, 10);
    });
    
    // Also check when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            shouldProtectRoute();
        }
    });
})();