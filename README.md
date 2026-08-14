# Artem

Artem es una aplicación web para explorar obras de arte de la colección del Museo Metropolitano de Arte de Nueva York. Permite buscar, filtrar y guardar obras favoritas con una interfaz moderna inspirada en galerías y museos.

## Características

- Búsqueda de obras por texto
- Filtros por categoría, artista, dominio público y rango de fechas
- Ordenamiento por relevancia, más antiguas o más recientes
- Paginación
- Sección de favoritos persistente en localStorage
- Landing page con obras destacadas
- Diseño responsivo y visual minimalista

## Stack tecnológico

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Sonner

## API utilizada

La aplicación consume la API pública del The Metropolitan Museum of Art:

- https://collectionapi.metmuseum.org/public/collection/v1

## Requisitos previos

- Node.js 18+
- npm o pnpm

## Instalación

```bash
npm install
```

## Scripts disponibles

```bash
npm run dev
```
Ejecuta la aplicación en modo desarrollo.

```bash
npm run build
```
Genera una build de producción.

```bash
npm run preview
```
Previsualiza la versión compilada.

```bash
npm run lint
```
Ejecuta ESLint para validar código.

## Estructura del proyecto

```text
artem/
├── public/
│   └── Images/
├── services/
│   ├── artApi.ts
│   └── favorites.ts
├── src/
│   ├── components/
│   ├── pages/
│   ├── AppRouter.tsx
│   ├── index.css
│   ├── main.tsx
│   └── ...
├── types/
│   ├── artwork.ts
│   └── card.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── README.md
```

## Cómo funciona

1. La app carga obras desde la API pública del museo.
2. El usuario puede buscar por texto o filtrar por varios criterios.
3. Las obras favoritas se almacenan localmente en el navegador.
4. Las rutas principales están definidas con React Router:
   - `/` → Home
   - `/artwork` → Explorar obras
   - `/artwork/:id` → Detalle de una obra
   - `/favoritos` → Obra favoritas
   - `/acerca-de` → Información del proyecto

## Variables de entorno

Actualmente el proyecto no requiere variables de entorno para funcionar en desarrollo. Si en el futuro se integra una API privada o una base de datos, se recomienda almacenar la configuración en un archivo `.env.local`.

## Contribución

1. Haz un fork del proyecto
2. Crea una rama para tu cambio
3. Realiza tus modificaciones
4. Ejecuta lint y build antes de abrir un PR
5. Envía tu pull request con una descripción clara

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Si no se indica lo contrario, puedes usarlo con fines educativos o personales.

## Autor

Proyecto personal desarrollado con React y la API del Museo Metropolitano de Arte.

