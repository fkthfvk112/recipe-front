# 📖 머그인(Mug-In) 프론트엔드 아키텍처 & AI 개발 지침서

본 문서는 **머그인(Mug-In) 프론트엔드 프로젝트 (`recipe-front`)** 의 전체 아키텍처, 도메인별 플로우, 주요 컴포넌트 및 AI 코드 생성을 위한 필수 표준 지침을 정의합니다.

AI 및 개발자는 코드 작성 시 본 지침서의 규약을 엄격히 준수해야 합니다.

---

## 🚨 1. 필수 개발 원칙 (Core Principles & Guidelines)

### 📌 [원칙 1] 기존 코드 스타일 및 패턴 엄격 준수
1. **패턴 일관성 유지**: 새로운 기능 구현 시 기존 컴포넌트, 훅, API 통신 패턴과 동일한 구조로 작성합니다.
2. **Next.js App Router 준수**: 
   - 기본적으로 Server Component(`"use server"`)를 우선 활용합니다.
   - 이벤트 핸들러, 브라우저 API, 상태(`useState`, `useEffect`)가 필요한 경우에만 클라이언트 컴포넌트(`"use client"`)로 분리합니다.
3. **UI/UX 라이브러리 컨벤션**:
   - **Tailwind CSS**: 유틸리티 클래스 기반 디자인 스타일링 사용.
   - **MUI / SweetAlert2 (`Swal`)**: 모달, 토스트, 대화상자, 피드백 UI 작성 시 기존 패턴 재사용.
4. **버튼 스타일링 기본 규칙 (No Default Border)**:
   - 브라우저 기본 User-Agent 스타일로 인한 검은색 테두리 및 레이아웃 깨짐을 방지하기 위해, 버튼 작성 시 반드시 `border-none outline-none`을 기본 적용합니다.
   - 문장 내 인라인 텍스트 클릭 액션은 기본 테두리가 생기는 `<button>` 대신 스타일링된 `<span role="button" ...>`을 사용합니다.

### 🛑 [원칙 2] 하드코딩 절대 금지 (Strict No-Hardcoding Policy)
1. **API URL 및 백엔드 엔드포인트 하드코딩 금지**:
   - 절대 `http://localhost:8080`나 특정 IP/도메인을 코드에 직접 적지 마십시오.
   - 백엔드 URL은 반드시 `process.env.NEXT_PUBLIC_API_URL` 환경 변수를 사용해야 합니다.
   - 대표 사이트 URL은 `process.env.NEXT_PUBLIC_SITE_URL` 또는 `https://www.mug-in.com` (상수 유틸리티)을 참조하십시오.
2. **매직 넘버 및 고정 문자열 상수화**:
   - 페이징 `size`, 타임아웃, 재검증 주기(`revalidate`) 등은 상수 파일이나 파라미터로 처리합니다.

### 🔄 [원칙 3] 아키텍처 가이드 문서 실시간 동기화 필수 (Always Keep Guide Updated)
1. **변경 사항 즉시 반영**:
   - 개발자 또는 AI가 소스 코드를 수정, 리팩토링하거나 새로운 컴포넌트, 훅, 도메인, API 연결 방식을 추가/변경한 경우 **반드시 이 문석(`FRONTEND_ARCHITECTURE_GUIDE.md`)도 그에 맞게 함께 수정해야 합니다.**
2. **도메인 컴포넌트 목록 유지**:
   - 새로운 페이지 경로, 컴포넌트 파일, 이벤트 로깅 등이 새로 생성되거나 제거되면 본 문서의 `4. 도메인별 플로우 및 사용 컴포넌트 명세`에 즉시 반영하여 최신 상태를 유지하십시오.

---

## 📂 2. 프로젝트 디렉토리 구조 (Directory Map)

