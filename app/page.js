import Link from 'next/link';
import styles from "./page.module.css";
import Image from 'next/image';

export default function Home() {
  return (
    <div className={styles.page}>
      <Image src="/images/title.png" alt="근육고양이 스튜디오" width={500} height={300} style={{ width: '350px', height: 'auto' }} />
        <div className={styles.buttonContainer}>
          <Link href="/news">
            <Image src="/images/news-button.png" alt="뉴스 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
          </Link>
          <Link href="/portfolio">
            <Image src="/images/portfolio-button.png" alt="포트폴리오 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
          </Link>
          <Link href="/contact">
            <Image src="/images/contact-button.png" alt="문의하기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
          </Link>
        </div>
    </div>
  );
}