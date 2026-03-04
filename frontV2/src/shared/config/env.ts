const DEFAULT_API_BASE_URL = "http://localhost:8080";
const DEFAULT_ADMIN_AUTH_STORAGE_KEY = "giga_admin_access_token";

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL,
  adminAuthStorageKey:
    import.meta.env.VITE_ADMIN_AUTH_STORAGE_KEY ?? DEFAULT_ADMIN_AUTH_STORAGE_KEY,
} as const;

