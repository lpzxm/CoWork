import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['dist/**', 'build/**', 'node_modules/**'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.es2021,
                __TW_COLORS__: 'readonly',
                __TW_HEIGHT__: 'readonly',
                __TW_SCREENS__: 'readonly',
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'off',
            // Align with previous CRA lint leniency; avoid mass refactors.
            'no-unused-vars': 'off',
            'no-case-declarations': 'off',
            'no-constant-binary-expression': 'off',
            'no-useless-catch': 'off',
            'no-prototype-builtins': 'off',
            'react/no-find-dom-node': 'off',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },
    prettier,
]
