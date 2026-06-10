# Plan de Desarrollo — ZTRACK GENSET

> **Estado actual:** mockup funcional (UI + datos simulados en cliente).  
> **Referencia funcional:** módulo `Documentacion` (`src/app/pages/Documentacion.tsx`) y páginas en `src/app/pages/`.  
> **Versión objetivo:** v1.0 — Junio 2026  
> **Base URL de despliegue:** `/zgroup_genset/` — puerto `3550`

---

## 1. Descripción general

ZTRACK GENSET es una plataforma web de telemetría para el monitoreo y gestión de **generadores de energía móviles**. Permite:

- Visualizar en tiempo real el estado operativo de una flota de equipos
- Gestionar alarmas con diagnósticos
- Planificar mantenimientos preventivos (ciclos PM1–PM4)
- Consultar el historial de intervenciones por equipo

### Alcance de la flota (v1.0)

| Concepto | Valor |
|----------|-------|
| Total de equipos | 247 |
| Formato de ID | `ZGUU` + 7 dígitos (ej. `ZGUU2516372`) |
| Modelos soportados | SGCO · SGSM · SGCM |
| Intervalo PM base | 500 horas |

### Stack previsto

| Capa | Tecnología |
|------|------------|
| Frontend (actual) | React 18, TypeScript, Vite 6, React Router 7, Tailwind CSS v4, shadcn/ui |
| Backend (por implementar) | API REST + autenticación JWT/sesión |
| Persistencia (por implementar) | Base de datos relacional + histórico de telemetría |
| Despliegue | Docker + nginx (configurado) |

---

## 2. Estado del mockup actual

Lo que **ya existe** como prototipo visual e interactivo:

| Área | Implementado en mockup | Pendiente para producción |
|------|------------------------|---------------------------|
| UI / navegación SPA | Sí | Conectar a API real |
| Login | Formulario sin validación real | Auth backend, sesión, rutas protegidas |
| Dashboard | Tarjetas con valores estáticos / aleatorios | Agregaciones desde backend |
| Data | 247 equipos generados con `Math.random()` | Telemetría real y persistencia |
| Alarmas | Lista hardcodeada (~8 registros) | Ingesta y ciclo de vida de alarmas |
| Mantenimiento | Cálculos PM en cliente con datos aleatorios | Reglas de negocio + BD |
| Histórico | Historial generado al vuelo | Registros reales de intervenciones |
| Documentación | Acceso con contraseña en cliente | Mover credencial a backend / roles |

---

## 3. Módulos y funcionalidades a implementar

### 3.1 Autenticación y acceso

**Ruta mockup:** `/login`  
**Estado mockup:** login acepta cualquier credencial y redirige al panel.

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| AUTH-01 | Pantalla de login (diseño minimalista, logo centrado) | ✅ | Mantener UI |
| AUTH-02 | Validación de credenciales | ❌ (demo) | API de login |
| AUTH-03 | Gestión de sesión (token / cookie) | ❌ | Implementar |
| AUTH-04 | Navegación protegida (sin sesión → login) | ❌ | Route guards |
| AUTH-05 | Botón "Cerrar sesión" en barra superior | ✅ UI | Invalidar sesión en backend |
| AUTH-06 | Recuperación de contraseña | UI placeholder | Opcional fase posterior |

---

### 3.2 Panel principal (Dashboard)

**Ruta mockup:** `/`  
**Estado mockup:** métricas parcialmente hardcodeadas; mantenimiento calculado con datos aleatorios.

#### Métricas en tarjetas

| ID | Métrica | Criterio de negocio | Mockup |
|----|---------|---------------------|--------|
| DASH-01 | Total de equipos registrados | Conteo en BD (247) | Valor fijo `247` |
| DASH-02 | Equipos con alarma activa | Alarmas en estado `activa` | Valor fijo `8` |
| DASH-03 | En línea | Última comunicación < 12 h | Valor fijo `189` |
| DASH-04 | Fuera de línea (< 12 h) | Comunicación reciente pero no "en línea" | Valor fijo `32` |
| DASH-05 | Fuera de línea (> 12 h / ≥ 24 h) | Última comunicación ≥ 24 h | Valor fijo `26` |
| DASH-06 | Requieren mantenimiento | Estado PM `Vencido` + `Urgente` | Calculado aleatorio |
| DASH-07 | Próximos a mantenimiento | Estado PM `Próximo` (< 100 h) | Calculado aleatorio |
| DASH-08 | Combustible bajo | Nivel bajo umbral configurable | Valor fijo `12` *(extra mockup)* |

#### Funcionalidades de interacción

