import { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Wrench,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { useSearchParams, useNavigate } from 'react-router';

type SortColumn = 'equipo' | 'modelo' | 'horometro' | 'horasFaltantes' | null;

export default function Mantenimiento() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchEquipo, setSearchEquipo] = useState('');
  const [filterModelo, setFilterModelo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    const estadoParam = searchParams.get('estado');
    if (estadoParam === 'requieren') {
      setFilterEstado('requieren');
    } else if (estadoParam === 'proximo') {
      setFilterEstado('proximo');
    }
  }, [searchParams]);
  const calcularEstado = (horasFaltantes: number) => {
    if (horasFaltantes <= 0) return 'vencido';
    if (horasFaltantes < 10) return 'urgente';
    if (horasFaltantes < 100) return 'proximo';
    return 'normal';
  };

  const generarEquipos = () => {
    const modelos = ['SGCO (062007)', 'SGSM (062008)', 'SGCO (062009)', 'SGCM (062010)'];
    const equipos = [];

    for (let i = 1; i <= 247; i++) {
      const randomId = 1000000 + Math.floor(Math.random() * 9000000);
      const horometro = Math.random() * 3000;
      const proximoPM = Math.ceil(horometro / 500) * 500;
      const horasFaltantes = proximoPM - horometro;
      const numeroMantenimiento = (Math.ceil(horometro / 500) % 4) || 4;

      equipos.push({
        id: `ZGUU${randomId}`,
        modelo: modelos[i % 4],
        horometro: parseFloat(horometro.toFixed(1)),
        proximoMantenimiento: `PM${numeroMantenimiento}`,
        horasProximoPM: proximoPM,
        horasFaltantes: parseFloat(horasFaltantes.toFixed(1)),
      });
    }

    equipos[0] = {
      id: 'ZGUU2516372',
      modelo: 'SGCO (062007)',
      horometro: 1247.5,
      proximoMantenimiento: 'PM3',
      horasProximoPM: 1500,
      horasFaltantes: 252.5,
    };

    equipos[1] = {
      id: 'ZGUU4726183',
      modelo: 'SGSM (062008)',
      horometro: 1999.1,
      proximoMantenimiento: 'PM4',
      horasProximoPM: 2000,
      horasFaltantes: 0.9,
    };

    equipos[2] = {
      id: 'ZGUU8392745',
      modelo: 'SGCO (062007)',
      horometro: 495.2,
      proximoMantenimiento: 'PM1',
      horasProximoPM: 500,
      horasFaltantes: 4.8,
    };

    equipos[3] = {
      id: 'ZGUU1847293',
      modelo: 'SGSM (062008)',
      horometro: 978.3,
      proximoMantenimiento: 'PM2',
      horasProximoPM: 1000,
      horasFaltantes: 21.7,
    };

    equipos[4] = {
      id: 'ZGUU7364829',
      modelo: 'SGCM (062010)',
      horometro: 1487.9,
      proximoMantenimiento: 'PM3',
      horasProximoPM: 1500,
      horasFaltantes: 12.1,
    };

    return equipos;
  };

  const equiposData = generarEquipos();

  const equipos = equiposData.map((equipo) => ({
    ...equipo,
    estado: calcularEstado(equipo.horasFaltantes),
  }));

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

  let equiposFiltrados = equipos.filter((equipo) => {
    const matchEquipo = equipo.id.toLowerCase().includes(searchEquipo.toLowerCase());
    const matchModelo = filterModelo === 'todos' || equipo.modelo === filterModelo;
    let matchEstado = false;

    if (filterEstado === 'todos') {
      matchEstado = true;
    } else if (filterEstado === 'requieren') {
      matchEstado = equipo.estado === 'vencido' || equipo.estado === 'urgente';
    } else {
      matchEstado = equipo.estado === filterEstado;
    }

    return matchEquipo && matchModelo && matchEstado;
  });

  if (sortColumn) {
    equiposFiltrados = [...equiposFiltrados].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortColumn) {
        case 'equipo':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'modelo':
          aValue = a.modelo;
          bValue = b.modelo;
          break;
        case 'horometro':
          aValue = a.horometro;
          bValue = b.horometro;
          break;
        case 'horasFaltantes':
          aValue = a.horasFaltantes;
          bValue = b.horasFaltantes;
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
  } else {
    equiposFiltrados = [...equiposFiltrados].sort((a, b) => a.horasFaltantes - b.horasFaltantes);
  }

  const totalPages = Math.ceil(equiposFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const equiposPaginados = equiposFiltrados.slice(startIndex, endIndex);

  const modelos = ['SGCO (062007)', 'SGSM (062008)', 'SGCO (062009)', 'SGCM (062010)'];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'vencido':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Vencido</Badge>;
      case 'urgente':
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Urgente</Badge>;
      case 'proximo':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Próximo</Badge>;
      case 'normal':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Normal</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'vencido':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'urgente':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'proximo':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getProgreso = (horometro: number, proximoPM: number) => {
    const cicloPM = 500;
    const baseHoras = Math.floor(proximoPM / cicloPM - 1) * cicloPM;
    const progreso = ((horometro - baseHoras) / cicloPM) * 100;
    return Math.min(Math.max(progreso, 0), 100);
  };

  const equiposVencidos = equipos.filter((e) => e.estado === 'vencido').length;
  const equiposUrgentes = equipos.filter((e) => e.estado === 'urgente').length;
  const equiposProximos = equipos.filter((e) => e.estado === 'proximo').length;
  const equiposNormales = equipos.filter((e) => e.estado === 'normal').length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mantenimiento</h1>
        <p className="text-gray-500 mt-1">Control de mantenimientos preventivos de la flota</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Equipos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{equipos.length}</p>
            </div>
            <div className="bg-blue-50 text-blue-700 p-3 rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Vencidos</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{equiposVencidos}</p>
            </div>
            <div className="bg-red-50 text-red-700 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Urgentes (&lt;10h)</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">{equiposUrgentes}</p>
            </div>
            <div className="bg-orange-50 text-orange-700 p-3 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Próximos (&lt;100h)</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{equiposProximos}</p>
            </div>
            <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Normales (≥100h)</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{equiposNormales}</p>
            </div>
            <div className="bg-green-50 text-green-700 p-3 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="mb-6 p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Ciclo de Mantenimiento</h3>
            <p className="text-sm text-blue-800">
              Los mantenimientos se programan cada 500 horas en ciclos de 4 fases:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500">PM1</p>
                <p className="text-sm font-semibold text-gray-900">500 horas</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500">PM2</p>
                <p className="text-sm font-semibold text-gray-900">1,000 horas</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500">PM3</p>
                <p className="text-sm font-semibold text-gray-900">1,500 horas</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs font-medium text-gray-500">PM4</p>
                <p className="text-sm font-semibold text-gray-900">2,000 horas</p>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Al completar PM4, el ciclo reinicia con PM1 en la siguiente marca de 500 horas
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros de Búsqueda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Equipo</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="ZGUU..."
                  value={searchEquipo}
                  onChange={(e) => { setSearchEquipo(e.target.value); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Modelo</label>
              <Select value={filterModelo} onValueChange={(v) => { setFilterModelo(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los modelos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los modelos</SelectItem>
                  {modelos.map((modelo) => (
                    <SelectItem key={modelo} value={modelo}>
                      {modelo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
              <Select value={filterEstado} onValueChange={(v) => { setFilterEstado(v); setCurrentPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="requieren">Requieren Mantenimiento</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="urgente">Urgente (&lt;10h)</SelectItem>
                  <SelectItem value="proximo">Próximo (&lt;100h)</SelectItem>
                  <SelectItem value="normal">Normal (≥100h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Estado de Mantenimientos</h2>
              <p className="text-sm text-gray-500">
                Mostrando {startIndex + 1}-{Math.min(endIndex, equiposFiltrados.length)} de{' '}
                {equiposFiltrados.length} equipos
              </p>
            </div>
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
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estado</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('equipo')}
                  >
                    Equipo {getSortIcon('equipo')}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('modelo')}
                  >
                    Modelo {getSortIcon('modelo')}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('horometro')}
                  >
                    Horómetro Actual {getSortIcon('horometro')}
                  </TableHead>
                  <TableHead>Próximo PM</TableHead>
                  <TableHead>Horas hasta PM</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => handleSort('horasFaltantes')}
                  >
                    Horas Faltantes {getSortIcon('horasFaltantes')}
                  </TableHead>
                  <TableHead>Progreso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equiposPaginados.map((equipo) => (
                    <TableRow key={equipo.id} onDoubleClick={() => navigate(`/historico?equipo=${equipo.id}`)}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEstadoIcon(equipo.estado)}
                          {getEstadoBadge(equipo.estado)}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono font-medium cursor-pointer hover:text-blue-600">
                        {equipo.id}
                      </TableCell>
                      <TableCell>{equipo.modelo}</TableCell>
                      <TableCell className="text-center font-semibold">
                        {equipo.horometro.toFixed(1)} h
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{equipo.proximoMantenimiento}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{equipo.horasProximoPM} h</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-semibold ${
                            equipo.horasFaltantes <= 0
                              ? 'text-red-600'
                              : equipo.horasFaltantes < 10
                              ? 'text-orange-600'
                              : equipo.horasFaltantes < 100
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {equipo.horasFaltantes.toFixed(1)} h
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress value={getProgreso(equipo.horometro, equipo.horasProximoPM)} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 border-t pt-4">
              <div className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
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
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
