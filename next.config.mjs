/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // Agar aap ke paas aur bhi domains hain toh unhe bhi add karein
      // {
      //   protocol: 'https',
      //   hostname: 'another-domain.com',
      //   pathname: '/**',
      // },
    ],
  },
};

export default nextConfig;
