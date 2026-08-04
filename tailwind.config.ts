import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'var(--ide-border)',
  			input: 'var(--ide-border)',
  			ring: 'var(--primary)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			primary: {
  				DEFAULT: 'var(--primary)',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: 'var(--ide-surface)',
  				foreground: 'var(--foreground)'
  			},
  			destructive: {
  				DEFAULT: 'var(--error)',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: 'var(--ide-surface)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--ide-panel)',
  				foreground: '#ffffff'
  			},
  			popover: {
  				DEFAULT: 'var(--ide-surface)',
  				foreground: 'var(--foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--ide-surface)',
  				foreground: 'var(--foreground)'
  			},
  			surface: 'var(--ide-surface)',
  			panel: 'var(--ide-panel)',
  			profileCard: 'var(--ide-profile-card-bg)',
  			sidebar: {
				DEFAULT: 'var(--ide-surface)',
				foreground: 'var(--muted-foreground)',
				primary: 'var(--primary)',
				'primary-foreground': '#ffffff',
				accent: 'var(--ide-panel)',
				'accent-foreground': '#ffffff',
				border: 'var(--ide-border)',
				ring: 'var(--primary)'
			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'ui-sans-serif',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-mono)',
  				'monospace'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
