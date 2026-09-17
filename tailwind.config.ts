import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void': 'rgb(var(--void) / <alpha-value>)',
        'bg': 'var(--bg)',
        'bg-alt': 'var(--bg-alt)',
        'ink': 'var(--ink)',
        'muted': 'var(--muted)',
        'line': 'var(--line)',
        'teal': 'var(--teal)',
        'teal-ink': 'var(--teal-ink)',
        'teal-soft': 'var(--teal-soft)',
        'red': 'var(--red)',
      },
    },
  },
  plugins: [],
}
export default config
