
/** @type {import('next').NextConfig} */

import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
             {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            }
        ],
    },
     env: {
        FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    },
};

const pwaConfig = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
