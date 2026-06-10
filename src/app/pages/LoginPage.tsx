import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../auth/AuthContext';
import { getDefaultRouteForRole } from '../auth/permissions';
import { ROLE_LABELS } from '../auth/types';
import { MOCK_USERS } from '../auth/users';
import { Badge } from '../components/ui/badge';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);

    if (!result.success) {
      setError(result.error ?? 'Error al iniciar sesión');
      return;
    }

    const user = MOCK_USERS.find(
      (candidate) => candidate.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (user) {
      navigate(getDefaultRouteForRole(user.role));
    } else {
      navigate('/');
    }
  };

  const demoUsers = MOCK_USERS.map((user) => ({
    email: user.email,
    password: user.password,
    role: ROLE_LABELS[user.role],
  }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-white mb-1">ZTRACK GENSET</h1>
            <p className="text-gray-400 text-sm">Telemetría de Generadores</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:bg-white/10 transition-all"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12 rounded-xl focus:bg-white/10 transition-all"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-blue-500/50"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center mb-3">Usuarios de demostración</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                    setError('');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-gray-200 truncate">{user.email}</span>
                    <Badge className="bg-blue-500/20 text-blue-200 border-0 text-[10px] shrink-0">
                      {user.role}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
