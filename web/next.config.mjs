import path from 'path';
import { fileURLToPath } from 'url';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(configDir, '..');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  outputFileTracingRoot: repoRoot,
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;

// 启用 Cloudflare 绑定在本地开发时可访问
initOpenNextCloudflareForDev();
