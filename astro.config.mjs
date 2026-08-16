import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const emojis = ['🚀', '🔀', '🔒', '🔌', '📡', '🌐', '🧪', '🔐', '🧬', '🏗️', '⏱️'];

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
];

// Unidades ampliadas al estándar "libro" (índice + 9 puntos). Se activan por lote.
const unidadesExpandidas = {
  '01-procesos-y-subprocess': true,
  '02-hilos-fundamentos': true,
  '03-sincronizacion-entre-hilos': true,
  '04-sockets-tcp': true,
  '05-sockets-udp-y-protocolos': true,
  '06-apis-rest-y-http': true,
  '07-apis-comerciales': true,
  '08-hash-y-cifrado-clasico': true,
  '09-cifrado-moderno': true,
  '10-servidores-concurrentes': true,
  '11-asyncio-y-disponibilidad': true,
};

// Unidades con boletines publicados en src/content/docs/boletines/
const boletinesReady = [
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

// Nombres de los 9 puntos de teoría de cada unidad ampliada (nn-archivo)
const unitPuntos = {
  '01-procesos-y-subprocess': ['01-que-es-un-proceso', '02-estados-de-un-proceso', '03-paralela-vs-distribuida', '04-subprocess-run', '05-subprocess-popen', '06-comunicacion-con-procesos', '07-compatibilidad-windows-linux', '08-procesos-en-la-practica', '09-cierre'],
  '02-hilos-fundamentos': ['01-de-proceso-a-hilo', '02-primer-hilo', '03-hilos-con-argumentos', '04-hilos-daemon', '05-timer', '06-gil', '07-estados-del-hilo', '08-hilos-en-la-practica', '09-cierre'],
  '03-sincronizacion-entre-hilos': ['01-condicion-de-carrera', '02-lock', '03-rlock', '04-semaphore', '05-barrier', '06-condition', '07-productor-consumidor', '08-buenas-practicas', '09-cierre'],
  '04-sockets-tcp': ['01-que-es-un-socket', '02-cliente-tcp', '03-servidor-tcp', '04-ciclo-de-vida-de-la-conexion', '05-errores-y-manejo', '06-so-reuseaddr', '07-protocolos-sobre-tcp', '08-servidor-eco-completo', '09-cierre'],
  '05-sockets-udp-y-protocolos': ['01-tcp-vs-udp', '02-cliente-udp', '03-servidor-udp', '04-datagramas-y-perdida', '05-http-desde-cero', '06-ntp-y-servidores-de-tiempo', '07-cuando-usar-cada-protocolo', '08-practica-eco-udp', '09-cierre'],
  '06-apis-rest-y-http': ['01-web-y-http', '02-metodos-http', '03-principios-rest', '04-codigos-de-estado', '05-json', '06-requests-get', '07-requests-post', '08-practica-api', '09-cierre'],
  '07-apis-comerciales': ['01-api-keys', '02-variables-de-entorno', '03-openweathermap', '04-openai', '05-rate-limiting', '06-errores-http', '07-seguridad-y-buenas-practicas', '08-practica-apis-comerciales', '09-cierre'],
  '08-hash-y-cifrado-clasico': ['01-principios-de-seguridad', '02-que-es-un-hash', '03-md5-sha1-sha256', '04-hash-de-contrasenas', '05-hash-con-sal', '06-cifrado-cesar', '07-hash-vs-cifrado', '08-buenas-practicas-y-verificacion', '09-cierre'],
  '09-cifrado-moderno': ['01-cifrado-simetrico-vs-asimetrico', '02-aes', '03-modos-aes', '04-rsa', '05-firmas-digitales', '06-cifrado-hibrido', '07-rbac-y-roles', '08-practica-sistema-seguro', '09-cierre'],
  '10-servidores-concurrentes': ['01-servidor-secuencial', '02-el-problema-de-la-espera', '03-hilo-por-cliente', '04-threadpoolexecutor', '05-benchmark', '06-sincronizacion-en-servidores', '07-limites-y-buenas-practicas', '08-servidor-concurrente-completo', '09-cierre'],
  '11-asyncio-y-disponibilidad': ['01-event-loop', '02-corrutinas', '03-create-task-y-gather', '04-timeouts', '05-heartbeat', '06-backoff', '07-threads-vs-asyncio', '08-disponibilidad-y-practica', '09-cierre'],
};

const titleCase = (s) => s.split(' ').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');

// Items del grupo de una unidad ampliada: índice + 9 puntos
const expandedUnitItems = (slug) => {
  const files = unitPuntos[slug];
  return [
    { slug, label: 'Índice' },
    ...files.map((file) => {
      const num = file.slice(0, 2);
      const label = file === '09-cierre'
        ? '09 · Cierre'
        : `${num} · ${titleCase(file.slice(3).replace(/-/g, ' '))}`;
      return { slug: `${slug}/${file}`, label };
    }),
  ];
};

// Grupo de boletines de una unidad (4 ficheros)
const boletinItems = (index) => {
  const nn = String(index + 1).padStart(2, '0');
  return [
    { link: `/boletines/boletin-u${nn}-inicial-resuelto`, label: '✅ Inicial resuelto' },
    { link: `/boletines/boletin-u${nn}-inicial`, label: '🟢 Inicial por resolver' },
    { link: `/boletines/boletin-u${nn}-avanzado-resuelto`, label: '💪 Avanzado resuelto' },
    { link: `/boletines/boletin-u${nn}-avanzado`, label: '📝 Avanzado por resolver' },
  ];
};

const unitsSidebar = unitSlugs.map((slug, i) => {
  const label = `${emojis[i]} ${i + 1}. ${unitLabels[i]}`;
  if (unidadesExpandidas[slug]) {
    return { label, collapsed: true, items: expandedUnitItems(slug) };
  }
  return { slug, label };
});

const boletinesSidebar = boletinesReady.length > 0
  ? [
      {
        label: '📝 Boletines',
        items: boletinesReady.map((slug, i) => ({
          label: `${emojis[i]} Unidad ${i + 1}`,
          collapsed: true,
          items: boletinItems(i),
        })),
      },
    ]
  : [];

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
          items: unitsSidebar,
        },
        ...boletinesSidebar,
      ],
    }),
  ],
});