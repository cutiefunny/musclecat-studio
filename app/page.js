// cutiefunny/musclecat-studio/musclecat-studio-9a81173fb6244becb85a7f9ae672a21081aa87cb/app/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from "./page.module.css";
import Image from 'next/image';
import { db } from '@/lib/firebase/clientApp';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';

// --- Swiper Import ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules'; // 필요한 모듈 import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// --- Swiper Import End ---

// --- 임시 데이터 (실제로는 별도 파일에서 import 권장) ---
// portfolio/page.js 에 있는 projects 데이터와 동일하게 유지해야 합니다.
const portfolioImages = [
  "/images/chatbot-builder.jpg",
  "/images/hybrid-chatbot.jpg",
  "/images/cleaning-app.png",
  "/images/shipping-app.png",
  "/images/hr-app.jpg",
  "/images/drug-test-app.jpg",
  "/images/video-call-app.jpg",
  "/images/cat-map-app.jpg",
  "/images/stock-bot.jpg",
];
// --- 임시 데이터 끝 ---


export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  // const [shuffledImages, setShuffledImages] = useState([]); // 기존 상태 제거 또는 주석 처리
  const [shuffledPortfolioImages, setShuffledPortfolioImages] = useState([]); // 슬라이더용 상태

  useEffect(() => {
    // --- 기존 이미지 셔플 로직 제거 또는 주석 처리 ---
    /*
    const imagePaths = [
      '/images/D1.png',
      '/images/D2.png',
      '/images/D3.png',
      '/images/D4.png',
    ];
    const shuffled = [...imagePaths].sort(() => Math.random() - 0.5);
    setShuffledImages(shuffled);
    */
    // --- 기존 이미지 셔플 로직 끝 ---

    // --- 포트폴리오 이미지 셔플 ---
    const shuffledPortfolios = [...portfolioImages].sort(() => Math.random() - 0.5);
    setShuffledPortfolioImages(shuffledPortfolios);
    // --- 포트폴리오 이미지 셔플 끝 ---

    // Fetch latest news (기존 코드 유지)
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

        {/* 최신 뉴스 표시 섹션 (기존 코드 유지) */}
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

        {/* --- 포트폴리오 이미지 슬라이더 추가 --- */}
        <div className={styles.portfolioSliderContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]} // 사용할 모듈 등록
            spaceBetween={10} // 슬라이드 간 간격
            slidesPerView={1} // 기본값 (모바일)
            loop={true} // 무한 루프
            autoplay={{ // 자동 넘김 설정
              delay: 3000,
              disableOnInteraction: false, // 사용자 인터랙션 후에도 자동 재생 유지
            }}
            pagination={{ clickable: true }} // 페이지네이션 (점)
            breakpoints={{ // 화면 크기별 설정
              // 640px 이상일 때
              640: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              // 1024px 이상일 때
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className={styles.portfolioSwiper} // 커스텀 스타일 적용을 위한 클래스
          >
            {shuffledPortfolioImages.map((imageUrl, index) => (
              <SwiperSlide key={index} className={styles.portfolioSlide}>
                <Image
                  src={imageUrl}
                  alt={`포트폴리오 이미지 ${index + 1}`}
                  width={300} // 슬라이드 이미지 크기 (조절 필요)
                  height={200} // 슬라이드 이미지 크기 (조절 필요)
                  className={styles.portfolioImage} // 이미지 스타일
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* --- 슬라이더 끝 --- */}

        <Link href="/contact">
          <Image src="/images/contact-button.png" alt="문의하기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>
        <div className={styles.infoItem}>
            {/* Mobile 텍스트 대신 아이콘 사용 */}
            <FaPhone className={styles.icon} />
            <a href="tel:010-8315-1379">010-8315-1379</a>
          </div>
          <div className={styles.infoItem}>
            {/* Email 텍스트 대신 아이콘 사용 */}
            <FaEnvelope className={styles.icon} />
            <a href="mailto:cutiefunny@naver.com">cutiefunny@naver.com</a>
          </div>
          <div className={styles.infoItem}>
            {/* Instagram 텍스트 대신 아이콘 사용 */}
            <FaInstagram className={styles.icon} />
            <a href="https://instagram.com/musclecat_mart" target="_blank" rel="noopener noreferrer">@musclecat_mart</a>
          </div>
      </div>
    </div>
  );
}