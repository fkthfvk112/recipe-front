/**
 * GA4 이벤트 추적 유틸리티
 * 그로스 마케팅 목표 달성을 위한 이벤트 정의
 */

type EventParams = {
  [key: string]: string | number | boolean | undefined;
};

export const sendGA4Event = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

/**
 * 레시피 페이지 관련 이벤트
 */
export const recipeEvents = {
  // 레시피 상세 페이지 조회
  viewRecipeDetail: (recipeId: number, recipeName: string, category: string) => {
    sendGA4Event('view_recipe_detail', {
      event_category: 'recipe_engagement',
      event_label: recipeName,
      recipe_id: recipeId,
      recipe_name: recipeName,
      recipe_category: category,
      timestamp: new Date().toISOString(),
    });
  },

  // 냉장고 추가 버튼 클릭 (핵심 이벤트!)
  viewAddToFridge: (recipeId: number, recipeName: string, ingredientCount: number) => {
    sendGA4Event('click_add_to_fridge', {
      event_category: 'fridge_conversion',
      event_label: '냉장고 추가 클릭',
      recipe_id: recipeId,
      recipe_name: recipeName,
      ingredient_count: ingredientCount,
      timestamp: new Date().toISOString(),
    });
  },

  clickAddToFridge: (recipeId: number, recipeName: string, ingredientCount: number) => {
    sendGA4Event('click_add_to_fridge', {
      event_category: 'fridge_conversion',
      event_label: '냉장고 추가 클릭',
      recipe_id: recipeId,
      recipe_name: recipeName,
      ingredient_count: ingredientCount,
      timestamp: new Date().toISOString(),
    });
  },

  // 개별 식재료 클릭 (부족한 재료 쿠팡 구매로 유도 가능성)
  clickIngredient: (recipeId: number, ingredientName: string) => {
    sendGA4Event('click_ingredient', {
      event_category: 'recipe_engagement',
      event_label: '식재료 클릭',
      recipe_id: recipeId,
      ingredient_name: ingredientName,
      timestamp: new Date().toISOString(),
    });
  },

  // 조리 단계 확인
  viewRecipeSteps: (recipeId: number, totalSteps: number) => {
    sendGA4Event('view_recipe_steps', {
      event_category: 'recipe_engagement',
      event_label: '조리법 확인',
      recipe_id: recipeId,
      total_steps: totalSteps,
      timestamp: new Date().toISOString(),
    });
  },

  // 개별 조리 단계 확인
  viewRecipeStep: (recipeId: number, stepNumber: number) => {
    sendGA4Event('view_recipe_step', {
      event_category: 'recipe_engagement',
      event_label: `조리 단계 ${stepNumber} 확인`,
      recipe_id: recipeId,
      step_number: stepNumber,
      timestamp: new Date().toISOString(),
    });
  },

  // 페이지 스크롤 깊이 추적 (콘텐츠 engagement 지표)
  scrollDepthRecipe: (recipeId: number, scrollDepth: number) => {
    sendGA4Event('scroll_depth_recipe', {
      event_category: 'recipe_engagement',
      event_label: `스크롤 ${scrollDepth}%`,
      recipe_id: recipeId,
      scroll_depth: scrollDepth,
      timestamp: new Date().toISOString(),
    });
  },

  // URL 복사 (공유 의도)
  copyRecipeUrl: (recipeId: number, recipeName: string) => {
    sendGA4Event('copy_recipe_url', {
      event_category: 'recipe_engagement',
      event_label: 'URL 복사',
      recipe_id: recipeId,
      recipe_name: recipeName,
      timestamp: new Date().toISOString(),
    });
  },

  // 리뷰 작성 (UGC 및 engagement)
  submitReview: (recipeId: number, rating: number) => {
    sendGA4Event('submit_review', {
      event_category: 'recipe_engagement',
      event_label: '리뷰 작성',
      recipe_id: recipeId,
      rating: rating,
      timestamp: new Date().toISOString(),
    });
  },

  // 요리사 프로필 클릭
  clickUserProfile: (recipeId: number, userId: string, userNickName: string) => {
    sendGA4Event('click_user_profile', {
      event_category: 'recipe_engagement',
      event_label: '요리사 프로필 클릭',
      recipe_id: recipeId,
      user_id: userId,
      user_nickname: userNickName,
      timestamp: new Date().toISOString(),
    });
  },

  // 수정/삭제 버튼 클릭 (관리자/소유자 action)
  clickRecipeEdit: (recipeId: number) => {
    sendGA4Event('click_recipe_edit', {
      event_category: 'recipe_management',
      event_label: '레시피 수정',
      recipe_id: recipeId,
      timestamp: new Date().toISOString(),
    });
  },

  clickRecipeDelete: (recipeId: number) => {
    sendGA4Event('click_recipe_delete', {
      event_category: 'recipe_management',
      event_label: '레시피 삭제',
      recipe_id: recipeId,
      timestamp: new Date().toISOString(),
    });
  },

  // 레시피 신고
  reportRecipe: (recipeId: number, reason: string) => {
    sendGA4Event('report_recipe', {
      event_category: 'moderation',
      event_label: '레시피 신고',
      recipe_id: recipeId,
      reason: reason,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * 냉장고 관리 관련 이벤트
 */
export const fridgeEvents = {
  // 냉장고 추가 완료
  addToFridgeSuccess: (recipeId: number, ingredientCount: number) => {
    sendGA4Event('add_to_fridge_success', {
      event_category: 'fridge_conversion',
      event_label: '냉장고 추가 완료',
      recipe_id: recipeId,
      ingredient_count: ingredientCount,
      timestamp: new Date().toISOString(),
    });
  },

  // 냉장고 관리 페이지로 이동
  goToFridgeManagement: (recipeId: number, source: string) => {
    sendGA4Event('go_to_fridge_management', {
      event_category: 'fridge_conversion',
      event_label: '냉장고 관리 페이지 이동',
      recipe_id: recipeId,
      source: source, // 'recipe_detail', 'recipe_list', etc.
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * 쿠팡 파트너스 관련 이벤트
 */
export const coupangEvents = {
  // 쿠팡 구매 링크 클릭
  clickCoupangLink: (recipeId: string, ingredientName: string, coupangProductId?: string) => {
    sendGA4Event('click_coupang_link', {
      event_category: 'affiliate_marketing',
      event_label: '쿠팡 링크 클릭',
      recipe_id: recipeId,
      ingredient_name: ingredientName,
      coupang_product_id: coupangProductId,
      timestamp: new Date().toISOString(),
    });
  },

  // 부족한 식재료 목록 조회
  viewMissingIngredients: (recipeId: number, missingCount: number) => {
    sendGA4Event('view_missing_ingredients', {
      event_category: 'affiliate_marketing',
      event_label: '부족한 식재료 조회',
      recipe_id: recipeId,
      missing_ingredient_count: missingCount,
      timestamp: new Date().toISOString(),
    });
  },
};
