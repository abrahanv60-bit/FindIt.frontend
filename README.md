# FindIt — Frontend (Angular)

Frontend de **FindIt**, un sistema para publicar y encontrar objetos perdidos o encontrados. Este proyecto forma parte de una aplicación con **Angular 22 + Tailwind CSS** (frontend), **ASP.NET Core / .NET 10** (API) y **PostgreSQL** (base de datos).

> Esta guía está pensada para compañeros que están empezando con Angular. El frontend y el backend se ejecutan **por separado**, pero trabajan juntos.

## 1. ¿Qué permite hacer FindIt?

- Registrarse e iniciar sesión.
- Ver objetos publicados, incluso sin iniciar sesión.
- Publicar un objeto perdido o encontrado (con sesión iniciada).
- Editar y eliminar **solo las publicaciones propias**.
- Cerrar sesión.

## 2. Requisitos

Antes de empezar, instala:

- **Git**.
- **Node.js compatible con Angular 22** y **npm** (incluido con Node.js).
- **Visual Studio Code** u otro editor.
- El [backend de FindIt](https://github.com/abrahanv60-bit/FindIt.API) funcionando, con PostgreSQL configurado.

Comprueba que tienes Node.js y npm:

```bash
node -v
npm -v
```

> Si es tu primera vez con el backend, sigue **primero** su [README de instalación](https://github.com/abrahanv60-bit/FindIt.API/blob/main/README.md): explica cómo configurar PostgreSQL, los User Secrets, JWT y las migraciones. **No subas contraseñas ni claves a GitHub.**

## 3. Descargar el frontend por primera vez

Abre una terminal y ejecuta:

```bash
git clone https://github.com/abrahanv60-bit/FindIt.frontend.git
cd FindIt.frontend
npm install
```

- `git clone` descarga el código.
- `cd` entra a la carpeta.
- `npm install` instala las dependencias en `node_modules` (esta carpeta **no se sube a GitHub**).

## 4. Iniciar el proyecto completo

Necesitas **dos terminales**.

### Terminal 1 — Backend (API)

En la carpeta `FindIt.API`, después de haber configurado la base de datos y JWT siguiendo su README:

```bash
dotnet run --launch-profile http
```

La API debería estar disponible en **http://localhost:5247**.

### Terminal 2 — Frontend (Angular)

En la carpeta `FindIt.frontend`:

```bash
npm start -- --proxy-config src/proxy.conf.json
```

Abre **http://localhost:4200** en el navegador.

**¿Para qué sirve el proxy?** El frontend hace peticiones a rutas como `/api/objetos`. El archivo `src/proxy.conf.json` las envía a `http://localhost:5247`, donde está nuestra API.

> Importante: el comando `npm start` **sin** `--proxy-config` no configura automáticamente esta conexión. Mantén ambas terminales abiertas mientras pruebas la aplicación.

## 5. Estructura del frontend

```text
src/
├── app/
│   ├── components/
│   │   ├── login/            # Inicio de sesión
│   │   ├── registro/         # Registro de usuarios
│   │   ├── objetos/          # Lista, edición y eliminación
│   │   └── publicar-objeto/  # Formulario para publicar
│   ├── guards/
│   │   └── auth.guard.ts     # Controla acceso a /publicar
│   ├── models/               # Interfaces de los datos
│   ├── services/
│   │   ├── auth.service.ts   # Login, registro y sesión
│   │   └── objetos.service.ts # Peticiones a la API de objetos
│   ├── app.routes.ts         # Rutas de navegación
│   ├── app.ts                # Componente principal
│   └── app.html              # Menú y router-outlet
├── proxy.conf.json           # Conexión local con la API
└── styles.css                # Estilos generales
```

**Para entender Angular rápidamente:**

- **Componente:** presenta una parte de la página; normalmente tiene archivos `.ts`, `.html` y `.css`.
- **Service:** contiene lógica reutilizable y usa `HttpClient` para comunicarse con el backend.
- **Model:** define mediante interfaces TypeScript la forma de los datos.
- **Guard:** controla si se permite navegar a una ruta.
- **Signal:** guarda información reactiva y permite actualizar la interfaz cuando cambia.

## 6. ¿Cómo se conecta todo?

```text
Usuario
   ↓
Angular (componentes y formularios)
   ↓
Services + HttpClient (GET, POST, PUT, DELETE)
   ↓
Proxy de desarrollo (/api → localhost:5247)
   ↓
ASP.NET Core (Controllers)
   ↓
Entity Framework Core
   ↓
PostgreSQL
```

Ejemplo al publicar una mochila:

1. Se llenan los campos en el componente `publicar-objeto`.
2. `objetos.service.ts` envía la petición `POST /api/objetos`.
3. La API valida el token JWT y guarda los datos en PostgreSQL.
4. Angular muestra el resultado.

### Operaciones CRUD

| Operación | Método HTTP | Qué hace |
| --- | --- | --- |
| Crear | `POST /api/objetos` | Publica un objeto |
| Leer | `GET /api/objetos` | Lista objetos |
| Actualizar | `PUT /api/objetos/{id}` | Edita un objeto propio |
| Eliminar | `DELETE /api/objetos/{id}` | Elimina un objeto propio |

Al iniciar sesión, la API devuelve un **JWT** que se guarda en `sessionStorage`. El **AuthGuard** impide entrar a `/publicar` sin sesión; el **backend** es quien valida realmente el token y los permisos para modificar o borrar objetos.

## 7. Problemas frecuentes

- **`npm` no se reconoce:** instala Node.js y abre una nueva terminal.
- **Faltan dependencias o aparece `node_modules` vacío:** ejecuta `npm install` en la carpeta del frontend.
- **No cargan los objetos / error de conexión:** comprueba que la API está activa en `http://localhost:5247` y que iniciaste Angular **con el proxy**.
- **No conecta con PostgreSQL:** revisa la configuración local y las migraciones siguiendo el README del backend.
- **No puedo publicar:** inicia sesión; la ruta `/publicar` y la API están protegidas.
- **No veo los objetos de otra computadora:** clonar GitHub **no copia la base de datos**; cada compañero tiene datos locales mientras no utilicemos una base compartida.

## 8. Volver a abrirlo otro día

No necesitas repetir `git clone` ni `npm install` a diario. Inicia el backend y luego, dentro del frontend, ejecuta:

```bash
npm start -- --proxy-config src/proxy.conf.json
```

Si el repositorio tiene cambios nuevos, primero puedes actualizarlo con `git pull` (guarda antes tus modificaciones locales).

---

**Repositorio del backend:** https://github.com/abrahanv60-bit/FindIt.API

**Repositorio del frontend:** https://github.com/abrahanv60-bit/FindIt.frontend
