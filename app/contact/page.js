// cutiefunny/musclecat-studio/musclecat-studio-9a81173fb6244becb85a7f9ae672a21081aa87cb/app/contact/page.js
import styles from './contact.module.css';
// react-icons import 추가
import { FaPhone, FaEnvelope, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Contact</h1> {/* 영어로 변경됨 */}
        {/* 설명이 필요하다면 다시 추가하세요 */}
      </header>
      <main className={styles.main}>
        {/* 연락처 정보 섹션 */}
        <section className={styles.contactInfo}>
          <h2>Contact Information</h2> {/* 영어로 변경됨 */}
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
        </section>

        <form className={styles.contactForm}>
          <h2>Contact Form</h2> {/* 영어로 변경됨 */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label> {/* 영어로 변경됨 */}
            <input type="text" id="name" name="name" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label> {/* 영어로 변경됨 */}
            <input type="email" id="email" name="email" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label> {/* 영어로 변경됨 */}
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          <button type="submit" className={styles.submitButton}>Send</button> {/* 영어로 변경됨 */}
        </form>
      </main>
    </div>
  );
}