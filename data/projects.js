// /data/projects.js
export const projects = [
  {
    id: "chatbot-builder",
    name: "챗봇 시나리오 빌더",
    description: "React Flow 라이브러리를 활용하여 만든 챗봇 시나리오 에디터입니다. 드래그 앤 드롭 인터페이스를 통해 노드를 연결하여 챗봇의 대화 흐름을 시각적으로 설계하고 관리할 수 있습니다. 2026년에 싸이버로지텍에 납품 예정입니다.",
    shortDescription: "드래그 앤 드롭 방식으로 챗봇의 대화 흐름을 시각적으로 설계하는 도구입니다.", // portfolio/page.js용 짧은 설명 추가
    imageUrl: "/images/chatbot-builder.jpg",
    detailImageUrl: "/images/chatbot-builder.jpg", // 상세 페이지용 이미지 URL (동일하면 동일하게)
    githubUrl: "https://github.com/cutiefunny/react-flow",
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
    githubUrl: "https://github.com/cutiefunny/clt-chatbot",
    serviceUrl: null,
    techStack: ["Next.js", "TypeScript", "Firebase", /* ... 확인 필요 ... */ ]
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
    serviceUrl: "https://live-cam-eta.vercel.app/",
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
  {
    id: "luck",
    name: "근육고양이 운세톡",
    description: "사용자의 카카오톡으로 매일 아침 운세를 보내주는 서비스입니다. 근육고양이 스튜디오에서 제공하는 무료 서비스이며, 간단한 번호 등록으로 이용 가능합니다.",
    shortDescription: "사용자의 카카오톡으로 매일 아침 운세를 보내주는 서비스입니다.",
    imageUrl: "/images/luck-title.png",
    detailImageUrl: "/images/luck-detail.jpg",
    githubUrl: "https://github.com/cutiefunny/musclecat-studio",
    serviceUrl: "https://musclecat-studio.com/luck",
    techStack: ["node.js","Firebase","Solapi"]
  },
];

// 홈 페이지 슬라이더에 사용할 이미지 목록 (필요한 경우 projects 데이터에서 추출)
export const portfolioImageUrls = projects.map(p => p.imageUrl);