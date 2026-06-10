import { Activity, AlertTriangle, Power, PowerOff, Clock, Wrench, Fuel, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS, type AppModule } from '../auth/types';
import { Badge } from '../components/ui/badge';

export default function Dashboard() {
  const navigate = useNavigate();
  const { hasPermission, session } = useAuth();
  const generarEstadisticas = () => {
    const modelos = ['SGCO (062007)', 'SGSM (062008)', 'SGCO (062009)', 'SGCM (062010)'];
    let vencidos = 0;
    let urgentes = 0;
    let proximos = 0;
    let normales = 0;

    for (let i = 1; i <= 247; i++) {
      const horometro = Math.random() * 3000;
      const proximoPM = Math.ceil(horometro / 500) * 500;
      const horasFaltantes = proximoPM - horometro;

      if (horasFaltantes <= 0) vencidos++;
      else if (horasFaltantes < 10) urgentes++;
      else if (horasFaltantes < 100) proximos++;
      else normales++;
    }

    return { vencidos, urgentes, proximos, normales };
  };

  const estadisticasMantenimiento = generarEstadisticas();

  const stats: Array<{
    title: string;
    value: string;
    icon: typeof Activity;
    color: string;
    textColor: string;
    bgColor: string;
    targetModule: AppModule;
    onClick: () => void;
  }> = [
    {
      title: 'Total de Equipos',
      value: '247',
      icon: Activity,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      targetModule: 'data',
      onClick: () => navigate('/data?vista=general'),
    },
    {
      title: 'Equipos con Alarma',
      value: '8',
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      targetModule: 'alarmas',
      onClick: () => navigate('/alarmas'),
    },
    {
      title: 'En Línea',
      value: '189',
      icon: Power,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      targetModule: 'data',
      onClick: () => navigate('/data?vista=general&conexion=online'),
    },
    {
      title: 'Fuera de Línea (<12h)',
      value: '32',
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      targetModule: 'data',
      onClick: () => navigate('/data?vista=general&conexion=menos12h'),
    },
    {
      title: 'Fuera de Línea (>12h)',
      value: '26',
      icon: PowerOff,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      targetModule: 'data',
      onClick: () => navigate('/data?vista=general&conexion=mas24h'),
    },
    {
      title: 'Requieren Mantenimiento',
      value: String(estadisticasMantenimiento.vencidos + estadisticasMantenimiento.urgentes),
      icon: Wrench,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      targetModule: 'mantenimiento',
      onClick: () => navigate('/mantenimiento?estado=requieren'),
    },
    {
      title: 'Combustible Bajo',
      value: '12',
      icon: Fuel,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      targetModule: 'data',
      onClick: () => navigate('/data?vista=general'),
    },
    {
      title: 'Próximos a Mantenimiento',
      value: String(estadisticasMantenimiento.proximos),
      icon: CalendarClock,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      targetModule: 'mantenimiento',
      onClick: () => navigate('/mantenimiento?estado=proximo'),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel Principal</h1>
          <p className="text-gray-500 mt-1">Resumen general de la telemetría de generadores</p>
        </div>
        {session && (
          <Badge variant="outline" className="w-fit">
            Perfil: {ROLE_LABELS[session.role]}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const canNavigate = hasPermission(stat.targetModule);

          return (
          <Card
            key={index}
            className={`p-6 transition-all ${
              canNavigate
                ? 'hover:shadow-lg cursor-pointer hover:scale-105'
                : 'opacity-90 cursor-default'
            }`}
            onClick={canNavigate ? stat.onClick : undefined}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.textColor} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className={`mt-4 h-1 rounded-full ${stat.color}`} />
          </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de la Flota</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700">Operando Normalmente</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">76.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-700">Offline Temporal</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">13.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">Offline Prolongado</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">10.5%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Mantenimiento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-sm text-gray-700">Vencido</span>
              </div>
              <span className="text-sm font-semibold text-red-600">{estadisticasMantenimiento.vencidos}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-gray-700">Urgente (&lt;10h)</span>
              </div>
              <span className="text-sm font-semibold text-orange-600">{estadisticasMantenimiento.urgentes}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm text-gray-700">Próximo (&lt;100h)</span>
              </div>
              <span className="text-sm font-semibold text-yellow-600">{estadisticasMantenimiento.proximos}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-700">Normal (≥100h)</span>
              </div>
              <span className="text-sm font-semibold text-green-600">{estadisticasMantenimiento.normales}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Recientes</h3>
          <div className="space-y-3">
            {[
              { id: 'ZGUU2516372', code: '101', message: 'WATER TEMPERATURE HIGH', time: 'Hace 15 min' },
              { id: 'ZGUU1847293', code: '103', message: 'FAILED TO START', time: 'Hace 32 min' },
              { id: 'ZGUU3982147', code: '107', message: 'EXTERNAL OVERLOAD', time: 'Hace 1 hora' },
              { id: 'ZGUU5729384', code: '102', message: 'FAILED TO CRANK', time: 'Hace 2 horas' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.id}</p>
                  <p className="text-xs text-red-600 font-mono mb-1">Código {alert.code}</p>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
