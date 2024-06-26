/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
        '@vue/airbnb',
        'prettier',
    ],
    env: {
        'vue/setup-compiler-macros': true,
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-shadow': ['error'],
        'no-template-curly-in-string': 0,
        'import/no-unresolved': 0,
        'import/extensions': 0,
        'no-shadow': 'off',
        'vuejs-accessibility/click-events-have-key-events': 0,
        'import/prefer-default-export': 0,
        'vue/multi-word-component-names': 0,
        'vue/no-v-html': 0,
        'import/no-extraneous-dependencies': 0,
        'no-console': 0,
        'no-param-reassign': 0,
        'no-useless-catch': 0,
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto',
            },
        ],
        'consistent-return': 0,
        'no-use-before-define': 0,
        'arrow-body-style': 0,
        eqeqeq: 0,
        'vuejs-accessibility/form-control-has-label': 0,
        'no-unused-expressions': 0,
        'no-empty-function': 0,
        'vue/require-default-prop': 0,
        'prefer-destructuring': 0,
        'no-plusplus': 0,
        'no-await-in-loop': 0,
        'no-empty': 0,
        'default-param-last': 0,
    },
};
