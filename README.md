# TrabajaHoy - Proyecto Final

Proyecto académico de portal de empleo desarrollado para la materia de Desarrollo de Aplicaciones Web.

Este repositorio contiene el backend actualizado en Node.js/Express y el frontend refactorizado en Angular. El proyecto implementa un alcance reducido del portal TrabajaHoy, enfocado en los flujos principales solicitados para la entrega final.

## Estructura del repositorio

```txt
TrabajaHoy-Entrega/
├── backend/   # API REST con Node.js, Express y PostgreSQL/Supabase
├── frontend/  # Aplicación web desarrollada con Angular
└── README.md
Tecnologías utilizadas
Backend
Node.js
Express
PostgreSQL / Supabase
TypeORM
JWT para autenticación
Swagger para documentación de endpoints
Frontend
Angular
TypeScript
Bootstrap
Bootstrap Icons
CSS personalizado
Roles del sistema

El sistema trabaja con tres tipos principales de usuario:

candidate: usuario candidato o buscador de empleo.
recruiter / company_admin: usuario empresa encargado de gestionar vacantes y postulantes.
admin: administrador de la plataforma.
Módulos implementados

El alcance reducido del proyecto incluye los siguientes módulos:

Crear Usuario
Crear Empresa
Empresa crea oferta de empleo
Usuario busca empleos y ve detalle de empleo
Usuario aplica a empleo
Empresa ve aplicantes de ofertas
Empresa acepta o deniega aplicante
Empresa inactiva, cancela o elimina ofertas
Dashboard de Empresas
Dashboard de Usuarios
Funcionalidades principales
Usuario candidato
Registro e inicio de sesión.
Búsqueda de empleos.
Visualización del detalle de una vacante.
Aplicación a ofertas de empleo.
Prevención de aplicaciones duplicadas.
Seguimiento de aplicaciones realizadas.
Visualización de historial de estados, entrevistas y mensajes.
Usuario empresa
Registro e inicio de sesión.
Gestión de vacantes.
Creación de vacantes en borrador.
Publicación de vacantes.
Edición de vacantes.
Cierre y reapertura de vacantes.
Archivado y eliminación de vacantes.
Consulta de aplicantes por vacante.
Cambio de estado de aplicaciones.
Envío de mensajes y comentarios al candidato.
Usuario administrador
Dashboard administrativo con indicadores generales.
CRUD de usuarios.
CRUD de empresas.
Gestión de roles principales de usuario.
Activación y desactivación segura de usuarios.
Validación de reglas de negocio para empresas.
Cambios realizados al backend

Durante el desarrollo se realizaron ajustes al backend para soportar correctamente los módulos requeridos:

Se agregó CRUD administrativo de usuarios.
Se agregó CRUD administrativo de empresas.
Se agregó dashboard administrativo con KPIs.
Se implementó desactivación segura de usuarios mediante isActive = false.
Se agregó la regla de negocio: un propietario solo puede tener una empresa asociada.
Se agregó la regla de negocio: no se puede eliminar una empresa si tiene vacantes asociadas.
Se corrigió la asignación de roles durante el registro de usuarios.
Se corrigió el flujo para permitir reabrir vacantes cerradas.
Se ajustó el envío de comentarios de aplicaciones usando el campo { content }.
Ejecución del backend

Entrar a la carpeta del backend:

cd backend

Instalar dependencias:

npm install

Crear un archivo .env tomando como base el archivo .env.example.

Ejecutar el servidor:

npm run dev

El backend corre por defecto en:

http://localhost:3000/api
Ejecución del frontend

Entrar a la carpeta del frontend:

cd frontend

Instalar dependencias:

npm install

Ejecutar la aplicación Angular:

ng serve

El frontend corre por defecto en:

http://localhost:4200