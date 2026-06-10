import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight, LayoutDashboard, Bell, Database, Wrench, History, Shield, Zap, Filter, Eye } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { ROLE_LABELS } from '../auth/types';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

function Accordion({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600">{icon}</span>
          <span className="font-semibold text-gray-900 text-base">{title}</span>
        </div>
        {open ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>
      {open && (
        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[color] ?? colors.gray}`}>
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 min-w-40 shrink-0 text-sm">{label}</span>
      <span className="text-gray-800 text-sm">{value}</span>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function AlarmTable() {
  const alarmas = [
    { code: '101', name: 'WATER TEMPERATURE HIGH', type: 'Delayed Restart', desc: 'Temperatura del refrigerante por encima de 107°C durante 25 segundos' },
    { code: '102', name: 'FAILED TO CRANK', type: 'Delayed Restart', desc: 'El motor no logra girar al intentar arrancar' },
    { code: '103', name: 'FAILED TO START', type: 'Delayed Restart', desc: 'Motor gira pero no logra encender' },
    { code: '104', name: 'LOW OIL PRESSURE', type: 'Immediate Stop', desc: 'Presión de aceite por debajo del mínimo en operación' },
    { code: '105', name: 'OVERCRANK', type: 'Delayed Restart', desc: 'Tiempo excesivo de arranque sin éxito' },
    { code: '106', name: 'OVERVOLTAGE', type: 'Warning', desc: 'Voltaje de salida superior al límite configurado' },
    { code: '107', name: 'UNDERVOLTAGE', type: 'Warning', desc: 'Voltaje de salida inferior al límite configurado' },
  ];
  return (
    <div className="overflow-x-auto mt-2 rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Código</th>
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Nombre</th>
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Tipo</th>
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Descripción</th>
          </tr>
        </thead>
        <tbody>
          {alarmas.map((a) => (
            <tr key={a.code} className="border-t border-gray-100 hover:bg-white">
              <td className="px-4 py-2 font-mono font-bold text-blue-700">{a.code}</td>
              <td className="px-4 py-2 font-medium text-gray-800">{a.name}</td>
              <td className="px-4 py-2">
                <Badge label={a.type} color={a.type === 'Immediate Stop' ? 'red' : a.type === 'Warning' ? 'yellow' : 'blue'} />
              </td>
              <td className="px-4 py-2 text-gray-600">{a.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MaintenanceTable() {
  const ciclos = [
    { ciclo: 'PM1', horas: '500h', aceite: '✓', filtroAceite: '✓', filtroAire: '—', filtroCombus: '—', bujias: '—', refrigerante: '—' },
    { ciclo: 'PM2', horas: '1000h', aceite: '✓', filtroAceite: '✓', filtroAire: '✓', filtroCombus: '✓', bujias: '—', refrigerante: '—' },
    { ciclo: 'PM3', horas: '1500h', aceite: '✓', filtroAceite: '✓', filtroAire: '✓', filtroCombus: '✓', bujias: '✓', refrigerante: '—' },
    { ciclo: 'PM4', horas: '2000h', aceite: '✓', filtroAceite: '✓', filtroAire: '✓', filtroCombus: '✓', bujias: '✓', refrigerante: '✓' },
  ];
  return (
    <div className="overflow-x-auto mt-2 rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Ciclo</th>
            <th className="text-left px-4 py-2 text-gray-600 font-semibold">Intervalo</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Aceite</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Filtro Aceite</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Filtro Aire</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Filtro Comb.</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Bujías</th>
            <th className="text-center px-3 py-2 text-gray-600 font-semibold">Refrigerante</th>
          </tr>
        </thead>
        <tbody>
          {ciclos.map((c) => (
            <tr key={c.ciclo} className="border-t border-gray-100 hover:bg-white">
              <td className="px-4 py-2 font-bold text-blue-700">{c.ciclo}</td>
              <td className="px-4 py-2 font-medium">{c.horas}</td>
              <td className="px-3 py-2 text-center">{c.aceite}</td>
              <td className="px-3 py-2 text-center">{c.filtroAceite}</td>
              <td className="px-3 py-2 text-center">{c.filtroAire}</td>
              <td className="px-3 py-2 text-center">{c.filtroCombus}</td>
              <td className="px-3 py-2 text-center">{c.bujias}</td>
              <td className="px-3 py-2 text-center">{c.refrigerante}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadges() {
  const estados = [
    { label: 'Vencido', color: 'red', desc: 'Horómetro ≥ intervalo PM (horas faltantes ≤ 0)' },
    { label: 'Urgente', color: 'orange', desc: 'Menos de 10 horas para el próximo mantenimiento' },
    { label: 'Próximo', color: 'yellow', desc: 'Entre 10 y 99 horas para el próximo mantenimiento' },
    { label: 'Normal', color: 'green', desc: '100 o más horas para el próximo mantenimiento' },
  ];
  return (
    <div className="mt-2 space-y-2">
      {estados.map((e) => (
        <div key={e.label} className="flex items-center gap-3">
          <Badge label={e.label} color={e.color} />
          <span className="text-sm text-gray-600">{e.desc}</span>
        </div>
      ))}
    </div>
  );
}

export default function Documentacion() {
  const { session } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documentación Técnica</h1>
          <p className="text-gray-500 text-sm">
            ZTRACK GENSET — Plataforma de Telemetría para Generadores
            {session && ` · ${session.name} (${ROLE_LABELS[session.role]})`}
          </p>
        </div>
        <div className="ml-auto">
          <Badge label="v1.0 — Junio 2026" color="blue" />
        </div>
      </div>

      {/* Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-blue-900 mb-2">Descripción General</h2>
        <p className="text-blue-800 text-sm leading-relaxed">
          ZTRACK GENSET es una plataforma web de telemetría para el monitoreo y gestión de generadores de energía móviles.
          Permite visualizar en tiempo real el estado operativo de una flota de equipos, gestionar alarmas, planificar
          mantenimientos preventivos y consultar el historial de intervenciones.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge label="React + TypeScript" color="blue" />
          <Badge label="Tailwind CSS v4" color="purple" />
          <Badge label="React Router v6" color="gray" />
          <Badge label="247 Equipos" color="green" />
          <Badge label="Formatos SGCO · SGSM · SGCM" color="orange" />
        </div>
      </div>

      {/* Sections */}
      <Accordion title="Autenticación y Acceso" icon={<Shield className="w-5 h-5" />}>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            La plataforma cuenta con una pantalla de login con diseño tipo Apple. El acceso está protegido por credenciales de usuario.
          </p>
          <FeatureList items={[
            'Pantalla de login limpia con fondo oscuro, logo centrado y formulario minimalista',
            'Validación de credenciales con roles: Super Administrador, Administrador, Operador y Técnico',
            'Botón "Cerrar Sesión" visible en la barra de navegación superior que invalida la sesión',
            'Navegación protegida: sin sesión, el usuario no accede a módulos internos',
            'Menú y rutas filtrados según permisos del perfil autenticado',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Módulo: Panel Principal (Dashboard)" icon={<LayoutDashboard className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Vista general del estado de toda la flota con métricas resumidas y accesos rápidos a los módulos principales.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Métricas en tarjetas</h4>
          <FeatureList items={[
            'Total de equipos registrados (247)',
            'Equipos conectados (última comunicación < 12 horas)',
            'Equipos sin conexión (última comunicación ≥ 24 horas)',
            'Equipos que requieren mantenimiento preventivo (estado Vencido o Urgente)',
            'Alarmas activas en tiempo real',
          ]} />
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Funcionalidades adicionales</h4>
          <FeatureList items={[
            'Tarjetas clickeables que navegan directamente al módulo correspondiente con filtro preseleccionado',
            'Indicadores visuales con íconos y colores por categoría',
            'Diseño responsivo en grilla de tarjetas',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Módulo: Alarmas" icon={<Bell className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Gestión de alarmas activas por equipo con diagnósticos detallados y referencia de códigos.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Códigos de alarma implementados</h4>
          <AlarmTable />
          <h4 className="font-semibold text-gray-800 text-sm mt-4">Funcionalidades</h4>
          <FeatureList items={[
            'Tabla de alarmas activas con ID, código, equipo, tipo, severidad, fecha y estado',
            'Click en una fila expande el detalle completo de la alarma (descripción + diagnóstico)',
            'Severidades codificadas por color: Alta (rojo), Media (amarillo), Baja (azul)',
            'Panel colapsable con referencia rápida de todos los códigos 101–107',
            'Estados: Activa / Resuelta con badge diferenciado',
            'Componente AlarmaDetalle reutilizable para vista expandida',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Módulo: Data" icon={<Database className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Vista completa de los 247 equipos de la flota con telemetría en tiempo real y vista detallada por dispositivo.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Vista General (tabla de equipos)</h4>
          <FeatureList items={[
            'Tabla con todos los equipos: ID (formato ZGUU + número), modelo, estado, horómetro, última conexión',
            'Filtro de conexión: Todos / Conectados (< 12h) / Sin conexión (≥ 24h)',
            'Búsqueda por ID de equipo en tiempo real',
            'Ordenamiento por columnas (ascendente/descendente) con íconos indicadores',
            'Click en fila navega a la vista detallada del equipo',
          ]} />
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Vista Detalle por Equipo</h4>
          <FeatureList items={[
            'Telemetría en tiempo real: voltaje AC, corriente, frecuencia, factor de potencia, temperatura, presión de aceite',
            'Parámetros de operación: horómetro, estado del motor, modo de operación',
            'Historial de últimas alarmas del equipo',
            'Información del dispositivo: modelo, serie, ubicación, fecha de instalación',
            'Botón de regreso a la vista general',
          ]} />
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Modelos de equipos</h4>
          <div className="flex gap-2 mt-1">
            <Badge label="SGCO" color="blue" />
            <Badge label="SGSM" color="green" />
            <Badge label="SGCM" color="purple" />
          </div>
        </div>
      </Accordion>

      <Accordion title="Módulo: Mantenimiento" icon={<Wrench className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Gestión del ciclo de mantenimiento preventivo PM1–PM4 cada 500 horas para todos los equipos de la flota.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Ciclos de mantenimiento preventivo</h4>
          <MaintenanceTable />
          <h4 className="font-semibold text-gray-800 text-sm mt-4">Estados de mantenimiento</h4>
          <StatusBadges />
          <h4 className="font-semibold text-gray-800 text-sm mt-4">Funcionalidades de la tabla</h4>
          <FeatureList items={[
            'Búsqueda por ID de equipo (ZGUU + número)',
            'Filtro por modelo: SGCO / SGSM / SGCM',
            'Filtro por estado: Todos / Requieren mantenimiento / Próximo / Normal',
            'Ordenamiento por columnas: Equipo, Modelo, Horómetro, Horas Faltantes',
            'Barra de progreso visual por equipo dentro del intervalo PM actual',
            'Paginación configurable: 10 / 25 / 50 elementos por página con navegación',
            'El Dashboard puede pre-filtrar este módulo enviando el parámetro ?estado=requieren en la URL',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Módulo: Histórico" icon={<History className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Registro histórico de mantenimientos preventivos realizados a cada equipo, con detalle de fecha, tipo y horómetro al momento de la intervención.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Funcionalidades</h4>
          <FeatureList items={[
            'Selector de equipo por ID (ZGUU + número) para consultar su historial individual',
            'Tabla de "Registro de Mantenimientos Preventivos" con fecha, tipo de PM y horómetro',
            'Ordenamiento por fecha descendente (más reciente primero)',
            'Resumen estadístico: total de mantenimientos realizados, último PM y próximo PM estimado',
            'Indicador de estado actual del equipo dentro de su ciclo PM',
          ]} />
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Datos mostrados por registro</h4>
          <FeatureList items={[
            'Fecha y hora de la intervención',
            'Tipo de mantenimiento (PM1 / PM2 / PM3 / PM4)',
            'Horómetro registrado al momento del mantenimiento',
            'Técnico responsable (cuando disponible)',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Navegación y Arquitectura" icon={<Zap className="w-5 h-5" />}>
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            La plataforma utiliza React Router para navegación SPA sin recargas de página.
          </p>
          <h4 className="font-semibold text-gray-800 text-sm">Rutas implementadas</h4>
          <div className="mt-2 space-y-1.5">
            {[
              { path: '/login', desc: 'Pantalla de autenticación' },
              { path: '/', desc: 'Panel Principal (Dashboard)' },
              { path: '/alarmas', desc: 'Módulo de Alarmas' },
              { path: '/data', desc: 'Módulo Data — Vista General y Detalle' },
              { path: '/mantenimiento', desc: 'Módulo de Mantenimiento' },
              { path: '/historico', desc: 'Módulo Histórico' },
              { path: '/documentacion', desc: 'Documentación técnica (protegida)' },
            ].map((r) => (
              <div key={r.path} className="flex gap-3 text-sm">
                <code className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded font-mono text-xs min-w-36">{r.path}</code>
                <span className="text-gray-600">{r.desc}</span>
              </div>
            ))}
          </div>
          <h4 className="font-semibold text-gray-800 text-sm mt-4">Estructura del proyecto</h4>
          <FeatureList items={[
            'src/app/pages/ — un archivo .tsx por módulo/página',
            'src/app/components/ — componentes reutilizables (AlarmaDetalle, UI shadcn)',
            'src/app/layouts/MainLayout.tsx — barra de navegación superior compartida',
            'src/app/routes.tsx — definición centralizada de rutas',
            'src/styles/ — tokens CSS y fuentes globales',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Convenciones y Formatos de Datos" icon={<Filter className="w-5 h-5" />}>
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800 text-sm">Identificadores de equipos</h4>
          <div className="bg-gray-100 rounded-lg px-4 py-3 font-mono text-sm text-gray-800">
            Formato: ZGUU + 7 dígitos &nbsp;|&nbsp; Ejemplo: ZGUU2516372
          </div>
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Filtros de conectividad</h4>
          <FeatureList items={[
            'Conectado: última comunicación hace menos de 12 horas',
            'Sin conexión: última comunicación hace 24 horas o más',
            'Intermitente: entre 12 y 23 horas sin comunicación',
          ]} />
          <h4 className="font-semibold text-gray-800 text-sm mt-3">Horómetro y ciclo PM</h4>
          <FeatureList items={[
            'Ciclo base: 500 horas entre cada mantenimiento preventivo',
            'Horas faltantes = (múltiplo de 500 siguiente al horómetro actual) − horómetro actual',
            'Progreso PM = (horas dentro del ciclo actual / 500) × 100%',
          ]} />
        </div>
      </Accordion>

      <Accordion title="Componentes de Interfaz (UI)" icon={<Eye className="w-5 h-5" />}>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">La plataforma utiliza componentes de la librería shadcn/ui adaptados con Tailwind CSS v4.</p>
          <FeatureList items={[
            'Card — tarjetas de resumen y paneles',
            'Table / TableHeader / TableRow / TableCell — tablas de datos',
            'Badge — etiquetas de estado y severidad',
            'Progress — barras de progreso del ciclo PM',
            'Input — campos de búsqueda',
            'Select / SelectItem — dropdowns de filtros',
            'Button — acciones y paginación',
            'Collapsible — paneles expandibles (referencia de códigos de alarma)',
            'Tooltip — información contextual en hover',
            'NavLink (React Router) — navegación activa con estado visual',
          ]} />
        </div>
      </Accordion>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-400 py-4 border-t border-gray-200">
        ZTRACK GENSET — Documentación Técnica Interna &nbsp;|&nbsp; Generada: Junio 2026 &nbsp;|&nbsp; Acceso restringido
      </div>
    </div>
  );
}
