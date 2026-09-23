export interface PresetItem {
  name: string;
  unit: string;
}

export interface ChecklistPreset {
  id: string;
  title: string;
  description: string;
  emoji: string;
  badge: string;
  items: PresetItem[];
}

export const CHECKLIST_PRESETS: ChecklistPreset[] = [
  {
    id: "pension-j",
    title: "MBTI J의 1박 2일 펜션 장보기",
    description: "1박 2일 펜션·글램핑 여행 시 빼놓기 쉬운 필수 양념, 바베큐 고기, 햇반, 라면, 호일까지 완벽 체크리스트",
    emoji: "⛺",
    badge: "펜션",
    items: [
      { name: "삼겹살", unit: "600g" },
      { name: "목살", unit: "600g" },
      { name: "모둠 소시지", unit: "1팩" },
      { name: "쌈채소(상추/깻잎)", unit: "1봉" },
      { name: "쌈장", unit: "1통" },
      { name: "허브솔트", unit: "1개" },
      { name: "깐마늘", unit: "1봉" },
      { name: "청양고추", unit: "1봉" },
      { name: "김치", unit: "1팩" },
      { name: "라면", unit: "4봉" },
      { name: "햇반", unit: "4개" },
      { name: "생수 2L", unit: "2병" },
      { name: "알루미늄 호일", unit: "1개" },
      { name: "물티슈", unit: "1개" },
    ],
  },
  {
    id: "camping-bbq",
    title: "캠핑 숯불 바베큐(BBQ) 필수 세트",
    description: "캠핑장에서 실패 없는 두툼한 숯불 구이용 고기, 쌈채소, 생와사비, 마시멜로 필수 식재료 모음",
    emoji: "🥩",
    badge: "캠핑",
    items: [
      { name: "두툼한 목살", unit: "800g" },
      { name: "등갈비", unit: "1대" },
      { name: "새송이버섯", unit: "1팩" },
      { name: "구이용 대파", unit: "1단" },
      { name: "모둠 쌈채소", unit: "1봉" },
      { name: "생와사비", unit: "1개" },
      { name: "쌈장", unit: "1개" },
      { name: "비빔면", unit: "4봉" },
      { name: "구이용 마시멜로", unit: "1봉" },
      { name: "얼음", unit: "1봉" },
      { name: "두꺼운 숯불 석쇠", unit: "1개" },
    ],
  },
  {
    id: "living-alone",
    title: "자취생 첫 독립 생존 3만원 팩",
    description: "원룸 자취 시작할 때 필수! 가성비 계란, 기본 장류, 김치, 스팸 등 1인 가구 필수 생존 양념 세트",
    emoji: "🍳",
    badge: "자취",
    items: [
      { name: "계란", unit: "15구" },
      { name: "양파", unit: "1망" },
      { name: "대파", unit: "1단" },
      { name: "다진마늘", unit: "1통" },
      { name: "진간장", unit: "500ml" },
      { name: "참기름", unit: "1병" },
      { name: "식용유", unit: "1병" },
      { name: "고춧가루", unit: "1봉" },
      { name: "맛소금", unit: "1개" },
      { name: "배추김치", unit: "1kg" },
      { name: "스팸", unit: "2캔" },
      { name: "참치캔", unit: "3캔" },
      { name: "라면", unit: "5입" },
    ],
  },
  {
    id: "home-party",
    title: "센스 만점 홈파티 & 집들이 세트",
    description: "밀푀유나베, 감바스, 파스타 등 손님 초대 요리에 딱 맞는 호불호 없는 집들이 음식 추천 장보기 목록",
    emoji: "🍷",
    badge: "집들이",
    items: [
      { name: "샤브용 소고기", unit: "600g" },
      { name: "알배기배추", unit: "1통" },
      { name: "표고버섯", unit: "1팩" },
      { name: "쯔유(가쓰오육수)", unit: "1병" },
      { name: "칵테일새우", unit: "1팩" },
      { name: "올리브유", unit: "1병" },
      { name: "통마늘", unit: "2봉" },
      { name: "페페론치노", unit: "1병" },
      { name: "바게트빵", unit: "1개" },
      { name: "파스타면", unit: "1봉" },
      { name: "파스타소스", unit: "1병" },
      { name: "방울토마토", unit: "1팩" },
      { name: "샐러드믹스", unit: "1팩" },
    ],
  },
  {
    id: "chuseok-holiday",
    title: "추석 명절 차례상 & 명절음식 필수 세트",
    description: "동태포 전 부치기, 산적, 삼색 나물, 탕국, 과일 등 추석·설날 명절 차례상 필수 식재료 체크리스트",
    emoji: "🌕",
    badge: "명절",
    items: [
      { name: "동태포", unit: "1팩" },
      { name: "산적용 소고기", unit: "600g" },
      { name: "탕국용 양지 소고기", unit: "400g" },
      { name: "동그랑땡용 다진 돼지고기", unit: "500g" },
      { name: "계란", unit: "2판" },
      { name: "부침가루", unit: "1봉" },
      { name: "튀김가루", unit: "1봉" },
      { name: "식용유 대용량", unit: "1병" },
      { name: "고사리", unit: "1팩" },
      { name: "도라지", unit: "1팩" },
      { name: "시금치", unit: "1단" },
      { name: "사과", unit: "1박스" },
      { name: "배", unit: "1박스" },
      { name: "깐밤", unit: "1봉" },
      { name: "대추", unit: "1봉" },
      { name: "약과/산자", unit: "1팩" },
    ],
  },
];
