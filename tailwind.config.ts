import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				background: {
					DEFAULT: 'rgb(var(--background))',
					secondary: 'rgb(var(--background-secondary))'
				},
				foreground: {
					DEFAULT: 'rgb(var(--foreground))',
					faded: 'rgb(var(--foreground-faded))',
					'faded-more': 'rgb(var(--foreground-faded-more))'
				},
				success: 'rgb(var(--success))',
				fail: 'rgb(var(--fail))'
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
	},

	plugins: []
} as Config;
