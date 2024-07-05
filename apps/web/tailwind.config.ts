import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
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
				border: 'rgb(var(--border) / <alpha-value>)',
				input: 'rgb(var(--input) / <alpha-value>)',
				ring: 'rgb(var(--ring) / <alpha-value>)',
				background: {
					DEFAULT: 'rgb(var(--background) / <alpha-value>)',
					secondary: 'rgb(var(--background-secondary) / <alpha-value>)',
					tertiary: 'rgb(var(--background-tertiary) / <alpha-value>)'
				},
				foreground: {
					DEFAULT: 'rgb(var(--foreground) / <alpha-value>)',
					muted: 'rgb(var(--foreground-muted) / <alpha-value>)',
					'muted-more': 'rgb(var(--foreground-muted-more) / <alpha-value>)'
				},
				primary: {
					DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
				},
				shadow: 'rgb(var(--shadow) / <alpha-value>)',
				success: 'rgb(var(--success) / <alpha-value>)',
				fail: 'rgb(var(--fail) / <alpha-value>)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [...fontFamily.sans]
			},
			minHeight: {
				'screen-small': 'var(--viewport-small-height)'
			},
			spacing: {
				'0.75px': '0.75px',
				0.25: '0.0625rem',
				'2px': '2px',
				'1.5px': '1.5px',
				0.75: '0.1875rem',
				1.25: '0.3125rem',
				1.75: '0.4375rem'
			}
		}
	}
};

export default config;
