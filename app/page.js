import Link from 'next/link';
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>근육고양이 스튜디오</h1>
      <Link href="/portfolio" className={styles.portfolioLink}>
        포트폴리오 보러가기
      </Link>
    </div>
  );
}