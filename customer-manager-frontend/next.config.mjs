import withLess from 'next-plugin-antd-less';

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
};

export default withLess({
    ...nextConfig,


    webpack(config) {
        return config;
    },
});