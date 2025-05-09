/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  typescript: {
    // Exclude Supabase functions from TypeScript checking
    ignoreBuildErrors: true,
  },
  eslint: {
    // Exclude Supabase functions from ESLint checking
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // Add GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader'],
    });
    
    // Exclude Supabase Edge Functions from webpack compilation
    config.module.rules.push({
      test: /supabase\/functions\/.+\.ts$/,
      use: ['ignore-loader'],
    });
    
    return config;
  },
};

export default nextConfig; 