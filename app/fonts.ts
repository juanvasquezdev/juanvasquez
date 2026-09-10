import localFont from "next/font/local";

export const archivoBlack = localFont({
  src: "./fonts/archivo-black-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display",
  fallback: ["Segoe UI", "sans-serif"],
});

export const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "400 800",
  style: "normal",
  display: "swap",
  variable: "--font-body",
  fallback: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
});