| ID | Funcionalidad | Destino al hacer clic |
|----|---------------|------------------------|
| DASH-09 | Tarjetas navegables con filtro preseleccionado | `/data`, `/alarmas`, `/mantenimiento` con query params |
| DASH-10 | Indicadores visuales (ícono + color por categoría) | ✅ mockup |
| DASH-11 | Diseño responsivo en grilla | ✅ mockup |

---

### 3.3 Módulo Alarmas

**Ruta mockup:** `/alarmas`  
**Estado mockup:** tabla estática + componente `AlarmaDetalle`.

#### Catálogo de códigos (referencia v1.0)

| Código | Nombre | Tipo | Descripción |
|--------|--------|------|-------------|
| 101 | WATER TEMPERATURE HIGH | Delayed Restart | Temp. refrigerante > 107°C durante 25 s |
| 102 | FAILED TO CRANK | Delayed Restart | Motor no logra girar al arrancar |
| 103 | FAILED TO START | Delayed Restart | Motor gira pero no enciende |
| 104 | LOW OIL PRESSURE | Immediate Stop | Presión de aceite bajo mínimo en operación |
| 105 | OVERCRANK | Delayed Restart | Tiempo excesivo de arranque sin éxito |
| 106 | OVERVOLTAGE | Warning | Voltaje de salida sobre límite |
| 107 | UNDERVOLTAGE | Warning | Voltaje de salida bajo límite |

#### Funcionalidades

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| ALM-01 | Tabla: ID, código, equipo, tipo, severidad, fecha, estado | ✅ | API alarmas activas |
| ALM-02 | Click en fila → detalle expandido (descripción + diagnóstico) | ✅ | `AlarmaDetalle` + API |
| ALM-03 | Severidad por color: Alta / Media / Baja | ✅ | Reglas en backend |
| ALM-04 | Panel colapsable con referencia códigos 101–107 | ✅ | Catálogo centralizado |
| ALM-05 | Estados: Activa / Resuelta | ✅ | Transiciones + timestamps |
| ALM-06 | Componente reutilizable `AlarmaDetalle` | ✅ | Mantener |
| ALM-07 | Filtros por equipo, severidad, estado | ❌ | Fase 3 |
| ALM-08 | Notificaciones en tiempo real | ❌ | Fase 6 |

---

### 3.4 Módulo Data (Telemetría)

**Ruta mockup:** `/data`  
**Estado mockup:** vista general + detalle; datos generados en memoria.

#### Vista general — tabla de equipos

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| DATA-01 | Tabla 247 equipos: ID, modelo, estado, horómetro, última conexión | ✅ | API flota |
| DATA-02 | Filtro conexión: Todos / Conectados (< 12 h) / Sin conexión (≥ 24 h) | ✅ | Misma regla en backend |
| DATA-03 | Búsqueda por ID en tiempo real | ✅ | Búsqueda server-side |
| DATA-04 | Ordenamiento por columnas (asc/desc) | ✅ | Query params API |
| DATA-05 | Click en fila → vista detalle | ✅ | Navegación + API equipo |
| DATA-06 | Columna combustible y PM estimado | ✅ *(extra mockup)* | Telemetría real |
| DATA-07 | Paginación 10 / 25 / 50 | ✅ | Paginación API |

#### Vista detalle por equipo

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| DATA-08 | Telemetría: voltaje AC, corriente, frecuencia, factor de potencia, temperatura, presión aceite | Parcial | Stream / polling API |
| DATA-09 | Parámetros operación: horómetro, estado motor, modo | Parcial | API estado |
| DATA-10 | Historial últimas alarmas del equipo | Parcial | API alarmas/equipo |
| DATA-11 | Info dispositivo: modelo, serie, ubicación, fecha instalación | Parcial | Maestro equipos |
| DATA-12 | Botón regreso a vista general | ✅ | Mantener |
| DATA-13 | Rango de fechas para histórico de lecturas | ✅ UI *(extra mockup)* | API series temporales |
| DATA-14 | Coordenadas GPS, RPM, EcoPower, dimensión tanque | ✅ *(extra mockup)* | Campos telemetría |

#### Modelos de equipo

- **SGCO** — formato `(062007)`, `(062009)`, etc.
- **SGSM** — formato `(062008)`
- **SGCM** — formato `(062010)`

---

### 3.5 Módulo Mantenimiento

**Ruta mockup:** `/mantenimiento`  
**Estado mockup:** lógica PM completa en cliente con datos aleatorios.

#### Ciclos preventivos PM1–PM4 (cada 500 h)

