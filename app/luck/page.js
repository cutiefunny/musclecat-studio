// /app/luck/page.js
'use client';

import { useState, useEffect } from 'react';
import styles from './luck.module.css';
import Image from 'next/image';
// Firestore 관련 함수 추가 (doc, deleteDoc 추가)
import { db } from '@/lib/firebase/clientApp';
import { collection, addDoc, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
// Modal Store import 추가
import useModalStore from '@/store/modalStore';

// KST 기준 현재 날짜 문자열 (YYYY-MM-DD) 반환 함수
const getCurrentDateKST = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
  const kstOffset = 9 * 60 * 60 * 1000; // 한국 시간은 UTC+9
  const kstDate = new Date(utc + kstOffset);

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // isRegistering -> isProcessing 이름 변경 (등록/삭제 모두 처리)
  const showModal = useModalStore((state) => state.showModal);

  useEffect(() => {
    // 운세 로딩 로직 (이전과 동일)
    const fetchFortune = async () => {
      setIsLoading(true);
      setError(null);
      const currentDate = getCurrentDateKST();
      let cachedData = null;
      if (typeof window !== 'undefined') {
          try {
              const storedData = localStorage.getItem('dailyFortune');
              if (storedData) cachedData = JSON.parse(storedData);
          } catch (e) { console.error("localStorage 읽기 오류:", e); }
      }
      if (cachedData && cachedData.date === currentDate && cachedData.fortune) {
        setFortune(cachedData.fortune);
        setIsLoading(false);
      } else {
        try {
          const response = await fetch('https://musclecat.co.kr/getOneFortune', { method: 'POST' });
          if (!response.ok) throw new Error('API 호출 실패');
          const data = await response.json();
          if (data.result === 'success' && data.fortune) {
            setFortune(data.fortune);
            if (typeof window !== 'undefined') {
                try { localStorage.setItem('dailyFortune', JSON.stringify({ fortune: data.fortune, date: currentDate })); }
                catch (e) { console.error("localStorage 쓰기 오류:", e); }
            }
          } else { throw new Error('운세 정보 못 받아옴'); }
        } catch (err) {
          console.error("운세 가져오기 오류:", err);
          setError(err.message || '운세 로딩 오류');
          setFortune('');
        } finally { setIsLoading(false); }
      }
    };
    fetchFortune();
  }, []);

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const filteredValue = value.replace(/[^0-9-]/g, '');
    setPhoneNumber(filteredValue);
  };

  // 전화번호 등록/해제 핸들러
  const handleRegister = async () => {
    if (isProcessing || !phoneNumber.trim()) return;

    const cleanedPhoneNumber = phoneNumber.replace(/-/g, '');

    if (!/^\d{10,11}$/.test(cleanedPhoneNumber)) {
        showModal('alert', { message: '올바른 전화번호 형식이 아닙니다.' });
        return;
    }

    // --- 수정: Confirm 모달 표시 전에 로딩 상태 설정하지 않음 ---
    // setIsProcessing(true);
    setError(null);

    try {
        const membersRef = collection(db, 'luckMembers');
        const q = query(membersRef, where('phone', '==', cleanedPhoneNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // --- 수정: 이미 등록된 경우 -> 해제 Confirm 모달 ---
            const docToDelete = querySnapshot.docs[0]; // 삭제할 문서 정보 가져오기
            showModal('confirm', {
                message: '이미 등록된 번호입니다.\n등록을 해제하시겠습니까?',
                onConfirm: async () => {
                    // --- 확인 버튼 클릭 시 삭제 로직 ---
                    setIsProcessing(true); // 실제 삭제 시작
                    setError(null);
                    try {
                        await deleteDoc(doc(db, 'luckMembers', docToDelete.id));
                        showModal('alert', { message: '등록이 해제되었습니다.' });
                        setPhoneNumber(''); // 입력 필드 초기화
                    } catch (deleteErr) {
                        console.error("등록 해제 오류:", deleteErr);
                        setError('해제 중 오류가 발생했습니다.');
                        showModal('alert', { message: '등록 해제 중 오류가 발생했습니다.' });
                    } finally {
                        setIsProcessing(false); // 삭제 완료
                    }
                    // --- 삭제 로직 끝 ---
                }
                // onCancel 시 특별한 동작 없음
            });
            // --- 해제 Confirm 모달 로직 끝 ---
        } else {
            // --- 수정: 새 번호 등록 -> 심사 안내 Confirm 모달 (기존 로직 유지) ---
            showModal('confirm', {
                message: '현재는 알림톡 심사중이므로 하루 또는\n이틀 뒤부터 운세톡이 발송됩니다!\n등록하시겠습니까?',
                onConfirm: async () => {
                    // --- 확인 버튼 클릭 시 등록 로직 ---
                    setIsProcessing(true); // 실제 등록 시작
                    setError(null);
                    try {
                        await addDoc(membersRef, {
                            phone: cleanedPhoneNumber,
                            registeredAt: new Date()
                        });
                        showModal('alert', { message: '잘 등록되었다!' }); // 성공 메시지 수정됨
                        setPhoneNumber('');
                    } catch (addErr) {
                        console.error("신규 등록 오류:", addErr);
                        setError('등록 중 오류가 발생했습니다.');
                        showModal('alert', { message: '등록 중 오류가 발생했습니다.' });
                    } finally {
                        setIsProcessing(false); // 등록 완료
                    }
                    // --- 등록 로직 끝 ---
                }
            });
            // --- 심사 안내 Confirm 모달 로직 끝 ---
        }
    } catch (err) {
      // 이 catch는 주로 getDocs에서 발생하는 오류를 처리
      console.error(" Firestore 조회 오류:", err);
      setError('번호 확인 중 오류가 발생했습니다.');
      showModal('alert', { message: '번호 확인 중 오류가 발생했습니다.' });
      // setIsProcessing(false); // Confirm 모달 전 로딩 상태 설정 안했으므로 필요 없음
    }
    // finally 블록 제거 (각 Confirm 모달의 onConfirm 내부 finally에서 처리)
  };

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
                {isLoading && !fortune && !error ? (
                    <p className={styles.loading}>운세를 불러오는 중...</p>
                ) : error && !fortune ? (
                    <p className={styles.error}>{error}</p>
                ) : (
                    <div className={styles.fortuneCard}>
                        <p className={styles.fortuneText}>{fortune}</p>
                    </div>
                )}
                {/* isProcessing 중 에러 메시지 표시 */}
                {error && <p className={styles.error}>{error}</p>}
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
            {/* 전화번호 등록 섹션 */}
            <div className={styles.registerContainer}>
                <input
                    type="tel"
                    className={styles.phoneInput}
                    placeholder="숫자만 입력"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    disabled={isProcessing} // isRegistering -> isProcessing
                />
                <Image
                    src="/images/regist-button.png"
                    alt={isProcessing ? '처리 중...' : '등록하기'} // isRegistering -> isProcessing
                    width={70}
                    height={40}
                    style={{ height: 'auto' }}
                    onClick={handleRegister}
                    // className 수정: isProcessing 상태로 비활성화 제어
                    className={`${styles.registerImageButton} ${isProcessing ? styles.disabledButton : ''}`}
                    priority
                />
            </div>
            {/* 등록 섹션 끝 */}
        </footer>
    </div>
);
}