// cutiefunny/musclecat-studio/musclecat-studio-1e58aa6ff05d2d0c24e0d313fcd9602693ca1d8a/app/page.js
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
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// --- Swiper Import End ---

// --- 데이터 Import ---
import { portfolioImageUrls } from '@/data/projects'; // 분리된 데이터에서 이미지 URL 목록 가져오기
import { goodsItems as allGoodsItems } from '@/data/goods'; // 굿즈 데이터 가져오기
// --- 데이터 Import End ---


export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [shuffledPortfolioImages, setShuffledPortfolioImages] = useState([]);
  const [latestGoods, setLatestGoods] = useState([]); // 최신 굿즈 상태 추가

  useEffect(() => {
    // --- 포트폴리오 이미지 셔플 ---
    const shuffledPortfolios = [...portfolioImageUrls].sort(() => Math.random() - 0.5);
    setShuffledPortfolioImages(shuffledPortfolios);

    // --- 최신 굿즈 설정 (상위 3개) ---
    setLatestGoods(allGoodsItems.slice(0, 3)); // goods 데이터에서 처음 3개 항목 가져오기

    // Fetch latest news
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
  }, []); // 빈 배열을 두어 마운트 시 한 번만 실행되도록 함

  return (
    <div className={styles.page}>
      {/* 타이틀 이미지 */}
      <Image src="/images/title.png" alt="근육고양이 스튜디오" width={500} height={300} style={{ width: '350px', height: 'auto' }} priority />

      <div className={styles.buttonContainer}>
        {/* 뉴스 버튼 */}
        <Link href="/news">
          <Image src="/images/news-button.png" alt="뉴스 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>

        {/* 최신 뉴스 표시 */}
        <div className={styles.latestNewsContainer}>
          {latestNews.length > 0 ? latestNews.map(news => (
            <Link href={`/news#${news.id}`} key={news.id} className={styles.newsItemLink}>
              <div className={styles.newsItem}>
                {news.imageUrl && (
                  <div className={styles.newsImageContainer}>
                    <Image
                      src={news.imageUrl}
                      alt="뉴스 이미지"
                      width={300}
                      height={300}
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

        {/* 포트폴리오 버튼 */}
        <Link href="/portfolio">
          <Image src="/images/portfolio-button.png" alt="포트폴리오 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>

        {/* 포트폴리오 이미지 슬라이더 */}
        <div className={styles.portfolioSliderContainer}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
            className={styles.portfolioSwiper}
          >
            {shuffledPortfolioImages.map((imageUrl, index) => (
              <SwiperSlide key={index} className={styles.portfolioSlide}>
                <Image
                  src={imageUrl}
                  alt={`포트폴리오 이미지 ${index + 1}`}
                  width={300}
                  height={200}
                  className={styles.portfolioImage}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 굿즈 버튼 */}
        <Link href="/goods">
          <Image src="/images/goods-button.png" alt="굿즈 보러가기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>

        {/* --- ⬇️ ADDED: 최신 굿즈 표시 섹션 추가 --- */}
        <div className={styles.latestGoodsContainer}>
          {latestGoods.length > 0 ? latestGoods.map(item => (
            <Link href={item.link} key={item.id} className={styles.goodsItemLink} target="_blank" rel="noopener noreferrer">
              <div className={styles.goodsItem}>
                {item.imageUrl && (
                  <div className={styles.goodsImageContainer}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={300} // 레이아웃 확보용
                      height={300} // 레이아웃 확보용
                      className={styles.goodsImage}
                    />
                  </div>
                )}
                <div className={styles.goodsContent}>
                  <h4 className={styles.goodsName}>{item.name}</h4> {/* 상품명 추가 */}
                  <p className={styles.goodsPrice}>{item.price}</p>
                </div>
              </div>
            </Link>
          )) : <p className={styles.noGoods}>판매 중인 상품이 없습니다.</p>}
        </div>
        {/* --- 최신 굿즈 표시 섹션 끝 --- */}

        {/* 문의하기 버튼 */}
        <Link href="/contact">
          <Image src="/images/contact-button.png" alt="문의하기" width={200} height={80} style={{ width: 'auto', height: '50px' }} />
        </Link>

        {/* 연락처 정보 */}
        <div className={styles.contactInfoHome}>
          <div className={styles.infoItem}>
              <FaPhone className={styles.icon} />
              <a href="tel:010-8315-1379">010-8315-1379</a>
            </div>
            <div className={styles.infoItem}>
              <FaEnvelope className={styles.icon} />
              <a href="mailto:cutiefunny@naver.com">cutiefunny@naver.com</a>
            </div>
            <div className={styles.infoItem}>
              <FaInstagram className={styles.icon} />
              <a href="https://instagram.com/musclecat_mart" target="_blank" rel="noopener noreferrer">@musclecat_mart</a>
            </div>
        </div>
      </div>
    </div>
  );
}