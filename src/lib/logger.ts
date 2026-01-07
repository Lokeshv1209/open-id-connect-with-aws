/**
 * Logger utility for controlled console output
 * Only logs in development environment to prevent sensitive data exposure in production
 */

const isDev = process.env.NODE_ENV === "development";
const enableLogging = process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true";

export const logger = {
  info: (...args: any[]) => {
    if (isDev && enableLogging) {
      console.info("[INFO]", new Date().toISOString(), ...args);
    }
  },

  error: (...args: any[]) => {
    if (isDev && enableLogging) {
      console.error("[ERROR]", new Date().toISOString(), ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev && enableLogging) {
      console.warn("[WARN]", new Date().toISOString(), ...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev && enableLogging) {
      console.debug("[DEBUG]", new Date().toISOString(), ...args);
    }
  },

  /**
   * Log API requests (sanitized)
   */
  api: (method: string, url: string, status?: number) => {
    if (isDev && enableLogging) {
      console.info("[API]", new Date().toISOString(), method, url, status || "");
    }
  },

  /**
   * Log authentication events (sanitized)
   */
  auth: (event: string, role?: string) => {
    if (isDev && enableLogging) {
      console.info("[AUTH]", new Date().toISOString(), event, role || "");
    }
  },
};

export default logger;
