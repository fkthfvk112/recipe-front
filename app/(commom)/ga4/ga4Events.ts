/**
 * GA4 이벤트 추적 유틸리티
 * 그로스 마케팅 목표 달성을 위한 이벤트 정의
 */

type EventParams = {
  [key: string]: string | number | boolean | undefined;
};

export const sendGA4Event = (eventName: string, params?: EventParams) => {
  if (typeof window !== 'undefined') {
    // 1. gtag가 있으면 gtag로 전송
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', eventName, params);
    }
    // 2. GTM dataLayer가 있으면 dataLayer로도 push
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: eventName,
      ...params,
    });
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
 * 웰컴 페이지 관련 이벤트
 */
export const welcomeEvents = {
  // 웰컴 페이지로 이동
  goToWelcome: (source: string = "direct") => {
    sendGA4Event('go_to_welcome', {
      event_category: 'onboarding_conversion',
      event_label: '웰컴 페이지 이동',
      source: source,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * 로그인 및 인증/계정 관련 이벤트
 */
export const authEvents = {
  // 로그인 페이지 이동 (어느 경로에서 유입되었는지 추적)
  goToSignIn: (source: string = "direct") => {
    sendGA4Event('go_to_signin', {
      event_category: 'auth_funnel',
      event_label: '로그인 페이지 이동',
      source: source, // 'nav_header', 'fridge_guard', 'recipe_detail', 'welcome', etc.
      timestamp: new Date().toISOString(),
    });
  },

  // 로그인 페이지 조회
  viewSignInPage: (source?: string) => {
    sendGA4Event('view_signin_page', {
      event_category: 'auth_funnel',
      event_label: '로그인 페이지 조회',
      source: source || 'direct',
      timestamp: new Date().toISOString(),
    });
  },

  // 로그인 시도
  submitSignIn: (method: 'normal' | 'naver' | 'kakao' = 'normal') => {
    sendGA4Event('submit_signin', {
      event_category: 'auth_funnel',
      event_label: `로그인 시도 (${method})`,
      login_method: method,
      timestamp: new Date().toISOString(),
    });
  },

  // 로그인 성공
  signInSuccess: (method: 'normal' | 'naver' | 'kakao' = 'normal') => {
    sendGA4Event('signin_success', {
      event_category: 'auth_conversion',
      event_label: `로그인 성공 (${method})`,
      login_method: method,
      timestamp: new Date().toISOString(),
    });
  },

  // 로그인 실패
  signInFailure: (reason: string, method: 'normal' | 'naver' = 'normal') => {
    sendGA4Event('signin_failure', {
      event_category: 'auth_funnel',
      event_label: `로그인 실패 (${reason})`,
      login_method: method,
      fail_reason: reason,
      timestamp: new Date().toISOString(),
    });
  },

  // 소셜 로그인 버튼 클릭
  clickSocialLogin: (provider: 'naver' | 'kakao' | 'google') => {
    sendGA4Event('click_social_login', {
      event_category: 'auth_funnel',
      event_label: `${provider} 간편 로그인 클릭`,
      provider: provider,
      timestamp: new Date().toISOString(),
    });
  },

  // 회원가입 링크/버튼 클릭
  clickSignUpLink: (source: string = 'signin_page') => {
    sendGA4Event('click_signup_link', {
      event_category: 'auth_funnel',
      event_label: '회원가입 링크 클릭',
      source: source,
      timestamp: new Date().toISOString(),
    });
  },

  // 회원가입 완료
  signUpSuccess: (method: 'normal' | 'naver' = 'normal') => {
    sendGA4Event('signup_success', {
      event_category: 'auth_conversion',
      event_label: `회원가입 완료 (${method})`,
      signup_method: method,
      timestamp: new Date().toISOString(),
    });
  },

  // 로그아웃
  signOut: () => {
    sendGA4Event('sign_out', {
      event_category: 'auth_funnel',
      event_label: '로그아웃',
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
