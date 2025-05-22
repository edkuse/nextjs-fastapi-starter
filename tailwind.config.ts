import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        primary: {
          '100': '#9bffff',
          '200': '#7fe9ff',
          '300': '#61d0ff',
          '400': '#3fb7f5',
          '500': '#009fdb',
          '600': '#0087c2',
          '700': '#0071a9',
          '800': '#005b91',
          '900': '#00467a',
          'DEFAULT': '#009fdb',
          'foreground': '#FFFFFF'
        },
          secondary: {
            '100': '#e9eef7',
            '200': '#d0d5de',
            '300': '#b7bcc4',
            '400': '#9fa4ac',
            '500': '#878c94',
            '600': '#70757d',
            '700': '#5a5f66',
            '800': '#454a51',
            '900': '#31353c',
            'DEFAULT': '#878c94',
            'foreground': '#FFFFFF'
        },
          success: {
            '100': '#91e07f',
            '200': '#78c768',
            '300': '#60ae51',
            '400': '#47963a',
            '500': '#2d7e24',
            '600': '#0b670b',
            '700': '#005100',
            '800': '#003b00',
            '900': '#002800',
            'DEFAULT': '#2d7e24',
            'foreground': '#FFFFFF'
        },
          warning: {
            '100': '#ffd48c',
            '200': '#ffba74',
            '300': '#ffa15d',
            '400': '#ff8946',
            '500': '#ea712f',
            '600': '#ce5917',
            '700': '#b14200',
            '800': '#962b00',
            '900': '#7c0f00',
            'DEFAULT': '#ea712f',
            'foreground': '#FFFFFF'
        },
          danger: {
            '100': '#ff8488',
            '200': '#ff6a71',
            '300': '#ff4f5b',
            '400': '#e43146',
            '500': '#c70032',
            '600': '#aa001f',
            '700': '#8e000d',
            '800': '#730000',
            '900': '#5a0000',
            'DEFAULT': '#c70032',
            'foreground': '#FFFFFF'
        },
          dark: {
            '100': '#7a8692',
            '200': '#636f7b',
            '300': '#4e5964',
            '400': '#39444f',
            '500': '#25303a',
            '600': '#121d27',
            '700': '#000714',
            '800': '#000000',
            '900': '#000000',
            'DEFAULT': '#25303a',
            'foreground': '#FFFFFF'
        },
          info: {
            '100': '#c0ffff',
            '200': '#a4ffff',
            '300': '#88ffff',
            '400': '#6afff6',
            '500': '#49eedc',
            '600': '#1bd4c3',
            '700': '#00bbaa',
            '800': '#00a293',
            '900': '#008a7b',
            'DEFAULT': '#49eedc',
            'foreground': '#FFFFFF'
        },
          gray: {
            '100': '#e9eef7',
            '200': '#d0d5de',
            '300': '#b7bcc4',
            '400': '#9fa4ac',
            '500': '#878c94',
            '600': '#70757d',
            '700': '#5a5f66',
            '800': '#454a51',
            '900': '#31353c',
            'DEFAULT': '#878c94',
            'foreground': '#FFFFFF'
        },
          red: {
            '100': '#ff8488',
            '200': '#ff6a71',
            '300': '#ff4f5b',
            '400': '#e43146',
            '500': '#c70032',
            '600': '#aa001f',
            '700': '#8e000d',
            '800': '#730000',
            '900': '#5a0000',
            'DEFAULT': '#c70032',
            'foreground': '#FFFFFF'
        },
          orange: {
            '100': '#ffd48c',
            '200': '#ffba74',
            '300': '#ffa15d',
            '400': '#ff8946',
            '500': '#ea712f',
            '600': '#ce5917',
            '700': '#b14200',
            '800': '#962b00',
            '900': '#7c0f00',
            'DEFAULT': '#ea712f',
            'foreground': '#FFFFFF'
        },
          lime: {
            '100': '#fdff86',
            '200': '#e1ff6b',
            '300': '#c6ff50',
            '400': '#acf632',
            '500': '#91dc00',
            '600': '#76c300',
            '700': '#5caa00',
            '800': '#409200',
            '900': '#227a00',
            'DEFAULT': '#91dc00',
            'foreground': '#FFFFFF'
        },
          green: {
            '100': '#91e07f',
            '200': '#78c768',
            '300': '#60ae51',
            '400': '#47963a',
            '500': '#2d7e24',
            '600': '#0b670b',
            '700': '#005100',
            '800': '#003b00',
            '900': '#002800',
            'DEFAULT': '#2d7e24',
            'foreground': '#FFFFFF'
        },
          blue: {
            '100': '#9bffff',
            '200': '#7fe9ff',
            '300': '#61d0ff',
            '400': '#3fb7f5',
            '500': '#009fdb',
            '600': '#0087c2',
            '700': '#0071a9',
            '800': '#005b91',
            '900': '#00467a',
            'DEFAULT': '#009fdb',
            'foreground': '#FFFFFF'
        },
          cobalt: {
            '100': '#818ef3',
            '200': '#6778d9',
            '300': '#4c61c0',
            '400': '#2f4ca7',
            '500': '#00388f',
            '600': '#002577',
            '700': '#001461',
            '800': '#00004b',
            '900': '#000037',
            'DEFAULT': '#00388f',
            'foreground': '#FFFFFF'
        },
          mint: {
            '100': '#c0ffff',
            '200': '#a4ffff',
            '300': '#88ffff',
            '400': '#6afff6',
            '500': '#49eedc',
            '600': '#1bd4c3',
            '700': '#00bbaa',
            '800': '#00a293',
            '900': '#008a7b',
            'DEFAULT': '#49eedc',
            'foreground': '#FFFFFF'
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['var(--font-custom)', 'ui-sans-serif', 'system-ui']
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config 