```text
app/
├── (commom)/                  # 공통 UI 컴포넌트, 훅, 유틸리티, GA4, API 모듈
│   ├── Component/             # 공통 UI 버튼, 뱃지, 모달, FallbackPage 등
│   ├── CRUD/                  # 수정/삭제, 좋아요, 공유하기 등 공통 액션
│   ├── ga4/                   # GA4 이벤트 추적 (ga4Events.ts)
│   ├── Hook/                  # 공통 커스텀 훅 (useChkLoginToken, useDecreaseTimer 등)
│   └── serverFetch.ts         # Server Components용 API 통신 래퍼
├── (customAxios)/             # Client Components용 인증 Axios (authAxios.ts, authFetch.ts)
├── (user)/                    # 회원가입, 로그인, 마이페이지, 프로필 설정
├── (recipe)/                  # 레시피 상세, 생성, 수정, 목록, 검색
├── (recipe-search)/           # 레시피 통합 검색
├── fridge/                    # 스마트 냉장고 관리, 식재료 입출고, 트랜잭션 내역
├── (board)/                   # 커뮤니티, 자유게시판, 소식/이벤트
├── (post)/                    # 식재료 백과 및 아티클 (SEO 포스트)
├── (diet)/                    # 식단 관리 및 다이어트
└── (randomMenu)/              # 랜덤 메뉴 추천
```

---

## 🌐 3. 데이터 통신 및 API 레이어 규칙

### 1. Server Components API 호출 (`serverFetch.ts`)
Server Component에서 데이터 페칭 시 `serverFetch` 래퍼를 사용하며, Next.js ISR 캐시 태그(`tags`) 및 `revalidate` 옵션을 명시합니다.

```typescript
// 예시: app/(commom)/serverFetch.ts 활용
import serverFetch from "@/app/(commom)/serverFetch";

const data = await serverFetch({
  url: "recipe/detail?recipeId=" + recipeId,
  option: {
    next: {
      revalidate: 30,
      tags: [`recipeDetail-${recipeId}`],
    },
  },
});
```

### 2. Client Components 인증 API 호출 (`authAxios.ts`)
클라이언트 단에서 로그인 세션 쿠키/토큰이 필요한 요청을 보낼 때는 `axiosAuthInstacne`를 사용합니다.

```typescript
// 예시: app/(customAxios)/authAxios.ts 활용
import { axiosAuthInstacne } from "@/app/(customAxios)/authAxios";

axiosAuthInstacne.post("fridge/my/fridge-item", payload)
  .then((res) => { ... });
```

### 3. 비즈니스 에러 핸들링 및 에러 코드 동기화 (`ErrorCode.ts` & `authAxios.ts`)
- **위치**: `app/(commom)/Error/ErrorCode.ts`
- **동작 원리**: 백엔드 API에서 비즈니스 예외가 발생하면 `authAxios.ts`의 응답 인터셉터가 `resData.code`가 `ErrorCode.ts`의 `errorCode` 배열에 포함되어 있는지 검사합니다.
  - 포함되어 있을 경우: 백엔드에서 전달한 친절한 한글 에러 메시지(`resData.message`)를 `Swal.fire` 경고 모달로 사용자에게 노출합니다.
  - 누락/미포함일 경우: 비즈니스 에러 코드로 식별되지 않아 기본 Fallback("알 수 없는 에러가 발생하였습니다.")이 발생합니다.
- ⚠️ **동기화 필수 규칙**: 백엔드 `ErrorCode.java`에 신규 비즈니스 에러 코드가 추가되거나 수정되면, **반드시 프론트엔드의 `app/(commom)/Error/ErrorCode.ts`의 `errorCode` 배열에도 동일한 코드를 추가**해야 합니다.

---

## 🧩 4. 도메인별 플로우 및 사용 컴포넌트 명세

### 4.1. 인증 & 회원 도메인 (`(user)`)
- **주요 기능**: 이메일/소셜(네이버, 카카오, 구글) 회원가입, 로그인, 아이디/비밀번호 찾기, 프로필 및 계정 설정
- **핵심 유저 플로우**:
  1. 로그인 페이지 진입 (`/signin`) ➔ 소셜(네이버, 카카오, 구글) 로그인 또는 일반 로그인 시도 ➔ 성공 시 JWT/쿠키 저장 후 리다이렉트
  2. 회원가입 페이지 진입 (`/signup`) ➔ 이메일 인증 번호 발송 및 확인 ➔ 필수 약관 동의 ➔ 가입 완료 (`signUpSuccess`)
