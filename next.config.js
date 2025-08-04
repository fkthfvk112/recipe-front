const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dir5rw15x/image/**",
      },
    ],
  },
  async rewrites() {
    console.log("Rewrite API to server : ", `${apiBaseUrl}seo/sitemap`);
    return [
      {
        source: "/sitemap.xml",
        destination: `${apiBaseUrl}seo/sitemap`,
      },
    ];
  },
};

module.exports = nextConfig;
