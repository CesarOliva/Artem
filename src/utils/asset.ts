/**
 * Resuelve la URL de un asset de `public/` respetando el `base`
 * de Vite ("/" en dev, "/Artem/" en GitHub Pages).
 *
 * Uso: asset("Images/Destacada.webp")
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
