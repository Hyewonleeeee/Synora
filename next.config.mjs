/** @type {import('next').NextConfig} */
const isPages = process.env.GITHUB_PAGES === 'true';
const repoName = 'Synora';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  output: 'export',
  basePath: isPages ? `/${repoName}` : undefined,
  assetPrefix: isPages ? `/${repoName}/` : undefined,
};

export default nextConfig;


