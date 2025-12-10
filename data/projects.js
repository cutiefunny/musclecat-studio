// /data/projects.js
export const projects = [
  {
    id: "chatbot-builder",
    name: "챗봇 시나리오 빌더",
    description: "React Flow 라이브러리를 활용하여 만든 챗봇 시나리오 에디터입니다. 드래그 앤 드롭 인터페이스를 통해 노드를 연결하여 챗봇의 대화 흐름을 시각적으로 설계하고 관리할 수 있습니다. 2026년에 싸이버로지텍에 납품 예정입니다.",
    shortDescription: "드래그 앤 드롭 방식으로 챗봇의 대화 흐름을 시각적으로 설계하는 도구입니다.", // portfolio/page.js용 짧은 설명 추가
    imageUrl: "/images/chatbot-builder.jpg",
    detailImageUrl: "/images/chatbot-builder.jpg", // 상세 페이지용 이미지 URL (동일하면 동일하게)
    githubUrl: null,
    serviceUrl: null,
    techStack: ["React", "React Flow", "TypeScript","Firebase"]
  },
  {
    id: "hybrid-chatbot",
    name: "하이브리드 챗봇",
    description: "선박 예약 등의 내부 업무를 지원하는 하이브리드 챗봇입니다. LLM을 통한 자연어 처리와 시나리오 기반 응답을 결합하여 사용자 문의에 효과적으로 대응하도록 설계되었습니다. 2026년에 싸이버로지텍에 납품 예정입니다.",
    shortDescription: "자연어 처리 기술과 시나리오 기반 응답을 결합한 지능형 챗봇입니다.",
    imageUrl: "/images/hybrid-chatbot.jpg",
    detailImageUrl: "/images/hybrid-chatbot.jpg",
    githubUrl: null,
    serviceUrl: null,
    techStack: ["Next.js", "TypeScript", "Firebase", /* ... 확인 필요 ... */ ]
  },
  {
    id: "eink-news",
    name: "E-ink News",
    description: "E-ink 단말기의 특성을 고려하여 가독성을 극대화한 뉴스 앱입니다. SolidJS로 개발되어 매우 가볍고 빠르며, 고품질 TTS 기능을 내장하여 화면을 보지 않고도 뉴스를 청취할 수 있습니다.",
    shortDescription: "E-ink 단말기에 최적화된 초경량 뉴스 앱입니다.",
    imageUrl: "/images/eink-news.jpg",
    detailImageUrl: "/images/eink-news-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/eink-news",
    serviceUrl: "https://eink-news.vercel.app/",
    download: "/apk/eink-news.apk",
    techStack: ["SolidJS", "Vite", "TTS API"]
  },
  {
      id: "daehwajang",
      name: "소셜 모임앱",
      description: "관심사 기반의 모임 참여, 이벤트 확인 및 멤버 추천 기능을 제공하는 소셜 모임·커뮤니티 플랫폼입니다. 포트원 결제와 푸시 알림을 포함합니다. 2026년에 레인메이커협동조합에 납품되어 대구 지역에서 서비스 예정입니다.",
      shortDescription: "모임 개설, 탐색과 채팅 기능을 제공하는 소셜 플랫폼입니다.",
      imageUrl: "/images/daehwajang.jpg",
      detailImageUrl: "/images/daehwajang-detail.jpg",
      githubUrl: "https://github.com/cutiefunny/daehwajang",
      serviceUrl: "https://daehwajang.vercel.app/",
      techStack: ["SvelteKit", "Firebase", "PWA", "Vite", "Embla Carousel", "Lucide Svelte", "FCM", "Vercel"]
  },
  {
    id: "cleaning-app",
    name: "청소중개앱",
    description: "청소 서비스를 필요로 하는 사용자와 청소 업체를 연결하는 중개 플랫폼입니다. 사용자는 앱을 통해 간편하게 청소 예약을 하고, 업체는 새로운 고객을 확보할 수 있습니다. 2025년에 픽큐에 납품되었습니다.",
    shortDescription: "청소 서비스를 필요로 하는 사용자와 청소 업체를 연결하는 중개 플랫폼입니다.",
    imageUrl: "/images/cleaning-app.png", // 목록 페이지용 이미지
    detailImageUrl: "/images/cleaning-app-detail.jpg", // 상세 페이지용 이미지
    githubUrl: "https://github.com/cutiefunny/clean-app",
    serviceUrl: "https://www.pickq.co.kr/",
    techStack: ["Next.js", "Firebase", "PWA"]
  },
  {
    id: "shipping-app",
    name: "선박물 거래앱",
    description: "컨테이너 선박물을 거래하는 온라인 마켓플레이스입니다. 즐겨찾기, 장바구니, 주문관리, 카드결제 등 온라인 커머스의 모든 기능이 깔끔한 UI로 구현되어 있습니다. MVP로 개발되었으며, 안타깝게도 실제 서비스로 이어지지 못한 것으로 보입니다.",
    shortDescription: "컨테이너 선박물을 거래하는 온라인 마켓플레이스입니다.",
    imageUrl: "/images/shipping-app.png",
    detailImageUrl: "/images/shipping-app-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/ums-shop",
    serviceUrl: "https://ums-shop.vercel.app/home",
    techStack: ["Next.js", "AWS dynamoDB", "S3","Paypal", "PWA"]
  },
  {
    id: "hr-app",
    name: "인사관리앱",
    description: "출퇴근, 비용관리, 근태관리 등 인사 관련 업무를 효율적으로 관리하는 시스템입니다. 현장 출장과 법인카드 사용이 잦은 사업의 특성을 반영하여 개발되었습니다. 2025년에 다지트에 납품되었습니다.",
    shortDescription: "직원 정보, 급여, 휴가 등 인사 관련 업무를 효율적으로 관리하는 시스템입니다.",
    imageUrl: "/images/hr-app.jpg",
    detailImageUrl: "/images/hr-app-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/dajitWebapp",
    serviceUrl: "https://www.idajit.com/",
    techStack: ["React", "Node.js", "Spring Boot", "MySQL"]
  },
  {
    id: "drug-test-app",
    name: "마약검사앱",
    description: "마약 검사 결과를 기록하고 관리하는 모바일 애플리케이션입니다. 판독하기 어려운 검사지를 사진으로 찍어 업로드하면, 관리자 페이지에서 결과를 쉽게 확인하고 통계 자료로 활용할 수 있습니다. 2025년에 MVP로 헬씨메드에 납품되었습니다.",
    shortDescription: "마약 검사 결과를 기록하고 관리하는 모바일 애플리케이션입니다.",
    imageUrl: "/images/drug-test-app.jpg",
    detailImageUrl: "/images/drug-test-app-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/dope-test",
    serviceUrl: "https://dope-test-eight.vercel.app/",
    techStack: ["Next.js", "Firebase", "Python OCR"]
  },
  {
    id: "video-call-app",
    name: "화상통화앱",
    description: "영상 크리에이터와 시청자를 연결하는 화상통화 애플리케이션입니다. WebRTC 기술을 활용하여 안정적인 영상 통화를 제공하며, 실시간 채팅 기능도 포함되어 있습니다. 2025년 말 서비스를 목표로 하고 있습니다.",
    shortDescription: "실시간 영상 통화를 통해 원활한 커뮤니케이션을 지원하는 화상 통화 솔루션입니다.",
    imageUrl: "/images/video-call-app.jpg",
    detailImageUrl: "/images/video-call-app-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/live-cam",
    serviceUrl: "https://www.chuihyang.com/creator/",
    techStack: ["WebRTC", "Next.js", "peerJS", "Firebase Realtime Database"]
  },
  {
    id: "cat-map-app",
    name: "지도 기반 길냥이 도감 앱",
    description: "지도 위에 길고양이의 정보를 기록하고 공유하는 커뮤니티 앱입니다. 사용자들이 길냥이의 사진, 위치, 특징 등을 기록하고 다른 사용자들과 소통할 수 있습니다. 근육고양이 스튜디오에서 제공하는 무료 서비스이며 앱을 설치하거나 웹에 접속하여 자유롭게 이용할 수 있습니다.",
    shortDescription: "지도 위에 길고양이의 정보를 기록하고 공유하는 커뮤니티 앱입니다.",
    imageUrl: "/images/cat-map-app.jpg",
    detailImageUrl: "/images/cat-map-app-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/sangsu-cat-wiki",
    serviceUrl: "https://sangsu-cat-wiki.vercel.app/",
    techStack: ["Next.js", "Firebase", "Naver Maps API", "PWA"]
  },
  {
    id: "fitmeet",
    name: "운동커플 매칭앱",
    description: "FitMeet은 사용자의 위치, 주 종목, 나이 등을 기반으로 최적의 운동 파트너를 추천해 주는 PWA 기반 웹 애플리케이션입니다. 스와이프 기반 매칭(Tinder 스타일), 상호 매칭 시 채팅 가능, Firestore 기반 실시간 채팅 및 읽음 확인, FCM 푸시 알림, 관리자 대시보드 등을 제공합니다. 근육고양이 스튜디오에서 제공하는 무료 서비스이며 앱을 설치하거나 웹에 접속하여 자유롭게 이용할 수 있습니다.",
    shortDescription: "위치와 취향 기반의 운동 파트너 매칭앱입니다.",
    imageUrl: "/images/fitmeet.jpg",
    detailImageUrl: "/images/fitmeet_detail.jpg",
    githubUrl: "https://github.com/cutiefunny/fitmeet",
    serviceUrl: "https://fitmeet-theta.vercel.app/",
    techStack: ["SvelteKit", "Svelte", "Firebase", "PWA", "Swiper.js", "Vercel"]
  },
  {
    id: "stock-bot",
    name: "국장봇",
    description: "코스피 및 코스닥의 정보와 뉴스를 기반으로 잔소리를 해주는 봇입니다. 한국투자증권의 API와 네이버 검색을 활용하여 적절한 정보로 사용자를 조롱합니다. 근육고양이 스튜디오에서 제공하는 무료 서비스이며 앱을 설치하거나 웹에 접속하여 자유롭게 이용할 수 있습니다.",
    shortDescription: "코스피 및 코스닥의 정보와 뉴스를 기반으로 잔소리를 해주는 봇입니다.",
    imageUrl: "/images/stock-bot.jpg",
    detailImageUrl: "/images/stock-bot-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/stock-info",
    serviceUrl: "https://stock-info-smoky.vercel.app/",
    techStack: ["Next.js", "TypeScript", "Firebase", "PWA", "한국투자증권 Open API"]
  },
];

// 홈 페이지 슬라이더에 사용할 이미지 목록 (필요한 경우 projects 데이터에서 추출)
export const portfolioImageUrls = projects.map(p => p.imageUrl);