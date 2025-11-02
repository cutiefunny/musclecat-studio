// app/entertainment/page.js
import styles from './entertainment.module.css';
import Link from 'next/link';
import Image from 'next/image';
// ⬇️ (수정) data/entertainment.js 에서 직접 임포트
import { entertainmentItems } from '@/data/entertainment'; 

export default function Entertainment() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>엔터테인먼트</h1>
        <p>근육고양이 스튜디오의 즐거운 서비스들!</p>
      </header>

      <main className={styles.entertainmentGrid}>
        {/* ⬇️ (수정) 필터/맵 로직 제거, 바로 데이터 사용 */}
        {entertainmentItems.map((item) => (
          <Link key={item.id} href={item.link} className={styles.entertainmentCardLink} target="_blank" rel="noopener noreferrer">
            <div className={styles.entertainmentCard}>
              <div className={styles.imageContainer}>
                <Image 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className={styles.entertainmentImage}
                  fill 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 250px"
                  priority={item.id === 'luck'}
                />
              </div>
              <h3>{item.name}</h3>
              <p className={styles.entertainmentDescription}>{item.description}</p>
              <button className={styles.serviceButton}>바로가기</button>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}