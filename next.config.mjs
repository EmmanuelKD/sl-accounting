/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    },
    async redirects() {
        return [
            {
                source: "/",
                destination: "/dash",
                permanent: false,
            },
        ];
    },
    reactStrictMode: true,
    swcMinify: true,
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false };

        return config;
    },
    swcMinify: false,
    modularizeImports: {
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}'
        }
    },
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**'
            }
        ]
    },
    compiler: {
        styledComponents: true,
    }
};

export default nextConfig;
