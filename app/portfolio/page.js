import styles from "./portfolio.module.css";
import Image from 'next/image';

export default function Portfolio() {
  const projects = [
    {
      name: "챗봇 시나리오 빌더",
      description: "드래그 앤 드롭 방식으로 챗봇의 대화 흐름을 시각적으로 설계하는 도구입니다.",
      imageUrl: "/images/chatbot-builder.jpg", // 예시 이미지 경로
    },
    {
      name: "하이브리드 챗봇",
      description: "자연어 처리 기술과 시나리오 기반 응답을 결합한 지능형 챗봇입니다.",
      imageUrl: "/images/hybrid-chatbot.jpg", // 예시 이미지 경로
    },
    {
      name: "청소중개앱",
      description: "청소 서비스를 필요로 하는 사용자와 청소 업체를 연결하는 중개 플랫폼입니다.",
      imageUrl: "/images/cleaning-app.png", // 예시 이미지 경로
    },
    {
      name: "선박물 거래앱",
      description: "컨테이너 선박물을 거래하는 온라인 마켓플레이스입니다.",
      imageUrl: "/images/shipping-app.png", // 예시 이미지 경로
    },
    {
      name: "인사관리앱",
      description: "직원 정보, 급여, 휴가 등 인사 관련 업무를 효율적으로 관리하는 시스템입니다.",
      imageUrl: "/images/hr-app.jpg", // 예시 이미지 경로
    },
    {
      name: "마약검사앱",
      description: "마약 검사 결과를 기록하고 관리하는 모바일 애플리케이션입니다.",
      imageUrl: "/images/drug-test-app.jpg", // 예시 이미지 경로
    },
    {
      name: "화상통화앱",
      description: "실시간 영상 통화를 통해 원활한 커뮤니케이션을 지원하는 화상 통화 솔루션입니다.",
      imageUrl: "/images/video-call-app.jpg", // 예시 이미지 경로
    },
    {
        name: "지도 기반 길냥이 도감 앱",
        description: "지도 위에 길고양이의 정보를 기록하고 공유하는 커뮤니티 앱입니다.",
        imageUrl: "/images/cat-map-app.jpg", // 예시 이미지 경로
    },
    {
        name: "국장봇",
        description: "코스피 및 코스닥의 정보와 뉴스를 기반으로 잔소리를 해주는 봇입니다.",
        imageUrl: "/images/stock-bot.jpg", // 예시 이미지 경로
    },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>포트폴리오</h1>
        <p>근육고양이 스튜디오에서 진행한 프로젝트들을 소개합니다.</p>
      </header>
      <main className={styles.portfolioGrid}>
        {projects.map((project, index) => (
          <div key={index} className={styles.projectCard}>
            <div className={styles.imageContainer}>
                {/* 이미지가 준비되면 아래 Image 컴포넌트의 주석을 해제하고 src 경로를 알맞게 수정해주세요. */}
                <Image
                    src={project.imageUrl}
                    alt={`${project.name} 스크린샷`}
                    width={300}
                    height={200}
                    className={styles.projectImage}
                />
                {/* <div className={styles.placeholderImage}>Image</div> */}
            </div>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </main>
    </div>
  );
}