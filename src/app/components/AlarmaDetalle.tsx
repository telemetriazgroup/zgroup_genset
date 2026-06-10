import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { AlertTriangle, Info, Wrench } from 'lucide-react';

interface AlarmaDetalleProps {
  alarma: {
    id: string;
    codigo: string;
    equipo: string;
    tipo: string;
    tipoAlarma: string;
    severidad: string;
    descripcion: string;
    diagnosticos: string;
    fecha: string;
    estado: string;
  } | null;
  open: boolean;
  onClose: () => void;
}

const alarmaInfo: Record<string, { causa: string; tipo: string; diagnosticos: string[] }> = {
  '101': {
    causa: 'Delayed Restart Alarm—Engine is running and water temperature is above 107°C (225°F) for 25 seconds. Engine then stops and then attempts to restart.',
    tipo: 'Delayed Restart',
    diagnosticos: [
      'Check for cause of engine overheating',
      'Check engine coolant level',
      'Check water pump belt',
      'Check radiator for airflow and coolant flow restrictions',
      'Check for faulty water temperature sensor',
    ],
  },
  '102': {
    causa: 'Delayed Restart Alarm—Engine failed to crank. Becomes a Shutdown Alarm when number of restart attempts is greater than number of "Crank Restarts" set in Configuration Menu.',
    tipo: 'Delayed Restart',
    diagnosticos: [
      'Check battery, battery cables, and starter',
      'Check 8S circuit',
      'Check Start Relay',
      'Check for seized engine or alternator',
    ],
  },
  '103': {
    causa: 'Delayed Restart Alarm—Engine failed to start. Becomes a Shutdown Alarm when number of restart attempts is greater than number of "Crank Restarts" set in Configuration Menu.',
    tipo: 'Delayed Restart',
    diagnosticos: [
      'Check fuel level',
      'Check fuel solenoid, fuel pump, and fuel system both electrically and mechanically',
      'In cold ambient temperatures check for fuel gelling',
      'Check for restricted air cleaner or air intake system',
      'Check intake air heater',
    ],
  },
  '104': {
    causa: 'Shutdown Alarm—No feedback when relay is energized, or feedback when relay is not energized.',
    tipo: 'Shutdown',
    diagnosticos: ['Check RL2 (Fuel Hold) relay', 'Check 8D circuit'],
  },
  '105': {
    causa: 'Shutdown Alarm—No feedback when relay is energized, or feedback when relay is not energized.',
    tipo: 'Shutdown',
    diagnosticos: ['Check RL1 (Fuel Pull) relay', 'Check 8DP circuit'],
  },
  '106': {
    causa: 'Shutdown Alarm—No feedback when relay is energized, or feedback when relay is not energized.',
    tipo: 'Shutdown',
    diagnosticos: ['Check RL5 (Start) relay', 'Check SR, PSR, and FSR circuits'],
  },
  '107': {
    causa: 'Shutdown Alarm—Message 122 has occurred 3 times.',
    tipo: 'Shutdown',
    diagnosticos: [
      'Unplug load and attempt restart',
      'Check alternator field circuit',
      'Check alternator output circuit',
    ],
  },
};

export default function AlarmaDetalle({ alarma, open, onClose }: AlarmaDetalleProps) {
  if (!alarma) return null;

  const info = alarmaInfo[alarma.codigo];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <span>Detalle de Alarma - Código {alarma.codigo}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">Equipo</p>
              <p className="font-mono font-semibold text-gray-900">{alarma.equipo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fecha/Hora</p>
              <p className="font-medium text-gray-900">{alarma.fecha}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Estado</p>
              <Badge
                className={
                  alarma.estado === 'activa'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }
              >
                {alarma.estado}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tipo de Alarma</p>
              <Badge
                className={
                  info?.tipo === 'Shutdown'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }
              >
                {info?.tipo}
              </Badge>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{alarma.tipo}</h3>
            <p className="text-sm text-gray-700">{alarma.descripcion}</p>
          </div>

          {info && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Causa de la Alarma</h4>
                    <p className="text-sm text-blue-800">{info.causa}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 mb-3">Diagnósticos Recomendados</h4>
                    <ul className="space-y-2">
                      {info.diagnosticos.map((diagnostico, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{diagnostico}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
