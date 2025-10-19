// cutiefunny/musclecat-studio/musclecat-studio-69b8328c83a86b17efd454da2083bf135e4c6a70/app/portfolio/page.js
import styles from "./portfolio.module.css";
import Image from 'next/image';
import Link from 'next/link';
import { projects } from '@/data/projects'; // 데이터 import

export default function Portfolio() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>포트폴리오</h1>
        <p>근육고양이 스튜디오에서 진행한 프로젝트들을 소개합니다.</p>
      </header>
      <main className={styles.portfolioGrid}>
        {projects.map((project) => (
          <Link key={project.id} href={`/portfolio/${project.id}`} className={styles.projectCardLink}>
            <div className={styles.projectCard}>
              <div className={styles.imageContainer}>
                <Image
                  src={project.imageUrl} // 목록 페이지용 이미지 사용
                  alt={`${project.name} 스크린샷`}
                  width={300}
                  height={200}
                  className={styles.projectImage}
                />
              </div>
              <h3>{project.name}</h3>
              {/* 짧은 설명 사용 */}
              <p>{project.shortDescription || project.description}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}