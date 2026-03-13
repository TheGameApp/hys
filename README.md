# HyS Software — Landing Page & Client Portal

Sitio web corporativo y portal de clientes para **HyS Software**, empresa de desarrollo de software fundada en 2016 con base en Latinoamerica. Incluye landing page con 14+ secciones animadas, sistema de autenticacion, dashboard de clientes, panel de administracion y soporte bilingue (ES/EN).

## Demo

```
Landing:     /es  |  /en
Login:       /es/auth/login
Register:    /es/auth/register
Dashboard:   /es/dashboard
Admin:       /es/admin
```

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Animaciones | Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Auth & DB | Supabase (SSR client) |
| Email | Resend |
| i18n | next-intl (ES/EN) |
| Temas | next-themes (Light/Dark) |
| Iconos | Lucide React |

---

## Requisitos Previos

- **Node.js** >= 18.17
- **npm** >= 9 (o pnpm/yarn)
- **Cuenta Supabase** — proyecto con auth habilitado
- **Cuenta Resend** — para envio de emails del formulario de contacto

---

## Instalacion

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd hys-software-website
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raiz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu-service-role-key

# Resend (email)
RESEND_API_KEY=re_...tu-api-key

# Email destino para formulario de contacto
CONTACT_EMAIL=tu@email.com
```

| Variable | Descripcion | Requerida |
|----------|------------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL publica de tu proyecto Supabase | Si |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anonima publica de Supabase | Si |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo server-side) | Si |
| `RESEND_API_KEY` | API key de Resend para enviar correos | Si |
| `CONTACT_EMAIL` | Email donde llegan los mensajes del formulario | Si |

### 4. Configurar la base de datos (Supabase)

Ejecutar la migracion SQL en el **SQL Editor** de tu proyecto Supabase. El archivo se encuentra en:

```
supabase/migrations/001_initial_schema.sql
```

Esta migracion crea:

- **profiles** — Perfiles de usuario con roles (client/admin)
- **projects** — Peticiones/proyectos de los clientes
- **contact_messages** — Mensajes del formulario de contacto
- **RLS policies** — Seguridad a nivel de fila para cada tabla
- **Trigger** — Creacion automatica de perfil al registrarse un usuario

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`.

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|------------|
| `npm run dev` | Servidor de desarrollo con hot reload (Turbopack) |
| `npm run build` | Build de produccion optimizado |
| `npm run start` | Iniciar servidor de produccion |
| `npm run lint` | Ejecutar ESLint |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── [locale]/              # Rutas con soporte i18n
│   │   ├── page.tsx           # Landing page (14+ secciones)
│   │   ├── auth/
│   │   │   ├── login/         # Login con toggle de password
│   │   │   ├── register/      # Registro con confirmacion por email
│   │   │   └── callback/      # OAuth callback de Supabase
│   │   ├── dashboard/         # Portal de clientes
│   │   │   ├── layout.tsx     # Layout responsive con sidebar colapsable
│   │   │   ├── page.tsx       # Mis proyectos + crear peticion
│   │   │   └── projects/[id]/ # Detalle de proyecto
│   │   └── admin/             # Panel de administracion
│   │       ├── layout.tsx     # Layout admin con sidebar
│   │       ├── page.tsx       # Dashboard admin
│   │       └── projects/[id]/ # Gestion de proyecto
│   └── api/
│       └── contact/route.ts   # API de contacto (Resend email)
├── components/
│   ├── sections/              # Secciones del landing page
│   │   ├── hero.tsx           # Hero con escena Three.js
│   │   ├── about.tsx          # Nosotros (equipo + valores)
│   │   ├── features.tsx       # Servicios
│   │   ├── process.tsx        # Proceso de trabajo
│   │   ├── infrastructure.tsx # Infraestructura global
│   │   ├── metrics.tsx        # Metricas animadas
│   │   ├── integrations.tsx   # Stack tecnologico (+50 techs)
│   │   ├── security.tsx       # Seguridad
│   │   ├── developers.tsx     # Para developers
│   │   ├── testimonials.tsx   # Testimonios de clientes
│   │   ├── featured-projects.tsx # 6 proyectos destacados
│   │   ├── pricing.tsx        # Planes de precios
│   │   ├── cta.tsx            # Call to action
│   │   ├── contact-form.tsx   # Formulario estilo ticket
│   │   └── ribbon.tsx         # Cinta de metricas animada
│   ├── dashboard/
│   │   ├── sidebar.tsx        # Sidebar responsive (desktop + mobile)
│   │   ├── project-card.tsx   # Card de proyecto
│   │   └── project-table.tsx  # Tabla de proyectos (admin)
│   ├── layout/
│   │   ├── navbar.tsx         # Navegacion principal responsive
│   │   ├── footer.tsx         # Footer con links
│   │   ├── theme-toggle.tsx   # Toggle light/dark
│   │   └── language-switcher.tsx # Selector ES/EN
│   ├── three/
│   │   ├── hero-scene.tsx     # Particulas + icosaedro 3D
│   │   └── dashboard-decoration.tsx # Octaedro wireframe sutil
│   └── ui/                    # Componentes base reutilizables
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       ├── section-wrapper.tsx
│       ├── animated-counter.tsx
│       ├── code-block.tsx
│       └── marquee.tsx
├── i18n/                      # Configuracion de internacionalizacion
│   ├── routing.ts             # Locales: es (default), en
│   ├── request.ts             # Carga de mensajes por request
│   └── navigation.ts          # Links y router con locale
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Cliente browser (SSR compatible)
│   │   ├── server.ts          # Cliente server-side
│   │   └── middleware.ts      # Refresh de sesion
│   ├── resend.ts              # Instancia de Resend
│   └── utils.ts               # cn() helper (clsx + tailwind-merge)
├── messages/
│   ├── es.json                # Traducciones en espanol
│   └── en.json                # Traducciones en ingles
└── middleware.ts               # Middleware de i18n + auth
```

---

## Funcionalidades

### Landing Page
- **14+ secciones** con animaciones de scroll (Framer Motion)
- **Hero 3D** con particulas y geometria flotante (Three.js)
- **Formulario de contacto** estilo ticket con envio de email formateado
- **Responsive** — optimizado para mobile, tablet y desktop
- **Dark/Light mode** — toggle persistente
- **Bilingue** — espanol e ingles con cambio instantaneo

### Autenticacion
- Login y registro con Supabase Auth
- Toggle de visibilidad de contrasena
- Confirmacion por email al registrarse
- Roles: `client` y `admin`

### Dashboard de Clientes
- Ver proyectos propios
- Crear nuevas peticiones de proyecto (titulo, descripcion, presupuesto, prioridad)
- Sidebar responsive con menu hamburguesa en mobile
- Decoracion 3D sutil (octaedro wireframe)

### Panel de Administracion
- Ver todos los proyectos de todos los clientes
- Cambiar estado y prioridad de proyectos
- Ver mensajes de contacto
- Gestion de usuarios

### Email de Contacto
- Template HTML estilizado (monospace, formato terminal)
- Incluye todos los campos: nombre, email, empresa, tipo de proyecto, presupuesto, prioridad, mensaje
- Badges de color para tipo de proyecto y presupuesto
- `replyTo` configurado al email del remitente

---

## Base de Datos (Supabase)

### Tablas

**profiles**
| Columna | Tipo | Descripcion |
|---------|------|------------|
| id | uuid (PK) | Referencia a auth.users |
| full_name | text | Nombre completo |
| company | text | Empresa |
| role | text | `client` o `admin` |
| created_at | timestamptz | Fecha de creacion |

**projects**
| Columna | Tipo | Descripcion |
|---------|------|------------|
| id | uuid (PK) | ID auto-generado |
| client_id | uuid (FK) | Referencia a profiles |
| title | text | Titulo del proyecto |
| description | text | Descripcion |
| status | text | `pending`, `in_progress`, `review`, `completed`, `cancelled` |
| priority | text | `low`, `medium`, `high` |
| budget_range | text | Rango de presupuesto |
| created_at | timestamptz | Fecha de creacion |
| updated_at | timestamptz | Ultima actualizacion |

**contact_messages**
| Columna | Tipo | Descripcion |
|---------|------|------------|
| id | uuid (PK) | ID auto-generado |
| name | text | Nombre del remitente |
| email | text | Email del remitente |
| company | text | Empresa |
| message | text | Mensaje |
| created_at | timestamptz | Fecha de creacion |

### Seguridad (RLS)
- Los clientes solo ven/crean sus propios proyectos
- Los admins ven todos los proyectos y mensajes
- Cualquier persona puede enviar mensajes de contacto (formulario publico)
- Los perfiles son visibles solo para el propio usuario o admins

---

## Crear un Usuario Admin

Despues de registrar un usuario normalmente, ejecutar en el SQL Editor de Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'uuid-del-usuario';
```

---

## Deploy

### Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno en el dashboard de Vercel
3. Deploy automatico en cada push

### Otro hosting

```bash
npm run build
npm run start
```

Asegurar que las variables de entorno esten configuradas en el servidor.

---

## Internacionalizacion

Los archivos de traduccion estan en `src/messages/`:
- `es.json` — Espanol (idioma por defecto)
- `en.json` — Ingles

Para agregar un nuevo idioma:
1. Crear `src/messages/{locale}.json` con las mismas keys
2. Agregar el locale en `src/i18n/routing.ts`
3. El middleware detectara automaticamente el nuevo idioma

---

## Licencia

Proyecto privado de HyS Software. Todos los derechos reservados.
