module.exports = {
    plugins: [
        '@babel/plugin-proposal-class-properties'
    ],
    presets: [
        '@babel/typescript',
        ['@babel/env', {
            targets: {
                esmodules: true,
            },
        },],
        '@babel/react',
    ],
};
