import { vi } from "vitest"

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

vi.stubGlobal("localStorage", localStorageMock)

// Mock das variáveis de ambiente obrigatórias
vi.stubEnv("VITE_SUPABASE_URL", "https://mock.supabase.co")
vi.stubEnv("VITE_SUPABASE_PUBLISHABLE_KEY", "mock-key")
