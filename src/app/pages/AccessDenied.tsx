import { ShieldX, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useAuth } from '../auth/AuthContext';
import { getDefaultRouteForRole } from '../auth/permissions';
import { ROLE_LABELS } from '../auth/types';

export default function AccessDenied() {
  const { session } = useAuth();
  const homeRoute = session ? getDefaultRouteForRole(session.role) : '/';

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
          <ShieldX className="w-7 h-7 text-red-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Acceso no autorizado</h1>
        <p className="text-sm text-gray-600 mb-4">
          Tu perfil{' '}
          <span className="font-medium text-gray-900">
            {session ? ROLE_LABELS[session.role] : 'sin sesión'}
          </span>{' '}
          no tiene permiso para ver esta sección.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to={homeRoute}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </Card>
    </div>
  );
}
