# Backoffice Viajes Altairis

Sistema de gestión interna para agencias de viajes y hoteles. Permite administrar hoteles, tipos de habitación, disponibilidad e inventario, y reservas de huéspedes desde un panel centralizado.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | Angular 17 + Angular Material |
| Backend | ASP.NET Core 8 (C#) |
| ORM | Entity Framework Core 8 + Pomelo MySQL |
| Base de datos | MySQL 8.0 |
| Contenedores | Docker + Docker Compose |
| Documentación API | Swagger / OpenAPI |

---

## Funcionalidades principales

- **Dashboard** — Resumen de ocupación, ingresos y reservas activas
- **Hoteles** — Alta, edición y desactivación de hoteles
- **Tipos de Habitación** — Gestión de categorías con capacidad, precio base y stock total
- **Disponibilidad e Inventario** — Carga masiva por rango de fechas; visualización de ocupación por día con restricción automática de cupos
- **Reservas** — Creación con validación de disponibilidad en tiempo real, cambio de estado (Pendiente → Confirmada → Check-in → Check-out / Cancelada), y descuento automático de cupos al confirmar

---

## Estructura del proyecto

```
Backoffice-Viajes-Altairis-MVP/
├── backend/          # ASP.NET Core 8 Web API
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   └── DTOs/
├── frontend/         # Angular 17 SPA
│   └── src/app/
│       ├── core/         # Servicios, modelos, guards
│       └── features/     # Módulos por funcionalidad
│           ├── dashboard/
│           ├── hotels/
│           ├── room-types/
│           ├── availability/
│           └── bookings/
└── docker-compose.yml
```

---

## Requisitos

- [Docker](https://www.docker.com/) y Docker Compose

---

## Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Backoffice-Viajes-Altairis-MVP.git
cd Backoffice-Viajes-Altairis-MVP

# Levantar todos los servicios
docker compose up --build
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:4200 |
| API REST | http://localhost:5000 |
| Swagger | http://localhost:5000/swagger |
| MySQL | localhost:3306 |

La base de datos se crea automáticamente al iniciar el backend por primera vez.

---

## Variables de entorno

El backend se configura mediante variables de entorno definidas en `docker-compose.yml`:

```env
ConnectionStrings__DefaultConnection=Server=mysql;Database=altairis_db;User=root;Password=altairis123;
ASPNETCORE_ENVIRONMENT=Production
```

Para entornos productivos se recomienda externalizar las credenciales usando un archivo `.env` o un gestor de secretos.

---

## API REST

La API sigue convenciones REST estándar bajo el prefijo `/api`:

| Recurso | Endpoint base |
|---|---|
| Hoteles | `/api/hotels` |
| Tipos de habitación | `/api/roomtypes` |
| Disponibilidad | `/api/availability` |
| Reservas | `/api/bookings` |
| Dashboard | `/api/dashboard` |

Documentación interactiva disponible en `/swagger` al levantar el backend.
