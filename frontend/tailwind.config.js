const flattenColorPalette =
    require('tailwindcss/lib/util/flattenColorPalette').default
const safeListFile = 'safelist.txt'
module.exports = {
    mode: 'jit',
    content: [
        './src/**/*.html',
        './src/**/*.js',
        './src/**/*.jsx',
        './src/**/*.ts',
        './src/**/*.tsx',
        './safelist.txt',
    ],
    safelist: [

        'bg-[var(--c-primary)]',
        'bg-[var(--c-success)]',
        'bg-[var(--c-warning)]',
        'bg-[var(--c-danger)]',
        'bg-[var(--c-info)]',
        'bg-[var(--c-secondary)]',
        'bg-[var(--c-surface-dark)]',

        'border-[var(--c-primary)]',
        'border-[var(--c-success)]',
        'border-[var(--c-warning)]',
        'border-[var(--c-danger)]',
        'border-[var(--c-info)]',
        'border-[var(--c-secondary)]',
        'border-[var(--c-surface-dark)]',

        'text-[var(--c-primary)]',
        'text-[var(--c-success)]',
        'text-[var(--c-warning)]',
        'text-[var(--c-danger)]',
        'text-[var(--c-info)]',
        'text-[var(--c-secondary)]',
        'text-[var(--c-surface-dark)]',

        'hover:bg-[var(--c-primary)]',
        'hover:bg-[var(--c-success)]',
        'hover:bg-[var(--c-warning)]',
        'hover:bg-[var(--c-danger)]',
        'hover:bg-[var(--c-info)]',
        'hover:bg-[var(--c-secondary)]',
        'hover:bg-[var(--c-surface-dark)]',

    ],
    darkMode: 'class',
    theme: {
        letterSpacing: {
            tightest: '-.075em',
            tighter: '-.05em',
            tight: '-.025em',
            normal: '0',
            wide: '.05em',
            wider: '.1em',
            widest: '.5em',
        },
        fontFamily: {
            sans: [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                '"Noto Sans"',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"',
            ],
            serif: [
                'ui-serif',
                'Georgia',
                'Cambria',
                '"Times New Roman"',
                'Times',
                'serif',
            ],
            mono: [
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                '"Liberation Mono"',
                '"Courier New"',
                'monospace',
            ],
        },
        screens: {
            xs: '360px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.500'),
                        maxWidth: '65ch',
                    },
                },
                invert: {
                    css: {
                        color: theme('colors.gray.400'),
                    },
                },
            }),
            colors: {
                buke: {
                  50: '#f0f9ff',
                  100: '#e0f2fe',
                  200: '#bae6fd',
                  300: '#7dd3fc',
                  400: '#38bdf8',
                  500: '#0ea5e9',
                  600: '#019de1',
                  700: '#0369a1',
                  800: '#075985',
                  900: '#0c4a6e',
                  950: '#082f49'
                },
              }
        }
    },
    plugins: [
        ({ addUtilities, e, theme, variants }) => {
            const colors = flattenColorPalette(theme('borderColor'))
            delete colors['default']

            const colorMap = Object.keys(colors).map((color) => ({
                [`.border-t-${color}`]: { borderTopColor: colors[color] },
                [`.border-r-${color}`]: { borderRightColor: colors[color] },
                [`.border-b-${color}`]: { borderBottomColor: colors[color] },
                [`.border-l-${color}`]: { borderLeftColor: colors[color] },
            }))
            const utilities = Object.assign({}, ...colorMap)

            addUtilities(utilities, variants('borderColor'))
        },
        // If your application does not require multiple theme selection,
        // you can replace {color} to your theme color value
        // this can drastically reduces the size of the output css file
        // e.g 'text-{colors}' --> 'text-emerald'
        require('tailwind-safelist-generator')({
            path: safeListFile,
            patterns: [
                'text-{colors}',
                'bg-{colors}',
                'badge-{colors}',
                'dark:bg-{colors}',
                'dark:hover:bg-{colors}',
                'dark:active:bg-{colors}',
                'hover:text-{colors}',
                'hover:bg-{colors}',
                'active:bg-{colors}',
                'ring-{colors}',
                'hover:ring-{colors}',
                'focus:ring-{colors}',
                'focus-within:ring-{colors}',
                'border-{colors}',
                'focus:border-{colors}',
                'focus-within:border-{colors}',
                'dark:text-{colors}',
                'dark:hover:text-{colors}',
                'h-{height}',
                'w-{width}',
            ],
        }),
        require('@tailwindcss/typography'),
    ],
}
