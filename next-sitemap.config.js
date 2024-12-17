module.exports = {
    siteUrl: 'https://mug-in.com' || 'http://localhost:3000',
    additionalPaths: async(config)=>{
      const recipe_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}recipe/last-recipe-id`)
      const lastRecipeId = await recipe_res.json();

      const board_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}board/last-board-id`)
      const lastBoardId = await board_res.json();

      const paths = [];
      for (let i = 1; i <= lastRecipeId; i++) {
        paths.push(await config.transform(`/recipe-detail/${i}`));
      }

      for (let i = 1; i <= lastBoardId; i++) {
        paths.push(await config.transform(`/board/1/detail/${i}`));
        paths.push(await config.transform(`/board/2/detail/${i}`));
      }
      return paths;
    },
    generateRobotsTxt: true, // robots.txt 생성
    sitemapSize: 5000, 
    changefreq: 'daily',
    priority: 0.7, 
  };