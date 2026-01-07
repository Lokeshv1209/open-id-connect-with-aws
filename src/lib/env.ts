/**
 * Environment configuration
 * Centralized environment variable access with validation
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  // API Configuration
  apiBaseUrl: getEnvVar("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3002/api"),

  // App Configuration
  appEnv: getEnvVar("NODE_ENV", "development"),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",

  // Feature Flags
  enableLogging: process.env.NEXT_PUBLIC_ENABLE_LOGGING === "true",
  enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true",

  // Security
  jwtSecret: process.env.JWT_SECRET || "",
  encryptionKey: process.env.ENCRYPTION_KEY || "",

  // Session Configuration
  sessionTimeout: parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || "3600000"), // 1 hour default
  refreshTokenTimeout: parseInt(process.env.NEXT_PUBLIC_REFRESH_TIMEOUT || "604800000"), // 7 days default
};

export default env;
