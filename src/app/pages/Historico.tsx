import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Search, History, Wrench, AlertTriangle, CheckCircle, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Historico() {
  const [searchParams] = useSearchParams();
  const [searchEquipo, setSearchEquipo] = useState('');
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string | null>(null);

  useEffect(() => {
    const equipoParam = searchParams.get('equipo');
    if (equipoParam) {
      setSearchEquipo(equipoParam);
      setEquipoSeleccionado(equipoParam);
    }
  }, [searchParams]);

  const generarHistorial = (equipoId: string) => {
    const mantenimientos = [];
    const alarmas = [];
    const fechaBase = new Date('2026-04-21');

    // Generar mantenimientos preventivos PM1-PM4
    for (let i = 1; i <= 4; i++) {
      const diasAtras = Math.floor(Math.random() * 90) + (i - 1) * 30;
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() - diasAtras);

      if (Math.random() > 0.3) {
        mantenimientos.push({
          tipo: `PM${i}`,
          fecha: fecha.toISOString().split('T')[0],
          horometro: i * 500,
          estado: 'completado',
          categoria: 'Preventivo',
        });
      }
    }

    // Generar mantenimientos correctivos
    const numCorrectivos = Math.floor(Math.random() * 4);
    const motivosCorrectivos = [
      'Reparación de fuga de refrigerante',
      'Cambio de batería',
      'Reparación de alternador',
      'Cambio de bomba de combustible',
      'Reparación de sistema eléctrico',
      'Cambio de filtros de emergencia',
      'Reparación de motor de arranque',
    ];

    for (let i = 0; i < numCorrectivos; i++) {
      const diasAtras = Math.floor(Math.random() * 120);
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() - diasAtras);
      const horometro = Math.floor(Math.random() * 2000) + 100;
      const motivo = motivosCorrectivos[Math.floor(Math.random() * motivosCorrectivos.length)];

      mantenimientos.push({
        tipo: 'Correctivo',
        fecha: fecha.toISOString().split('T')[0],
        horometro: horometro,
        estado: 'completado',
        categoria: 'Correctivo',
        motivo: motivo,
      });
    }

    const alarmasCodigos = [
      { codigo: '101', tipo: 'WATER TEMPERATURE HIGH' },
      { codigo: '102', tipo: 'FAILED TO CRANK' },
      { codigo: '103', tipo: 'FAILED TO START' },
      { codigo: '107', tipo: 'EXTERNAL OVERLOAD' },
    ];

    const numAlarmas = Math.floor(Math.random() * 3);
    for (let i = 0; i < numAlarmas; i++) {
      const diasAtras = Math.floor(Math.random() * 120);
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() - diasAtras);
      const alarma = alarmasCodigos[Math.floor(Math.random() * alarmasCodigos.length)];

      alarmas.push({
        codigo: alarma.codigo,
        tipo: alarma.tipo,
        fecha: fecha.toISOString().split('T')[0],
        hora: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(
          Math.floor(Math.random() * 60)
        ).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        estado: Math.random() > 0.5 ? 'resuelta' : 'activa',
      });
    }

    return {
      mantenimientos: mantenimientos.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      ),
      alarmas: alarmas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
    };
  };

  const generarEquipos = () => {
    const modelos = ['SGCO (062007)', 'SGSM (062008)', 'SGCO (062009)', 'SGCM (062010)'];
    const equipos = [];

    for (let i = 1; i <= 247; i++) {
      const randomId = 1000000 + Math.floor(Math.random() * 9000000);
      const horometro = Math.random() * 3000;
      const proximoPM = Math.ceil(horometro / 500) * 500;
      const horasFaltantes = proximoPM - horometro;

      let estado = 'normal';
      if (horasFaltantes <= 0) estado = 'vencido';
      else if (horasFaltantes < 10) estado = 'urgente';
      else if (horasFaltantes < 100) estado = 'proximo';

      equipos.push({
        id: `ZGUU${randomId}`,
        modelo: modelos[i % 4],
        horometro: parseFloat(horometro.toFixed(1)),
        estado,
      });
    }

    return equipos;
  };

  const equipos = generarEquipos();

  const equiposFiltrados = equipos.filter((equipo) => {
    return equipo.id.toLowerCase().includes(searchEquipo.toLowerCase());
  });

  const handleBuscarEquipo = () => {
    if (equiposFiltrados.length > 0) {
      setEquipoSeleccionado(equiposFiltrados[0].id);
    }
  };

  const historial = equipoSeleccionado ? generarHistorial(equipoSeleccionado) : null;
  const equipoData = equipos.find((e) => e.id === equipoSeleccionado);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Histórico</h1>
        <p className="text-gray-500 mt-1">Historial de mantenimientos y alarmas por equipo</p>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Buscar Equipo</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Equipo</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ej: ZGUU2516372"
                  value={searchEquipo}
                  onChange={(e) => setSearchEquipo(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscarEquipo()}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleBuscarEquipo} className="bg-blue-600 hover:bg-blue-700">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </div>

          {equiposFiltrados.length > 0 && !equipoSeleccionado && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                {equiposFiltrados.length} equipo{equiposFiltrados.length !== 1 ? 's' : ''} encontrado
                {equiposFiltrados.length !== 1 ? 's' : ''}. Haz clic en uno para ver su historial:
              </p>
              <div className="flex flex-wrap gap-2">
                {equiposFiltrados.slice(0, 10).map((equipo) => (
                  <Button
                    key={equipo.id}
                    variant="outline"
                    size="sm"
                    onClick={() => setEquipoSeleccionado(equipo.id)}
                    className="font-mono"
                  >
                    {equipo.id}
                  </Button>
                ))}
                {equiposFiltrados.length > 10 && (
                  <span className="text-sm text-gray-500 self-center">
                    y {equiposFiltrados.length - 10} más...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {equipoSeleccionado && historial && equipoData && (
        <>
          <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl">
                <History className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">Información del Equipo</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">ID Equipo</p>
                    <p className="text-sm font-bold text-gray-900 font-mono">{equipoSeleccionado}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Modelo</p>
                    <p className="text-sm font-bold text-gray-900">{equipoData.modelo}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Horómetro Actual</p>
                    <p className="text-sm font-bold text-gray-900">{equipoData.horometro.toFixed(1)} h</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Estado</p>
                    <Badge
                      className={
                        equipoData.estado === 'vencido'
                          ? 'bg-red-100 text-red-700'
                          : equipoData.estado === 'urgente'
                          ? 'bg-orange-100 text-orange-700'
                          : equipoData.estado === 'proximo'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }
                    >
                      {equipoData.estado}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Historial de Mantenimientos
                    </h2>
                    <p className="text-sm text-gray-500">
                      {historial.mantenimientos.length} mantenimiento
                      {historial.mantenimientos.length !== 1 ? 's' : ''} registrado
                      {historial.mantenimientos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {historial.mantenimientos.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No hay mantenimientos registrados para este equipo</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Tipo de Mantenimiento</TableHead>
                          <TableHead>Horas del Equipo</TableHead>
                          <TableHead>Motivo</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historial.mantenimientos.map((mant, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{mant.fecha}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  mant.categoria === 'Preventivo'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                                    : 'bg-orange-50 text-orange-700 border-orange-200 font-semibold'
                                }
                              >
                                {mant.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm font-mono font-semibold">
                              {mant.horometro.toLocaleString()} h
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {mant.categoria === 'Correctivo' ? mant.motivo : 'Mantenimiento programado'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-100 text-red-700 p-2 rounded-lg">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Historial de Alarmas</h2>
                    <p className="text-sm text-gray-500">
                      {historial.alarmas.length} alarma{historial.alarmas.length !== 1 ? 's' : ''}{' '}
                      registrada{historial.alarmas.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {historial.alarmas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No hay alarmas registradas para este equipo</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Fecha/Hora</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historial.alarmas.map((alarma, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Badge variant="outline" className="font-mono">
                                {alarma.codigo}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm max-w-xs">
                              {alarma.tipo.length > 25
                                ? alarma.tipo.substring(0, 25) + '...'
                                : alarma.tipo}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <div>
                                  <div>{alarma.fecha}</div>
                                  <div className="text-xs text-gray-500">{alarma.hora}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {alarma.estado === 'resuelta' ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-700">Resuelta</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-500" />
                                  <span className="text-sm text-red-700">Activa</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <Card className="bg-purple-50 border-purple-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Registro de Mantenimientos Preventivos
                  </h2>
                  <p className="text-sm text-gray-500">
                    Estado de cada ciclo de mantenimiento preventivo
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Mantenimiento</TableHead>
                      <TableHead>Horas Programadas</TableHead>
                      <TableHead>Fecha de Realización</TableHead>
                      <TableHead>Horómetro al Realizarse</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {['PM1', 'PM2', 'PM3', 'PM4'].map((pmTipo, index) => {
                      const mantenimientoRealizado = historial.mantenimientos.find(
                        (m) => m.tipo === pmTipo && m.categoria === 'Preventivo'
                      );
                      const horasProgramadas = (index + 1) * 500;
                      const horometroActual = equipoData.horometro;
                      const faltante = horasProgramadas - horometroActual;

                      return (
                        <TableRow key={pmTipo}>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                              {pmTipo}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {horasProgramadas.toLocaleString()} h
                          </TableCell>
                          <TableCell>
                            {mantenimientoRealizado ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-900">
                                  {mantenimientoRealizado.fecha}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                No realizado
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-mono">
                            {mantenimientoRealizado ? (
                              <span className="font-semibold text-gray-900">
                                {mantenimientoRealizado.horometro.toLocaleString()} h
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {mantenimientoRealizado ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-700 font-medium">Completado</span>
                              </div>
                            ) : faltante <= 0 ? (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm text-red-700 font-medium">Vencido</span>
                              </div>
                            ) : faltante < 10 ? (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="text-sm text-orange-700 font-medium">
                                  Urgente (Faltan {faltante.toFixed(1)} h)
                                </span>
                              </div>
                            ) : faltante < 100 ? (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-yellow-700 font-medium">
                                  Próximo (Faltan {faltante.toFixed(1)} h)
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Pendiente (Faltan {faltante.toFixed(1)} h)
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
