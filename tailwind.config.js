const production = process.env.NODE_ENV === 'production';

const screenExceptions = ['touch', 'pointer'];

const except = (exceptions, object) => {
	let output = {};

	Object.keys(object).forEach((key) => {
		if (!exceptions.includes(key)) {
			output[key] = object[key];
		}
	});
	return output;
};

const multipleOfFours = (until = 1200) => {
	const fours = {};
	for (let i = 4; i <= until; i += 4) {
		const value = (i / 10).toFixed(1);
		fours[i] = `${value}rem`;
	}
	return fours;
};

function withOpacityValue(variable) {
	return ({ opacityValue }) => {
		if (opacityValue === undefined) {
			return `rgb(var(${variable}))`;
		}
		return `rgb(var(${variable}) / ${opacityValue})`;
	};
}

module.exports = {
	mode: 'jit',
	plugins: [
		require('postcss-focus-visible'),
		require('@tailwindcss/aspect-ratio'),
		require('./tailwind/plugins/flex-grid.cjs')
	],
	content: {
		// Ignore src/examples folder in production
		files: [production ? 'src/!(examples)/**/*.svelte' : 'src/**/*.svelte'],
		transform: {
			svelte: (content) => {
				// Restore Tailwind's own Svelte transform
				// github.com/tailwindlabs/tailwindcss/blob/55653ba0041cf2806f236f00c59307b12f757385/src/jit/lib/expandTailwindAtRules.js#L23
				content = content.replace(/(?:^|\s)class:/g, ' ');
				return content;
			}
		}
	},
	theme: {
		screens: {
			min: '200px',
			ip: '430px',
			ph: '620px',
			xs: '760px',
			bp: '800px',
			sm: '890px',
			md: '1120px',
			lg: '1360px',
			xl: '1560px',
			max: '1600px',
			hd: '1920px',
			'2k': '2048px',
			'4k': '3840px',
			touch: { raw: '(hover: none)' },
			pointer: { raw: '(any-hover: hover)' }
		},
		colors: {
			// Essentials colors
			transparent: 'transparent',
			currentColor: 'currentColor',
			black: {
				DEFAULT: '#000000',
				100: '#000000',
				90: 'rgba(0, 0, 0, 0.9)',
				60: 'rgba(0, 0, 0, 0.6)',
				30: 'rgba(0, 0, 0, 0.3)',
				20: 'rgba(0, 0, 0, 0.2)',
				10: 'rgba(0, 0, 0, 0.1)',
				'05': 'rgba(0, 0, 0, 0.05)'
			},
			gray: {
				10: '#E8E8E8',
				20: '#E9E9E9'
			},
			white: {
				DEFAULT: '#ffffff',
				100: '#ffffff',
				90: 'rgba(255, 255, 255, 0.9)',
				60: 'rgba(255, 255, 255, 0.6)',
				30: 'rgba(255, 255, 255, 0.3)',
				20: 'rgba(255, 255, 255, 0.2)',
				10: 'rgba(255, 255, 255, 0.1)',
				'05': 'rgba(255, 255, 255, 0.05)'
			},
			blue: {
				DEFAULT: 'rgba(113, 156, 211, 1)',
				70: 'rgba(47, 73, 106, 1)',
				60: 'rgba(66, 102, 148, 1)',
				40: 'rgba(113, 156, 211, 1)',
				10: 'rgba(224, 238, 255, 1)'
			},
			green: {
				DEFAULT: 'rgba(72, 157, 121, 1)',
				70: 'rgba(48, 105, 81, 1)',
				60: 'rgba(72, 157, 121, 1)',
				40: 'rgba(130, 201, 171, 1)',
				10: 'rgba(230, 254, 244, 1)'
			},
			cassis: {
				DEFAULT: 'rgba(114, 49, 69, 1)',
				700: 'rgba(78, 34, 47, 1)',
				100: 'rgba(255, 199, 216, 1)'
			},
			orange: {
				DEFAULT: 'rgba(227, 86, 61, 1)',
				70: 'rgba(123, 44, 30, 1)',
				60: 'rgba(176, 63, 43, 1)',
				40: 'rgba(227, 86, 61, 1)',
				10: 'rgba(249, 216, 210, 1)'
			},
			asphalt: {
				DEFAULT: 'rgba(127, 124, 144, 1)',
				reverse: 'rgba(72, 70, 83, 1)',
				70: 'rgba(72, 70, 83, 1)',
				60: 'rgba(106, 103, 121, 1)',
				40: 'rgba(127, 124, 144, 1)',
				10: 'rgba(228, 227, 232, 1)'
			},
			yellow: {
				DEFAULT: 'rgba(231, 170, 60, 1)',
				70: '#FFE5B7'
			},
			marshmallow: {
				DEFAULT: 'rgba(231, 231, 232, 1)'
			},
			primary: withOpacityValue('--color-primary'),
			secondary: withOpacityValue('--color-secondary'),
			reverse: withOpacityValue('--color-reverse')
		},
		fill: (theme) => theme('colors'),
		/* PxUnit */
		spacing: (theme) => ({
			0: '0',
			...multipleOfFours(),
			'1/2': '50%',
			'1/3': 'calc(100% / 3 * 1)',
			'2/3': 'calc(100% / 3 * 2)',
			'1/4': '25%',
			'3/4': '75%',
			'1/5': '20%',
			'2/5': '40%',
			'3/10': '30%',
			'7/10': '70%',
			'9/10': '90%',
			'3/20': '15%',
			'9/20': '45%',
			'11/20': '55%',
			full: '100%',
			...except(screenExceptions, theme('screens'))
		}),
		/* SizeUnit */
		maxWidth: (theme) => ({
			none: 'none',
			auto: 'auto',
			...theme('spacing')
		}),
		/* SizeUnit */
		minWidth: (theme) => ({
			none: 'none',
			auto: 'auto',
			...theme('spacing')
		}),
		/* SizeUnit */
		maxHeight: (theme) => ({
			none: 'none',
			auto: 'auto',
			...theme('spacing')
		}),
		/* SizeUnit */
		minHeight: (theme) => ({
			none: 'none',
			auto: 'auto',
			...theme('spacing')
		}),
		/* SizeUnit */
		inset: (theme) => ({
			none: 'none',
			auto: 'auto',
			...theme('spacing')
		}),
		/* PxUnit */
		gap: (theme) => ({
			0: '0',
			...multipleOfFours()
		}),
		fontFamily: {
			base: ['Inter', 'sans-serif'],
			alt: ['Boogy', 'serif']
		},
		fontSize: {
			10: 'max(6px, 1rem)',
			20: 'max(6px, 1.2rem)',
			30: 'max(8px, 1.4rem)',
			40: 'max(8px, 1.6rem)',
			50: 'max(8px, 2rem)',
			60: 'max(10px, 2.6rem)',
			70: 'max(12px, 3.2rem)',
			80: 'max(16px, 4rem)',
			85: 'max(16px, 4.4rem)',
			90: 'max(20px, 4.8rem)',
			95: 'max(20px, 5.6rem)',
			100: 'max(24px, 6.4rem)',
			105: 'max(26px, 7.2rem)',
			110: 'max(28px, 8rem)',
			120: 'max(32px, 9.6rem)',
			130: 'max(36px, 12rem)',
			135: 'max(40px, 14rem)',
			140: 'max(48px, 16rem)'
		},
		lineHeight: {
			10: '1', // UI
			20: '1.15', // Portal title
			30: '1.25', // Short copy
			40: '1.5', // Long copy (prose)
			50: '1.65'
		},
		/* BorderUnit */
		borderWidth: {
			0: '0',
			1: '1px',
			2: 'max(1px, 0.2rem)',
			3: 'max(2px, 0.3rem)',
			4: 'max(2px, 0.4rem)',
			6: 'max(3px, 0.6rem)',
			8: 'max(4px, 0.8rem)'
		},
		borderRadius: {
			0: '0',
			5: '0.8rem',
			8: '1.2rem',
			10: '1.6rem',
			15: '2rem',
			20: '3.2rem',
			30: '4rem',
			40: '8rem',
			full: '100%'
		},
		letterSpacing: {
			10: '0.15rem'
		},
		extend: {
			boxShadow: {
				card: ['0px 8px 10px rgba(0, 0, 0, 0.1)', '0px 15px 35px rgba(0, 0, 0, 0.35)']
			},
			height: {
				screen: '100vh'
			},
			zIndex: {
				'-1': '-1'
			},
			transitionTimingFunction: {
				'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)'
			},
			lineHeight: {
				0: '0'
			},
			transitionDuration: {
				0: '0ms'
			}
		}
	}
};
