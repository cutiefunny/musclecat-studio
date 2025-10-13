'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const newsCollection = collection(db, 'news');
        const q = query(newsCollection, orderBy('timestamp', 'desc'), limit(3));
        const newsSnapshot = await getDocs(q);
        const newsList = newsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLatestNews(newsList);
      } catch (error) {
        console.error("최신 뉴스를 불러오는 중 오류 발생:", error);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className={styles.page}>
      <Image src="/images/title.png" alt="근육고양이 스튜디오" width={500} height={300} style={{ width: '350px', height: 'auto' }} />
      <div className={styles.buttonContainer}>
        <Link href="/news">
          <Image src="/images/news-button.png" alt="뉴스 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>

        {/* 최신 뉴스 표시 섹션 */}
        <div className={styles.latestNewsContainer}>
          {latestNews.length > 0 ? latestNews.map(news => (
            <Link href="/news" key={news.id} className={styles.newsItemLink}>
              <div className={styles.newsItem}>
                {news.imageUrl && (
                  <div className={styles.newsImageContainer}>
                    <Image
                      src={news.imageUrl}
                      alt="뉴스 이미지"
                      width={150}
                      height={150}
                      className={styles.newsImage}
                    />
                  </div>
                )}
                <div className={styles.newsContent}>
                    <p className={styles.newsText}>{news.text}</p>
                    <span className={styles.newsDate}>
                    {news.timestamp ? new Date(news.timestamp.toDate()).toLocaleDateString() : ''}
                    </span>
                </div>
              </div>
            </Link>
          )) : <p className={styles.noNews}>새로운 소식이 없습니다.</p>}
        </div>

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