| Ciclo | Intervalo | Aceite | F. aceite | F. aire | F. comb. | Bujías | Refrigerante |
|-------|-----------|--------|-----------|---------|----------|--------|--------------|
| PM1 | 500 h | ✓ | ✓ | — | — | — | — |
| PM2 | 1000 h | ✓ | ✓ | ✓ | ✓ | — | — |
| PM3 | 1500 h | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| PM4 | 2000 h | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

#### Estados de mantenimiento

| Estado | Condición |
|--------|-----------|
| **Vencido** | Horas faltantes ≤ 0 |
| **Urgente** | Horas faltantes < 10 |
| **Próximo** | Horas faltantes entre 10 y 99 |
| **Normal** | Horas faltantes ≥ 100 |

**Fórmulas:**

```
Horas faltantes = ceil(horómetro / 500) × 500 − horómetro
Progreso PM     = (horas dentro del ciclo actual / 500) × 100%
```

#### Funcionalidades

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| MNT-01 | Búsqueda por ID equipo | ✅ | API |
| MNT-02 | Filtro por modelo SGCO / SGSM / SGCM | ✅ | API |
| MNT-03 | Filtro por estado (todos / requieren / próximo / normal) | ✅ | API + `?estado=` |
| MNT-04 | Ordenamiento: Equipo, Modelo, Horómetro, Horas faltantes | ✅ | API |
| MNT-05 | Barra de progreso visual por ciclo PM | ✅ | Cálculo backend |
| MNT-06 | Paginación 10 / 25 / 50 | ✅ | API |
| MNT-07 | Pre-filtro desde Dashboard (`?estado=requieren`) | ✅ | Mantener |
| MNT-08 | Doble clic → Histórico del equipo | ✅ *(extra mockup)* | Deep link `/historico?equipo=` |
| MNT-09 | Registro de PM completado | ❌ | Formulario + API (fase 4) |

---

### 3.6 Módulo Histórico

**Ruta mockup:** `/historico`  
**Estado mockup:** historial aleatorio por equipo (preventivos, correctivos y alarmas).

#### Funcionalidades documentadas

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| HIS-01 | Selector / búsqueda por ID equipo | ✅ | API |
| HIS-02 | Tabla mantenimientos preventivos: fecha, tipo PM, horómetro | ✅ | BD intervenciones |
| HIS-03 | Orden por fecha descendente | ✅ | Query API |
| HIS-04 | Resumen: total PM, último PM, próximo PM estimado | ✅ | Agregaciones |
| HIS-05 | Indicador estado actual del ciclo PM | ✅ | Cálculo backend |
| HIS-06 | Técnico responsable por registro | Parcial | Campo opcional en BD |

#### Funcionalidades extra del mockup

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| HIS-07 | Historial de mantenimientos **correctivos** | ✅ generado | BD + categoría |
| HIS-08 | Historial de **alarmas** del equipo | ✅ generado | API alarmas históricas |
| HIS-09 | Deep link desde Data/Mantenimiento (`?equipo=`) | ✅ | Mantener |

---

### 3.7 Documentación técnica (interna)

**Ruta mockup:** `/documentacion`  
**Estado mockup:** acceso con contraseña hardcodeada en cliente (`lpmp2018`).

| ID | Funcionalidad | Mockup | Producción |
|----|---------------|--------|------------|
| DOC-01 | Acceso restringido por contraseña | ✅ cliente | Rol admin / auth backend |
| DOC-02 | Documentación de módulos y convenciones | ✅ | Mantener / sincronizar con este archivo |
| DOC-03 | Catálogo alarmas y ciclos PM embebido | ✅ | Fuente única de verdad en backend |

---

### 3.8 Navegación, arquitectura y convenciones

#### Rutas (prefijo producción: `/zgroup_genset`)

| Ruta relativa | Módulo |
|---------------|--------|
| `/login` | Autenticación |
| `/` | Panel principal |
| `/alarmas` | Alarmas |
| `/data` | Telemetría |
| `/mantenimiento` | Mantenimiento |
| `/historico` | Histórico |
| `/documentacion` | Documentación interna |

#### Query params soportados en mockup

| Parámetro | Módulo | Uso |
|-----------|--------|-----|
| `?vista=general` | Data | Forzar vista general |
| `?conexion=online\|menos12h\|mas24h` | Data | Filtro conectividad |
| `?estado=requieren\|proximo` | Mantenimiento | Filtro estado PM |
| `?equipo=ZGUUxxxxxxx` | Histórico | Selección directa de equipo |

#### Convenciones de conectividad

| Estado | Regla |
|--------|-------|
| Conectado / En línea | Última comunicación < 12 h |
| Intermitente | Entre 12 h y 23 h sin comunicación |
| Sin conexión | ≥ 24 h sin comunicación |