- **주요 관련 파일 & 컴포넌트**:
  - `app/(user)/signin/page.tsx` & `loginForm.tsx`: 일반/소셜 로그인 폼 UI
  - `app/(user)/signin/naver/NaverLogin.tsx`, `kakao/KakaoLogin.tsx`, `google/GoogleLogin.tsx`: 소셜 로그인 버튼 컴포넌트
  - `app/(user)/signin/naver/callback/page.tsx`, `kakao/callback/page.tsx`, `google/callback/page.tsx`: 소셜 OAuth 콜백 처리 (`useRef` 중복 방지 가드 포함)
  - `app/(user)/signup/naver/page.tsx`, `kakao/page.tsx`, `google/page.tsx`: 소셜 간편 회원가입 (`CommonModal` 기반 간소화 약관 팝업 및 `border-none outline-none` 버튼 스타일 적용)
  - `app/(user)/signup/page.tsx`: 회원가입 메인 폼 (이메일 인증, 약관 동의)
  - `app/(user)/signup/BirthdateSelection.tsx`: 생년월일 컴포넌트
  - `app/(user)/accountSetting/UserInfoSetting.tsx`: 사용자 정보 변경
  - `app/(user)/check.ts`: 아이디/비밀번호/이메일 유효성 검사 유틸
  - `app/(type)/user.ts`: 사용자 DTO/타입 정의 및 가입 수단 Enum (`GrantType`: `NORMAL`, `NAVER`, `KAKAO`, `GOOGLE`)

---

### 4.2. 레시피 도메인 (`(recipe)`)
- **주요 기능**: 레시피 목록 검색/정렬, 상세 보기, AI 레시피 생성/작성, 수정, 삭제, 리뷰 작성
- **핵심 유저 플로우**:
  1. **레시피 목록/검색**: `/recipes/1/sortingCondition=POPULARITY` ➔ 상세 필터 조건 검색 ➔ 페이징 처리 (`RecipePagination`)
  2. **레시피 상세**: `/recipe-detail/[recipeId]/[slug]` ➔ 대표 이미지, 조리순서, 영양성분, AI 코멘트, 쿠팡 구매 연동 ➔ 리뷰 작성
  3. **레시피 작성**: `/create-recipe` ➔ 재료/조리순서 Drag & Drop 추가 ➔ 대표 이미지 업로드 ➔ 임시저장 또는 발행
- **주요 관련 파일 & 컴포넌트**:
  - `app/(recipe)/recipes/[pageNumber]/[queryString]/page.tsx`: 레시피 조건별 검색 목록 (Server Component)
  - `app/(recipe)/recipes/RecipePagination.tsx`: 레시피 목록 페이징 컴포넌트
  - `app/(recipe)/recipes/(common)/RecipeSearchBar.tsx`: 검색바 및 필터 모달
  - `app/(recipe)/recipe-detail/[recipeId]/[[...slug]]/page.tsx`: 레시피 상세 페이지 (SEO Schema.org 적용)
  - `app/(recipe)/recipe-detail/[recipeId]/RecipeNutritionSection.tsx`: 영양성분 분석 표
  - `app/(recipe)/recipe-detail/(review)/ReviewContainer.tsx` & `WriteReview.tsx`: 리뷰 및 별점 작성 컴포넌트
  - `app/(recipe)/create-recipe/page.tsx`: 레시피 폼 메인
  - `app/(recipe)/create-recipe/(ingreDnd)/IngredientDnd.tsx`: 식재료 DnD 추가
  - `app/(recipe)/create-recipe/(cookStepDnd)/ContainerDnd.tsx`: 조리 과정 DnD 추가
  - `app/(recipe)/edit-recipe/[recipeId]/page.tsx`: 레시피 수정 페이지

---

### 4.3. 냉장고 관리 도메인 (`fridge`)
- **주요 기능**: 내 냉장고 식재료 조회, 식재료 추가/수정/삭제, 소비기한(유통기한) 바 표시, 입출고 히스토리
- **핵심 유저 플로우**:
  1. `/fridge/[fridgeId]` 진입 ➔ 카테고리별/소비기한 임착순 식재료 그리드 뷰 ➔ 클릭 시 상세 모달
  2. 식재료 추가 (`/fridge/ingre-edit/[fridgeId]`) ➔ 이미지 선택 + 수량/단위/소비기한 입력 ➔ 저장
  3. 입출고 거래 내역 (`/fridge/tx-history`) ➔ 식재료 소비/폐기/추가 로그 조회
- **주요 관련 파일 & 컴포넌트**:
  - `app/fridge/[fridgeId]/page.tsx`: 냉장고 메인 화면
  - `app/fridge/[fridgeId]/(common)/ExpBar.tsx`: 유통기한/소비기한 시각적 잔여일 바
  - `app/fridge/[fridgeId]/(common)/FridgeItemDetailModal.tsx`: 식재료 상세 클릭 모달
  - `app/fridge/[fridgeId]/(common)/FridgeItemTxModal.tsx`: 식재료 수량 입출고 변경 모달
  - `app/fridge/ingre-edit/[fridgeId]/SetFridgeItem.tsx`: 식재료 신규 등록 및 수정 폼
  - `app/fridge/tx-history/TxHistoryTable.tsx`: 히스토리 테이블

