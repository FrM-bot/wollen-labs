# Wollen Labs

Aplicación web para análisis de música utilizando la API de Spotify y Last.fm. Proyecto construido con [Next.js](https://nextjs.org) y TypeScript.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- [pnpm](https://pnpm.io/) (gestor de paquetes)
- Cuenta de desarrollador en [Spotify](https://developer.spotify.com/)
- Cuenta de desarrollador en [Last.fm](https://www.last.fm/api)

## 🚀 Instalación

1. **Clona el repositorio** (o navega al directorio del proyecto):
   ```bash
   git clone <url-del-repositorio>
   cd wollen-labs
   ```

2. **Instala las dependencias**:
   ```bash
   pnpm install
   ```

3. **Configura las variables de entorno**:
   
   Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

   ```env
   # Spotify API Credentials
   SPOTIFY_CLIENT_ID=tu_client_id_aqui
   SPOTIFY_CLIENT_SECRET=tu_client_secret_aqui
   
   # OAuth Redirect URI (debe coincidir con la configuración del Dashboard de Spotify)
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
   
   # API URL
   API_URL=https://api.spotify.com/v1
   
   # Last.fm API Credentials
   LAST_FM_API_KEY=tu_api_key_aqui
   LAST_FM_API_SECRET=tu_api_secret_aqui
   
   # Dominio de la aplicación
   NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000
   ```

   > 💡 Para más detalles sobre cómo obtener las credenciales, consulta [ENV_SETUP.md](./ENV_SETUP.md)

## 🎯 Configuración de APIs

### Spotify Dashboard

1. Ve a [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Crea una nueva aplicación o selecciona una existente
3. Agrega `http://localhost:3000/api/auth/callback` a **Redirect URIs**
4. Copia el **Client ID** y **Client Secret** a tu archivo `.env.local`

### Last.fm API

1. Ve a [Last.fm API Account](https://www.last.fm/api/account/create)
2. Crea una nueva aplicación
3. Copia el **API Key** y **Shared Secret** a tu archivo `.env.local`

## ▶️ Ejecutar el proyecto

### Modo desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo producción

1. **Construir la aplicación**:
   ```bash
   pnpm build
   ```

2. **Iniciar el servidor de producción**:
   ```bash
   pnpm start
   ```

## 🧪 Scripts disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Construye la aplicación para producción
- `pnpm start` - Inicia el servidor de producción
- `pnpm lint` - Ejecuta el linter para verificar el código

## 📁 Estructura del proyecto

```
wollen-labs/
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   ├── components/       # Componentes React reutilizables
│   ├── lib/              # Utilidades y funciones auxiliares
│   ├── config/           # Configuración (variables de entorno)
│   ├── types/            # Definiciones de tipos TypeScript
│   └── hooks/            # Custom React hooks
├── public/               # Archivos estáticos
└── .env.local            # Variables de entorno (no se commitea)
```

## 🔐 Scopes de OAuth

La aplicación requiere los siguientes scopes de Spotify:
- `user-read-private` - Leer datos del perfil del usuario
- `user-read-email` - Leer el email del usuario
- `user-top-read` - Leer los artistas y tracks más escuchados del usuario
- `user-read-recently-played` - Leer los tracks reproducidos recientemente
- `user-library-read` - Leer el contenido guardado del usuario

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [Last.fm API](https://www.last.fm/api)
