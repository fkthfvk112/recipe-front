module.exports = {
    siteUrl: 'https://mug-in.com' || 'http://localhost:3000',
    additionalPaths: async(config)=>{
      const recipe_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}recipe/last-recipe-id`)
      const lastRecipeId = await recipe_res.json();

      const board_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}board/last-board-id`)
      const lastBoardId = await board_res.json();

      console.log("레시피 아이디", lastRecipeId)
      const paths = [];
      for (let i = 1; i <= lastRecipeId; i++) {
        console.log("사이트맵 에드", `/recipe-detail/${i}`)
        paths.push(await config.transform(config, `/recipe-detail/${i}`));
      }

      for (let i = 1; i <= lastBoardId; i++) {
        paths.push(await config.transform(config, `/board/1/detail/${i}`));
        paths.push(await config.transform(config, `/board/2/detail/${i}`));
      }

      console.log("패쓰", paths);
      return paths;
    },
    generateRobotsTxt: true, // robots.txt 생성
    sitemapSize: 5000, 
    changefreq: 'daily',
    priority: 0.7, 
  };