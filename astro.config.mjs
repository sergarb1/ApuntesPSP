import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const emojis = ['🚀','🔤','🔀','🧩','⚡','🏗️','🔒','🧬','📚','🗺️','📁','🗄️'];

const unitSlugs = [
  '01-procesos-y-subprocess',
  '02-hilos-fundamentos',
  '03-sincronizacion-entre-hilos',
  '04-sockets-tcp',
  '05-sockets-udp-y-protocolos',
  '06-apis-rest-y-http',
  '07-apis-comerciales',
  '08-hash-y-cifrado-clasico',
  '09-cifrado-moderno',
  '10-servidores-concurrentes',
  '11-asyncio-y-disponibilidad',
];

const unitLabels = [
  'Procesos y Subprocess',
  'Hilos Fundamentos',
  'Sincronización entre Hilos',
  'Sockets TCP',
  'Sockets UDP y Protocolos',
  'APIs REST y HTTP',
  'APIs Comerciales',
  'Hash y Cifrado Clásico',
  'Cifrado Moderno',
  'Servidores Concurrentes',
  'Asyncio y Disponibilidad',
  'Proyecto Memory',
];

export default defineConfig({
  site: 'https://sergarb1.github.io/ApuntesPSP',
  base: '/ApuntesPSP',
  integrations: [
    starlight({
      title: 'Apuntes PSP',
      description: 'Programación de Servicios y Procesos — Python. CC BY-SA 4.0 — Sergi Garcia Barea',
      customCss: [
        './src/styles/custom.css',
        '@fontsource/geist-sans',
      ],
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      defaultLocale: 'root',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/sergarb1/ApuntesPSP' },
      ],
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#306998' } },
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href: '/ApuntesPSP/favicon.svg' } },
      ],
      sidebar: [
        {
          slug: 'index',
          label: 'Inicio',
        },
        {
          label: '📚 Unidades',
          items: unitSlugs.map((slug, i) => ({
            slug,
            label: `${emojis[i]} ${i+1}. ${unitLabels[i]}`,
          })),
        },
        {
          label: '📝 Ejercicios',
          items: unitSlugs.map((slug, i) => {
            const n = i + 1;
            const nn = String(n).padStart(2, '0');
            return {
              label: `${emojis[i]} Unidad ${nn}`,
              items: [
                { slug: `inicial-resuelto-${slug}`, label: '✅ Inicial resuelto' },
                { slug: `inicial-${slug}`, label: '🟢 Inicial por resolver' },
                { slug: `intermedio-resuelto-${slug}`, label: '💪 Intermedio resuelto' },
                { slug: `intermedio-${slug}`, label: '📝 Intermedio por resolver' },
                { slug: `extra-${slug}`, label: '⭐ Avanzado' },
              ],
            };
          }),
        },
      ],
    }),
  ],
});
