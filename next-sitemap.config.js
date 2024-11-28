module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    generateRobotsTxt: true, // robots.txt 생성
    sitemapSize: 5000, 
    changefreq: 'daily',
    priority: 0.7, 
  };