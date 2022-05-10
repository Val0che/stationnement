module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				purple: {
					DEFAULT: '#5B3E96',
					light: '#221738',
					dark: '#140A26'
				}
			},
			fontFamily: {
				base: ['Inter', 'sans-serif']
			}
		}
	},
	plugins: []
};
