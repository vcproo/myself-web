import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FCFBF8',
          100: '#FAF7F2',
          200: '#F3EDE3',
          300: '#E7DEC9',
          400: '#D5C7AE',
        },
        ink: {
          900: '#221E1C',
          800: '#352F2C',
          600: '#645B55',
          400: '#968B82',
          300: '#B8AEA4',
        },
        terracotta: {
          50: '#FDF3EE',
          100: '#FBE3D7',
          200: '#F5C4AE',
          500: '#D95D39',
          600: '#C04B29',
          700: '#9E3B1E',
        },
        sage: {
          50: '#F2F7F3',
          100: '#E1ECE3',
          200: '#C5DBC9',
          600: '#467352',
          700: '#365A40',
        },
        ochre: {
          50: '#FBF7EC',
          100: '#F5EBD0',
          500: '#C88A2E',
          600: '#A9701E',
        },
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Noto Sans SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        serif: [
          '"Newsreader"',
          '"Noto Serif SC"',
          '"Songti SC"',
          'Georgia',
          'serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SFMono-Regular"',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        paper: '0 1px 2px rgba(34, 30, 28, 0.04), 0 8px 24px -8px rgba(34, 30, 28, 0.06)',
        'paper-hover': '0 4px 12px rgba(34, 30, 28, 0.06), 0 20px 36px -12px rgba(217, 93, 57, 0.12)',
        tactile: '0 2px 0 0 #E5DCCF, 0 4px 12px rgba(34, 30, 28, 0.05)',
      },
    },
  },
  plugins: [typography],
};
