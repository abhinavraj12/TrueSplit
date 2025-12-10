/**
 * dashboard.js - Modern Minimal Dashboard
 * Handles interactivity, tooltips, and dynamic behaviors
 * Modular, accessible, production-ready
 * Author: TrueSplit Team
 * Version: 1.0
 */

;(function() {
    'use strict';
    
    // Dashboard module
    const Dashboard = {
        // Configuration
        config: {
            tooltipDelay: 100,
            animationDuration: 300,
            breakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1280
            }
        },
        
        // State
        state: {
            currentTheme: document.documentElement.getAttribute('data-theme') || 'dark',
            tooltipVisible: false,
            tooltipTimeout: null
        },
        
        // DOM References
        dom: {
            tooltip: null,
            toastContainer: null,
            addExpenseBtn: null,
            settleUpBtn: null,
            themeToggle: null
        },
        
        // Initialize dashboard
        init: function() {
            this.cacheDOM();
            this.setupEventListeners();
            this.setupTooltips();
            this.setupThemeToggle();
            this.setupResponsiveBehavior();
            this.animateElements();
            this.loadUserPreferences();
            
            console.log('Dashboard initialized');
        },
        
        // Cache DOM elements
        cacheDOM: function() {
            this.dom.tooltip = document.getElementById('globalTooltip');
            this.dom.toastContainer = document.getElementById('toastContainer');
            this.dom.addExpenseBtn = document.getElementById('addExpenseBtn');
            this.dom.settleUpBtn = document.getElementById('settleUpBtn');
            this.dom.themeToggle = document.querySelector('.app-theme-toggle');
        },
        
        // Setup event listeners
        setupEventListeners: function() {
            // Add Expense button
            if (this.dom.addExpenseBtn) {
                this.dom.addExpenseBtn.addEventListener('click', this.handleAddExpense.bind(this));
                this.dom.addExpenseBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleAddExpense();
                    }
                });
            }
            
            // Settle Up button
            if (this.dom.settleUpBtn) {
                this.dom.settleUpBtn.addEventListener('click', this.handleSettleUp.bind(this));
                this.dom.settleUpBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleSettleUp();
                    }
                });
            }
            
            // Navigation items
            const navItems = document.querySelectorAll('.app-nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!item.href || item.getAttribute('href') === '#') {
                        e.preventDefault();
                        this.handleNavClick(item);
                    }
                });
                
                // Keyboard navigation
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.click();
                    }
                });
            });
            
            // Card actions
            const cardActions = document.querySelectorAll('.app-card-action');
            cardActions.forEach(action => {
                action.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handleCardAction(action);
                });
                
                action.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        action.click();
                    }
                });
            });
            
            // Quick actions
            const quickActions = document.querySelectorAll('.app-quick-action');
            quickActions.forEach(action => {
                action.addEventListener('click', () => {
                    this.handleQuickAction(action);
                });
                
                action.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        action.click();
                    }
                });
            });
            
            // Notification button
            const notificationBtn = document.querySelector('.app-notification-btn');
            if (notificationBtn) {
                notificationBtn.addEventListener('click', this.handleNotifications.bind(this));
                notificationBtn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        notificationBtn.click();
                    }
                });
            }
            
            // Keyboard shortcuts
            document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));
            
            // Window resize
            window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        },
        
        // Setup tooltip system
        setupTooltips: function() {
            const tooltipElements = document.querySelectorAll('[data-tooltip]');
            
            tooltipElements.forEach(element => {
                // Mouse events
                element.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, e.target.dataset.tooltip);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
                
                // Focus events for accessibility
                element.addEventListener('focus', (e) => {
                    this.showTooltip(e.target, e.target.dataset.tooltip);
                });
                
                element.addEventListener('blur', () => {
                    this.hideTooltip();
                });
                
                // Touch events for mobile
                element.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.showTooltip(e.target, e.target.dataset.tooltip);
                    
                    // Hide tooltip after delay on touch devices
                    setTimeout(() => {
                        this.hideTooltip();
                    }, 2000);
                });
            });
            
            // Close tooltip on ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.state.tooltipVisible) {
                    this.hideTooltip();
                }
            });
        },
        
        // Show tooltip
        showTooltip: function(element, text) {
            if (!text || !this.dom.tooltip) return;
            
            clearTimeout(this.state.tooltipTimeout);
            
            this.dom.tooltip.textContent = text;
            this.dom.tooltip.classList.add('visible');
            this.dom.tooltip.setAttribute('aria-hidden', 'false');
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = this.dom.tooltip.getBoundingClientRect();
            
            let top = rect.top - tooltipRect.height - 10;
            let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
            
            // Adjust position if tooltip would go off screen
            if (top < 10) {
                top = rect.bottom + 10;
            }
            
            if (left < 10) {
                left = 10;
            }
            
            if (left + tooltipRect.width > window.innerWidth - 10) {
                left = window.innerWidth - tooltipRect.width - 10;
            }
            
            this.dom.tooltip.style.top = `${top}px`;
            this.dom.tooltip.style.left = `${left}px`;
            
            this.state.tooltipVisible = true;
        },
        
        // Hide tooltip
        hideTooltip: function() {
            if (!this.dom.tooltip) return;
            
            this.state.tooltipTimeout = setTimeout(() => {
                this.dom.tooltip.classList.remove('visible');
                this.dom.tooltip.setAttribute('aria-hidden', 'true');
                this.state.tooltipVisible = false;
            }, this.config.tooltipDelay);
        },
        
        // Setup theme toggle
        setupThemeToggle: function() {
            if (!this.dom.themeToggle) return;
            
            this.dom.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
            this.dom.themeToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
            
            // Update icon on load
            this.updateThemeIcon();
            
            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
            mediaQuery.addEventListener('change', (e) => {
                if (!document.documentElement.hasAttribute('data-theme')) {
                    this.state.currentTheme = e.matches ? 'light' : 'dark';
                    this.updateThemeIcon();
                }
            });
        },
        
        // Toggle theme
        toggleTheme: function() {
            this.state.currentTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', this.state.currentTheme);
            
            // Save preference
            this.saveUserPreference('theme', this.state.currentTheme);
            
            // Update icon
            this.updateThemeIcon();
            
            // Show feedback
            this.showToast(`Theme switched to ${this.state.currentTheme} mode`, 'info');
        },
        
        // Update theme icon
        updateThemeIcon: function() {
            if (!this.dom.themeToggle) return;
            
            const icon = this.dom.themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.state.currentTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
                this.dom.themeToggle.setAttribute('aria-label', 
                    `Toggle theme (current: ${this.state.currentTheme})`);
            }
        },
        
        // Setup responsive behavior
        setupResponsiveBehavior: function() {
            this.handleResize();
        },
        
        // Handle window resize
        handleResize: function() {
            const width = window.innerWidth;
            const body = document.body;
            
            // Update body classes for CSS targeting
            body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
            
            if (width < this.config.breakpoints.mobile) {
                body.classList.add('is-mobile');
            } else if (width < this.config.breakpoints.tablet) {
                body.classList.add('is-tablet');
            } else {
                body.classList.add('is-desktop');
            }
            
            // Hide tooltip on resize
            this.hideTooltip();
        },
        
        // Animate elements on load
        animateElements: function() {
            // Add fade-in animation to cards with delay
            const cards = document.querySelectorAll('.app-content-card');
            cards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
                card.classList.add('app-fade-in');
            });
            
            // Animate stats
            const statValues = document.querySelectorAll('.app-stat-card-value');
            statValues.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 300);
                }, 500 + (index * 100));
            });
        },
        
        // Handle Add Expense
        handleAddExpense: function() {
            const button = this.dom.addExpenseBtn;
            const originalHTML = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Adding...</span>';
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            
            // Simulate API call
            setTimeout(() => {
                // Restore button
                button.innerHTML = originalHTML;
                button.disabled = false;
                button.setAttribute('aria-busy', 'false');
                
                // Show success message
                this.showToast('Expense added successfully!', 'success');
            }, 1500);
        },
        
        // Handle Settle Up
        handleSettleUp: function() {
            if (confirm('Are you sure you want to settle all balances? This action cannot be undone.')) {
                const button = this.dom.settleUpBtn;
                const originalHTML = button.innerHTML;
                
                button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i><span>Processing...</span>';
                button.disabled = true;
                button.setAttribute('aria-busy', 'true');
                
                // Simulate API call
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                    button.setAttribute('aria-busy', 'false');
                    
                    this.showToast('All balances settled successfully!', 'success');
                    this.updateBalanceDisplay();
                }, 2000);
            }
        },
        
        // Handle navigation click
        handleNavClick: function(item) {
            // Update active state
            document.querySelectorAll('.app-nav-item').forEach(navItem => {
                navItem.classList.remove('app-nav-item--active');
                navItem.setAttribute('aria-current', 'false');
            });
            
            item.classList.add('app-nav-item--active');
            item.setAttribute('aria-current', 'page');
            
            // Get action
            const action = item.querySelector('.app-nav-text').textContent;
            this.showToast(`Loading ${action}...`, 'info');
            
            // Show loading for section
            this.showLoadingState(action);
        },
        
        // Handle card action
        handleCardAction: function(action) {
            const card = action.closest('.app-card');
            const title = card.querySelector('.app-card-title').textContent;
            
            // Visual feedback
            action.style.transform = 'scale(0.95)';
            setTimeout(() => {
                action.style.transform = 'scale(1)';
            }, 150);
            
            this.showToast(`Action for ${title}`, 'info');
        },
        
        // Handle quick action
        handleQuickAction: function(action) {
            const actionText = action.querySelector('span').textContent;
            
            // Visual feedback
            action.style.transform = 'scale(0.95)';
            setTimeout(() => {
                action.style.transform = 'scale(1)';
            }, 150);
            
            switch(actionText.toLowerCase()) {
                case 'search':
                    this.focusSearch();
                    break;
                case 'recent':
                    this.showRecentActivity();
                    break;
                case 'new group':
                    this.createNewGroup();
                    break;
            }
        },
        
        // Handle notifications
        handleNotifications: function() {
            const badge = document.querySelector('.app-notification-badge');
            if (badge && badge.textContent !== '0') {
                badge.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                    badge.textContent = '0';
                }, 300);
                
                this.showToast('Notifications cleared', 'info');
            }
        },
        
        // Handle keyboard shortcuts
        handleKeyboardShortcuts: function(e) {
            // Don't trigger in inputs/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            // Ctrl/Cmd + N: Add expense
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.handleAddExpense();
            }
            
            // Ctrl/Cmd + S: Settle up
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.handleSettleUp();
            }
            
            // /: Focus search
            if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.focusSearch();
            }
            
            // ?: Show help
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }
        },
        
        // Focus search
        focusSearch: function() {
            // this.showToast('Search focus activated. Type to search.', 'info');
            
            // Implementation for search focus would go here
            // For now, just show a toast
        },
        
        // Show recent activity
        showRecentActivity: function() {
            const recentItem = document.querySelector('[aria-label*="Recent activity"]');
            if (recentItem) {
                recentItem.click();
            }
        },
        
        // Create new group
        createNewGroup: function() {
            this.showToast('Creating new group...', 'info');
            
            setTimeout(() => {
                this.showToast('New group created!', 'success');
            }, 1000);
        },
        
        // Show loading state
        showLoadingState: function(section) {
            const mainContent = document.querySelector('.app-dashboard-main-content');
            if (!mainContent) return;
            
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'app-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="app-loading-spinner">
                    <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
                    <p>Loading ${section}...</p>
                </div>
            `;
            
            loadingOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(var(--app-bg-surface-rgb, 38, 38, 38), 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
                border-radius: var(--app-border-radius);
            `;
            
            mainContent.appendChild(loadingOverlay);
            
            setTimeout(() => {
                loadingOverlay.remove();
            }, 800);
        },
        
        // Update balance display
        updateBalanceDisplay: function() {
            // Update UI after settlement
            const balanceValues = document.querySelectorAll('.app-stat-value');
            const chartProgress = document.querySelector('.app-chart-progress');
            
            balanceValues.forEach(value => {
                if (value.classList.contains('negative') || value.classList.contains('positive')) {
                    value.textContent = '$0.00';
                    value.classList.remove('negative', 'positive');
                }
            });
            
            if (chartProgress) {
                chartProgress.style.setProperty('--progress', '100%');
            }
        },
        
        // Show toast
        showToast: function(message, type = 'info') {
            if (!this.dom.toastContainer) {
                this.dom.toastContainer = document.createElement('div');
                this.dom.toastContainer.className = 'app-toast-container';
                this.dom.toastContainer.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
                document.body.appendChild(this.dom.toastContainer);
            }
            
            const toast = document.createElement('div');
            toast.className = `app-toast app-toast--${type}`;
            toast.setAttribute('role', 'alert');
            toast.setAttribute('aria-live', 'polite');
            
            const colors = {
                success: 'var(--app-accent-green)',
                error: 'var(--app-accent-red)',
                info: 'var(--app-accent-blue)'
            };
            
            toast.innerHTML = `
                <div class="app-toast__content">
                    <div class="app-toast__message">${message}</div>
                    <button class="app-toast__close" aria-label="Close notification">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
            `;
            
            toast.style.cssText = `
                background: var(--app-bg-surface);
                border: 1px solid var(--app-border-primary);
                border-left: 4px solid ${colors[type] || colors.info};
                border-radius: var(--app-border-radius);
                padding: 12px 16px;
                box-shadow: var(--app-shadow-lg);
                max-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                transition: transform 0.3s var(--app-ease-out), opacity 0.3s var(--app-ease-out);
            `;
            
            this.dom.toastContainer.appendChild(toast);
            
            // Animate in
            setTimeout(() => {
                toast.style.transform = 'translateX(0)';
                toast.style.opacity = '1';
            }, 10);
            
            // Close button
            const closeBtn = toast.querySelector('.app-toast__close');
            closeBtn.addEventListener('click', () => {
                this.hideToast(toast);
            });
            
            // Auto-remove
            setTimeout(() => {
                this.hideToast(toast);
            }, 5000);
        },
        
        // Hide toast
        hideToast: function(toast) {
            if (toast && toast.parentNode) {
                toast.style.transform = 'translateX(100%)';
                toast.style.opacity = '0';
                
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }
        },
        
        // Show keyboard shortcuts
        showKeyboardShortcuts: function() {
            const shortcuts = [
                { key: 'Ctrl/Cmd + N', action: 'Add new expense' },
                { key: 'Ctrl/Cmd + S', action: 'Settle all balances' },
                { key: '/', action: 'Focus search' },
                { key: 'Escape', action: 'Close tooltips/modals' },
                { key: '?', action: 'Show this help' }
            ];
            
            let message = '<strong>Keyboard Shortcuts</strong><br>';
            shortcuts.forEach(shortcut => {
                message += `<br>${shortcut.key}: ${shortcut.action}`;
            });
            
            this.showToast(message, 'info');
        },
        
        // Save user preference
        saveUserPreference: function(key, value) {
            try {
                localStorage.setItem(`truesplit_${key}`, value);
            } catch (e) {
                console.warn('Could not save preference:', e);
            }
        },
        
        // Load user preferences
        loadUserPreferences: function() {
            try {
                const savedTheme = localStorage.getItem('truesplit_theme');
                if (savedTheme) {
                    this.state.currentTheme = savedTheme;
                    document.documentElement.setAttribute('data-theme', savedTheme);
                    this.updateThemeIcon();
                }
            } catch (e) {
                console.warn('Could not load preferences:', e);
            }
        },
        
        // Debounce function
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Dashboard.init());
    } else {
        Dashboard.init();
    }
    
    // Export for module usage (if needed)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Dashboard;
    } else if (typeof window !== 'undefined') {
        window.Dashboard = Dashboard;
    }
})();