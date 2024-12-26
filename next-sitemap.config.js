module.exports = {
    siteUrl: 'https://mug-in.com' || 'http://localhost:3000',
    additionalPaths: async(config)=>{
      const recipe_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}recipe/last-recipe-id`)
      const lastRecipeId = await recipe_res.json();

      const board_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}board/sitemap-board-id`)
      const board_sitemap_res = await board_res.json();

      const paths = [];
      for (let i = 1; i <= lastRecipeId; i++) {
         paths.push(await config.transform(config, `/recipe-detail/${i}`));
      }

      for(let i = 0; i < board_sitemap_res.length; i++){
        paths.push(await config.transform(config, `/board/${board_sitemap_res.at(i).menuId}/detail/${board_sitemap_res.at(i).boardId}`));
      }

      return paths;
    },
    generateRobotsTxt: true, // robots.txt 생성
    sitemapSize: 5000, 
    changefreq: 'daily',
    priority: 0.7, 
  };