---

### 4.4. 식재료 백과 및 아티클 도메인 (`(post)`)
- **주요 기능**: 식재료 보관법, 효능, 요리 팁 노하우 포스트 제공 (SEO 중심)
- **핵심 유저 플로우**:
  1. `/post` 아티클 목록 ➔ 특정 포스트 클릭 `/post/[...slug]` ➔ 마크다운 본문 및 연관 레시피/냉장고 추가 CTA ➔ GA4 이벤트 로깅 (`post_fridge_cta_click`)
- **주요 관련 파일 & 컴포넌트**:
  - `app/(post)/post/page.tsx`: 포스트 목록
  - `app/(post)/post/[...slug]/page.tsx`: 포스트 상세 랜딩 (Server Component)
  - `app/(post)/post/[...slug]/PostCTAButtons.tsx`: 내 냉장고 추가 / 관련 레시피 구경 CTA (GA4 지원 Client Comp)
  - `app/(post)/post/[...slug]/PostTagBadges.tsx`: 태그 뱃지 및 클릭 로깅
  - `app/(post)/post/[...slug]/PostRelatedCards.tsx`: 추천 게시글 카드 컴포넌트

---

### 4.5. 커뮤니티 및 피드 도메인 (`(board)` & `userfeed`)
- **주요 기능**: 소통 피드, 요리 인증샷 공유, 유저 피드 관리
- **주요 관련 파일 & 컴포넌트**:
  - `app/(board)/board/[boardMenuId]/page.tsx`: 커뮤니티 피드 목록
  - `app/(board)/board/[boardMenuId]/create/page.tsx`: 피드 글쓰기 폼
  - `app/(user)/userfeed/[userId]/page.tsx`: 타유저 피드 페이지
  - `app/(user)/userfeed/myfeed/page.tsx`: 마이 피드 관리

---

### 4.6. 식단/다이어트 & 추천 도메인 (`(diet)` & `(randomMenu)`)
- **주요 기능**: 식단 일기 작성 및 오늘 뭐 먹지? 랜덤 메뉴 룰렛 추천
- **주요 관련 파일 & 컴포넌트**:
  - `app/(diet)/diet/page.tsx`: 식단 일기
  - `app/(randomMenu)/randomMenu/page.tsx`: 랜덤 메뉴 추천 인터랙션 UI

---

## 📊 5. 이벤트 로깅 및 분석 (GA4 Tracking)

그로스 마케팅 및 퍼널 분석을 위해 모든 주요 사용자 액션은 `ga4Events.ts`를 통해 로깅해야 합니다.

- **위치**: `app/(commom)/ga4/ga4Events.ts`
- **사용 규칙**:
  ```typescript
  import { recipeEvents, authEvents, sendGA4Event } from "@/(commom)/ga4/ga4Events";

  // 이벤트 발생 시 호출 예시
  authEvents.goToSignIn("home_nav");
  sendGA4Event("click_custom_action", { category: "engagement" });
  ```

---

## 📝 6. AI 코드 작성 시 체크리스트 (Summary Checklist)

1. [ ] 백엔드 URL 참조 시 `process.env.NEXT_PUBLIC_API_URL`을 사용했는가?
2. [ ] Server Component와 Client Component (`"use client"`)의 구분이 올바른가?
3. [ ] 버튼이나 액션 발생 시 GA4 이벤트 함수를 적절히 호출했는가?
4. [ ] 기존 코드의 컴포넌트 분리 방식, Tailwind CSS 클래스 패턴을 유지했는가?
5. [ ] 예외 처리 시 SweetAlert2 (`Swal.fire`) 또는 기존 Fallback 컴포넌트를 사용했는가?
6. [ ] 코드 수정, 신규 기능/컴포넌트 추가 시 `FRONTEND_ARCHITECTURE_GUIDE.md` 아키텍처 가이드를 그에 맞게 업데이트했는가?
7. [ ] **백엔드 신규 비즈니스 에러 코드가 추가되었을 때 프론트엔드 `app/(commom)/Error/ErrorCode.ts`에 누락 없이 등록되었는가?**
