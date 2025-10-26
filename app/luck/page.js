// /app/luck/page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './luck.module.css';
import Image from 'next/image';

// KST 기준 현재 날짜 문자열 (YYYY-MM-DD) 반환 함수
const getCurrentDateKST = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kstOffset = 9 * 60 * 60 * 1000; // 한국 시간은 UTC+9
  const kstDate = new Date(utc + kstOffset);

  // 날짜가 바뀌는 기준을 00:01으로 설정 (자정 1분 후)
  // 만약 현재 시간이 00:00 이라면, 이전 날짜로 간주
  if (kstDate.getHours() === 0 && kstDate.getMinutes() === 0) {
      kstDate.setDate(kstDate.getDate() - 1);
  }

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function LuckPage() {
  const [fortune, setFortune] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFortune = async () => {
      setIsLoading(true);
      setError(null);
      const currentDate = getCurrentDateKST();
      let cachedData = null;

      // localStorage 접근은 클라이언트 측에서만 가능
      if (typeof window !== 'undefined') {
          try {
              const storedData = localStorage.getItem('dailyFortune');
              if (storedData) {
                  cachedData = JSON.parse(storedData);
              }
          } catch (e) {
              console.error("localStorage 읽기 오류:", e);
              // localStorage 접근 불가 시 캐싱 기능 비활성화
          }
      }

      if (cachedData && cachedData.date === currentDate && cachedData.fortune) {
        // 캐시된 데이터가 있고 날짜가 오늘이면 캐시된 운세 사용
        setFortune(cachedData.fortune);
        setIsLoading(false);
      } else {
        // 캐시가 없거나 날짜가 다르면 API 호출
        try {
          const response = await fetch('https://musclecat.co.kr/getOneFortune', {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ key: 'value' })
          });

          if (!response.ok) {
            throw new Error('API 호출에 실패했습니다.');
          }

          const data = await response.json();

          if (data.result === 'success' && data.fortune) {
            setFortune(data.fortune);
            // localStorage에 새 운세와 날짜 저장
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('dailyFortune', JSON.stringify({ fortune: data.fortune, date: currentDate }));
                } catch (e) {
                    console.error("localStorage 쓰기 오류:", e);
                }
            }
          } else {
            throw new Error('운세 정보를 받아오지 못했습니다.');
          }
        } catch (err) {
          console.error("운세 가져오기 오류:", err);
          setError(err.message || '운세를 불러오는 중 오류가 발생했습니다.');
          setFortune(''); // 오류 시 운세 초기화
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFortune();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

return (
    <div className={styles.pageContainer}>
        <div className={styles.page}>
            <header className={styles.header}>
                <Image
                    src="/images/luck-title.png"
                    alt="운세 타이틀"
                    width={250}
                    height={200}
                    style={{ height: 'auto' }}
                    className={styles.titleImage}
                />
            </header>
            <main className={styles.main}>
                {isLoading ? (
                    <p className={styles.loading}>운세를 불러오는 중...</p>
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.fortuneCard}>
                        <p className={styles.fortuneText}>{fortune}</p>
                    </div>
                )}
            </main>
        </div>
        <footer className={styles.footer}>
                <Image
                    src="/images/regist-number.png"
                    alt="등록 안내"
                    width={300}
                    height={200}
                    style={{ height: 'auto' }}
                    className={styles.titleImage}
                />
            </footer>
    </div>
);
}
