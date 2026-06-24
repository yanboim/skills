import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};

export default nextConfig;

// Enable Cloudflare bindings for local development where workerd is supported.
if (process.env.NODE_ENV === 'development' && process.platform !== 'win32') {
  initOpenNextCloudflareForDev();
}
