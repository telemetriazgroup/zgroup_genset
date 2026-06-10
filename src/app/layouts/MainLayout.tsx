import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Bell,
  Database,
  Wrench,
  LogOut,
  History,
  BookOpen,
  User,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { MODULE_LABELS, MODULE_ROUTES, ROLE_LABELS, type AppModule } from '../auth/types';
import { Badge } from '../components/ui/badge';

const NAV_ICONS: Record<AppModule, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  alarmas: Bell,
  data: Database,
  mantenimiento: Wrench,
  historico: History,
  documentacion: BookOpen,
};

export default function MainLayout() {
  const navigate = useNavigate();
  const { logout, session, allowedModules } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = allowedModules.map((module) => ({
    module,
    path: MODULE_ROUTES[module],
    label: MODULE_LABELS[module],
    icon: NAV_ICONS[module],
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8 min-w-0">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900 hidden sm:inline">ZTRACK GENSET</span>
              </div>

              <div className="hidden lg:flex gap-1 overflow-x-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {session && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                  <User className="w-4 h-4 text-gray-500" />
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-900 leading-tight">{session.name}</p>
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {ROLE_LABELS[session.role]}
                    </Badge>
                  </div>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>

          <div className="lg:hidden flex gap-1 pb-3 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap text-sm ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
