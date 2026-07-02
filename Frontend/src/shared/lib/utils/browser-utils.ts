/**
 * Browser utilities – helpers for client/server detection, storage, and device info.
 * All functions are SSR‑safe (do not reference `window`/`document` directly unless guarded).
 */

/**
 * Check if the code is running on the client (browser).
 * Returns `true` when `window` is defined.
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined';
};

/**
 * Check if the code is running on the server (Node.js).
 * Returns `true` when `window` is not defined.
 */
export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

/**
 * Safely get an item from localStorage.
 * Returns `null` if localStorage is not available or an error occurs.
 * @param key - The storage key
 * @returns The stored value (string) or null
 */
export const getLocalStorage = (key: string): string | null => {
  if (!isClient()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * Safely set an item in localStorage.
 * @param key - The storage key
 * @param value - The value to store (string)
 * @returns true if successful, false otherwise
 */
export const setLocalStorage = (key: string, value: string): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely remove an item from localStorage.
 * @param key - The storage key
 * @returns true if successful, false otherwise
 */
export const removeLocalStorage = (key: string): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

/**
 * Safely clear all items from localStorage.
 * @returns true if successful, false otherwise
 */
export const clearLocalStorage = (): boolean => {
  if (!isClient()) return false;
  try {
    localStorage.clear();
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if the current device is a mobile device (based on user agent).
 * @returns true if mobile, false otherwise (or false on server)
 */
export const isMobile = (): boolean => {
  if (!isClient()) return false;
  try {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  } catch {
    return false;
  }
};

/**
 * Check if the current device is a touch‑enabled device.
 * @returns true if touch is supported, false otherwise (or false on server)
 */
export const isTouchDevice = (): boolean => {
  if (!isClient()) return false;
  try {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  } catch {
    return false;
  }
};

/**
 * Check if the current device is a desktop (non‑mobile, non‑touch) device.
 * @returns true if desktop, false otherwise (or false on server)
 */
export const isDesktop = (): boolean => {
  return !isMobile() && !isTouchDevice();
};

/**
 * Safely get the current window inner width.
 * Returns `null` on server or if unavailable.
 */
export const getWindowWidth = (): number | null => {
  if (!isClient()) return null;
  try {
    return window.innerWidth;
  } catch {
    return null;
  }
};

/**
 * Safely get the current window inner height.
 * Returns `null` on server or if unavailable.
 */
export const getWindowHeight = (): number | null => {
  if (!isClient()) return null;
  try {
    return window.innerHeight;
  } catch {
    return null;
  }
};

/**
 * Debounced version of a function (useful for resize/scroll events).
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Throttled version of a function (useful for scroll/resize events).
 * @param fn - The function to throttle
 * @param limit - Minimum interval between calls (default: 300)
 * @returns Throttled function
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number = 300
): (...args: Parameters<T>) => void => {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};