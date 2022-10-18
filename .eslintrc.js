module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
        'plugin:prettier/recommended',
        'prettier',
        'eslint-config-prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'unicorn/prefer-node-protocol': 'off',
        'unicorn/prevent-abbreviations': [
            'error',
            {
                ignore: ['\\.e2e-spec$', /^ignore/i],
            },
        ],
        'unicorn/prefer-module': 'off',

        'unicorn/no-null': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'unicorn/no-process-exit': 'off',
    },
};
