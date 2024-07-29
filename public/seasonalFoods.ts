interface seasonalIngre {
  [key: string]: ingredientsAndMonth;
}

interface ingredientsAndMonth {
  [key: string]: number[];
}

export const seasonalIngredients: seasonalIngre = {
  fish: {
    도다리: [3, 4, 5],
    볼락: [3, 4],
    홍어: [11, 12, 1, 2, 3, 4],
    멸치: [11, 12, 1, 2, 3],
    돌돔: [10, 11, 12, 1, 2, 3],
    도미: [11, 12, 1, 2, 3],
    복어: [11, 12, 1, 2, 3],
    농어: [6, 8],
    놀래미: [6, 7, 8],
    쏘가리: [5, 6],
    장어: [5, 6],
    병어: [5, 6, 7, 8],
    참다랑어: [4, 5, 6],
    참돔: [4, 5, 6, 7, 8],
    붕어: [4, 5, 6, 7],
    메로: [5, 6],
    갈치: [7, 8, 9, 10],
    가자미: [10, 11, 12],
    꽁치: [10, 11],
    송어: [10, 11],
    삼치: [10, 11, 12, 1, 2],
    전어: [10, 11],
    고등어: [9, 10, 11],
    광어: [9, 10, 11, 12],
    미꾸라지: [9, 10, 11],
    연어: [9, 10],
    빙어: [11, 12, 1, 2],
    아귀: [12, 1, 2],
    굴: [9, 10, 11, 12],
  },
  seafood: {
    쭈꾸미: [3, 4, 5],
    바지락: [2, 3, 4],
    소라: [3, 4, 5, 6, 7],
    톳: [3, 4, 5],
    문어: [11, 12, 1, 2, 3, 4],
    꼬막: [11, 12, 1, 2, 3],
    피조개: [12, 1, 2, 3],
    한치: [6, 7, 8],
    다슬기: [5, 6],
    다시마: [5, 6, 7],
    재첩: [5, 6],
    암꽃게: [4, 5, 6],
    성게: [3, 4, 5, 6, 7, 8],
    오징어: [7, 8, 9, 10, 11],
    낙지: [9, 10, 11, 12, 1, 2],
    대하: [9, 10, 11, 12],
    전복: [8, 9, 10],
    보리새우: [9, 10, 11, 12],
    새우: [9, 10, 11, 12],
    과메기: [11, 12, 1],
    가리비: [11, 12],
    개불: [1, 2],
  },
  vefetable: {
    돌나물: [3, 4, 5],
    냉이: [3, 4],
    쑥: [3, 4],
    달래: [3, 4],
    양배추: [3, 4, 5, 6],
    애호박: [3, 4, 5, 6, 7, 8, 9, 10],
    비트: [3, 4, 5, 6],
    부추: [3, 4, 5, 6, 7, 8, 9],
    더덕: [1, 2, 3, 4],
    딸기: [1, 2, 3, 4, 5],
    표고버섯: [3, 4, 5, 6, 7, 8, 9],
    연근: [10, 11, 12, 1, 2, 3],
    우엉: [1, 2, 3],
    마늘: [3, 4, 5],
    고구마: [8, 9, 10],
    방아잎: [8, 9, 10, 11],
    생강: [8, 9, 10, 11],
    참나물: [8, 9],
    도라지: [7, 8],
    멜론: [7, 8, 9, 10],
    블루베리: [7, 8, 9],
    수박: [7, 8],
    치커리: [7, 8],
    아욱: [7, 8],
    토마토: [7, 8, 9],
    옥수수: [7, 8, 9],
    고추: [6, 7, 8, 9, 10, 11],
    샐러리: [6, 7, 8, 9, 10, 11],
    복분자: [6, 7, 8],
    근대: [6, 7, 8],
    가지: [4, 5, 6, 7, 8],
    죽순: [5],
    파프리카: [5, 6, 7],
    피망: [5, 6, 7],
    고사리: [4, 5],
    양파: [4, 5, 6, 7],
    당근: [9, 10, 11],
    송이버섯: [9, 10],
    은행: [9],
    감자: [6, 7, 8, 9],
    유자: [11, 12],
    늙은호박: [10, 11, 12],
    마: [10, 11],
    무: [10, 11, 12],
    브로콜리: [10, 11, 12],
  },
  fruit: {
    살구: [6, 7],
    참외: [6, 7, 8],
    강남콩: [6, 7],
    완두콩: [4, 5, 6],
    매실: [5, 6],
    포도: [8, 9, 10],
    아로니아: [8, 9],
    잣: [8, 9, 10, 11, 12, 1, 2],
    오렌지: [6, 7, 8, 9, 10],
    복숭아: [7, 8],
    자두: [7, 8],
    배: [9, 10, 11],
    석류: [9, 10, 11, 12],
    모과: [9, 10],
    귤: [9, 10, 11, 12],
    땅콩: [9, 10, 11],
    감: [10, 11],
    자몽: [12, 1, 2, 3],
  },
};

export function getRandomSeasonalFoodInSameCategory(
  month: number,
  ingreNum: number
): string[] {
  const categories: string[] = Object.keys(seasonalIngredients);

  let stack = 0;
  const resultArray: string[] = [];
  while (true) {
    if (resultArray.length === ingreNum) return resultArray;
    stack++;
    if (stack >= 35) return resultArray;

    const randomCategory: string =
      categories[Math.floor(Math.random() * categories.length)];

    const tempIngreObj: ingredientsAndMonth =
      seasonalIngredients[randomCategory];
    const tempIngres = Object.keys(tempIngreObj);

    const tempIngreName: string =
      tempIngres[Math.floor(Math.random() * tempIngres.length)];

    if (
      tempIngreObj[tempIngreName].includes(month) &&
      !resultArray.includes(tempIngreName)
    ) {
      resultArray.push(tempIngreName);
    }
  }
}
