import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Calendar, Wrench, Clock, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useSearchParams, useNavigate } from 'react-router';

type SortColumn =
  | 'dispositivo'
  | 'modelo'
  | 'tiempoReporte'
  | 'horometro'
  | 'horasRestantes'
  | 'combustible'
  | null;

export default function Data() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vista, setVista] = useState<'general' | 'detalle'>('general');
  const [selectedDevice, setSelectedDevice] = useState('ZGUU2516372');
  const [startDate, setStartDate] = useState('2026-04-20');
  const [endDate, setEndDate] = useState('2026-04-21');
  const [filterConexion, setFilterConexion] = useState<'todos' | 'menos12h' | 'mas24h' | 'online'>('todos');
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const vistaParam = searchParams.get('vista');
    const conexionParam = searchParams.get('conexion');

    if (vistaParam === 'general') {
      setVista('general');
    }

    if (conexionParam === 'online' || conexionParam === 'menos12h' || conexionParam === 'mas24h') {
      setFilterConexion(conexionParam as 'online' | 'menos12h' | 'mas24h');
    }
  }, [searchParams]);

  const devices = [
    'ZGUU2516372',
    'ZGUU1847293',
    'ZGUU3982147',
    'ZGUU5729384',
    'ZGUU8392745',
    'ZGUU4726183',
    'ZGUU9182736',
    'ZGUU7364829',
    'ZGUU6281947',
    'ZGUU5184729',
  ];

  const generarUnidadesGenerales = () => {
    const modelos = ['SGCO (062007)', 'SGSM (062008)', 'SGCO (062009)', 'SGCM (062010)'];
    const unidades = [];

    for (let i = 1; i <= 247; i++) {
      const randomId = 1000000 + Math.floor(Math.random() * 9000000);
      const horometro = Math.random() * 3000;
      const horasDesdeReporte = Math.random() * 48;
      const combustible = Math.random() * 100;

      unidades.push({
        id: `ZGUU${randomId}`,
        modelo: modelos[i % 4],
        horometro: parseFloat(horometro.toFixed(1)),
        horasDesdeReporte: parseFloat(horasDesdeReporte.toFixed(1)),
        combustible: parseFloat(combustible.toFixed(1)),
      });
    }

    return unidades;
  };

  const unidadesGenerales = generarUnidadesGenerales();

  const calcularProximoMantenimiento = (horometro: number) => {
    const cicloPM = 500;
    const proximoPM = Math.ceil(horometro / cicloPM) * cicloPM;
    const horasRestantes = proximoPM - horometro;

    const numeroMantenimiento = (Math.ceil(horometro / cicloPM) % 4) || 4;
    const tipoPM = `PM${numeroMantenimiento}`;

    return { proximoPM, horasRestantes, tipoPM };
  };

  const getEstadoMantenimiento = (horasRestantes: number) => {
    if (horasRestantes <= 0) return { estado: 'vencido', color: 'bg-red-100 text-red-700' };
    if (horasRestantes < 10) return { estado: 'urgente', color: 'bg-orange-100 text-orange-700' };
    if (horasRestantes < 100) return { estado: 'próximo', color: 'bg-yellow-100 text-yellow-700' };
    return { estado: 'normal', color: 'bg-green-100 text-green-700' };
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="w-4 h-4 ml-1 inline opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 inline" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 inline" />
    );
  };

  let unidadesFiltradas = unidadesGenerales.filter((unidad) => {
    if (filterConexion === 'online') return unidad.horasDesdeReporte < 12;
    if (filterConexion === 'menos12h') return unidad.horasDesdeReporte < 12;
    if (filterConexion === 'mas24h') return unidad.horasDesdeReporte >= 24;
    return true;
  });

  if (sortColumn) {
    unidadesFiltradas = [...unidadesFiltradas].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'dispositivo':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'modelo':
          aValue = a.modelo;
          bValue = b.modelo;
          break;
        case 'tiempoReporte':
          aValue = a.horasDesdeReporte;
          bValue = b.horasDesdeReporte;
          break;
        case 'horometro':
          aValue = a.horometro;
          bValue = b.horometro;
          break;
        case 'horasRestantes':
          const mantA = calcularProximoMantenimiento(a.horometro);
          const mantB = calcularProximoMantenimiento(b.horometro);
          aValue = mantA.horasRestantes;
          bValue = mantB.horasRestantes;
          break;
        case 'combustible':
          aValue = a.combustible;
          bValue = b.combustible;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      } else {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });
  }

  const dataRecords = [
    {
      timestamp: '2026-04-21 14:35:22',
      voltaje: 442,
      temperatura: 98,
      frecuencia: 60.2,
      combustible: 125.5,
      ecoPower: 'ON',
      rpm: 1800,
      horometro: 1247.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
    {
      timestamp: '2026-04-21 13:35:22',
      voltaje: 438,
      temperatura: 95,
      frecuencia: 59.8,
      combustible: 126.2,
      ecoPower: 'ON',
      rpm: 1800,
      horometro: 1246.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
    {
      timestamp: '2026-04-21 12:35:22',
      voltaje: 445,
      temperatura: 102,
      frecuencia: 60.5,
      combustible: 127.1,
      ecoPower: 'ON',
      rpm: 1850,
      horometro: 1245.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
    {
      timestamp: '2026-04-21 11:35:22',
      voltaje: 440,
      temperatura: 88,
      frecuencia: 60.0,
      combustible: 128.5,
      ecoPower: 'ON',
      rpm: 1800,
      horometro: 1244.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
    {
      timestamp: '2026-04-21 10:35:22',
      voltaje: 443,
      temperatura: 92,
      frecuencia: 60.3,
      combustible: 129.8,
      ecoPower: 'OFF',
      rpm: 1900,
      horometro: 1243.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
    {
      timestamp: '2026-04-21 09:35:22',
      voltaje: 441,
      temperatura: 85,
      frecuencia: 59.9,
      combustible: 131.2,
      ecoPower: 'OFF',
      rpm: 1820,
      horometro: 1242.5,
      dimensionTanque: 200,
      modelo: 'SGCO (062007)',
      alarma: 'Ninguna',
      latitud: 19.4326,
      longitud: -99.1332,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data</h1>
        <p className="text-gray-500 mt-1">Datos detallados de telemetría por dispositivo</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Button
          onClick={() => setVista('general')}
          variant={vista === 'general' ? 'default' : 'outline'}
          className={vista === 'general' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Vista General
        </Button>
        <Button
          onClick={() => setVista('detalle')}
          variant={vista === 'detalle' ? 'default' : 'outline'}
          className={vista === 'detalle' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Vista Detallada por Dispositivo
        </Button>
      </div>

      {vista === 'general' ? (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            <div className="flex gap-3">
              <Button
                onClick={() => { setFilterConexion('todos'); setCurrentPage(1); }}
                variant={filterConexion === 'todos' ? 'default' : 'outline'}
                className={filterConexion === 'todos' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                Todos
              </Button>
              <Button
                onClick={() => { setFilterConexion('online'); setCurrentPage(1); }}
                variant={filterConexion === 'online' ? 'default' : 'outline'}
                className={filterConexion === 'online' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                En Línea
              </Button>
              <Button
                onClick={() => { setFilterConexion('menos12h'); setCurrentPage(1); }}
                variant={filterConexion === 'menos12h' ? 'default' : 'outline'}
                className={filterConexion === 'menos12h' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
              >
                Desconexión &lt; 12h
              </Button>
              <Button
                onClick={() => { setFilterConexion('mas24h'); setCurrentPage(1); }}
                variant={filterConexion === 'mas24h' ? 'default' : 'outline'}
                className={filterConexion === 'mas24h' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Desconexión ≥ 24h
              </Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold text-gray-900">Vista General de Unidades</h2>
                  <p className="text-sm text-gray-500">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, unidadesFiltradas.length)} de {unidadesFiltradas.length} unidades
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Mostrar:</span>
                    <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="sm">
                    Exportar CSV
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('dispositivo')}
                      >
                        Dispositivo {getSortIcon('dispositivo')}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('modelo')}
                      >
                        Modelo {getSortIcon('modelo')}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('tiempoReporte')}
                      >
                        Tiempo Desde Último Reporte {getSortIcon('tiempoReporte')}
                      </TableHead>
                      <TableHead>Estado Conexión</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('horometro')}
                      >
                        Horómetro (h) {getSortIcon('horometro')}
                      </TableHead>
                      <TableHead>Estado Mantenimiento</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('horasRestantes')}
                      >
                        Hrs. Restantes Mant. {getSortIcon('horasRestantes')}
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-gray-100 select-none"
                        onClick={() => handleSort('combustible')}
                      >
                        Nivel Combustible (%) {getSortIcon('combustible')}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unidadesFiltradas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((unidad, index) => {
                      const mantenimiento = calcularProximoMantenimiento(unidad.horometro);
                      const estadoMant = getEstadoMantenimiento(mantenimiento.horasRestantes);
                      const estadoConexion =
                        unidad.horasDesdeReporte < 12
                          ? { estado: 'online', color: 'bg-green-100 text-green-700' }
                          : unidad.horasDesdeReporte < 24
                          ? { estado: 'advertencia', color: 'bg-yellow-100 text-yellow-700' }
                          : { estado: 'offline', color: 'bg-red-100 text-red-700' };

                      return (
                        <TableRow key={index} onDoubleClick={() => navigate(`/historico?equipo=${unidad.id}`)}>
                          <TableCell className="font-mono font-medium cursor-pointer hover:text-blue-600">
                            {unidad.id}
                          </TableCell>
                          <TableCell>{unidad.modelo}</TableCell>
                          <TableCell className="text-center">
                            {unidad.horasDesdeReporte.toFixed(1)} h
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${estadoConexion.color}`}
                            >
                              {estadoConexion.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {unidad.horometro.toFixed(1)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${estadoMant.color}`}
                            >
                              {estadoMant.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-semibold ${
                                mantenimiento.horasRestantes <= 0
                                  ? 'text-red-600'
                                  : mantenimiento.horasRestantes < 10
                                  ? 'text-orange-600'
                                  : mantenimiento.horasRestantes < 100
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {mantenimiento.horasRestantes.toFixed(1)} h
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    unidad.combustible < 20
                                      ? 'bg-red-500'
                                      : unidad.combustible < 50
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                  style={{ width: `${unidad.combustible}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium min-w-[3rem]">
                                {unidad.combustible.toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {Math.ceil(unidadesFiltradas.length / itemsPerPage) > 1 && (
                <div className="flex items-center justify-between mt-4 border-t pt-4">
                  <div className="text-sm text-gray-600">
                    Página {currentPage} de {Math.ceil(unidadesFiltradas.length / itemsPerPage)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, Math.ceil(unidadesFiltradas.length / itemsPerPage)) }, (_, i) => {
                        const totalPages = Math.ceil(unidadesFiltradas.length / itemsPerPage);
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={currentPage === pageNum ? 'bg-blue-600 hover:bg-blue-700' : ''}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(Math.ceil(unidadesFiltradas.length / itemsPerPage), p + 1))}
                      disabled={currentPage === Math.ceil(unidadesFiltradas.length / itemsPerPage)}
                    >
                      Siguiente
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <>
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dispositivo</label>
                <Input
                  type="text"
                  placeholder="Ej: ZGUU2516372"
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
            <div className="relative">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
              </div>

              <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
            <div className="relative">
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button className="bg-blue-600 hover:bg-blue-700">Aplicar Filtros</Button>
              <Button variant="outline">Limpiar</Button>
            </div>
          </Card>

          <Card className="mb-6 p-6 bg-purple-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white p-3 rounded-xl">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Estado de Mantenimiento - {selectedDevice}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Horómetro Actual</p>
                <p className="text-lg font-bold text-gray-900">
                  {dataRecords.length > 0 ? dataRecords[0].horometro : 0} h
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Próximo Mantenimiento</p>
                <p className="text-lg font-bold text-blue-700">
                  {dataRecords.length > 0
                    ? calcularProximoMantenimiento(dataRecords[0].horometro).tipoPM
                    : 'PM1'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Horas en Próx. PM</p>
                <p className="text-lg font-bold text-gray-900">
                  {dataRecords.length > 0
                    ? calcularProximoMantenimiento(dataRecords[0].horometro).proximoPM
                    : 500}{' '}
                  h
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Horas Restantes</p>
                <p
                  className={`text-lg font-bold ${
                    dataRecords.length > 0 &&
                    calcularProximoMantenimiento(dataRecords[0].horometro).horasRestantes < 100
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}
                >
                  {dataRecords.length > 0
                    ? calcularProximoMantenimiento(dataRecords[0].horometro).horasRestantes.toFixed(1)
                    : 0}{' '}
                  h
                </p>
              </div>
            </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Datos de Telemetría - {selectedDevice}
                </h2>
                <Button variant="outline" size="sm">
                  Exportar CSV
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Voltaje (V)</TableHead>
                      <TableHead>Temp. Motor (°C)</TableHead>
                      <TableHead>Frecuencia (Hz)</TableHead>
                      <TableHead>Combustible (Gal)</TableHead>
                      <TableHead>Eco Power</TableHead>
                      <TableHead>RPM</TableHead>
                      <TableHead>Horómetro (h)</TableHead>
                      <TableHead>Próx. Mant.</TableHead>
                      <TableHead>Hrs. Restantes</TableHead>
                      <TableHead>Estado Mant.</TableHead>
                      <TableHead>Tanque (Gal)</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Alarma</TableHead>
                      <TableHead>Latitud</TableHead>
                      <TableHead>Longitud</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataRecords.map((record, index) => {
                      const mantenimiento = calcularProximoMantenimiento(record.horometro);
                      const estadoMant = getEstadoMantenimiento(mantenimiento.horasRestantes);

                      return (
                        <TableRow key={index}>
                          <TableCell className="text-sm font-mono">{record.timestamp}</TableCell>
                          <TableCell className="text-center">{record.voltaje}</TableCell>
                          <TableCell className="text-center">{record.temperatura}</TableCell>
                          <TableCell className="text-center">{record.frecuencia}</TableCell>
                          <TableCell className="text-center">{record.combustible}</TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                record.ecoPower === 'ON'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {record.ecoPower}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{record.rpm}</TableCell>
                          <TableCell className="text-center font-semibold">{record.horometro}</TableCell>
                          <TableCell className="text-center">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              {mantenimiento.tipoPM}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-semibold ${
                                mantenimiento.horasRestantes <= 0
                                  ? 'text-red-600'
                                  : mantenimiento.horasRestantes < 10
                                  ? 'text-orange-600'
                                  : mantenimiento.horasRestantes < 100
                                  ? 'text-yellow-600'
                                  : 'text-green-600'
                              }`}
                            >
                              {mantenimiento.horasRestantes.toFixed(1)} h
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${estadoMant.color}`}>
                              {estadoMant.estado}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">{record.dimensionTanque}</TableCell>
                          <TableCell className="font-mono text-sm">{record.modelo}</TableCell>
                          <TableCell>{record.alarma}</TableCell>
                          <TableCell className="text-sm">{record.latitud}</TableCell>
                          <TableCell className="text-sm">{record.longitud}</TableCell>
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
