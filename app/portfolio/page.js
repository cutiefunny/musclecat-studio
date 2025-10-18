// cutiefunny/musclecat-studio/musclecat-studio-9a81173fb6244becb85a7f9ae672a21081aa87cb/app/portfolio/page.js
import styles from "./portfolio.module.css";
import Image from 'next/image';
import Link from 'next/link'; // Link 컴포넌트 import

// 각 프로젝트에 id, githubUrl, serviceUrl, techStack 추가
const projects = [
  {
    id: "chatbot-builder", // URL 경로로 사용할 고유 ID
    name: "챗봇 시나리오 빌더",
    description: "드래그 앤 드롭 방식으로 챗봇의 대화 흐름을 시각적으로 설계하는 도구입니다.",
    imageUrl: "/images/chatbot-builder.jpg",
    githubUrl: "https://github.com/example/chatbot-builder", // 예시 URL
    serviceUrl: "https://example-service.com/chatbot-builder", // 예시 URL
    techStack: ["React", "Node.js", "Firebase", "TypeScript"] // 예시 기술 스택
  },
  {
    id: "hybrid-chatbot",
    name: "하이브리드 챗봇",
    description: "자연어 처리 기술과 시나리오 기반 응답을 결합한 지능형 챗봇입니다.",
    imageUrl: "/images/hybrid-chatbot.jpg",
    githubUrl: "https://github.com/example/hybrid-chatbot",
    serviceUrl: null, // 실제 서비스가 없는 경우 null
    techStack: ["Python", "Flask", "React", "Docker"]
  },
  {
    id: "cleaning-app",
    name: "청소중개앱",
    description: "청소 서비스를 필요로 하는 사용자와 청소 업체를 연결하는 중개 플랫폼입니다.",
    imageUrl: "/images/cleaning-app.png",
    githubUrl: "https://github.com/example/cleaning-app",
    serviceUrl: "https://example-service.com/cleaning-app",
    techStack: ["React Native", "Firebase", "Node.js"]
  },
  {
    id: "shipping-app",
    name: "선박물 거래앱",
    description: "컨테이너 선박물을 거래하는 온라인 마켓플레이스입니다.",
    imageUrl: "/images/shipping-app.png",
    githubUrl: "https://github.com/example/shipping-app",
    serviceUrl: null,
    techStack: ["Flutter", "Firebase", "Dart"]
  },
  {
    id: "hr-app",
    name: "인사관리앱",
    description: "직원 정보, 급여, 휴가 등 인사 관련 업무를 효율적으로 관리하는 시스템입니다.",
    imageUrl: "/images/hr-app.jpg",
    githubUrl: "https://github.com/example/hr-app",
    serviceUrl: null,
    techStack: ["React", "Spring Boot", "MySQL", "AWS"]
  },
  {
    id: "drug-test-app",
    name: "마약검사앱",
    description: "마약 검사 결과를 기록하고 관리하는 모바일 애플리케이션입니다.",
    imageUrl: "/images/drug-test-app.jpg",
    githubUrl: "https://github.com/example/drug-test-app",
    serviceUrl: null,
    techStack: ["Android (Java)", "Firebase"]
  },
  {
    id: "video-call-app",
    name: "화상통화앱",
    description: "실시간 영상 통화를 통해 원활한 커뮤니케이션을 지원하는 화상 통화 솔루션입니다.",
    imageUrl: "/images/video-call-app.jpg",
    githubUrl: "https://github.com/example/video-call-app",
    serviceUrl: null,
    techStack: ["WebRTC", "Node.js", "Socket.IO", "React"]
  },
  {
    id: "cat-map-app",
    name: "지도 기반 길냥이 도감 앱",
    description: "지도 위에 길고양이의 정보를 기록하고 공유하는 커뮤니티 앱입니다.",
    imageUrl: "/images/cat-map-app.jpg",
    githubUrl: "https://github.com/example/cat-map-app",
    serviceUrl: "https://example-service.com/cat-map-app",
    techStack: ["React Native", "Firebase", "Naver Maps API"]
  },
  {
    id: "stock-bot",
    name: "국장봇",
    description: "코스피 및 코스닥의 정보와 뉴스를 기반으로 잔소리를 해주는 봇입니다.",
    imageUrl: "/images/stock-bot.jpg",
    githubUrl: "https://github.com/example/stock-bot",
    serviceUrl: null,
    techStack: ["Python", "Telegram Bot API", "BeautifulSoup"]
  },
];

export default function Portfolio() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>포트폴리오</h1>
        <p>근육고양이 스튜디오에서 진행한 프로젝트들을 소개합니다.</p>
      </header>
      <main className={styles.portfolioGrid}>
        {projects.map((project) => (
          // Link 컴포넌트로 projectCard 감싸기
          <Link key={project.id} href={`/portfolio/${project.id}`} className={styles.projectCardLink}>
            <div className={styles.projectCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={project.imageUrl}
                  alt={`${project.name} 스크린샷`}
                  width={300}
                  height={200}
                  className={styles.projectImage}
                />
              </div>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

// CSS 모듈에 Link 스타일 추가 (선택 사항)
/*
.projectCardLink {
  text-decoration: none;
  color: inherit;
}
*/