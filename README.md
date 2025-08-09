# Kingsman Barber

Sitio web responsive para barbería con agenda, pagos y tienda.

## Requisitos
- Node.js 20+
- pnpm
- Firebase CLI (`pnpm dlx firebase-tools@latest`)

## Instalación
```bash
pnpm install
```

## Desarrollo
Levanta la aplicación web y los emuladores de Firebase:
```bash
pnpm dev        # Vite en apps/web
pnpm emulate    # Firebase emulators
```

## Variables de entorno
Crear un archivo `.env` en `apps/web` con:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_WOMPI_PUBLIC_KEY=
VITE_PAYMENTS_SANDBOX=true
```

## Estructura
- `apps/web` – frontend React + Vite
- `functions` – Cloud Functions (TypeScript)

## Licencia
MIT
