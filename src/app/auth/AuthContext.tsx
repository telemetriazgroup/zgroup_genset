import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authenticateUser } from './users';
import { getModulesForRole, hasModuleAccess } from './permissions';
import type { AppModule, AuthSession, UserRole } from './types';

const STORAGE_KEY = 'ztrack_genset_session';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  hasPermission: (module: AppModule) => boolean;
  allowedModules: AppModule[];
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): AuthSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

function toSession(user: { id: string; email: string; name: string; role: UserRole }): AuthSession {
  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());

  useEffect(() => {
    if (session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [session]);

  const login = useCallback((email: string, password: string) => {
    const user = authenticateUser(email, password);

    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }

    setSession(toSession(user));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const allowedModules = useMemo(
    () => (session ? getModulesForRole(session.role) : []),
    [session],
  );

  const hasPermission = useCallback(
    (module: AppModule) => {
      if (!session) return false;
      return hasModuleAccess(session.role, module);
    },
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
      hasPermission,
      allowedModules,
      role: session?.role ?? null,
    }),
    [session, login, logout, hasPermission, allowedModules],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
