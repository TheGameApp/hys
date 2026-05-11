# HyS Software — Landing Page & Client Portal

Sitio web corporativo y portal de clientes para **HyS Software**, empresa de desarrollo de software fundada en 2016 con base en Latinoamerica. Incluye landing page con 14+ secciones animadas, sistema de autenticacion con **2FA (TOTP)**, dashboard de clientes, panel de administracion y soporte bilingue (ES/EN).

## Demo

```
Landing:     /es  |  /en
Login:       /es/auth/login
Register:    /es/auth/register
2FA verify:  /es/auth/2fa/verify
Dashboard:   /es/dashboard
Security:    /es/dashboard/settings/security
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
| 2FA | Supabase MFA nativo (TOTP) + `qrcode` para generar QR |
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

Ejecutar las migraciones SQL en el **SQL Editor** de tu proyecto Supabase, en orden:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_mfa.sql
supabase/migrations/003_harden_handle_new_user.sql
```

Estas migraciones crean:

- **profiles** — Perfiles de usuario con roles (client/admin)
- **projects** — Peticiones/proyectos de los clientes
- **contact_messages** — Mensajes del formulario de contacto
- **mfa_backup_codes** — Codigos de respaldo para 2FA (uso futuro: Fase 2)
- **mfa_phone_factors** — Telefono de respaldo via SMS (uso futuro: Fase 3)
- **RLS policies** — Seguridad a nivel de fila para cada tabla
- **Trigger** — Creacion automatica de perfil al registrarse un usuario
- **Hardening** — `search_path` fijo + `REVOKE EXECUTE` en `handle_new_user()`

### 5. Configurar Auth y MFA en Supabase

En el **Dashboard de Supabase** del proyecto:

1. **Authentication → URL Configuration**
   - **Site URL**: `https://tu-dominio.com` (o `http://localhost:3000` para desarrollo). Esto es lo que aparece como "Issuer" en la app autenticadora — sin esto, los usuarios veran "localhost" al escanear el QR.
   - **Redirect URLs**: agregar `https://tu-dominio.com/auth/callback` y `http://localhost:3000/auth/callback`.

2. **Authentication → Multi-Factor Authentication**
   - Verificar que **TOTP** este habilitado (esta ON por defecto en proyectos nuevos).

3. **Authentication → Email** (opcional)
   - Activar/desactivar confirmacion de email segun ambiente.

### 6. Levantar el servidor de desarrollo

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
│   │   │   ├── login/         # Login con toggle de password + redirect a 2FA si aplica
│   │   │   ├── register/      # Registro con confirmacion por email
│   │   │   ├── callback/      # OAuth callback de Supabase
│   │   │   └── 2fa/verify/    # Verificacion de codigo TOTP durante login
│   │   ├── dashboard/         # Portal de clientes
│   │   │   ├── layout.tsx     # Layout responsive con sidebar colapsable
│   │   │   ├── page.tsx       # Mis proyectos + crear peticion
│   │   │   ├── projects/[id]/ # Detalle de proyecto
│   │   │   └── settings/
│   │   │       ├── page.tsx           # Redirect a security
│   │   │       └── security/page.tsx  # Activar/desactivar 2FA
│   │   └── admin/             # Panel de administracion
│   │       ├── layout.tsx     # Layout admin con sidebar
│   │       ├── page.tsx       # Dashboard admin
│   │       └── projects/[id]/ # Gestion de proyecto
│   └── api/
│       ├── contact/route.ts                          # API de contacto (Resend email)
│       └── auth/mfa/
│           ├── totp/enroll/route.ts                  # Crear factor TOTP + generar QR
│           ├── totp/verify-enroll/route.ts           # Confirmar primer codigo y activar
│           ├── totp/challenge/route.ts               # Crear challenge para login
│           ├── totp/verify/route.ts                  # Verificar codigo durante login
│           └── disable/route.ts                      # Desactivar 2FA (admin API + signOut global)
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
│   ├── mfa/
│   │   ├── otp-input.tsx      # Input de 6 digitos con auto-advance + paste
│   │   ├── qr-code.tsx        # Renderiza el QR data URL del enroll
│   │   └── security-panel.tsx # UI principal de activacion/desactivacion 2FA
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
│   │   └── middleware.ts      # Refresh de sesion + gating AAL2 + admin enforcement
│   ├── mfa/
│   │   └── log.ts             # Logger estructurado JSON para endpoints MFA
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