#### Estructura frontend (actual)

```
src/app/pages/       → un .tsx por módulo
src/app/components/  → AlarmaDetalle, UI shadcn
src/app/layouts/     → MainLayout (nav superior)
src/app/routes.tsx   → rutas centralizadas
src/styles/          → tokens y estilos globales
```

---

## 4. Fases de desarrollo

### Fase 0 — Mockup UI ✅ (completada)

**Objetivo:** validar UX, flujos de navegación y reglas de negocio visuales.

- [x] Layout principal y navegación SPA
- [x] Pantallas de todos los módulos
- [x] Datos simulados en cliente (`Math.random`, arrays estáticos)
- [x] Componentes UI reutilizables (shadcn)
- [x] Docker + nginx en puerto 3550 bajo `/zgroup_genset/`

**Entregable:** repositorio actual desplegable como prototipo.

---

### Fase 1 — Fundamentos backend y autenticación

**Objetivo:** sustituir la capa demo por servicios reales y seguridad.

| Tarea | Detalle |
|-------|---------|
| 1.1 | Definir esquema BD: usuarios, roles, sesiones |
| 1.2 | API REST (o GraphQL): login, logout, refresh token |
| 1.3 | Route guards en frontend + interceptor HTTP |
| 1.4 | Variables de entorno (API URL, secrets) |
| 1.5 | Migrar contraseña de documentación a control por rol |

**Criterios de aceptación:**

- Sin credenciales válidas no se accede a módulos internos
- Cerrar sesión invalida token en servidor
- Login mockup conectado a API real

**Módulos impactados:** AUTH-01 a AUTH-05, DOC-01

---

### Fase 2 — Maestro de equipos y telemetría (Data)

**Objetivo:** persistir flota y lecturas; alimentar vista general y detalle.

| Tarea | Detalle |
|-------|---------|
| 2.1 | Modelo `Equipo`: ID ZGUU, modelo, serie, ubicación, instalación |
| 2.2 | Ingesta telemetría (batch o streaming): horómetro, voltaje, temp., combustible, GPS |
| 2.3 | API listado flota con filtros, orden, paginación |
| 2.4 | API detalle equipo + últimas N lecturas |
| 2.5 | API series temporales por rango de fechas |
| 2.6 | Reemplazar `generarUnidadesGenerales()` por hooks/API |
| 2.7 | Reglas de conectividad (< 12 h, ≥ 24 h) en backend |

**Criterios de aceptación:**

- 247 equipos cargados desde BD
- Filtros y paginación coherentes con mockup
- Vista detalle muestra telemetría real (< 60 s de latencia aceptable en v1)

**Módulos impactados:** DATA-01 a DATA-14, DASH-01, DASH-03 a DASH-05, DASH-08

---

### Fase 3 — Alarmas

**Objetivo:** ciclo de vida completo de alarmas vinculadas a equipos.

| Tarea | Detalle |
|-------|---------|
| 3.1 | Catálogo códigos 101–107 en BD (nombre, tipo, descripción, diagnóstico) |
| 3.2 | API alarmas activas / resueltas / por equipo |
| 3.3 | Ingesta de eventos desde telemetría o controlador |
| 3.4 | Transición Activa → Resuelta con auditoría |
| 3.5 | Conectar módulo Alarmas y referencia colapsable al catálogo API |
| 3.6 | Filtros por equipo, severidad y estado |

**Criterios de aceptación:**

- Alarmas reales visibles en `/alarmas` y en detalle de equipo
- Conteo de alarmas activas alimenta Dashboard (DASH-02)

**Módulos impactados:** ALM-01 a ALM-07, DASH-02, DATA-10, HIS-08

---

### Fase 4 — Mantenimiento preventivo

**Objetivo:** motor de reglas PM1–PM4 y registro de intervenciones.

| Tarea | Detalle |
|-------|---------|
| 4.1 | Servicio cálculo: horas faltantes, progreso, estado (Vencido/Urgente/Próximo/Normal) |
| 4.2 | Matriz de tareas por ciclo PM1–PM4 |
| 4.3 | API listado mantenimiento (filtros, orden, paginación) |
| 4.4 | API registro PM completado (fecha, horómetro, técnico, tipo PM) |
| 4.5 | Reemplazar `generarEquipos()` en Mantenimiento.tsx |
| 4.6 | Sincronizar pre-filtros Dashboard → Mantenimiento |

**Criterios de aceptación:**

- Estados PM coinciden con fórmulas documentadas
- Registrar un PM actualiza horómetro de referencia y histórico
- Dashboard muestra conteos reales (DASH-06, DASH-07)

