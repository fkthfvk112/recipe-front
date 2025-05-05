module.exports = {
  siteUrl: process.env.NODE_ENV === 'production' ? 'https://mug-in.com' : 'http://localhost:3000',
  additionalPaths: async (config) => {
    // 레시피 ID 리스트 가져오기
    const recipe_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}recipe/recipe-id-list`);
    const recipeIdList = await recipe_res.json();

    // 보드 사이트맵 ID 리스트 가져오기
    const board_res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}board/sitemap-board-id`);
    const board_sitemap_res = await board_res.json();

    const paths = [];

    // 레시피 경로 추가
    for (let i = 0; i < recipeIdList.length; i++) {
      paths.push(await config.transform(config, `/recipe-detail/${recipeIdList[i]}`));
    }

    // 보드 경로 추가
    for (let i = 0; i < board_sitemap_res.length; i++) {
      paths.push(await config.transform(config, `/board/${board_sitemap_res[i].menuId}/detail/${board_sitemap_res[i].boardId}`));
    }

    console.log("사이트맵 확인 ", paths);
    return paths;
  },
  generateRobotsTxt: true, // robots.txt 생성
  sitemapSize: 5000, 
  changefreq: 'daily',
  priority: 0.7, 
  exclude: ['/admin/**'],
};