### Autenticacion de Dos Factores (2FA)
- **TOTP nativo de Supabase** — compatible con Google Authenticator, Authy, 1Password, Microsoft Authenticator
- **Activacion opcional** desde `/dashboard/settings/security` — modal con QR + input de 6 digitos
- **Verificacion al login** — si el usuario tiene 2FA activo, despues del password se le redirige automaticamente a `/auth/2fa/verify`
- **Middleware AAL2** — protege `/dashboard` y `/admin`; si el usuario necesita step-up, se le bota a la pagina de verificacion preservando el destino (`?next=`)
- **Admins obligatorios** — usuarios con `role = 'admin'` que aun no tengan 2FA son redirigidos a configurarlo antes de acceder a `/admin`
- **Desactivacion segura** — requiere re-auth con password; usa el **admin API (service_role)** para borrar el factor sin requerir AAL2 activa; tras exito invalida la sesion globalmente (`signOut({ scope: 'global' })`) y redirige a login con banner de aviso
- **Logs estructurados** — todos los endpoints `mfa/*` emiten JSON con `event`, `user_id`, `factor_id`, `error` (sin passwords, secretos ni codigos)
- **Funciona offline** — los codigos TOTP se generan localmente en la app autenticadora cada 30 segundos, no requieren internet
- Preparado para **Fase 2 (backup codes)** y **Fase 3 (SMS via Twilio)** — tablas ya creadas en migraciones

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

**mfa_backup_codes** (Fase 2 — uso futuro)
| Columna | Tipo | Descripcion |
|---------|------|------------|
| id | uuid (PK) | ID auto-generado |
| user_id | uuid (FK) | Referencia a auth.users |
| code_hash | text | Hash sha256 del codigo |
| code_salt | text | Salt unico por codigo |
| used_at | timestamptz | NULL si no usado |
| created_at | timestamptz | Fecha de creacion |

**mfa_phone_factors** (Fase 3 — uso futuro)
| Columna | Tipo | Descripcion |
|---------|------|------------|
| id | uuid (PK) | ID auto-generado |
| user_id | uuid (FK, UNIQUE) | Referencia a auth.users |
| phone_e164 | text | Numero en formato E.164 |
| verified_at | timestamptz | NULL si no verificado |
| created_at | timestamptz | Fecha de creacion |

> Los factores TOTP de Supabase se guardan en `auth.mfa_factors` (gestionado por Supabase, no en el schema `public`).

### Seguridad (RLS)
- Los clientes solo ven/crean sus propios proyectos
- Los admins ven todos los proyectos y mensajes
- Cualquier persona puede enviar mensajes de contacto (formulario publico)
- Los perfiles son visibles solo para el propio usuario o admins
- Las tablas MFA (`mfa_backup_codes`, `mfa_phone_factors`) solo permiten `SELECT` al propio dueno; los INSERT/UPDATE/DELETE ocurren via `service_role` desde los endpoints API

---

## Crear un Usuario Admin

Despues de registrar un usuario normalmente, ejecutar en el SQL Editor de Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'uuid-del-usuario';
```

> Cuando el usuario pase a `role = 'admin'`, el middleware lo redirigira automaticamente a `/dashboard/settings/security?force=true` la primera vez que intente acceder a `/admin/**` si todavia no tiene 2FA activo. No podra entrar al panel admin hasta que active TOTP.

---

## Probar 2FA en desarrollo

1. Registrar una cuenta en `/auth/register` y confirmar email (o desactivar la confirmacion en Auth → Email).
2. Loguear con email + password.
3. Ir a `/dashboard/settings/security` → click **Activar 2FA** → escanear el QR con Google Authenticator / Authy / 1Password → ingresar el codigo de 6 digitos → badge verde "Activo".
4. Logout → login → ahora redirige automaticamente a `/auth/2fa/verify` → ingresar codigo de la app → entra al dashboard.
5. Para probar desactivacion: en security panel → **Desactivar 2FA** → ingresar password → sera redirigido a login con banner verde "Tu 2FA fue desactivado".

**Tip:** durante testing, no es necesario desactivar 2FA cada vez. Para simular un login fresco basta con cerrar sesion (botton en sidebar) o limpiar cookies. Cada activacion genera un QR nuevo (es el comportamiento correcto por seguridad: el secreto anterior se destruye al desactivar).

**Inspeccionar factores en la DB:**

```sql
SELECT u.email, f.friendly_name, f.factor_type, f.status, f.created_at
FROM auth.mfa_factors f
JOIN auth.users u ON u.id = f.user_id
ORDER BY f.created_at DESC;
```

---

## Deploy

### Vercel (recomendado)

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno en el dashboard de Vercel.
   - **Importante**: `SUPABASE_SERVICE_ROLE_KEY` debe estar marcada como server-only (no usar prefijo `NEXT_PUBLIC_`). El endpoint `/api/auth/mfa/disable` la usa para borrar factores MFA vis el admin API.
   - Asegurarse de que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` apunten al proyecto Supabase correcto.
3. En el dashboard de Supabase del proyecto productivo, configurar **Site URL** y **Redirect URLs** con el dominio de produccion (paso 5 de instalacion) para que el QR de 2FA muestre el nombre correcto en la app autenticadora.
4. Deploy automatico en cada push.

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
