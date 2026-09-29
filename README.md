# Portafolio personal — Juan José Vásquez Giraldo

Sitio personal de Juan José Vásquez Giraldo: desarrollador de software y atleta colombiano de salto alto (Cali, Colombia).

Funciona como carta de presentación de las dos mitades: quién soy, mi perfil como desarrollador, los proyectos que estoy construyendo, el stack, la formación, y mi trayectoria deportiva — marcas, competencias y progresión.

El sitio está estructurado como las fases de un salto de altura: aproximación (hero) → impulso (quién soy) → curva (stack) → despegue (proyectos) → vuelo (deportivo) → aterrizaje (contacto).

## Stack

- **[Next.js](https://nextjs.org) 16** (App Router) + **React 19** + **TypeScript**
- **[Motion](https://motion.dev)** para animación y **[Lenis](https://lenis.darkroom.engineering)** para scroll suave — las dos respetan `prefers-reduced-motion`
- **CSS propio** con design tokens en `:root` (`app/globals.css`). Sin librería de UI
- `next/font/local` para fuentes autoalojadas (Archivo Black, Inter) y `next/image` para las fotos
- Content Security Policy estricta con nonce por request (`proxy.ts`)

Sin backend ni base de datos: es un sitio de contenido, servido por Next.

## Correrlo en local

Necesitás Node 20 o superior.

```bash
npm install
npm run dev          # http://localhost:3000
```

Para verificar como en producción — importante, porque el modo desarrollo usa StrictMode con doble montaje y no es representativo:

```bash
npm run build
npm start
```

### Variables de entorno

| Variable | Para qué | Obligatoria |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL pública: metadataBase, canonical, hreflang, sitemap, robots y JSON-LD (ver `.env.example`) | No — en Vercel cae al dominio de producción del proyecto; en local, a `http://localhost:3000` |

## Estructura

```
app/
  layout.tsx        shell raíz: metadata, fuentes, SmoothScroll
  page.tsx          arma la home
  globals.css       design tokens (:root) + estilos del sitio
  fonts.ts, fonts/  next/font/local
components/         una sección = un componente, más Reveal, Nav y BackToTop
content/            datos del sitio (recién empezando: hoy solo profile.ts)
hooks/              useActiveSection (scrollspy), useBelowFold
lib/motion.ts       variants, easing y timings compartidos de Motion
proxy.ts            CSP con nonce por request
public/images/      las fotos
```

## Estado

En reconstrucción. El sitio funciona y está completo como contenido, pero no está desplegado todavía.

El trabajo va por tareas numeradas, una por commit, siguiendo una auditoría y un plan de ejecución que llevo aparte del repo (son mis notas de trabajo, no documentación del producto).

Lo que sigue pendiente, en orden: decidir la CSP frente al render estático, mover el contenido a una capa de datos tipada y bilingüe, y reorganizar las 12 secciones actuales en las 8 de la narrativa nueva.

El historial de commits cuenta el resto.
