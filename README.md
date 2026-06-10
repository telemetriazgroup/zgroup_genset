# ZTRACK GENSET Platform

Plataforma web de telemetría para el monitoreo y gestión de generadores de energía móviles (247 equipos, formatos SGCO · SGSM · SGCM).

Diseño original: [Figma — ZTRACK GENSET Platform](https://www.figma.com/design/HndukD7vjQR7q02GZchsGE/ZTRACK-GENSET-Platform).

## Funcionalidades

| Módulo | Ruta | Descripción |
|--------|------|-------------|
| Login | `/login` | Autenticación con diseño minimalista |
| Panel Principal | `/` | Métricas de flota, equipos conectados, alarmas y mantenimiento |
| Alarmas | `/alarmas` | Alarmas activas (códigos 101–107) con detalle expandible |
| Data | `/data` | Tabla de 247 equipos y vista detallada de telemetría |
| Mantenimiento | `/mantenimiento` | Ciclos PM1–PM4 cada 500 h con filtros y paginación |
| Histórico | `/historico` | Registro de mantenimientos preventivos por equipo |
| Documentación | `/documentacion` | Documentación técnica interna (acceso restringido) |

Todas las rutas se sirven bajo el prefijo **`/zgroup_genset/`** (ej.: `http://localhost:3550/zgroup_genset/`).

## Desarrollo local

```bash
npm install
npm run dev
```

La app queda disponible en [http://localhost:3550/zgroup_genset/](http://localhost:3550/zgroup_genset/).

## Build de producción

```bash
npm install
npm run build
npm run preview
```

## Docker

### Con Docker Compose (recomendado)

```bash
docker compose up --build -d
```

Acceso: [http://localhost:3550/zgroup_genset/](http://localhost:3550/zgroup_genset/)

### Solo Docker

```bash
docker build -t zgroup-genset .
docker run -d --name zgroup-genset -p 3550:3550 zgroup-genset
```

### Detener

```bash
docker compose down
```

## Stack

- React 18 + TypeScript
- Vite 6
- React Router 7
- Tailwind CSS v4
- shadcn/ui
# zgroup_genset
