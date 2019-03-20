module.exports = {
    extends: 'airbnb-base',
    rules: {
        semi: [0, 'always'],
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
        'object-shorthand': ['error', 'always'],
        'func-names': ['error', 'never'],
        indent: ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': [0, 'error', 'windows'],
        camelcase: 0,
        'no-param-reassign': 0,
        'no-bitwise': ['error', { allow: ['~', '>>'] }]
    },
    globals: {
        wx: true,
        App: true,
        Page: true,
        getApp: true,
        console: true,
        Component: true,
        getCurrentPages: true
    }
}
