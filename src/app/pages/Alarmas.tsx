import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Clock, Info } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import AlarmaDetalle from '../components/AlarmaDetalle';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

export default function Alarmas() {
  const [selectedAlarma, setSelectedAlarma] = useState<any>(null);
  const [codigosOpen, setCodigosOpen] = useState(false);
  const [alarmas] = useState([
    {
      id: 'ALM-001',
      codigo: '101',
      equipo: 'ZGUU2516372',
      tipo: 'WATER TEMPERATURE HIGH',
      tipoAlarma: 'Delayed Restart',
      severidad: 'alta',
      descripcion: 'Engine is running and water temperature is above 107°C (225°F) for 25 seconds',
      diagnosticos: 'Check engine coolant level, water pump belt, radiator airflow, and water temperature sensor',
      fecha: '2026-04-21 14:35:22',
      estado: 'activa',
    },
    {
      id: 'ALM-002',
      codigo: '102',
      equipo: 'ZGUU5729384',
      tipo: 'FAILED TO CRANK',
      tipoAlarma: 'Delayed Restart',
      severidad: 'alta',
      descripcion: 'Engine failed to crank',
      diagnosticos: 'Check battery, battery cables, starter, 8S circuit, Start Relay, and for seized engine or alternator',
      fecha: '2026-04-21 14:02:18',
      estado: 'activa',
    },
    {
      id: 'ALM-003',
      codigo: '103',
      equipo: 'ZGUU1847293',
      tipo: 'FAILED TO START',
      tipoAlarma: 'Delayed Restart',
      severidad: 'alta',
      descripcion: 'Engine failed to start',
      diagnosticos: 'Check fuel level, fuel solenoid, fuel pump, fuel system, fuel gelling in cold temperatures, air cleaner, and intake air heater',
      fecha: '2026-04-21 13:15:45',
      estado: 'activa',
    },
    {
      id: 'ALM-004',
      codigo: '104',
      equipo: 'ZGUU8392745',
      tipo: 'RL2 (FUEL H) FEEDBACK FAILURE',
      tipoAlarma: 'Shutdown',
      severidad: 'alta',
      descripcion: 'No feedback when relay is energized, or feedback when relay is not energized',
      diagnosticos: 'Check RL2 (Fuel Hold) relay and 8D circuit',
      fecha: '2026-04-21 12:48:33',
      estado: 'resuelta',
    },
    {
      id: 'ALM-005',
      codigo: '105',
      equipo: 'ZGUU4726183',
      tipo: 'RL1 (FUEL P) FEEDBACK FAILURE',
      tipoAlarma: 'Shutdown',
      severidad: 'alta',
      descripcion: 'No feedback when relay is energized, or feedback when relay is not energized',
      diagnosticos: 'Check RL1 (Fuel Pull) relay and 8DP circuit',
      fecha: '2026-04-21 11:22:19',
      estado: 'resuelta',
    },
    {
      id: 'ALM-006',
      codigo: '106',
      equipo: 'ZGUU9182736',
      tipo: 'RL5 (STARTER) FEEDBACK FAILURE',
      tipoAlarma: 'Shutdown',
      severidad: 'alta',
      descripcion: 'No feedback when relay is energized, or feedback when relay is not energized',
      diagnosticos: 'Check RL5 (Start) relay, SR, PSR, and FSR circuits',
      fecha: '2026-04-21 09:15:42',
      estado: 'activa',
    },
    {
      id: 'ALM-007',
      codigo: '107',
      equipo: 'ZGUU3982147',
      tipo: 'EXTERNAL OVERLOAD',
      tipoAlarma: 'Shutdown',
      severidad: 'alta',
      descripcion: 'Message 122 has occurred 3 times',
      diagnosticos: 'Unplug load and attempt restart. Check alternator field circuit and alternator output circuit',
      fecha: '2026-04-21 08:33:27',
      estado: 'activa',
    },
    {
      id: 'ALM-008',
      codigo: '101',
      equipo: 'ZGUU7364829',
      tipo: 'WATER TEMPERATURE HIGH',
      tipoAlarma: 'Delayed Restart',
      severidad: 'alta',
      descripcion: 'Engine is running and water temperature is above 107°C (225°F) for 25 seconds',
      diagnosticos: 'Check for cause of engine overheating',
      fecha: '2026-04-21 07:45:11',
      estado: 'resuelta',
    },
    {
      id: 'ALM-009',
      codigo: '103',
      equipo: 'ZGUU6281947',
      tipo: 'FAILED TO START',
      tipoAlarma: 'Delayed Restart',
      severidad: 'alta',
      descripcion: 'Engine failed to start',
      diagnosticos: 'Check fuel system and air intake system',
      fecha: '2026-04-21 06:12:33',
      estado: 'activa',
    },
  ]);

  const getSeveridadBadge = (severidad: string) => {
    switch (severidad) {
      case 'alta':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Media</Badge>;
      case 'baja':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Baja</Badge>;
      default:
        return <Badge>Desconocida</Badge>;
    }
  };

  const getEstadoIcon = (estado: string) => {
    if (estado === 'activa') {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (estado === 'resuelta') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-gray-500" />;
  };

  const alarmasActivas = alarmas.filter((a) => a.estado === 'activa').length;
  const alarmasResueltas = alarmas.filter((a) => a.estado === 'resuelta').length;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alarmas</h1>
        <p className="text-gray-500 mt-1">Gestión de alertas y notificaciones del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Alarmas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{alarmas.length}</p>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Alarmas Activas</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{alarmasActivas}</p>
            </div>
            <div className="bg-red-50 text-red-700 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Alarmas Resueltas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{alarmasResueltas}</p>
            </div>
            <div className="bg-green-50 text-green-700 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Collapsible open={codigosOpen} onOpenChange={setCodigosOpen} className="mb-6">
        <Card className="border-blue-200 bg-blue-50">
          <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-blue-100/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Info className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-900">Códigos de Alarma del Sistema</h3>
                <p className="text-sm text-blue-700">
                  {codigosOpen ? 'Ocultar' : 'Ver'} lista completa de códigos de alarma
                </p>
              </div>
            </div>
            <div
              className={`transform transition-transform ${codigosOpen ? 'rotate-180' : ''}`}
            >
              <svg
                className="w-5 h-5 text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-6 pb-6">
              <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">101</Badge>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                        Delayed Restart
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">WATER TEMPERATURE HIGH</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">102</Badge>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                        Delayed Restart
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">FAILED TO CRANK</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">103</Badge>
                      <Badge className="bg-orange-100 text-orange-700 text-xs">
                        Delayed Restart
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">FAILED TO START</p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">104</Badge>
                      <Badge className="bg-red-100 text-red-700 text-xs">Shutdown</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      RL2 (FUEL H) FEEDBACK FAILURE
                    </p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">105</Badge>
                      <Badge className="bg-red-100 text-red-700 text-xs">Shutdown</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      RL1 (FUEL P) FEEDBACK FAILURE
                    </p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">106</Badge>
                      <Badge className="bg-red-100 text-red-700 text-xs">Shutdown</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      RL5 (STARTER) FEEDBACK FAILURE
                    </p>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">107</Badge>
                      <Badge className="bg-red-100 text-red-700 text-xs">Shutdown</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900">EXTERNAL OVERLOAD</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-4 italic">
                  Haz clic en cualquier fila de la tabla para ver información detallada de cada
                  alarma incluyendo causas y diagnósticos recomendados.
                </p>
              </div>
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Alarmas</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Tipo de Alarma</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Diagnósticos</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alarmas.map((alarma) => (
                  <TableRow
                    key={alarma.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedAlarma(alarma)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">{alarma.codigo}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">{alarma.equipo}</TableCell>
                    <TableCell className="font-medium max-w-xs">{alarma.tipo}</TableCell>
                    <TableCell>
                      <Badge className={alarma.tipoAlarma === 'Shutdown' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}>
                        {alarma.tipoAlarma}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs text-sm" title={alarma.descripcion}>
                      {truncateText(alarma.descripcion, 50)}
                    </TableCell>
                    <TableCell className="max-w-sm text-xs text-gray-600" title={alarma.diagnosticos}>
                      {truncateText(alarma.diagnosticos, 60)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 whitespace-nowrap">{alarma.fecha}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEstadoIcon(alarma.estado)}
                        <span className="text-sm capitalize">{alarma.estado}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      <AlarmaDetalle
        alarma={selectedAlarma}
        open={!!selectedAlarma}
        onClose={() => setSelectedAlarma(null)}
      />
    </div>
  );
}
