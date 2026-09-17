/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Required for GitHub Pages (Static Site Generation)
  images: {
    unoptimized: true, // Required for static export
  },
  // If you are NOT using a custom domain (like benignlabs.com), 
  // uncomment the next line so assets load correctly on ShakyaPankaj1995.github.io/Benign-Lab-Website
  // basePath: "/Benign-Lab-Website",
};

export default nextConfig;
