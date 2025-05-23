interface MenuData {
    [key: string]: {[key:string]:string[]}
  }


export const randomMenuData:MenuData = {
    간식: {
        과자류: [
            '눈을감자', '프링글스', '포카칩', '초코파이', '오징어땅콩', '새우깡', '고구마칩', '체다치즈볼', '쌀과자', '땅콩강정', '찹쌀떡', '유과', '약과',
            '호두과자', '꿀타래', '모나카', '바나나킥', '콘칩', '치토스', '포테이토칩', '포카칩', 
            '아몬드초코볼', '쿠크다스', '후렌치파이', '초코송이', '빼빼로', '쌀강정',
            '꿀꽈배기', '한과', '짱구', '고래밥', '빅파이', '웨하스', '땅콩샌드', '크래커', '칸쵸',
            '카스타드', '마가렛트', '전병'
        ],
        빵류: [
            '크루아상', '도넛', '카스텔라', '앙버터', '팥빵', '크림빵', '치즈케이크', '딸기케이크', '초코케이크', '바게트', '브리오슈',
            '크로크무슈', '파니니', '치아바타', '크루아상샌드위치', '미트볼샌드위치', '클럽샌드위치', 'BLT샌드위치', '프렌치토스트',
            '핫도그', '토스트', '치킨버거', '불고기버거', '새우버거',
            '호떡', '핫케이크', '초코팬케이크', '고구마파이', '밤만쥬', '마늘빵', '마들렌', '베이글',
            '와플', '크루아상도넛', '크림치즈번', '모닝빵', '통밀빵', '치즈바게트', '프레첼', '브라우니', '애플파이', '무스케이크', '롤케이크',
            '파운드케이크', '컵케이크', '쇼트케이크', '수플레 팬케이크', '에클레어', '슈크림', '몽블랑', '생크림빵', '슈크림빵'
        ],
        기타: [
            '아이스크림', '푸딩', '젤리', '초콜릿', '마카롱', '크렘브륄레', '티라미수',
            '레몬타르트', '크로캉무슈', '크레이프', '파르페', 
            '젤라토', '초콜릿트러플', '다쿠아즈', '쇼콜라', '치즈무스', '녹차아이스크림', '망고푸딩', '화과자',
            '초코쿠키', '초코 쿠키', '화이트초콜릿',        
        ],
        음료류: [
            '아메리카노', '밀크티', '버블티', '라떼', '에스프레소', '모카', '카푸치노', '프라푸치노', '핫초코',
            '녹차라떼', '홍차', '아이스티', '레모네이드', '스파클링워터', '미네랄워터', '코코아', '망고주스', '딸기주스', '바나나주스',
            '토마토주스', '청포도주스', '오렌지주스', '사과주스', '포도주스', '파인애플주스', '석류주스', '블루베리주스', '크랜베리주스',
            '자몽주스', '수박주스', '키위주스', '샤인머스캣주스', '애플망고주스', '바나나스무디', '블루베리스무디', '그린스무디', '복숭아스무디',
            '요거트스무디', '딸기스무디', '망고스무디', '블랙티라떼', '밀크쉐이크', '바닐라쉐이크', '초코쉐이크', '바나나우유', '초코우유', '메론우유', '흰우유', '딸기우유'
        ]
    },
    식사: {
        한식: [
            '비빔밥', '김밥', '돌솥밥', '유부초밥', '콩나물밥', '제육덮밥', '치킨덮밥',
            '스팸마요덮밥', '낙지덮밥', '쇠고기 덮밥', '떡볶이', '로제떡볶이', '짜장떡볶이',
            '육회비빔밥', '꼬막비빔밥', '전복죽', '삼계탕', '야채죽', '된장술밥', '고추장밥',
            '매운갈비찜', '참치볶음밥', '오징어덮밥', '닭고기덮밥', '한우덮밥', '차돌박이덮밥', '아구찜',
            '감자밥', '오리주물럭', '멸치볶음', '간장계란밥',
            '된장찌개', '김치찌개', '갈비탕', '육개장', '순두부찌개', '부대찌개', '동태찌개', '감자탕', '매운탕', '청국장',
            '차돌된장찌개', '꽃게탕', '아귀탕', '고추장찌개', '고등어조림', '생태탕', '해물탕', '닭개장', '소고기무국',
            '북어국', '콩나물국', '미역국', '육개장', '떡국', '떡만둣국', '짬뽕', '어묵탕', '만둣국', '오리탕', '갈비찜', '닭도리탕',
            '돼지갈비찜', '장어탕', '버섯전골', '대구탕', '추어탕', '민어탕', '설렁탕', '감자탕', '소머리국밥',
            '선지해장국', '순대국밥', '순대', '곰탕', '닭볶음탕', '알탕',
            '소불고기', '삼겹살', '갈비', '닭갈비', '제육볶음', '찜닭', '수육', '보쌈', '돼지갈비찜', '양념갈비', '양갈비',
            '고추잡채', '매운돼지갈비찜', '수제돈까스', '닭도리탕', '오리훈제', '돼지목살구이', '차돌박이', '닭강정', '후라이드치킨',
            '양념치킨', '순살치킨', '간장치킨', '떡갈비', '닭꼬치', '돼지껍데기', '족발', '차돌된장찌개',
            '우삼겹 숙주 볶음', '곱창볶음', '막창', '육회', '차돌박이숙주볶음', '돼지고기 두루치기', '소고기 무국',
            'LA갈비', '닭볶음탕', '훈제오리', '닭날개구이', '돼지고기김치찜', '돼지불고기',
            '회', '조개구이', '해물파전', '해물탕', '해물찜', '매운탕', '갈치조림', '고등어구이',
            '조개찜', '멍게', '해삼', '전복', '문어숙회', '연어스테이크', '바지락칼국수', '굴전', '고등어조림', '가리비구이',
            '낙지볶음', '문어초회', '대하소금구이', '오징어볶음', '미더덕찜', '갑오징어회', '해물볶음우동', '꽃게찜', '장어구이',
            '꼬막찜', '쭈꾸미볶음', '홍어회', '조개구이', '매운갈치찜', '게살스프', '홍합탕', '간장게장',
            '해물순두부찌개', '아귀찜', '참치회', '광어회', '대게찜', '삼치구이', '고등어자반구이',
            '해물라면',
            '파전', '김치전', '해물전', '동그랑땡', '호박전', '감자전',
            '육전', '두부부침', '애호박전', '녹두전', '감자채전', '배추전',
            '동태전', '계란말이',
            '계란말이', '오이소박이', '녹두빈대떡', '산적',
            '미역국', '소시지야채볶음',
            '잡채', '깻잎지', '열무김치', '깍두기', '총각김치', '오이소박이', '배추김치', '고추장아찌',
            '깻잎장아찌', '양념게장', '간장게장', '오징어젓갈', '명란젓', '낙지젓', '갈치젓', '돼지고기장조림',
            '소고기장조림', '메추리알장조림', '고추장불고기', '어묵볶음', '미역줄기볶음', '감자조림', '연근조림', '무생채',
            '콩나물무침', '시금치나물', '도라지무침', '숙주나물', '참나물무침', '고사리나물', '김자반', '멸치볶음', '두부조림',
            '계란말이', '계란찜', '두부부침', '버섯볶음', '가지볶음', '호박볶음', '양배추볶음', '양파절임', '깻잎무침',
            '고추무침', '간장깻잎지', '계란장조림', '오징어볶음',
        ],
        중식: [
            '짜장면', '짬뽕', '마라탕', '우육면', '볶음우동', '탄탄면', '우동',
            '중화냉면', '중국식볶음면', '샤오롱바오', '탕수육', '마파두부', '사천식짜장',
            '동파육', '마라샹궈', '지삼선',
            '해물짬뽕', '계란볶음밥',
            '마라룽샤면', '마라롱샤',
            '어향가지', '돼지고기볶음면',
            '볶음밥', '유린기', '짬뽕밥', '짜장밥', 
            '탕수육', '꿔바로우', '마라샹궈', '동파육', '깐풍기', '라조기', '고추잡채', '마파두부', '유린기',
            '가지 튀김', '마파두부', '건두부무침', '베이징덕'
        ],
        일식: [
            '초밥', '오니기리', '카츠동', '텐동', '규동', '장어덮밥', '회덮밥', '유부초밥', '사케동',
            '연어알덮밥', '연어회덮밥', '가츠돈', '텐돈', '에비카츠동', '아보카도덮밥', '버터간장덮밥', '치킨마요덮밥', '타코야키덮밥',
            '와사비덮밥',
            '라멘', '우동', '소바', '타누키우동', '야키소바', '카레우동', '탄탄멘', '멘치카츠라멘', '쇼유라멘',
            '시오라멘', '미소라멘', '츠케멘', '차슈라멘', '니꾸소바', '텐소바', '자루소바', '키츠네우동',
            '메밀소바', '텐푸라우동',
            '마제소바',
            '가라아게', '돈카츠', '야키니쿠', '샤브샤브', '규카츠', '스키야키', '닭꼬치', '규동', '쇼가야키', '테리야키치킨',
            '와규스테이크',
            '비프카츠', '에비카츠', '치킨가라아게', '모츠나베',
            '야키도리', '오코노미야키', '타코야키',
            '나베', '미소시루', '야키토리', '스키야키', '오뎅',
        ],
        양식: [
            '스파게티', '라자냐', '알리오올리오', '까르보나라', '볼로네제', '카르보나라',
            '바질페스토 파스타', '토마토소스파스타', '크림소스파스타', '해산물파스타', '새우크림파스타',
            '볼로네제스파게티', '알리오올리오스파게티', '새우파스타', '마늘크림파스타', '명란파스타', '오징어먹물파스타', '해산물리조또',
            '버섯크림리조또', '새우리조또', '치킨크림파스타', '양송이크림파스타', '까르보나라스파게티',
            '봉골레파스타',
            '볼로네제라자냐', '로제파스타',
            '고르곤졸라피자',
            '스테이크', '바비큐', '로스트치킨', '비프웰링턴', '립스테이크','비프브리스킷', '치킨윙', '햄버거',
            '베이컨', '햄', '폭립', '소시지', '치킨커틀릿', '치킨너겟', '치킨텐더', '치킨스테이크', '치킨랩',
            '터키', '칠면조', '구운오리', '훈제오리', '훈제연어', '바비큐립', '비프스튜', '비프파이',
            '비프커리', '비프찹', '치킨찹', '치킨커리', '치킨찹스테이크', '치킨타코', '치킨버거', '치킨파히타', '치킨퀘사디아',
            '버팔로윙', '치킨스테이크',
            '치킨샐러드', '치킨커틀렛',
            '랍스터', '새우튀김', '조개 수프', '해물파스타', '해산물리조또', '해물샐러드', '연어스테이크', '참치타르타르',
            '해산물파에야', '새우크림파스타', '홍합스튜', '바지락스튜',
            '타코',
        ],
        아시아: [
            '똠얌꿍', '팟타이', '마싸만커리',
            '마라탕', '쌀국수',
            '쌀국수', '반미', '분짜', '짜조', '반쎄오',
            '커리', '난', '탄두리치킨', '로티',
            '치킨커리', '버터치킨', '치킨티카마살라',
            '나시고랭', '사태', '락사', '미고랭',
        ],
    }

};
