/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
 images: {
    unoptimized: true,
    domains: ['https://backend_spmb.smktibazma.sch.id'],
  },
}

export default nextConfig
