/**
 * Secure storage utility for browser storage operations
 */

export class SecureStorage {
  protected prefix: string;

  constructor(prefix = "lfb_") {
    this.prefix = prefix;
  }

  /**
   * Get item from storage
   */
  get<T = any>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return defaultValue || null;

      const parsed = JSON.parse(item);

      // Check if item has expired
      if (parsed.expiry && Date.now() > parsed.expiry) {
        this.remove(key);
        return defaultValue || null;
      }

      return parsed.value;
    } catch (error) {
      console.error("Error reading from storage:", error);
      return defaultValue || null;
    }
  }

  /**
   * Set item in storage with optional expiry
   */
  set<T = any>(key: string, value: T, expiryMinutes?: number): boolean {
    if (typeof window === "undefined") return false;

    try {
      const item = {
        value,
        timestamp: Date.now(),
        ...(expiryMinutes && { expiry: Date.now() + expiryMinutes * 60 * 1000 }),
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error("Error writing to storage:", error);
      return false;
    }
  }

  /**
   * Remove item from storage
   */
  remove(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error("Error removing from storage:", error);
      return false;
    }
  }

  /**
   * Clear all items with prefix
   */
  clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.prefix));
      keys.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing storage:", error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(this.prefix + key) !== null;
  }

  /**
   * Get all keys with prefix
   */
  keys(): string[] {
    if (typeof window === "undefined") return [];

    return Object.keys(localStorage)
      .filter((key) => key.startsWith(this.prefix))
      .map((key) => key.replace(this.prefix, ""));
  }

  /**
   * Get storage size in bytes
   */
  size(): number {
    if (typeof window === "undefined") return 0;

    let size = 0;
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.prefix));

    keys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        size += item.length + key.length;
      }
    });

    return size;
  }
}

// Session storage implementation
export class SecureSessionStorage extends SecureStorage {
  get<T = any>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue || null;

    try {
      const item = window.sessionStorage.getItem(this.prefix + key);
      if (!item) return defaultValue || null;

      const parsed = JSON.parse(item);
      return parsed.value;
    } catch (error) {
      console.error("Error reading from session storage:", error);
      return defaultValue || null;
    }
  }

  set<T = any>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false;

    try {
      const item = {
        value,
        timestamp: Date.now(),
      };

      window.sessionStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error("Error writing to session storage:", error);
      return false;
    }
  }

  remove(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      window.sessionStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error("Error removing from session storage:", error);
      return false;
    }
  }

  clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const keys = Object.keys(window.sessionStorage).filter((key) => key.startsWith(this.prefix));
      keys.forEach((key) => window.sessionStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error("Error clearing session storage:", error);
      return false;
    }
  }
}

// Export singleton instances
export const storage = new SecureStorage();
export const secureSessionStorage = new SecureSessionStorage();