**Módulos impactados:** MNT-01 a MNT-09, DASH-06, DASH-07

---

### Fase 5 — Histórico

**Objetivo:** trazabilidad de intervenciones y eventos por equipo.

| Tarea | Detalle |
|-------|---------|
| 5.1 | API historial preventivos por equipo |
| 5.2 | API historial correctivos (extensión mockup) |
| 5.3 | API historial alarmas por equipo |
| 5.4 | Resumen estadístico: total PM, último, próximo estimado |
| 5.5 | Reemplazar `generarHistorial()` |
| 5.6 | Mantener deep links `?equipo=` desde Data y Mantenimiento |

**Criterios de aceptación:**

- Histórico refleja PM registrados en Fase 4
- Búsqueda por ID devuelve equipo único o lista paginada
- Orden cronológico descendente verificado

**Módulos impactados:** HIS-01 a HIS-09

---

### Fase 6 — Dashboard integrado y tiempo real

**Objetivo:** panel principal con métricas en vivo y experiencia operativa.

| Tarea | Detalle |
|-------|---------|
| 6.1 | API agregaciones flota (totales, conectividad, PM, alarmas, combustible) |
| 6.2 | Reemplazar valores fijos y `generarEstadisticas()` aleatorio |
| 6.3 | Polling o WebSocket para actualización periódica |
| 6.4 | Notificaciones push de alarmas nuevas (opcional v1.1) |
| 6.5 | Optimización rendimiento (cache, índices BD) |

**Criterios de aceptación:**

- Todas las tarjetas del Dashboard reflejan datos reales
- Click en tarjeta aplica filtro correcto en módulo destino
- Latencia aceptable < 5 s para refresco de métricas

**Módulos impactados:** DASH-01 a DASH-11, ALM-08

---

### Fase 7 — Endurecimiento, QA y producción

**Objetivo:** calidad, observabilidad y operación continua.

| Tarea | Detalle |
|-------|---------|
| 7.1 | Tests unitarios reglas PM y conectividad |
| 7.2 | Tests E2E flujos críticos (login → data → alarma → histórico) |
| 7.3 | CI/CD: build, test, imagen Docker |
| 7.4 | Logging, métricas y health checks |
| 7.5 | Documentación API (OpenAPI) |
| 7.6 | Sincronizar `Documentacion.tsx` con estado real del sistema |
| 7.7 | Revisión seguridad (OWASP, rate limiting, CORS) |

**Criterios de aceptación:**

- Pipeline verde en CI
- Imagen Docker desplegada en entorno staging/producción
- Documentación interna alineada con implementación

---

## 5. Mapa de dependencias entre fases

```
Fase 0 (Mockup UI) ✅
    │
    ▼
Fase 1 (Auth) ──────────────────────────────┐
    │                                        │
    ▼                                        ▼
Fase 2 (Equipos + Telemetría)          Fase 7 (QA/Prod)
    │
    ├──────────────┬──────────────┐
    ▼              ▼              ▼
Fase 3         Fase 4         Fase 5
(Alarmas)   (Mantenimiento)  (Histórico)
    │              │              │
    └──────────────┴──────────────┘
                   │
                   ▼
            Fase 6 (Dashboard + RT)
```

---

## 6. Backlog transversal (todas las fases)

| ID | Item | Prioridad |
|----|------|-----------|
| XT-01 | Capa API client tipada (TypeScript) | Alta |
| XT-02 | Manejo global de errores y estados loading/empty | Alta |
| XT-03 | Internacionalización ES (actual) — EN opcional | Baja |
| XT-04 | Export CSV/PDF de tablas Data y Mantenimiento | Media |
| XT-05 | Roles: operador, técnico, administrador | Media |
| XT-06 | Auditoría de cambios (quién resolvió alarma, quién registró PM) | Alta |
| XT-07 | Unificar catálogo alarmas mockup vs documentación (códigos 104–107) | Alta |

---

## 7. Referencia rápida — checklist por módulo

| Módulo | Funcionalidades doc. | Extras mockup | Fase principal |
|--------|---------------------|---------------|----------------|
| Login | 4 | Recuperar contraseña (placeholder) | 1 |
| Dashboard | 8 | Combustible bajo | 6 |
| Alarmas | 6 | — | 3 |
| Data | 12 | Combustible, GPS, fechas, RPM | 2 |
| Mantenimiento | 7 | Doble clic → histórico | 4 |
| Histórico | 6 | Correctivos, alarmas | 5 |
| Documentación | 2 | — | 1 / 7 |

---

*Documento generado a partir del módulo Documentación y análisis del código mockup — Junio 2026.*
