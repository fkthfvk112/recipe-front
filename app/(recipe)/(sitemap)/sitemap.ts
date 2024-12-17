// import { MetadataRoute } from 'next';

// export async function generateSitemaps() {
//   const recipe_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipe/last-recipe-id`);
//   const lastRecipeId = await recipe_res.json(); 

//   const recipeSitemaps = [];
//   for (let i = 1; i <= lastRecipeId; i++) {
//     recipeSitemaps.push({
//       url: `${process.env.NEXT_PUBLIC_SITE_URL}/recipe-detail/${i}`,
//     });
//   }

//   return recipeSitemaps;
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const sitemapData = await generateSitemaps();
  
//   return sitemapData.map((post) => {
//     return {
//       url: post.url,
//       lastModified: new Date().toISOString(),
//       changeFrequency: "monthly", 
//       priority: 0.7,
//     };
//   });
// }