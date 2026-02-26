const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

export const env = {
  apiBaseUrl: trimTrailingSlash(process.env.NEXT_PUBLIC_API_BASE_URL ?? ""),
  adminAuthStorageKey: process.env.NEXT_PUBLIC_ADMIN_AUTH_STORAGE_KEY ?? "giga.admin.auth",
  enableMockAdminLogin: process.env.NEXT_PUBLIC_ENABLE_MOCK_ADMIN_LOGIN === "true",
  mockAdminUsername: process.env.NEXT_PUBLIC_MOCK_ADMIN_USERNAME ?? "",
  mockAdminPassword: process.env.NEXT_PUBLIC_MOCK_ADMIN_PASSWORD ?? "",
} as const

