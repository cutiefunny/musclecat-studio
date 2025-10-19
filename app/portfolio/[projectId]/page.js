// cutiefunny/musclecat-studio/musclecat-studio-69b8328c83a86b17efd454da2083bf135e4c6a70/app/portfolio/[projectId]/page.js
import styles from "../portfolio.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects'; // 데이터 import

// 페이지 컴포넌트 정의
export default function ProjectDetail({ params }) {
  const { projectId } = params;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    // 간단한 Not Found 처리 또는 Next.js의 notFound() 사용 고려
    return <div className={styles.page}><h1>프로젝트를 찾을 수 없습니다.</h1></div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{project.name}</h1>
      </header>
      <main className={styles.projectDetailMain}>
        <div className={styles.projectImageContainer}>
          <Image
            // 상세 페이지용 이미지 사용 (없으면 기본 imageUrl)
            src={project.detailImageUrl || project.imageUrl}
            alt={`${project.name} 상세 이미지`}
            width={600}
            height={400}
            className={styles.projectImage}
            priority // LCP(Largest Contentful Paint) 개선을 위해 추가 고려
          />
        </div>
        <div className={styles.projectInfo}>
          <h2>프로젝트 설명</h2>
          {/* 상세 설명 사용 */}
          <p>{project.description}</p>

          <h2>기술 스택</h2>
          {project.techStack && project.techStack.length > 0 ? (
            <ul className={styles.techStackList}>
              {project.techStack.map((tech, index) => (
                <li key={index} className={styles.techStackItem}>{tech}</li>
              ))}
            </ul>
          ) : (
            <p>기술 스택 정보가 없습니다.</p>
          )}


          <h2>링크</h2>
          <div className={styles.projectLinks}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLinkButton}>
                GitHub 저장소
              </a>
            )}
            {project.serviceUrl && (
              <a href={project.serviceUrl} target="_blank" rel="noopener noreferrer" className={styles.projectLinkButton}>
                서비스 바로가기
              </a>
            )}
            {!project.githubUrl && !project.serviceUrl && (
              <p>관련 링크가 없습니다.</p>
            )}
          </div>
        </div>
         <Link href="/portfolio" className={styles.backLink}>
            목록으로 돌아가기
          </Link>
      </main>
    </div>
  );
}

// generateStaticParams는 projects 데이터를 사용하도록 수정
export async function generateStaticParams() {
  return projects.map((project) => ({
    projectId: project.id,
  }));
}

// generateMetadata 추가 (SEO 개선)
export async function generateMetadata({ params }) {
  const { projectId } = params;
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return {
      title: '프로젝트를 찾을 수 없음',
    }
  }

  return {
    title: `${project.name} | 근육고양이 스튜디오 포트폴리오`,
    description: project.shortDescription || project.description.substring(0, 150), // 짧은 설명 또는 상세 설명 일부
    openGraph: {
      title: `${project.name} | 근육고양이 스튜디오 포트폴리오`,
      description: project.shortDescription || project.description.substring(0, 150),
      images: [
        {
          url: project.detailImageUrl || project.imageUrl, // 대표 이미지
          width: 600, // 이미지 크기 지정 (선택 사항)
          height: 400,
        },
      ],
    },
  }
}