import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * Configuración por defecto de Next para un proyecto TypeScript — la misma que
 * genera create-next-app. Sin reglas propias a propósito: lo que quiero por
 * ahora es que algo revise el código antes de que llegue a desplegarse, no
 * imponer un estilo.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Salida de `npx playwright test` — bundles minificados del trace
      // viewer que no es código nuestro. Ya están en .gitignore, pero el
      // flat config de ESLint no lee .gitignore, así que sin esto
      // `npm run lint` se rompe apenas alguien corre la suite una vez.
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
