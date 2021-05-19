module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        commonjs: true,
    },
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "prettier",
        "@vue/typescript",
    ],
    rules: {
        "@typescript-eslint/indent": ["error", 4],
        "no-unused-vars": 0,
        'comma-dangle': ['error', 'always-multiline'],

    },
};
