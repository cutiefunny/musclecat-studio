'use client';

import styles from './LoginModal.module.css';
import { auth } from '@/lib/firebase/clientApp';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useAuthStore from '@/store/authStore';

export default function LoginModal({ show, onClose }) {
  const setUser = useAuthStore((state) => state.setUser);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      onClose(); // 로그인 성공 시 모달 닫기
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>로그인</h2>
        <p>뉴스 작성을 위해 관리자 계정으로 로그인해주세요.</p>
        <button onClick={handleGoogleLogin} className={styles.loginButton}>
          Google 계정으로 로그인
        </button>
        <button onClick={onClose} className={styles.closeButton}>닫기</button>
      </div>
    </div>
  );
}